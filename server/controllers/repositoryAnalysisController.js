
import Project from "../models/Project.js";
import RepositorySnapshot from "../models/RepositorySnapshot.js";
import EngineeringContext from "../models/EngineeringContext.js";
import { detectTechnologies as detectRepositoryTechnologies } from "../services/technologyDetector.js";

const getAccessibleProject = (userId, projectId) =>
  Project.findOne({
    _id: projectId,
    $or: [{ owner: userId }, { members: userId }],
  });

const normalize = (value = "") => value.toLowerCase().trim();

const hasFile = (files, pattern) =>
  files.some((file) => pattern.test(file.path || ""));

const hasAnyFile = (files, patterns) =>
  patterns.some((pattern) => hasFile(files, pattern));

const addUnique = (array, value) => {
  if (value && !array.includes(value)) {
    array.push(value);
  }
};

const detectTechnologies = (snapshot) => {
  const files = snapshot.files || [];
  const metadata = snapshot.metadata || {};

  const languages = [];
  const frameworks = [];
  const frontend = [];
  const backend = [];
  const database = [];
  const authentication = [];
  const testing = [];
  const deployment = [];

  // --------------------------------------------------
  // Language detection
  // --------------------------------------------------

  const languageMap = {
    JavaScript: "JavaScript",
    TypeScript: "TypeScript",
    Python: "Python",
    Java: "Java",
    "C#": "C#",
    "C++": "C++",
    Go: "Go",
    Rust: "Rust",
    PHP: "PHP",
    Ruby: "Ruby",
  };

  addUnique(languages, languageMap[metadata.language]);

  if (hasAnyFile(files, [/\.(js|jsx|mjs|cjs)$/i])) {
    addUnique(languages, "JavaScript");
  }

  if (hasAnyFile(files, [/\.tsx$/i, /\.ts$/i])) {
    addUnique(languages, "TypeScript");
  }

  if (
    hasAnyFile(files, [
      /\.py$/i,
      /(^|\/)requirements\.txt$/i,
      /(^|\/)pyproject\.toml$/i,
      /(^|\/)setup\.py$/i,
      /(^|\/)pipfile$/i,
    ])
  ) {
    addUnique(languages, "Python");
  }

  const languageExtensions = [
    [/\.cs$/i, "C#"],
    [/\.(cpp|cc|cxx|hpp|h)$/i, "C++"],
    [/\.java$/i, "Java"],
    [/\.go$/i, "Go"],
    [/\.rs$/i, "Rust"],
    [/\.php$/i, "PHP"],
    [/\.rb$/i, "Ruby"],
    [/\.swift$/i, "Swift"],
    [/\.kt$/i, "Kotlin"],
    [/\.sql$/i, "SQL"],
    [/\.(sh|bash|zsh)$/i, "Shell"],
    [/\.r$/i, "R"],
    [/\.lua$/i, "Lua"],
    [/\.(ex|exs)$/i, "Elixir"],
    [/\.scala$/i, "Scala"],
    [/\.(clj|cljs)$/i, "Clojure"],
    [/\.sol$/i, "Solidity"],
    [/\.(html?|htm)$/i, "HTML"],
    [/\.css$/i, "CSS"],
  ];

  languageExtensions.forEach(([pattern, language]) => {
    if (hasAnyFile(files, [pattern])) addUnique(languages, language);
  });

  // --------------------------------------------------
  // package.json
  // --------------------------------------------------

  const packageFile = files.find(
    (file) => normalize(file.path) === "package.json"
  );

  /*
   * RepositorySnapshot currently stores file metadata,
   * not file contents.
   *
   * Therefore package.json dependencies cannot be read yet.
   * We detect technologies from filenames and repository
   * metadata for now.
   */

  // --------------------------------------------------
  // Frontend frameworks
  // --------------------------------------------------

  if (
    hasAnyFile(files, [
      /(^|\/)vite\.config\.(js|ts|mjs)$/i,
      /(^|\/)vite\.config/i,
    ])
  ) {
    addUnique(frameworks, "Vite");
    addUnique(frontend, "Vite");
  }

  if (
    hasAnyFile(files, [
      /(^|\/)next\.config/i,
      /(^|\/)app\/.*page\.(js|jsx|ts|tsx)$/i,
    ])
  ) {
    addUnique(frameworks, "Next.js");
    addUnique(frontend, "Next.js");
  }

  if (
    hasAnyFile(files, [
      /(^|\/)angular\.json$/i,
      /(^|\/)angular\.config/i,
    ])
  ) {
    addUnique(frameworks, "Angular");
    addUnique(frontend, "Angular");
  }

  if (
    hasAnyFile(files, [
      /(^|\/)src\/.*\.(jsx|tsx)$/i,
      /(^|\/)src\/app\.(jsx|tsx)$/i,
      /(^|\/)src\/main\.(jsx|tsx)$/i,
    ])
  ) {
    addUnique(frameworks, "React");
    addUnique(frontend, "React");
  }

  // --------------------------------------------------
  // Backend
  // --------------------------------------------------

  if (
    hasAnyFile(files, [
      /(^|\/)server\.(js|ts|mjs)$/i,
      /(^|\/)app\.(js|ts|mjs)$/i,
      /(^|\/)index\.(js|ts|mjs)$/i,
      /(^|\/)routes\//i,
      /(^|\/)controllers\//i,
    ])
  ) {
    addUnique(backend, "Node.js");
  }

  if (
    hasAnyFile(files, [
      /(^|\/)requirements\.txt$/i,
      /(^|\/)pyproject\.toml$/i,
      /(^|\/)setup\.py$/i,
      /(^|\/)pipfile$/i,
      /(^|\/).*\.py$/i,
    ])
  ) {
    addUnique(backend, "Python");
  }

  if (
    hasAnyFile(files, [
      /(^|\/)server\.(js|ts|mjs)$/i,
      /(^|\/)routes\//i,
    ])
  ) {
    addUnique(frameworks, "Express");
    addUnique(backend, "Express");
  }

  // --------------------------------------------------
  // Database detection
  // --------------------------------------------------

  if (
    hasAnyFile(files, [
      /(^|\/).*mongoose.*/i,
      /(^|\/)models\//i,
      /(^|\/)mongo/i,
    ])
  ) {
    addUnique(database, "MongoDB");
  }

  if (
    hasAnyFile(files, [
      /(^|\/).*prisma.*/i,
      /(^|\/)prisma\//i,
    ])
  ) {
    addUnique(database, "Prisma");
  }

  if (
    hasAnyFile(files, [
      /(^|\/).*postgres/i,
      /(^|\/).*postgresql/i,
    ])
  ) {
    addUnique(database, "PostgreSQL");
  }

  if (
    hasAnyFile(files, [
      /(^|\/).*mysql/i,
    ])
  ) {
    addUnique(database, "MySQL");
  }

  // --------------------------------------------------
  // Authentication
  // --------------------------------------------------

  if (
    hasAnyFile(files, [
      /(^|\/).*auth.*/i,
      /(^|\/).*login.*/i,
      /(^|\/).*jwt.*/i,
      /(^|\/)middleware\//i,
    ])
  ) {
    addUnique(authentication, "Application authentication");
  }

  // --------------------------------------------------
  // Testing
  // --------------------------------------------------

  if (
    hasAnyFile(files, [
      /(^|\/).*test\.(js|jsx|ts|tsx|py)$/i,
      /(^|\/).*spec\.(js|jsx|ts|tsx|py)$/i,
      /(^|\/)__tests__\//i,
      /(^|\/)jest\.config/i,
      /(^|\/)vitest\.config/i,
      /(^|\/)pytest/i,
    ])
  ) {
    addUnique(testing, "Automated tests");
  }

  // --------------------------------------------------
  // Deployment
  // --------------------------------------------------

  if (hasAnyFile(files, [/dockerfile/i, /(^|\/)docker-compose/i])) {
    addUnique(deployment, "Docker");
  }

  if (hasAnyFile(files, [/render\.yaml/i, /render\.yml/i])) {
    addUnique(deployment, "Render");
  }

  if (hasAnyFile(files, [/railway\.json/i, /railway\.toml/i])) {
    addUnique(deployment, "Railway");
  }

  if (
    hasAnyFile(files, [
      /(^|\/)vercel\.json$/i,
      /(^|\/)\.vercel\//i,
    ])
  ) {
    addUnique(deployment, "Vercel");
  }

  // --------------------------------------------------
  // Fallbacks
  // --------------------------------------------------

  if (frontend.length > 0) {
    addUnique(frameworks, frontend[0]);
  }

  if (backend.length > 0) {
    addUnique(frameworks, backend[0]);
  }

  return {
    languages,
    frameworks,
    frontend,
    backend,
    database,
    authentication,
    testing,
    deployment,
    packageFileFound: Boolean(packageFile),
  };
};

