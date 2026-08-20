import GitHubConnection from "../models/GitHubConnection.js";
import Project from "../models/Project.js";
import RepositorySnapshot from "../models/RepositorySnapshot.js";
import CodebaseIndex from "../models/CodebaseIndex.js";
import { decryptSecret } from "../utils/secretBox.js";
import { indexRepository } from "../services/codebaseService.js";

const getProject = (userId, projectId) =>
  Project.findOne({
    _id: projectId,
    $or: [{ owner: userId }, { members: userId }],
  });

/**
 * Make authenticated GitHub API request
 */
const githubFetch = async (url, token) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  let data;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error(data?.message || "GitHub request failed.");

    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
};

/**
 * GitHub returns 409 for several endpoints
 * when a repository has no commits yet.
 *
 * Syncora treats those as empty data instead
 * of considering the entire sync a failure.
 */
const githubFetchAllowEmpty = async (url, token, fallback) => {
  try {
    return await githubFetch(url, token);
  } catch (error) {
    if (error.status === 409 && error.message === "Git Repository is empty.") {
      return fallback;
    }

    throw error;
  }
};

/**
 * Detect useful files from repository tree.
 *
 * This is intentionally broad enough to support
 * the next Technology Detection phase.
 */
const getImportantFiles = (tree = []) => {
  const importantPatterns = [
    /^README(\.md)?$/i,
    /(^|\/)package\.json$/i,
    /(^|\/)package-lock\.json$/i,
    /(^|\/)yarn\.lock$/i,
    /(^|\/)pnpm-lock\.yaml$/i,
    /(^|\/)requirements\.txt$/i,
    /(^|\/)pyproject\.toml$/i,
    /(^|\/)Pipfile$/i,
    /(^|\/)go\.mod$/i,
    /(^|\/)Cargo\.toml$/i,
    /(^|\/)pom\.xml$/i,
    /(^|\/)build\.gradle$/i,
    /(^|\/)Dockerfile$/i,
    /(^|\/)docker-compose\.ya?ml$/i,
    /(^|\/)\.env\.example$/i,
    /(^|\/)vite\.config\./i,
    /(^|\/)next\.config\./i,
    /(^|\/)angular\.json$/i,
    /(^|\/)tsconfig\.json$/i,
    /(^|\/)webpack\.config\./i,
    /(^|\/)src\/app/i,
    /(^|\/)src\/main/i,
    /(^|\/)src\/index/i,
    /(^|\/)server/i,
    /(^|\/)routes\//i,
    /(^|\/)controllers\//i,
    /(^|\/)models\//i,
    /(^|\/)middleware\//i,
    /(^|\/)api\//i,
    /(^|\/)tests?\//i,
    /(^|\/)__tests__\//i,
  ];

  return tree
    .filter((item) => item.type === "blob")
    .filter((item) =>
      importantPatterns.some((pattern) => pattern.test(item.path)),
    )
    .slice(0, 200)
    .map((item) => ({
      path: item.path,
      sha: item.sha,
      size: item.size || 0,
    }));
};

const getRepositoryFiles = (tree = []) =>
  tree
    .filter((item) => item.type === "blob")
    .slice(0, 5000)
    .map((item) => ({
      path: item.path,
      sha: item.sha,
      size: item.size || 0,
      type: "file",
    }));

const getRepositoryFolders = (tree = []) =>
  tree.filter((item) => item.type === "tree").length;

/**
 * Convert GitHub data into the initial Syncora
 * repository snapshot.
 */
const buildSnapshotData = ({
  project,
  metadata,
  tree,
  commits,
  issues,
  pullRequests,
}) => {
  const importantFiles = getImportantFiles(tree?.tree || []);
  const repositoryFiles = getRepositoryFiles(tree?.tree || []);
  const repositoryFolders = getRepositoryFolders(tree?.tree || []);
  const latestCommit = commits?.[0]
    ? {
        sha: commits[0].sha,
        message: commits[0].commit?.message || "",
        author:
          commits[0].commit?.author?.name ||
          commits[0].author?.login ||
          "",
        date: commits[0].commit?.author?.date || null,
        url: commits[0].html_url,
      }
    : null;

  const normalizedIssues = (issues || [])
    .filter((item) => !item.pull_request)
    .map((item) => ({
      number: item.number,
      title: item.title,
      state: item.state,
      url: item.html_url,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    }));

  const normalizedPullRequests = (pullRequests || []).map((item) => ({
    number: item.number,
    title: item.title,
    state: item.state,
    url: item.html_url,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  }));

  const normalizedCommits = (commits || []).map((item) => ({
    sha: item.sha,
    message: item.commit?.message || "",
    author: item.commit?.author?.name || item.author?.login || "",
    date: item.commit?.author?.date || null,
    url: item.html_url,
  }));

  return {
    project: project._id,

    // This will later be replaced/expanded
    // when Engineering Context is generated.
    commitSha: commits?.[0]?.sha || null,
    fileCount: tree?.tree?.filter((item) => item.type === "blob").length || 0,
    folderCount: repositoryFolders,
    importantFiles,
    commit: latestCommit,

    metadata: {
      id: metadata.id,
      name: metadata.name,
      fullName: metadata.full_name,
      description: metadata.description || "",
      language: metadata.language || null,
      defaultBranch: metadata.default_branch || project.github.branch || "main",
      stars: metadata.stargazers_count || 0,
      forks: metadata.forks_count || 0,
      watchers: metadata.watchers_count || 0,
      isPrivate: metadata.private || false,
      htmlUrl: metadata.html_url,
      size: metadata.size || 0,
      createdAt: metadata.created_at,
      updatedAt: metadata.updated_at,
      pushedAt: metadata.pushed_at,
    },

    files: repositoryFiles,

    commits: normalizedCommits,

    issues: normalizedIssues,

    pullRequests: normalizedPullRequests,

    status: "synced",
    error: "",
    syncedAt: new Date(),
  };
};

