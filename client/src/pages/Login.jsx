import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const hasCompletedOnboarding = (user) => {
  if (user?.onboardingCompleted === true) return true;

  try {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    return storedUser?.id === user?.id && storedUser?.onboardingCompleted === true;
  } catch {
    return false;
  }
};

const getPostLoginPath = (user) =>
  hasCompletedOnboarding(user)
    ? "/dashboard"
    : "/onboarding/welcome";

const acceptPendingInvitation = async (token, authToken) => {
  if (!token || !authToken) return false;

  const response = await fetch(`${API_URL}/api/auth/invitations/${token}/accept`, {
    method: "POST",
    headers: { Authorization: `Bearer ${authToken}` },
  });

  if (response.ok) {
    sessionStorage.removeItem("pendingInvite");
    return true;
  }

  return false;
};

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // STATE
  const [mode, setMode] = useState("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(
    location.state?.message || ""
  );
  const [toast, setToast] = useState(null);
  const [resendTimer, setResendTimer] = useState(0);

  // VALIDATION
  const normalizedEmail = email.trim().toLowerCase();

  const emailValid = EMAIL_REGEX.test(normalizedEmail);

  const passwordValid = password.length > 0;

  const formValid = emailValid && passwordValid;

  const otpValue = otp.join("");

  const otpValid = /^\d{6}$/.test(otpValue);

  const newPasswordValid = PASSWORD_REGEX.test(newPassword);

  const confirmPasswordValid =
    confirmPassword.length > 0 && confirmPassword === newPassword;

  const resetValid = newPasswordValid && confirmPasswordValid;

  // TOAST
  const showToast = (message, type = "error") => {
    setToast({
      message,
      type,
    });
  };

  useEffect(() => {
    const inviteFromState = location.state?.invite;
    if (inviteFromState) {
      sessionStorage.setItem("pendingInvite", inviteFromState);
    }
  }, [location.state]);

  useEffect(() => {
    if (!toast) return;

    const timeout = setTimeout(() => {
      setToast(null);
    }, 4000);

    return () => clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    const handleGoogleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      const googleError = params.get("googleError");
      const invite = params.get("invite");

      if (invite) sessionStorage.setItem("pendingInvite", invite);

      if (token) {
        localStorage.setItem("token", token);
        window.history.replaceState({}, "", "/login");

        const response = await fetch(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (response.ok && data.user) {
          const destination = getPostLoginPath(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
          const invitationAccepted = await acceptPendingInvitation(
            sessionStorage.getItem("pendingInvite"),
            token
          );
          navigate(invitationAccepted ? "/dashboard" : destination, {
            replace: true,
          });
        } else {
          navigate("/onboarding/welcome");
        }
        return;
      }

      if (googleError) {
        setServerError(googleError);
        window.history.replaceState({}, "", "/login");
      }
    };

    handleGoogleCallback();
  }, [navigate]);

  // RESEND TIMER

  useEffect(() => {
    if (resendTimer <= 0) return;

    const interval = setInterval(() => {
      setResendTimer((current) => {
        if (current <= 1) {
          clearInterval(interval);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [resendTimer]);

  const startResendTimer = () => {
    setResendTimer(30);
  };

  // CLEAR ERRORS

  const clearErrors = () => {
    setServerError("");
  };

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();

    setTouched(true);
    clearErrors();

    if (!formValid || loading) return;

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/auth/login`, {
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
        const message = data.message || "Invalid email or password.";

        setServerError(message);
        showToast(message, "error");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      const invitationAccepted = await acceptPendingInvitation(
        sessionStorage.getItem("pendingInvite"),
        data.token
      );

      const destination = getPostLoginPath(data.user);

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      showToast("Welcome back to Syncora.", "success");
      navigate(invitationAccepted ? "/dashboard" : destination, {
        replace: true,
      });
    } catch (error) {
      console.error("Login error:", error);

      const message =
        "Unable to connect to Syncora. Please make sure the server is running.";

      setServerError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  // FORGOT PASSWORD

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    setTouched(true);
    clearErrors();

    if (!emailValid || loading) return;

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const message = data.message || "We couldn't process your request.";

        setServerError(message);
        showToast(message, "error");
        return;
      }

      setOtp(["", "", "", "", "", ""]);

      startResendTimer();

      setMode("otp");

      showToast("We've sent a verification code to your email.", "success");
    } catch (error) {
      console.error("Forgot password error:", error);

      const message = "Unable to connect to Syncora. Please try again.";

      setServerError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  // OTP CHANGE
  const handleOtpChange = (index, value) => {
    const numericValue = value.replace(/\D/g, "").slice(-1);

    const updatedOtp = [...otp];

    updatedOtp[index] = numericValue;

    setOtp(updatedOtp);
    clearErrors();

    if (numericValue && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  // OTP KEYBOARD

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }

    if (e.key === "ArrowLeft" && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  // OTP PASTE

  const handleOtpPaste = (e) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pasted) return;

    const updatedOtp = ["", "", "", "", "", ""];

    pasted.split("").forEach((digit, index) => {
      updatedOtp[index] = digit;
    });

    setOtp(updatedOtp);
    clearErrors();

    const nextIndex = Math.min(pasted.length, 6) - 1;

    if (nextIndex >= 0) {
      document.getElementById(`otp-${nextIndex}`)?.focus();
    }
  };

  // VERIFY OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    clearErrors();

    if (!otpValid || loading) return;

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/auth/verify-reset-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
          otp: otpValue,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const message = data.message || "Invalid or expired verification code.";

        setServerError(message);
        showToast(message, "error");
        return;
      }

      setMode("reset");

      showToast("Email verified successfully.", "success");
    } catch (error) {
      console.error("OTP verification error:", error);

      const message = "Unable to verify the code. Please try again.";

      setServerError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  // RESEND OTP
  const handleResendOtp = async () => {
    if (resendTimer > 0 || loading || !emailValid) {
      return;
    }

    try {
      setLoading(true);
      clearErrors();

      const response = await fetch(`${API_URL}/api/auth/resend-reset-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const message =
          data.message || "Unable to resend the verification code.";

        setServerError(message);
        showToast(message, "error");
        return;
      }

      setOtp(["", "", "", "", "", ""]);

      startResendTimer();

      showToast("A new verification code has been sent.", "success");

      setTimeout(() => {
        document.getElementById("otp-0")?.focus();
      }, 50);
    } catch (error) {
      console.error("Resend OTP error:", error);

      showToast("Unable to resend the code. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  // RESET PASSWORD
  const handleResetPassword = async (e) => {
    e.preventDefault();

    clearErrors();

    if (!resetValid || loading) return;

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
          otp: otpValue,
          password: newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const message = data.message || "Unable to reset your password.";

        setServerError(message);
        showToast(message, "error");
        return;
      }

      setPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setOtp(["", "", "", "", "", ""]);

      setMode("success");

      showToast("Your password has been updated.", "success");
    } catch (error) {
      console.error("Reset password error:", error);

      const message = "Unable to connect to Syncora. Please try again.";

      setServerError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  // SWITCH TO LOGIN
  const switchToLogin = () => {
    setServerError("");
    setTouched(false);
    setMode("login");
    setResendTimer(0);
  };

  // CHANGE EMAIL
  const changeEmail = () => {
    setServerError("");
    setOtp(["", "", "", "", "", ""]);
    setMode("forgot");
  };

  // ANIMATION

  const cardVariants = {
    initial: {
      opacity: 0,
      x: 18,
    },

    animate: {
      opacity: 1,
      x: 0,
    },

    exit: {
      opacity: 0,
      x: -18,
    },
  };

  // UI
  return (
    <main className="min-h-screen overflow-hidden bg-[#FAF9F6] text-[#171717]">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{
              opacity: 0,
              x: 80,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              x: 80,
              scale: 0.95,
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
            }}
            className="fixed right-5 top-5 z-[100] w-[min(380px,calc(100vw-40px))]"
          >
            <div
              className={`flex items-start gap-3 rounded-2xl border px-4 py-3.5 shadow-[0_18px_50px_rgba(30,25,20,0.15)] backdrop-blur-xl ${
                toast.type === "success"
                  ? "border-emerald-200 bg-white/95"
                  : "border-red-200 bg-white/95"
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                  toast.type === "success"
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {toast.type === "success" ? "✓" : "!"}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[#171717]">
                  {toast.type === "success"
                    ? "Success"
                    : "Something went wrong"}
                </p>

                <p className="mt-0.5 text-xs leading-5 text-[#77716A]">
                  {toast.message}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setToast(null)}
                className="text-[#A09A91] transition hover:text-[#171717]"
                aria-label="Close notification"
              >
                ×
              </button>
            </div>

            <motion.div
              initial={{
                width: "100%",
              }}
              animate={{
                width: "0%",
              }}
              transition={{
                duration: 4,
                ease: "linear",
              }}
              className={`mt-1 h-0.5 rounded-full ${
                toast.type === "success" ? "bg-emerald-500" : "bg-red-500"
              }`}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================
          PAGE
      ====================================================== */}

      <div className="relative mx-auto min-h-screen max-w-[1500px]">
        {/* Background glow */}

        <motion.div
          animate={{
            x: [0, 35, -20, 0],
            y: [0, -20, 15, 0],
            scale: [1, 1.08, 0.96, 1],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="pointer-events-none absolute left-[8%] top-[15%] h-80 w-80 rounded-full bg-orange-200/30 blur-[120px]"
        />

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

        {/* ==================================================
            HEADER
        ================================================== */}

        <header className="relative z-20 flex items-center px-6 py-5 sm:px-10 lg:px-12">
          <Link to="/" className="flex items-center gap-2.5">
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

        {/* ==================================================
            MAIN GRID
        ================================================== */}

        <div className="relative grid min-h-[calc(100vh-78px)] items-start px-6 pb-8 pt-2 sm:px-10 lg:grid-cols-2 lg:px-12 lg:py-4">
          {/* ==================================================
              LEFT SIDE
          ================================================== */}

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
              className="mx-auto max-w-xl pt-[calc((100vh-78px)/2-250px)]"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#FF5C35]">
                Welcome back
              </p>

              <h1 className="mt-4 text-6xl font-semibold leading-[0.98] tracking-[-0.055em]">
                Your workspace.
                <br />
                <span className="text-[#FF5C35]">Always in sync.</span>
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-[#6B6862]">
                Pick up where you left off. Your projects, development workflow,
                team context, and AI assistance are waiting.
              </p>

              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.6,
                  duration: 0.5,
                }}
                className="mt-10 flex items-center gap-4 rounded-2xl border border-[#E5E0D8] bg-white/80 p-5 shadow-[0_15px_40px_rgba(40,35,30,0.06)] backdrop-blur"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.08, 1],
                    rotate: [0, 5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF0EB] text-lg text-[#FF5C35]"
                >
                  ✦
                </motion.div>

                <div>
                  <p className="text-sm font-semibold">Syncora AI</p>

                  <p className="mt-1 text-xs leading-5 text-[#8A857D]">
                    Your engineering context stays connected.
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

          {/* ==================================================
              RIGHT SIDE
          ================================================== */}

          <section className="flex -translate-y-6 justify-center lg:-translate-y-12">
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
              {/* Mobile logo */}

              <div className="mb-5 lg:hidden">
                <Link to="/" className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF5C35] text-sm font-bold text-white">
                    S
                  </div>

                  <span className="text-xl font-semibold">Syncora</span>
                </Link>
              </div>

              <div className="relative min-h-[520px] overflow-hidden rounded-[21px] border border-[#E4DFD8] bg-white p-[22px] shadow-[0_20px_55px_rgba(40,35,30,0.08)] sm:p-6">
                <AnimatePresence mode="popLayout" initial={false}>
                  {/* ==================================================
                      LOGIN
                  ================================================== */}

                  {mode === "login" && (
                    <motion.div
                      key="login"
                      variants={cardVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{
                        duration: 0.28,
                        ease: "easeOut",
                      }}
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#FF5C35]">
                        Welcome back
                      </p>

                      <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                        Log in to Syncora
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-[#77716A]">
                        Continue where you left off.
                      </p>

                      <AnimatePresence>
                        {serverError && (
                          <motion.div
                            initial={{
                              opacity: 0,
                              height: 0,
                            }}
                            animate={{
                              opacity: 1,
                              height: "auto",
                            }}
                            exit={{
                              opacity: 0,
                              height: 0,
                            }}
                            className="overflow-hidden"
                          >
                            <p className="mt-4 rounded-xl bg-red-50 px-4 py-2.5 text-[11px] text-red-600">
                              {serverError}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <form onSubmit={handleLogin} className="mt-6 space-y-3.5">
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-[#4F4B46]">
                            Work email
                          </label>

                          <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              clearErrors();
                            }}
                            placeholder="you@company.com"
                            autoComplete="email"
                            className={`w-full rounded-xl border bg-[#FBFAF8] px-4 py-3 text-sm outline-none transition-all placeholder:text-[#B1ABA2] focus:bg-white focus:ring-4 focus:ring-orange-500/10 ${
                              touched && !emailValid
                                ? "border-red-400"
                                : "border-[#DDD8D0] focus:border-[#FF5C35]"
                            }`}
                          />

                          {touched && !emailValid && (
                            <p className="mt-1 text-[11px] text-red-500">
                              Enter a valid email address.
                            </p>
                          )}
                        </div>

                        <div>
                          <div className="mb-1.5 flex items-center justify-between">
                            <label className="text-xs font-medium text-[#4F4B46]">
                              Password
                            </label>

                            <button
                              type="button"
                              onClick={() => {
                                clearErrors();
                                setTouched(false);
                                setMode("forgot");
                              }}
                              className="text-[11px] font-medium text-[#8A857D] transition-colors hover:text-[#FF5C35]"
                            >
                              Forgot password?
                            </button>
                          </div>

                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={(e) => {
                                setPassword(e.target.value);
                                clearErrors();
                              }}
                              onBlur={() => setTouched(true)}
                              placeholder="Enter your password"
                              autoComplete="current-password"
                              className={`w-full rounded-xl border bg-[#FBFAF8] px-4 py-3 pr-12 text-sm outline-none transition-all placeholder:text-[#B1ABA2] focus:bg-white focus:ring-4 focus:ring-orange-500/10 ${
                                touched && !passwordValid
                                  ? "border-red-400"
                                  : "border-[#DDD8D0] focus:border-[#FF5C35]"
                              }`}
                            />

                            <button
                              type="button"
                              onClick={() => setShowPassword((prev) => !prev)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[#8A857D] transition-colors hover:bg-[#F3F0EB] hover:text-[#171717]"
                              aria-label={
                                showPassword ? "Hide password" : "Show password"
                              }
                            >
                              {showPassword ? "◉" : "◌"}
                            </button>
                          </div>

                          {touched && !passwordValid && (
                            <p className="mt-1 text-[11px] text-red-500">
                              Enter your password.
                            </p>
                          )}
                        </div>

                        <motion.button
                          whileHover={
                            formValid && !loading
                              ? {
                                  y: -2,
                                  boxShadow: "0 12px 30px rgba(255,92,53,0.22)",
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
                          {loading ? (
                            <span className="flex items-center gap-2">
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                              Signing in...
                            </span>
                          ) : (
                            "Log in →"
                          )}
                        </motion.button>
                      </form>

                      <div className="my-5 flex items-center gap-3">
                        <div className="h-px flex-1 bg-[#E8E3DC]" />

                        <span className="text-[11px] text-[#A09A91]">OR</span>

                        <div className="h-px flex-1 bg-[#E8E3DC]" />
                      </div>

                      <motion.button
                        whileHover={{ y: -2 }}
                        whileTap={{
                          scale: 0.98,
                        }}
                        type="button"
                        onClick={() => {
                          window.location.href = `${API_URL}/api/auth/google`;
                        }}
                        className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#DDD8D0] bg-white px-4 py-3 text-sm font-medium transition-all hover:bg-[#F8F6F2] hover:shadow-sm"
                      >
                        <span className="font-semibold">G</span>
                        Continue with Google
                      </motion.button>

                      <p className="mt-5 border-t border-[#E8E3DC] pt-4 text-center text-sm text-[#77716A]">
                        Don't have an account?{" "}
                        <Link
                          to="/signup"
                          className="font-semibold text-[#FF5C35] transition-colors hover:text-[#E94B27]"
                        >
                          Create one
                        </Link>
                      </p>
                    </motion.div>
                  )}

                  {/* ==================================================
                      FORGOT PASSWORD
                  ================================================== */}

                  {mode === "forgot" && (
                    <motion.div
                      key="forgot"
                      variants={cardVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{
                        duration: 0.28,
                        ease: "easeOut",
                      }}
                    >
                      <button
                        type="button"
                        onClick={switchToLogin}
                        className="mb-5 flex items-center gap-1.5 text-xs font-medium text-[#8A857D] transition hover:text-[#FF5C35]"
                      >
                        ← Back to login
                      </button>

                      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF0EB] text-lg text-[#FF5C35]">
                        ✉
                      </div>

                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#FF5C35]">
                        Account recovery
                      </p>

                      <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                        Forgot your password?
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-[#77716A]">
                        Enter your email and we'll send you a secure
                        verification code.
                      </p>

                      {serverError && (
                        <p className="mt-4 rounded-xl bg-red-50 px-4 py-2.5 text-[11px] text-red-600">
                          {serverError}
                        </p>
                      )}

                      <form onSubmit={handleForgotPassword} className="mt-6">
                        <label className="mb-1.5 block text-xs font-medium text-[#4F4B46]">
                          Work email
                        </label>

                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            clearErrors();
                          }}
                          placeholder="you@company.com"
                          autoFocus
                          autoComplete="email"
                          className={`w-full rounded-xl border bg-[#FBFAF8] px-4 py-3 text-sm outline-none transition-all placeholder:text-[#B1ABA2] focus:bg-white focus:border-[#FF5C35] focus:ring-4 focus:ring-orange-500/10 ${
                            touched && !emailValid
                              ? "border-red-400"
                              : "border-[#DDD8D0]"
                          }`}
                        />

                        {touched && !emailValid && (
                          <p className="mt-1 text-[11px] text-red-500">
                            Enter a valid email address.
                          </p>
                        )}

                        <motion.button
                          whileHover={
                            emailValid && !loading
                              ? {
                                  y: -2,
                                  boxShadow: "0 12px 30px rgba(255,92,53,0.22)",
                                }
                              : {}
                          }
                          whileTap={
                            emailValid && !loading
                              ? {
                                  scale: 0.98,
                                }
                              : {}
                          }
                          type="submit"
                          disabled={!emailValid || loading}
                          className={`mt-5 flex w-full items-center justify-center rounded-xl px-5 py-3.5 text-sm font-semibold text-white transition-all ${
                            emailValid && !loading
                              ? "bg-[#FF5C35] hover:bg-[#E94B27]"
                              : "cursor-not-allowed bg-[#D8D3CC]"
                          }`}
                        >
                          {loading ? (
                            <span className="flex items-center gap-2">
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                              Sending code...
                            </span>
                          ) : (
                            "Send verification code →"
                          )}
                        </motion.button>
                      </form>

                      <p className="mt-5 text-center text-xs leading-5 text-[#9A948C]">
                        For your security, we'll only send a code if an account
                        exists with this email.
                      </p>
                    </motion.div>
                  )}

                  {/* ==================================================
                      OTP
                  ================================================== */}

                  {mode === "otp" && (
                    <motion.div
                      key="otp"
                      variants={cardVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{
                        duration: 0.28,
                        ease: "easeOut",
                      }}
                    >
                      <button
                        type="button"
                        onClick={changeEmail}
                        className="mb-5 flex items-center gap-1.5 text-xs font-medium text-[#8A857D] transition hover:text-[#FF5C35]"
                      >
                        ← Change email
                      </button>

                      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF0EB] text-lg text-[#FF5C35]">
                        ✦
                      </div>

                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#FF5C35]">
                        Verify your email
                      </p>

                      <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                        Enter your code
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-[#77716A]">
                        Enter the 6-digit code we sent to{" "}
                        <span className="font-medium text-[#4F4B46]">
                          {email}
                        </span>
                        .
                      </p>

                      {serverError && (
                        <p className="mt-4 rounded-xl bg-red-50 px-4 py-2.5 text-[11px] text-red-600">
                          {serverError}
                        </p>
                      )}

                      <form onSubmit={handleVerifyOtp} className="mt-7">
                        <div
                          className="flex justify-between gap-2"
                          onPaste={handleOtpPaste}
                        >
                          {otp.map((digit, index) => (
                            <input
                              key={index}
                              id={`otp-${index}`}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={digit}
                              autoFocus={index === 0}
                              onChange={(e) =>
                                handleOtpChange(index, e.target.value)
                              }
                              onKeyDown={(e) => handleOtpKeyDown(index, e)}
                              aria-label={`Verification digit ${index + 1}`}
                              className={`h-12 w-full rounded-xl border bg-[#FBFAF8] text-center text-lg font-semibold outline-none transition-all focus:border-[#FF5C35] focus:bg-white focus:ring-4 focus:ring-orange-500/10 ${
                                serverError
                                  ? "border-red-300"
                                  : "border-[#DDD8D0]"
                              }`}
                            />
                          ))}
                        </div>

                        <motion.button
                          whileHover={
                            otpValid && !loading
                              ? {
                                  y: -2,
                                  boxShadow: "0 12px 30px rgba(255,92,53,0.22)",
                                }
                              : {}
                          }
                          whileTap={
                            otpValid && !loading
                              ? {
                                  scale: 0.98,
                                }
                              : {}
                          }
                          type="submit"
                          disabled={!otpValid || loading}
                          className={`mt-5 flex w-full items-center justify-center rounded-xl px-5 py-3.5 text-sm font-semibold text-white transition-all ${
                            otpValid && !loading
                              ? "bg-[#FF5C35] hover:bg-[#E94B27]"
                              : "cursor-not-allowed bg-[#D8D3CC]"
                          }`}
                        >
                          {loading ? (
                            <span className="flex items-center gap-2">
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                              Verifying...
                            </span>
                          ) : (
                            "Verify code →"
                          )}
                        </motion.button>
                      </form>

                      <div className="mt-5 text-center">
                        <p className="text-xs text-[#8A857D]">
                          Didn't receive the code?
                        </p>

                        <button
                          type="button"
                          disabled={resendTimer > 0 || loading}
                          onClick={handleResendOtp}
                          className={`mt-1 text-xs font-semibold ${
                            resendTimer > 0
                              ? "text-[#B1ABA2]"
                              : "text-[#FF5C35] hover:text-[#E94B27]"
                          }`}
                        >
                          {resendTimer > 0
                            ? `Resend in ${resendTimer}s`
                            : "Resend code"}
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* ==================================================
                      RESET PASSWORD
                  ================================================== */}

                  {mode === "reset" && (
                    <motion.div
                      key="reset"
                      variants={cardVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{
                        duration: 0.28,
                        ease: "easeOut",
                      }}
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#FF5C35]">
                        Almost there
                      </p>

                      <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                        Create a new password
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-[#77716A]">
                        Choose a strong password you haven't used before.
                      </p>

                      {serverError && (
                        <p className="mt-4 rounded-xl bg-red-50 px-4 py-2.5 text-[11px] text-red-600">
                          {serverError}
                        </p>
                      )}

                      <form
                        onSubmit={handleResetPassword}
                        className="mt-6 space-y-4"
                      >
                        {/* New password */}

                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-[#4F4B46]">
                            New password
                          </label>

                          <div className="relative">
                            <input
                              type={showNewPassword ? "text" : "password"}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              autoFocus
                              autoComplete="new-password"
                              placeholder="Create a new password"
                              className={`w-full rounded-xl border bg-[#FBFAF8] px-4 py-3 pr-12 text-sm outline-none transition-all placeholder:text-[#B1ABA2] focus:bg-white focus:ring-4 focus:ring-orange-500/10 ${
                                newPassword.length > 0 && !newPasswordValid
                                  ? "border-red-400"
                                  : "border-[#DDD8D0] focus:border-[#FF5C35]"
                              }`}
                            />

                            <button
                              type="button"
                              onClick={() =>
                                setShowNewPassword((prev) => !prev)
                              }
                              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[#8A857D] hover:bg-[#F3F0EB]"
                              aria-label={
                                showNewPassword
                                  ? "Hide new password"
                                  : "Show new password"
                              }
                            >
                              {showNewPassword ? "◉" : "◌"}
                            </button>
                          </div>

                          <p
                            className={`mt-1.5 text-[11px] ${
                              newPassword.length > 0 && !newPasswordValid
                                ? "text-red-500"
                                : "text-[#9A948C]"
                            }`}
                          >
                            At least 8 characters with uppercase, lowercase,
                            number, and special character.
                          </p>
                        </div>

                        {/* Confirm password */}

                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-[#4F4B46]">
                            Confirm password
                          </label>

                          <div className="relative">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              value={confirmPassword}
                              onChange={(e) =>
                                setConfirmPassword(e.target.value)
                              }
                              autoComplete="new-password"
                              placeholder="Confirm your password"
                              className={`w-full rounded-xl border bg-[#FBFAF8] px-4 py-3 pr-12 text-sm outline-none transition-all placeholder:text-[#B1ABA2] focus:bg-white focus:ring-4 focus:ring-orange-500/10 ${
                                confirmPassword.length > 0 &&
                                !confirmPasswordValid
                                  ? "border-red-400"
                                  : "border-[#DDD8D0] focus:border-[#FF5C35]"
                              }`}
                            />

                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword((prev) => !prev)
                              }
                              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[#8A857D] hover:bg-[#F3F0EB]"
                              aria-label={
                                showConfirmPassword
                                  ? "Hide confirm password"
                                  : "Show confirm password"
                              }
                            >
                              {showConfirmPassword ? "◉" : "◌"}
                            </button>
                          </div>

                          {confirmPassword.length > 0 &&
                            !confirmPasswordValid && (
                              <p className="mt-1.5 text-[11px] text-red-500">
                                Passwords don't match.
                              </p>
                            )}
                        </div>

                        <motion.button
                          whileHover={
                            resetValid && !loading
                              ? {
                                  y: -2,
                                  boxShadow: "0 12px 30px rgba(255,92,53,0.22)",
                                }
                              : {}
                          }
                          whileTap={
                            resetValid && !loading
                              ? {
                                  scale: 0.98,
                                }
                              : {}
                          }
                          type="submit"
                          disabled={!resetValid || loading}
                          className={`flex w-full items-center justify-center rounded-xl px-5 py-3.5 text-sm font-semibold text-white transition-all ${
                            resetValid && !loading
                              ? "bg-[#FF5C35] hover:bg-[#E94B27]"
                              : "cursor-not-allowed bg-[#D8D3CC]"
                          }`}
                        >
                          {loading ? (
                            <span className="flex items-center gap-2">
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                              Updating password...
                            </span>
                          ) : (
                            "Reset password →"
                          )}
                        </motion.button>
                      </form>
                    </motion.div>
                  )}

                  {/* ==================================================
                      SUCCESS
                  ================================================== */}

                  {mode === "success" && (
                    <motion.div
                      key="success"
                      variants={cardVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{
                        duration: 0.28,
                        ease: "easeOut",
                      }}
                      className="flex min-h-[470px] flex-col items-center justify-center text-center"
                    >
                      <motion.div
                        initial={{
                          scale: 0,
                          opacity: 0,
                        }}
                        animate={{
                          scale: 1,
                          opacity: 1,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 18,
                        }}
                        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-2xl text-emerald-600"
                      >
                        ✓
                      </motion.div>

                      <h2 className="mt-6 text-3xl font-semibold tracking-[-0.04em]">
                        Password updated
                      </h2>

                      <p className="mt-3 max-w-xs text-sm leading-6 text-[#77716A]">
                        Your Syncora password has been changed successfully. You
                        can now sign in with your new password.
                      </p>

                      <motion.button
                        whileHover={{
                          y: -2,
                        }}
                        whileTap={{
                          scale: 0.98,
                        }}
                        type="button"
                        onClick={switchToLogin}
                        className="mt-7 rounded-xl bg-[#FF5C35] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(255,92,53,0.18)] transition hover:bg-[#E94B27]"
                      >
                        Back to login →
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Login;
