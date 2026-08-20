
import { motion } from "framer-motion";
import { useMemo } from "react";

const DashboardOverview = ({ dashboard }) => {
  const {
    connectedProjects = [],
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

  const firstName = user.name?.split(" ")[0] || "there";

  const activity = useMemo(
    () => [34, 48, 42, 67, 54, 78, 71, 92, 76, 88, 82, 96],
    []
  );

  const activeProjects = projects.filter(
    (project) =>
      !project.status || project.status.toLowerCase() === "active"
  ).length;

  const inactiveProjects = Math.max(
    projects.length - activeProjects,
    0
  );

  const githubPercentage =
    projects.length > 0
      ? Math.min(
          100,
          Math.round(
            (connectedProjects.length / projects.length) * 100
          )
        )
      : 0;

  const avgActivity = Math.round(
    activity.reduce((a, b) => a + b, 0) / activity.length
  );

  return (
    <div className="min-h-[calc(100vh-1px)] bg-[#F5F6F8] text-[#11161D]">
      <div className="mx-auto w-full max-w-[1600px] px-5 py-5 lg:px-7">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 flex items-center justify-between gap-5"
        >
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#24B47E]" />

              <span className="truncate text-[10px] font-bold uppercase tracking-[0.18em] text-[#737C87]">
                {workspaceName || "Workspace"}
              </span>

              <span className="rounded-full bg-[#E8F7F1] px-2 py-0.5 text-[8px] font-bold text-[#16845D]">
                ONLINE
              </span>
            </div>

            <h1 className="text-[26px] font-semibold tracking-[-0.045em] lg:text-[29px]">
              Good to see you, {firstName}
            </h1>

            <p className="mt-1 text-[12px] text-[#7A838F]">
              Here's what's happening across your engineering workspace.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => handleNavClick("AI workspace")}
              className="rounded-xl border border-[#DDE1E6] bg-white px-4 py-2.5 text-[11px] font-semibold text-[#343B44] shadow-sm transition hover:border-[#C8CDD3] hover:bg-[#FAFAFA]"
            >
              ✦ Ask AI
            </button>

            <button
              type="button"
              onClick={openProjectDialog}
              className="rounded-xl bg-[#FF5C35] px-4 py-2.5 text-[11px] font-semibold text-white shadow-[0_5px_15px_rgba(255,92,53,0.18)] transition hover:bg-[#E94B27]"
            >
              + New project
            </button>
          </div>
        </motion.header>

        {/* =====================================================
            BENTO DASHBOARD
        ====================================================== */}

        <div className="grid grid-cols-12 gap-4">

          {/* ===================================================
              WELCOME CARD
          ==================================================== */}

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="relative col-span-12 overflow-hidden rounded-[22px] bg-[#11161D] p-7 lg:col-span-7 lg:min-h-[270px] lg:p-8"
          >
            <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-[#FF5C35]/10 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-32 left-[45%] h-64 w-64 rounded-full bg-[#5865F2]/10 blur-3xl" />

            <div className="relative flex h-full flex-col justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-[#FF704D]">
                    ✦
                  </span>

                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8F99A5]">
                    Syncora command center
                  </span>
                </div>

                <h2 className="mt-5 max-w-[610px] text-[34px] font-semibold leading-[1.06] tracking-[-0.05em] text-white lg:text-[40px]">
                  Your engineering workspace,
                  <span className="text-[#FF704D]">
                    {" "}
                    in one view.
                  </span>
                </h2>

                <p className="mt-4 max-w-[570px] text-[12px] leading-6 text-[#9EA7B1]">
                  Monitor projects, repositories, team activity and
                  engineering intelligence without jumping between tools.
                </p>
              </div>

              <div className="mt-7 flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => handleNavClick("Projects")}
                  className="rounded-xl bg-white px-4 py-2.5 text-[11px] font-semibold text-[#11161D] transition hover:bg-[#F1F1F1]"
                >
                  View projects →
                </button>

                <button
                  type="button"
                  onClick={() => handleNavClick("AI workspace")}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[11px] font-semibold text-white transition hover:bg-white/10"
                >
                  Open AI workspace
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (projects.length) {
                      handleConnectGithub(projects[0]._id);
                    } else {
                      openProjectDialog();
                    }
                  }}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[11px] font-semibold text-white transition hover:bg-white/10"
                >
                  ◈ Connect GitHub
                </button>
              </div>
            </div>
          </motion.section>

          {/* ===================================================
              PROJECT OVERVIEW
          ==================================================== */}

          <BentoCard
            className="col-span-12 lg:col-span-3"
            delay={0.08}
          >
            <CardHeader
              title="Projects"
              subtitle="Workspace portfolio"
              icon="◇"
            />

            <div className="mt-5 flex items-center justify-center">
              <DonutChart
                percentage={
                  projects.length
                    ? Math.round(
                        (activeProjects / projects.length) * 100
                      )
                    : 0
                }
                centerValue={projects.length}
                centerLabel="projects"
              />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <MiniMetric
                label="Active"
                value={activeProjects}
                dot="bg-[#24B47E]"
              />

              <MiniMetric
                label="Other"
                value={inactiveProjects}
                dot="bg-[#B9BEC5]"
              />
            </div>
          </BentoCard>

          {/* ===================================================
              TEAM
          ==================================================== */}

          <BentoCard
            className="col-span-12 lg:col-span-2"
            delay={0.12}
          >
            <CardHeader
              title="Team"
              subtitle="Workspace members"
              icon="♧"
            />

            <div className="mt-6">
              <div className="text-[38px] font-semibold tracking-[-0.05em]">
                {memberCount}
              </div>

              <p className="mt-1 text-[10px] text-[#858D97]">
                active members
              </p>
            </div>

            <div className="mt-6 flex -space-x-2">
              {Array.from({
                length: Math.min(memberCount, 4),
              }).map((_, index) => (
                <div
                  key={index}
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#EEF0F2] text-[9px] font-semibold text-[#59626D]"
                >
                  {index + 1}
                </div>
              ))}

              {memberCount > 4 && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#11161D] text-[8px] font-semibold text-white">
                  +{memberCount - 4}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleNavClick("Team")}
              className="mt-5 text-left text-[9px] font-semibold text-[#FF5C35]"
            >
              Manage team →
            </button>
          </BentoCard>

          {/* ===================================================
              RECENT PROJECTS
          ==================================================== */}

          <BentoCard
            className="col-span-12 lg:col-span-7"
            delay={0.16}
          >
            <div className="flex items-center justify-between">
              <CardHeader
                title="Recent projects"
                subtitle="Your latest engineering work"
                icon="◈"
              />

              <button
                type="button"
                onClick={() => handleNavClick("Projects")}
                className="text-[10px] font-semibold text-[#FF5C35]"
              >
                View all →
              </button>
            </div>

            {projects.length === 0 ? (
              <EmptyProjects
                openProjectDialog={openProjectDialog}
              />
            ) : (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {projects.slice(0, 4).map((project) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    onGithub={() =>
                      handleConnectGithub(project._id)
                    }
                    onSync={
                      handleSyncRepository
                        ? () =>
                            handleSyncRepository(project._id)
                        : undefined
                    }
                    syncing={
                      syncingProjectId === project._id
                    }
                  />
                ))}
              </div>
            )}
          </BentoCard>

          {/* ===================================================
              GITHUB HEALTH
          ==================================================== */}

          <BentoCard
            className="col-span-12 lg:col-span-3"
            delay={0.2}
          >
            <CardHeader
              title="GitHub health"
              subtitle="Repository connection"
              icon="◉"
            />

            <div className="mt-5 flex items-center gap-5">
              <DonutChart
                percentage={githubPercentage}
                centerValue={`${githubPercentage}%`}
                centerLabel="linked"
                size="small"
              />

              <div>
                <p className="text-[12px] font-semibold">
                  {connectedProjects.length} connected
                </p>

                <p className="mt-1 text-[9px] leading-4 text-[#858D97]">
                  {projects.length - connectedProjects.length > 0
                    ? `${
                        projects.length -
                        connectedProjects.length
                      } projects still need GitHub`
                    : "All projects are connected"}
                </p>
              </div>
            </div>

            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[#EEF0F2]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${githubPercentage}%` }}
                transition={{ duration: 0.8 }}
                className="h-full rounded-full bg-[#FF5C35]"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                if (projects.length) {
                  handleConnectGithub(projects[0]._id);
                } else {
                  openProjectDialog();
                }
              }}
              className="mt-4 w-full rounded-lg border border-[#E2E5E9] py-2 text-[9px] font-semibold text-[#343B44] transition hover:border-[#FFB09E] hover:text-[#FF5C35]"
            >
              Manage GitHub →
            </button>
          </BentoCard>

          {/* ===================================================
              AI WORKSPACE
          ==================================================== */}

          <BentoCard
            className="col-span-12 lg:col-span-2"
            delay={0.24}
          >
            <CardHeader
              title="AI workspace"
              subtitle="Engineering intelligence"
              icon="✦"
            />

            <div className="mt-6 flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#24B47E]" />

              <span className="text-[12px] font-semibold">
                Ready
              </span>
            </div>

            <p className="mt-2 text-[9px] leading-4 text-[#858D97]">
              Ask Syncora to understand your projects, codebase
              and engineering workflow.
            </p>

            <button
              type="button"
              onClick={() => handleNavClick("AI workspace")}
              className="mt-5 w-full rounded-lg bg-[#11161D] py-2.5 text-[9px] font-semibold text-white transition hover:bg-[#252C35]"
            >
              Open AI →
            </button>
          </BentoCard>

          {/* ===================================================
              ACTIVITY
          ==================================================== */}

          <BentoCard
            className="col-span-12 lg:col-span-7"
            delay={0.28}
          >
            <div className="flex items-center justify-between">
              <CardHeader
                title="Workspace activity"
                subtitle="Recent engineering signals"
                icon="⌁"
              />

              <div className="text-right">
                <p className="text-[18px] font-semibold">
                  {avgActivity}
                </p>
                <p className="text-[8px] text-[#858D97]">
                  activity score
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1.5fr]">

              <div className="space-y-3">
                <ActivityItem
                  icon="◈"
                  title="GitHub"
                  text={
                    connectedProjects.length
                      ? `${connectedProjects.length} repositories connected`
                      : "No repositories connected"
                  }
                  time="Now"
                />

                <ActivityItem
                  icon="◇"
                  title="Projects"
                  text={`${projects.length} projects available`}
                  time="Now"
                />

                <ActivityItem
                  icon="♧"
                  title="Team"
                  text={`${memberCount} members in workspace`}
                  time="Now"
                />

                <ActivityItem
                  icon="✦"
                  title="Syncora AI"
                  text="AI workspace ready"
                  time="Ready"
                  last
                />
              </div>

              <div className="rounded-xl border border-[#EEF0F2] bg-[#FAFBFC] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold">
                    Engineering activity
                  </p>

                  <span className="rounded-full bg-[#E8F7F1] px-2 py-1 text-[7px] font-bold text-[#16845D]">
                    LIVE
                  </span>
                </div>

                <div className="mt-5 flex h-[85px] items-end gap-1.5">
                  {activity.map((value, index) => (
                    <motion.div
                      key={index}
                      initial={{ height: 0 }}
                      animate={{
                        height: `${Math.max(12, value)}%`,
                      }}
                      transition={{
                        duration: 0.6,
                        delay: index * 0.035,
                      }}
                      className="flex-1 rounded-t-md bg-[#FF5C35]/75 transition hover:bg-[#FF5C35]"
                    />
                  ))}
                </div>

                <div className="mt-2 flex justify-between text-[7px] text-[#A0A7AF]">
                  <span>Earlier</span>
                  <span>Now</span>
                </div>
              </div>
            </div>
          </BentoCard>

          {/* ===================================================
              COLLABORATION
          ==================================================== */}

          <BentoCard
            className="col-span-12 lg:col-span-5"
            delay={0.32}
          >
            <CardHeader
              title="Collaboration"
              subtitle="Workspace invitations"
              icon="!"
            />

            {user.invitations?.length > 0 ? (
              <div className="mt-5">
                <div className="flex items-center gap-3 rounded-xl bg-[#FFF9ED] p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FFF0D0] text-[#C47A16]">
                    !
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold">
                      Pending collaboration
                    </p>

                    <p className="mt-1 text-[9px] text-[#806A47]">
                      {user.invitations.length} invitation
                      {user.invitations.length > 1 ? "s" : ""} waiting
                      for your response.
                    </p>
                  </div>
                </div>

                {user.invitations.slice(0, 1).map((invitation) => (
                  <div
                    key={invitation.token}
                    className="mt-3 flex justify-end gap-2"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        handleInvitation(
                          invitation.token,
                          "decline"
                        )
                      }
                      className="rounded-lg border border-[#DDE1E6] bg-white px-4 py-2 text-[9px] font-semibold text-[#68635C]"
                    >
                      Decline
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleInvitation(
                          invitation.token,
                          "accept"
                        )
                      }
                      className="rounded-lg bg-[#FF5C35] px-4 py-2 text-[9px] font-semibold text-white"
                    >
                      Accept invitation
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5 flex min-h-[105px] items-center rounded-xl border border-dashed border-[#DDE1E6] bg-[#FAFBFC] px-4">
                <div>
                  <p className="text-[11px] font-semibold">
                    No pending invitations
                  </p>

                  <p className="mt-1 text-[9px] leading-4 text-[#858D97]">
                    Collaboration requests will appear here when
                    someone invites you to a workspace.
                  </p>
                </div>
              </div>
            )}
          </BentoCard>
        </div>
      </div>
    </div>
  );
};

