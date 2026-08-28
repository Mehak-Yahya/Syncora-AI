import { useState } from "react";

const getTechnologyList = (context) => {
  const technologies = context?.technologies || {};

  return Object.values(technologies)
    .flat()
    .filter(Boolean)
    .slice(0, 4);
};

const ProjectGrid = ({ dashboard }) => {
  const {
    analysisMessage,
    analyzingProjectId,
    engineeringContexts,
    handleAnalyzeRepository,
    handleConnectGithub,
    handleDeleteProject,
    handleNavClick,
    handleSyncRepository,
    openGithubRepositoryPicker,
    openProjectDialog,
    projects,
    setAiProjectId,
    syncMessage,
    syncingProjectId,
  } = dashboard;

  const [openMenuId, setOpenMenuId] = useState("");

  const openProject = (project) => {
    setOpenMenuId("");

    if (project.github?.connected) {
      setAiProjectId(project._id);
      handleNavClick("AI workspace");
      return;
    }

    handleConnectGithub(project._id);
  };

  return (
    <section className="min-h-full w-full bg-[#0B0F14] text-[#F5F7FA]">
      <div className="mx-auto w-full max-w-[1800px] px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">

        {/* HEADER */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#FF5C35]">
              Engineering workspace
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Projects
            </h1>

            <p className="mt-1.5 text-sm text-[#858D97]">
              Your engineering projects
            </p>
          </div>

          <button
            type="button"
            onClick={openProjectDialog}
            className="rounded-xl bg-[#FF5C35] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#E94B27]"
          >
            + New project
          </button>
        </div>

        {/* EMPTY STATE */}
        {projects.length === 0 ? (
          <div className="mx-auto mt-8 max-w-lg rounded-2xl border border-dashed border-[#303842] bg-[#151A21] px-6 py-14 text-center shadow-[0_8px_25px_rgba(0,0,0,0.1)]">

            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#2A211F] text-lg text-[#FF5C35]">
              +
            </div>

            <h2 className="mt-4 text-base font-semibold text-white">
              No projects yet
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#858D97]">
              Connect a GitHub repository to start understanding your codebase
              with Syncora.
            </p>

            <button
              type="button"
              onClick={openProjectDialog}
              className="mt-5 rounded-xl bg-[#FF5C35] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#E94B27]"
            >
              + Create project
            </button>
          </div>
        ) : (
          /* PROJECT GRID */
          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => {
              const snapshot = project.repositorySnapshot;
              const context = engineeringContexts[project._id];
              const technologies = getTechnologyList(context);

              const isConnected = Boolean(project.github?.connected);
              const isSynced = snapshot?.status === "synced";
              const isAnalyzing = analyzingProjectId === project._id;
              const isSyncing = syncingProjectId === project._id;
              const analysisStatus = context?.analysisStatus;

              const projectMembers = [
                ...(project.owner ? [project.owner] : []),
                ...(project.members || []),
              ].filter(
                (member, index, members) =>
                  members.findIndex(
                    (candidate) => candidate.email === member.email
                  ) === index
              );

              return (
                <article
                  key={project._id}
                  className="flex min-h-[246px] flex-col rounded-2xl border border-[#252C35] bg-[#151A21] p-4 shadow-[0_8px_25px_rgba(0,0,0,0.1)] transition duration-200 hover:-translate-y-0.5 hover:border-[#303842] hover:bg-[#181E25] hover:shadow-[0_12px_30px_rgba(0,0,0,0.18)]"
                >

                  {/* TOP */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="truncate text-base font-semibold text-white">
                        {project.name}
                      </h2>

                      <p className="mt-1 truncate text-xs text-[#858D97]">
                        {project.description || "No description added."}
                      </p>
                    </div>

                    {/* MENU */}
                    <div className="relative shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === project._id ? "" : project._id
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-lg text-[#737C87] transition hover:bg-[#1D242D] hover:text-white"
                        aria-label={`Actions for ${project.name}`}
                      >
                        ...
                      </button>

                      {openMenuId === project._id && (
                        <div className="absolute right-0 top-9 z-10 w-36 rounded-xl border border-[#303842] bg-[#151A21] p-1.5 shadow-[0_12px_30px_rgba(0,0,0,0.35)]">

                          {isConnected && (
                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId("");
                                handleSyncRepository(project._id);
                              }}
                              className="block w-full rounded-lg px-2.5 py-2 text-left text-xs text-[#B8C0C9] transition hover:bg-[#1D242D] hover:text-white"
                            >
                              {isSyncing ? "Syncing..." : "Sync"}
                            </button>
                          )}

                          {isConnected && isSynced && (
                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId("");
                                handleAnalyzeRepository(project._id);
                              }}
                              className="block w-full rounded-lg px-2.5 py-2 text-left text-xs text-[#B8C0C9] transition hover:bg-[#1D242D] hover:text-white"
                            >
                              {isAnalyzing ? "Analyzing..." : "Analyze"}
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              setOpenMenuId("");

                              isConnected
                                ? openGithubRepositoryPicker(project._id)
                                : handleConnectGithub(project._id);
                            }}
                            className="block w-full rounded-lg px-2.5 py-2 text-left text-xs text-[#B8C0C9] transition hover:bg-[#1D242D] hover:text-white"
                          >
                            Settings
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setOpenMenuId("");
                              handleDeleteProject(project._id);
                            }}
                            className="block w-full rounded-lg px-2.5 py-2 text-left text-xs text-[#FF8F7A] transition hover:bg-[#2A1715] hover:text-[#FFB5A5]"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* GITHUB STATUS */}
                  <div className="mt-5 flex items-center gap-2 text-xs">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isConnected
                          ? "bg-[#24B47E]"
                          : "bg-[#626C78]"
                      }`}
                    />

                    <span
                      className={`font-medium ${
                        isConnected
                          ? "text-[#4ADEA3]"
                          : "text-[#858D97]"
                      }`}
                    >
                      {isConnected
                        ? "GitHub connected"
                        : "Not connected"}
                    </span>
                  </div>

                  {/* REPOSITORY INFO */}
                  <div className="mt-3 min-h-[68px] border-t border-[#252C35] pt-3 text-[11px] text-[#858D97]">
                    {isConnected ? (
                      <>
                        <p className="truncate font-medium text-[#B8C0C9]">
                          {project.github.fullName ||
                            `${project.github.owner}/${project.github.name}`}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                          <span>
                            Files{" "}
                            {snapshot?.fileCount ??
                              snapshot?.files?.length ??
                              "—"}
                          </span>

                          <span>
                            Folders {snapshot?.folderCount ?? "—"}
                          </span>
                        </div>
                      </>
                    ) : (
                      <p>
                        Connect a repository to see codebase details.
                      </p>
                    )}
                  </div>

                  {/* TECHNOLOGIES */}
                  <div className="mt-auto flex min-h-7 flex-wrap items-center gap-1.5">
                    {technologies.map((technology) => (
                      <span
                        key={technology}
                        className="rounded-md border border-[#252C35] bg-[#242B34] px-2 py-1 text-[10px] font-medium text-[#AAB2BC]"
                      >
                        {technology}
                      </span>
                    ))}

                    {!technologies.length && analysisStatus && (
                      <span className="text-[10px] text-[#737C87]">
                        {analysisStatus === "completed"
                          ? "Technologies not detected"
                          : analysisStatus}
                      </span>
                    )}
                  </div>

                  {/* MEMBERS */}
                  <div className="mt-3 flex items-center justify-between border-t border-[#252C35] pt-3">
                    <span className="truncate pr-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#737C87]">
                      Project members
                    </span>

                    <div className="flex items-center gap-1.5">
                      {projectMembers.slice(0, 3).map((member) => (
                        <span
                          key={member.email || member._id}
                          title={member.name || member.email}
                          className="flex h-6 w-6 items-center justify-center rounded-full bg-[#25354A] text-[9px] font-semibold text-white ring-1 ring-[#303842]"
                        >
                          {(member.name ||
                            member.email ||
                            "U")
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                      ))}

                      {projectMembers.length > 3 && (
                        <span className="text-[10px] font-medium text-[#737C87]">
                          +{projectMembers.length - 3}
                        </span>
                      )}

                      {!projectMembers.length && (
                        <span className="text-[10px] text-[#737C87]">
                          None
                        </span>
                      )}
                    </div>
                  </div>

                  {/* FOOTER */}
                  <div className="mt-4 flex items-center justify-between border-t border-[#252C35] pt-3">
                    <span className="truncate pr-3 text-[10px] text-[#737C87]">
                      {snapshot?.syncedAt ||
                      project.github?.lastSyncedAt
                        ? `Synced ${new Date(
                            snapshot?.syncedAt ||
                              project.github.lastSyncedAt
                          ).toLocaleDateString()}`
                        : analysisMessage.projectId === project._id
                        ? analysisMessage.message
                        : "Not synced yet"}
                    </span>

                    <button
                      type="button"
                      onClick={() => openProject(project)}
                      className="shrink-0 text-xs font-semibold text-[#FF5C35] transition hover:text-[#FF704D]"
                    >
                      {isConnected
                        ? "Open project →"
                        : "Connect GitHub →"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* SYNC MESSAGE */}
        {syncMessage && (
          <p className="mt-4 rounded-xl border border-[#252C35] bg-[#151A21] p-3 text-xs text-[#858D97]">
            {syncMessage}
          </p>
        )}
      </div>
    </section>
  );
};

export default ProjectGrid;