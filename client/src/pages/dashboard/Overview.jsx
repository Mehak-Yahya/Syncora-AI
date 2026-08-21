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
    ? Math.min(100, Math.round((connectedProjects.length / projects.length) * 100))
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

  return (
    <div className="min-h-screen bg-[#F3F5F7] text-[#11161D]">
      <div className="mx-auto w-full max-w-[1700px] px-4 py-4 lg:px-6">
        {/* HEADER */}
        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#11161D] text-sm font-bold text-white">
              S
            </div>

            <div>
              <div className="mb-0.5 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#24B47E]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#6F7883]">
                  {workspaceName || "Workspace"}
                </span>
                <span className="rounded-full bg-[#E6F7F0] px-2 py-0.5 text-[8px] font-bold text-[#16845D]">
                  ONLINE
                </span>
              </div>

              <h1 className="text-[24px] font-semibold leading-none tracking-[-0.045em] lg:text-[27px]">
                Good to see you, {firstName}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleNavClick("AI workspace")}
              className="rounded-xl border border-[#D9DEE3] bg-white px-4 py-2.5 text-[11px] font-semibold shadow-sm transition hover:border-[#FFAA96] hover:text-[#FF5C35]"
            >
              ✦ Ask AI
            </button>

            <button
              type="button"
              onClick={openProjectDialog}
              className="rounded-xl bg-[#FF5C35] px-4 py-2.5 text-[11px] font-semibold text-white shadow-[0_6px_18px_rgba(255,92,53,0.2)] transition hover:bg-[#E94B27]"
            >
              + New project
            </button>
          </div>
        </motion.header>

        {/* COMMAND CENTER
            Desktop is intentionally two rows. The previous version forced too
            much content into three short rows, which made every label tiny. */}
        <div className="grid gap-3 lg:h-[calc(100vh-104px)] lg:min-h-[620px] lg:grid-cols-12 lg:grid-rows-[minmax(300px,0.95fr)_minmax(300px,1.05fr)]">
          {/* HERO */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative col-span-12 overflow-hidden rounded-[22px] bg-[#11161D] p-6 text-white shadow-sm lg:col-span-5"
          >
            <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-[#FF5C35]/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 left-[42%] h-72 w-72 rounded-full bg-[#5865F2]/10 blur-3xl" />

            <div className="relative flex h-full flex-col justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-base text-[#FF704D]">
                    ✦
                  </span>

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.19em] text-[#8F99A5]">
                      Syncora Command Center
                    </p>
                    <p className="mt-0.5 text-[9px] text-[#626C78]">
                      Workspace overview
                    </p>
                  </div>
                </div>

                <h2 className="mt-7 max-w-[570px] text-[35px] font-semibold leading-[1.02] tracking-[-0.055em] lg:text-[38px]">
                  Your engineering workspace,
                  <span className="text-[#FF704D]"> in one view.</span>
                </h2>

                <p className="mt-3 text-[11px] text-[#A3ACB6]">
                  Projects · GitHub · Team · AI
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => handleNavClick("Projects")}
                  className="rounded-xl bg-white px-4 py-2.5 text-[10px] font-semibold text-[#11161D] transition hover:bg-[#F0F0F0]"
                >
                  Projects →
                </button>

                <button
                  type="button"
                  onClick={() => handleNavClick("AI workspace")}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[10px] font-semibold text-white transition hover:bg-white/10"
                >
                  AI workspace →
                </button>

                <button
                  type="button"
                  onClick={() =>
                    projects.length
                      ? handleConnectGithub(projects[0]._id)
                      : openProjectDialog()
                  }
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[10px] font-semibold text-white transition hover:bg-white/10"
                >
                  GitHub →
                </button>
              </div>

              {githubError && (
                <p className="mt-3 max-w-md rounded-lg border border-[#7F3F35] bg-[#2A1715] px-3 py-2 text-[10px] text-[#FFB5A5]">
                  {githubError}
                </p>
              )}
            </div>
          </motion.section>

          {/* KPI GRID */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="col-span-12 grid grid-cols-2 gap-3 lg:col-span-4"
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
              label="GitHub linked"
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
              label="AI workspace"
              value="Ready"
              detail="AI ready"
              badge="Online"
              dark
              onClick={() => handleNavClick("AI workspace")}
            />
          </motion.section>

          {/* SYSTEM STATUS */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="col-span-12 rounded-[22px] border border-[#DEE3E7] bg-white p-5 shadow-[0_1px_3px_rgba(17,24,39,0.03)] lg:col-span-3"
          >
            <div className="flex items-start justify-between">
              <CardHeader
                icon="⌁"
                title="System status"
                subtitle="Workspace health"
              />

              <span className="flex items-center gap-1.5 rounded-full bg-[#E6F7F0] px-2.5 py-1 text-[8px] font-bold text-[#16845D]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#24B47E]" />
                LIVE
              </span>
            </div>

            <div className="mt-5 space-y-2.5">
              <StatusRow
                label="Workspace"
                value="Operational"
                ok
              />
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
                value={pendingInvitations ? `${pendingInvitations} pending` : "Clear"}
                ok={!pendingInvitations}
              />
            </div>

            <div
              className={`mt-4 rounded-xl px-3 py-2.5 ${
                pendingInvitations
                  ? "bg-[#FFF8EE]"
                  : githubPercentage < 100
                  ? "bg-[#FFF8F5]"
                  : "bg-[#F2FAF6]"
              }`}
            >
              <p className="text-[9px] font-semibold">
                {pendingInvitations
                  ? `${pendingInvitations} invite${pendingInvitations > 1 ? "s" : ""} pending`
                  : githubPercentage < 100
                  ? `${projects.length - connectedProjects.length} project${projects.length - connectedProjects.length === 1 ? "" : "s"} need GitHub`
                  : "Workspace healthy"}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (pendingInvitations) {
                  handleInvitation(user.invitations[0].token, "accept");
                } else if (githubPercentage < 100) {
                  projects.length
                    ? handleConnectGithub(projects[0]._id)
                    : openProjectDialog();
                } else {
                  handleNavClick("AI workspace");
                }
              }}
              className="mt-3 w-full rounded-xl bg-[#11161D] py-2.5 text-[10px] font-semibold text-white transition hover:bg-[#252C35]"
            >
              {pendingInvitations
                ? "Review invitation →"
                : githubPercentage < 100
                ? "Complete GitHub setup →"
                : "Open command center →"}
            </button>
          </motion.section>

          {/* PROJECTS */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="col-span-12 min-h-0 overflow-hidden rounded-[22px] border border-[#DEE3E7] bg-white p-5 shadow-[0_1px_3px_rgba(17,24,39,0.03)] lg:col-span-7"
          >
            <div className="flex items-center justify-between gap-4">
              <CardHeader
                icon="◈"
                title="Projects"
                subtitle="Recent engineering work"
              />

              <div className="flex items-center gap-1 rounded-xl bg-[#F4F6F8] p-1">
                {["All", "Active", "Connected"].map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setProjectFilter(filter)}
                    className={`rounded-lg px-3 py-1.5 text-[9px] font-semibold transition ${
                      projectFilter === filter
                        ? "bg-white text-[#11161D] shadow-sm"
                        : "text-[#858D97] hover:text-[#343B44]"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 grid min-h-0 grid-cols-2 gap-3 overflow-auto pr-1 lg:max-h-[calc(100%-55px)]">
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
          </motion.section>

          {/* ACTIVITY */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-12 min-h-0 overflow-hidden rounded-[22px] border border-[#DEE3E7] bg-white p-5 shadow-[0_1px_3px_rgba(17,24,39,0.03)] lg:col-span-5"
          >
            <div className="flex items-start justify-between gap-4">
              <CardHeader
                icon="⌁"
                title="Workspace activity"
                subtitle="Recent engineering signals"
              />

              <div className="text-right">
                <p className="text-[30px] font-semibold leading-none tracking-[-0.055em]">
                  {avgActivity}
                </p>
                <p className="mt-1 text-[8px] text-[#858D97]">
                  activity score
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold">Engineering activity</p>
                <p className="mt-0.5 text-[8px] text-[#858D97]">
                  {range === "24H"
                    ? "Last 24 hours"
                    : range === "30D"
                    ? "Last 30 days"
                    : "Last 7 days"}
                </p>
              </div>

              <div className="flex rounded-lg bg-[#F4F6F8] p-1">
                {["24H", "7D", "30D"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setRange(item)}
                    className={`rounded-md px-2.5 py-1.5 text-[8px] font-bold transition ${
                      range === item
                        ? "bg-[#11161D] text-white"
                        : "text-[#858D97] hover:text-[#343B44]"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3 rounded-2xl bg-[#FAFBFC] p-3">
              <ActivityChart values={activity} />
            </div>


          </motion.section>
        </div>
      </div>
    </div>
  );
};

const KpiCard = ({
  icon,
  label,
  value,
  detail,
  badge,
  warning = false,
  progress,
  dark = false,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`group relative min-h-[128px] overflow-hidden rounded-[20px] border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg ${
      dark
        ? "border-[#11161D] bg-[#11161D] text-white"
        : "border-[#DEE3E7] bg-white"
    }`}
  >
    <div className="flex items-start justify-between">
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm ${
          dark
            ? "bg-white/10 text-[#FF704D]"
            : "bg-[#FFF0EB] text-[#FF5C35]"
        }`}
      >
        {icon}
      </span>

      <span
        className={`rounded-full px-2 py-1 text-[8px] font-bold ${
          dark
            ? "bg-white/10 text-[#B0B7C0]"
            : warning
            ? "bg-[#FFF1E6] text-[#C56A24]"
            : "bg-[#E6F7F0] text-[#16845D]"
        }`}
      >
        {badge}
      </span>
    </div>

    <p
      className={`mt-4 text-[9px] font-bold uppercase tracking-[0.15em] ${
        dark ? "text-[#8F99A5]" : "text-[#858D97]"
      }`}
    >
      {label}
    </p>

    <p className="mt-0.5 text-[28px] font-semibold leading-none tracking-[-0.055em]">
      {value}
    </p>

    <p
      className={`mt-1.5 truncate text-[9px] ${
        dark ? "text-[#8F99A5]" : "text-[#858D97]"
      }`}
    >
      {detail}
    </p>

    {typeof progress === "number" && (
      <div className="absolute bottom-0 left-0 h-1 w-full bg-[#EEF0F2]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8 }}
          className="h-full rounded-r-full bg-[#FF5C35]"
        />
      </div>
    )}
  </button>
);

const CardHeader = ({ icon, title, subtitle }) => (
  <div className="flex items-center gap-3">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFF0EB] text-sm font-semibold text-[#FF5C35]">
      {icon}
    </div>

    <div className="min-w-0">
      <h2 className="text-[13px] font-semibold">{title}</h2>
      <p className="mt-0.5 text-[9px] text-[#858D97]">{subtitle}</p>
    </div>
  </div>
);

const StatusRow = ({ label, value, ok }) => (
  <div className="flex items-center justify-between rounded-xl bg-[#F8F9FA] px-3 py-2.5">
    <div className="flex items-center gap-2.5">
      <span
        className={`h-2 w-2 rounded-full ${
          ok ? "bg-[#24B47E]" : "bg-[#F0A34A]"
        }`}
      />
      <span className="text-[10px] font-medium text-[#59626D]">{label}</span>
    </div>

    <span
      className={`text-[9px] font-semibold ${
        ok ? "text-[#16845D]" : "text-[#C56A24]"
      }`}
    >
      {value}
    </span>
  </div>
);

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
      className="rounded-[16px] border border-[#E2E6EA] bg-[#FAFBFC] p-3.5 transition hover:bg-white hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-[12px] font-semibold">
            {project.name}
          </h3>
          <p className="mt-1 line-clamp-1 text-[9px] text-[#7F8893]">
            {project.description || "No description added."}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full px-2 py-1 text-[7px] font-bold uppercase ${
            status === "active"
              ? "bg-[#E6F7F0] text-[#16845D]"
              : "bg-[#F0F1F3] text-[#737C87]"
          }`}
        >
          {status}
        </span>
      </div>

      <div
        className={`mt-3 flex items-center gap-2 rounded-xl px-3 py-2.5 ${
          connected
            ? "bg-[#F0F8F4]"
            : "border border-dashed border-[#D9DEE3] bg-white"
        }`}
      >
        <span
          className={`h-2 w-2 shrink-0 rounded-full ${
            connected ? "bg-[#24B47E]" : "bg-[#B5BBC2]"
          }`}
        />

        <span
          className={`truncate text-[9px] ${
            connected
              ? "font-medium text-[#16845D]"
              : "text-[#8A929D]"
          }`}
        >
          {connected
            ? project.github.fullName ||
              `${project.github.owner}/${project.github.name}`
            : "GitHub not connected"}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <button
          type="button"
          onClick={onGithub}
          className="text-[9px] font-semibold text-[#39424D] transition hover:text-[#FF5C35]"
        >
          {connected ? "Manage repository →" : "Connect GitHub →"}
        </button>

        {connected && onSync && (
          <button
            type="button"
            onClick={onSync}
            disabled={syncing}
            className="rounded-md px-2 py-1 text-[8px] font-semibold text-[#737C87] hover:bg-[#EEF0F2] hover:text-[#11161D] disabled:opacity-50"
          >
            {syncing ? "Syncing..." : "Sync"}
          </button>
        )}
      </div>
    </motion.div>
  );
};

const EmptyProjects = ({ hasProjects, openProjectDialog }) => (
  <div className="col-span-2 flex min-h-[180px] items-center justify-center rounded-2xl border border-dashed border-[#D9DEE3] bg-[#FAFBFC]">
    <div className="text-center">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF0EB] text-lg text-[#FF5C35]">
        ◇
      </div>

      <p className="mt-3 text-[12px] font-semibold">
        {hasProjects ? "No projects match this filter" : "No projects yet"}
      </p>

      <p className="mt-1 text-[9px] text-[#858D97]">
        {hasProjects
          ? "Try another filter."
          : "Create your first project to start building."}
      </p>

      {!hasProjects && (
        <button
          type="button"
          onClick={openProjectDialog}
          className="mt-3 rounded-lg bg-[#11161D] px-3 py-2 text-[9px] font-semibold text-white"
        >
          Create project
        </button>
      )}
    </div>
  </div>
);

const ActivityChart = ({ values }) => {
  const width = 600;
  const height = 180;
  const px = 10;
  const py = 12;

  const points = values
    .map((value, index) => {
      const x =
        px + (index / Math.max(values.length - 1, 1)) * (width - px * 2);
      const y =
        height - py - (value / 100) * (height - py * 2);

      return `${x},${y}`;
    })
    .join(" ");

  const area = `${px},${height - py} ${points} ${
    width - px
  },${height - py}`;

  return (
    <div className="h-[160px] w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="h-full w-full"
      >
        {[25, 50, 75].map((line) => {
          const y =
            height - py - (line / 100) * (height - py * 2);

          return (
            <line
              key={line}
              x1={px}
              x2={width - px}
              y1={y}
              y2={y}
              stroke="#E6E9EC"
              strokeWidth="1"
              strokeDasharray="4 5"
            />
          );
        })}

        <polygon points={area} fill="rgba(255,92,53,0.08)" />

        <polyline
          points={points}
          fill="none"
          stroke="#FF5C35"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {values.map((value, index) => {
          const x =
            px + (index / Math.max(values.length - 1, 1)) * (width - px * 2);
          const y =
            height - py - (value / 100) * (height - py * 2);

          return (
            <g key={index}>
              <circle
                cx={x}
                cy={y}
                r="6"
                fill="#FFFFFF"
                stroke="#FF5C35"
                strokeWidth="3"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const MetricPill = ({ label, value }) => (
  <div className="rounded-xl bg-[#F7F8F9] px-3 py-2.5">
    <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#9AA1A9]">
      {label}
    </p>
    <p className="mt-0.5 text-[14px] font-semibold">{value}</p>
  </div>
);

export default DashboardOverview;