import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const steps = [
  { label: "Plan", icon: "▦" },
  { label: "Build", icon: "◉" },
  { label: "AI", icon: "✦" },
  { label: "Ship", icon: "↗" },
];

const Signup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched(true);
    setServerError("");

    if (!formValid || loading) return;

    try {
      setLoading(true);

      const normalizedEmail = email.trim().toLowerCase();

      const response = await fetch(
        "http://localhost:5000/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: normalizedEmail,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setServerError(
          data.message || "Unable to create your account."
        );
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
        "Unable to connect to Syncora. Please make sure the server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#FAF9F6] text-[#171717]">
      <div className="relative mx-auto min-h-screen max-w-[1500px]">

        {/* ========================= */}
        {/* BACKGROUND GLOW - LEFT */}
        {/* ========================= */}

        <motion.div
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -20, 15, 0],
            scale: [1, 1.08, 0.96, 1],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="pointer-events-none absolute left-[8%] top-[18%] h-80 w-80 rounded-full bg-orange-200/30 blur-[120px]"
        />

        {/* ========================= */}
        {/* BACKGROUND GLOW - RIGHT */}
        {/* ========================= */}

        <motion.div
          animate={{
            x: [0, -30, 20, 0],
            y: [0, 20, -15, 0],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="pointer-events-none absolute bottom-[5%] right-[8%] h-72 w-72 rounded-full bg-indigo-200/20 blur-[120px]"
        />

        {/* ========================= */}
        {/* HEADER */}
        {/* ========================= */}

        <header className="relative z-20 flex items-center px-6 py-6 sm:px-10 lg:px-12">
          <Link
            to="/"
            className="flex items-center gap-2.5"
          >
            <motion.div
              whileHover={{
                rotate: -5,
                scale: 1.05,
              }}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF5C35] text-sm font-bold text-white shadow-md shadow-orange-500/20"
            >
              S
            </motion.div>

            <span className="text-xl font-semibold tracking-[-0.02em]">
              Syncora
            </span>
          </Link>
        </header>

        {/* ========================= */}
        {/* MAIN CONTENT */}
        {/* ========================= */}

        <div className="relative grid min-h-[calc(100vh-78px)] items-start px-6 pb-8 pt-2 sm:px-10 lg:grid-cols-2 lg:px-12 lg:py-4">

          {/* ========================= */}
          {/* LEFT SIDE */}
          {/* ========================= */}

          <section className="hidden lg:block">
            <motion.div
              initial={{
                opacity: 0,
                x: -40,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.7,
                ease: "easeOut",
              }}
              className="mx-auto max-w-xl"
            >

            

              {/* Main Heading */}
              <h1 className="mt-4 text-6xl font-semibold leading-[0.98] tracking-[-0.055em]">
                Build smarter.
                <br />
                <span className="text-[#FF5C35]">
                  Stay in sync.
                </span>
              </h1>

              {/* Description */}
              <p className="mt-6 max-w-lg text-base leading-7 text-[#6B6862]">
                Your projects, development workflow, team collaboration,
                and AI assistance — connected in one workspace.
              </p>

              {/* ========================= */}
              {/* WORKFLOW STEPS */}
              {/* ========================= */}

              <div className="relative mt-14 px-2">

                {/* Animated Connection Line */}
                <div className="absolute left-[11%] right-[11%] top-8 h-px overflow-hidden bg-[#DDD8D0]">
                  <motion.div
                    animate={{
                      x: ["-100%", "400%"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="h-full w-1/3 bg-gradient-to-r from-transparent via-[#FF5C35] to-transparent"
                  />
                </div>

                <div className="grid grid-cols-4 gap-5">
                  {steps.map((step, index) => (
                    <motion.div
                      key={step.label}
                      initial={{
                        opacity: 0,
                        y: 25,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.5,
                        delay: 0.3 + index * 0.15,
                      }}
                      className="relative z-10 flex flex-col items-center"
                    >

                      {/* Step Icon */}
                      <motion.div
                        animate={{
                          y: [0, -8, 0],
                          boxShadow: [
                            "0 10px 25px rgba(40,35,30,0.06)",
                            "0 18px 35px rgba(255,92,53,0.16)",
                            "0 10px 25px rgba(40,35,30,0.06)",
                          ],
                        }}
                        transition={{
                          duration: 3,
                          delay: index * 0.45,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#E2DDD5] bg-white text-lg text-[#FF5C35]"
                      >
                        {step.icon}
                      </motion.div>

                      {/* Step Label */}
                      <motion.span
                        animate={{
                          opacity: [0.55, 1, 0.55],
                        }}
                        transition={{
                          duration: 3,
                          delay: index * 0.45,
                          repeat: Infinity,
                        }}
                        className="mt-3 text-xs font-medium text-[#68635C]"
                      >
                        {step.label}
                      </motion.span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* ========================= */}
              {/* SYNCORA AI CARD */}
              {/* ========================= */}

              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.9,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  delay: 1,
                  duration: 0.5,
                }}
                className="mt-10 flex items-center gap-3 rounded-2xl border border-[#E5E0D8] bg-white/80 p-4 shadow-[0_15px_40px_rgba(40,35,30,0.06)] backdrop-blur"
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
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0EB] text-[#FF5C35]"
                >
                  ✦
                </motion.div>

                <div>
                  <p className="text-xs font-semibold">
                    Syncora AI
                  </p>

                  <p className="mt-0.5 text-[11px] text-[#8A857D]">
                    Your engineering context, always connected.
                  </p>
                </div>

                <motion.span
                  animate={{
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="ml-auto h-2 w-2 rounded-full bg-[#20A464]"
                />
              </motion.div>
            </motion.div>
          </section>

          {/* ========================= */}
          {/* RIGHT SIDE */}
          {/* ========================= */}

          <section className="flex -translate-y-12 justify-center lg:-translate-y-12">
            <motion.div
              initial={{
                opacity: 0,
                x: 40,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.7,
                delay: 0.15,
                ease: "easeOut",
              }}
              className="w-full max-w-md"
            >

              {/* ========================= */}
              {/* MOBILE LOGO */}
              {/* ========================= */}

              <div className="mb-7 lg:hidden">
                <Link
                  to="/"
                  className="flex items-center gap-2.5"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF5C35] text-sm font-bold text-white">
                    S
                  </div>

                  <span className="text-xl font-semibold">
                    Syncora
                  </span>
                </Link>
              </div>

              {/* ========================= */}
              {/* SIGNUP CARD */}
              {/* ========================= */}

              <div className="rounded-[24px] border border-[#E4DFD8] bg-white p-[22px] shadow-[0_25px_70px_rgba(40,35,30,0.08)] sm:p-6">

                {/* Card Heading */}
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#FF5C35]">
                  Get started
                </p>

                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                  Create your account
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#77716A]">
                  Start building with Syncora.
                </p>

                {/* ========================= */}
                {/* SERVER ERROR */}
                {/* ========================= */}

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
                    className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs leading-5 text-red-600"
                  >
                    {serverError}
                  </motion.div>
                )}

                {/* ========================= */}
                {/* SIGNUP FORM */}
                {/* ========================= */}

                <form
                  onSubmit={handleSubmit}
                  className="mt-6 space-y-3"
                >

                  {/* Email */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-[#4F4B46]">
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
                      className={`w-full rounded-xl border bg-[#FBFAF8] px-4 py-3 text-sm outline-none transition-all placeholder:text-[#B1ABA2] focus:bg-white focus:ring-4 focus:ring-orange-500/10 ${
                        touched && !emailValid
                          ? "border-red-400 focus:border-red-400"
                          : "border-[#DDD8D0] focus:border-[#FF5C35]"
                      }`}
                    />

                    {touched && !emailValid && (
                      <p className="mt-1.5 text-[11px] text-red-500">
                        Enter a valid email address.
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <label className="text-xs font-medium text-[#4F4B46]">
                        Password
                      </label>

                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[11px] ${
                            passwordValid
                              ? "text-[#20A464]"
                              : "text-[#A09A91]"
                          }`}
                        >
                          {passwordValid
                            ? "Strong password"
                            : "Strong password required"}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswordRequirements((prev) => !prev)
                          }
                          aria-label="Show password requirements"
                          aria-expanded={showPasswordRequirements}
                          title="Password requirements"
                          className="flex h-4 w-4 items-center justify-center rounded-full text-[11px] text-[#A09A91] transition-colors hover:bg-[#F1EEE9] hover:text-[#FF5C35]"
                        >
                          i
                        </button>
                      </div>
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
                        className={`w-full rounded-xl border bg-[#FBFAF8] px-4 py-3 pr-12 text-sm outline-none transition-all placeholder:text-[#B1ABA2] focus:bg-white focus:ring-4 focus:ring-orange-500/10 ${
                          touched && !passwordValid
                            ? "border-red-400 focus:border-red-400"
                            : "border-[#DDD8D0] focus:border-[#FF5C35]"
                        }`}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((prev) => !prev)
                        }
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[#8A857D] transition-colors hover:bg-[#F3F0EB] hover:text-[#171717]"
                      >
                        {showPassword ? "◉" : "◌"}
                      </button>
                    </div>

                    {showPasswordRequirements && (
                      <div className="mt-1.5 grid grid-cols-3 gap-x-3 gap-y-1">
                        {[
                          ["length", "8+ characters"],
                          ["uppercase", "Uppercase letter"],
                          ["lowercase", "Lowercase letter"],
                          ["number", "Number"],
                          ["special", "Special character"],
                        ].map(([key, label]) => (
                          <div
                            key={key}
                            className="flex min-w-0 items-center gap-1 text-[10px]"
                          >
                            <span
                              className={`flex h-3 w-3 shrink-0 items-center justify-center rounded-full text-[7px] ${
                                validations[key]
                                  ? "bg-[#E8F7EF] text-[#20A464]"
                                  : "bg-[#F1EEE9] text-[#A09A91]"
                              }`}
                            >
                              {validations[key] ? "✓" : "•"}
                            </span>

                            <span
                              className={
                                validations[key]
                                  ? "truncate text-[#20A464]"
                                  : "truncate text-[#8A857D]"
                              }
                            >
                              {label}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Create Account Button */}
                  <motion.button
                    whileHover={
                      formValid && !loading
                        ? {
                            y: -2,
                            boxShadow:
                              "0 12px 30px rgba(255,92,53,0.22)",
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
                    className={`mt-1 flex w-full items-center justify-center rounded-xl px-5 py-3.5 text-sm font-semibold text-white transition-all ${
                      formValid && !loading
                        ? "bg-[#FF5C35] hover:bg-[#E94B27]"
                        : "cursor-not-allowed bg-[#D8D3CC]"
                    }`}
                  >
                    {loading
                      ? "Creating account..."
                      : "Create account →"}
                  </motion.button>
                </form>

                {/* ========================= */}
                {/* DIVIDER */}
                {/* ========================= */}

                <div className="my-3 flex items-center gap-3">
                  <div className="h-px flex-1 bg-[#E8E3DC]" />

                  <span className="text-[11px] text-[#A09A91]">
                    OR
                  </span>

                  <div className="h-px flex-1 bg-[#E8E3DC]" />
                </div>

                {/* ========================= */}
                {/* GOOGLE BUTTON */}
                {/* ========================= */}

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
                  className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#DDD8D0] bg-white px-4 py-3 text-sm font-medium transition-all hover:bg-[#F8F6F2] hover:shadow-sm"
                >
                  <span className="font-semibold">
                    G
                  </span>

                  Continue with Google
                </motion.button>

                {/* ========================= */}
                {/* TERMS */}
                {/* ========================= */}

                <p className="mt-3 text-center text-[11px] leading-5 text-[#969087]">
                  By creating an account, you agree to our{" "}
                  <span className="font-medium text-[#68635C]">
                    Terms
                  </span>{" "}
                  and{" "}
                  <span className="font-medium text-[#68635C]">
                    Privacy Policy
                  </span>
                  .
                </p>

                {/* ========================= */}
                {/* LOGIN - INSIDE CARD */}
                {/* ========================= */}

                <p className="mt-3 border-t border-[#E8E3DC] pt-3 text-center text-sm text-[#77716A]">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-[#FF5C35] transition-colors hover:text-[#E94B27]"
                  >
                    Log in
                  </Link>
                </p>
              </div>
            </motion.div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Signup;