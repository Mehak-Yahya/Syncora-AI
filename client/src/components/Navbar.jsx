import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Navbar = () => {
  return (
    <header className="absolute left-0 top-0 z-50 w-full">
      <nav className="flex w-full items-center justify-between px-6 py-5 sm:px-8 lg:px-10">
        {/* Logo */}
        <motion.div whileHover={{ y: -1 }} transition={{ duration: 0.2 }}>
          <Link to="/" className="flex shrink-0 items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl shadow-md shadow-orange-500/20">
              <img
                src={logo}
                alt="Syncora"
                className="h-full w-full object-contain"
              />
            </div>

            <span className="text-xl font-semibold tracking-[-0.02em] text-white">
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
              className="text-sm font-medium text-white/70 transition-colors duration-200 hover:text-white"
            >
              Features
            </a>

            <a
              href="#ai"
              className="text-sm font-medium text-white/70 transition-colors duration-200 hover:text-white"
            >
              AI
            </a>

            <a
              href="#integrations"
              className="text-sm font-medium text-white/70 transition-colors duration-200 hover:text-white"
            >
              Integrations
            </a>

            <a
              href="#about"
              className="text-sm font-medium text-white/70 transition-colors duration-200 hover:text-white"
            >
              About
            </a>
          </div>

          {/* Auth Actions */}
          <div className="flex items-center gap-2">
            {/* Log In */}
            <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/login"
                className="inline-block px-3 py-2 text-sm font-medium text-white/75 transition-colors duration-200 hover:text-white"
              >
                Log in
              </Link>
            </motion.div>

            {/* Get Started */}
            <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/signup"
                className="inline-block rounded-xl border border-white/10 bg-white px-4 py-2.5 text-sm font-medium text-[#171717] transition-all duration-200 hover:bg-white/90"
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
          className="rounded-xl border border-white/15 bg-white/10 p-2.5 text-white shadow-sm backdrop-blur-md transition-colors hover:bg-white/15 md:hidden"
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
