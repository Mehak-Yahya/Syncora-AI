import { motion } from "framer-motion";

const integrations = [
  {
    name: "GitHub",
    description: "Repositories, commits, issues, and pull requests.",
    icon: "◉",
    status: "Connected",
    accent: "#171717",
  },
  {
    name: "Slack",
    description: "Engineering conversations and updates in sync.",
    icon: "⌁",
    status: "Connect",
    accent: "#E01E5A",
  },
  {
    name: "Jira",
    description: "Issues, sprint work, and project activity.",
    icon: "◆",
    status: "Connect",
    accent: "#2684FF",
  },
  {
    name: "Figma",
    description: "Designs and product context closer to development.",
    icon: "◈",
    status: "Connect",
    accent: "#F24E1E",
  },
  {
    name: "Linear",
    description: "Issues, cycles, projects, and development work.",
    icon: "↗",
    status: "Connect",
    accent: "#5E6AD2",
  },
  {
    name: "Notion",
    description: "Documentation and team knowledge in context.",
    icon: "N",
    status: "Connect",
    accent: "#171717",
  },
];

const Integrations = () => {
  return (
    <section
      id="integrations"
      className="relative overflow-hidden border-y border-white/10 bg-[#08090D] px-6 py-20 text-white sm:px-10 lg:px-12 lg:py-28"
    >
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.22] [background-image:linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:48px_48px]" />

        {/* Orange glow */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.1, 0.18, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[20%] top-[-180px] h-[420px] w-[420px] rounded-full bg-[#FF5C35] blur-[150px]"
        />

        {/* Purple glow */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.06, 0.12, 0.06],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-[-180px] right-[10%] h-[420px] w-[420px] rounded-full bg-[#635BFF] blur-[160px]"
        />

        {/* Floating light */}
        <motion.div
          animate={{
            y: ["0%", "100%"],
            opacity: [0, 0.4, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute left-[8%] top-0 h-40 w-px bg-gradient-to-b from-transparent via-[#FF5C35] to-transparent"
        />
      </div>

      {/* CONTENT */}
      <div className="relative mx-auto max-w-7xl">

        {/* Heading — INSTANT */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#FF6B46]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF5C35] shadow-[0_0_12px_#FF5C35]" />
            Integrations
          </span>

          <h2 className="mt-4 text-3xl font-semibold leading-[1.05] tracking-[-0.045em] sm:text-4xl lg:text-[48px]">
            Your tools.
            <br />

            <span className="bg-gradient-to-r from-white via-white to-white/50 bg-clip-text text-transparent">
              One connected workspace.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-white/40 sm:text-base">
            Connect the tools your engineering team already uses and keep
            projects, code, communication, and documentation in sync.
          </p>
        </div>

        {/* CONNECTION SYSTEM */}
        <div className="relative mx-auto mt-16 max-w-6xl">

          {/* Desktop connection lines */}
          <div className="pointer-events-none absolute inset-0 hidden lg:block">
            <div className="absolute left-[16%] right-[16%] top-1/2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="absolute bottom-[8%] left-1/2 top-[8%] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/10 to-transparent" />

            <div className="absolute left-[16%] top-[25%] h-px w-[34%] origin-left rotate-[20deg] bg-gradient-to-r from-white/10 to-transparent" />

            <div className="absolute right-[16%] top-[25%] h-px w-[34%] origin-right -rotate-[20deg] bg-gradient-to-l from-white/10 to-transparent" />

            <div className="absolute bottom-[25%] left-[16%] h-px w-[34%] origin-left -rotate-[20deg] bg-gradient-to-r from-white/10 to-transparent" />

            <div className="absolute bottom-[25%] right-[16%] h-px w-[34%] origin-right rotate-[20deg] bg-gradient-to-l from-white/10 to-transparent" />

            {/* Animated signal */}
            <motion.div
              animate={{
                x: ["0%", "700%"],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute left-[18%] top-1/2 h-1 w-16 -translate-y-1/2 rounded-full bg-gradient-to-r from-transparent via-[#FF5C35] to-transparent blur-[2px]"
            />
          </div>

          {/* CENTER SYNCORA CORE — INSTANT */}
          <div className="relative z-20 mx-auto mb-12 flex h-28 w-28 items-center justify-center lg:absolute lg:left-1/2 lg:top-1/2 lg:mb-0 lg:-translate-x-1/2 lg:-translate-y-1/2">

            {/* Outer rotating ring */}
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-[-14px] rounded-full border border-dashed border-[#FF5C35]/30"
            />

            {/* Pulse ring */}
            <motion.div
              animate={{
                scale: [1, 1.25, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-[-5px] rounded-full border border-[#FF5C35]/40"
            />

            {/* Glow */}
            <div className="absolute inset-0 rounded-full bg-[#FF5C35]/20 blur-[35px]" />

            {/* Core */}
            <motion.div
              whileHover={{
                scale: 1.08,
              }}
              className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/15 bg-[#111217] shadow-[0_0_60px_rgba(255,92,53,0.25)]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF6B46] to-[#E9431F] text-xl font-bold text-white shadow-[0_10px_30px_rgba(255,92,53,0.35)]">
                S
              </div>
            </motion.div>

            {/* Core label */}
            <div className="absolute -bottom-10 whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.2em] text-white/30">
              Syncora Core
            </div>
          </div>

          {/* INTEGRATION CARDS — INSTANT */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {integrations.map((integration) => (
              <motion.article
                key={integration.name}
                whileHover={{
                  y: -8,
                  scale: 1.015,
                  rotateX: 2,
                }}
                style={{
                  transformPerspective: 1000,
                }}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5 backdrop-blur-xl transition-all duration-500 hover:border-white/[0.16] hover:bg-white/[0.06]"
              >
                {/* Hover glow */}
                <motion.div
                  initial={{
                    opacity: 0,
                  }}
                  whileHover={{
                    opacity: 1,
                  }}
                  className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full blur-[60px]"
                  style={{
                    backgroundColor: integration.accent,
                  }}
                />

                {/* Top */}
                <div className="relative z-10 flex items-center justify-between">
                  <motion.div
                    whileHover={{
                      rotate: 8,
                      scale: 1.1,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 15,
                    }}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-sm font-semibold"
                    style={{
                      color: integration.accent,
                    }}
                  >
                    {integration.icon}
                  </motion.div>

                  <span
                    className={
                      integration.status === "Connected"
                        ? "flex items-center gap-1.5 rounded-full border border-[#20A464]/20 bg-[#20A464]/10 px-2.5 py-1 text-[10px] font-medium text-[#55D990]"
                        : "rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-medium text-white/30"
                    }
                  >
                    {integration.status === "Connected" && (
                      <span className="h-1.5 w-1.5 rounded-full bg-[#20A464] shadow-[0_0_8px_#20A464]" />
                    )}

                    {integration.status}
                  </span>
                </div>

                {/* Content */}
                <h3 className="relative z-10 mt-6 text-base font-semibold text-white">
                  {integration.name}
                </h3>

                <p className="relative z-10 mt-2 text-xs leading-5 text-white/35 sm:text-sm">
                  {integration.description}
                </p>

                {/* Action */}
                <button className="relative z-10 mt-5 text-[11px] font-semibold text-white/30 transition-colors duration-300 group-hover:text-[#FF6840]">
                  {integration.status === "Connected"
                    ? "Manage integration"
                    : "Connect integration"}{" "}
                  →
                </button>

                {/* Bottom accent */}
                <motion.div
                  initial={{
                    width: 0,
                  }}
                  whileHover={{
                    width: "100%",
                  }}
                  transition={{
                    duration: 0.45,
                  }}
                  className="absolute bottom-0 left-0 h-px"
                  style={{
                    backgroundColor: integration.accent,
                    boxShadow: `0 0 20px ${integration.accent}`,
                  }}
                />
              </motion.article>
            ))}
          </div>
        </div>

        {/* FOOTER — INSTANT */}
        <div className="mt-12 flex items-center justify-center gap-4 text-[10px] font-medium uppercase tracking-[0.2em] text-white/20">
          <span className="h-px w-12 bg-white/10" />

          <span className="flex items-center gap-2">
            <motion.span
              animate={{
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="h-1.5 w-1.5 rounded-full bg-[#20A464] shadow-[0_0_10px_#20A464]"
            />

            More integrations coming
          </span>

          <span className="h-px w-12 bg-white/10" />
        </div>
      </div>
    </section>
  );
};

export default Integrations;