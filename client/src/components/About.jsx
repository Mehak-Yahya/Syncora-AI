import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef } from "react";

const About = () => {
  const sceneRef = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [7, -7]),
    {
      stiffness: 70,
      damping: 18,
    }
  );

  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-9, 9]),
    {
      stiffness: 70,
      damping: 18,
    }
  );

  const handleMouseMove = (e) => {
    if (!sceneRef.current) return;

    const rect = sceneRef.current.getBoundingClientRect();

    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const floatingItems = [
    {
      title: "Projects",
      subtitle: "Planning",
      icon: "▦",
      color: "#FF6848",
      position: "left-[2%] top-[15%]",
    },
    {
      title: "GitHub",
      subtitle: "Development",
      icon: "◉",
      color: "#8B7CFF",
      position: "right-[3%] top-[11%]",
    },
    {
      title: "Docs",
      subtitle: "Knowledge",
      icon: "▤",
      color: "#42CFA1",
      position: "left-[8%] bottom-[16%]",
    },
    {
      title: "Team",
      subtitle: "Collaboration",
      icon: "⌁",
      color: "#4CA8FF",
      position: "right-[5%] bottom-[15%]",
    },
  ];

  return (
    <section
      id="about"
      className="relative overflow-hidden border-y border-[#24232A] bg-[#08090B] px-6 py-20 text-white sm:px-10 lg:px-12 lg:py-28"
    >
      {/* =========================================================
          BACKGROUND
      ========================================================= */}

      <div className="pointer-events-none absolute inset-0">
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Orange glow */}
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.05, 0.13, 0.05],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[10%] top-[20%] h-[420px] w-[420px] rounded-full bg-[#FF5C35] blur-[150px]"
        />

        {/* Purple glow */}
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.04, 0.1, 0.04],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[-10%] right-[5%] h-[450px] w-[450px] rounded-full bg-[#635BFF] blur-[160px]"
        />
      </div>

      {/* =========================================================
          CONTENT
      ========================================================= */}

      <div className="relative mx-auto max-w-7xl">
        <div className="grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">

          {/* =====================================================
              LEFT CONTENT
          ===================================================== */}

          <div className="max-w-xl">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#FF5C35]" />

              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FF7255]">
                About Syncora
              </span>
            </div>

            <h2 className="mt-6 text-4xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-5xl lg:text-[58px]">
              Stop switching
              <br />

              <span className="text-[#FF6848]">
                between the pieces.
              </span>
            </h2>

            <p className="mt-6 max-w-lg text-base leading-7 text-[#A5A3AA] sm:text-lg">
              Syncora is an AI-powered engineering workspace that brings
              planning, development, collaboration, documentation, and
              intelligence into one continuous workflow.
            </p>

            <p className="mt-4 max-w-lg text-sm leading-6 text-[#77757D]">
              Your project should not feel like a collection of disconnected
              tools. Syncora keeps the context moving with you from the first
              idea to the final release.
            </p>

            <div className="mt-9 space-y-4">
              {[
                "One connected engineering workspace",
                "AI that understands your project context",
                "Built around how modern teams actually work",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#2D2C33] bg-[#111216] text-[10px] text-[#FF6848]">
                    ✓
                  </span>

                  <span className="text-sm text-[#B9B6BE]">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* =====================================================
              3D WORKFLOW VISUAL
          ===================================================== */}

          <div
            ref={sceneRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative min-h-[540px]"
            style={{
              perspective: 1200,
            }}
          >
            <motion.div
              className="absolute inset-0"
              style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }}
            >

              {/* =================================================
                  FLOOR
              ================================================= */}

              <motion.div
                animate={{
                  rotateZ: [0, 360],
                }}
                transition={{
                  duration: 40,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute left-1/2 top-1/2 h-[390px] w-[390px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#292830]"
                style={{
                  transform:
                    "translate(-50%, -50%) rotateX(68deg)",
                }}
              />

              <div
                className="absolute left-1/2 top-[68%] h-[250px] w-[470px] -translate-x-1/2 rounded-[50%] border border-[#25242B]"
                style={{
                  transform: "rotateX(72deg)",
                }}
              />

              {/* =================================================
                  STREAMING LINES
              ================================================= */}

              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 650 540"
                fill="none"
              >
                <defs>
                  <linearGradient id="flow1">
                    <stop
                      offset="0%"
                      stopColor="#FF5C35"
                      stopOpacity="0"
                    />
                    <stop
                      offset="50%"
                      stopColor="#FF5C35"
                      stopOpacity=".8"
                    />
                    <stop
                      offset="100%"
                      stopColor="#FF5C35"
                      stopOpacity="0"
                    />
                  </linearGradient>

                  <linearGradient id="flow2">
                    <stop
                      offset="0%"
                      stopColor="#635BFF"
                      stopOpacity="0"
                    />
                    <stop
                      offset="50%"
                      stopColor="#635BFF"
                      stopOpacity=".7"
                    />
                    <stop
                      offset="100%"
                      stopColor="#635BFF"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>

                {[0, 1, 2, 3, 4].map((line) => (
                  <path
                    key={line}
                    d={`M ${40 + line * 20} ${
                      120 + line * 20
                    } C 180 170, 230 ${
                      350 - line * 15
                    }, 325 270 C 430 ${
                      190 + line * 10
                    }, 500 ${
                      360 - line * 20
                    }, 610 ${400 - line * 15}`}
                    stroke={
                      line % 2
                        ? "url(#flow2)"
                        : "url(#flow1)"
                    }
                    strokeWidth={1.5}
                    strokeDasharray="5 10"
                  />
                ))}
              </svg>

              {/* =================================================
                  MOVING SIGNALS
              ================================================= */}

              {[0, 1, 2, 3, 4, 5].map((item) => (
                <motion.span
                  key={item}
                  animate={{
                    x: [0, 180, 350],
                    y: [0, 40, -10],
                    opacity: [0, 1, 0],
                    scale: [0.4, 1.2, 0.3],
                  }}
                  transition={{
                    duration: 3.5,
                    delay: item * 0.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute left-[10%] top-[28%] h-1.5 w-1.5 rounded-full bg-[#FF6848] shadow-[0_0_15px_#FF6848]"
                />
              ))}

              {/* =================================================
                  FLOATING ITEMS
              ================================================= */}

              {floatingItems.map((item, index) => (
                <motion.div
                  key={item.title}
                  className={`absolute ${item.position} z-30`}
                  animate={{
                    y: [0, index % 2 ? 7 : -7, 0],
                  }}
                  transition={{
                    duration: 3 + index * 0.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    transform: `translateZ(${40 + index * 15}px)`,
                  }}
                >
                  <div className="rounded-2xl border border-white/10 bg-[#111216]/90 px-3.5 py-3 shadow-[0_20px_50px_rgba(0,0,0,.35)] backdrop-blur-xl">
                    <div className="flex items-center gap-2.5">

                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold"
                        style={{
                          color: item.color,
                          backgroundColor: `${item.color}15`,
                          border: `1px solid ${item.color}35`,
                        }}
                      >
                        {item.icon}
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold text-white">
                          {item.title}
                        </p>

                        <p className="text-[9px] text-[#77757D]">
                          {item.subtitle}
                        </p>
                      </div>

                    </div>
                  </div>
                </motion.div>
              ))}

              {/* =================================================
                  MAIN FLOW OBJECT
              ================================================= */}

              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotateY: [0, 8, -8, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute left-1/2 top-1/2 z-40"
                style={{
                  transform:
                    "translate(-50%, -50%) translateZ(90px)",
                  transformStyle: "preserve-3d",
                }}
              >

                {/* Back depth */}

                <div
                  className="absolute inset-0 translate-y-5 rounded-[30px] bg-[#6D2113]"
                  style={{
                    transform: "translateZ(-35px)",
                  }}
                />

                {/* Main object */}

                <div
                  className="relative h-[210px] w-[280px] rounded-[30px] border border-white/10 bg-[#151519]"
                  style={{
                    boxShadow:
                      "0 40px 90px rgba(0,0,0,.55), inset 0 1px 1px rgba(255,255,255,.08)",
                    transformStyle: "preserve-3d",
                  }}
                >

                  {/* Top glow */}

                  <motion.div
                    animate={{
                      opacity: [0.2, 0.5, 0.2],
                      scale: [0.9, 1.1, 0.9],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                    }}
                    className="absolute left-1/2 top-[-60px] h-40 w-40 -translate-x-1/2 rounded-full bg-[#FF5C35]/25 blur-[55px]"
                  />

                  {/* Header */}

                  <div className="flex items-center justify-between border-b border-[#292830] px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#FF6848]" />

                      <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#77757D]">
                        Syncora
                      </span>
                    </div>

                    <span className="text-[9px] text-[#4F4D55]">
                      SYSTEM
                    </span>
                  </div>

                  {/* Flow */}

                  <div className="relative px-5 py-6">
                    <p className="text-xs text-[#77757D]">
                      Engineering context
                    </p>

                    <div className="mt-4 flex items-center gap-2">
                      <div className="h-1.5 flex-1 rounded-full bg-[#292830]">
                        <motion.div
                          animate={{
                            width: ["20%", "85%", "20%"],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="h-full rounded-full bg-[#FF5C35]"
                        />
                      </div>

                      <span className="text-[9px] text-[#FF6848]">
                        SYNC
                      </span>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      {["IDEA", "BUILD", "SHIP"].map(
                        (step, index) => (
                          <div
                            key={step}
                            className="flex flex-col items-center"
                          >
                            <motion.div
                              animate={{
                                scale:
                                  index === 1
                                    ? [1, 1.15, 1]
                                    : 1,
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                              }}
                              className={`flex h-8 w-8 items-center justify-center rounded-full border text-[8px] ${
                                index === 1
                                  ? "border-[#FF5C35] bg-[#FF5C35]/10 text-[#FF6848]"
                                  : "border-[#292830] bg-[#111216] text-[#77757D]"
                              }`}
                            >
                              {index + 1}
                            </motion.div>

                            <span className="mt-2 text-[8px] text-[#77757D]">
                              {step}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* =================================================
                  STATUS
              ================================================= */}

              <motion.div
                animate={{
                  y: [0, -6, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                }}
                className="absolute bottom-[4%] left-1/2 z-50 -translate-x-1/2"
              >
                <div className="flex items-center gap-2 rounded-full border border-[#292830] bg-[#111216]/90 px-4 py-2 backdrop-blur-xl">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#35D6A0] shadow-[0_0_10px_#35D6A0]" />

                  <span className="whitespace-nowrap text-[10px] text-[#8D8A92]">
                    One continuous engineering context
                  </span>
                </div>
              </motion.div>

            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;