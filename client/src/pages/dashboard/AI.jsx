
import { useState } from "react";

const DashboardAI = ({ dashboard }) => {
  const {
    aiAnswer,
    aiError,
    aiLoading,
    aiProjectId,
    aiQuestion,
    aiRetrieval,
    aiSources,
    analysisDetailTabs,
    analysisMessage,
    analyzingProjectId,
    clearAiConversation,
    connectedProjects,
    engineeringContexts,
    expandedAnalysisProjects,
    handleAnalyzeRepository,
    handleAskSyncora,
    selectedAiProject,
    setAiAnswer,
    setAiError,
    setAiProjectId,
    setAiQuestion,
    setAnalysisDetailTab,
    toggleAnalysisDetails,
  } = dashboard;

  const [activeTab, setActiveTab] = useState("repository");

  return (
    <section className="min-h-[calc(100vh-70px)] w-full bg-[#0B0F14] px-4 py-6 text-[#F5F7FA] sm:px-7 sm:py-8">
      <div className="mx-auto w-full max-w-7xl">

        {/* =========================================================
            TOP TABS
        ========================================================= */}
        <div className="mb-6 flex gap-1 border-b border-[#252C35]">
          {[
            ["repository", "Repository Intelligence"],
            ["ai", "AI Workspace"],
          ].map(([tab, label]) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 px-3 py-3 text-xs font-semibold transition sm:px-4 ${
                activeTab === tab
                  ? "border-[#FF8C2B] text-[#FF8C2B]"
                  : "border-transparent text-[#737C87] hover:text-[#E8D889]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* =========================================================
            REPOSITORY INTELLIGENCE
        ========================================================= */}
        {activeTab === "repository" && (
          <div className="rounded-2xl border border-[#252C35] bg-[#151A21] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.14)] sm:p-7">

            {/* HEADER */}
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#FF8C2B]">
                  Repository Intelligence
                </p>

                <h1 className="mt-1.5 text-2xl font-semibold tracking-[-0.02em] text-[#E8D889] sm:text-[28px]">
                  Understand your codebase
                </h1>

                <p className="mt-1.5 max-w-2xl text-sm leading-6 text-[#858D97]">
                  Generate a structured engineering context from each
                  synced repository.
                </p>
              </div>

              <span className="rounded-full border border-[#303842] bg-[#1D242D] px-3 py-1.5 text-[10px] font-semibold text-[#AAB2BC]">
                Analysis V1
              </span>
            </div>

            {/* NO REPOSITORIES */}
            {connectedProjects.length === 0 ? (
              <p className="mt-6 rounded-xl border border-dashed border-[#303842] bg-[#10151B] p-5 text-sm text-[#737C87]">
                No repository connected. Connect GitHub from a project
                first.
              </p>
            ) : (
              <div className="mt-6 space-y-5">
                {[selectedAiProject].filter(Boolean).map((project) => {
                  const context = engineeringContexts[project._id];
                  const snapshot = project.repositorySnapshot;
                  const technologies = context?.technologies || {};
                  const detailTab =
                    analysisDetailTabs[project._id] || "overview";

                  const status =
                    context?.analysisStatus === "analyzing" ||
                    analyzingProjectId === project._id
                      ? "Analysis in progress"
                      : context?.analysisStatus === "failed"
                        ? "Analysis failed"
                        : context?.analysisStatus === "completed"
                          ? "Analysis completed"
                          : snapshot?.status !== "synced"
                            ? "Repository connected but not synced"
                            : "Repository synced but not analyzed";

                  const values = (items) =>
                    items?.length ? items.join(", ") : "Not detected";

                  return (
                    <article
                      key={project._id}
                      className="rounded-xl border border-[#303842] bg-[#10151B] p-5 transition hover:border-[#3B444F]"
                    >
                      {/* PROJECT HEADER */}
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="inline-flex rounded-md border border-[#4A3028] bg-[#251916] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#FF8C2B]">
                            Project · {project.name}
                          </p>

                          <p className="mt-2 text-sm font-semibold text-[#E8D889]">
                            {project.github.fullName ||
                              "Repository not named"}
                          </p>

                          <p className="mt-1 text-xs text-[#737C87]">
                            {status}
                          </p>
                        </div>

                        <button
                          type="button"
                          disabled={
                            snapshot?.status !== "synced" ||
                            analyzingProjectId === project._id
                          }
                          onClick={() =>
                            handleAnalyzeRepository(project._id)
                          }
                          className="rounded-xl border border-[#FF8C2B] px-3.5 py-2 text-xs font-semibold text-[#FF8C2B] transition hover:bg-[#2A1814] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {analyzingProjectId === project._id
                            ? "Analyzing..."
                            : context?.analysisStatus === "completed"
                              ? "Re-analyze"
                              : "Analyze Repository"}
                        </button>
                      </div>

                      {/* ANALYSIS MESSAGE */}
                      {analysisMessage.projectId === project._id && (
                        <p
                          className={`mt-3 text-xs ${
                            analysisMessage.type === "error"
                              ? "text-[#F2766A]"
                              : "text-[#5FC58E]"
                          }`}
                        >
                          {analysisMessage.message}
                        </p>
                      )}

                      {/* ANALYSIS ERROR */}
                      {context?.analysisStatus === "failed" && (
                        <p className="mt-3 rounded-lg border border-[#4A2927] bg-[#241514] px-3 py-2 text-xs text-[#F2766A]">
                          {context.analysisError ||
                            "Repository analysis failed."}
                        </p>
                      )}

                      {/* =================================================
                          COMPLETED ANALYSIS
                      ================================================= */}
                      {context?.analysisStatus === "completed" && (
                        <>
                          {/* TECHNOLOGY SUMMARY */}
                          <div className="mt-4 grid gap-2 sm:grid-cols-4">
                            {[
                              ["Languages", technologies.languages],
                              ["Frontend", technologies.frontend],
                              ["Backend", technologies.backend],
                              ["Frameworks", technologies.frameworks],
                            ].map(([label, items]) => (
                              <div
                                key={label}
                                className="rounded-xl border border-[#252C35] bg-[#151A21] px-3 py-3"
                              >
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#626C78]">
                                  {label}
                                </p>

                                <p className="mt-1 truncate text-xs font-medium text-[#C8CED6]">
                                  {values(items)}
                                </p>
                              </div>
                            ))}
                          </div>

                          {/* DETAILS TOGGLE */}
                          <button
                            type="button"
                            onClick={() =>
                              toggleAnalysisDetails(project._id)
                            }
                            className="mt-4 text-xs font-semibold text-[#FF8C2B] transition hover:text-[#FF8C2B]"
                          >
                            {expandedAnalysisProjects[project._id]
                              ? "Hide details"
                              : "View full analysis"}
                          </button>

                          {/* =================================================
                              FULL ANALYSIS
                          ================================================= */}
                          {expandedAnalysisProjects[project._id] && (
                            <div className="mt-5 space-y-5 border-t border-[#252C35] pt-5">

                              {/* DETAIL TABS */}
                              <div className="flex gap-1 overflow-x-auto border-b border-[#252C35] pb-2">
                                {[
                                  ["overview", "Overview"],
                                  ["codebase", "Codebase"],
                                  ["activity", "Activity"],
                                ].map(([tab, label]) => (
                                  <button
                                    key={tab}
                                    type="button"
                                    onClick={() =>
                                      setAnalysisDetailTab(
                                        project._id,
                                        tab
                                      )
                                    }
                                    className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition ${
                                      detailTab === tab
                                        ? "bg-[#2A1814] text-[#FF8C2B]"
                                        : "text-[#737C87] hover:bg-[#1D242D] hover:text-[#E8D889]"
                                    }`}
                                  >
                                    {label}
                                  </button>
                                ))}
                              </div>

                              {/* =================================================
                                  CODEBASE TECHNOLOGIES
                              ================================================= */}
                              {detailTab === "codebase" && (
                                <div className="grid gap-3 sm:grid-cols-2">
                                  {[
                                    ["Languages", technologies.languages],
                                    ["Frontend", technologies.frontend],
                                    ["Backend", technologies.backend],
                                    ["Frameworks", technologies.frameworks],
                                    ["Database", technologies.database],
                                    [
                                      "Authentication",
                                      technologies.authentication,
                                    ],
                                    ["Testing", technologies.testing],
                                    [
                                      "Deployment",
                                      technologies.deployment,
                                    ],
                                  ].map(([label, items]) => (
                                    <div
                                      key={label}
                                      className="rounded-xl border border-[#252C35] bg-[#151A21] p-3"
                                    >
                                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#626C78]">
                                        {label}
                                      </p>

                                      <p className="mt-1 text-xs font-medium text-[#C8CED6]">
                                        {values(items)}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* =================================================
                                  OVERVIEW
                              ================================================= */}
                              {detailTab === "overview" && (
                                <div className="rounded-xl border border-[#252C35] bg-[#151A21] p-4">
                                  <p className="text-xs font-semibold text-[#E8D889]">
                                    Summary
                                  </p>

                                  <p className="mt-1 text-sm leading-6 text-[#858D97]">
                                    {context.summary ||
                                      "Not detected"}
                                  </p>

                                  <div className="mt-5 border-t border-[#252C35] pt-4">
                                    <p className="text-xs font-semibold text-[#E8D889]">
                                      Architecture
                                    </p>

                                    <p className="mt-1 text-sm leading-6 text-[#858D97]">
                                      {context.architecture ||
                                        "Not detected"}
                                    </p>
                                  </div>
                                </div>
                              )}

                              {/* =================================================
                                  IMPORTANT FILES + STRUCTURE
                              ================================================= */}
                              {detailTab === "codebase" && (
                                <div className="grid gap-5 md:grid-cols-2">

                                  <div className="rounded-xl border border-[#252C35] bg-[#151A21] p-4">
                                    <p className="text-xs font-semibold text-[#E8D889]">
                                      Important files
                                    </p>

                                    <div className="mt-3 space-y-2">
                                      {context.importantFiles?.length ? (
                                        context.importantFiles
                                          .slice(0, 8)
                                          .map((file) => (
                                            <p
                                              key={file.path}
                                              className="truncate rounded-lg bg-[#10151B] px-3 py-2 font-mono text-[11px] text-[#858D97]"
                                            >
                                              {file.path}
                                            </p>
                                          ))
                                      ) : (
                                        <p className="text-xs text-[#626C78]">
                                          Not detected
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  <div className="rounded-xl border border-[#252C35] bg-[#151A21] p-4">
                                    <p className="text-xs font-semibold text-[#E8D889]">
                                      Project structure
                                    </p>

                                    <div className="mt-3 space-y-2">
                                      {context.projectStructure?.length ? (
                                        context.projectStructure
                                          .slice(0, 8)
                                          .map((file) => (
                                            <p
                                              key={file.path}
                                              className="truncate rounded-lg bg-[#10151B] px-3 py-2 font-mono text-[11px] text-[#858D97]"
                                            >
                                              {file.path}
                                            </p>
                                          ))
                                      ) : (
                                        <p className="text-xs text-[#626C78]">
                                          Not detected
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* =================================================
                                  ACTIVITY STATS
                              ================================================= */}
                              {detailTab === "activity" && (
                                <>
                                  <div className="grid gap-3 sm:grid-cols-3">
                                    {[
                                      [
                                        "Commits",
                                        context.activity?.commits,
                                      ],
                                      [
                                        "Open issues",
                                        context.activity?.openIssues,
                                      ],
                                      [
                                        "Open pull requests",
                                        context.activity?.openPullRequests,
                                      ],
                                    ].map(([label, value]) => (
                                      <div
                                        key={label}
                                        className="rounded-xl border border-[#252C35] bg-[#151A21] p-4"
                                      >
                                        <p className="text-[10px] uppercase tracking-wider text-[#626C78]">
                                          {label}
                                        </p>

                                        <p className="mt-2 text-lg font-semibold text-[#E8D889]">
                                          {value ?? "Not detected"}
                                        </p>
                                      </div>
                                    ))}
                                  </div>

                                  {/* ACTIVITY LISTS */}
                                  <div className="grid gap-5 md:grid-cols-3">
                                    {[
                                      [
                                        "Recent commits",
                                        context.repositorySnapshot?.commits,
                                      ],
                                      [
                                        "Open issues",
                                        context.repositorySnapshot?.issues,
                                      ],
                                      [
                                        "Pull requests",
                                        context.repositorySnapshot?.pullRequests,
                                      ],
                                    ].map(([label, items]) => (
                                      <div
                                        key={label}
                                        className="rounded-xl border border-[#252C35] bg-[#151A21] p-4"
                                      >
                                        <p className="text-xs font-semibold text-[#E8D889]">
                                          {label}
                                        </p>

                                        <div className="mt-3 space-y-2">
                                          {items?.length ? (
                                            items
                                              .slice(0, 3)
                                              .map((item) => (
                                                <a
                                                  key={`${label}-${item.sha || item.number}`}
                                                  href={
                                                    item.url || undefined
                                                  }
                                                  target={
                                                    item.url
                                                      ? "_blank"
                                                      : undefined
                                                  }
                                                  rel={
                                                    item.url
                                                      ? "noreferrer"
                                                      : undefined
                                                  }
                                                  className="block truncate rounded-lg bg-[#10151B] px-3 py-2 text-xs text-[#858D97] transition hover:text-[#FF8C2B]"
                                                >
                                                  {item.message ||
                                                    item.title ||
                                                    "Not detected"}
                                                </a>
                                              ))
                                          ) : (
                                            <p className="text-xs text-[#626C78]">
                                              Not detected
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* =========================================================
            AI WORKSPACE
        ========================================================= */}
        {activeTab === "ai" && (
          <div className="overflow-hidden rounded-2xl border border-[#252C35] bg-[#151A21] shadow-[0_8px_30px_rgba(0,0,0,0.16)]">

            {/* AI HEADER */}
            <div className="flex items-center gap-3 border-b border-[#252C35] bg-[#10151B] px-5 py-4 sm:px-7">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FF8C2B] text-base text-[#E8D889] shadow-[0_0_20px_rgba(255,140,43,0.15)]">
                ✦
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#FF8C2B]">
                  Syncora Intelligence
                </p>

                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <h1 className="text-lg font-semibold tracking-tight text-[#E8D889]">
                    AI Workspace
                  </h1>

                  <p className="text-[11px] text-[#737C87]">
                    Ask questions about the selected repository's
                    engineering context.
                  </p>
                </div>
              </div>
            </div>

            {/* AI CONTENT */}
            <div className="p-4 sm:p-6">

              <div className="rounded-2xl border border-[#252C35] bg-[#10151B] p-5 sm:p-7">

                {/* AI TITLE */}
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#FF8C2B]">
                      Ask Syncora AI
                    </p>

                    <h2 className="mt-1.5 text-xl font-semibold text-[#E8D889]">
                      Project-aware engineering answers
                    </h2>

                    <p className="mt-2 max-w-2xl text-xs leading-5 text-[#737C87]">
                      Answers use the selected repository's engineering
                      context, not source-code retrieval.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={clearAiConversation}
                    className="rounded-lg px-2 py-1 text-xs font-semibold text-[#737C87] transition hover:bg-[#1D242D] hover:text-[#E8D889]"
                  >
                    Clear
                  </button>
                </div>

                {/* PROJECT SELECT */}
                <label className="mt-6 block text-xs font-semibold text-[#C8CED6]">
                  Project

                  <select
                    value={
                      aiProjectId ||
                      connectedProjects[0]?._id ||
                      ""
                    }
                    onChange={(event) => {
                      setAiProjectId(event.target.value);
                      setAiAnswer("");
                      setAiError("");
                    }}
                    className="mt-2 w-full rounded-xl border border-[#303842] bg-[#151A21] px-3 py-3 text-sm font-medium text-[#E8D889] outline-none transition focus:border-[#FF8C2B] focus:ring-2 focus:ring-[#FF8C2B]/10"
                  >
                    <option
                      value=""
                      disabled
                      className="bg-[#151A21]"
                    >
                      Select a connected project
                    </option>

                    {connectedProjects.map((project) => (
                      <option
                        key={project._id}
                        value={project._id}
                        className="bg-[#151A21]"
                      >
                        {project.name} ·{" "}
                        {project.github?.fullName ||
                          "Repository"}
                      </option>
                    ))}
                  </select>
                </label>

                {/* SUGGESTIONS */}
                <div className="mt-5">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#626C78]">
                    Suggested questions
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {[
                      "What technologies does this project use?",
                      "Explain the project architecture.",
                      "What are the important files?",
                      "What authentication system does this project use?",
                      "What areas could be improved?",
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() =>
                          handleAskSyncora(null, suggestion)
                        }
                        disabled={
                          aiLoading ||
                          !connectedProjects.length
                        }
                        className="rounded-full border border-[#303842] bg-[#151A21] px-3 py-1.5 text-[11px] font-medium text-[#858D97] transition hover:border-[#5A332A] hover:bg-[#241613] hover:text-[#FF8C2B] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>

                {/* QUESTION FORM */}
                <form
                  onSubmit={handleAskSyncora}
                  className="mt-4 flex flex-col gap-2 sm:flex-row"
                >
                  <input
                    value={aiQuestion}
                    onChange={(event) =>
                      setAiQuestion(event.target.value)
                    }
                    maxLength={1000}
                    placeholder="Ask about this project's engineering context..."
                    className="min-w-0 flex-1 rounded-xl border border-[#303842] bg-[#151A21] px-3.5 py-3 text-sm text-[#E8D889] outline-none transition placeholder:text-[#626C78] focus:border-[#FF8C2B] focus:ring-2 focus:ring-[#FF8C2B]/10"
                  />

                  <button
                    type="submit"
                    disabled={
                      aiLoading ||
                      !connectedProjects.length
                    }
                    className="rounded-xl bg-[#FF8C2B] px-5 py-3 text-sm font-semibold text-[#E8D889] transition hover:bg-[#E84D2A] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {aiLoading ? "Thinking..." : "Ask"}
                  </button>
                </form>

                {/* LOADING */}
                {aiLoading && (
                  <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#303842] bg-[#151A21] px-3 py-3">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-[#FF8C2B]" />

                    <p className="text-xs text-[#858D97]">
                      Retrieving relevant repository files and
                      preparing an answer...
                    </p>
                  </div>
                )}

                {/* ERROR */}
                {aiError && (
                  <p className="mt-4 rounded-xl border border-[#4A2927] bg-[#241514] px-3 py-3 text-xs leading-5 text-[#F2766A]">
                    {aiError}
                  </p>
                )}

                {/* =====================================================
                    AI ANSWER
                ===================================================== */}
                {aiAnswer && (
                  <div className="mt-5 rounded-xl border border-[#30443D] bg-[#111B18] p-4">

                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#20362F] text-xs text-[#63C7A0]">
                        ✦
                      </div>

                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#63C7A0]">
                        Syncora AI
                      </p>
                    </div>

                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#CDD3DA]">
                      {aiAnswer}
                    </p>

                    {/* SOURCES */}
                    <div className="mt-5 border-t border-[#27352F] pt-4">

                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-[#E8D889]">
                          Sources used
                        </p>

                        {aiRetrieval && (
                          <span className="text-[10px] text-[#626C78]">
                            {aiRetrieval.indexed
                              ? `${aiRetrieval.chunkCount} relevant code chunks`
                              : "Engineering context only"}
                          </span>
                        )}
                      </div>

                      {aiSources.length ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {aiSources.map((source) => (
                            <a
                              key={source}
                              href={
                                selectedAiProject?.github?.url
                                  ? `${selectedAiProject.github.url}/blob/${
                                      selectedAiProject.github
                                        .branch || "main"
                                    }/${source}`
                                  : undefined
                              }
                              target={
                                selectedAiProject?.github?.url
                                  ? "_blank"
                                  : undefined
                              }
                              rel={
                                selectedAiProject?.github?.url
                                  ? "noreferrer"
                                  : undefined
                              }
                              className="rounded-lg border border-[#303842] bg-[#151A21] px-2.5 py-1.5 font-mono text-[10px] text-[#858D97] transition hover:border-[#5A332A] hover:text-[#FF8C2B]"
                            >
                              {source}
                            </a>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-2 text-xs text-[#626C78]">
                          No matching source files were retrieved.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DashboardAI;

