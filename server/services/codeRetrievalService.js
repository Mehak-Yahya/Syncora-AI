import CodebaseIndex from "../models/CodebaseIndex.js";

const STOP_WORDS = new Set([
  "what", "where", "which", "how", "does", "the", "this", "that", "are", "is",
  "and", "for", "from", "with", "into", "about", "project", "repository", "file",
]);

const termsFor = (question) =>
  [...new Set(
    question
      .toLowerCase()
      .replace(/[^a-z0-9_./-]+/g, " ")
      .split(/\s+/)
      .filter((term) => term.length > 2 && !STOP_WORDS.has(term))
  )].slice(0, 20);

const scoreChunk = (chunk, terms) => {
  const path = chunk.path.toLowerCase();
  const content = chunk.content.toLowerCase();
  return terms.reduce((score, term) => {
    if (path.includes(term)) score += 8;
    if (path.split("/").some((part) => part.includes(term))) score += 4;
    if (content.includes(term)) score += 1;
    return score;
  }, 0);
};

export const retrieveRelevantCode = async ({ projectId, snapshotId, question }) => {
  const index = await CodebaseIndex.findOne({
    project: projectId,
    repositorySnapshot: snapshotId,
    status: "ready",
  }).lean();

  if (!index) {
    return { chunks: [], sources: [], indexed: false };
  }

  const terms = termsFor(question);
  const ranked = index.chunks
    .map((chunk) => ({ ...chunk, score: scoreChunk(chunk, terms) }))
    .filter((chunk) => chunk.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, 8);

  return {
    chunks: ranked.map(({ score, ...chunk }) => chunk),
    sources: [...new Set(ranked.map((chunk) => chunk.path))],
    indexed: true,
  };
};
