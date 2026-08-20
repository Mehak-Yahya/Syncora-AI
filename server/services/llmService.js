const DEFAULT_MODEL = "gpt-4o-mini";
const DEFAULT_API_URL = "https://api.openai.com/v1/chat/completions";
const REQUEST_TIMEOUT_MS = 30000;

const values = (items = []) =>
  items.length ? items.join(", ") : "not detected";

const formatCodeContext = (chunks = []) =>
  chunks
    .map(
      (chunk) =>
        `FILE: ${chunk.path}\nLINES: ${chunk.startLine}-${chunk.endLine}\n<code>\n${chunk.content}\n</code>`
    )
    .join("\n\n");

const generateLocalAnswer = (question, context) => {
  const normalizedQuestion = question.toLowerCase();
  const technologies = context.technologies || {};
  const sourceFiles = [
    ...new Set((context.relevantCode || []).map((chunk) => chunk.path)),
  ].slice(0, 6);
  const sourceNote = sourceFiles.length
    ? ` Sources: ${sourceFiles.join(", ")}.`
    : "";
  const relevantTerms = [
    "project",
    "repository",
    "repo",
    "technolog",
    "language",
    "frontend",
    "backend",
    "framework",
    "architect",
    "file",
    "auth",
    "database",
    "testing",
    "test",
    "deployment",
    "commit",
    "issue",
    "pull request",
    "improv",
    "better",
    "structure",
    "summary",
  ];

  if (!relevantTerms.some((term) => normalizedQuestion.includes(term))) {
    return "I can answer questions about this repository's technologies, architecture, files, activity, and engineering improvements.";
  }

  if (normalizedQuestion.includes("technolog")) {
    return `This project uses ${values(technologies.languages)}. Frontend: ${values(technologies.frontend)}. Backend: ${values(technologies.backend)}. Frameworks: ${values(technologies.frameworks)}.`;
  }

  if (normalizedQuestion.includes("architect")) {
    return `${context.architecture || "The project architecture was not detected in the repository analysis."}${sourceNote}`;
  }

  if (normalizedQuestion.includes("important file") || normalizedQuestion.includes("file")) {
    const files = (context.importantFiles || []).map((file) => file.path).slice(0, 12);
    return files.length
      ? `Important files include: ${files.join(", ")}.${sourceNote}`
      : "No important files were detected in the repository analysis.";
  }

  if (normalizedQuestion.includes("auth")) {
    return `Authentication: ${values(technologies.authentication)}.${sourceNote}`;
  }

  if (normalizedQuestion.includes("database")) {
    return `Database: ${values(technologies.database)}.`;
  }

  if (normalizedQuestion.includes("test")) {
    return `Testing: ${values(technologies.testing)}.`;
  }

  if (normalizedQuestion.includes("deploy")) {
    return `Deployment: ${values(technologies.deployment)}.`;
  }

  if (
    normalizedQuestion.includes("commit") ||
    normalizedQuestion.includes("issue") ||
    normalizedQuestion.includes("pull request")
  ) {
    return `Recent activity includes ${context.activity?.commits || 0} commits, ${context.activity?.openIssues || 0} open issues, and ${context.activity?.openPullRequests || 0} open pull requests.`;
  }

  if (
    normalizedQuestion.includes("what is this") ||
    normalizedQuestion.includes("what does") ||
    normalizedQuestion.includes("summary")
  ) {
    return context.summary || "The repository summary was not detected.";
  }

  if (normalizedQuestion.includes("improv") || normalizedQuestion.includes("better")) {
    const gaps = [
      technologies.database?.length ? "database documentation" : "database integration",
      technologies.testing?.length ? null : "automated test coverage",
      technologies.deployment?.length ? null : "deployment configuration",
    ].filter(Boolean);
    return `Based on the available context, consider improving ${gaps.join(", ") || "documentation, testing, and deployment visibility"}. This is a context-based suggestion, not a source-code review.`;
  }

  return `${context.summary || "I could not find enough analyzed context to answer that."} Architecture: ${context.architecture || "not detected"}`;
};

