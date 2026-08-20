import jwt from "jsonwebtoken";
import jwtSecret from "../config/auth.js";
import GitHubConnection from "../models/GitHubConnection.js";
import Project from "../models/Project.js";
import { encryptSecret, decryptSecret } from "../utils/secretBox.js";

const clientUrl = () =>
  process.env.CLIENT_URL || "http://localhost:5173";

const getAccessibleProject = (userId, projectId) =>
  Project.findOne({
    _id: projectId,
    $or: [{ owner: userId }, { members: userId }],
  });

/**
 * Start GitHub OAuth
 */
export const startGitHubAuth = async (req, res) => {
  try {
    const { projectId } = req.query;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required.",
      });
    }

    const project = await getAccessibleProject(
      req.user._id,
      projectId
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    if (!process.env.GITHUB_CLIENT_ID) {
      return res.status(500).json({
        success: false,
        message: "GitHub OAuth is not configured.",
      });
    }

    const state = jwt.sign(
      {
        userId: req.user._id.toString(),
        projectId: project._id.toString(),
      },
      jwtSecret,
      {
        expiresIn: "10m",
      }
    );

    const params = new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID,
      redirect_uri: process.env.GITHUB_CALLBACK_URL || "",
      scope: "read:user repo",
      state,
    });

    return res.status(200).json({
      success: true,
      authUrl: `https://github.com/login/oauth/authorize?${params.toString()}`,
    });
  } catch (error) {
    console.error("GitHub auth start error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to start GitHub connection.",
    });
  }
};

/**
 * GitHub OAuth callback
 */
export const githubCallback = async (req, res) => {
  const redirect = (params = {}) => {
    const query = new URLSearchParams(params).toString();

    return res.redirect(
      `${clientUrl()}/dashboard${query ? `?${query}` : ""}`
    );
  };

  try {
    if (req.query.error) {
      return redirect({
        githubError: "GitHub authorization was cancelled.",
      });
    }

    if (!req.query.state || !req.query.code) {
      return redirect({
        githubError: "Invalid GitHub authorization response.",
      });
    }

    const state = jwt.verify(
      req.query.state,
      jwtSecret
    );

    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code: req.query.code,
          redirect_uri: process.env.GITHUB_CALLBACK_URL,
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error("GitHub token exchange failed:", tokenData);

      return redirect({
        githubError: "Unable to complete GitHub authorization.",
      });
    }

    const encrypted = encryptSecret(tokenData.access_token);

    await GitHubConnection.findOneAndUpdate(
      { user: state.userId },
      {
        user: state.userId,
        encryptedAccessToken: encrypted.encrypted,
        iv: encrypted.iv,
        authTag: encrypted.authTag,
        scopes: tokenData.scope
          ? tokenData.scope.split(",")
          : [],
        connectedAt: new Date(),
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    return redirect({
      github: "connected",
      projectId: state.projectId,
    });
  } catch (error) {
    console.error("GitHub callback error:", error);

    return redirect({
      githubError: "Unable to connect GitHub.",
    });
  }
};

/**
 * List repositories available to the authenticated user
 */
export const listRepositories = async (req, res) => {
  try {
    const connection = await GitHubConnection.findOne({
      user: req.user._id,
    }).select(
      "+encryptedAccessToken +iv +authTag"
    );

    if (!connection) {
      return res.status(404).json({
        success: false,
        message: "GitHub is not connected.",
      });
    }

    const token = decryptSecret({
      encrypted: connection.encryptedAccessToken,
      iv: connection.iv,
      authTag: connection.authTag,
    });

    const response = await fetch(
      "https://api.github.com/user/repos?per_page=100&sort=updated&affiliation=owner,collaborator,organization_member",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    const repositories = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message:
          repositories?.message ||
          "Unable to load GitHub repositories.",
      });
    }

    return res.status(200).json({
      success: true,
      repositories,
    });
  } catch (error) {
    console.error("GitHub repository listing error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load GitHub repositories.",
    });
  }
};

/**
 * Connect a GitHub repository to a Syncora project
 */
export const connectRepository = async (req, res) => {
  try {
    const project = await getAccessibleProject(
      req.user._id,
      req.params.projectId
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    const {
      repositoryId,
      owner,
      name,
      fullName,
      url,
      branch,
    } = req.body;

    if (!repositoryId || !owner || !name) {
      return res.status(400).json({
        success: false,
        message: "Repository information is incomplete.",
      });
    }

    project.github = {
      connected: true,
      connectedBy: req.user._id,
      repositoryId,
      owner,
      name,
      fullName: fullName || `${owner}/${name}`,
      url: url || `https://github.com/${owner}/${name}`,
      branch: branch || "main",
      lastSyncedAt: project.github?.lastSyncedAt || null,
    };

    await project.save();

    return res.status(200).json({
      success: true,
      message: "GitHub repository connected successfully.",
      project,
    });
  } catch (error) {
    console.error(
      "GitHub repository connection error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to connect repository.",
    });
  }
};