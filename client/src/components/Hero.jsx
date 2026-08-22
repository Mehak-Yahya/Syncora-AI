import { motion } from "framer-motion";
import useHeroAnimation from "../hooks/useHeroAnimation";
import "../styles/hero.css";
import { Link } from "react-router-dom";

const Hero = () => {
  const { containerVariants, itemVariants } = useHeroAnimation();

  const orbitItems = [
    { label: "PLAN", icon: "⌘", color: "#ff6b35", delay: 0 },
    { label: "BUILD", icon: "</>", color: "#7c5cff", delay: 0.4 },
    { label: "SHIP", icon: "↗", color: "#16b98d", delay: 0.8 },
    { label: "AI", icon: "✦", color: "#ff3d81", delay: 1.2 },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#08090d] text-white">
      {/* =========================================================
          BACKGROUND
      ========================================================== */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Ambient glow */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.35, 0.55, 0.35],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[48%] top-[-25%] h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-[#ff5c35]/20 blur-[140px]"
        />

        <motion.div
          animate={{
            x: [0, 80, 0],
            y: [0, -40, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[-25%] right-[-10%] h-[550px] w-[550px] rounded-full bg-[#635bff]/20 blur-[150px]"
        />

        {/* Grid */}
        <div className="hero-grid-dark absolute inset-0 opacity-50" />

        {/* Perspective floor */}
        <div className="hero-perspective-floor absolute bottom-[-35%] left-1/2 h-[70%] w-[140%] -translate-x-1/2 rotate-x-[62deg]" />
      </div>

      {/* =========================================================
          MAIN CONTENT
      ========================================================== */}
      <div className="relative mx-auto min-h-screen max-w-7xl px-6 pb-10 pt-24 sm:px-10 lg:px-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid min-h-[calc(100vh-7rem)] w-full items-center gap-12 lg:-translate-y-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14"
        >
          {/* =====================================================
              LEFT CONTENT — KEPT IN SAME POSITION
          ====================================================== */}
          <div className="relative z-20 max-w-2xl lg:-translate-x-10">
            <motion.div
              variants={itemVariants}
              className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-medium text-white/70 shadow-lg backdrop-blur-xl"
            >
              <motion.span
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="h-2 w-2 rounded-full bg-[#ff5c35] shadow-[0_0_12px_#ff5c35]"
              />
              AI-powered engineering workspace
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-white sm:text-6xl lg:text-[70px]"
            >
              Your entire engineering
              <br />
              <span className="bg-gradient-to-r from-[#ff6840] via-[#ff5c35] to-[#ff8c66] bg-clip-text text-transparent">
                in sync.
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-6 max-w-xl text-base leading-7 text-white/55 sm:text-lg"
            >
              Plan projects, collaborate with your team, connect GitHub,
              document your work, and get AI assistance — all from one
              engineering workspace.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-7 flex flex-col gap-3 sm:flex-row"
            >
              <motion.div
                whileHover={{
                  y: -3,
                  scale: 1.02,
                }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/signup"
                  className="inline-block rounded-xl bg-[#ff5c35] px-6 py-3.5 font-medium text-white shadow-[0_10px_30px_rgba(255,92,53,.18)] transition-all hover:shadow-[0_20px_50px_rgba(255,92,53,.3)]"
                >
                  Start Building — Free
                </Link>
              </motion.div>

              <motion.button
                whileHover={{
                  y: -3,
                  backgroundColor: "rgba(255,255,255,.08)",
                }}
                whileTap={{ scale: 0.98 }}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3.5 font-medium text-white transition-all backdrop-blur"
              >
                Explore Syncora
              </motion.button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/40"
            >
              <span>✓ Free to start</span>
              <span>✓ Built for developers</span>
              <span>✓ AI-powered</span>
            </motion.div>
          </div>

          {/* =====================================================
              RIGHT SIDE — HEAVY 3D SYNCORA ANIMATION
          ====================================================== */}
          <motion.div
            variants={itemVariants}
            className="relative mx-auto flex h-[520px] w-full max-w-xl items-center justify-center lg:-translate-y-2"
          >
            {/* Outer glow */}
            <motion.div
              animate={{
                scale: [1, 1.12, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute h-[350px] w-[350px] rounded-full bg-[#ff5c35]/30 blur-[100px]"
            />

            {/* =================================================
                3D CORE
            ================================================== */}
            <motion.div
              animate={{
                rotateY: [0, 360],
                rotateX: [8, -8, 8],
              }}
              transition={{
                rotateY: {
                  duration: 18,
                  repeat: Infinity,
                  ease: "linear",
                },
                rotateX: {
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
              style={{
                transformStyle: "preserve-3d",
                perspective: 1400,
              }}
              className="relative h-[260px] w-[260px]"
            >
              {/* Main glass cube */}
              <div
                style={{
                  transformStyle: "preserve-3d",
                  transform: "rotateX(12deg) rotateY(-25deg)",
                }}
                className="absolute inset-0"
              >
                {/* Front */}
                <div className="absolute inset-0 translate-z-[130px] overflow-hidden rounded-[32px] border border-white/20 bg-white/[0.08] shadow-[inset_0_0_50px_rgba(255,255,255,.04),0_40px_100px_rgba(0,0,0,.4)] backdrop-blur-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#ff5c35]/20 via-transparent to-[#635bff]/20" />

                  {/* Syncora logo */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{
                        rotate: [0, 180, 360],
                        scale: [1, 1.08, 1],
                      }}
                      transition={{
                        rotate: {
                          duration: 8,
                          repeat: Infinity,
                          ease: "linear",
                        },
                        scale: {
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        },
                      }}
                      className="relative h-28 w-28"
                    >
                      <div className="absolute inset-0 rounded-[30px] border border-[#ff5c35]/40 bg-[#ff5c35]/10 shadow-[0_0_60px_rgba(255,92,53,.25)]" />

                      <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[18px] bg-gradient-to-br from-[#ff7b58] to-[#ff3d21] shadow-[0_0_40px_rgba(255,92,53,.5)]" />

                      <div className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-lg bg-[#08090d]" />
                    </motion.div>
                  </div>

                  {/* Core label */}
                  <div className="absolute bottom-5 left-0 right-0 text-center">
                    <p className="text-xs font-semibold tracking-[0.35em] text-white/60">
                      SYNCORA
                    </p>
                  </div>
                </div>

                {/* Back */}
                <div className="absolute inset-0 -translate-z-[130px] rounded-[32px] border border-white/10 bg-[#635bff]/10" />

                {/* Left */}
                <div className="absolute left-0 top-0 h-full w-[260px] origin-left -rotate-y-90 rounded-[32px] border border-white/10 bg-[#ff5c35]/10" />

                {/* Right */}
                <div className="absolute right-0 top-0 h-full w-[260px] origin-right rotate-y-90 rounded-[32px] border border-white/10 bg-[#635bff]/10" />

                {/* Top */}
                <div className="absolute left-0 top-0 h-[260px] w-full origin-top rotate-x-90 rounded-[32px] border border-white/10 bg-white/[0.04]" />

                {/* Bottom */}
                <div className="absolute bottom-0 left-0 h-[260px] w-full origin-bottom -rotate-x-90 rounded-[32px] border border-white/10 bg-[#ff5c35]/5" />
              </div>
            </motion.div>

            {/* =================================================
                ORBIT RING
            ================================================== */}
            <motion.div
              animate={{ rotateZ: 360 }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute h-[420px] w-[420px] rounded-full border border-white/[0.08]"
            >
              <motion.div
                animate={{ rotateZ: -360 }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute -top-3 left-1/2 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full bg-[#ff5c35] shadow-[0_0_25px_rgba(255,92,53,.8)]"
              />
            </motion.div>

            {/* Second orbit */}
            <motion.div
              animate={{
                rotateZ: [0, -360],
                rotateX: [55, 55],
              }}
              transition={{
                rotateZ: {
                  duration: 25,
                  repeat: Infinity,
                  ease: "linear",
                },
              }}
              className="absolute h-[350px] w-[350px] rounded-full border border-[#635bff]/20"
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              <div className="absolute right-0 top-1/2 h-3 w-3 rounded-full bg-[#635bff] shadow-[0_0_20px_#635bff]" />
            </motion.div>

            {/* =================================================
                FLOATING ENGINEERING NODES
            ================================================== */}
            {orbitItems.map((item, index) => {
              const positions = [
                "left-[2%] top-[25%]",
                "right-[0%] top-[15%]",
                "right-[4%] bottom-[18%]",
                "left-[5%] bottom-[12%]",
              ];

              return (
                <motion.div
                  key={item.label}
                  animate={{
                    y: [0, -12, 0],
                    rotateZ: [0, 2, 0],
                  }}
                  transition={{
                    duration: 4 + index,
                    delay: item.delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className={`absolute ${positions[index]} hidden rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 shadow-2xl backdrop-blur-xl sm:block`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold"
                      style={{
                        color: item.color,
                        backgroundColor: `${item.color}18`,
                        boxShadow: `0 0 25px ${item.color}18`,
                      }}
                    >
                      {item.icon}
                    </div>

                    <div>
                      <p className="text-[10px] tracking-[0.2em] text-white/30">
                        SYNCORA
                      </p>

                      <p className="text-xs font-semibold text-white/70">
                        {item.label}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* =================================================
                AI PARTICLES
            ================================================== */}
            {Array.from({ length: 14 }).map((_, index) => {
              const angle = (index / 14) * Math.PI * 2;
              const radius = 180 + (index % 3) * 45;

              return (
                <motion.span
                  key={index}
                  animate={{
                    x: [
                      Math.cos(angle) * radius,
                      Math.cos(angle + 0.4) * (radius + 15),
                      Math.cos(angle) * radius,
                    ],
                    y: [
                      Math.sin(angle) * radius,
                      Math.sin(angle + 0.4) * (radius + 15),
                      Math.sin(angle) * radius,
                    ],
                    opacity: [0.15, 0.7, 0.15],
                    scale: [0.7, 1.2, 0.7],
                  }}
                  transition={{
                    duration: 5 + (index % 4),
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.2,
                  }}
                  className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-[#ff5c35]"
                />
              );
            })}

            {/* AI connection lines */}
            <div className="absolute h-[300px] w-[300px] rounded-full border border-dashed border-white/[0.06]" />
            <div className="absolute h-[470px] w-[470px] rounded-full border border-dashed border-white/[0.04]" />
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />
    </section>
  );
};

export default Hero;
