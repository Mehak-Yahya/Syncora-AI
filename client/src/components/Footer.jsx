import { motion } from "framer-motion";

const Footer = () => {
  const links = [
    { label: "Features", href: "#features" },
    { label: "AI", href: "#ai" },
    { label: "Integrations", href: "#integrations" },
    { label: "About", href: "#about" },
  ];

  return (
    <footer className="border-t border-white/[0.08] bg-[#050507] px-6 py-8 text-white sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

        {/* Brand */}
        <motion.a
          href="#"
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="flex w-fit items-center gap-2.5"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF5C35] text-xs font-bold text-white shadow-[0_0_20px_rgba(255,92,53,0.18)]">
            S
          </div>

          <span className="text-sm font-semibold tracking-[-0.02em]">
            Syncora
          </span>
        </motion.a>

        {/* Navigation */}
        <nav className="flex items-center gap-5 sm:gap-6">
          {links.map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              whileHover={{ y: -1 }}
              transition={{ duration: 0.2 }}
              className="text-xs font-medium text-white/45 transition-colors duration-200 hover:text-white"
            >
              {link.label}
            </motion.a>
          ))}
        </nav>

        {/* Copyright */}
        <p className="text-xs text-white/30">
          © 2026 Syncora
        </p>

      </div>
    </footer>
  );
};

export default Footer;