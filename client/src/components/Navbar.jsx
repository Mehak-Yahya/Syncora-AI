
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="absolute left-0 top-0 z-50 w-full">
      <nav className="flex w-full items-center justify-between px-6 py-5 sm:px-8 lg:px-10">

        {/* Logo */}
        <motion.div
          whileHover={{ y: -1 }}
          transition={{ duration: 0.2 }}
        >
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2.5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF5C35] text-sm font-bold text-white shadow-md shadow-orange-500/20">
              S
            </div>

            <span className="text-xl font-semibold tracking-[-0.02em] text-[#171717]">
              Syncora
            </span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-7 md:flex">

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <a
              href="#features"
              className="text-sm font-medium text-[#6B6862] transition-colors hover:text-[#171717]"
            >
              Features
            </a>

            <a
              href="#ai"
              className="text-sm font-medium text-[#6B6862] transition-colors hover:text-[#171717]"
            >
              AI
            </a>

            <a
              href="#integrations"
              className="text-sm font-medium text-[#6B6862] transition-colors hover:text-[#171717]"
            >
              Integrations
            </a>

            <a
              href="#about"
              className="text-sm font-medium text-[#6B6862] transition-colors hover:text-[#171717]"
            >
              About
            </a>
          </div>

          {/* Auth Actions */}
          <div className="flex items-center gap-2">

            {/* Log In */}
            <motion.div
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to="/login"
                className="inline-block px-3 py-2 text-sm font-medium text-[#6B6862] transition-colors hover:text-[#171717]"
              >
                Log in
              </Link>
            </motion.div>

            {/* Get Started */}
            <motion.div
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to="/signup"
                className="inline-block rounded-xl bg-[#171717] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2B2927]"
              >
                Get Started
              </Link>
            </motion.div>

          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label="Open navigation menu"
          className="rounded-xl border border-[#DED9D1] bg-white/80 p-2.5 text-[#171717] shadow-sm backdrop-blur md:hidden"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </button>

      </nav>
    </header>
  );
};

export default Navbar;
