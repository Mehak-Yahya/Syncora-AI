import { motion } from "framer-motion";

const integrations = [
  {
    name: "GitHub",
    description: "Repositories, commits, issues, and pull requests.",
    icon: "◉",
    status: "Connected",
  },
  {
    name: "Slack",
    description: "Engineering conversations and updates in sync.",
    icon: "⌁",
    status: "Connect",
  },
  {
    name: "Jira",
    description: "Issues, sprint work, and project activity.",
    icon: "◆",
    status: "Connect",
  },
  {
    name: "Figma",
    description: "Designs and product context closer to development.",
    icon: "◈",
    status: "Connect",
  },
  {
    name: "Linear",
    description: "Issues, cycles, projects, and development work.",
    icon: "↗",
    status: "Connect",
  },
  {
    name: "Notion",
    description: "Documentation and team knowledge in context.",
    icon: "N",
    status: "Connect",
  },
];

const Integrations = () => {
  return (
    <section
      id="integrations"
      className="relative overflow-hidden border-y border-[#E5E0D8] bg-[#F7F6FC] px-6 py-12 sm:px-10 lg:px-12 lg:py-14"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(#DDD9EC_1px,transparent_1px),linear-gradient(90deg,#DDD9EC_1px,transparent_1px)] [background-size:42px_42px]" />

        <div className="absolute left-[5%] top-[10%] h-56 w-56 rounded-full bg-[#C8C2F5]/20 blur-[100px]" />

        <div className="absolute bottom-[5%] right-[8%] h-56 w-56 rounded-full bg-[#FFD0C1]/20 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#FF5C35]">
            Integrations
          </span>

          <h2 className="mt-2 text-3xl font-semibold leading-[1.08] tracking-[-0.04em] text-[#171717] sm:text-4xl lg:text-[42px]">
            Your tools.
            <span className="text-[#FF5C35]"> One workspace.</span>
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#6B6862] sm:text-base">
            Connect the tools your engineering team already uses and keep
            projects, code, communication, and documentation in sync.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative mx-auto mt-7 h-16 max-w-4xl"
        >
          <div className="absolute left-1/2 top-1/2 hidden h-px w-[65%] -translate-x-1/2 bg-[#DDD8D0] lg:block" />

          <div className="absolute left-1/2 top-1/2 hidden h-full w-px -translate-x-1/2 -translate-y-1/2 bg-[#DDD8D0] lg:block" />

          <div className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#E2DDD5] bg-white shadow-[0_12px_30px_rgba(40,35,30,0.08)]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF5C35] text-lg font-semibold text-white shadow-md shadow-orange-500/15">
              S
            </div>
          </div>
        </motion.div>

        <div className="relative mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {integrations.map((integration, index) => (
            <motion.article
              key={integration.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{
                duration: 0.4,
                delay: index * 0.04,
                ease: "easeOut",
              }}
              whileHover={{ y: -2 }}
              className="group rounded-xl border border-[#E5E0D8] bg-white/90 p-4 backdrop-blur-sm transition-all duration-300 hover:border-[#D8D0C6] hover:bg-white hover:shadow-[0_10px_28px_rgba(40,35,30,0.07)]"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E5E0D8] bg-[#FFF0EB] text-sm font-semibold text-[#FF5C35] transition-all duration-300 group-hover:border-[#FF5C35] group-hover:bg-[#FF5C35] group-hover:text-white">
                  {integration.icon}
                </div>

                <span
                  className={
                    integration.status === "Connected"
                      ? "rounded-full bg-[#F0F9F4] px-2 py-0.5 text-[10px] font-medium text-[#20A464]"
                      : "rounded-full bg-[#F5F2ED] px-2 py-0.5 text-[10px] font-medium text-[#8A857D]"
                  }
                >
                  {integration.status}
                </span>
              </div>

              <h3 className="mt-4 text-sm font-semibold text-[#171717]">
                {integration.name}
              </h3>

              <p className="mt-1.5 text-xs leading-5 text-[#6B6862]">
                {integration.description}
              </p>

              <button className="mt-3 text-[11px] font-semibold text-[#8A857D] transition-colors group-hover:text-[#FF5C35]">
                {integration.status === "Connected"
                  ? "Manage →"
                  : "Connect →"}
              </button>
            </motion.article>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-6 text-center text-xs text-[#8A857D]"
        >
          More integrations are coming to Syncora.
        </motion.p>
      </div>
    </section>
  );
};

export default Integrations;