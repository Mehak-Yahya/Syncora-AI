import { motion } from "framer-motion";
const Footer = () => {
  return (
    <footer className="border-t border-[#2A2927] bg-[#171717] px-6 py-6 text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF5C35] text-xs font-bold">
            S
          </div>

          <span className="text-sm font-semibold">
            Syncora
          </span>
        </div>
        <div className="flex items-center gap-5">
          <a
            href="#features"
            className="text-xs text-[#8F8A83] hover:text-white"
          >
            Features
          </a>

          <a
            href="#ai"
            className="text-xs text-[#8F8A83] hover:text-white"
          >
            AI
          </a>

          <a
            href="#integrations"
            className="text-xs text-[#8F8A83] hover:text-white"
          >
            Integrations
          </a>

          <a
            href="#about"
            className="text-xs text-[#8F8A83] hover:text-white"
          >
            About
          </a>
        </div>
        <p className="text-xs text-[#66625D]">
          © 2026 Syncora
        </p>

      </div>
    </footer>
  );
};

export default Footer;