const useLocalFallback = (question, projectContext) =>
  (process.env.AI_FALLBACK_PROVIDER || "local").toLowerCase() === "local"
    ? generateLocalAnswer(question, projectContext)
    : null;

const requestProviderAnswer = async ({
  apiKey,
  apiUrl,
  model,
  question,
  projectContext,
}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          temperature: 0.2,
          max_tokens: 700,
          messages: [
            {
              role: "system",
              content:
                "You are Syncora AI, a concise engineering assistant. Answer only from the supplied project context. Be explicit when the context does not contain enough information. Do not invent source code, dependencies, credentials, or implementation details. Do not claim to have read repository source files.",
            },
            {
              role: "user",
              content: `Project context:\n${JSON.stringify({ ...projectContext, relevantCode: undefined })}\n\nRelevant repository files:\n${formatCodeContext(projectContext.relevantCode)}\n\nQuestion:\n${question}`,
            },
          ],
        }),
        signal: controller.signal,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const providerCode = data.error?.code || data.error?.type;
      const error = new Error(
        response.status === 401
          ? "The AI provider rejected the API key. Check or replace AI_API_KEY."
          : response.status === 403
            ? "The AI provider denied this request. Check account billing and model access."
            : response.status === 404
              ? "The configured AI model or endpoint was not found. Check AI_MODEL and AI_API_URL."
              : response.status === 429
                ? "The AI provider rate limit or quota was reached. Check account usage and billing."
                : "The AI provider could not answer right now."
      );
      error.code = "AI_PROVIDER_FAILURE";
      error.status = response.status;
      error.providerCode = providerCode;
      throw error;
    }

    const answer = data.choices?.[0]?.message?.content?.trim();

    if (!answer) {
      const error = new Error("The AI provider returned an empty answer.");
      error.code = "AI_PROVIDER_FAILURE";
      error.status = 502;
      throw error;
    }

    return answer;
  } catch (error) {
    if (error.name === "AbortError") {
      const timeoutError = new Error("The AI request timed out. Please try again.");
      timeoutError.code = "AI_TIMEOUT";
      timeoutError.status = 504;
      throw timeoutError;
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
};

export const generateProjectAnswer = async ({ question, projectContext }) => {
  const primaryProvider = (process.env.AI_PROVIDER || "openai").toLowerCase();

  if (primaryProvider === "local") {
    return generateLocalAnswer(question, projectContext);
  }

  const providers = [
    {
      name: primaryProvider,
      apiKey: process.env.AI_API_KEY,
      apiUrl: process.env.AI_API_URL || DEFAULT_API_URL,
      model: process.env.AI_MODEL || DEFAULT_MODEL,
    },
    {
      name: "openai-fallback",
      apiKey: process.env.OPENAI_API_KEY,
      apiUrl: process.env.OPENAI_API_URL || DEFAULT_API_URL,
      model: process.env.OPENAI_MODEL || "gpt-4o",
    },
  ].filter((provider, index, all) =>
    provider.apiKey && all.findIndex((item) => item.apiKey === provider.apiKey) === index
  );

  let lastError = null;

  for (const provider of providers) {
    try {
      return await requestProviderAnswer({
        apiKey: provider.apiKey,
        apiUrl: provider.apiUrl,
        model: provider.model,
        question,
        projectContext,
      });
    } catch (error) {
      lastError = error;
      console.warn(`AI provider ${provider.name} failed:`, error.message);
    }
  }

  const fallbackAnswer = useLocalFallback(question, projectContext);
  if (fallbackAnswer) return fallbackAnswer;

  if (!providers.length) {
    const error = new Error("AI provider is not configured.");
    error.code = "AI_NOT_CONFIGURED";
    error.status = 503;
    throw error;
  }

  throw lastError || new Error("AI providers could not answer right now.");
};
