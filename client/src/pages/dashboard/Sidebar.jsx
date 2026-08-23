import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Bot,
  Settings,
  Search,
  Bell,
  MoreHorizontal,
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
  Sparkles,
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
    openWorkspaceEditor,
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
    Settings,
  };

  const getIcon = (label) => {
    const Icon = iconMap[label] || LayoutDashboard;
    return Icon;
  };

  return (
    <main className="min-h-screen bg-[#F5F6F8] text-[#171717]">
      <div className="flex min-h-screen">

        {/* =========================================================
            SIDEBAR
        ========================================================== */}

        <motion.aside
          initial={false}
          animate={{
            width: sidebarOpen ? 248 : 0,
          }}
          transition={{
            duration: 0.28,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="hidden shrink-0 overflow-hidden bg-[#0D1117] text-[#AAB3BF] md:flex md:flex-col"
        >
          <div
            className={`flex h-full w-[248px] flex-col px-3 py-4 ${
              sidebarOpen ? "opacity-100" : "opacity-0"
            } transition-opacity duration-200`}
          >

            {/* BRAND */}

            <div className="relative mb-5">
              <div className="absolute inset-0 -z-0 rounded-2xl bg-[#FF5C35]/10 blur-2xl" />

              <div className="relative flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.035] px-3 py-3">
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
                  className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-[0_6px_20px_rgba(0,0,0,0.25)]"
                >
                  <img
                    src={logo}
                    alt="Syncora"
                    className="h-full w-full object-contain"
                  />
                </motion.div>

                <div className="min-w-0">
                  <p className="text-[14px] font-semibold tracking-[-0.02em] text-white">
                    Syncora
                  </p>

                  <p className="mt-0.5 text-[10px] text-[#697585]">
                    Engineering OS
                  </p>
                </div>

                <div className="ml-auto">
                  <span className="block h-2 w-2 rounded-full bg-[#35D399] shadow-[0_0_10px_rgba(53,211,153,0.7)]" />
                </div>
              </div>
            </div>

            {/* WORKSPACE */}

            <div className="mb-5">
              <p className="mb-2 px-2 text-[9px] font-bold uppercase tracking-[0.18em] text-[#596473]">
                Workspace
              </p>

              <button
                type="button"
                className="group flex w-full items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.045] px-3 py-2.5 text-left transition hover:border-white/[0.1] hover:bg-white/[0.07]"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF704D] to-[#FF4F2B] text-[10px] font-bold text-white shadow-[0_4px_12px_rgba(255,92,53,0.2)]">
                  {(workspaceName || "W").charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-semibold text-white">
                    {workspaceName || "Workspace"}
                  </p>

                  <p className="mt-0.5 text-[9px] text-[#667180]">
                    Current workspace
                  </p>
                </div>

                <ChevronDown
                  size={14}
                  strokeWidth={1.8}
                  className="text-[#687383] transition group-hover:text-white"
                />
              </button>
            </div>

            {/* NAVIGATION */}

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
                      whileHover={{ x: active ? 0 : 3 }}
                      whileTap={{ scale: 0.98 }}
                      className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[11px] font-medium transition ${
                        active
                          ? "bg-[#FF5C35] text-white shadow-[0_6px_18px_rgba(255,92,53,0.18)]"
                          : "text-[#8D98A6] hover:bg-white/[0.055] hover:text-white"
                      }`}
                    >
                      {active && (
                        <motion.div
                          layoutId="activeNavIndicator"
                          className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-white"
                        />
                      )}

                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                          active
                            ? "bg-white/10"
                            : "bg-transparent group-hover:bg-white/[0.06]"
                        }`}
                      >
                        <Icon
                          size={16}
                          strokeWidth={active ? 2.2 : 1.8}
                        />
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

            {/* BOTTOM */}

            <div className="mt-auto">

              <div className="mb-3 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF5C35]/10 text-[#FF704D]">
                    <Sparkles size={15} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold text-white">
                      AI workspace
                    </p>

                    <p className="text-[8px] text-[#687383]">
                      Ready to assist
                    </p>
                  </div>

                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#35D399]" />
                </div>
              </div>

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

              <div className="mt-3 border-t border-white/[0.06] pt-3">
                <p className="px-3 text-[8px] text-[#4F5967]">
                  Syncora · Engineering OS
                </p>
              </div>
            </div>
          </div>
        </motion.aside>

        {/* =========================================================
            MAIN
        ========================================================== */}

        <div className="min-w-0 flex-1">

          {/* HEADER */}

          <header className="sticky top-0 z-30 flex h-[68px] items-center justify-between border-b border-[#E3E7EB] bg-white/90 px-4 backdrop-blur-xl sm:px-7">

            <div className="flex min-w-0 items-center gap-3">

              {/* SIDEBAR TOGGLE */}

              <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={() => setSidebarOpen((open) => !open)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#DCE1E7] bg-white text-[#66717E] transition hover:border-[#C8CED5] hover:bg-[#F7F8F9]"
                title={sidebarOpen ? "Close navigation" : "Open navigation"}
              >
                {sidebarOpen ? (
                  <X size={17} strokeWidth={1.8} />
                ) : (
                  <Menu size={17} strokeWidth={1.8} />
                )}
              </motion.button>

              {/* LOGO WHEN SIDEBAR CLOSED */}

              <AnimatePresence>
                {!sidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    className="hidden items-center gap-2 md:flex"
                  >
                    <img
                      src={logo}
                      alt="Syncora"
                      className="h-8 w-8 rounded-lg object-contain"
                    />

                    <span className="text-sm font-semibold tracking-[-0.02em] text-[#20252C]">
                      Syncora
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* WORKSPACE SELECTOR */}

              <div className="hidden h-7 w-px bg-[#E3E7EB] md:block" />

              <div className="flex min-w-0 items-center gap-2">

                <span className="hidden text-[10px] font-medium text-[#929AA5] sm:inline">
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
                          (item) => item._id === workspaceId
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
                      className="max-w-[170px] appearance-none rounded-xl border border-[#E0E4E8] bg-[#F8F9FA] py-2 pl-3 pr-8 text-[11px] font-semibold text-[#20252C] outline-none transition hover:bg-white focus:border-[#FF5C35] sm:max-w-[210px]"
                    >
                      {workspaces.map((workspace) => (
                        <option key={workspace._id} value={workspace._id}>
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
                  <span className="max-w-[180px] truncate text-[11px] font-semibold text-[#20252C]">
                    {workspaceName}
                  </span>
                )}
              </div>

              {/* SEARCH */}

              <div className="relative ml-2 hidden lg:block">
                <Search
                  size={14}
                  strokeWidth={1.8}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#929AA5]"
                />

                <input
                  aria-label="Search dashboard"
                  placeholder="Search workspace..."
                  className="h-9 w-56 rounded-xl border border-[#E0E4E8] bg-[#F8F9FA] pl-9 pr-3 text-[10px] text-[#20252C] outline-none transition placeholder:text-[#A4ABB4] focus:border-[#FF5C35] focus:bg-white focus:ring-2 focus:ring-[#FF5C35]/10"
                />
              </div>
            </div>

            {/* RIGHT */}

            <div className="relative flex items-center gap-2">

              <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                className="relative hidden h-9 w-9 items-center justify-center rounded-xl border border-[#E0E4E8] bg-white text-[#697381] transition hover:bg-[#F7F8F9] sm:flex"
                title="Notifications"
              >
                <Bell size={15} strokeWidth={1.8} />

                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#FF5C35]" />
              </motion.button>

              <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={() => setOverflowOpen((open) => !open)}
                className={`flex h-9 w-9 items-center justify-center rounded-xl border bg-white transition ${
                  overflowOpen
                    ? "border-[#FFB09E] text-[#FF5C35]"
                    : "border-[#E0E4E8] text-[#697381] hover:bg-[#F7F8F9]"
                }`}
                title="Workspace actions"
              >
                <MoreHorizontal size={17} />
              </motion.button>

              {/* USER */}

              <div className="ml-1 flex items-center gap-2.5 border-l border-[#E3E7EB] pl-3">

                <div className="hidden text-right sm:block">
                  <p className="max-w-[160px] truncate text-[10px] font-semibold text-[#252A31]">
                    {user.name || "User"}
                  </p>

                  <p className="max-w-[160px] truncate text-[8px] text-[#929AA5]">
                    {user.email || ""}
                  </p>
                </div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#26374D] to-[#111A27] text-[11px] font-semibold text-white shadow-sm"
                >
                  {(
                    user.name ||
                    user.email ||
                    "U"
                  )
                    .charAt(0)
                    .toUpperCase()}
                </motion.div>
              </div>

              {/* DROPDOWN */}

              <AnimatePresence>
                {overflowOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-12 z-50 w-60 overflow-hidden rounded-2xl border border-[#E0E4E8] bg-white p-1.5 shadow-[0_20px_50px_rgba(20,28,38,0.14)]"
                  >
                    <div className="border-b border-[#EEF0F2] px-3 py-2.5">
                      <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#9AA2AC]">
                        Workspace
                      </p>

                      <p className="mt-1 truncate text-[11px] font-semibold text-[#20252C]">
                        {workspaceName}
                      </p>
                    </div>

                    <DropdownButton
                      icon={Building2}
                      label="View workspace"
                      onClick={() => {
                        setOverflowOpen(false);
                        handleNavClick("Workspace");
                      }}
                    />

                    <DropdownButton
                      icon={Copy}
                      label="Copy workspace slug"
                      onClick={() => {
                        setOverflowOpen(false);
                        handleCopyWorkspaceSlug();
                      }}
                    />

                    <DropdownButton
                      icon={Settings}
                      label="Workspace settings"
                      onClick={() => {
                        setOverflowOpen(false);
                        openWorkspaceEditor();
                      }}
                    />

                    <DropdownButton
                      icon={UserPlus}
                      label="Members & invitations"
                      onClick={() => {
                        setOverflowOpen(false);
                        setInviteDialogOpen(true);
                      }}
                    />

                    <DropdownButton
                      icon={Plus}
                      label="New workspace"
                      onClick={() => navigate("/workspace/new")}
                    />

                    <div className="my-1 border-t border-[#EEF0F2]" />

                    <DropdownButton
                      icon={Trash2}
                      label="Delete workspace"
                      danger
                      onClick={() => {
                        setOverflowOpen(false);
                        handleDeleteWorkspace();
                      }}
                    />

                    <DropdownButton
                      icon={LogOut}
                      label="Log out"
                      danger
                      onClick={() => {
                        setOverflowOpen(false);
                        handleLogout();
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </header>

          {/* MOBILE NAV */}

          <nav className="flex gap-1 overflow-x-auto border-b border-[#E3E7EB] bg-white px-4 py-2 md:hidden">
            {navItems.map(([label]) => {
              const Icon = getIcon(label);

              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => handleNavClick(label)}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-[10px] font-semibold ${
                    activeNav === label
                      ? "bg-[#FFF0EB] text-[#E94B27]"
                      : "text-[#697381]"
                  }`}
                >
                  <Icon size={14} strokeWidth={1.9} />
                  {label}
                </button>
              );
            })}
          </nav>

          {children}
        </div>

        {modals}
      </div>
    </main>
  );
};

const DropdownButton = ({
  icon: Icon,
  label,
  onClick,
  danger = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[10px] font-medium transition ${
        danger
          ? "text-[#B23A2B] hover:bg-[#FFF3F1]"
          : "text-[#39424D] hover:bg-[#F6F7F8]"
      }`}
    >
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-lg ${
          danger
            ? "bg-[#FFF3F1]"
            : "bg-[#F3F5F7] group-hover:bg-white"
        }`}
      >
        <Icon size={14} strokeWidth={1.8} />
      </span>

      <span>{label}</span>
    </button>
  );
};

export default Sidebar;