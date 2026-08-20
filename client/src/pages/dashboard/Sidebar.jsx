const Sidebar = ({ dashboard, children, modals }) => {
  const { activeNav, handleCopyWorkspaceSlug, handleDeleteWorkspace, handleLogout, handleNavClick, navigate, navItems, openWorkspaceEditor, overflowOpen, selectedWorkspaceId, setInviteDialogOpen, setOverflowOpen, setSelectedWorkspaceId, setSidebarOpen, setUser, sidebarOpen, user, workspaceName, workspaces } = dashboard;

  return (
    <main className="min-h-screen bg-[#F5F6F8] text-[#171717]">
      <div className="flex min-h-screen">

        {/* =====================================================
            SIDEBAR
        ===================================================== */}

        <aside
          className={`hidden shrink-0 flex-col overflow-hidden bg-[#11161D] py-5 text-[#B8C0CB] transition-all duration-200 md:flex ${
            sidebarOpen
              ? "w-[238px] px-4"
              : "w-0 px-0"
          }`}
        >
          <div
            className={`flex items-center border-b border-white/10 pb-6 ${
              sidebarOpen
                ? "gap-3 px-2"
                : "justify-center"
            }`}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FF5C35] text-sm font-bold text-white">
              S
            </div>

            {sidebarOpen && (
              <div>
                <p className="text-sm font-semibold text-white">
                  Syncora
                </p>
                <p className="text-[11px] text-[#7F8996]">
                  Engineering OS
                </p>
              </div>
            )}
          </div>

          {sidebarOpen && (
            <div className="mt-7 px-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#667180]">
                Workspace
              </p>

              <div className="mt-3 flex items-center gap-2 rounded-lg bg-white/[0.07] px-3 py-2.5 text-xs text-white">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#FF5C35] text-[11px] font-bold">
                  {workspaceName
                    .charAt(0)
                    .toUpperCase()}
                </span>

                <span className="min-w-0 flex-1 truncate">
                  {workspaceName}
                </span>

                <span className="text-[#7F8996]">
                  ⌄
                </span>
              </div>
            </div>
          )}

          <nav
            className={`${
              sidebarOpen ? "mt-8" : "mt-7"
            } space-y-1`}
          >
            {navItems.map(
              ([label, icon]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() =>
                    handleNavClick(label)
                  }
                  title={
                    !sidebarOpen
                      ? label
                      : undefined
                  }
                  className={`flex w-full items-center rounded-lg py-2.5 text-xs font-medium transition ${
                    sidebarOpen
                      ? "gap-3 px-3 text-left"
                      : "justify-center px-0"
                  } ${
                    activeNav === label
                      ? "bg-[#FF5C35] text-white"
                      : "text-[#9DA7B4] hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  <span className="flex w-5 justify-center text-sm">
                    {icon}
                  </span>

                  {sidebarOpen && label}
                </button>
              )
            )}
          </nav>

          <div className="mt-auto border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={handleLogout}
              title={
                !sidebarOpen
                  ? "Log out"
                  : undefined
              }
              className={`flex w-full items-center rounded-lg py-2.5 text-xs font-medium text-[#9DA7B4] transition hover:bg-white/[0.06] hover:text-white ${
                sidebarOpen
                  ? "gap-3 px-3 text-left"
                  : "justify-center px-0"
              }`}
            >
              <span className="w-5 text-center">
                ↪
              </span>

              {sidebarOpen && "Log out"}
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">

          {/* =====================================================
              HEADER
          ===================================================== */}

          <header className="sticky top-0 z-20 flex h-[70px] items-center justify-between border-b border-[#E1E5EA] bg-white/95 px-4 backdrop-blur sm:px-7">

            <div className="flex min-w-0 items-center gap-3">

              <button
                type="button"
                onClick={() =>
                  setSidebarOpen(
                    (open) => !open
                  )
                }
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#DCE1E7] text-base text-[#697381] transition hover:bg-[#F5F6F8]"
                title={
                  sidebarOpen
                    ? "Close navigation"
                    : "Open navigation"
                }
              >
                ☰
              </button>

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FF5C35] text-sm font-bold text-white md:hidden">
                S
              </div>

              {!sidebarOpen && (
                <div className="hidden items-center gap-2 md:flex">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF5C35] text-sm font-bold text-white">
                    S
                  </div>

                  <span className="text-sm font-semibold text-[#20252C]">
                    Syncora
                  </span>
                </div>
              )}

              <div className="flex min-w-0 items-center gap-2">
                <span className="hidden text-xs font-medium text-[#8A929D] sm:inline">
                  Workspace:
                </span>
                {workspaces.length > 0 ? (
                  <select
                    aria-label="Select workspace"
                    value={selectedWorkspaceId}
                    onChange={(event) => {
                      const workspaceId = event.target.value;
                      const workspace = workspaces.find((item) => item._id === workspaceId);
                      setSelectedWorkspaceId(workspaceId);
                      if (workspace) {
                        setUser((current) => ({
                          ...current,
                          workspace: { ...(current.workspace || {}), ...workspace },
                        }));
                      }
                    }}
                    className="max-w-[150px] rounded-md border border-[#DCE1E7] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#20252C] outline-none focus:border-[#FF5C35] sm:max-w-[180px]"
                  >
                    {workspaces.map((workspace) => (
                      <option key={workspace._id} value={workspace._id}>
                        {workspace.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="max-w-[180px] truncate text-xs font-semibold text-[#20252C]">
                    {workspaceName}
                  </span>
                )}
              </div>

              <div className="relative hidden sm:block">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8A929D]">
                  ⌕
                </span>

                <input
                  aria-label="Search dashboard"
                  placeholder="Search workspace"
                  className="h-9 w-48 rounded-lg border border-[#DCE1E7] bg-[#F8F9FA] pl-8 pr-3 text-xs outline-none transition focus:border-[#FF5C35] focus:ring-2 focus:ring-[#FF5C35]/10"
                />
              </div>
            </div>

            <div className="relative flex items-center gap-2 sm:gap-4">

              <button
                type="button"
                className="hidden h-9 w-9 items-center justify-center rounded-lg border border-[#DCE1E7] text-sm text-[#697381] transition hover:bg-[#F5F6F8] sm:flex"
                title="Notifications"
              >
                ◌
              </button>

              <button
                type="button"
                onClick={() =>
                  setOverflowOpen(
                    (open) => !open
                  )
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#DCE1E7] text-lg leading-none text-[#697381] transition hover:bg-[#F5F6F8]"
                title="Workspace actions"
              >
                ⋯
              </button>

              <span className="hidden max-w-[180px] truncate text-sm text-[#6B6862] sm:block">
                {user.email || "User"}
              </span>

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#25354A] text-xs font-semibold text-white">
                {(
                  user.name ||
                  user.email ||
                  "U"
                )
                  .charAt(0)
                  .toUpperCase()}
              </div>

              {overflowOpen && (
                <div className="absolute right-0 top-12 z-30 w-56 rounded-xl border border-[#DCE1E7] bg-white p-2 shadow-[0_14px_35px_rgba(24,32,42,0.14)]">

                  <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8A929D]">
                    Workspace actions
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setOverflowOpen(false);
                      handleNavClick(
                        "Workspace"
                      );
                    }}
                    className="flex w-full rounded-lg px-3 py-2.5 text-left text-xs font-medium text-[#39424D] hover:bg-[#F5F6F8]"
                  >
                    View workspace
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOverflowOpen(false);
                      handleCopyWorkspaceSlug();
                    }}
                    className="flex w-full rounded-lg px-3 py-2.5 text-left text-xs font-medium text-[#39424D] hover:bg-[#F5F6F8]"
                  >
                    Copy workspace slug
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOverflowOpen(false);
                      openWorkspaceEditor();
                    }}
                    className="flex w-full rounded-lg px-3 py-2.5 text-left text-xs font-medium text-[#39424D] hover:bg-[#F5F6F8]"
                  >
                    Workspace settings
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOverflowOpen(false);
                      setInviteDialogOpen(true);
                    }}
                    className="flex w-full rounded-lg px-3 py-2.5 text-left text-xs font-medium text-[#39424D] hover:bg-[#F5F6F8]"
                  >
                    Members and invitations
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/workspace/new")}
                    className="flex w-full rounded-lg px-3 py-2.5 text-left text-xs font-medium text-[#39424D] hover:bg-[#F5F6F8]"
                  >
                    New workspace
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOverflowOpen(false);
                      handleDeleteWorkspace();
                    }}
                    className="flex w-full rounded-lg px-3 py-2.5 text-left text-xs font-medium text-[#B23A2B] hover:bg-[#FFF3F1]"
                  >
                    Delete workspace
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOverflowOpen(false);
                      setSidebarOpen(true);
                    }}
                    className="flex w-full rounded-lg px-3 py-2.5 text-left text-xs font-medium text-[#39424D] hover:bg-[#F5F6F8]"
                  >
                    Open side navigation
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full rounded-lg px-3 py-2.5 text-left text-xs font-medium text-[#B23A2B] hover:bg-[#FFF3F1]"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </header>

          {/* =====================================================
              MOBILE NAV
          ===================================================== */}

          <nav className="flex gap-1 overflow-x-auto border-b border-[#E1E5EA] bg-white px-4 py-2 md:hidden">
            {navItems.map(
              ([label, icon]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() =>
                    handleNavClick(label)
                  }
                  className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${
                    activeNav === label
                      ? "bg-[#FFF0EB] text-[#E94B27]"
                      : "text-[#697381]"
                  }`}
                >
                  <span>{icon}</span>
                  {label}
                </button>
              )
            )}
          </nav>
          {children}
        </div>

        {modals}
      </div>
    </main>
  );
};

export default Sidebar;
