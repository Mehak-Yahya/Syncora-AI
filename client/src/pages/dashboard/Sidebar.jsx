import { motion, AnimatePresence } from "framer-motion";

import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Bot,
  ChevronDown,
  ChevronRight,
  LogOut,
  Copy,
  UserPlus,
  Plus,
  Trash2,
  Menu,
  X,
  Building2,
  MoreHorizontal,
} from "lucide-react";

import logo from "../../assets/logo.png";

const Sidebar = ({ dashboard, children, modals }) => {
  const {
    activeNav,
    handleCopyWorkspaceSlug,
    handleDeleteWorkspace,
    handleLogout,
    handleNavClick,
    navigate,
    navItems,
    overflowOpen,
    selectedWorkspaceId,
    setInviteDialogOpen,
    setOverflowOpen,
    setSelectedWorkspaceId,
    setSidebarOpen,
    setUser,
    sidebarOpen,
    user,
    workspaceName,
    workspaces,
  } = dashboard;

  const iconMap = {
    Dashboard: LayoutDashboard,
    Overview: LayoutDashboard,
    Projects: FolderKanban,
    Team: Users,
    "AI workspace": Bot,
    Workspace: Building2,
  };

  const getIcon = (label) => {
    return iconMap[label] || LayoutDashboard;
  };

  /*
   * Mobile navigation.
   * Desktop navigation stays inside the sidebar.
   */
  const mobileNavItems = [
    "Overview",
    "Workspace",
    "Projects",
    "Team",
    "AI workspace",
  ];

  const handleMobileNav = (label) => {
    setOverflowOpen(false);
    handleNavClick(label);
  };

  const handleMobileOpen = () => {
    setOverflowOpen((current) => !current);
  };

  return (
    <main className="min-h-screen bg-[#F5F6F8] text-[#182A4A]">
      <div className="flex min-h-screen">
        {/* =========================================================
            DESKTOP SIDEBAR
            CLOSED BY DEFAULT
        ========================================================== */}

        <motion.aside
          initial={false}
          animate={{
            width: sidebarOpen ? 248 : 0,
            opacity: sidebarOpen ? 1 : 0,
          }}
          transition={{
            duration: 0.28,
            ease: [0.22, 1, 0.36, 1],
          }}
          aria-hidden={!sidebarOpen}
          className="hidden shrink-0 overflow-hidden bg-[#0B0F14] text-[#AAB3BF] md:flex md:flex-col"
        >
          <div
            className={`flex h-full w-[248px] min-w-[248px] flex-col px-3 py-4 transition-opacity duration-200 ${
              sidebarOpen
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none opacity-0"
            }`}
          >
            {/* =====================================================
                BRAND
            ====================================================== */}

            <div className="mb-5">
              <div className="flex items-center gap-3 rounded-2xl border border-[#E8D889]/[0.07] bg-[#E8D889]/[0.035] px-3 py-3">
                <motion.div
                  whileHover={{
                    rotate: -4,
                    scale: 1.05,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 15,
                  }}
                  className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#E8D889] shadow-[0_6px_20px_rgba(0,0,0,0.25)]"
                >
                  <img
                    src={logo}
                    alt="Syncora"
                    className="h-full w-full object-contain"
                  />
                </motion.div>

                <div className="min-w-0">
                  <p className="text-[14px] font-semibold tracking-[-0.02em] text-[#E8D889]">
                    Syncora
                  </p>

                  <p className="mt-0.5 text-[10px] text-[#697585]">
                    Engineering OS
                  </p>
                </div>

                <span className="ml-auto h-2 w-2 rounded-full bg-[#35D399] shadow-[0_0_10px_rgba(53,211,153,0.7)]" />
              </div>
            </div>

            {/* =====================================================
                WORKSPACE
            ====================================================== */}

            <div className="mb-5">
              <p className="mb-2 px-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#596473]">
                Workspace
              </p>

              <div className="flex w-full items-center gap-2.5 rounded-xl border border-[#E8D889]/[0.06] bg-[#E8D889]/[0.045] px-3 py-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF8C2B] to-[#FF8C2B] text-[10px] font-bold text-[#E8D889]">
                  {(workspaceName || "W").charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-semibold text-[#E8D889]">
                    {workspaceName || "Workspace"}
                  </p>

                  <p className="mt-0.5 text-[9px] text-[#667180]">
                    Current workspace
                  </p>
                </div>

                <ChevronDown size={14} className="text-[#687383]" />
              </div>
            </div>

            {/* =====================================================
                DESKTOP NAVIGATION
            ====================================================== */}

            <div>
              <p className="mb-2 px-2 text-[9px] font-bold uppercase tracking-[0.18em] text-[#596473]">
                Navigation
              </p>

              <nav className="space-y-1">
                {navItems.map(([label]) => {
                  const Icon = getIcon(label);
                  const active = activeNav === label;

                  return (
                    <motion.button
                      key={label}
                      type="button"
                      onClick={() => handleNavClick(label)}
                      whileHover={{
                        x: active ? 0 : 3,
                      }}
                      whileTap={{
                        scale: 0.98,
                      }}
                      className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[11px] font-medium transition ${
                        active
                          ? "bg-[#FF8C2B] text-[#E8D889] shadow-[0_6px_18px_rgba(255,140,43,0.18)]"
                          : "text-[#8D98A6] hover:bg-[#E8D889]/[0.055] hover:text-[#E8D889]"
                      }`}
                    >
                      {active && (
                        <motion.div
                          layoutId="activeNavIndicator"
                          className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-[#E8D889]"
                        />
                      )}

                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                          active
                            ? "bg-[#E8D889]/10"
                            : "bg-transparent group-hover:bg-[#E8D889]/[0.06]"
                        }`}
                      >
                        <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
                      </span>

                      <span>{label}</span>

                      {active && (
                        <ChevronRight
                          size={13}
                          className="ml-auto opacity-70"
                        />
                      )}
                    </motion.button>
                  );
                })}
              </nav>
            </div>

            {/* =====================================================
                DESKTOP LOGOUT
            ====================================================== */}

            <div className="mt-auto">
              <button
                type="button"
                onClick={handleLogout}
                className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[11px] font-medium text-[#8D98A6] transition hover:bg-red-500/10 hover:text-red-300"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg group-hover:bg-red-500/10">
                  <LogOut size={16} strokeWidth={1.8} />
                </span>
                Log out
              </button>

              <div className="mt-3 border-t border-[#E8D889]/[0.06] pt-3">
                <p className="px-3 text-[8px] text-[#4F5967]">
                  Syncora · Engineering OS
                </p>
              </div>
            </div>
          </div>
        </motion.aside>

        {/* =========================================================
            MAIN CONTENT
        ========================================================== */}

        <div className="min-w-0 flex-1">
          {/* =======================================================
              HEADER
          ======================================================== */}

          <header className="sticky top-0 z-50 flex h-[62px] items-center justify-between border-b border-[#E8D889]/[0.08] bg-[#0B0F14] px-3 text-[#E8D889] shadow-[0_4px_20px_rgba(0,0,0,0.08)] sm:h-[68px] sm:px-5 lg:px-7">
            {/* =====================================================
                LEFT SIDE
            ====================================================== */}

            <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
              {/* =================================================
                  DESKTOP SIDEBAR TOGGLE

                  Only visible on desktop.
                  Sidebar starts CLOSED.
              ================================================== */}

              <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setSidebarOpen((current) => !current);
                }}
                className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E8D889]/[0.1] bg-[#E8D889]/[0.05] text-[#AAB3BF] transition hover:bg-[#E8D889]/[0.09] hover:text-[#E8D889] md:flex"
                title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
                aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
                aria-expanded={sidebarOpen}
              >
                {sidebarOpen ? (
                  <X size={17} strokeWidth={1.8} />
                ) : (
                  <Menu size={17} strokeWidth={1.8} />
                )}
              </motion.button>

              {/* =================================================
                  MOBILE OPEN BUTTON

                  This replaces the three-dot navigation trigger
                  on mobile.
              ================================================== */}

              {/* MOBILE NAVIGATION BUTTON */}
              <motion.button
                type="button"
                whileTap={{ scale: 0.92 }}
                onClick={handleMobileOpen}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition md:hidden ${
                  overflowOpen
                    ? "border-[#FF8C2B]/40 bg-[#FF8C2B]/10 text-[#FF8C2B]"
                    : "border-[#E8D889]/[0.1] bg-[#E8D889]/[0.05] text-[#AAB3BF] hover:bg-[#E8D889]/[0.09] hover:text-[#E8D889]"
                }`}
                title={overflowOpen ? "Close navigation" : "Open navigation"}
                aria-label={
                  overflowOpen ? "Close navigation" : "Open navigation"
                }
                aria-expanded={overflowOpen}
              >
                {overflowOpen ? (
                  <X size={17} strokeWidth={2} />
                ) : (
                  <Menu size={17} strokeWidth={2} />
                )}
              </motion.button>
              {/* =================================================
                  LOGO
              ================================================== */}

              <div className="flex items-center gap-2">
                <img
                  src={logo}
                  alt="Syncora"
                  className="h-8 w-8 rounded-lg object-contain"
                />

                <span className="text-sm font-semibold tracking-[-0.02em] text-[#E8D889]">
                  Syncora
                </span>
              </div>

              {/* =================================================
                  DESKTOP WORKSPACE
              ================================================== */}

              <div className="hidden h-7 w-px bg-[#E8D889]/[0.1] md:block" />

              <div className="hidden min-w-0 items-center gap-2 md:flex">
                <span className="text-[10px] font-medium text-[#FFFFFF]">
                  Workspace
                </span>

                {workspaces.length > 0 ? (
                  <div className="relative">
                    <select
                      aria-label="Select workspace"
                      value={selectedWorkspaceId}
                      onChange={(event) => {
                        const workspaceId = event.target.value;

                        const workspace = workspaces.find(
                          (item) => item._id === workspaceId,
                        );

                        setSelectedWorkspaceId(workspaceId);

                        if (workspace) {
                          setUser((current) => ({
                            ...current,
                            workspace: {
                              ...(current.workspace || {}),
                              ...workspace,
                            },
                          }));
                        }
                      }}
                      className="max-w-[210px] appearance-none rounded-xl border border-[#E8D889]/[0.1] bg-[#E8D889]/[0.05] py-2 pl-3 pr-8 text-[11px] font-semibold text-[#E8D889] outline-none transition hover:bg-[#E8D889]/[0.08] focus:border-[#FF8C2B]"
                    >
                      {workspaces.map((workspace) => (
                        <option
                          key={workspace._id}
                          value={workspace._id}
                          className="bg-[#0B0F14] text-[#E8D889]"
                        >
                          {workspace.name}
                        </option>
                      ))}
                    </select>

                    <ChevronDown
                      size={13}
                      className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7C8692]"
                    />
                  </div>
                ) : (
                  <span className="max-w-[180px] truncate text-[11px] font-semibold text-[#E8D889]">
                    {workspaceName}
                  </span>
                )}
              </div>
            </div>

            {/* =====================================================
                RIGHT SIDE
            ====================================================== */}

            <div className="relative flex items-center gap-1.5 sm:gap-2">
              {/* =================================================
                  DESKTOP THREE-DOT MENU

                  Hidden on mobile.
              ================================================== */}

              <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={() => setOverflowOpen((current) => !current)}
                className={`hidden h-9 w-9 items-center justify-center rounded-xl border transition md:flex ${
                  overflowOpen
                    ? "border-[#FF8C2B]/40 bg-[#FF8C2B]/10 text-[#FF8C2B]"
                    : "border-[#E8D889]/[0.1] bg-[#E8D889]/[0.05] text-[#AAB3BF] hover:bg-[#E8D889]/[0.09] hover:text-[#E8D889]"
                }`}
                title="Workspace menu"
                aria-label="Workspace menu"
              >
                <MoreHorizontal size={18} strokeWidth={2} />
              </motion.button>

              {/* =================================================
                  USER
              ================================================== */}

              <div className="ml-1 flex items-center border-l border-[#E8D889]/[0.1] pl-2.5 sm:ml-1.5 sm:pl-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#26374D] to-[#111A27] text-[11px] font-semibold text-[#E8D889] shadow-sm"
                >
                  {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
                </motion.div>
              </div>

              {/* =================================================
                  MENU CONTENT
              ================================================== */}

              <AnimatePresence>
                {overflowOpen && (
                  <>
                    {/* MOBILE BACKDROP */}

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setOverflowOpen(false)}
                      className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] md:hidden"
                    />

                    {/* =================================================
                        MOBILE NAV MENU
                    ================================================== */}

                    <motion.div
                      initial={{
                        opacity: 0,
                        y: -6,
                        scale: 0.98,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        y: -6,
                        scale: 0.98,
                      }}
                      transition={{
                        duration: 0.15,
                      }}
                      className="fixed left-3 right-3 top-[70px] z-50 overflow-hidden rounded-2xl border border-[#E8D889]/[0.1] bg-[#11161D] p-1.5 text-[#E8D889] shadow-[0_24px_60px_rgba(0,0,0,0.35)] md:absolute md:left-auto md:right-0 md:top-12 md:w-[300px]"
                    >
                      {/* =================================================
                          MOBILE NAVIGATION
                      ================================================== */}

                      <div className="md:hidden">
                        <div className="px-3 pb-2 pt-2">
                          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#697585]">
                            Navigation
                          </p>
                        </div>

                        <div className="space-y-0.5">
                          {mobileNavItems.map((label) => {
                            const Icon = getIcon(label);
                            const active = activeNav === label;

                            return (
                              <button
                                key={label}
                                type="button"
                                onClick={() => handleMobileNav(label)}
                                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[11px] font-semibold transition ${
                                  active
                                    ? "bg-[#FF8C2B] text-[#E8D889]"
                                    : "text-[#AAB3BF] hover:bg-[#E8D889]/[0.06] hover:text-[#E8D889]"
                                }`}
                              >
                                <span
                                  className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                                    active ? "bg-[#E8D889]/10" : "bg-[#E8D889]/[0.04]"
                                  }`}
                                >
                                  <Icon
                                    size={15}
                                    strokeWidth={active ? 2.2 : 1.8}
                                  />
                                </span>

                                <span>{label}</span>

                                {active && (
                                  <ChevronRight
                                    size={14}
                                    className="ml-auto opacity-70"
                                  />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        <div className="my-2 border-t border-[#E8D889]/[0.08]" />
                      </div>

                      {/* =================================================
                          DESKTOP WORKSPACE ACTIONS
                      ================================================== */}

                      <div className="hidden md:block">
                        <div className="px-3 pb-2 pt-2">
                          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#697585]">
                            Workspace actions
                          </p>
                        </div>

                        <DropdownButton
                          icon={Copy}
                          label="Copy workspace slug"
                          dark
                          onClick={() => {
                            setOverflowOpen(false);
                            handleCopyWorkspaceSlug();
                          }}
                        />

                        <DropdownButton
                          icon={UserPlus}
                          label="Members & invitations"
                          dark
                          onClick={() => {
                            setOverflowOpen(false);
                            setInviteDialogOpen(true);
                          }}
                        />

                        <DropdownButton
                          icon={Plus}
                          label="New workspace"
                          dark
                          onClick={() => {
                            setOverflowOpen(false);
                            navigate("/workspace/new");
                          }}
                        />

                        <div className="my-1 border-t border-[#E8D889]/[0.08]" />

                        <DropdownButton
                          icon={Trash2}
                          label="Delete workspace"
                          dark
                          danger
                          onClick={() => {
                            setOverflowOpen(false);
                            handleDeleteWorkspace();
                          }}
                        />
                      </div>

                      {/* =================================================
                          MOBILE LOGOUT
                      ================================================== */}

                      <button
                        type="button"
                        onClick={() => {
                          setOverflowOpen(false);
                          handleLogout();
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[11px] font-semibold text-[#FF8C2B] transition hover:bg-red-500/10"
                      >
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/10">
                          <LogOut size={15} />
                        </span>
                        Log out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </header>

          {/* =========================================================
              PAGE CONTENT
          ========================================================== */}

          {children}
        </div>

        {/* =========================================================
            MODALS
        ========================================================== */}

        {modals}
      </div>
    </main>
  );
};

/* =============================================================
   DROPDOWN BUTTON
============================================================= */

const DropdownButton = ({
  icon: Icon,
  label,
  onClick,
  danger = false,
  dark = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[10px] font-medium transition ${
        dark
          ? danger
            ? "text-[#FF8C2B] hover:bg-red-500/10"
            : "text-[#AAB3BF] hover:bg-[#E8D889]/[0.06] hover:text-[#E8D889]"
          : danger
            ? "text-[#B23A2B] hover:bg-[#FFF3F1]"
            : "text-[#39424D] hover:bg-[#F6F7F8]"
      }`}
    >
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
          dark
            ? danger
              ? "bg-red-500/10"
              : "bg-[#E8D889]/[0.05] group-hover:bg-[#E8D889]/[0.08]"
            : danger
              ? "bg-[#FFF3F1]"
              : "bg-[#F3F5F7]"
        }`}
      >
        <Icon size={14} strokeWidth={1.8} />
      </span>

      <span>{label}</span>
    </button>
  );
};

export default Sidebar;
