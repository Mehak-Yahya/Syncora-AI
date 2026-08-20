import { motion } from "framer-motion";
import useHeroAnimation from "../hooks/useHeroAnimation";
import "../styles/hero.css";

const Hero = () => {
  const { containerVariants, itemVariants } = useHeroAnimation();

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#FAF9F6] text-[#171717]">
      <div className="pointer-events-none absolute inset-0">
        <div className="hero-glow absolute left-[45%] top-[-18%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-orange-200/40 blur-[130px]" />

        <div className="hero-glow-secondary absolute bottom-[-15%] right-[-5%] h-[420px] w-[420px] rounded-full bg-indigo-200/25 blur-[130px]" />

        <div className="hero-grid absolute inset-0 opacity-70" />
      </div>

      <div className="relative mx-auto min-h-screen max-w-7xl px-6 pt-24 pb-10 sm:px-10 lg:px-12 lg:pt-24 lg:pb-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid w-full items-center gap-12 lg:min-h-[calc(100vh-7rem)] lg:-translate-y-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14"
        >
          <div className="max-w-2xl lg:-translate-x-10">
            <motion.div
              variants={itemVariants}
              className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-[#E7E2DA] bg-white/80 px-4 py-2 text-sm font-medium text-[#5F5B55] shadow-sm backdrop-blur"
            >
              <span className="h-2 w-2 rounded-full bg-[#FF5C35]" />
              AI-powered engineering workspace
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-[#171717] sm:text-6xl lg:text-[70px]"
            >
              Your entire engineering 
                <br />
              <span className="text-[#FF5C35]">in sync.</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-6 max-w-xl text-base leading-7 text-[#6B6862] sm:text-lg"
            >
              Plan projects, collaborate with your team, connect GitHub,
              document your work, and get AI assistance — all from one
              engineering workspace.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-7 flex flex-col gap-3 sm:flex-row"
            >
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-xl bg-[#FF5C35] px-6 py-3.5 font-medium text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-[#E94B27] hover:shadow-xl hover:shadow-orange-500/25"
              >
                Start Building — Free
              </motion.button>

              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-xl border border-[#DDD8D0] bg-white px-6 py-3.5 font-medium text-[#252321] transition-all hover:border-[#CFC8BE] hover:bg-[#F5F2ED]"
              >
                Explore Syncora
              </motion.button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#8A857D]"
            >
              <span>✓ Free to start</span>
              <span>✓ Built for developers</span>
              <span>✓ AI-powered</span>
            </motion.div>
          </div>

          <motion.div
            variants={itemVariants}
            className="relative mx-auto w-full max-w-xl lg:-translate-y-2"
          >
            <div className="hero-dashboard relative">
              <div className="absolute inset-8 rounded-[32px] bg-orange-300/20 blur-[70px]" />

              <div className="relative overflow-hidden rounded-[22px] border border-[#E2DED7] bg-white shadow-[0_30px_80px_rgba(40,35,30,0.12)]">
                <div className="flex items-center justify-between border-b border-[#ECE8E2] px-5 py-4">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#D8D3CB]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#D8D3CB]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#D8D3CB]" />
                  </div>

                  <span className="text-xs font-medium text-[#A09A91]">
                    syncora.dev
                  </span>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-[#A09A91]">Workspace</p>

                      <h3 className="mt-1 text-lg font-semibold text-[#171717]">
                        Engineering
                      </h3>
                    </div>

                    <div className="rounded-lg bg-[#FFF0EB] px-3 py-1.5 text-xs font-semibold text-[#E94B27]">
                      AI Active
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-3">
                    {[
                      ["Projects", "12"],
                      ["Tasks", "48"],
                      ["Progress", "76%"],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-xl border border-[#ECE8E2] bg-[#FBFAF8] p-3"
                      >
                        <p className="text-[11px] text-[#A09A91]">{label}</p>

                        <p className="mt-2 text-lg font-semibold text-[#171717]">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-xl border border-[#ECE8E2] bg-[#FBFAF8] p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-[#A09A91]">
                          Current Sprint
                        </p>

                        <p className="mt-1 text-sm font-medium text-[#252321]">
                          Authentication & API
                        </p>
                      </div>

                      <span className="text-sm font-semibold text-[#FF5C35]">
                        76%
                      </span>
                    </div>

                    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#E8E4DE]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "76%" }}
                        transition={{
                          duration: 1.2,
                          delay: 0.7,
                          ease: "easeOut",
                        }}
                        className="h-full rounded-full bg-[#FF5C35]"
                      />
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border border-[#E8E2F7] bg-[#F8F5FC] p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#ECE5FA] text-sm text-[#635BFF]">
                        ✦
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-[#635BFF]">
                          Syncora AI
                        </p>

                        <p className="mt-1 text-xs leading-5 text-[#716D78]">
                          Sprint progress is strong. 4 tasks need attention
                          before the next review.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -right-4 top-16 hidden rounded-xl border border-[#E4DFD8] bg-white px-4 py-3 shadow-xl shadow-black/5 sm:block"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[#635BFF]">✦</span>

                  <span className="text-xs font-medium text-[#68635C]">
                    AI analyzing project
                  </span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="absolute -bottom-4 -left-4 hidden rounded-xl border border-[#E4DFD8] bg-white px-4 py-3 shadow-xl shadow-black/5 sm:block"
              >
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#20A464]" />

                  <span className="text-xs font-medium text-[#68635C]">
                    GitHub synced
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-[#E5E0D8]" />
    </section>
  );
};

export default Hero;