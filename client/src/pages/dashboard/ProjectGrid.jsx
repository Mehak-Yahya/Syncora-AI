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
    <section className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-7 sm:py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#FF5C35]">
            Engineering workspace
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#20252C] sm:text-3xl">
            Projects
          </h1>
          <p className="mt-1.5 text-sm text-[#697381]">
            Your engineering projects
          </p>
        </div>

        <button
          type="button"
          onClick={openProjectDialog}
          className="rounded-lg bg-[#FF5C35] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#E94B27]"
        >
          + New project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="mx-auto mt-8 max-w-lg rounded-2xl border border-dashed border-[#DCE1E7] bg-white px-6 py-14 text-center shadow-sm">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF0EB] text-lg text-[#FF5C35]">
            +
          </div>
          <h2 className="mt-4 text-base font-semibold text-[#20252C]">
            No projects yet
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#697381]">
            Connect a GitHub repository to start understanding your codebase with Syncora.
          </p>
          <button
            type="button"
            onClick={openProjectDialog}
            className="mt-5 rounded-lg bg-[#FF5C35] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#E94B27]"
          >
            + Create project
          </button>
        </div>
      ) : (
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
                className="flex min-h-[246px] flex-col rounded-xl border border-[#DCE1E7] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-base font-semibold text-[#20252C]">
                      {project.name}
                    </h2>
                    <p className="mt-1 truncate text-xs text-[#697381]">
                      {project.description || "No description added."}
                    </p>
                  </div>
                  <div className="relative shrink-0">
                    <button
                      type="button"
                      onClick={() => setOpenMenuId(openMenuId === project._id ? "" : project._id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-lg text-[#697381] hover:bg-[#F5F6F8]"
                      aria-label={`Actions for ${project.name}`}
                    >
                      ...
                    </button>
                    {openMenuId === project._id && (
                      <div className="absolute right-0 top-9 z-10 w-36 rounded-lg border border-[#DCE1E7] bg-white p-1.5 shadow-lg">
                        {isConnected && (
                          <button
                            type="button"
                            onClick={() => handleSyncRepository(project._id)}
                            className="block w-full rounded-md px-2.5 py-2 text-left text-xs text-[#39424D] hover:bg-[#F5F6F8]"
                          >
                            {isSyncing ? "Syncing..." : "Sync"}
                          </button>
                        )}
                        {isConnected && isSynced && (
                          <button
                            type="button"
                            onClick={() => handleAnalyzeRepository(project._id)}
                            className="block w-full rounded-md px-2.5 py-2 text-left text-xs text-[#39424D] hover:bg-[#F5F6F8]"
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
                          className="block w-full rounded-md px-2.5 py-2 text-left text-xs text-[#39424D] hover:bg-[#F5F6F8]"
                        >
                          Settings
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProject(project._id)}
                          className="block w-full rounded-md px-2.5 py-2 text-left text-xs text-[#B23A2B] hover:bg-[#FFF3F1]"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2 text-xs">
                  <span className={`h-2 w-2 rounded-full ${isConnected ? "bg-[#20844B]" : "bg-[#B8C0CB]"}`} />
                  <span className="font-medium text-[#39424D]">
                    {isConnected ? "GitHub connected" : "Not connected"}
                  </span>
                </div>

                <div className="mt-3 min-h-[68px] border-t border-[#E8EAED] pt-3 text-[11px] text-[#697381]">
                  {isConnected ? (
                    <>
                      <p className="truncate font-medium text-[#39424D]">
                        {project.github.fullName || `${project.github.owner}/${project.github.name}`}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                        <span>Files {snapshot?.fileCount ?? snapshot?.files?.length ?? "—"}</span>
                        <span>Folders {snapshot?.folderCount ?? "—"}</span>
                      </div>
                    </>
                  ) : (
                    <p>Connect a repository to see codebase details.</p>
                  )}
                </div>

                <div className="mt-auto flex min-h-7 flex-wrap items-center gap-1.5">
                  {technologies.map((technology) => (
                    <span key={technology} className="rounded-md bg-[#F1F4F7] px-2 py-1 text-[10px] font-medium text-[#697381]">
                      {technology}
                    </span>
                  ))}
                  {!technologies.length && analysisStatus && (
                    <span className="text-[10px] text-[#8A929D]">
                      {analysisStatus === "completed" ? "Technologies not detected" : analysisStatus}
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-[#E8EAED] pt-3">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A929D]">
                    Project members
                  </span>
                  <div className="flex items-center gap-1.5">
                    {projectMembers.slice(0, 3).map((member) => (
                      <span
                        key={member.email || member._id}
                        title={member.name || member.email}
                        className="flex h-6 w-6 items-center justify-center rounded-full bg-[#25354A] text-[9px] font-semibold text-white"
                      >
                        {(member.name || member.email || "U").charAt(0).toUpperCase()}
                      </span>
                    ))}
                    {projectMembers.length > 3 && (
                      <span className="text-[10px] font-medium text-[#697381]">
                        +{projectMembers.length - 3}
                      </span>
                    )}
                    {!projectMembers.length && (
                      <span className="text-[10px] text-[#8A929D]">None</span>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-[#E8EAED] pt-3">
                  <span className="truncate pr-3 text-[10px] text-[#8A929D]">
                    {snapshot?.syncedAt || project.github?.lastSyncedAt
                      ? `Synced ${new Date(snapshot?.syncedAt || project.github.lastSyncedAt).toLocaleDateString()}`
                      : analysisMessage.projectId === project._id
                        ? analysisMessage.message
                        : "Not synced yet"}
                  </span>
                  <button
                    type="button"
                    onClick={() => openProject(project)}
                    className="shrink-0 text-xs font-semibold text-[#FF5C35] hover:text-[#E94B27]"
                  >
                    {isConnected ? "Open project ->" : "Connect GitHub ->"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {syncMessage && (
        <p className="mt-4 rounded-lg bg-white p-3 text-xs text-[#697381]">
          {syncMessage}
        </p>
      )}
    </section>
  );
};

export default ProjectGrid;