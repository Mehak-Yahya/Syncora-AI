import { useState } from "react";

const DashboardAI = ({ dashboard }) => {
  const { aiAnswer, aiError, aiLoading, aiProjectId, aiQuestion, aiRetrieval, aiSources, analysisDetailTabs, analysisMessage, analyzingProjectId, clearAiConversation, connectedProjects, engineeringContexts, expandedAnalysisProjects, handleAnalyzeRepository, handleAskSyncora, selectedAiProject, setAiAnswer, setAiError, setAiProjectId, setAiQuestion, setAnalysisDetailTab, toggleAnalysisDetails } = dashboard;
  const [activeTab, setActiveTab] = useState("repository");

  return (
            <section className="mx-auto min-h-[calc(100vh-126px)] w-full max-w-none px-4 py-5 sm:px-7 sm:py-6">

              <div className="mb-5 flex gap-1 border-b border-[#DCE1E7]">
                {[
                  ["repository", "Repository Intelligence"],
                  ["ai", "AI workspace"],
                ].map(([tab, label]) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`border-b-2 px-3 py-3 text-xs font-semibold transition sm:px-4 ${
                      activeTab === tab
                        ? "border-[#FF5C35] text-[#FF5C35]"
                        : "border-transparent text-[#697381] hover:text-[#20252C]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {activeTab === "repository" && (
              <div className="mb-6 rounded-2xl border border-[#DCE1E7] bg-white p-5 shadow-sm sm:p-7">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#FF5C35]">
                      Repository Intelligence
                    </p>
                    <h1 className="mt-2 text-2xl font-semibold tracking-tight">
                      Understand your codebase
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[#697381]">
                      Generate a structured engineering context from each synced repository.
                    </p>
                  </div>
                  <span className="rounded-full bg-[#F8F9FA] px-3 py-1.5 text-[10px] font-semibold text-[#697381]">
                    Analysis V1
                  </span>
                </div>

                {connectedProjects.length === 0 ? (
                  <p className="mt-6 rounded-xl border border-dashed border-[#DCE1E7] bg-[#F8F9FA] p-5 text-sm text-[#697381]">
                    No repository connected. Connect GitHub from a project first.
                  </p>
                ) : (
                  <div className="mt-6 space-y-5">
                    {[selectedAiProject].filter(Boolean).map((project) => {
                      const context = engineeringContexts[project._id];
                      const snapshot = project.repositorySnapshot;
                      const technologies = context?.technologies || {};
                      const detailTab = analysisDetailTabs[project._id] || "overview";
                      const analysisCardStyles = [
                        {
                          border: "border-[#F2C8BC]",
                          background: "bg-[#FFFAF8]",
                          badge: "bg-[#FFF0EB] text-[#C9472A]",
                        },
                        {
                          border: "border-[#BFDCD7]",
                          background: "bg-[#F8FCFB]",
                          badge: "bg-[#EAF7F4] text-[#277A6E]",
                        },
                        {
                          border: "border-[#C9D4E8]",
                          background: "bg-[#F9FBFF]",
                          badge: "bg-[#EDF2FB] text-[#496B9E]",
                        },
                      ][0];
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
                          className={`rounded-xl border p-5 ${analysisCardStyles.border} ${analysisCardStyles.background}`}
                        >
                          <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                              <p className={`inline-flex rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${analysisCardStyles.badge}`}>
                                Project · {project.name}
                              </p>
                              <p className="mt-1 text-sm font-semibold text-[#20252C]">
                                {project.github.fullName || "Repository not named"}
                              </p>
                              <p className="mt-1 text-xs text-[#8A929D]">
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
                              className="rounded-lg border border-[#FF5C35] px-3 py-2 text-xs font-semibold text-[#FF5C35] hover:bg-[#FFF3EF] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {analyzingProjectId === project._id
                                ? "Analyzing..."
                                : context?.analysisStatus === "completed"
                                  ? "Re-analyze"
                                  : "Analyze Repository"}
                            </button>
                          </div>

                          {analysisMessage.projectId === project._id && (
                            <p
                              className={`mt-3 text-xs ${
                                analysisMessage.type === "error"
                                  ? "text-[#B23A2B]"
                                  : "text-[#20844B]"
                              }`}
                            >
                              {analysisMessage.message}
                            </p>
                          )}

                          {context?.analysisStatus === "failed" && (
                            <p className="mt-3 text-xs text-[#B23A2B]">
                              {context.analysisError || "Repository analysis failed."}
                            </p>
                          )}

                          {context?.analysisStatus === "completed" && (
                            <>
                              <div className="mt-4 grid gap-2 sm:grid-cols-4">
                                {[
                                  ["Languages", technologies.languages],
                                  ["Frontend", technologies.frontend],
                                  ["Backend", technologies.backend],
                                  ["Frameworks", technologies.frameworks],
                                ].map(([label, items]) => (
                                  <div key={label} className="rounded-lg bg-[#F8F9FA] px-3 py-2">
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8A929D]">
                                      {label}
                                    </p>
                                    <p className="mt-1 truncate text-xs font-medium text-[#39424D]">
                                      {values(items)}
                                    </p>
                                  </div>
                                ))}
                              </div>

                              <button
                                type="button"
                                onClick={() => toggleAnalysisDetails(project._id)}
                                className="mt-4 text-xs font-semibold text-[#FF5C35] hover:text-[#D94727]"
                              >
                                {expandedAnalysisProjects[project._id]
                                  ? "Hide details"
                                  : "View full analysis"}
                              </button>

                              {expandedAnalysisProjects[project._id] && (
                            <div className="mt-5 space-y-5 border-t border-[#E8EAED] pt-5">
                              <div className="flex gap-1 overflow-x-auto border-b border-[#E8EAED] pb-2">
                                {[
                                  ["overview", "Overview"],
                                  ["codebase", "Codebase"],
                                  ["activity", "Activity"],
                                ].map(([tab, label]) => (
                                  <button
                                    key={tab}
                                    type="button"
                                    onClick={() => setAnalysisDetailTab(project._id, tab)}
                                    className={`whitespace-nowrap rounded-md px-3 py-2 text-xs font-semibold ${
                                      detailTab === tab
                                        ? "bg-[#FFF3EF] text-[#FF5C35]"
                                        : "text-[#697381] hover:bg-[#F8F9FA]"
                                    }`}
                                  >
                                    {label}
                                  </button>
                                ))}
                              </div>

                              {detailTab === "codebase" && (
                              <div className="grid gap-3 sm:grid-cols-2">
                                {[
                                  ["Languages", technologies.languages],
                                  ["Frontend", technologies.frontend],
                                  ["Backend", technologies.backend],
                                  ["Frameworks", technologies.frameworks],
                                  ["Database", technologies.database],
                                  ["Authentication", technologies.authentication],
                                  ["Testing", technologies.testing],
                                  ["Deployment", technologies.deployment],
                                ].map(([label, items]) => (
                                  <div key={label} className="rounded-lg bg-[#F8F9FA] p-3">
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8A929D]">
                                      {label}
                                    </p>
                                    <p className="mt-1 text-xs font-medium text-[#39424D]">
                                      {values(items)}
                                    </p>
                                  </div>
                                ))}
                              </div>
                              )}

                              {detailTab === "overview" && <div>
                                <p className="text-xs font-semibold text-[#39424D]">Summary</p>
                                <p className="mt-1 text-sm leading-6 text-[#697381]">
                                  {context.summary || "Not detected"}
                                </p>
                                <p className="mt-3 text-xs font-semibold text-[#39424D]">Architecture</p>
                                <p className="mt-1 text-sm leading-6 text-[#697381]">
                                  {context.architecture || "Not detected"}
                                </p>
                              </div>}

                              {detailTab === "codebase" && <div className="grid gap-5 md:grid-cols-2">
                                <div>
                                  <p className="text-xs font-semibold text-[#39424D]">Important files</p>
                                  <div className="mt-2 space-y-1">
                                    {context.importantFiles?.length ? (
                                      context.importantFiles.slice(0, 8).map((file) => (
                                        <p key={file.path} className="truncate text-xs text-[#697381]">
                                          {file.path}
                                        </p>
                                      ))
                                    ) : (
                                      <p className="text-xs text-[#8A929D]">Not detected</p>
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-[#39424D]">Project structure</p>
                                  <div className="mt-2 space-y-1">
                                    {context.projectStructure?.length ? (
                                      context.projectStructure.slice(0, 8).map((file) => (
                                        <p key={file.path} className="truncate text-xs text-[#697381]">
                                          {file.path}
                                        </p>
                                      ))
                                    ) : (
                                      <p className="text-xs text-[#8A929D]">Not detected</p>
                                    )}
                                  </div>
                                </div>
                              </div>}

                              {detailTab === "activity" && <div className="grid gap-3 sm:grid-cols-3">
                                {[
                                  ["Commits", context.activity?.commits],
                                  ["Open issues", context.activity?.openIssues],
                                  ["Open pull requests", context.activity?.openPullRequests],
                                ].map(([label, value]) => (
                                  <div key={label} className="rounded-lg border border-[#E8EAED] p-3">
                                    <p className="text-[10px] text-[#8A929D]">{label}</p>
                                    <p className="mt-1 text-sm font-semibold text-[#39424D]">
                                      {value ?? "Not detected"}
                                    </p>
                                  </div>
                                ))}
                              </div>}

                              {detailTab === "activity" && <div className="grid gap-5 md:grid-cols-3">
                                {[
                                  ["Recent commits", context.repositorySnapshot?.commits],
                                  ["Open issues", context.repositorySnapshot?.issues],
                                  ["Pull requests", context.repositorySnapshot?.pullRequests],
                                ].map(([label, items]) => (
                                  <div key={label}>
                                    <p className="text-xs font-semibold text-[#39424D]">{label}</p>
                                    <div className="mt-2 space-y-2">
                                      {items?.length ? (
                                        items.slice(0, 3).map((item) => (
                                          <a
                                            key={`${label}-${item.sha || item.number}`}
                                            href={item.url || undefined}
                                            target={item.url ? "_blank" : undefined}
                                            rel={item.url ? "noreferrer" : undefined}
                                            className="block truncate text-xs text-[#697381] hover:text-[#FF5C35]"
                                          >
                                            {item.message || item.title || "Not detected"}
                                          </a>
                                        ))
                                      ) : (
                                        <p className="text-xs text-[#8A929D]">Not detected</p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>}
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

              {activeTab === "ai" && (
              <div className="min-h-[calc(100vh-190px)] overflow-hidden rounded-xl border border-[#DCE1E7] bg-white shadow-sm">

                <div className="flex items-center gap-3 border-b border-[#F2D7CF] bg-[#FFF7F4] px-5 py-3 sm:px-7">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FF5C35] text-base text-white">
                    ✦
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#FF5C35]">
                      Syncora Intelligence
                    </p>
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <h1 className="text-lg font-semibold tracking-tight text-[#20252C]">
                        AI workspace
                      </h1>
                      <p className="text-[11px] text-[#697381]">
                        Ask questions about the selected repository's engineering context.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 sm:p-5">

                  <div className="hidden">

                    <div className="rounded-xl border border-[#E4E7EB] p-5">
                      <span className="text-lg text-[#FF5C35]">
                        ◇
                      </span>

                      <h2 className="mt-3 text-sm font-semibold">
                        Project context
                      </h2>

                      <p className="mt-2 text-xs leading-5 text-[#697381]">
                        Syncora can understand the
                        projects you are working on.
                      </p>
                    </div>

                    <div className="rounded-xl border border-[#E4E7EB] p-5">
                      <span className="text-lg text-[#FF5C35]">
                        ◈
                      </span>

                      <h2 className="mt-3 text-sm font-semibold">
                        GitHub context
                      </h2>

                      <p className="mt-2 text-xs leading-5 text-[#697381]">
                        Connected repositories become
                        part of your engineering context.
                      </p>
                    </div>

                    <div className="rounded-xl border border-[#E4E7EB] p-5">
                      <span className="text-lg text-[#FF5C35]">
                        ♧
                      </span>

                      <h2 className="mt-3 text-sm font-semibold">
                        Team context
                      </h2>

                      <p className="mt-2 text-xs leading-5 text-[#697381]">
                        Keep collaboration and engineering
                        activity connected.
                      </p>
                    </div>
                  </div>

                  <div className="mt-0 rounded-xl border border-[#DCE1E7] bg-[#F8F9FA] p-5 sm:p-7">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#FF5C35]">
                          Ask Syncora AI
                        </p>
                        <h2 className="mt-2 text-xl font-semibold">Project-aware engineering answers</h2>
                        <p className="mt-2 text-xs leading-5 text-[#697381]">
                          Answers use the selected repository's engineering context, not source-code retrieval.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={clearAiConversation}
                        className="text-xs font-semibold text-[#697381] hover:text-[#20252C]"
                      >
                        Clear
                      </button>
                    </div>

                    <label className="mt-5 block text-xs font-semibold text-[#39424D]">
                      Project
                      <select
                        value={aiProjectId || connectedProjects[0]?._id || ""}
                        onChange={(event) => {
                          setAiProjectId(event.target.value);
                          setAiAnswer("");
                          setAiError("");
                        }}
                        className="mt-2 w-full rounded-lg border border-[#DCE1E7] bg-white px-3 py-2.5 text-sm font-medium text-[#20252C] outline-none focus:border-[#FF5C35]"
                      >
                        <option value="" disabled>Select a connected project</option>
                        {connectedProjects.map((project) => (
                          <option key={project._id} value={project._id}>
                            {project.name} · {project.github?.fullName || "Repository"}
                          </option>
                        ))}
                      </select>
                    </label>

                    <div className="mt-4 flex flex-wrap gap-2">
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
                          onClick={() => handleAskSyncora(null, suggestion)}
                          disabled={aiLoading || !connectedProjects.length}
                          className="rounded-full border border-[#DCE1E7] bg-white px-3 py-1.5 text-[11px] font-medium text-[#697381] hover:border-[#FFB29F] hover:text-[#FF5C35] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>

                    <form onSubmit={handleAskSyncora} className="mt-4 flex flex-col gap-2 sm:flex-row">
                      <input
                        value={aiQuestion}
                        onChange={(event) => setAiQuestion(event.target.value)}
                        maxLength={1000}
                        placeholder="Ask about this project's engineering context..."
                        className="min-w-0 flex-1 rounded-lg border border-[#DCE1E7] bg-white px-3 py-3 text-sm outline-none focus:border-[#FF5C35]"
                      />
                      <button
                        type="submit"
                        disabled={aiLoading || !connectedProjects.length}
                        className="rounded-lg bg-[#FF5C35] px-5 py-3 text-sm font-semibold text-white hover:bg-[#E84D2A] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {aiLoading ? "Thinking..." : "Ask"}
                      </button>
                    </form>

                    {aiLoading && (
                      <p className="mt-3 text-xs text-[#697381]">
                        Retrieving relevant repository files and preparing an answer...
                      </p>
                    )}

                    {aiError && (
                      <p className="mt-3 rounded-lg border border-[#F2C8BC] bg-[#FFF4F1] px-3 py-2 text-xs text-[#B23A2B]">
                        {aiError}
                      </p>
                    )}

                    {aiAnswer && (
                      <div className="mt-4 rounded-lg border border-[#BFDCD7] bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#277A6E]">
                          Syncora AI
                        </p>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#39424D]">
                          {aiAnswer}
                        </p>
                        <div className="mt-4 border-t border-[#E8EAED] pt-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-xs font-semibold text-[#39424D]">Sources used</p>
                            {aiRetrieval && (
                              <span className="text-[10px] text-[#8A929D]">
                                {aiRetrieval.indexed
                                  ? `${aiRetrieval.chunkCount} relevant code chunks`
                                  : "Engineering context only"}
                              </span>
                            )}
                          </div>
                          {aiSources.length ? (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {aiSources.map((source) => (
                                <a
                                  key={source}
                                  href={selectedAiProject?.github?.url
                                    ? `${selectedAiProject.github.url}/blob/${selectedAiProject.github.branch || "main"}/${source}`
                                    : undefined}
                                  target={selectedAiProject?.github?.url ? "_blank" : undefined}
                                  rel={selectedAiProject?.github?.url ? "noreferrer" : undefined}
                                  className="rounded-md bg-[#F8F9FA] px-2 py-1 font-mono text-[10px] text-[#697381] hover:text-[#FF5C35]"
                                >
                                  {source}
                                </a>
                              ))}
                            </div>
                          ) : (
                            <p className="mt-1 text-xs text-[#8A929D]">
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
            </section>
  );
};

export default DashboardAI;
