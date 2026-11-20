import { motion } from "framer-motion";

const features = [
  {
    number: "01",
    title: "Plan & Manage",
    description:
      "Organize projects, tasks, sprints, priorities, and deadlines from one workspace.",
    icon: "▦",
    accent: "#7AA6FF",
  },
  {
    number: "02",
    title: "Build with AI",
    description:
      "Get intelligent assistance for coding, debugging, documentation, and architecture.",
    icon: "✦",
    accent: "#7AA6FF",
  },
  {
    number: "03",
    title: "Collaborate",
    description:
      "Keep your team aligned with discussions, comments, files, and real-time updates.",
    icon: "⌁",
    accent: "#16A085",
  },
  {
    number: "04",
    title: "Connect GitHub",
    description:
      "Bring repositories, commits, issues, pull requests, and development activity together.",
    icon: "◉",
    accent: "#7AA6FF",
  },
  {
    number: "05",
    title: "Document",
    description:
      "Create technical documentation, API references, notes, and project knowledge.",
    icon: "▤",
    accent: "#7AA6FF",
  },
  {
    number: "06",
    title: "Track Progress",
    description:
      "Understand sprint progress, productivity, velocity, and overall project health.",
    icon: "↗",
    accent: "#16A085",
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className="relative overflow-hidden border-t border-[#F5F0E8]/10 bg-[#151D2B] px-6 py-20 text-[#F5F0E8] sm:px-10 lg:px-12 lg:py-28"
    >
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Grid */}
        <div className="features-grid absolute inset-0 opacity-30" />

        {/* Top glow */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            opacity: [0.12, 0.2, 0.12],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[20%] top-[-250px] h-[500px] w-[500px] rounded-full bg-[#7AA6FF]/20 blur-[150px]"
        />

        <motion.div
          animate={{
            x: [0, -80, 0],
            opacity: [0.08, 0.16, 0.08],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-[5%] top-[20%] h-[450px] w-[450px] rounded-full bg-[#7AA6FF]/15 blur-[150px]"
        />

        {/* Moving light */}
        <motion.div
          animate={{
            y: ["-20%", "120%"],
            opacity: [0, 0.4, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute left-[10%] h-[180px] w-px bg-gradient-to-b from-transparent via-[#7AA6FF] to-transparent"
        />
      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="relative mx-auto max-w-7xl">

        {/* Header — NO scroll animation */}
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#7AA6FF]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7AA6FF] shadow-[0_0_12px_#7AA6FF]" />
            Everything connected
          </span>

          <h2 className="mt-4 text-3xl font-semibold leading-[1.05] tracking-[-0.045em] text-[#F5F0E8] sm:text-4xl lg:text-[48px]">
            One workspace for the
            <br />

            <span className="bg-gradient-to-r from-[#7AA6FF] via-[#7AA6FF] to-[#7AA6FF] bg-clip-text text-transparent">
              entire engineering journey.
            </span>
          </h2>

          <p className="mt-5 max-w-xl text-sm leading-6 text-[#F5F0E8]/45 sm:text-base">
            From the first idea to the final release, Syncora keeps your
            engineering workflow connected, organized, and intelligent.
          </p>
        </div>

        {/* =====================================================
            FEATURE SYSTEM
        ====================================================== */}

        <div className="relative mt-12">

          {/* Connecting horizontal line */}
          <div className="pointer-events-none absolute left-[16.66%] right-[16.66%] top-1/2 hidden h-px bg-gradient-to-r from-transparent via-white/10 to-transparent lg:block" />

          {/* Animated signal */}
          <motion.div
            animate={{
              x: ["0%", "100%"],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
            className="pointer-events-none absolute left-[16.66%] top-1/2 hidden h-px w-20 bg-gradient-to-r from-transparent via-[#7AA6FF] to-transparent lg:block"
          />

          {/* Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.article
                key={feature.number}
                whileHover={{
                  y: -8,
                  rotateX: 3,
                  rotateY: index % 2 === 0 ? -2 : 2,
                  scale: 1.015,
                }}
                style={{
                  transformPerspective: 1000,
                }}
                className="group relative min-h-[235px] overflow-hidden rounded-2xl border border-[#F5F0E8]/[0.08] bg-[#F5F0E8]/[0.035] p-6 backdrop-blur-xl transition-colors duration-500 hover:border-[#F5F0E8]/[0.16] hover:bg-[#F5F0E8]/[0.055]"
              >
                {/* Card glow */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full blur-[70px]"
                  style={{
                    backgroundColor: feature.accent,
                  }}
                />

                {/* Bottom light */}
                <motion.div
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.5 }}
                  className="absolute bottom-0 left-0 h-px"
                  style={{
                    backgroundColor: feature.accent,
                    boxShadow: `0 0 20px ${feature.accent}`,
                  }}
                />

                {/* Top row */}
                <div className="relative z-10 flex items-center justify-between">

                  {/* Icon */}
                  <motion.div
                    whileHover={{
                      rotate: 8,
                      scale: 1.12,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 15,
                    }}
                    className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-[#F5F0E8]/10 bg-[#F5F0E8]/[0.06] text-base"
                    style={{
                      color: feature.accent,
                    }}
                  >
                    {/* Icon glow */}
                    <div
                      className="absolute inset-0 rounded-xl opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-40"
                      style={{
                        backgroundColor: feature.accent,
                      }}
                    />

                    <span className="relative">
                      {feature.icon}
                    </span>
                  </motion.div>

                  {/* Number */}
                  <span className="font-mono text-[11px] tracking-[0.2em] text-[#F5F0E8]/20 transition-colors duration-300 group-hover:text-[#F5F0E8]/40">
                    {feature.number}
                  </span>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="mt-7 text-lg font-semibold tracking-[-0.02em] text-[#F5F0E8]">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#F5F0E8]/40 transition-colors duration-300 group-hover:text-[#F5F0E8]/55">
                    {feature.description}
                  </p>
                </div>

                {/* Decorative corner */}
                <motion.div
                  initial={{
                    scale: 0,
                    opacity: 0,
                  }}
                  whileHover={{
                    scale: 1,
                    opacity: 1,
                  }}
                  className="absolute bottom-5 right-5 h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: feature.accent,
                    boxShadow: `0 0 15px ${feature.accent}`,
                  }}
                />

                {/* Card number background */}
                <span className="pointer-events-none absolute -bottom-8 -right-2 text-[100px] font-bold leading-none text-[#F5F0E8]/[0.015]">
                  {feature.number}
                </span>
              </motion.article>
            ))}
          </div>
        </div>

        {/* =====================================================
            BOTTOM SYSTEM INDICATOR
        ====================================================== */}

        <div className="mt-8 flex items-center justify-center gap-3 text-[10px] font-medium uppercase tracking-[0.2em] text-[#F5F0E8]/20">
          <span className="h-px w-12 bg-[#F5F0E8]/10" />

          <span className="relative flex items-center gap-2">
            <motion.span
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="h-1.5 w-1.5 rounded-full bg-[#7AA6FF] shadow-[0_0_10px_#7AA6FF]"
            />

            All systems connected
          </span>

          <span className="h-px w-12 bg-[#F5F0E8]/10" />
        </div>
      </div>
    </section>
  );
};

export default Features;