/**
 * Sync connected GitHub repository
 */
export const syncRepository = async (req, res) => {
  let snapshot = null;
  let project = null;
  let connection = null;

  try {
    project = await getProject(req.user._id, req.params.projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    if (!project.github?.connected) {
      return res.status(400).json({
        success: false,
        message: "Connect a GitHub repository before syncing.",
      });
    }

    /**
     * Prevent unnecessary GitHub API calls.
     * Cache sync results for 5 minutes.
     */
    const existing = await RepositorySnapshot.findOne({
      project: project._id,
    });

    if (
      existing?.status === "synced" &&
      existing?.syncedAt &&
      Date.now() - existing.syncedAt.getTime() < 5 * 60 * 1000
    ) {
      const existingIndex = await CodebaseIndex.findOne({
        project: project._id,
        repositorySnapshot: existing._id,
        status: "ready",
      });

      if (existingIndex) {
        return res.status(200).json({
          success: true,
          cached: true,
          message: "Repository was already synced recently.",
          snapshot: existing,
          codebaseIndex: {
            indexed: true,
            fileCount: existingIndex.fileCount,
            chunkCount: existingIndex.chunkCount,
          },
        });
      }
    }

    /**
     * The GitHub connection belongs to the project owner.
     * This allows project members to sync the project
     * using the owner's authorized GitHub connection.
     */
    connection = await GitHubConnection.findOne({
      user: project.github.connectedBy || project.owner,
    }).select("+encryptedAccessToken +iv +authTag");

    if (!connection) {
      return res.status(400).json({
        success: false,
        message: "GitHub connection not found for this project.",
      });
    }

    const token = decryptSecret({
      encrypted: connection.encryptedAccessToken,
      iv: connection.iv,
      authTag: connection.authTag,
    });

    /**
     * Create a syncing snapshot first.
     *
     * This gives the frontend a persistent status
     * while the repository is being processed.
     */
    snapshot = await RepositorySnapshot.findOneAndUpdate(
      { project: project._id },
      {
        project: project._id,
        status: "syncing",
        error: "",
      },
      {
        upsert: true,
        returnDocument: "after",
        setDefaultsOnInsert: true,
      },
    );

    let codebaseIndex = null;
    try {
      codebaseIndex = await indexRepository({
        project,
        snapshot,
        connection,
      });
    } catch (indexError) {
      console.error("Codebase indexing error:", indexError.message);
    }

    const repoPath =
      `https://api.github.com/repos/` +
      `${project.github.owner}/${project.github.name}`;

    const branch = project.github.branch || "main";

    /**
     * Fetch repository information.
     *
     * Empty repositories are allowed to return
     * empty tree/commit/issue/PR data.
     */
    const [metadata, tree, commits, issues, pullRequests] = await Promise.all([
      githubFetch(repoPath, token),

      githubFetchAllowEmpty(
        `${repoPath}/git/trees/` + `${encodeURIComponent(branch)}?recursive=1`,
        token,
        { tree: [] },
      ),

      githubFetchAllowEmpty(`${repoPath}/commits?per_page=20`, token, []),

      githubFetchAllowEmpty(
        `${repoPath}/issues?state=open&per_page=20`,
        token,
        [],
      ),

      githubFetchAllowEmpty(
        `${repoPath}/pulls?state=open&per_page=20`,
        token,
        [],
      ),
    ]);

    /**
     * Build normalized snapshot.
     */
    const snapshotData = buildSnapshotData({
      project,
      metadata,
      tree,
      commits,
      issues,
      pullRequests,
    });

    if (!snapshotData.fileCount) {
      throw Object.assign(
        new Error("Repository contains no supported files."),
        { status: 422 },
      );
    }

    /**
     * Save repository snapshot.
     */
    snapshot = await RepositorySnapshot.findOneAndUpdate(
      { project: project._id },
      snapshotData,
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    );

    /**
     * Update project's GitHub sync timestamp.
     */
    project.github.lastSyncedAt = new Date();

    await project.save();

    return res.status(200).json({
      success: true,
      cached: false,
      message: "Repository synced successfully.",
      snapshot,
      codebaseIndex,
      project: {
        _id: project._id,
        github: project.github,
      },
    });
  } catch (error) {
    console.error("Repository sync error:", error);

    if (error.status === 401 && project && connection) {
      project.github.connected = false;
      await project.save();
      await GitHubConnection.deleteOne({ _id: connection._id });
      error.status = 409;
      error.code = "GITHUB_REAUTH_REQUIRED";
      error.message =
        "GitHub authorization expired. Reconnect GitHub before syncing.";
    }

    /**
     * Persist failed state so the frontend can
     * display the actual sync status.
     */
    if (snapshot?._id) {
      try {
        await RepositorySnapshot.findByIdAndUpdate(snapshot._id, {
          status: "failed",
          error: error.message || "Unable to sync repository.",
        });
      } catch (updateError) {
        console.error("Unable to save sync failure:", updateError);
      }
    }

    return res.status(error.status || 500).json({
      success: false,
      code: error.code,
      message: error.message || "Unable to sync repository.",
    });
  }
};

/**
 * Get current repository sync status
 */
export const getSyncStatus = async (req, res) => {
  try {
    const project = await getProject(req.user._id, req.params.projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    const snapshot = await RepositorySnapshot.findOne({
      project: project._id,
    });

    return res.status(200).json({
      success: true,
      snapshot,
    });
  } catch (error) {
    console.error("Get sync status error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to get repository sync status.",
    });
  }
};
