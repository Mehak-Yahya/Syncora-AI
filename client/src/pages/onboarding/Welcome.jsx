import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import syncoraLogo from "../../assets/logo.png";

const Welcome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    const recreateWorkspace =
      new URLSearchParams(window.location.search).get("recreate") === "1";

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);

        if (
          user.onboardingCompleted === true &&
          user.workspace &&
          !recreateWorkspace
        ) {
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

  const features = [
    {
      number: "01",
      title: "Build",
      description: "Turn ideas into working software.",
      icon: "⌁",
    },
    {
      number: "02",
      title: "Collaborate",
      description: "Keep your team aligned in one place.",
      icon: "◈",
    },
    {
      number: "03",
      title: "Ship smarter",
      description: "Move from planning to delivery faster.",
      icon: "↗",
    },
  ];

  return (
    <main className="relative h-[100svh] min-h-[620px] overflow-hidden bg-[#07090D] text-[#E8D889]">
      {/* =========================================================
          BACKGROUND
      ========================================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Center glow */}
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.22, 0.32, 0.22],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-1/2 top-[42%] h-[430px] w-[430px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF8C2B]/10 blur-[110px]"
        />

        {/* Orange ambient light */}
        <motion.div
          animate={{
            x: [0, 35, 0],
            y: [0, -25, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -left-40 top-[15%] h-[300px] w-[300px] rounded-full bg-[#FF8C2B]/[0.055] blur-[100px]"
        />

        {/* Blue ambient light */}
        <motion.div
          animate={{
            x: [0, -35, 0],
            y: [0, 25, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -right-40 bottom-[8%] h-[340px] w-[340px] rounded-full bg-[#5968FF]/[0.05] blur-[110px]"
        />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(232,216,137,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(232,216,137,.7) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#07090D] to-transparent" />

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_15%,#07090D_90%)]" />
      </div>

      {/* =========================================================
          MAIN CONTENT
      ========================================================= */}

      <div className="relative z-10 flex h-full items-center justify-center px-5 py-6 sm:px-8">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="w-full max-w-[900px]"
        >
          {/* =====================================================
              LOGO + BRAND
          ===================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
              rotateX: -15,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              rotateX: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex flex-col items-center"
            style={{
              perspective: "800px",
            }}
          >
            <motion.div
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileHover={{
                scale: 1.06,
                rotateY: 8,
              }}
              className="relative"
            >
              {/* glow */}
              <div className="absolute inset-[-18px] rounded-[25px] bg-[#FF8C2B]/15 blur-[25px]" />

              {/* depth */}
              <div className="absolute inset-0 translate-y-2 rounded-[20px] bg-[#FF8C2B]/20 blur-md" />

              {/* logo container */}
              <div className="relative flex h-[68px] w-[68px] items-center justify-center rounded-[20px] border border-[#E8D889]/10 bg-[#E8D889]/[0.045] p-2.5 shadow-[0_20px_50px_rgba(0,0,0,.45)] backdrop-blur-xl">
                <img
                  src={syncoraLogo}
                  alt="Syncora"
                  className="h-full w-full object-contain"
                />
              </div>
            </motion.div>

            <p className="mt-3 text-[13px] font-semibold tracking-[-0.01em] text-[#E8D889]">
              Syncora
            </p>

            <p className="mt-1 text-[8px] font-medium uppercase tracking-[0.22em] text-[#5E6672]">
              Engineering workspace
            </p>
          </motion.div>

          {/* =====================================================
              HERO
          ===================================================== */}

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.28,
              duration: 0.6,
            }}
            className="text-center"
          >
            <h1 className="mx-auto mt-6 max-w-[760px] text-[38px] font-semibold leading-[1.04] tracking-[-0.055em] sm:text-[48px] lg:text-[56px]">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-[#E8D889] via-white to-[#FF8C2B] bg-clip-text text-transparent">
                Syncora
              </span>
            </h1>

            <p className="mx-auto mt-3 max-w-[620px] text-[12px] leading-5 text-[#858E9A] sm:text-[14px]">
              Your AI-powered engineering workspace for building, managing,
              collaborating, and shipping better software.
            </p>

            <p className="mt-1.5 text-[14px] text-[#555E6A]">
              Let&apos;s get your engineering workspace ready.
            </p>
          </motion.div>

          {/* =====================================================
              CTA
          ===================================================== */}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.42,
              duration: 0.5,
            }}
            className="flex justify-center"
          >
            <motion.button
              type="button"
              onClick={handleGetStarted}
              whileHover={{
                y: -2,
                scale: 1.025,
              }}
              whileTap={{
                scale: 0.97,
              }}
              className="group relative mt-5 overflow-hidden rounded-xl bg-[#FF8C2B] px-6 py-3 text-[11px] font-semibold text-[#E8D889] shadow-[0_10px_35px_rgba(255,140,43,.2)] transition-all duration-300 hover:bg-[#FF8C2B] hover:shadow-[0_14px_45px_rgba(255,140,43,.28)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started

                <motion.span
                  animate={{ x: [0, 3, 0] }}
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  →
                </motion.span>
              </span>

              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </motion.button>
          </motion.div>

          {/* =====================================================
              FEATURES
          ===================================================== */}

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.56,
              duration: 0.6,
            }}
            className="mx-auto mt-7 grid max-w-[780px] grid-cols-3 gap-2.5 sm:gap-3"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.number}
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.62 + index * 0.08,
                  duration: 0.45,
                }}
                whileHover={{
                  y: -5,
                  scale: 1.015,
                }}
                className="group relative overflow-hidden rounded-xl border border-[#E8D889]/[0.075] bg-[#E8D889]/[0.028] px-4 py-3.5 text-left shadow-[0_15px_45px_rgba(0,0,0,.18)] backdrop-blur-xl transition-all duration-300 hover:border-[#FF8C2B]/20 hover:bg-[#E8D889]/[0.045]"
              >
                {/* top highlight */}
                <div className="absolute left-4 right-4 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* glow */}
                <div className="absolute -right-10 -top-10 h-20 w-20 rounded-full bg-[#FF8C2B]/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[15px] font-semibold tracking-[0.15em] text-[#FF8C2B]">
                      {feature.number}
                    </span>

                    <span className="flex h-6 w-6 items-center justify-center rounded-md border border-[#E8D889]/[0.07] bg-[#E8D889]/[0.025] text-[15px] text-[#FF8C2B]">
                      {feature.icon}
                    </span>
                  </div>

                  <h3 className="mt-3 text-[15px] font-semibold text-[#E8D889] sm:text-[14px]">
                    {feature.title}
                  </h3>

                  <p className="mt-1 text-[15px] leading-4 text-[#69737F] sm:text-[12px]">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* =====================================================
              FOOTER
          ===================================================== */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 0.85,
              duration: 0.5,
            }}
            className="mt-5 text-center"
          >
            <div className="mx-auto mb-2 h-px w-12 bg-[#E8D889]/10" />

            <p className="text-[15px] text-[#464E59]">
              Your project. Your team. One engineering workspace.
            </p>
          </motion.div>
        </motion.section>
      </div>
    </main>
  );
};

export default Welcome;