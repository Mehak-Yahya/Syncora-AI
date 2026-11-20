import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const steps = [
  { label: "Plan", icon: "▦", color: "#FF8C2B" },
  { label: "Build", icon: "◉", color: "#FF8C2B" },
  { label: "AI", icon: "✦", color: "#FF8C2B" },
  { label: "Ship", icon: "↗", color: "#FF8C2B" },
];

const Signup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] =
    useState(false);
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  /* =====================================================
     3D MOUSE INTERACTION
  ===================================================== */

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, {
    stiffness: 80,
    damping: 20,
  });

  const smoothY = useSpring(mouseY, {
    stiffness: 80,
    damping: 20,
  });

  const rotateX = useTransform(smoothY, [-500, 500], [7, -7]);
  const rotateY = useTransform(smoothX, [-500, 500], [-7, 7]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  /* =====================================================
     FORM VALIDATION
  ===================================================== */

  const validations = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const passwordValid = Object.values(validations).every(Boolean);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const formValid = emailValid && passwordValid;

  /* =====================================================
     SIGNUP
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched(true);
    setServerError("");

    if (!formValid || loading) return;

    try {
      setLoading(true);

      const normalizedEmail = email.trim().toLowerCase();

      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setServerError(data.message || "Unable to create your account.");
        return;
      }

      navigate("/login", {
        state: {
          email: normalizedEmail,
          message: "Account created successfully. Please log in.",
          invite: sessionStorage.getItem("pendingInvite"),
        },
      });
    } catch (error) {
      console.error("Signup error:", error);

      setServerError(
        "Unable to connect to Syncora. Please make sure the server is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[#070708] text-[#E8D889]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(232,216,137,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(232,216,137,.7) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Orange glow */}
        <motion.div
          animate={{
            x: [0, 80, -40, 0],
            y: [0, -40, 30, 0],
            scale: [1, 1.15, 0.95, 1],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[-12%] top-[8%] h-[500px] w-[500px] rounded-full bg-orange-600/15 blur-[140px]"
        />

        {/* Purple glow */}
        <motion.div
          animate={{
            x: [0, -70, 40, 0],
            y: [0, 50, -30, 0],
            scale: [1, 0.9, 1.12, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[-15%] right-[-8%] h-[520px] w-[520px] rounded-full bg-indigo-600/15 blur-[150px]"
        />

        {/* Center glow */}
        <motion.div
          animate={{
            opacity: [0.2, 0.5, 0.2],
            scale: [0.9, 1.1, 0.9],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
          }}
          className="absolute left-[45%] top-[40%] h-48 w-48 rounded-full bg-[#FF8C2B]/10 blur-[100px]"
        />
      </div>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="relative z-30 flex items-center justify-between px-6 py-5 sm:px-10 lg:px-12">
        <Link to="/" className="group flex items-center gap-3">
          <motion.div
            whileHover={{
              scale: 1.08,
              rotate: -4,
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 20,
            }}
            className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl shadow-[0_8px_30px_rgba(255,140,43,.25)]"
          >
            <img
              src={logo}
              alt="Syncora"
              className="h-full w-full object-contain"
            />
          </motion.div>

          <span className="text-xl font-semibold tracking-[-0.03em] text-[#E8D889]">
            Syncora
          </span>
        </Link>
      </header>
      {/* =====================================================
          MAIN
      ===================================================== */}

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-78px)] max-w-[1450px] items-start gap-12 px-6 pb-8 pt-0 lg:grid-cols-[1fr_440px] lg:px-12">
    

        <section className="hidden lg:block">
          <motion.div
            initial={{
              opacity: 0,
              x: -50,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            className="relative mx-auto max-w-2xl"
          >
            {/* Heading */}

            <div className="max-w-2xl">
              <motion.div
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.2,
                }}
                className="mb-4 flex items-center gap-2"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF8C2B] shadow-[0_0_12px_#FF8C2B]" />

                <span className="text-xs font-medium uppercase tracking-[0.22em] text-[#E8D889]/40">
                  Engineering workspace
                </span>
              </motion.div>

              {/* ONE LINE HEADING */}

              <h1 className="whitespace-nowrap text-[clamp(2.6rem,4.3vw,4.7rem)] font-semibold leading-none tracking-[-0.065em]">
                Build smarter.{" "}
                <span className="bg-gradient-to-r from-[#FF8C2B] via-[#FF8C2B] to-[#FF8C2B] bg-clip-text text-transparent">
                  Stay in sync.
                </span>
              </h1>

              <p className="mt-5 max-w-lg text-[14px] leading-6 text-[#E8D889]/45">
                Your projects, development workflow, team collaboration, and AI
                assistance — connected in one intelligent workspace.
              </p>
            </div>

            {/* =================================================
                3D SCENE
            ================================================= */}

            <div
              className="relative mt-5 h-[265px]"
              style={{
                perspective: "1200px",
              }}
            >
              {/* Main 3D group */}

              <motion.div
                style={{
                  rotateX,
                  rotateY,
                }}
                className="absolute left-1/2 top-1/2 h-[220px] w-[420px] -translate-x-1/2 -translate-y-1/2"
              >
                {/* Outer ring */}

                <div className="absolute inset-0 rounded-[50%] border border-[#E8D889]/[0.07]" />

                {/* Orange ring */}

                <motion.div
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-[18px] rounded-[50%] border border-[#FF8C2B]/10"
                />

                {/* Inner ring */}

                <div className="absolute inset-[42px] rounded-[50%] border border-[#E8D889]/[0.05]" />

                {/* Center */}

                <motion.div
                  animate={{
                    y: [0, -8, 0],
                    rotateY: [0, 360],
                  }}
                  transition={{
                    y: {
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                    rotateY: {
                      duration: 10,
                      repeat: Infinity,
                      ease: "linear",
                    },
                  }}
                  className="absolute left-1/2 top-1/2 flex h-[82px] w-[82px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-3xl border border-[#FF8C2B]/20 bg-[#243A5A]/95 shadow-[0_0_70px_rgba(255,140,43,0.18)] backdrop-blur-xl"
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                >
                  <span className="text-3xl text-[#FF8C2B]">✦</span>

                  <div className="absolute inset-2 rounded-2xl border border-[#E8D889]/[0.04]" />
                </motion.div>

                {/* Orbiting objects */}

                {steps.map((step, index) => {
                  const positions = [
                    {
                      left: "0%",
                      top: "34%",
                    },
                    {
                      left: "27%",
                      top: "0%",
                    },
                    {
                      right: "27%",
                      top: "0%",
                    },
                    {
                      right: "0%",
                      top: "34%",
                    },
                  ];

                  return (
                    <motion.div
                      key={step.label}
                      animate={{
                        y: [0, -10, 0],
                        rotateZ: [
                          index % 2 === 0 ? -2 : 2,
                          index % 2 === 0 ? 2 : -2,
                          index % 2 === 0 ? -2 : 2,
                        ],
                      }}
                      transition={{
                        duration: 4 + index * 0.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.3,
                      }}
                      className="absolute"
                      style={positions[index]}
                    >
                      <motion.div
                        whileHover={{
                          scale: 1.15,
                          rotateY: 18,
                          rotateX: -10,
                        }}
                        className="group relative flex h-[68px] w-[68px] cursor-pointer items-center justify-center rounded-2xl border border-[#E8D889]/10 bg-[#243A5A]/95 shadow-2xl backdrop-blur-xl"
                        style={{
                          color: step.color,
                          transformStyle: "preserve-3d",
                        }}
                      >
                        {/* Glow */}

                        <div
                          className="absolute inset-0 rounded-2xl opacity-20 blur-xl transition-opacity duration-300 group-hover:opacity-50"
                          style={{
                            background: step.color,
                          }}
                        />

                        <div className="relative z-10 text-xl">{step.icon}</div>

                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-medium text-[#E8D889]/35">
                          {step.label}
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}

                {/* Energy ring */}

                <motion.div
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute left-1/2 top-1/2 h-[195px] w-[195px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#FF8C2B]/10"
                />
              </motion.div>
            </div>

            {/* AI STATUS */}

            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.9,
              }}
              className="relative -mt-1 flex max-w-lg items-center gap-4 rounded-2xl border border-[#E8D889]/[0.08] bg-[#E8D889]/[0.035] p-3.5 backdrop-blur-xl"
            >
              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#FF8C2B]/10 bg-[#FF8C2B]/10 text-[#FF8C2B]"
              >
                ✦
              </motion.div>

              <div>
                <p className="text-xs font-semibold text-[#E8D889]">Syncora AI</p>

                <p className="mt-1 text-[10px] text-[#E8D889]/35">
                  Your engineering context, always connected.
                </p>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <motion.span
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                />

                <span className="text-[10px] text-[#E8D889]/30">Online</span>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* =================================================
            RIGHT — SIGNUP
            MOVED HIGHER
        ================================================= */}

        <section className="flex justify-center lg:-mt-10">
          <motion.div
            initial={{
              opacity: 0,
              x: 50,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.15,
              ease: "easeOut",
            }}
            className="w-full max-w-[440px]"
          >
       
            {/* CARD */}

            <motion.div
              style={{
                rotateX,
                rotateY,
              }}
              className="relative overflow-hidden rounded-[26px] border border-[#E8D889]/[0.1] bg-[#243A5A]/95 p-6 shadow-[0_35px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-7"
            >
              {/* Card glow */}

              <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-[#FF8C2B]/10 blur-[70px]" />

              <div className="relative z-10">
                {/* Header */}

                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#FF8C2B]">
                  Get started
                </p>

                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.045em] text-[#E8D889]">
                  Create your account
                </h2>

                <p className="mt-2 text-sm text-[#E8D889]/40">
                  Start building with Syncora.
                </p>

                {/* Server error */}

                {serverError && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -5,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs leading-5 text-red-400"
                  >
                    {serverError}
                  </motion.div>
                )}

                {/* FORM */}

                <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
                  {/* EMAIL */}

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-[#E8D889]/60">
                      Work email
                    </label>

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setServerError("");
                      }}
                      placeholder="you@company.com"
                      autoComplete="email"
                      className={`w-full rounded-xl border bg-[#E8D889]/[0.035] px-4 py-3.5 text-sm text-[#E8D889] outline-none transition-all placeholder:text-[#E8D889]/20 focus:bg-[#E8D889]/[0.055] focus:ring-4 focus:ring-[#FF8C2B]/10 ${
                        touched && !emailValid
                          ? "border-red-500/60"
                          : "border-[#E8D889]/10 focus:border-[#FF8C2B]/60"
                      }`}
                    />

                    {touched && !emailValid && (
                      <p className="mt-1.5 text-[11px] text-red-400">
                        Enter a valid email address.
                      </p>
                    )}
                  </div>

                  {/* PASSWORD */}

                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <label className="text-xs font-medium text-[#E8D889]/60">
                        Password
                      </label>

                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswordRequirements((prev) => !prev)
                        }
                        className="text-[11px] text-[#E8D889]/30 transition-colors hover:text-[#FF8C2B]"
                      >
                        {passwordValid
                          ? "Strong password"
                          : "Password requirements"}
                      </button>
                    </div>

                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setShowPasswordRequirements(true);
                          setServerError("");
                        }}
                        onFocus={() => setShowPasswordRequirements(true)}
                        onBlur={() => setTouched(true)}
                        placeholder="Create a strong password"
                        autoComplete="new-password"
                        className={`w-full rounded-xl border bg-[#E8D889]/[0.035] px-4 py-3.5 pr-12 text-sm text-[#E8D889] outline-none transition-all placeholder:text-[#E8D889]/20 focus:bg-[#E8D889]/[0.055] focus:ring-4 focus:ring-[#FF8C2B]/10 ${
                          touched && !passwordValid
                            ? "border-red-500/60"
                            : "border-[#E8D889]/10 focus:border-[#FF8C2B]/60"
                        }`}
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-xs text-[#E8D889]/30 transition hover:bg-[#E8D889]/5 hover:text-[#E8D889]"
                      >
                        {showPassword ? "◉" : "◌"}
                      </button>
                    </div>

                    {/* REQUIREMENTS */}

                    <motion.div
                      initial={false}
                      animate={{
                        height: showPasswordRequirements ? "auto" : 0,
                        opacity: showPasswordRequirements ? 1 : 0,
                      }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2.5 grid grid-cols-2 gap-1.5 rounded-xl border border-[#E8D889]/[0.06] bg-[#E8D889]/[0.025] p-2.5">
                        {[
                          ["length", "8+ characters"],
                          ["uppercase", "Uppercase"],
                          ["lowercase", "Lowercase"],
                          ["number", "Number"],
                          ["special", "Special character"],
                        ].map(([key, label]) => (
                          <div
                            key={key}
                            className="flex items-center gap-2 text-[10px]"
                          >
                            <motion.span
                              animate={{
                                scale: validations[key] ? [1, 1.2, 1] : 1,
                              }}
                              className={`flex h-4 w-4 items-center justify-center rounded-full text-[8px] ${
                                validations[key]
                                  ? "bg-emerald-500/15 text-emerald-400"
                                  : "bg-[#E8D889]/5 text-[#E8D889]/25"
                              }`}
                            >
                              {validations[key] ? "✓" : "•"}
                            </motion.span>

                            <span
                              className={
                                validations[key]
                                  ? "text-emerald-400"
                                  : "text-[#E8D889]/30"
                              }
                            >
                              {label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  {/* CREATE ACCOUNT */}

                  <motion.button
                    whileHover={
                      formValid && !loading
                        ? {
                            y: -2,
                            scale: 1.01,
                          }
                        : {}
                    }
                    whileTap={
                      formValid && !loading
                        ? {
                            scale: 0.98,
                          }
                        : {}
                    }
                    type="submit"
                    disabled={!formValid || loading}
                    className={`relative mt-1 flex w-full items-center justify-center overflow-hidden rounded-xl px-5 py-3.5 text-sm font-semibold text-[#E8D889] transition-all ${
                      formValid && !loading
                        ? "bg-[#FF8C2B] shadow-[0_12px_35px_rgba(255,140,43,0.18)] hover:bg-[#FF8C2B]"
                        : "cursor-not-allowed bg-[#E8D889]/10 text-[#E8D889]/30"
                    }`}
                  >
                    {formValid && !loading && (
                      <motion.div
                        animate={{
                          x: ["-100%", "200%"],
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      />
                    )}

                    <span className="relative">
                      {loading ? "Creating account..." : "Create account →"}
                    </span>
                  </motion.button>
                </form>

                {/* DIVIDER */}

                <div className="my-4 flex items-center gap-3">
                  <div className="h-px flex-1 bg-[#E8D889]/[0.07]" />

                  <span className="text-[10px] text-[#E8D889]/25">OR</span>

                  <div className="h-px flex-1 bg-[#E8D889]/[0.07]" />
                </div>

                {/* GOOGLE */}

                <motion.button
                  whileHover={{
                    y: -2,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  type="button"
                  onClick={() => {
                    window.location.href = `${API_URL}/api/auth/google`;
                  }}
                  className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#E8D889]/10 bg-[#E8D889]/[0.035] px-4 py-3.5 text-sm font-medium text-[#E8D889] transition-all hover:border-[#E8D889]/20 hover:bg-[#E8D889]/[0.06]"
                >
                  <span className="font-semibold">G</span>
                  Continue with Google
                </motion.button>

                {/* TERMS */}

                <p className="mt-4 text-center text-[10px] leading-5 text-[#E8D889]/25">
                  By creating an account, you agree to our{" "}
                  <span className="text-[#E8D889]/50">Terms</span> and{" "}
                  <span className="text-[#E8D889]/50">Privacy Policy</span>.
                </p>

                {/* LOGIN */}

                <p className="mt-4 border-t border-[#E8D889]/[0.07] pt-4 text-center text-sm text-[#E8D889]/35">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-[#FF8C2B] transition-colors hover:text-[#FF8C2B]"
                  >
                    Log in
                  </Link>
                </p>
              </div>
            </motion.div>
          </motion.div>
        </section>
      </div>

      {/* =====================================================
          FLOATING PARTICLES
      ===================================================== */}

      {[...Array(12)].map((_, index) => (
        <motion.span
          key={index}
          animate={{
            y: [0, -30, 0],
            x: [0, index % 2 === 0 ? 15 : -15, 0],
            opacity: [0.15, 0.5, 0.15],
          }}
          transition={{
            duration: 4 + (index % 4),
            repeat: Infinity,
            delay: index * 0.35,
            ease: "easeInOut",
          }}
          className="pointer-events-none absolute h-1 w-1 rounded-full bg-[#E8D889]"
          style={{
            left: `${8 + ((index * 17) % 85)}%`,
            top: `${12 + ((index * 23) % 75)}%`,
          }}
        />
      ))}
    </main>
  );
};

export default Signup;
