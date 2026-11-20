
import { motion } from "framer-motion";

const DashboardModals = ({ dashboard }) => {
  const {
    creatingProject,
    githubError,
    githubLoading,
    githubPickerOpen,
    githubRepositories,
    handleCreateProject,
    handleInviteTeammate,
    handleSaveWorkspace,
    handleSelectRepository,
    inviteDialogOpen,
    inviteEmail,
    inviteError,
    projectCollaborators,
    projectDialogOpen,
    projectError,
    projectForm,
    savingWorkspace,
    selectedWorkspaceId,
    sendingInvite,
    setGithubPickerOpen,
    setInviteDialogOpen,
    setInviteEmail,
    setProjectCollaborators,
    setProjectDialogOpen,
    setProjectForm,
    setSelectedWorkspaceId,
    setWorkspaceEdit,
    setWorkspaceEditorOpen,
    user,
    workspaceActionError,
    workspaceEdit,
    workspaceEditorOpen,
    workspaceName,
    workspaces,
  } = dashboard;

  const inputClass =
    "mt-2 w-full rounded-xl border border-[#252C35] bg-[#0F1318] px-3 py-2.5 text-sm text-[#F5F0E8] placeholder:text-[#626C78] outline-none transition focus:border-[#7AA6FF] focus:ring-2 focus:ring-[#7AA6FF]/10";

  const selectClass =
    "mt-2 w-full rounded-xl border border-[#252C35] bg-[#0F1318] px-3 py-2.5 text-sm text-[#F5F0E8] outline-none transition focus:border-[#7AA6FF] focus:ring-2 focus:ring-[#7AA6FF]/10";

  const modalOverlay =
    "fixed inset-0 z-50 flex items-center justify-center bg-[#05080C]/75 px-4 backdrop-blur-[4px]";

  const modalClass =
    "w-full rounded-2xl border border-[#252C35] bg-[#151A21] shadow-[0_24px_70px_rgba(0,0,0,0.45)]";

  const labelClass = "block text-xs font-semibold text-[#AAB2BC]";

  const secondaryButton =
    "rounded-xl border border-[#303842] bg-[#1D242D] px-4 py-2.5 text-xs font-semibold text-[#AAB2BC] transition hover:border-[#39424D] hover:bg-[#252C35] hover:text-[#F5F0E8]";

  const primaryButton =
    "rounded-xl bg-[#7AA6FF] px-4 py-2.5 text-xs font-semibold text-[#F5F0E8] transition hover:bg-[#7AA6FF] disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <>
      {/* =========================================================
          WORKSPACE EDITOR MODAL
      ========================================================= */}
      {workspaceEditorOpen && (
        <div className={modalOverlay}>
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`${modalClass} max-w-md p-6`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7AA6FF]">
                  Workspace settings
                </p>

                <h2 className="mt-2 text-xl font-semibold text-[#F5F0E8]">
                  Edit {workspaceName}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setWorkspaceEditorOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-xl leading-none text-[#626C78] transition hover:bg-[#1D242D] hover:text-[#F5F0E8]"
                aria-label="Close workspace editor"
              >
                ×
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <label className={labelClass}>
                Workspace name

                <input
                  value={workspaceEdit.name}
                  onChange={(event) =>
                    setWorkspaceEdit((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </label>

              <label className={labelClass}>
                Description

                <textarea
                  value={workspaceEdit.description}
                  onChange={(event) =>
                    setWorkspaceEdit((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </label>

              <label className={labelClass}>
                Privacy

                <select
                  value={workspaceEdit.visibility}
                  onChange={(event) =>
                    setWorkspaceEdit((current) => ({
                      ...current,
                      visibility: event.target.value,
                    }))
                  }
                  className={selectClass}
                >
                  <option value="private">Private</option>
                  <option value="public">Public</option>
                </select>
              </label>
            </div>

            {workspaceActionError && (
              <p className="mt-4 rounded-xl border border-[#7F3F35] bg-[#2A1715] p-3 text-xs text-[#7AA6FF]">
                {workspaceActionError}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setWorkspaceEditorOpen(false)}
                className={secondaryButton}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveWorkspace}
                disabled={savingWorkspace}
                className={primaryButton}
              >
                {savingWorkspace ? "Saving..." : "Save changes"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* =========================================================
          INVITE TEAMMATE MODAL
      ========================================================= */}
      {inviteDialogOpen && (
        <div className={modalOverlay}>
          <motion.form
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            onSubmit={handleInviteTeammate}
            className={`${modalClass} max-w-md p-6`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7AA6FF]">
                  Team
                </p>

                <h2 className="mt-2 text-xl font-semibold text-[#F5F0E8]">
                  Invite teammate
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setInviteDialogOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-xl leading-none text-[#626C78] transition hover:bg-[#1D242D] hover:text-[#F5F0E8]"
                aria-label="Close invite dialog"
              >
                ×
              </button>
            </div>

            <label className={`${labelClass} mt-6`}>
              Teammate email

              <input
                autoFocus
                type="email"
                value={inviteEmail}
                onChange={(event) => setInviteEmail(event.target.value)}
                placeholder="teammate@example.com"
                className={inputClass}
              />
            </label>

            {inviteError && (
              <p className="mt-3 rounded-xl border border-[#7F3F35] bg-[#2A1715] p-3 text-xs text-[#7AA6FF]">
                {inviteError}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setInviteDialogOpen(false)}
                className={secondaryButton}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={sendingInvite}
                className={primaryButton}
              >
                {sendingInvite ? "Sending..." : "Send invitation"}
              </button>
            </div>
          </motion.form>
        </div>
      )}

      {/* =========================================================
          GITHUB REPOSITORY MODAL
      ========================================================= */}
      {githubPickerOpen && (
        <div className={modalOverlay}>
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`${modalClass} max-w-lg p-5`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7AA6FF]">
                  GitHub
                </p>

                <h2 className="mt-1 text-xl font-semibold text-[#F5F0E8]">
                  Select a repository
                </h2>

                <p className="mt-1 text-xs text-[#858D97]">
                  Choose the repository Syncora should analyze for this
                  project.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setGithubPickerOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-xl leading-none text-[#626C78] transition hover:bg-[#1D242D] hover:text-[#F5F0E8]"
                aria-label="Close GitHub repository picker"
              >
                ×
              </button>
            </div>

            {githubLoading && (
              <div className="py-12 text-center">
                <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-[#7AA6FF] border-t-transparent" />

                <p className="mt-3 text-sm text-[#858D97]">
                  Loading repositories...
                </p>
              </div>
            )}

            {!githubLoading && githubError && (
              <div className="mt-5 rounded-xl border border-[#7F3F35] bg-[#2A1715] p-4 text-xs text-[#7AA6FF]">
                <p className="font-semibold text-[#7AA6FF]">
                  GitHub connection error
                </p>

                <p className="mt-1">{githubError}</p>
              </div>
            )}

            {!githubLoading && !githubError && (
              <div className="mt-5 max-h-80 space-y-2 overflow-y-auto pr-1">
                {githubRepositories.length ? (
                  githubRepositories.map((repository) => (
                    <button
                      key={repository.id}
                      type="button"
                      onClick={() => handleSelectRepository(repository)}
                      className="flex w-full items-center justify-between rounded-xl border border-[#252C35] bg-[#0F1318] px-4 py-3 text-left transition hover:border-[#7AA6FF] hover:bg-[#1D242D]"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-[#F5F0E8]">
                          {repository.full_name}
                        </span>

                        <span className="mt-1 block text-xs text-[#737C87]">
                          {repository.private ? "Private" : "Public"} ·{" "}
                          {repository.default_branch || "main"}
                        </span>
                      </span>

                      <span className="ml-4 shrink-0 text-xs font-semibold text-[#7AA6FF]">
                        Select
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-[#303842] bg-[#0F1318] py-10 text-center">
                    <p className="text-sm font-medium text-[#F5F0E8]">
                      No repositories available
                    </p>

                    <p className="mt-1 text-xs text-[#737C87]">
                      Make sure your GitHub account has accessible
                      repositories.
                    </p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* =========================================================
          CREATE PROJECT MODAL
      ========================================================= */}
      {projectDialogOpen && (
        <div className={modalOverlay}>
          <motion.form
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            onSubmit={handleCreateProject}
            className={`${modalClass} max-w-md p-6`}
          >
            {/* HEADER */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7AA6FF]">
                  Projects
                </p>

                <h2 className="mt-2 text-xl font-semibold text-[#F5F0E8]">
                  Create a project
                </h2>

                <p className="mt-1 text-xs text-[#737C87]">
                  Set up your engineering project and invite collaborators.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setProjectDialogOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-xl leading-none text-[#626C78] transition hover:bg-[#1D242D] hover:text-[#F5F0E8]"
                aria-label="Close project dialog"
              >
                ×
              </button>
            </div>

            {/* FORM */}
            <div className="mt-6 space-y-4">
              {/* PROJECT NAME */}
              <label className={labelClass}>
                Project name

                <input
                  autoFocus
                  required
                  value={projectForm.name}
                  onChange={(event) =>
                    setProjectForm({
                      ...projectForm,
                      name: event.target.value,
                    })
                  }
                  placeholder="e.g. Syncora web app"
                  className={inputClass}
                />
              </label>

              {/* WORKSPACE */}
              <label className={labelClass}>
                Workspace

                <select
                  value={selectedWorkspaceId}
                  onChange={(event) =>
                    setSelectedWorkspaceId(event.target.value)
                  }
                  required
                  className={selectClass}
                >
                  {workspaces.length ? (
                    workspaces.map((workspace) => (
                      <option key={workspace._id} value={workspace._id}>
                        {workspace.name}
                      </option>
                    ))
                  ) : (
                    <option
                      value={
                        user.workspace?._id ||
                        user.workspace?.id ||
                        ""
                      }
                    >
                      {workspaceName}
                    </option>
                  )}
                </select>
              </label>

              {/* DESCRIPTION */}
              <label className={labelClass}>
                Description

                <textarea
                  value={projectForm.description}
                  onChange={(event) =>
                    setProjectForm({
                      ...projectForm,
                      description: event.target.value,
                    })
                  }
                  placeholder="What is this project about?"
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </label>

              {/* COLLABORATORS */}
              <label className={labelClass}>
                <span>
                  Project collaborators
                  <span className="ml-1 font-normal text-[#626C78]">
                    Optional
                  </span>
                </span>

                <input
                  value={projectCollaborators}
                  onChange={(event) =>
                    setProjectCollaborators(event.target.value)
                  }
                  placeholder="alex@example.com, sam@example.com"
                  className={inputClass}
                />

                <span className="mt-1.5 block text-[11px] font-normal text-[#626C78]">
                  Separate emails with commas.
                </span>
              </label>
            </div>

            {/* ERROR */}
            {projectError && (
              <p className="mt-4 rounded-xl border border-[#7F3F35] bg-[#2A1715] p-3 text-xs text-[#7AA6FF]">
                {projectError}
              </p>
            )}

            {/* ACTIONS */}
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setProjectDialogOpen(false)}
                className={secondaryButton}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={creatingProject}
                className={primaryButton}
              >
                {creatingProject ? "Creating..." : "Create project"}
              </button>
            </div>
          </motion.form>
        </div>
      )}
    </>
  );
};

export default DashboardModals;