/* =============================================================
   BENTO CARD
============================================================= */

const BentoCard = ({
  children,
  className = "",
  delay = 0,
}) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className={`rounded-[20px] border border-[#E2E5E9] bg-white p-5 shadow-[0_1px_2px_rgba(17,24,39,0.02)] ${className}`}
    >
      {children}
    </motion.section>
  );
};

/* =============================================================
   CARD HEADER
============================================================= */

const CardHeader = ({
  title,
  subtitle,
  icon,
}) => {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FFF0EB] text-[12px] font-semibold text-[#FF5C35]">
        {icon}
      </div>

      <div className="min-w-0">
        <h2 className="text-[12px] font-semibold text-[#11161D]">
          {title}
        </h2>

        <p className="mt-0.5 text-[9px] text-[#858D97]">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

/* =============================================================
   DONUT CHART
============================================================= */

const DonutChart = ({
  percentage = 0,
  centerValue,
  centerLabel,
  size = "normal",
}) => {
  const radius = size === "small" ? 31 : 42;
  const circumference = 2 * Math.PI * radius;

  const safePercentage = Math.max(
    0,
    Math.min(100, percentage)
  );

  const offset =
    circumference -
    (safePercentage / 100) * circumference;

  const dimension = size === "small" ? 82 : 108;

  return (
    <div
      className="relative shrink-0"
      style={{
        width: dimension,
        height: dimension,
      }}
    >
      <svg
        width={dimension}
        height={dimension}
        viewBox={`0 0 ${dimension} ${dimension}`}
        className="-rotate-90"
      >
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          fill="none"
          stroke="#EEF0F2"
          strokeWidth={size === "small" ? 7 : 8}
        />

        <motion.circle
          initial={{
            strokeDashoffset: circumference,
          }}
          animate={{
            strokeDashoffset: offset,
          }}
          transition={{
            duration: 0.9,
            ease: "easeOut",
          }}
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          fill="none"
          stroke="#FF5C35"
          strokeWidth={size === "small" ? 7 : 8}
          strokeLinecap="round"
          strokeDasharray={circumference}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={
            size === "small"
              ? "text-[13px] font-semibold"
              : "text-[20px] font-semibold"
          }
        >
          {centerValue}
        </span>

        <span className="mt-0.5 text-[7px] text-[#858D97]">
          {centerLabel}
        </span>
      </div>
    </div>
  );
};

/* =============================================================
   MINI METRIC
============================================================= */

const MiniMetric = ({
  label,
  value,
  dot,
}) => {
  return (
    <div className="rounded-lg bg-[#FAFBFC] px-3 py-2.5">
      <div className="flex items-center gap-1.5">
        <span
          className={`h-1.5 w-1.5 rounded-full ${dot}`}
        />

        <span className="text-[8px] text-[#858D97]">
          {label}
        </span>
      </div>

      <p className="mt-1 text-[15px] font-semibold">
        {value}
      </p>
    </div>
  );
};

/* =============================================================
   PROJECT CARD
============================================================= */

const ProjectCard = ({
  project,
  onGithub,
  onSync,
  syncing,
}) => {
  const connected = project.github?.connected;

  const status =
    project.status?.toLowerCase() || "active";

  return (
    <div className="group rounded-xl border border-[#E4E7EB] bg-[#FAFBFC] p-3.5 transition hover:border-[#D4D9DE] hover:bg-white hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-[11px] font-semibold">
            {project.name}
          </h3>

          <p className="mt-1 line-clamp-1 text-[9px] text-[#7F8893]">
            {project.description || "No description added."}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full px-2 py-1 text-[7px] font-bold uppercase ${
            status === "active"
              ? "bg-[#E8F7F1] text-[#16845D]"
              : "bg-[#F1F2F4] text-[#737C87]"
          }`}
        >
          {status}
        </span>
      </div>

      <div
        className={`mt-3 flex items-center gap-2 rounded-lg px-2.5 py-2 ${
          connected
            ? "bg-[#F0F8F4]"
            : "border border-dashed border-[#DDE1E6]"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 shrink-0 rounded-full ${
            connected
              ? "bg-[#24B47E]"
              : "bg-[#B5BBC2]"
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

      <div className="mt-2.5 flex items-center justify-between">
        <button
          type="button"
          onClick={onGithub}
          className="text-[9px] font-semibold text-[#39424D] transition hover:text-[#FF5C35]"
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
            className="text-[8px] font-semibold text-[#858D97] transition hover:text-[#11161D] disabled:opacity-50"
          >
            {syncing ? "Syncing..." : "Sync"}
          </button>
        )}
      </div>
    </div>
  );
};

/* =============================================================
   ACTIVITY ITEM
============================================================= */

const ActivityItem = ({
  icon,
  title,
  text,
  time,
  last,
}) => {
  return (
    <div className="relative flex gap-3">
      {!last && (
        <div className="absolute left-[13px] top-8 h-[calc(100%+6px)] w-px bg-[#E8EAED]" />
      )}

      <div className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F4F5F6] text-[10px] text-[#59626D]">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[10px] font-semibold">
            {title}
          </p>

          <span className="text-[8px] text-[#A0A7AF]">
            {time}
          </span>
        </div>

        <p className="mt-0.5 text-[9px] leading-4 text-[#858D97]">
          {text}
        </p>
      </div>
    </div>
  );
};

/* =============================================================
   EMPTY PROJECTS
============================================================= */

const EmptyProjects = ({
  openProjectDialog,
}) => {
  return (
    <div className="mt-5 flex min-h-[145px] items-center justify-center rounded-xl border border-dashed border-[#DDE1E6] bg-[#FAFBFC]">
      <div className="text-center">
        <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFF0EB] text-sm text-[#FF5C35]">
          ◇
        </div>

        <h3 className="mt-3 text-[11px] font-semibold">
          No projects yet
        </h3>

        <p className="mt-1 text-[9px] text-[#858D97]">
          Create your first project to start building.
        </p>

        <button
          type="button"
          onClick={openProjectDialog}
          className="mt-3 rounded-lg bg-[#11161D] px-3 py-2 text-[9px] font-semibold text-white transition hover:bg-[#252C35]"
        >
          Create project
        </button>
      </div>
    </div>
  );
};

export default DashboardOverview;

