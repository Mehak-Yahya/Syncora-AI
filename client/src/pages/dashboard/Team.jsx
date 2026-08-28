
const DashboardTeam = ({ dashboard }) => {
  const {
    navigate,
    projects,
    setInviteDialogOpen,
    setInviteError,
    user,
  } = dashboard;

  const members = user?.workspace?.members || [];
  const pendingInvites = user?.workspace?.pendingInvites || [];

  return (
    <section className="min-h-[calc(100vh-70px)] w-full bg-[#0B0F14] px-4 py-6 text-[#F5F7FA] sm:px-7 sm:py-8">
      <div className="mx-auto w-full max-w-7xl">

        {/* =========================================================
            HEADER
        ========================================================= */}
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#FF5C35]">
              Collaboration
            </p>

            <h1 className="mt-1.5 text-2xl font-semibold tracking-[-0.02em] text-white sm:text-[28px]">
              Team
            </h1>

            <p className="mt-1.5 text-sm leading-6 text-[#858D97]">
              Manage members and workspace invitations.
            </p>
          </div>

          <button
            type="button"
            disabled={!user?.workspace}
            onClick={() => {
              setInviteError("");
              setInviteDialogOpen(true);
            }}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#FF5C35] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#E94B27] focus:outline-none focus:ring-2 focus:ring-[#FF5C35]/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="mr-2 text-base leading-none">+</span>
            Invite teammate
          </button>
        </div>

        {/* =========================================================
            NO WORKSPACE
        ========================================================= */}
        {!user?.workspace ? (
          <div className="mt-7 flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#303842] bg-[#151A21] px-6 text-center shadow-[0_8px_30px_rgba(0,0,0,0.14)]">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2A211F] text-[#FF5C35] ring-1 ring-[#3A2A27]">
              <span className="text-xl">+</span>
            </div>

            <h2 className="mt-4 text-sm font-semibold text-white">
              Create a workspace first
            </h2>

            <p className="mt-1 max-w-sm text-xs leading-5 text-[#737C87]">
              Create a workspace before inviting teammates and
              managing your team.
            </p>

            <button
              type="button"
              onClick={() => navigate("/workspace/new")}
              className="mt-5 rounded-xl bg-[#FF5C35] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#E94B27]"
            >
              Create workspace
            </button>
          </div>
        ) : (
          <div className="mt-7">

            {/* =======================================================
                TEAM SUMMARY
            ======================================================= */}
            <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

              <div className="rounded-xl border border-[#252C35] bg-[#151A21] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#737C87]">
                  Members
                </p>

                <p className="mt-2 text-2xl font-semibold text-white">
                  {members.length}
                </p>

                <p className="mt-1 text-xs text-[#626C78]">
                  Active workspace members
                </p>
              </div>

              <div className="rounded-xl border border-[#252C35] bg-[#151A21] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#737C87]">
                  Projects
                </p>

                <p className="mt-2 text-2xl font-semibold text-white">
                  {Array.isArray(projects) ? projects.length : 0}
                </p>

                <p className="mt-1 text-xs text-[#626C78]">
                  Workspace projects
                </p>
              </div>

              <div className="rounded-xl border border-[#252C35] bg-[#151A21] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#737C87]">
                  Invitations
                </p>

                <p className="mt-2 text-2xl font-semibold text-white">
                  {pendingInvites.length}
                </p>

                <p className="mt-1 text-xs text-[#626C78]">
                  Pending invitations
                </p>
              </div>
            </div>

            {/* =======================================================
                TEAM LIST
            ======================================================= */}
            <div className="rounded-2xl border border-[#252C35] bg-[#151A21] shadow-[0_8px_30px_rgba(0,0,0,0.14)]">

              {/* LIST HEADER */}
              <div className="flex items-center justify-between border-b border-[#252C35] px-4 py-4 sm:px-5">
                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Workspace members
                  </h2>

                  <p className="mt-0.5 text-xs text-[#737C87]">
                    People who have access to this workspace.
                  </p>
                </div>

                <span className="rounded-full border border-[#303842] bg-[#1D242D] px-2.5 py-1 text-[10px] font-semibold text-[#AAB2BC]">
                  {members.length}{" "}
                  {members.length === 1 ? "member" : "members"}
                </span>
              </div>

              {/* MEMBERS */}
              <div className="p-4 sm:p-5">
                {members.length > 0 ? (
                  <div className="grid gap-3">

                    {members.map((member) => {
                      const email = member.email?.toLowerCase();

                      const memberProjects = (
                        Array.isArray(projects) ? projects : []
                      ).filter((project) => {
                        const ownerEmail =
                          project.owner?.email?.toLowerCase();

                        const projectMemberEmails = (
                          project.members || []
                        )
                          .map(
                            (projectMember) =>
                              projectMember.email?.toLowerCase()
                          )
                          .filter(Boolean);

                        return (
                          email &&
                          (
                            email === ownerEmail ||
                            projectMemberEmails.includes(email)
                          )
                        );
                      });

                      return (
                        <div
                          key={member.email || member.name}
                          className="rounded-xl border border-[#252C35] bg-[#10151B] p-4 transition hover:border-[#39424D] hover:bg-[#151A21]"
                        >
                          {/* MEMBER TOP */}
                          <div className="flex items-start justify-between gap-4">

                            <div className="flex min-w-0 items-center gap-3">

                              {/* AVATAR */}
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#242B34] text-xs font-bold text-[#C3CAD2] ring-1 ring-[#303842]">
                                {(member.name ||
                                  member.email ||
                                  "U")
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              {/* INFO */}
                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-white">
                                  {member.name ||
                                    "Unnamed member"}
                                </p>

                                <p className="mt-1 truncate text-xs text-[#737C87]">
                                  {member.email}
                                </p>
                              </div>
                            </div>

                            {/* ROLE */}
                            <span className="shrink-0 rounded-full border border-[#303842] bg-[#1D242D] px-2.5 py-1 text-[10px] font-semibold capitalize text-[#AAB2BC]">
                              {member.role || "member"}
                            </span>
                          </div>

                          {/* PROJECTS */}
                          <div className="mt-4 border-t border-[#252C35] pt-3">
                            <div className="flex items-center justify-between">
                              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#737C87]">
                                Projects
                              </p>

                              {memberProjects.length > 0 && (
                                <span className="text-[10px] text-[#626C78]">
                                  {memberProjects.length}{" "}
                                  {memberProjects.length === 1
                                    ? "project"
                                    : "projects"}
                                </span>
                              )}
                            </div>

                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {memberProjects.map((project) => (
                                <span
                                  key={project._id}
                                  className="rounded-lg border border-[#303842] bg-[#1D242D] px-2.5 py-1 text-[10px] font-medium text-[#AAB2BC]"
                                >
                                  {project.name}
                                </span>
                              ))}

                              {memberProjects.length === 0 && (
                                <span className="text-xs text-[#626C78]">
                                  No project assigned yet
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* =================================================
                      EMPTY MEMBERS
                  ================================================= */
                  <div className="flex min-h-[240px] flex-col items-center justify-center rounded-xl border border-dashed border-[#303842] bg-[#10151B] px-6 text-center">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1D242D] text-[#737C87] ring-1 ring-[#303842]">
                      <span className="text-lg">♙</span>
                    </div>

                    <p className="mt-4 text-sm font-semibold text-white">
                      No members yet
                    </p>

                    <p className="mt-1 max-w-xs text-xs leading-5 text-[#737C87]">
                      Invite teammates to start collaborating in
                      this workspace.
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setInviteError("");
                        setInviteDialogOpen(true);
                      }}
                      className="mt-4 rounded-xl bg-[#FF5C35] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#E94B27]"
                    >
                      Invite teammate
                    </button>
                  </div>
                )}

                {/* =================================================
                    PENDING INVITATIONS
                ================================================= */}
                {pendingInvites.length > 0 && (
                  <div className="mt-5">

                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-white">
                          Pending invitations
                        </h3>

                        <p className="mt-0.5 text-xs text-[#737C87]">
                          Invitations that haven't been accepted yet.
                        </p>
                      </div>

                      <span className="rounded-full border border-[#493A25] bg-[#211B12] px-2.5 py-1 text-[10px] font-semibold text-[#D59A45]">
                        {pendingInvites.length} pending
                      </span>
                    </div>

                    <div className="grid gap-2">
                      {pendingInvites.map((invite) => (
                        <div
                          key={invite.email}
                          className="flex items-center justify-between gap-3 rounded-xl border border-[#493A25] bg-[#211B12] px-4 py-3"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#302719] text-xs font-semibold text-[#D59A45]">
                              @
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-[#D8DDE3]">
                                {invite.email}
                              </p>

                              <p className="mt-0.5 text-[10px] text-[#D59A45]">
                                Invitation pending
                              </p>
                            </div>
                          </div>

                          <span className="shrink-0 rounded-full border border-[#594628] bg-[#302719] px-2.5 py-1 text-[10px] font-semibold text-[#D59A45]">
                            Pending
                          </span>
                        </div>
                      ))}
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

export default DashboardTeam;

