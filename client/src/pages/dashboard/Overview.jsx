import { motion } from "framer-motion";
import { useMemo, useState } from "react";

const DashboardOverview = ({ dashboard }) => {
  const {
    connectedProjects = [],
    githubError = "",
    handleConnectGithub,
    handleInvitation,
    handleNavClick,
    handleSyncRepository,
    memberCount = 0,
    openProjectDialog,
    projects = [],
    syncingProjectId,
    user = {},
    workspaceName,
  } = dashboard;

  const [range, setRange] = useState("7D");
  const [projectFilter, setProjectFilter] = useState("All");

  const firstName = user.name?.split(" ")[0] || "there";

  const activeProjects = projects.filter(
    (project) =>
      !project.status || project.status.toLowerCase() === "active"
  ).length;

  const githubPercentage = projects.length
    ? Math.min(
        100,
        Math.round((connectedProjects.length / projects.length) * 100)
      )
    : 0;

  const pendingInvitations = user.invitations?.length || 0;

  const activitySets = {
    "24H": [31, 44, 39, 57, 51, 68, 61, 76, 70, 83, 78, 91],
    "7D": [38, 52, 46, 69, 58, 82, 73, 94, 79, 90, 85, 98],
    "30D": [45, 39, 61, 53, 70, 65, 78, 72, 84, 77, 91, 96],
  };

  const activity = activitySets[range];

  const avgActivity = Math.round(
    activity.reduce((sum, value) => sum + value, 0) / activity.length
  );

  const filteredProjects = useMemo(() => {
    if (projectFilter === "Active") {
      return projects.filter(
        (project) =>
          !project.status || project.status.toLowerCase() === "active"
      );
    }

    if (projectFilter === "Connected") {
      return projects.filter((project) => project.github?.connected);
    }

    return projects;
  }, [projectFilter, projects]);

  const handlePrimaryAction = () => {
    if (pendingInvitations) {
      handleInvitation(user.invitations[0].token, "accept");
    } else if (githubPercentage < 100) {
      projects.length
        ? handleConnectGithub(projects[0]._id)
        : openProjectDialog();
    } else {
      handleNavClick("AI workspace");
    }
  };

  return (
    <div className="min-h-full w-full bg-[#0B0F14] text-[#F5F7FA]">
      {/* OUTER SPACING */}
      <div className="mx-auto w-full max-w-[1800px] px-4 py-3.5 sm:px-5 sm:py-5 lg:px-8 lg:py-7">

        {/* HEADER */}
        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 flex items-center justify-between gap-3 sm:mb-5"
        >
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
           

            <div className="min-w-0">
              

              <h1 className="mt-0.5 truncate text-[18px] font-semibold leading-tight tracking-[-0.04em] text-[#F5F0E8] sm:text-[25px] lg:text-[28px]">
                Good to see you, {firstName}
              </h1>
            </div>
          </div>

          <div className="flex shrink-0 gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => handleNavClick("AI workspace")}
              className="rounded-lg border border-[#252C35] bg-[#151A21] px-2.5 py-2 text-[9px] font-semibold text-[#D9DEE3] transition hover:border-[#7AA6FF] hover:text-[#7AA6FF] sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-[11px]"
            >
              <span className="sm:hidden">✦</span>
              <span className="hidden sm:inline">✦ Ask AI</span>
            </button>

            <button
              type="button"
              onClick={openProjectDialog}
              className="rounded-lg bg-[#7AA6FF] px-2.5 py-2 text-[9px] font-semibold text-[#F5F0E8] transition hover:bg-[#7AA6FF] sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-[11px]"
            >
              <span className="sm:hidden">+ New</span>
              <span className="hidden sm:inline">+ New project</span>
            </button>
          </div>
        </motion.header>

        {/* MAIN */}
        <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-12">

          {/* HERO */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[20px] border border-[#252C35] bg-[#151A21] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.14)] sm:rounded-[24px] sm:p-6 lg:col-span-7 lg:min-h-[360px] lg:p-8"
          >
            <div className="pointer-events-none absolute -right-24 -top-28 h-64 w-64 rounded-full bg-[#7AA6FF]/10 blur-3xl sm:h-80 sm:w-80" />

            <div className="pointer-events-none absolute -bottom-28 left-[42%] h-56 w-56 rounded-full bg-[#5865F2]/10 blur-3xl sm:h-72 sm:w-72" />

            <div className="relative flex h-full flex-col justify-between gap-7 sm:gap-12">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#222A33] text-sm text-[#7AA6FF] sm:h-10 sm:w-10 sm:rounded-xl sm:text-base">
                    ✦
                  </span>

                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#8F99A5] sm:text-[10px]">
                      Syncora Command Center
                    </p>

                    <p className="mt-0.5 text-[8px] text-[#626C78] sm:text-[10px]">
                      Workspace overview
                    </p>
                  </div>
                </div>

                <h2 className="mt-5 max-w-[650px] text-[27px] font-semibold leading-[1.05] tracking-[-0.05em] sm:mt-7 sm:text-[38px] lg:text-[46px]">
                  Your engineering workspace,
                  <span className="text-[#7AA6FF]">
                    {" "}in one view.
                  </span>
                </h2>

                <p className="mt-2.5 text-[9px] text-[#8F99A5] sm:mt-4 sm:text-[12px]">
                  Projects · GitHub · Team · AI
                </p>
              </div>

              <div className="flex gap-1.5 sm:flex-wrap sm:gap-2">
                <button
                  type="button"
                  onClick={() => handleNavClick("Projects")}
                  className="rounded-lg bg-[#F5F0E8] px-3 py-2 text-[9px] font-semibold text-[#11161D] transition hover:bg-[#E8EAED] sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-[10px]"
                >
                  Projects →
                </button>

                <button
                  type="button"
                  onClick={() => handleNavClick("AI workspace")}
                  className="rounded-lg border border-[#303842] bg-[#1D242D] px-3 py-2 text-[9px] font-semibold text-[#F5F0E8] transition hover:bg-[#252E38] sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-[10px]"
                >
                  AI →
                </button>

                <button
                  type="button"
                  onClick={() =>
                    projects.length
                      ? handleConnectGithub(projects[0]._id)
                      : openProjectDialog()
                  }
                  className="rounded-lg border border-[#303842] bg-[#1D242D] px-3 py-2 text-[9px] font-semibold text-[#F5F0E8] transition hover:bg-[#252E38] sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-[10px]"
                >
                  GitHub →
                </button>
              </div>

              {githubError && (
                <p className="max-w-lg rounded-lg border border-[#7F3F35] bg-[#2A1715] px-3 py-2 text-[9px] text-[#7AA6FF] sm:rounded-xl sm:py-2.5 sm:text-[10px]">
                  {githubError}
                </p>
              )}
            </div>
          </motion.section>

          {/* KPI */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:col-span-5"
          >
            <KpiCard
              icon="◇"
              label="Projects"
              value={projects.length}
              detail={`${activeProjects} active`}
              badge={projects.length ? "+12%" : "—"}
              onClick={() => handleNavClick("Projects")}
            />

            <KpiCard
              icon="◉"
              label="GitHub"
              value={`${githubPercentage}%`}
              detail={`${connectedProjects.length}/${projects.length} connected`}
              badge={githubPercentage === 100 ? "Healthy" : "Action"}
              warning={githubPercentage < 100}
              progress={githubPercentage}
              onClick={() =>
                projects.length
                  ? handleConnectGithub(projects[0]._id)
                  : openProjectDialog()
              }
            />

            <KpiCard
              icon="♧"
              label="Team"
              value={memberCount}
              detail="active members"
              badge="Live"
              onClick={() => handleNavClick("Team")}
            />

            <KpiCard
              icon="✦"
              label="AI"
              value="Ready"
              detail="AI ready"
              badge="Online"
              onClick={() => handleNavClick("AI workspace")}
            />
          </motion.section>

          {/* PROJECTS */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="min-w-0 overflow-hidden rounded-[20px] border border-[#252C35] bg-[#151A21] p-3.5 shadow-[0_8px_25px_rgba(0,0,0,0.1)] sm:rounded-[24px] sm:p-5 lg:col-span-7"
          >
            <div className="flex items-center justify-between gap-3">
              <CardHeader
                icon="◈"
                title="Projects"
                subtitle="Recent engineering work"
              />

              <div className="flex shrink-0 items-center gap-0.5 rounded-lg bg-[#0F1318] p-1">
                {["All", "Active", "Connected"].map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setProjectFilter(filter)}
                    className={`rounded-md px-2 py-1.5 text-[8px] font-semibold transition sm:px-3 sm:py-2 sm:text-[9px] ${
                      projectFilter === filter
                        ? "bg-[#252C35] text-[#F5F0E8]"
                        : "text-[#858D97] hover:text-[#D9DEE3]"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-2.5 sm:mt-4 sm:grid-cols-2 sm:gap-3">
              {filteredProjects.length === 0 ? (
                <EmptyProjects
                  hasProjects={projects.length > 0}
                  openProjectDialog={openProjectDialog}
                />
              ) : (
                filteredProjects.slice(0, 4).map((project) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    onGithub={() => handleConnectGithub(project._id)}
                    onSync={
                      handleSyncRepository
                        ? () => handleSyncRepository(project._id)
                        : undefined
                    }
                    syncing={syncingProjectId === project._id}
                  />
                ))
              )}
            </div>

            {filteredProjects.length > 4 && (
              <button
                type="button"
                onClick={() => handleNavClick("Projects")}
                className="mt-3 w-full rounded-lg border border-[#252C35] bg-[#10151B] py-2 text-[9px] font-semibold text-[#AAB2BC] transition hover:bg-[#1C232B] hover:text-[#F5F0E8] sm:mt-4 sm:rounded-xl sm:py-2.5 sm:text-[10px]"
              >
                View all projects →
              </button>
            )}
          </motion.section>

          {/* SYSTEM STATUS */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-[20px] border border-[#252C35] bg-[#151A21] p-3.5 shadow-[0_8px_25px_rgba(0,0,0,0.1)] sm:rounded-[24px] sm:p-5 lg:col-span-5"
          >
            <div className="flex items-center justify-between gap-3">
              <CardHeader
                icon="⌁"
                title="System status"
                subtitle="Workspace health"
              />

              <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#123A2D] px-2 py-1 text-[7px] font-bold text-[#4ADEA3] sm:px-2.5 sm:text-[8px]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#24B47E]" />
                LIVE
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-5 sm:gap-2.5">
              <StatusRow label="Workspace" value="Operational" ok />

              <StatusRow
                label="GitHub"
                value={
                  githubPercentage === 100
                    ? "Fully linked"
                    : `${githubPercentage}% linked`
                }
                ok={githubPercentage === 100}
              />

              <StatusRow label="AI engine" value="Ready" ok />

              <StatusRow
                label="Invitations"
                value={
                  pendingInvitations
                    ? `${pendingInvitations} pending`
                    : "Clear"
                }
                ok={!pendingInvitations}
              />
            </div>

            <div
              className={`mt-2.5 rounded-lg px-3 py-2.5 sm:mt-4 sm:rounded-xl sm:py-3 ${
                pendingInvitations
                  ? "bg-[#2A2115]"
                  : githubPercentage < 100
                  ? "bg-[#2A1A16]"
                  : "bg-[#12271F]"
              }`}
            >
              <p className="truncate text-[9px] font-semibold text-[#D9DEE3] sm:text-[10px]">
                {pendingInvitations
                  ? `${pendingInvitations} invite${
                      pendingInvitations > 1 ? "s" : ""
                    } pending`
                  : githubPercentage < 100
                  ? `${
                      projects.length - connectedProjects.length
                    } project${
                      projects.length - connectedProjects.length === 1
                        ? ""
                        : "s"
                    } need GitHub`
                  : "Workspace healthy"}
              </p>
            </div>

            <button
              type="button"
              onClick={handlePrimaryAction}
              className="mt-2.5 w-full rounded-lg bg-[#252C35] py-2.5 text-[9px] font-semibold text-[#F5F0E8] transition hover:bg-[#303943] sm:mt-3 sm:rounded-xl sm:py-3 sm:text-[10px]"
            >
              {pendingInvitations
                ? "Review invitation →"
                : githubPercentage < 100
                ? "Complete GitHub setup →"
                : "Open AI workspace →"}
            </button>
          </motion.section>

        </div>
      </div>
    </div>
  );
};

/* =========================================================
   KPI CARD
========================================================= */

const KpiCard = ({
  icon,
  label,
  value,
  detail,
  badge,
  warning = false,
  progress,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className="group relative min-w-0 overflow-hidden rounded-[16px] border border-[#252C35] bg-[#151A21] p-3 text-left transition duration-200 hover:-translate-y-0.5 hover:border-[#39424D] hover:bg-[#181E25] hover:shadow-lg sm:rounded-[20px] sm:p-5"
  >
    <div className="flex items-start justify-between gap-2">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#242B34] text-xs text-[#7AA6FF] sm:h-9 sm:w-9 sm:rounded-xl sm:text-sm">
        {icon}
      </span>

      <span
        className={`max-w-[65px] truncate rounded-full px-1.5 py-1 text-[7px] font-bold sm:max-w-none sm:px-2 sm:text-[8px] ${
          warning
            ? "bg-[#33251A] text-[#7AA6FF]"
            : "bg-[#123A2D] text-[#4ADEA3]"
        }`}
      >
        {badge}
      </span>
    </div>

    <p className="mt-3 truncate text-[8px] font-bold uppercase tracking-[0.12em] text-[#858D97] sm:mt-5 sm:text-[9px]">
      {label}
    </p>

    <p className="mt-1 text-[22px] font-semibold leading-none tracking-[-0.05em] text-[#F5F0E8] sm:text-[28px]">
      {value}
    </p>

    <p className="mt-1.5 truncate text-[8px] text-[#858D97] sm:mt-2 sm:text-[9px]">
      {detail}
    </p>

    {typeof progress === "number" && (
      <div className="absolute bottom-0 left-0 h-0.5 w-full bg-[#252C35] sm:h-1">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8 }}
          className="h-full rounded-r-full bg-[#7AA6FF]"
        />
      </div>
    )}
  </button>
);

/* =========================================================
   CARD HEADER
========================================================= */

const CardHeader = ({ icon, title, subtitle }) => (
  <div className="flex min-w-0 items-center gap-2 sm:gap-3">
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#2A211F] text-xs font-semibold text-[#7AA6FF] sm:h-9 sm:w-9 sm:rounded-xl sm:text-sm">
      {icon}
    </div>

    <div className="min-w-0">
      <h2 className="truncate text-[11px] font-semibold text-[#F5F0E8] sm:text-[13px]">
        {title}
      </h2>

      <p className="mt-0.5 truncate text-[8px] text-[#858D97] sm:text-[9px]">
        {subtitle}
      </p>
    </div>
  </div>
);

/* =========================================================
   STATUS ROW
========================================================= */

const StatusRow = ({ label, value, ok }) => (
  <div className="flex min-w-0 items-center justify-between gap-2 rounded-lg bg-[#0F1318] px-2.5 py-2 sm:rounded-xl sm:px-3 sm:py-2.5">
    <div className="flex min-w-0 items-center gap-2">
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full sm:h-2 sm:w-2 ${
          ok ? "bg-[#24B47E]" : "bg-[#7AA6FF]"
        }`}
      />

      <span className="truncate text-[8px] font-medium text-[#AAB2BC] sm:text-[10px]">
        {label}
      </span>
    </div>

    <span
      className={`shrink-0 text-[7px] font-semibold sm:text-[9px] ${
        ok ? "text-[#4ADEA3]" : "text-[#7AA6FF]"
      }`}
    >
      {value}
    </span>
  </div>
);

/* =========================================================
   PROJECT CARD
========================================================= */

const ProjectCard = ({
  project,
  onGithub,
  onSync,
  syncing,
}) => {
  const connected = Boolean(project.github?.connected);
  const status = project.status?.toLowerCase() || "active";

  return (
    <motion.div
      layout
      whileHover={{ y: -2 }}
      className="min-w-0 rounded-[15px] border border-[#252C35] bg-[#10151B] p-3 transition hover:bg-[#181E25] hover:shadow-md sm:rounded-[18px] sm:p-4"
    >
      <div className="flex items-start justify-between gap-2.5">
        <div className="min-w-0">
          <h3 className="truncate text-[11px] font-semibold text-[#F5F0E8] sm:text-[12px]">
            {project.name}
          </h3>

          <p className="mt-0.5 line-clamp-1 text-[8px] text-[#7F8893] sm:mt-1 sm:text-[9px]">
            {project.description || "No description added."}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full px-1.5 py-0.5 text-[6px] font-bold uppercase sm:px-2 sm:py-1 sm:text-[7px] ${
            status === "active"
              ? "bg-[#123A2D] text-[#4ADEA3]"
              : "bg-[#242A31] text-[#737C87]"
          }`}
        >
          {status}
        </span>
      </div>

      <div
        className={`mt-2.5 flex min-w-0 items-center gap-2 rounded-lg px-2.5 py-2 sm:mt-4 sm:rounded-xl sm:px-3 sm:py-2.5 ${
          connected
            ? "bg-[#10261E]"
            : "border border-dashed border-[#303842] bg-[#151A21]"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 shrink-0 rounded-full sm:h-2 sm:w-2 ${
            connected ? "bg-[#24B47E]" : "bg-[#626C78]"
          }`}
        />

        <span
          className={`truncate text-[8px] sm:text-[9px] ${
            connected
              ? "font-medium text-[#4ADEA3]"
              : "text-[#8A929D]"
          }`}
        >
          {connected
            ? project.github.fullName ||
              `${project.github.owner}/${project.github.name}`
            : "GitHub not connected"}
        </span>
      </div>

      <div className="mt-2.5 flex items-center justify-between gap-2 sm:mt-4">
        <button
          type="button"
          onClick={onGithub}
          className="truncate text-[8px] font-semibold text-[#B8C0C9] transition hover:text-[#7AA6FF] sm:text-[9px]"
        >
          {connected
            ? "Manage repository →"
            : "Connect GitHub →"}
        </button>

        {connected && onSync && (
          <button
            type="button"
            onClick={onSync}
            disabled={syncing}
            className="shrink-0 rounded-md px-1.5 py-1 text-[7px] font-semibold text-[#737C87] transition hover:bg-[#252C35] hover:text-[#F5F0E8] disabled:opacity-50 sm:px-2 sm:py-1.5 sm:text-[8px]"
          >
            {syncing ? "Syncing..." : "Sync"}
          </button>
        )}
      </div>
    </motion.div>
  );
};

/* =========================================================
   EMPTY PROJECTS
========================================================= */

const EmptyProjects = ({
  hasProjects,
  openProjectDialog,
}) => (
  <div className="col-span-full flex min-h-[150px] items-center justify-center rounded-xl border border-dashed border-[#303842] bg-[#10151B] p-5 sm:min-h-[190px] sm:rounded-2xl sm:p-6">
    <div className="text-center">
      <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-[#2A211F] text-base text-[#7AA6FF] sm:h-11 sm:w-11 sm:rounded-xl sm:text-lg">
        ◇
      </div>

      <p className="mt-2.5 text-[10px] font-semibold text-[#F5F0E8] sm:mt-3 sm:text-[12px]">
        {hasProjects
          ? "No projects match this filter"
          : "No projects yet"}
      </p>

      <p className="mt-1 text-[8px] text-[#858D97] sm:text-[9px]">
        {hasProjects
          ? "Try another filter."
          : "Create your first project to start building."}
      </p>

      {!hasProjects && (
        <button
          type="button"
          onClick={openProjectDialog}
          className="mt-3 rounded-lg bg-[#7AA6FF] px-3 py-2 text-[8px] font-semibold text-[#F5F0E8] transition hover:bg-[#7AA6FF] sm:mt-4 sm:px-4 sm:py-2.5 sm:text-[9px]"
        >
          Create project
        </button>
      )}
    </div>
  </div>
);

/* =========================================================
   ACTIVITY CHART
========================================================= */

const ActivityChart = ({ values }) => {
  const width = 600;
  const height = 180;
  const px = 10;
  const py = 12;

  const points = values
    .map((value, index) => {
      const x =
        px +
        (index / Math.max(values.length - 1, 1)) *
          (width - px * 2);

      const y =
        height -
        py -
        (value / 100) * (height - py * 2);

      return `${x},${y}`;
    })
    .join(" ");

  const area = `${px},${height - py} ${points} ${
    width - px
  },${height - py}`;

  return (
    <div className="h-full w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="h-full w-full"
      >
        {[25, 50, 75].map((line) => {
          const y =
            height -
            py -
            (line / 100) * (height - py * 2);

          return (
            <line
              key={line}
              x1={px}
              x2={width - px}
              y1={y}
              y2={y}
              stroke="#252C35"
              strokeWidth="1"
              strokeDasharray="4 5"
            />
          );
        })}

        <polygon
          points={area}
          fill="rgba(122,166,255,0.08)"
        />

        <polyline
          points={points}
          fill="none"
          stroke="#7AA6FF"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {values.map((value, index) => {
          const x =
            px +
            (index / Math.max(values.length - 1, 1)) *
              (width - px * 2);

          const y =
            height -
            py -
            (value / 100) * (height - py * 2);

          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="5"
              fill="#151A21"
              stroke="#7AA6FF"
              strokeWidth="3"
            />
          );
        })}
      </svg>
    </div>
  );
};

export default DashboardOverview;

