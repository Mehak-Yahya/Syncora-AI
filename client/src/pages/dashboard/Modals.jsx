import { motion } from "framer-motion";

const DashboardModals = ({ dashboard }) => {
  const { creatingProject, githubError, githubLoading, githubPickerOpen, githubRepositories, handleCreateProject, handleInviteTeammate, handleSaveWorkspace, handleSelectRepository, inviteDialogOpen, inviteEmail, inviteError, projectCollaborators, projectDialogOpen, projectError, projectForm, savingWorkspace, selectedWorkspaceId, sendingInvite, setGithubPickerOpen, setInviteDialogOpen, setInviteEmail, setProjectCollaborators, setProjectDialogOpen, setProjectForm, setSelectedWorkspaceId, setWorkspaceEdit, setWorkspaceEditorOpen, user, workspaceActionError, workspaceEdit, workspaceEditorOpen, workspaceName, workspaces } = dashboard;

  return (
    <>
      {workspaceEditorOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#11161D]/40 px-4 backdrop-blur-[2px]">
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="w-full max-w-md rounded-2xl border border-[#DCE1E7] bg-white p-6 shadow-[0_24px_70px_rgba(24,32,42,0.18)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#FF5C35]">
                  Workspace settings
                </p>
                <h2 className="mt-2 text-xl font-semibold text-[#20252C]">
                  Edit {workspaceName}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setWorkspaceEditorOpen(false)}
                className="text-xl leading-none text-[#8A929D] hover:text-[#20252C]"
                aria-label="Close workspace editor"
              >
                ×
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <label className="block text-xs font-semibold text-[#39424D]">
                Workspace name
                <input
                  value={workspaceEdit.name}
                  onChange={(event) => setWorkspaceEdit((current) => ({ ...current, name: event.target.value }))}
                  className="mt-2 w-full rounded-lg border border-[#DCE1E7] px-3 py-2.5 text-sm font-normal outline-none focus:border-[#FF5C35]"
                />
              </label>
              <label className="block text-xs font-semibold text-[#39424D]">
                Description
                <textarea
                  value={workspaceEdit.description}
                  onChange={(event) => setWorkspaceEdit((current) => ({ ...current, description: event.target.value }))}
                  rows="3"
                  className="mt-2 w-full resize-none rounded-lg border border-[#DCE1E7] px-3 py-2.5 text-sm font-normal outline-none focus:border-[#FF5C35]"
                />
              </label>
              <label className="block text-xs font-semibold text-[#39424D]">
                Privacy
                <select
                  value={workspaceEdit.visibility}
                  onChange={(event) => setWorkspaceEdit((current) => ({ ...current, visibility: event.target.value }))}
                  className="mt-2 w-full rounded-lg border border-[#DCE1E7] bg-white px-3 py-2.5 text-sm font-normal capitalize outline-none focus:border-[#FF5C35]"
                >
                  <option value="private">Private</option>
                  <option value="public">Public</option>
                </select>
              </label>
            </div>

            {workspaceActionError && (
              <p className="mt-4 rounded-lg bg-[#FFF3F1] p-3 text-xs text-[#B23A2B]">
                {workspaceActionError}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setWorkspaceEditorOpen(false)}
                className="rounded-lg border border-[#DCE1E7] px-4 py-2.5 text-xs font-semibold text-[#697381] hover:bg-[#F5F6F8]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveWorkspace}
                disabled={savingWorkspace}
                className="rounded-lg bg-[#FF5C35] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#E94B27] disabled:opacity-50"
              >
                {savingWorkspace ? "Saving..." : "Save changes"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* =======================================================
          INVITE MODAL
      ======================================================= */}

      {inviteDialogOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#11161D]/40 px-4 backdrop-blur-[2px]">

          <motion.form
            initial={{
              opacity: 0,
              y: 12,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            onSubmit={
              handleInviteTeammate
            }
            className="w-full max-w-md rounded-2xl border border-[#DCE1E7] bg-white p-6 shadow-[0_24px_70px_rgba(24,32,42,0.18)]"
          >

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#FF5C35]">
                  Team
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  Invite teammate
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setInviteDialogOpen(
                    false
                  )
                }
                className="text-lg text-[#8A929D] hover:text-[#20252C]"
              >
                ×
              </button>
            </div>

            <label className="mt-6 block text-xs font-semibold text-[#39424D]">
              Teammate email

              <input
                autoFocus
                type="email"
                value={inviteEmail}
                onChange={(event) =>
                  setInviteEmail(
                    event.target.value
                  )
                }
                placeholder="teammate@example.com"
                className="mt-2 h-11 w-full rounded-lg border border-[#DCE1E7] px-3 text-sm outline-none focus:border-[#FF5C35] focus:ring-2 focus:ring-[#FF5C35]/10"
              />
            </label>

            {inviteError && (
              <p className="mt-3 rounded-lg bg-[#FFF3F1] p-3 text-xs text-[#B23A2B]">
                {inviteError}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() =>
                  setInviteDialogOpen(
                    false
                  )
                }
                className="rounded-lg border border-[#DCE1E7] px-4 py-2.5 text-xs font-semibold text-[#697381] hover:bg-[#F5F6F8]"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={sendingInvite}
                className="rounded-lg bg-[#FF5C35] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#E94B27] disabled:opacity-60"
              >
                {sendingInvite
                  ? "Sending..."
                  : "Send invitation"}
              </button>
            </div>
          </motion.form>
        </div>
      )}

      {/* =======================================================
          GITHUB MODAL
      ======================================================= */}

      {githubPickerOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#11161D]/40 px-4 backdrop-blur-[2px]">

          <motion.div
            initial={{
              opacity: 0,
              y: 12,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            className="w-full max-w-lg rounded-2xl border border-[#DCE1E7] bg-white p-5 shadow-[0_24px_70px_rgba(24,32,42,0.18)]"
          >

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#FF5C35]">
                  GitHub
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  Select a repository
                </h2>

                <p className="mt-1 text-xs text-[#697381]">
                  Choose the repository Syncora should
                  analyze for this project.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setGithubPickerOpen(
                    false
                  )
                }
                className="text-lg text-[#8A929D] hover:text-[#20252C]"
              >
                ×
              </button>
            </div>

            {githubLoading && (
              <div className="py-12 text-center">
                <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-[#FF5C35] border-t-transparent" />

                <p className="mt-3 text-sm text-[#697381]">
                  Loading repositories...
                </p>
              </div>
            )}

            {!githubLoading &&
              githubError && (
                <div className="mt-5 rounded-lg bg-[#FFF3F1] p-4 text-xs text-[#B23A2B]">
                  <p className="font-semibold">
                    GitHub connection error
                  </p>

                  <p className="mt-1">
                    {githubError}
                  </p>
                </div>
              )}

            {!githubLoading &&
              !githubError && (
                <div className="mt-5 max-h-80 space-y-2 overflow-y-auto">
                  {githubRepositories.length ? (
                    githubRepositories.map(
                      (repository) => (
                        <button
                          key={repository.id}
                          type="button"
                          onClick={() =>
                            handleSelectRepository(
                              repository
                            )
                          }
                          className="flex w-full items-center justify-between rounded-xl border border-[#E4E7EB] px-4 py-3 text-left transition hover:border-[#FF5C35] hover:bg-[#FFF9F7]"
                        >
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold">
                              {repository.full_name}
                            </span>

                            <span className="mt-1 block text-xs text-[#8A929D]">
                              {repository.private
                                ? "Private"
                                : "Public"}{" "}
                              ·{" "}
                              {repository.default_branch ||
                                "main"}
                            </span>
                          </span>

                          <span className="ml-4 shrink-0 text-xs font-semibold text-[#FF5C35]">
                            Select
                          </span>
                        </button>
                      )
                    )
                  ) : (
                    <div className="py-10 text-center">
                      <p className="text-sm font-medium">
                        No repositories available
                      </p>

                      <p className="mt-1 text-xs text-[#8A929D]">
                        Make sure your GitHub account
                        has accessible repositories.
                      </p>
                    </div>
                  )}
                </div>
              )}
          </motion.div>
        </div>
      )}

      {/* =======================================================
          CREATE PROJECT MODAL
      ======================================================= */}

      {projectDialogOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#11161D]/40 px-4 backdrop-blur-[2px]">

          <motion.form
            initial={{
              opacity: 0,
              y: 12,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            onSubmit={
              handleCreateProject
            }
            className="w-full max-w-md rounded-2xl border border-[#DCE1E7] bg-white p-6 shadow-[0_24px_70px_rgba(24,32,42,0.18)]"
          >

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#FF5C35]">
                  Projects
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  Create a project
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setProjectDialogOpen(
                    false
                  )
                }
                className="text-lg text-[#8A929D] hover:text-[#20252C]"
              >
                ×
              </button>
            </div>

            <label className="mt-6 block text-xs font-semibold text-[#39424D]">
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
                className="mt-2 h-11 w-full rounded-lg border border-[#DCE1E7] px-3 text-sm outline-none focus:border-[#FF5C35] focus:ring-2 focus:ring-[#FF5C35]/10"
              />
            </label>

            <label className="mt-4 block text-xs font-semibold text-[#39424D]">
              Workspace

              <select
                value={
                  selectedWorkspaceId
                }
                onChange={(event) =>
                  setSelectedWorkspaceId(
                    event.target.value
                  )
                }
                required
                className="mt-2 h-11 w-full rounded-lg border border-[#DCE1E7] bg-white px-3 text-sm outline-none focus:border-[#FF5C35] focus:ring-2 focus:ring-[#FF5C35]/10"
              >
                {workspaces.length ? (
                  workspaces.map(
                    (workspace) => (
                      <option
                        key={
                          workspace._id
                        }
                        value={
                          workspace._id
                        }
                      >
                        {workspace.name}
                      </option>
                    )
                  )
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

            <label className="mt-4 block text-xs font-semibold text-[#39424D]">
              Description

              <textarea
                value={
                  projectForm.description
                }
                onChange={(event) =>
                  setProjectForm({
                    ...projectForm,
                    description:
                      event.target.value,
                  })
                }
                placeholder="What is this project about?"
                rows={3}
                className="mt-2 w-full resize-none rounded-lg border border-[#DCE1E7] px-3 py-2.5 text-sm outline-none focus:border-[#FF5C35] focus:ring-2 focus:ring-[#FF5C35]/10"
              />
            </label>

            <label className="mt-4 block text-xs font-semibold text-[#39424D]">
              Project collaborators

              <span className="ml-1 font-normal text-[#8A929D]">
                Optional
              </span>

              <input
                value={
                  projectCollaborators
                }
                onChange={(event) =>
                  setProjectCollaborators(
                    event.target.value
                  )
                }
                placeholder="alex@example.com, sam@example.com"
                className="mt-2 h-11 w-full rounded-lg border border-[#DCE1E7] px-3 text-sm outline-none focus:border-[#FF5C35] focus:ring-2 focus:ring-[#FF5C35]/10"
              />

              <span className="mt-1.5 block text-[11px] font-normal text-[#8A929D]">
                Separate emails with commas.
              </span>
            </label>

            {projectError && (
              <p className="mt-3 rounded-lg bg-[#FFF3F1] p-3 text-xs text-[#B23A2B]">
                {projectError}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() =>
                  setProjectDialogOpen(
                    false
                  )
                }
                className="rounded-lg border border-[#DCE1E7] px-4 py-2.5 text-xs font-semibold text-[#697381] hover:bg-[#F5F6F8]"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  creatingProject
                }
                className="rounded-lg bg-[#FF5C35] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#E94B27] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {creatingProject
                  ? "Creating..."
                  : "Create project"}
              </button>
            </div>
          </motion.form>
        </div>
      )}
    </>
  );
};

export default DashboardModals;