const buildArchitecture = (technologies) => {
  const layers = [];

  if (technologies.frontend.length > 0) {
    layers.push(`Frontend: ${technologies.frontend.join(", ")}`);
  }

  if (technologies.backend.length > 0) {
    layers.push(`Backend: ${technologies.backend.join(", ")}`);
  }

  if (technologies.database.length > 0) {
    layers.push(`Database: ${technologies.database.join(", ")}`);
  }

  if (technologies.authentication.length > 0) {
    layers.push(
      `Authentication: ${technologies.authentication.join(", ")}`
    );
  }

  if (layers.length === 0) {
    return "Architecture could not be determined yet.";
  }

  return layers.join(" → ");
};

const buildSummary = (snapshot, technologies) => {
  const projectName =
    snapshot.metadata?.fullName ||
    "This repository";

  const detected = [];

  if (technologies.frontend.length > 0) {
    detected.push(
      `frontend using ${technologies.frontend.join(", ")}`
    );
  }

  if (technologies.backend.length > 0) {
    detected.push(
      `backend using ${technologies.backend.join(", ")}`
    );
  }

  if (technologies.database.length > 0) {
    detected.push(
      `database technology including ${technologies.database.join(", ")}`
    );
  }

  if (detected.length === 0) {
    return `${projectName} has been synchronized and is ready for deeper analysis.`;
  }

  return `${projectName} appears to be a project with ${detected.join(
    ", "
  )}.`;
};

