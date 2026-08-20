import { motion } from "framer-motion";
import useAIAnimation from "../hooks/useAIAnimation";
import "../styles/ai-section.css";

const AISection = () => {
  const { containerVariants, itemVariants } = useAIAnimation();

  return (
    <section
      id="ai"
      className="relative overflow-hidden border-y border-[#E8DED5] bg-[#FFF7F2] px-6 py-16 sm:px-10 lg:px-12 lg:py-20"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="ai-section-grid absolute inset-0 opacity-40" />

        <div className="absolute right-[5%] top-[5%] h-80 w-80 rounded-full bg-[#FFB89F]/25 blur-[120px]" />

        <div className="absolute bottom-[-5%] left-[5%] h-72 w-72 rounded-full bg-[#FFD8C9]/30 blur-[120px]" />

        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-100/20 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16"
        >
          <div className="max-w-xl">
            <motion.span
              variants={itemVariants}
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#E94B27]"
            >
              <span className="h-2 w-2 rounded-full bg-[#FF5C35]" />
              Syncora AI
            </motion.span>

            <motion.h2
              variants={itemVariants}
              className="mt-4 text-4xl font-semibold leading-[1.05] tracking-[-0.045em] text-[#171717] sm:text-5xl"
            >
              Your engineering
              <br />
              <span className="text-[#E94B27]">co-pilot.</span>
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="mt-5 max-w-lg text-base leading-7 text-[#6B6862] sm:text-lg"
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
                <div
                  key={item}
                  className="flex items-center gap-3 text-sm text-[#4F4B46]"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FFE7DE] text-[10px] font-bold text-[#E94B27]">
                    ✓
                  </span>
                  {item}
                </div>
              ))}
            </motion.div>

            <motion.button
              variants={itemVariants}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="mt-8 rounded-xl bg-[#171717] px-6 py-3.5 text-sm font-medium text-white transition-all hover:bg-[#2B2927]"
            >
              Explore Syncora AI →
            </motion.button>
          </div>

          <motion.div
            variants={itemVariants}
            className="relative"
          >
            <div className="ai-pulse absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF9B7D]/25 blur-[90px]" />

            <div className="ai-panel relative overflow-hidden rounded-[24px] border border-[#E8D9D0] bg-[#FAF9F6] shadow-[0_30px_80px_rgba(80,45,30,0.12)]">
              <div className="flex items-center justify-between border-b border-[#E9DED7] bg-white px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FF5C35] text-sm text-white shadow-sm">
                    ✦
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#171717]">
                      Syncora AI
                    </p>

                    <p className="text-[11px] text-[#969087]">
                      Engineering Assistant
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#20A464]">
                  <span className="h-2 w-2 rounded-full bg-[#20A464]" />
                  Active
                </div>
              </div>

              <div className="border-b border-[#E9DED7] px-5 py-4">
                <p className="text-[11px] font-medium uppercase tracking-wider text-[#A09A91]">
                  Project context
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-md bg-white px-2.5 py-1.5 text-xs text-[#68635C] shadow-sm">
                    Authentication API
                  </span>

                  <span className="rounded-md bg-white px-2.5 py-1.5 text-xs text-[#68635C] shadow-sm">
                    Sprint 08
                  </span>

                  <span className="rounded-md bg-white px-2.5 py-1.5 text-xs text-[#68635C] shadow-sm">
                    GitHub
                  </span>
                </div>
              </div>

              <div className="space-y-5 p-5 sm:p-6">
                <div className="ml-auto max-w-[78%] rounded-2xl rounded-br-md bg-[#171717] px-4 py-3 text-sm leading-6 text-white">
                  Review the authentication work and tell me what needs
                  attention before the sprint ends.
                </div>

                <div className="max-w-[88%]">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FFE7DE] text-sm text-[#FF5C35]">
                      ✦
                    </div>

                    <div className="rounded-2xl rounded-tl-md border border-[#E6E1D9] bg-white px-4 py-4 shadow-sm">
                      <p className="text-sm leading-6 text-[#4F4B46]">
                        I reviewed the current sprint activity and found
                        <span className="font-semibold text-[#171717]">
                          {" "}
                          3 areas{" "}
                        </span>
                        worth addressing.
                      </p>

                      <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2 rounded-lg bg-[#FFF3EE] px-3 py-2 text-xs text-[#68635C]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#FF5C35]" />
                          Token refresh needs testing
                        </div>

                        <div className="flex items-center gap-2 rounded-lg bg-[#FFF3EE] px-3 py-2 text-xs text-[#68635C]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#FF5C35]" />
                          API documentation is incomplete
                        </div>

                        <div className="flex items-center gap-2 rounded-lg bg-[#F5FBF7] px-3 py-2 text-xs text-[#68635C]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#20A464]" />
                          4 authentication tasks are on track
                        </div>
                      </div>

                      <button className="mt-4 text-xs font-semibold text-[#E94B27] transition-colors hover:text-[#FF5C35]">
                        View recommendations →
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-[#E2DDD5] bg-white px-4 py-3 shadow-sm">
                  <span className="flex-1 text-xs text-[#A09A91]">
                    Ask Syncora AI anything...
                  </span>

                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#171717] text-xs text-white">
                    ↑
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -right-4 top-20 hidden rounded-xl border border-[#E4DFD8] bg-white px-4 py-3 shadow-lg sm:block"
            >
              <div className="flex items-center gap-2">
                <span className="text-[#FF5C35]">✦</span>

                <span className="text-xs font-medium text-[#68635C]">
                  Context understood
                </span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AISection;