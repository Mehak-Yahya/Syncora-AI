const DashboardTeam = ({ dashboard }) => {
  const { navigate, projects, setInviteDialogOpen, setInviteError, user } = dashboard;

  return (
            <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-7">

              <div className="flex flex-wrap items-end justify-between gap-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#FF5C35]">
                    Collaboration
                  </p>

                  <h1 className="mt-2 text-3xl font-semibold">
                    Team
                  </h1>

                  <p className="mt-2 text-sm text-[#697381]">
                    Manage members and workspace
                    invitations.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={!user.workspace}
                  onClick={() => {
                    setInviteError("");
                    setInviteDialogOpen(
                      true
                    );
                  }}
                  className="rounded-lg bg-[#FF5C35] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#E94B27] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Invite teammate
                </button>
              </div>

              {!user.workspace ? (
                <div className="mt-7 rounded-2xl border border-dashed border-[#DCE1E7] bg-white p-10 text-center">
                  <p className="text-sm font-semibold">
                    Create a workspace first
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        "/workspace/new"
                      )
                    }
                    className="mt-4 rounded-lg bg-[#FF5C35] px-4 py-2.5 text-xs font-semibold text-white"
                  >
                    Create workspace
                  </button>
                </div>
              ) : (
                <div className="mt-7 grid gap-3">
                  {(
                    user.workspace
                      .members || []
                  ).map((member) => (
                    <div
                      key={
                        member.email ||
                        member.name
                      }
                      className="flex items-center justify-between rounded-xl border border-[#DCE1E7] bg-white p-4"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25354A] text-xs font-semibold text-white">
                            {(member.name || member.email || "U").charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">
                              {member.name || "Unnamed member"}
                            </p>
                            <p className="mt-1 truncate text-xs text-[#8A929D]">
                              {member.email}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 border-t border-[#E8EAED] pt-3">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A929D]">
                            Projects
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {projects
                              .filter((project) => {
                                const email = member.email?.toLowerCase();
                                const ownerEmail = project.owner?.email?.toLowerCase();
                                const projectMemberEmails = (project.members || [])
                                  .map((projectMember) => projectMember.email?.toLowerCase())
                                  .filter(Boolean);

                                return email && (email === ownerEmail || projectMemberEmails.includes(email));
                              })
                              .map((project) => (
                                <span
                                  key={project._id}
                                  className="rounded-md bg-[#F1F4F7] px-2 py-1 text-[10px] font-medium text-[#59636F]"
                                >
                                  {project.name}
                                </span>
                              ))}
                            {!projects.some((project) => {
                              const email = member.email?.toLowerCase();
                              return email && (
                                project.owner?.email?.toLowerCase() === email ||
                                (project.members || []).some(
                                  (projectMember) => projectMember.email?.toLowerCase() === email
                                )
                              );
                            }) && (
                              <span className="text-xs text-[#8A929D]">
                                No project assigned yet
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <span className="rounded-full bg-[#F1F4F7] px-2.5 py-1 text-[10px] font-semibold capitalize text-[#697381]">
                        {member.role}
                      </span>
                    </div>
                  ))}

                  {(
                    user.workspace
                      .pendingInvites || []
                  ).map((invite) => (
                    <div
                      key={invite.email}
                      className="flex items-center justify-between rounded-xl border border-[#F0D6A7] bg-[#FFF9ED] p-4"
                    >
                      <div>
                        <p className="text-sm font-semibold">
                          {invite.email}
                        </p>

                        <p className="mt-1 text-xs text-[#C47A16]">
                          Invitation pending
                        </p>
                      </div>

                      <span className="text-xs font-semibold text-[#C47A16]">
                        Pending
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>

  );
};

export default DashboardTeam;
