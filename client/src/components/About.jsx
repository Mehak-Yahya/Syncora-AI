import { motion } from "framer-motion";

const About = () => {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-[#FAF9F6] px-6 py-12 sm:px-10 lg:px-12 lg:py-14"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-xl"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#FF5C35]">
              About Syncora
            </span>

            <h2 className="mt-3 text-3xl font-semibold leading-[1.08] tracking-[-0.045em] text-[#171717] sm:text-4xl lg:text-[44px]">
              Engineering work,
              <br />
              <span className="text-[#FF5C35]">
                finally in sync.
              </span>
            </h2>

            <p className="mt-4 text-sm leading-6 text-[#6B6862] sm:text-base">
              Syncora is an AI-powered engineering workspace that brings
              planning, development, collaboration, documentation, and
              project intelligence together in one connected place.
            </p>

            <p className="mt-3 text-sm leading-6 text-[#6B6862]">
              Instead of jumping between disconnected tools, teams can keep
              their projects, code, conversations, and AI assistance connected
              to the same engineering context.
            </p>

            <div className="mt-6 space-y-2.5">
              {[
                "One connected engineering workspace",
                "AI that understands your project context",
                "Built around how modern teams actually work",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-sm text-[#4F4B46]"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FFF0EB] text-[10px] font-bold text-[#FF5C35]">
                    ✓
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-200/25 blur-[90px]" />

            <div className="relative overflow-hidden rounded-[22px] border border-[#E4DFD8] bg-white p-5 shadow-[0_20px_60px_rgba(40,35,30,0.08)] sm:p-6">
              <div className="flex items-center justify-between border-b border-[#ECE8E2] pb-4">
                <div>
                  <p className="text-[11px] text-[#A09A91]">
                    Engineering workspace
                  </p>

                  <h3 className="mt-1 text-base font-semibold text-[#171717]">
                    Everything connected.
                  </h3>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFF0EB] text-sm text-[#FF5C35]">
                  ✦
                </div>
              </div>

              <div className="mt-5 space-y-2.5">
                <div className="flex items-center gap-3 rounded-xl border border-[#ECE8E2] bg-[#FBFAF8] p-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FFF0EB] text-sm text-[#FF5C35]">
                    ▦
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#171717]">
                      Planning
                    </p>

                    <p className="mt-0.5 text-[11px] text-[#8A857D]">
                      Projects · Tasks · Sprints
                    </p>
                  </div>

                  <span className="text-[11px] text-[#20A464]">
                    Connected
                  </span>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-[#ECE8E2] bg-[#FBFAF8] p-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FFF0EB] text-sm text-[#FF5C35]">
                    ◉
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#171717]">
                      Development
                    </p>

                    <p className="mt-0.5 text-[11px] text-[#8A857D]">
                      GitHub · Code · Issues
                    </p>
                  </div>

                  <span className="text-[11px] text-[#20A464]">
                    Synced
                  </span>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-[#ECE8E2] bg-[#FBFAF8] p-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FFF0EB] text-sm text-[#FF5C35]">
                    ✦
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#171717]">
                      Syncora AI
                    </p>

                    <p className="mt-0.5 text-[11px] text-[#8A857D]">
                      Context · Insights · Assistance
                    </p>
                  </div>

                  <span className="text-[11px] text-[#20A464]">
                    Active
                  </span>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-[#171717] p-4">
                <p className="text-sm leading-5 text-white">
                  One workspace.
                  <br />
                  One engineering context.
                  <br />
                  <span className="text-[#FF7A5C]">
                    Everything in sync.
                  </span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;