export const analyzeRepository = async (req, res) => {
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

    const snapshot = await RepositorySnapshot.findOne({
      project: project._id,
    });

    if (!snapshot) {
      return res.status(404).json({
        success: false,
        message: "Repository has not been synced yet.",
      });
    }

    if (snapshot.status !== "synced") {
      return res.status(400).json({
        success: false,
        message: "Repository must be successfully synced before analysis.",
      });
    }

    const technologies = detectRepositoryTechnologies({
      files: snapshot.files,
    });

    await EngineeringContext.findOneAndUpdate(
      { project: project._id },
      {
        project: project._id,
        repositorySnapshot: snapshot._id,
        analysisStatus: "analyzing",
        analysisError: "",
      },
      {
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    const architecture = buildArchitecture(technologies);

    const summary = buildSummary(snapshot, technologies);

    const importantFiles = (
      snapshot.importantFiles || snapshot.files || []
    ).map((file) => ({
      path: file.path,
      purpose: "Important repository file detected during analysis.",
    }));

    const projectStructure = (snapshot.files || []).map((file) => ({
      path: file.path,
      type: file.type || "file",
    }));

    const activity = {
      commits: snapshot.commits?.length || 0,
      openIssues: snapshot.issues?.length || 0,
      openPullRequests: snapshot.pullRequests?.length || 0,
      lastCommitAt:
        snapshot.commits?.[0]?.date || null,
    };

    const context = await EngineeringContext.findOneAndUpdate(
      { project: project._id },
      {
        project: project._id,
        repositorySnapshot: snapshot._id,

        summary,
        architecture,

        technologies: {
          languages: technologies.languages,
          frameworks: technologies.frameworks,
          frontend: technologies.frontend,
          backend: technologies.backend,
          database: technologies.database,
          authentication: technologies.authentication,
          testing: technologies.testing,
          deployment: technologies.deployment,
        },

        importantFiles,
        projectStructure,
        activity,

        analysisStatus: "completed",
        analysisError: "",
        analyzedAt: new Date(),
      },
      {
        upsert: true,
        returnDocument: "after",
        setDefaultsOnInsert: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Repository analysis completed.",
      context,
    });
  } catch (error) {
    console.error("Repository analysis error:", error);

    try {
      await EngineeringContext.findOneAndUpdate(
        { project: req.params.projectId },
        {
          analysisStatus: "failed",
          analysisError: error.message || "Repository analysis failed.",
        }
      );
    } catch (updateError) {
      console.error(
        "Unable to save repository analysis error:",
        updateError
      );
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to analyze repository.",
    });
  }
};

export const getEngineeringContext = async (req, res) => {
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

    const context = await EngineeringContext.findOne({
      project: project._id,
    }).populate("repositorySnapshot");

    if (!context) {
      return res.status(404).json({
        success: false,
        message: "Engineering context has not been generated yet.",
      });
    }

    return res.status(200).json({
      success: true,
      context,
    });
  } catch (error) {
    console.error("Engineering context retrieval error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load engineering context.",
    });
  }
};
