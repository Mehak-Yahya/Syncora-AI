
import { useEffect, useMemo, useRef, useState } from "react";

const DashboardWorkspace = ({ dashboard }) => {
  const {
    copiedSlug,
    handleCopyWorkspaceSlug,
    handleDeleteWorkspace,
    memberCount,
    navigate,
    openWorkspaceEditor,
    projects,
    selectedWorkspaceId,
    setInviteDialogOpen,
    setSelectedWorkspaceId,
    setUser,
    setWorkspaceDetailsExpanded,
    user,
    workspaceActionError,
    workspaceDetailsExpanded,
    workspaceName,
    workspaces,
  } = dashboard;

  const [searchQuery, setSearchQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [membersWorkspace, setMembersWorkspace] = useState(null);

  const menuRef = useRef(null);

  const safeWorkspaces = Array.isArray(workspaces) ? workspaces : [];

  const activeWorkspace =
    safeWorkspaces.find(
      (workspace) => workspace._id === selectedWorkspaceId
    ) || user?.workspace;

  const filteredWorkspaces = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return safeWorkspaces;
    }

    return safeWorkspaces.filter((workspace) => {
      const name = workspace?.name?.toLowerCase() || "";
      const description = workspace?.description?.toLowerCase() || "";
      const slug = workspace?.slug?.toLowerCase() || "";

      return (
        name.includes(query) ||
        description.includes(query) ||
        slug.includes(query)
      );
    });
  }, [safeWorkspaces, searchQuery]);

  const getWorkspaceInitials = (name = "Workspace") => {
    const words = name.trim().split(/\s+/).filter(Boolean);

    if (words.length === 1) {
      return words[0].slice(0, 2).toUpperCase();
    }

    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  };

  const getMemberCount = (workspace) => {
    if (Array.isArray(workspace?.members)) {
      return workspace.members.length;
    }

    return workspace?.memberCount || 0;
  };

  const handleWorkspaceSelect = (workspace) => {
    if (!workspace?._id) return;

    setSelectedWorkspaceId(workspace._id);

    setUser((current) => ({
      ...current,
      workspace: {
        ...(current.workspace || {}),
        ...workspace,
      },
    }));

    setOpenMenuId(null);
  };

  const handleEdit = (workspace) => {
    handleWorkspaceSelect(workspace);
    setOpenMenuId(null);
    openWorkspaceEditor();
  };

  const handleInvite = (workspace) => {
    handleWorkspaceSelect(workspace);
    setOpenMenuId(null);
    setInviteDialogOpen(true);
  };

  const handleCopySlug = (workspace) => {
    handleWorkspaceSelect(workspace);
    setOpenMenuId(null);
    handleCopyWorkspaceSlug();
  };

  const handleDelete = (workspace) => {
    handleWorkspaceSelect(workspace);
    setOpenMenuId(null);
    handleDeleteWorkspace();
  };

  const handleShowMembers = (workspace) => {
    handleWorkspaceSelect(workspace);
    setOpenMenuId(null);
    setMembersWorkspace(workspace);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!openMenuId) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [openMenuId]);

  return (
    <section className="min-h-[calc(100vh-70px)] w-full bg-[#0B0F14] px-4 py-6 text-[#F5F7FA] sm:px-7 sm:py-8">
      <div className="mx-auto w-full max-w-7xl">

        {/* =========================================================
            HEADER
        ========================================================= */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#FF8C2B]">
              Workspace
            </p>

            <h1 className="mt-1.5 text-2xl font-semibold tracking-[-0.02em] text-[#E8D889] sm:text-[28px]">
              Workspaces
            </h1>

            <p className="mt-1.5 max-w-xl text-sm leading-6 text-[#858D97]">
              Switch between workspaces and manage your teams in one place.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/workspace/new")}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#FF8C2B] px-4 text-sm font-semibold text-[#E8D889] shadow-sm transition hover:bg-[#E94B27] focus:outline-none focus:ring-2 focus:ring-[#FF8C2B]/30"
          >
            <span className="text-base leading-none">+</span>
            New workspace
          </button>
        </div>

        {/* =========================================================
            MAIN CONTAINER
        ========================================================= */}
        <div className="mt-7 rounded-2xl border border-[#252C35] bg-[#151A21] shadow-[0_8px_30px_rgba(0,0,0,0.14)]">

          {/* =======================================================
              TOOLBAR
          ======================================================= */}
          <div className="flex flex-col gap-3 border-b border-[#252C35] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4">

            {/* SEARCH */}
            <div className="relative w-full sm:max-w-sm">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#626C78]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>

              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search workspaces..."
                className="h-10 w-full rounded-xl border border-[#252C35] bg-[#0F1318] pl-9 pr-9 text-sm text-[#E8D889] outline-none transition placeholder:text-[#626C78] focus:border-[#FF8C2B] focus:ring-2 focus:ring-[#FF8C2B]/10"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-[#737C87] transition hover:bg-[#1D242D] hover:text-[#E8D889]"
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            {/* COUNT / ACTIVE */}
            <div className="flex items-center justify-between gap-3 text-xs text-[#737C87] sm:justify-end">
              <span>
                {safeWorkspaces.length}{" "}
                {safeWorkspaces.length === 1
                  ? "workspace"
                  : "workspaces"}
              </span>

              {activeWorkspace && (
                <span className="hidden h-5 w-px bg-[#303842] sm:block" />
              )}

              {activeWorkspace && (
                <span className="flex min-w-0 items-center gap-1.5">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#24B47E]" />

                  <span className="truncate text-[#858D97]">
                    {activeWorkspace.name || workspaceName}
                  </span>
                </span>
              )}
            </div>
          </div>

          {/* =======================================================
              WORKSPACE CONTENT
          ======================================================= */}
          <div className="p-4 sm:p-5">
            {safeWorkspaces.length > 0 ? (
              <>
                {/* SECTION HEADER */}
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-[#E8D889]">
                      Your workspaces
                    </h2>

                    <p className="mt-0.5 text-xs text-[#737C87]">
                      Select a workspace to make it active.
                    </p>
                  </div>

                  {searchQuery && (
                    <p className="text-xs text-[#737C87]">
                      {filteredWorkspaces.length} result
                      {filteredWorkspaces.length === 1 ? "" : "s"}
                    </p>
                  )}
                </div>

                {/* =================================================
                    WORKSPACE GRID
                ================================================= */}
                {filteredWorkspaces.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {filteredWorkspaces.map((workspace) => {
                      const isActive =
                        workspace._id === selectedWorkspaceId;

                      const workspaceMembers =
                        getMemberCount(workspace);

                      const pendingInvites = Array.isArray(
                        workspace?.pendingInvites
                      )
                        ? workspace.pendingInvites.length
                        : 0;

                      return (
                        <div
                          key={workspace._id}
                          className={`group relative rounded-xl border transition-all ${
                            isActive
                              ? "border-[#FF8C2B]/60 bg-[#1D1917] shadow-[0_4px_16px_rgba(255,140,43,0.08)]"
                              : "border-[#252C35] bg-[#10151B] hover:border-[#39424D] hover:bg-[#151A21] hover:shadow-[0_8px_20px_rgba(0,0,0,0.16)]"
                          }`}
                        >
                          {/* WORKSPACE CARD */}
                          <button
                            type="button"
                            onClick={() =>
                              handleWorkspaceSelect(workspace)
                            }
                            className="w-full p-4 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#FF8C2B]/20"
                          >
                            <div className="flex items-start gap-3 pr-8">

                              {/* INITIALS */}
                              <div
                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                                  isActive
                                    ? "bg-[#FF8C2B] text-[#E8D889]"
                                    : "bg-[#242B34] text-[#B8C0C9]"
                                }`}
                              >
                                {getWorkspaceInitials(
                                  workspace.name
                                )}
                              </div>

                              {/* INFO */}
                              <div className="min-w-0 flex-1">
                                <div className="flex min-w-0 items-center gap-2">
                                  <p className="truncate text-sm font-semibold text-[#E8D889]">
                                    {workspace.name ||
                                      "Untitled workspace"}
                                  </p>

                                  {isActive && (
                                    <span className="shrink-0 rounded-full border border-[#FF8C2B]/25 bg-[#2A211F] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#FF8C2B]">
                                      Active
                                    </span>
                                  )}
                                </div>

                                <p className="mt-1 truncate text-xs text-[#737C87]">
                                  {workspace.description ||
                                    "No workspace description"}
                                </p>
                              </div>
                            </div>

                            {/* META */}
                            <div className="mt-4 flex items-center gap-2 text-[11px] text-[#737C87]">
                              <span>
                                {workspaceMembers}{" "}
                                {workspaceMembers === 1
                                  ? "member"
                                  : "members"}
                              </span>

                              <span className="h-1 w-1 rounded-full bg-[#4A535E]" />

                              <span className="capitalize">
                                {workspace.visibility || "private"}
                              </span>

                              {pendingInvites > 0 && (
                                <>
                                  <span className="h-1 w-1 rounded-full bg-[#4A535E]" />

                                  <span className="text-[#D59A45]">
                                    {pendingInvites} pending
                                  </span>
                                </>
                              )}
                            </div>
                          </button>

                          {/* =================================================
                              WORKSPACE MENU
                          ================================================= */}
                          <div
                            ref={
                              openMenuId === workspace._id
                                ? menuRef
                                : null
                            }
                            className="absolute right-3 top-3"
                          >
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();

                                setOpenMenuId((current) =>
                                  current === workspace._id
                                    ? null
                                    : workspace._id
                                );
                              }}
                              className={`flex h-7 w-7 items-center justify-center rounded-md text-[#737C87] transition ${
                                openMenuId === workspace._id
                                  ? "bg-[#252C35] text-[#E8D889]"
                                  : "opacity-70 hover:bg-[#242B34] hover:text-[#E8D889] sm:opacity-0 sm:group-hover:opacity-100"
                              }`}
                              aria-label={`Actions for ${workspace.name}`}
                            >
                              <span className="mb-1 text-lg leading-none">
                                ···
                              </span>
                            </button>

                            {/* MENU */}
                            {openMenuId === workspace._id && (
                              <div className="absolute right-0 top-9 z-30 w-48 overflow-hidden rounded-xl border border-[#303842] bg-[#151A21] p-1.5 shadow-[0_14px_40px_rgba(0,0,0,0.4)]">

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleWorkspaceSelect(
                                      workspace
                                    )
                                  }
                                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-[#B8C0C9] transition hover:bg-[#1D242D] hover:text-[#E8D889]"
                                >
                                  <span className="w-4 text-center text-[#737C87]">
                                    ✓
                                  </span>
                                  Switch workspace
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleEdit(workspace)
                                  }
                                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-[#B8C0C9] transition hover:bg-[#1D242D] hover:text-[#E8D889]"
                                >
                                  <span className="w-4 text-center text-[#737C87]">
                                    ✎
                                  </span>
                                  Edit workspace
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleShowMembers(workspace)
                                  }
                                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-[#B8C0C9] transition hover:bg-[#1D242D] hover:text-[#E8D889]"
                                >
                                  <span className="w-4 text-center text-[#737C87]">
                                    ♙
                                  </span>
                                  View members
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleInvite(workspace)
                                  }
                                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-[#B8C0C9] transition hover:bg-[#1D242D] hover:text-[#E8D889]"
                                >
                                  <span className="w-4 text-center text-[#737C87]">
                                    +
                                  </span>
                                  Invite member
                                </button>

                                <div className="my-1 border-t border-[#252C35]" />

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleCopySlug(workspace)
                                  }
                                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-[#B8C0C9] transition hover:bg-[#1D242D] hover:text-[#E8D889]"
                                >
                                  <span className="w-4 text-center text-[#737C87]">
                                    ⧉
                                  </span>

                                  {copiedSlug
                                    ? "Copied slug"
                                    : "Copy workspace slug"}
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDelete(workspace)
                                  }
                                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-[#FF8C2B] transition hover:bg-[#2A1715] hover:text-[#FF8C2B]"
                                >
                                  <span className="w-4 text-center">
                                    ×
                                  </span>
                                  Delete workspace
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* =================================================
                      SEARCH EMPTY STATE
                  ================================================= */
                  <div className="flex min-h-[260px] flex-col items-center justify-center rounded-xl border border-dashed border-[#303842] bg-[#10151B] px-6 text-center">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1D242D] text-[#737C87] ring-1 ring-[#303842]">
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      >
                        <circle cx="11" cy="11" r="7" />
                        <path d="m20 20-4-4" />
                      </svg>
                    </div>

                    <p className="mt-4 text-sm font-semibold text-[#E8D889]">
                      No workspaces found
                    </p>

                    <p className="mt-1 max-w-xs text-xs leading-5 text-[#737C87]">
                      Try another search term or clear the search to see
                      all your workspaces.
                    </p>

                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="mt-4 rounded-xl border border-[#303842] bg-[#1D242D] px-3 py-2 text-xs font-semibold text-[#B8C0C9] transition hover:border-[#39424D] hover:bg-[#252C35] hover:text-[#E8D889]"
                    >
                      Clear search
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* =====================================================
                  NO WORKSPACE STATE
              ===================================================== */
              <div className="flex min-h-[360px] flex-col items-center justify-center rounded-xl border border-dashed border-[#303842] bg-[#10151B] px-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2A211F] text-[#FF8C2B] ring-1 ring-[#3A2A27]">
                  <span className="text-xl">+</span>
                </div>

                <h2 className="mt-4 text-sm font-semibold text-[#E8D889]">
                  No workspace yet
                </h2>

                <p className="mt-1 max-w-sm text-xs leading-5 text-[#737C87]">
                  Create your first workspace to organize projects,
                  collaborators, and team settings.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/workspace/new")}
                  className="mt-5 rounded-xl bg-[#FF8C2B] px-4 py-2.5 text-xs font-semibold text-[#E8D889] transition hover:bg-[#E94B27]"
                >
                  Create workspace
                </button>
              </div>
            )}
          </div>

          {/* =========================================================
              ERROR
          ========================================================= */}
          {workspaceActionError && (
            <div className="border-t border-[#252C35] px-4 py-4 sm:px-5">
              <div className="flex items-start gap-3 rounded-xl border border-[#7F3F35] bg-[#2A1715] px-3 py-2.5">
                <span className="mt-0.5 text-sm text-[#FF8C2B]">
                  !
                </span>

                <p className="text-xs leading-5 text-[#FF8C2B]">
                  {workspaceActionError}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===========================================================
          MEMBERS MODAL
      =========================================================== */}
      {membersWorkspace && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#05080C]/75 px-4 py-6 backdrop-blur-[4px]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setMembersWorkspace(null);
            }
          }}
        >
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-[#252C35] bg-[#151A21] shadow-[0_24px_70px_rgba(0,0,0,0.45)]">

            {/* MODAL HEADER */}
            <div className="flex items-start justify-between border-b border-[#252C35] px-5 py-4">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#FF8C2B]">
                  Workspace members
                </p>

                <h2 className="mt-1 truncate text-base font-semibold text-[#E8D889]">
                  {membersWorkspace.name}
                </h2>

                <p className="mt-0.5 text-xs text-[#737C87]">
                  {getMemberCount(membersWorkspace)}{" "}
                  {getMemberCount(membersWorkspace) === 1
                    ? "member"
                    : "members"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setMembersWorkspace(null)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-lg text-[#737C87] transition hover:bg-[#1D242D] hover:text-[#E8D889]"
                aria-label="Close members"
              >
                ×
              </button>
            </div>

            {/* MEMBERS */}
            <div className="max-h-[55vh] overflow-y-auto p-4">
              {Array.isArray(membersWorkspace.members) &&
              membersWorkspace.members.length > 0 ? (
                <div className="space-y-2">
                  {membersWorkspace.members.map((member) => (
                    <div
                      key={member.email || member.name}
                      className="flex items-center justify-between gap-3 rounded-xl border border-[#252C35] bg-[#0F1318] px-3 py-3"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#242B34] text-xs font-bold text-[#B8C0C9]">
                          {(member.name ||
                            member.email ||
                            "U")
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[#E8D889]">
                            {member.name || "Unnamed member"}
                          </p>

                          <p className="mt-0.5 truncate text-xs text-[#737C87]">
                            {member.email}
                          </p>
                        </div>
                      </div>

                      <span className="shrink-0 rounded-full border border-[#303842] bg-[#1D242D] px-2.5 py-1 text-[10px] font-semibold capitalize text-[#AAB2BC]">
                        {member.role || "member"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-[#303842] bg-[#0F1318] px-5 py-10 text-center">
                  <p className="text-sm font-semibold text-[#E8D889]">
                    No members yet
                  </p>

                  <p className="mt-1 text-xs text-[#737C87]">
                    Invite people to collaborate in this workspace.
                  </p>
                </div>
              )}

              {/* PENDING INVITES */}
              {Array.isArray(membersWorkspace.pendingInvites) &&
                membersWorkspace.pendingInvites.length > 0 && (
                  <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-xs font-semibold text-[#E8D889]">
                        Pending invitations
                      </p>

                      <span className="text-[10px] text-[#D59A45]">
                        {membersWorkspace.pendingInvites.length} pending
                      </span>
                    </div>

                    <div className="space-y-2">
                      {membersWorkspace.pendingInvites.map(
                        (invite) => (
                          <div
                            key={invite.email}
                            className="flex items-center justify-between gap-3 rounded-xl border border-[#493A25] bg-[#211B12] px-3 py-3"
                          >
                            <div className="min-w-0">
                              <p className="truncate text-xs font-semibold text-[#D8DDE3]">
                                {invite.email}
                              </p>

                              <p className="mt-0.5 text-[10px] text-[#D59A45]">
                                Invitation pending
                              </p>
                            </div>

                            <span className="shrink-0 text-[10px] font-semibold text-[#D59A45]">
                              Pending
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>

            {/* MODAL FOOTER */}
            <div className="flex items-center justify-end gap-2 border-t border-[#252C35] px-5 py-3">
              <button
                type="button"
                onClick={() => setMembersWorkspace(null)}
                className="rounded-xl border border-[#303842] bg-[#1D242D] px-3.5 py-2 text-xs font-semibold text-[#B8C0C9] transition hover:bg-[#252C35] hover:text-[#E8D889]"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  handleInvite(membersWorkspace);
                  setMembersWorkspace(null);
                }}
                className="rounded-xl bg-[#FF8C2B] px-3.5 py-2 text-xs font-semibold text-[#E8D889] transition hover:bg-[#E94B27]"
              >
                Invite member
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DashboardWorkspace;

