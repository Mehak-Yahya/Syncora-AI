import { motion } from "framer-motion";

const features = [
  {
    number: "01",
    title: "Plan & Manage",
    description:
      "Organize projects, tasks, sprints, priorities, and deadlines from one workspace.",
    icon: "▦",
  },
  {
    number: "02",
    title: "Build with AI",
    description:
      "Get intelligent assistance for coding, debugging, documentation, and architecture.",
    icon: "✦",
  },
  {
    number: "03",
    title: "Collaborate",
    description:
      "Keep your team aligned with discussions, comments, files, and real-time updates.",
    icon: "⌁",
  },
  {
    number: "04",
    title: "Connect GitHub",
    description:
      "Bring repositories, commits, issues, pull requests, and development activity together.",
    icon: "◉",
  },
  {
    number: "05",
    title: "Document",
    description:
      "Create technical documentation, API references, notes, and project knowledge.",
    icon: "▤",
  },
  {
    number: "06",
    title: "Track Progress",
    description:
      "Understand sprint progress, productivity, velocity, and overall project health.",
    icon: "↗",
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className="relative border-t border-[#E5E0D8] bg-white px-6 py-16 sm:px-10 lg:px-12 lg:py-20"
    >
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-16 bg-gradient-to-b from-[#F3F0EB]/70 to-transparent" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#FF5C35]">
            Everything connected
          </span>

          <h2 className="mt-2 text-3xl font-semibold leading-[1.08] tracking-[-0.04em] text-[#171717] sm:text-4xl lg:text-[44px]">
            One workspace for the
            <span className="text-[#FF5C35]">
              {" "}entire engineering journey.
            </span>
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-6 text-[#6B6862] sm:text-base">
            From the first idea to the final release, Syncora keeps your
            engineering workflow connected, organized, and intelligent.
          </p>
        </motion.div>

        <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.article
              key={feature.number}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{
                duration: 0.45,
                delay: index * 0.05,
                ease: "easeOut",
              }}
              whileHover={{ y: -3 }}
              className="group rounded-xl border border-[#E5E0D8] bg-[#FAF9F6] p-5 transition-all duration-300 hover:border-[#D8D0C6] hover:bg-white hover:shadow-[0_10px_30px_rgba(40,35,30,0.06)]"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFF0EB] text-sm text-[#FF5C35] transition-all duration-300 group-hover:bg-[#FF5C35] group-hover:text-white">
                  {feature.icon}
                </div>

                <span className="text-[11px] font-medium text-[#B7B1A8]">
                  {feature.number}
                </span>
              </div>

              <h3 className="mt-5 text-base font-semibold text-[#171717]">
                {feature.title}
              </h3>

              <p className="mt-2 text-xs leading-5 text-[#6B6862] sm:text-sm">
                {feature.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;