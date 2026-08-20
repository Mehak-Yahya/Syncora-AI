import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Welcome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const recreateWorkspace = new URLSearchParams(window.location.search).get("recreate") === "1";

    // No authentication → go back to login
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);

        // Already completed onboarding → never show Welcome again
        if (user.onboardingCompleted === true && user.workspace && !recreateWorkspace) {
          navigate("/dashboard", { replace: true });
        }
      } catch (error) {
        console.error("Unable to read user data:", error);
      }
    }
  }, [navigate]);

  const handleGetStarted = () => {
    navigate("/onboarding/profile");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF9F6] px-6 text-[#171717]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl text-center"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FF5C35] text-xl font-bold text-white shadow-sm"
        >
          S
        </motion.div>

        {/* Brand */}
        <p className="mt-5 text-lg font-semibold tracking-[-0.02em]">
          Syncora
        </p>

        {/* Heading */}
        <h1 className="mt-10 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
          Welcome to Syncora 👋
        </h1>

        {/* Description */}
        <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-[#77716A] sm:text-base">
          Your AI-powered engineering workspace for building, managing,
          collaborating, and shipping better software.
        </p>

        <p className="mt-3 text-sm text-[#9A948B]">
          Let&apos;s get your engineering workspace ready.
        </p>

        {/* Get Started */}
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGetStarted}
          className="mt-9 rounded-xl bg-[#FF5C35] px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#E94B27] hover:shadow-md"
        >
          Get Started →
        </motion.button>

        {/* Product statement */}
        <div className="mx-auto mt-14 grid max-w-lg grid-cols-3 gap-3">
          <div className="rounded-xl border border-[#E4DFD8] bg-white p-4">
            <p className="text-lg">⚡</p>
            <p className="mt-2 text-xs font-medium">Build</p>
          </div>

          <div className="rounded-xl border border-[#E4DFD8] bg-white p-4">
            <p className="text-lg">🤝</p>
            <p className="mt-2 text-xs font-medium">Collaborate</p>
          </div>

          <div className="rounded-xl border border-[#E4DFD8] bg-white p-4">
            <p className="text-lg">✦</p>
            <p className="mt-2 text-xs font-medium">Ship smarter</p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-10 text-xs text-[#A09A91]">
          Your project. Your team. One engineering workspace.
        </p>
      </motion.div>
    </main>
  );
};

export default Welcome;