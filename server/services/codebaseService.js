import CodebaseIndex from "../models/CodebaseIndex.js";
import { decryptSecret } from "../utils/secretBox.js";

const DEFAULT_MAX_FILES = 80;
const DEFAULT_MAX_FILE_CHARS = 24000;
const DEFAULT_MAX_TOTAL_CHARS = 160000;
const DEFAULT_CHUNK_LINES = 80;
const DEFAULT_CHUNK_OVERLAP = 10;

const SAFE_EXTENSIONS = new Set([
  ".js", ".jsx", ".ts", ".tsx", ".py", ".java", ".cs", ".cpp", ".c",
  ".go", ".rs", ".php", ".rb", ".html", ".htm", ".css", ".scss",
  ".json", ".yml", ".yaml", ".md",
]);

const EXCLUDED_PATH = /(^|\/)(node_modules|dist|build|coverage|\.git)(\/|$)|(^|\/)(\.env(?:\..*)?|.*\.pem|.*\.key|credentials[^/]*|secret[^/]*)$/i;
const SENSITIVE_CONTENT = /(-----BEGIN [A-Z ]+PRIVATE KEY-----|(?:api[_-]?key|access[_-]?token|client[_-]?secret|password|jwt[_-]?secret)\s*[:=]\s*[^\s]+)/i;

const getNumber = (name, fallback) => {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
};

const limits = () => ({
  maxFiles: getNumber("CODEBASE_MAX_FILES", DEFAULT_MAX_FILES),
  maxFileChars: getNumber("CODEBASE_MAX_FILE_CHARS", DEFAULT_MAX_FILE_CHARS),
  maxTotalChars: getNumber("CODEBASE_MAX_TOTAL_CHARS", DEFAULT_MAX_TOTAL_CHARS),
  chunkLines: getNumber("CODEBASE_CHUNK_LINES", DEFAULT_CHUNK_LINES),
  chunkOverlap: getNumber("CODEBASE_CHUNK_OVERLAP", DEFAULT_CHUNK_OVERLAP),
});

const extensionFor = (path) => {
  const match = path.toLowerCase().match(/(\.[^./]+)$/);
  return match?.[1] || "";
};

const languageFor = (path) => ({
  ".js": "JavaScript", ".jsx": "JavaScript", ".ts": "TypeScript", ".tsx": "TypeScript",
  ".py": "Python", ".java": "Java", ".cs": "C#", ".cpp": "C++", ".c": "C",
  ".go": "Go", ".rs": "Rust", ".php": "PHP", ".rb": "Ruby", ".html": "HTML",
  ".htm": "HTML", ".css": "CSS", ".scss": "SCSS", ".json": "JSON", ".yml": "YAML",
  ".yaml": "YAML", ".md": "Markdown",
}[extensionFor(path)] || "Text");

export const isSafeSourcePath = (path = "") =>
  !EXCLUDED_PATH.test(path.replace(/\\/g, "/")) && SAFE_EXTENSIONS.has(extensionFor(path));

const decodeContent = (data) => {
  if (data.encoding === "base64" && data.content) {
    return Buffer.from(data.content.replace(/\s/g, ""), "base64").toString("utf8");
  }
  return typeof data.content === "string" ? data.content : "";
};

const githubContent = async (repoPath, path, branch, token) => {
  const response = await fetch(
    `${repoPath}/contents/${path.split("/").map(encodeURIComponent).join("/")}?ref=${encodeURIComponent(branch)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data?.message || "Unable to load repository source.");
    error.status = response.status;
    throw error;
  }
  return decodeContent(data);
};

const buildChunks = (path, content, config) => {
  const lines = content.split(/\r?\n/);
  const chunks = [];
  const step = Math.max(1, config.chunkLines - config.chunkOverlap);

  for (let start = 0; start < lines.length; start += step) {
    const selected = lines.slice(start, start + config.chunkLines);
    if (!selected.length) break;
    chunks.push({
      path,
      language: languageFor(path),
      content: selected.join("\n"),
      startLine: start + 1,
      endLine: start + selected.length,
    });
    if (start + config.chunkLines >= lines.length) break;
  }
  return chunks;
};

export const indexRepository = async ({ project, snapshot, connection }) => {
  const config = limits();
  const index = await CodebaseIndex.findOneAndUpdate(
    { project: project._id },
    {
      project: project._id,
      repositorySnapshot: snapshot._id,
      status: "indexing",
      error: "",
      chunks: [],
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  try {
    const token = decryptSecret({
      encrypted: connection.encryptedAccessToken,
      iv: connection.iv,
      authTag: connection.authTag,
    });
    const repoPath = `https://api.github.com/repos/${project.github.owner}/${project.github.name}`;
    const branch = project.github.branch || snapshot.metadata?.defaultBranch || "main";
    const files = (snapshot.files || [])
      .filter((file) => isSafeSourcePath(file.path))
      .sort((left, right) => (left.size || 0) - (right.size || 0))
      .slice(0, config.maxFiles);
    const chunks = [];
    let totalChars = 0;

    for (const file of files) {
      if ((file.size || 0) > config.maxFileChars || totalChars >= config.maxTotalChars) continue;
      const content = await githubContent(repoPath, file.path, branch, token);
      if (!content || content.length > config.maxFileChars || SENSITIVE_CONTENT.test(content)) continue;
      const remaining = config.maxTotalChars - totalChars;
      const boundedContent = content.slice(0, remaining);
      chunks.push(...buildChunks(file.path, boundedContent, config));
      totalChars += boundedContent.length;
      if (totalChars >= config.maxTotalChars) break;
    }

    await CodebaseIndex.findByIdAndUpdate(index._id, {
      status: "ready",
      fileCount: files.length,
      chunkCount: chunks.length,
      chunks,
      error: "",
      indexedAt: new Date(),
    });
    return { indexed: true, fileCount: files.length, chunkCount: chunks.length };
  } catch (error) {
    await CodebaseIndex.findByIdAndUpdate(index._id, {
      status: "failed",
      error: error.message || "Codebase indexing failed.",
    });
    throw error;
  }
};
