import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import useAIAnimation from "../hooks/useAIAnimation";
import "../styles/ai-section.css";

const nodes = [
  {
    label: "GitHub",
    icon: "◉",
    color: "#8B5CF6",
    position: "left-[2%] top-[15%]",
    delay: 0,
  },
  {
    label: "Tasks",
    icon: "✓",
    color: "#00D9FF",
    position: "right-[2%] top-[20%]",
    delay: 0.7,
  },
  {
    label: "Docs",
    icon: "▤",
    color: "#22C55E",
    position: "left-[5%] bottom-[20%]",
    delay: 1.2,
  },
  {
    label: "Projects",
    icon: "◆",
    color: "#FF5C35",
    position: "right-[4%] bottom-[18%]",
    delay: 1.8,
  },
  {
    label: "Code",
    icon: "</>",
    color: "#EC4899",
    position: "left-[27%] top-[4%]",
    delay: 2.4,
  },
];

const particles = Array.from({ length: 32 });

const AISection = () => {
  const { containerVariants, itemVariants } = useAIAnimation();

  const visualRef = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [8, -8]),
    {
      stiffness: 70,
      damping: 18,
    }
  );

  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-10, 10]),
    {
      stiffness: 70,
      damping: 18,
    }
  );

  const handleMouseMove = (event) => {
    if (!visualRef.current) return;

    const rect = visualRef.current.getBoundingClientRect();

    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      id="ai"
      className="relative overflow-hidden border-y border-white/[0.07] bg-[#070A0F] px-6 py-16 text-white sm:px-10 lg:px-12 lg:py-20"
    >
      {/* =========================================================
          BACKGROUND
      ========================================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />

        {/* Purple glow */}
        <motion.div
          animate={{
            x: [-40, 30, -40],
            y: [-20, 30, -20],
            scale: [1, 1.15, 1],
            opacity: [0.12, 0.22, 0.12],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[-10%] top-[5%] h-[420px] w-[420px] rounded-full bg-violet-600/20 blur-[140px]"
        />

        {/* Cyan glow */}
        <motion.div
          animate={{
            x: [30, -30, 30],
            y: [20, -30, 20],
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[-10%] right-[-5%] h-[450px] w-[450px] rounded-full bg-cyan-500/15 blur-[150px]"
        />

        {/* Center glow */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.08, 0.16, 0.08],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/10 blur-[150px]"
        />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16"
        >
          {/* =========================================================
              LEFT CONTENT
          ========================================================= */}

          <div className="max-w-xl">
            <motion.span
              variants={itemVariants}
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-cyan-400"
            >
              <motion.span
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.4, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_#22D3EE]"
              />

              Syncora AI
            </motion.span>

            <motion.h2
              variants={itemVariants}
              className="mt-4 text-4xl font-semibold leading-[1.05] tracking-[-0.045em] text-white sm:text-5xl"
            >
              Your engineering
              <br />

              <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                co-pilot.
              </span>
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="mt-5 max-w-lg text-base leading-7 text-white/55 sm:text-lg"
            >
              Syncora AI understands your projects, tasks, documentation, and
              development activity so you can spend less time searching and
              more time building.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-7 space-y-3.5"
            >
              {[
                "Understand project context",
                "Analyze tasks and development activity",
                "Generate and improve documentation",
                "Help debug and solve engineering problems",
              ].map((item) => (
                <motion.div
                  key={item}
                  whileHover={{ x: 6 }}
                  className="flex items-center gap-3 text-sm text-white/65"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-[10px] font-bold text-cyan-400">
                    ✓
                  </span>

                  {item}
                </motion.div>
              ))}
            </motion.div>

            <motion.button
              variants={itemVariants}
              whileHover={{
                y: -3,
                scale: 1.02,
                boxShadow:
                  "0 0 35px rgba(34,211,238,.18), 0 15px 35px rgba(0,0,0,.4)",
              }}
              whileTap={{ scale: 0.98 }}
              className="mt-8 rounded-xl border border-white/10 bg-white px-6 py-3.5 text-sm font-semibold text-[#070A0F] transition-all"
            >
              Explore Syncora AI →
            </motion.button>
          </div>

          {/* =========================================================
              3D ENGINEERING NETWORK
          ========================================================= */}

          <motion.div
            variants={itemVariants}
            ref={visualRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative flex min-h-[580px] items-center justify-center"
            style={{
              perspective: 1200,
            }}
          >
            <motion.div
              className="relative h-[520px] w-full max-w-[620px]"
              style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }}
            >
              {/* =====================================================
                  CENTRAL ATMOSPHERE
              ===================================================== */}

              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.25, 0.45, 0.25],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/20 blur-[100px]"
              />

              <motion.div
                animate={{
                  scale: [1.1, 0.9, 1.1],
                  opacity: [0.15, 0.3, 0.15],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute left-1/2 top-1/2 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/20 blur-[70px]"
              />

              {/* =====================================================
                  3D ORBIT RINGS
              ===================================================== */}

              <motion.div
                animate={{
                  rotateZ: 360,
                }}
                transition={{
                  duration: 24,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/10"
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                <div className="absolute left-1/2 top-[-4px] h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-cyan-400 shadow-[0_0_20px_#22D3EE]" />

                <div className="absolute bottom-[18%] left-[-3px] h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_18px_#8B5CF6]" />
              </motion.div>

              <motion.div
                animate={{
                  rotateZ: -360,
                }}
                transition={{
                  duration: 17,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-violet-400/15"
              >
                <div className="absolute right-[7%] top-[12%] h-2 w-2 rounded-full bg-fuchsia-400 shadow-[0_0_15px_#EC4899]" />
              </motion.div>

              <motion.div
                animate={{
                  rotateZ: 360,
                  scale: [1, 1.04, 1],
                }}
                transition={{
                  rotateZ: {
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear",
                  },
                  scale: {
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                className="absolute left-1/2 top-1/2 h-[285px] w-[285px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-fuchsia-400/10"
              />

              {/* =====================================================
                  3D FLOOR / GRID
              ===================================================== */}

              <div
                className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-[40px] border border-white/[0.05]"
                style={{
                  transform:
                    "translate(-50%, -50%) rotateX(65deg) rotateZ(25deg)",
                  transformStyle: "preserve-3d",
                }}
              />

              <div
                className="absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-[30px] border border-cyan-400/[0.08]"
                style={{
                  transform:
                    "translate(-50%, -50%) rotateX(65deg) rotateZ(25deg)",
                }}
              />

              {/* =====================================================
                  CONNECTION NETWORK
              ===================================================== */}

              <svg
                className="pointer-events-none absolute inset-0 h-full w-full"
                viewBox="0 0 620 520"
                fill="none"
              >
                <defs>
                  <linearGradient
                    id="networkGradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#22D3EE"
                      stopOpacity="0"
                    />

                    <stop
                      offset="50%"
                      stopColor="#8B5CF6"
                      stopOpacity="0.8"
                    />

                    <stop
                      offset="100%"
                      stopColor="#EC4899"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>

                {[
                  "M 90 110 L 310 260",
                  "M 530 130 L 310 260",
                  "M 105 410 L 310 260",
                  "M 515 390 L 310 260",
                  "M 280 55 L 310 260",
                ].map((path, index) => (
                  <motion.path
                    key={index}
                    d={path}
                    stroke="url(#networkGradient)"
                    strokeWidth="1.5"
                    strokeDasharray="5 8"
                    initial={{
                      pathLength: 0,
                      opacity: 0,
                    }}
                    whileInView={{
                      pathLength: 1,
                      opacity: 1,
                    }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 1.4,
                      delay: index * 0.15,
                    }}
                  />
                ))}
              </svg>

              {/* =====================================================
                  TRAVELING DATA PARTICLES
              ===================================================== */}

              {[0, 1, 2, 3, 4, 5].map((index) => (
                <motion.div
                  key={index}
                  animate={{
                    x: [0, 80, 180, 220],
                    y: [0, 50, 110, 150],
                    opacity: [0, 1, 1, 0],
                    scale: [0.4, 1, 1.2, 0.2],
                  }}
                  transition={{
                    duration: 3,
                    delay: index * 0.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute left-[14%] top-[21%] z-20 h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_14px_#22D3EE]"
                />
              ))}

              {/* =====================================================
                  CENTRAL AI CORE
              ===================================================== */}

              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotateZ: [0, 1.5, -1.5, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute left-1/2 top-1/2 z-30"
                style={{
                  transform: "translate(-50%, -50%) translateZ(90px)",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Core glow */}
                <motion.div
                  animate={{
                    scale: [0.9, 1.2, 0.9],
                    opacity: [0.15, 0.35, 0.15],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                  className="absolute inset-[-50px] rounded-full bg-violet-500/30 blur-[50px]"
                />

                {/* Core */}
                <div
                  className="relative flex h-48 w-48 flex-col items-center justify-center overflow-hidden rounded-[38px] border border-white/15"
                  style={{
                    background:
                      "linear-gradient(145deg, rgba(25,30,42,.98), rgba(10,14,22,.98))",
                    boxShadow:
                      "0 30px 80px rgba(0,0,0,.55), inset 0 1px 1px rgba(255,255,255,.1)",
                  }}
                >
                  {/* scanning light */}
                  <motion.div
                    animate={{
                      y: [-90, 90, -90],
                    }}
                    transition={{
                      duration: 3.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute h-20 w-full bg-cyan-400/10 blur-[30px]"
                  />

                  {/* inner glow */}
                  <motion.div
                    animate={{
                      scale: [0.8, 1.2, 0.8],
                      opacity: [0.2, 0.45, 0.2],
                    }}
                    transition={{
                      duration: 2.8,
                      repeat: Infinity,
                    }}
                    className="absolute h-28 w-28 rounded-full bg-cyan-400/20 blur-[35px]"
                  />

                  {/* AI icon */}
                  <motion.div
                    animate={{
                      scale: [1, 1.08, 1],
                      rotateZ: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/20 bg-gradient-to-br from-cyan-400 to-violet-500 text-2xl text-white shadow-[0_0_35px_rgba(34,211,238,.25)]"
                  >
                    ✦
                  </motion.div>

                  <p className="relative mt-4 text-sm font-semibold text-white">
                    Syncora AI
                  </p>

                  <div className="relative mt-1 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#22C55E]" />

                    <span className="text-[10px] text-white/45">
                      Context active
                    </span>
                  </div>
                </div>

                {/* 3D depth */}
                <div
                  className="absolute inset-0 -z-10 rounded-[38px] bg-violet-700/30"
                  style={{
                    transform: "translateZ(-28px) translateY(10px)",
                  }}
                />
              </motion.div>

              {/* =====================================================
                  DATA NODES
              ===================================================== */}

              {nodes.map((node, index) => (
                <motion.div
                  key={node.label}
                  className={`absolute ${node.position} z-40`}
                  initial={{
                    opacity: 0,
                    scale: 0.6,
                    y: 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                  }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.7,
                    delay: 0.3 + index * 0.15,
                    type: "spring",
                  }}
                  animate={{
                    y: [0, index % 2 === 0 ? -9 : 9, 0],
                    rotateZ: [0, index % 2 ? 1 : -1, 0],
                  }}
                  style={{
                    transform: `translateZ(${40 + index * 18}px)`,
                  }}
                >
                  <div className="relative">
                    {/* Glow */}
                    <div
                      className="absolute inset-0 rounded-2xl opacity-30 blur-xl"
                      style={{
                        backgroundColor: node.color,
                      }}
                    />

                    {/* Card */}
                    <div className="relative flex items-center gap-2.5 rounded-2xl border border-white/10 bg-[#11151D]/90 px-3.5 py-3 shadow-[0_20px_45px_rgba(0,0,0,.4)] backdrop-blur-xl">
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-[11px] font-bold text-white"
                        style={{
                          background: `linear-gradient(135deg, ${node.color}, #111827)`,
                          boxShadow: `0 8px 25px ${node.color}35`,
                        }}
                      >
                        {node.icon}
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold text-white">
                          {node.label}
                        </p>

                        <p className="mt-0.5 text-[9px] text-white/35">
                          Connected
                        </p>
                      </div>

                      <span className="ml-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#22C55E]" />
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* =====================================================
                  FLOATING STATUS
              ===================================================== */}

              <motion.div
                animate={{
                  y: [0, -8, 0],
                  rotateZ: [0, 1, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute right-[1%] top-[2%] z-50 rounded-2xl border border-white/10 bg-[#11151D]/90 px-4 py-3 shadow-[0_20px_45px_rgba(0,0,0,.35)] backdrop-blur-xl"
                style={{
                  transform: "translateZ(120px)",
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />

                    <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  </span>

                  <span className="text-[10px] font-semibold text-white/70">
                    AI Context Active
                  </span>
                </div>
              </motion.div>

              {/* =====================================================
                  ANALYSIS CARD
              ===================================================== */}

              <motion.div
                animate={{
                  y: [0, 8, 0],
                  rotateZ: [0, -1, 0],
                }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="absolute bottom-[3%] right-[1%] z-50 w-48 rounded-2xl border border-white/10 bg-[#11151D]/90 p-3.5 shadow-[0_20px_45px_rgba(0,0,0,.4)] backdrop-blur-xl"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-500/10 text-xs text-violet-400">
                    ✦
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold text-white">
                      Workspace analysis
                    </p>

                    <p className="text-[9px] text-white/35">
                      24 signals detected
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex h-5 items-end gap-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((bar) => (
                    <motion.span
                      key={bar}
                      animate={{
                        height: [5, 10 + (bar % 3) * 5, 5],
                      }}
                      transition={{
                        duration: 1.1,
                        delay: bar * 0.08,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="flex-1 rounded-full bg-gradient-to-t from-violet-500 to-cyan-400"
                    />
                  ))}
                </div>
              </motion.div>

              {/* =====================================================
                  PARTICLES
              ===================================================== */}

              {particles.map((_, index) => (
                <motion.span
                  key={index}
                  animate={{
                    y: [0, -20, 0],
                    x: [0, index % 2 ? 8 : -8, 0],
                    opacity: [0.08, 0.7, 0.08],
                    scale: [0.5, 1.2, 0.5],
                  }}
                  transition={{
                    duration: 3 + (index % 4),
                    delay: index * 0.15,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className={`absolute z-10 h-1.5 w-1.5 rounded-full ${
                    index % 3 === 0
                      ? "bg-cyan-400"
                      : index % 3 === 1
                      ? "bg-violet-400"
                      : "bg-fuchsia-400"
                  }`}
                  style={{
                    left: `${8 + ((index * 31) % 84)}%`,
                    top: `${5 + ((index * 47) % 88)}%`,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AISection;