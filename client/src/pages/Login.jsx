import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../assets/logo.png";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const hasCompletedOnboarding = (user) => {
  if (user?.onboardingCompleted === true) return true;

  try {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");

    return (
      storedUser?.id === user?.id && storedUser?.onboardingCompleted === true
    );
  } catch {
    return false;
  }
};

const getPostLoginPath = (user) =>
  hasCompletedOnboarding(user) ? "/dashboard" : "/onboarding/welcome";

const acceptPendingInvitation = async (token, authToken) => {
  if (!token || !authToken) return false;

  try {
    const response = await fetch(
      `${API_URL}/api/auth/invitations/${token}/accept`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );

    if (response.ok) {
      sessionStorage.removeItem("pendingInvite");
      return true;
    }
  } catch (error) {
    console.error("Invitation error:", error);
  }

  return false;
};

/* =========================================================
   REUSABLE 3D BACKGROUND
========================================================= */

const FloatingParticles = () => {
  const particles = [
    { left: "55%", top: "14%", size: "small", delay: 0 },
    { left: "66%", top: "24%", size: "tiny", delay: 1.2 },
    { left: "82%", top: "16%", size: "small", delay: 2.1 },
    { left: "73%", top: "68%", size: "tiny", delay: 0.7 },
    { left: "57%", top: "80%", size: "small", delay: 1.8 },
    { left: "91%", top: "57%", size: "tiny", delay: 2.7 },
    { left: "47%", top: "34%", size: "tiny", delay: 3.2 },
    { left: "87%", top: "82%", size: "small", delay: 1.4 },
  ];

  return (
    <>
      {particles.map((particle, index) => (
        <motion.div
          key={index}
          initial={{
            opacity: 0.1,
            scale: 0.6,
          }}
          animate={{
            opacity: [0.1, 0.9, 0.1],
            scale: [0.6, 1.25, 0.6],
            y: [0, -30, 0],
            x: [0, index % 2 === 0 ? 8 : -8, 0],
          }}
          transition={{
            duration: 4 + index * 0.45,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`absolute rounded-full bg-orange-300 ${
            particle.size === "small" ? "h-1.5 w-1.5" : "h-1 w-1"
          }`}
          style={{
            left: particle.left,
            top: particle.top,
            boxShadow: "0 0 18px rgba(255,120,80,.8)",
          }}
        />
      ))}
    </>
  );
};

const NeuralCore = () => {
  const nodes = [
    { left: "12%", top: "28%", z: 80 },
    { left: "82%", top: "18%", z: 40 },
    { left: "88%", top: "72%", z: 100 },
    { left: "18%", top: "78%", z: 50 },
    { left: "50%", top: "5%", z: 70 },
    { left: "50%", top: "95%", z: 40 },
  ];

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.7,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={{
        duration: 1.2,
        ease: "easeOut",
      }}
      className="
        absolute
        left-[7%]
        top-[21%]
        hidden
        h-[300px]
        w-[300px]
        lg:block
      "
      style={{
        perspective: "1100px",
      }}
    >
      {/* Ambient aura */}

      <motion.div
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.12, 0.25, 0.12],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          -inset-20
          rounded-full
          bg-[#FF8C2B]/10
          blur-[70px]
        "
      />

      {/* Main 3D scene */}

      <motion.div
        animate={{
          rotateX: [0, 360],
          rotateY: [0, 360],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          transformStyle: "preserve-3d",
        }}
        className="absolute inset-0"
      >
        {/* Main sphere */}

        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-[150px]
            w-[150px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
          "
          style={{
            transform: "translateZ(30px)",
            background:
              "radial-gradient(circle at 30% 25%, rgba(255,225,215,.85), rgba(255,140,43,.30) 25%, rgba(130,35,18,.15) 55%, rgba(0,0,0,.5) 100%)",
            boxShadow:
              "inset -40px -35px 60px rgba(0,0,0,.58), inset 18px 14px 35px rgba(232,216,137,.16), 0 0 90px rgba(255,140,43,.18)",
          }}
        />

        {/* Glass shell */}

        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-[122px]
            w-[122px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            border
            border-[#E8D889]/10
            bg-[#E8D889]/[0.025]
          "
          style={{
            transform: "translateZ(72px)",
            backdropFilter: "blur(2px)",
          }}
        />

        {/* Highlight */}

        <div
          className="
            absolute
            left-[82px]
            top-[70px]
            h-8
            w-12
            rotate-[-25deg]
            rounded-full
            bg-[#E8D889]/20
            blur-xl
          "
          style={{
            transform: "translateZ(105px)",
          }}
        />

        {/* Orbit 1 */}

        <motion.div
          animate={{
            rotateZ: 360,
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "linear",
          }}
          className="
            absolute
            left-1/2
            top-1/2
            h-[220px]
            w-[220px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            border
            border-[#FF8C2B]/20
          "
          style={{
            transform: "translate(-50%, -50%) rotateX(65deg)",
          }}
        >
          <div
            className="
              absolute
              left-1/2
              top-0
              h-2
              w-2
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-orange-300
            "
            style={{
              boxShadow: "0 0 22px rgba(255,120,80,.95)",
            }}
          />
        </motion.div>

        {/* Orbit 2 */}

        <motion.div
          animate={{
            rotateZ: -360,
          }}
          transition={{
            duration: 13,
            repeat: Infinity,
            ease: "linear",
          }}
          className="
            absolute
            left-1/2
            top-1/2
            h-[255px]
            w-[145px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            border
            border-violet-400/15
          "
          style={{
            transform: "translate(-50%, -50%) rotateY(68deg)",
          }}
        />

        {/* Orbit 3 */}

        <motion.div
          animate={{
            rotateZ: 360,
          }}
          transition={{
            duration: 17,
            repeat: Infinity,
            ease: "linear",
          }}
          className="
            absolute
            left-1/2
            top-1/2
            h-[185px]
            w-[260px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            border
            border-[#E8D889]/[0.07]
          "
          style={{
            transform: "translate(-50%, -50%) rotateX(48deg) rotateY(18deg)",
          }}
        />

        {/* Nodes */}

        {nodes.map((node, index) => (
          <motion.div
            key={index}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.7, 1.3, 0.7],
            }}
            transition={{
              duration: 3 + index * 0.5,
              delay: index * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="
              absolute
              h-1.5
              w-1.5
              rounded-full
              bg-orange-300
            "
            style={{
              left: node.left,
              top: node.top,
              transform: `translateZ(${node.z}px)`,
              boxShadow: "0 0 16px rgba(255,120,80,.9)",
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

const FloatingCube = () => {
  return (
    <motion.div
      animate={{
        y: [0, -22, 0, 22, 0],
        rotateX: [0, 14, 0, -14, 0],
        rotateY: [0, -18, 0, 18, 0],
        rotateZ: [0, 5, 0, -5, 0],
      }}
      transition={{
        duration: 13,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      className="
        absolute
        left-[37%]
        top-[13%]
        hidden
        h-36
        w-36
        lg:block
      "
    >
      <div className="absolute -inset-12 rounded-full bg-[#FF8C2B]/[0.04] blur-3xl" />

      <div
        className="
          absolute
          inset-0
          border
          border-orange-300/20
          bg-[#FF8C2B]/[0.015]
        "
        style={{
          transform: "translateZ(72px)",
        }}
      />

      <div
        className="
          absolute
          inset-0
          border
          border-violet-400/15
        "
        style={{
          transform: "translateZ(-72px)",
        }}
      />

      <div
        className="
          absolute
          inset-0
          border
          border-orange-300/15
        "
        style={{
          transform: "rotateY(90deg) translateZ(72px)",
        }}
      />

      <div
        className="
          absolute
          inset-0
          border
          border-[#E8D889]/[0.07]
        "
        style={{
          transform: "rotateY(-90deg) translateZ(72px)",
        }}
      />

      <div
        className="
          absolute
          inset-0
          border
          border-orange-300/15
        "
        style={{
          transform: "rotateX(90deg) translateZ(72px)",
        }}
      />

      <div
        className="
          absolute
          inset-0
          border
          border-violet-300/10
        "
        style={{
          transform: "rotateX(-90deg) translateZ(72px)",
        }}
      />

      {/* Center light */}

      <motion.div
        animate={{
          opacity: [0.25, 0.7, 0.25],
          scale: [0.8, 1.2, 0.8],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          left-1/2
          top-1/2
          h-2
          w-2
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-orange-300
        "
        style={{
          transform: "translate(-50%, -50%) translateZ(90px)",
          boxShadow: "0 0 25px rgba(255,110,70,.9)",
        }}
      />
    </motion.div>
  );
};

const GlassOrbit = () => {
  return (
    <motion.div
      animate={{
        rotateZ: 360,
      }}
      transition={{
        duration: 30,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        transformStyle: "preserve-3d",
      }}
      className="
        absolute
        bottom-[12%]
        right-[9%]
        hidden
        h-[240px]
        w-[240px]
        lg:block
      "
    >
      {/* Outer ring */}

      <div
        className="
          absolute
          inset-0
          rounded-full
          border
          border-[#FF8C2B]/15
        "
        style={{
          transform: "rotateX(68deg)",
        }}
      />

      {/* Second ring */}

      <motion.div
        animate={{
          rotateZ: -360,
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
        }}
        className="
          absolute
          inset-7
          rounded-full
          border
          border-violet-400/15
        "
        style={{
          transform: "rotateX(68deg)",
        }}
      />

      {/* Vertical ring */}

      <div
        className="
          absolute
          inset-10
          rounded-full
          border
          border-[#E8D889]/[0.06]
        "
        style={{
          transform: "rotateY(65deg)",
        }}
      />

      {/* Core */}

      <motion.div
        animate={{
          scale: [0.8, 1.2, 0.8],
          opacity: [0.4, 1, 0.4],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          left-1/2
          top-1/2
          h-3
          w-3
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[#FF8C2B]
        "
        style={{
          boxShadow: "0 0 40px rgba(255,140,43,.85)",
        }}
      />
    </motion.div>
  );
};

const LoginBackground = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* =================================================
          AMBIENT LIGHT
      ================================================= */}

      <motion.div
        animate={{
          x: [0, 90, -50, 0],
          y: [0, -60, 70, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          left-[-5%]
          top-[8%]
          h-[520px]
          w-[520px]
          rounded-full
          bg-[#FF8C2B]/[0.12]
          blur-[150px]
        "
      />

      <motion.div
        animate={{
          x: [0, -70, 60, 0],
          y: [0, 70, -40, 0],
          scale: [1, 0.9, 1.15, 1],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          bottom-[-10%]
          right-[-5%]
          h-[520px]
          w-[520px]
          rounded-full
          bg-violet-600/[0.10]
          blur-[170px]
        "
      />

      <NeuralCore />
      <FloatingCube />
      <GlassOrbit />
      <FloatingParticles />

      {/* =================================================
          MOVING LIGHT STREAKS
      ================================================= */}

      <motion.div
        animate={{
          x: ["-10%", "110%"],
          opacity: [0, 0.35, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear",
          delay: 2,
        }}
        className="
          absolute
          left-0
          top-[30%]
          h-px
          w-[280px]
          bg-gradient-to-r
          from-transparent
          via-orange-300/30
          to-transparent
          blur-[1px]
        "
      />

      <motion.div
        animate={{
          x: ["110%", "-20%"],
          opacity: [0, 0.25, 0],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "linear",
          delay: 5,
        }}
        className="
          absolute
          left-0
          top-[73%]
          h-px
          w-[320px]
          bg-gradient-to-r
          from-transparent
          via-violet-300/25
          to-transparent
        "
      />

      {/* =================================================
          GRID
      ================================================= */}

      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(232,216,137,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(232,216,137,.8) 1px, transparent 1px)",
          backgroundSize: "70px 70px",
        }}
      />

      {/* =================================================
          VIGNETTE
      ================================================= */}

      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_center,transparent_15%,rgba(8,9,11,.65)_100%)]
        "
      />
    </div>
  );
};

/* =========================================================
   LOGIN
========================================================= */

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();

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

  const [serverError, setServerError] = useState(location.state?.message || "");

  const [toast, setToast] = useState(null);
  const [resendTimer, setResendTimer] = useState(0);

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

  /* =====================================================
     TOAST
  ===================================================== */

  const showToast = (message, type = "error") => {
    setToast({
      message,
      type,
    });
  };

  /* =====================================================
     INVITATION
  ===================================================== */

  useEffect(() => {
    const inviteFromState = location.state?.invite;

    if (inviteFromState) {
      sessionStorage.setItem("pendingInvite", inviteFromState);
    }
  }, [location.state]);

  /* =====================================================
     TOAST TIMER
  ===================================================== */

  useEffect(() => {
    if (!toast) return;

    const timeout = setTimeout(() => {
      setToast(null);
    }, 4000);

    return () => clearTimeout(timeout);
  }, [toast]);

  /* =====================================================
     GOOGLE CALLBACK
  ===================================================== */

  useEffect(() => {
    const handleGoogleCallback = async () => {
      const params = new URLSearchParams(window.location.search);

      const token = params.get("token");
      const googleError = params.get("googleError");
      const invite = params.get("invite");

      if (invite) {
        sessionStorage.setItem("pendingInvite", invite);
      }

      if (!token) {
        if (googleError) {
          setServerError(googleError);

          window.history.replaceState({}, "", "/login");
        }

        return;
      }

      try {
        localStorage.setItem("token", token);

        window.history.replaceState({}, "", "/login");

        const response = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok && data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));

          const destination = getPostLoginPath(data.user);

          const invitationAccepted = await acceptPendingInvitation(
            sessionStorage.getItem("pendingInvite"),
            token,
          );

          navigate(invitationAccepted ? "/dashboard" : destination, {
            replace: true,
          });
        } else {
          navigate("/onboarding/welcome");
        }
      } catch (error) {
        console.error("Google authentication error:", error);

        setServerError("Unable to complete Google sign in.");
      }
    };

    handleGoogleCallback();
  }, [navigate]);

  /* =====================================================
     RESEND TIMER
  ===================================================== */

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

  const clearErrors = () => {
    setServerError("");
  };

  /* =====================================================
     LOGIN
  ===================================================== */

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
        data.token,
      );

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      const destination = getPostLoginPath(data.user);

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

  /* =====================================================
     FORGOT PASSWORD
  ===================================================== */

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

  /* =====================================================
     OTP
  ===================================================== */

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

  /* =====================================================
     RESEND OTP
  ===================================================== */

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

  /* =====================================================
     RESET PASSWORD
  ===================================================== */

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

  /* =====================================================
     NAVIGATION
  ===================================================== */

  const switchToLogin = () => {
    setServerError("");
    setTouched(false);
    setMode("login");
    setResendTimer(0);
  };

  const changeEmail = () => {
    setServerError("");

    setOtp(["", "", "", "", "", ""]);

    setMode("forgot");
  };

  /* =====================================================
     ANIMATION
  ===================================================== */

  const cardVariants = {
    initial: {
      opacity: 0,
      x: 20,
      filter: "blur(4px)",
    },

    animate: {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
    },

    exit: {
      opacity: 0,
      x: -20,
      filter: "blur(4px)",
    },
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#182A4A] text-[#E8D889]">
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <LoginBackground />

      {/* =====================================================
          TOAST
      ===================================================== */}

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
            className="
              fixed
              right-5
              top-5
              z-[100]
              w-[min(380px,calc(100vw-40px))]
            "
          >
            <div
              className={`
                flex
                items-start
                gap-3
                rounded-2xl
                border
                px-4
                py-3.5
                shadow-2xl
                backdrop-blur-xl
                ${
                  toast.type === "success"
                    ? "border-emerald-400/20 bg-[#111512]/95"
                    : "border-red-400/20 bg-[#161010]/95"
                }
              `}
            >
              <div
                className={`
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  text-sm
                  font-bold
                  ${
                    toast.type === "success"
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "bg-red-500/15 text-red-400"
                  }
                `}
              >
                {toast.type === "success" ? "✓" : "!"}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[#E8D889]">
                  {toast.type === "success"
                    ? "Success"
                    : "Something went wrong"}
                </p>

                <p className="mt-0.5 text-xs leading-5 text-[#E8D889]/50">
                  {toast.message}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setToast(null)}
                className="text-[#E8D889]/30 transition hover:text-[#E8D889]"
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
              className={`
                mt-1
                h-0.5
                rounded-full
                ${toast.type === "success" ? "bg-emerald-500" : "bg-red-500"}
              `}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================
          PAGE
      ===================================================== */}

      <div className="relative z-10 mx-auto min-h-screen max-w-[1500px]">
        {/* =================================================
            HEADER
        ================================================= */}

        <header className="relative z-20 flex items-center px-6 py-5 sm:px-10 lg:px-12">
          <Link to="/" className="group flex items-center gap-2.5">
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
              className="
    flex
    h-9
    w-9
    items-center
    justify-center
    overflow-hidden
    rounded-xl
    shadow-[0_8px_30px_rgba(255,140,43,.25)]
  "
            >
              <img
                src={logo}
                alt="Syncora"
                className="h-full w-full object-contain"
              />
            </motion.div>

            <span className="text-xl font-semibold tracking-[-0.02em] text-[#E8D889]">
              Syncora
            </span>
          </Link>
        </header>

        {/* =================================================
            MAIN
        ================================================= */}

        <div
          className="
          relative
          grid
          min-h-[calc(100vh-78px)]
          items-start
          px-6
          pb-8
          pt-2
          sm:px-10
          lg:grid-cols-2
          lg:px-12
          lg:py-4
        "
        >
          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <section className="hidden lg:block">
            <motion.div
              initial={{
                opacity: 0,
                x: -35,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
              }}
              className="
                mx-auto
                max-w-xl
                pt-[calc((100vh-78px)/2-190px)]
              "
            >
              <motion.p
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.25,
                  duration: 0.5,
                }}
                className="
                  text-sm
                  font-semibold
                  uppercase
                  tracking-[0.16em]
                  text-[#FF8C2B]
                "
              >
                Welcome back
              </motion.p>

              <h1
                className="
                mt-4
                text-6xl
                font-semibold
                leading-[0.98]
                tracking-[-0.055em]
                text-[#E8D889]
              "
              >
                Your workspace.
                <br />
                <span
                  className="
                  bg-gradient-to-r
                  from-[#FF8C2B]
                  via-[#FF8C2B]
                  to-[#B18CFF]
                  bg-clip-text
                  text-transparent
                "
                >
                  Always in sync.
                </span>
              </h1>

              <p
                className="
                mt-6
                max-w-lg
                text-base
                leading-7
                text-[#E8D889]/45
              "
              >
                Pick up where you left off. Your projects, development workflow,
                team context, and AI assistance are waiting.
              </p>

              {/* subtle status */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.5,
                }}
                className="
                  mt-8
                  flex
                  items-center
                  gap-2
                  text-xs
                  text-[#E8D889]/25
                "
              >
                <span
                  className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-emerald-400
                  shadow-[0_0_12px_rgba(52,211,153,.8)]
                "
                />
                Your engineering workspace is ready
              </motion.div>
            </motion.div>
          </section>

          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <section
            className="
            flex
            justify-center
            lg:-translate-y-8
          "
          >
            <motion.div
              initial={{
                opacity: 0,
                x: 35,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                x: 0,
                scale: 1,
              }}
              transition={{
                duration: 0.8,
                delay: 0.15,
                ease: "easeOut",
              }}
              className="w-full max-w-md"
            >
          
              {/* =================================================
                  FORM CARD
              ================================================= */}

              <div
                className="
                relative
                min-h-[520px]
                overflow-hidden
                rounded-[24px]
                border
                border-[#E8D889]/10
                bg-[#111214]/90
                p-[22px]
                shadow-[0_30px_100px_rgba(0,0,0,.45)]
                backdrop-blur-2xl
                sm:p-6
              "
              >
                {/* card glow */}

                <motion.div
                  animate={{
                    opacity: [0.4, 0.8, 0.4],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="
                    pointer-events-none
                    absolute
                    -right-24
                    -top-24
                    h-48
                    w-48
                    rounded-full
                    bg-[#FF8C2B]/10
                    blur-3xl
                  "
                />

                <motion.div
                  animate={{
                    opacity: [0.3, 0.7, 0.3],
                    scale: [1, 1.08, 1],
                  }}
                  transition={{
                    duration: 9,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="
                    pointer-events-none
                    absolute
                    -bottom-24
                    -left-24
                    h-48
                    w-48
                    rounded-full
                    bg-violet-500/10
                    blur-3xl
                  "
                />

                <AnimatePresence mode="popLayout" initial={false}>
                  {/* =================================================
                      LOGIN
                  ================================================= */}

                  {mode === "login" && (
                    <motion.div
                      key="login"
                      variants={cardVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{
                        duration: 0.3,
                        ease: "easeOut",
                      }}
                      className="relative z-10"
                    >
                      <p
                        className="
                        text-xs
                        font-semibold
                        uppercase
                        tracking-[0.14em]
                        text-[#FF8C2B]
                      "
                      >
                        Welcome back
                      </p>

                      <h2
                        className="
                        mt-2
                        text-3xl
                        font-semibold
                        tracking-[-0.04em]
                        text-[#E8D889]
                      "
                      >
                        Log in to Syncora
                      </h2>

                      <p
                        className="
                        mt-2
                        text-sm
                        leading-6
                        text-[#E8D889]/40
                      "
                      >
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
                            <p
                              className="
                              mt-4
                              rounded-xl
                              border
                              border-red-400/10
                              bg-red-500/10
                              px-4
                              py-2.5
                              text-[11px]
                              text-red-400
                            "
                            >
                              {serverError}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <form onSubmit={handleLogin} className="mt-6 space-y-3.5">
                        {/* Email */}

                        <div>
                          <label
                            className="
                            mb-1.5
                            block
                            text-xs
                            font-medium
                            text-[#E8D889]/65
                          "
                          >
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
                            className={`
                              w-full
                              rounded-xl
                              border
                              bg-[#E8D889]/[0.035]
                              px-4
                              py-3
                              text-sm
                              text-[#E8D889]
                              outline-none
                              transition-all
                              placeholder:text-[#E8D889]/20
                              focus:bg-[#E8D889]/[0.05]
                              focus:ring-4
                              focus:ring-[#FF8C2B]/10
                              ${
                                touched && !emailValid
                                  ? "border-red-400"
                                  : "border-[#E8D889]/10 focus:border-[#FF8C2B]"
                              }
                            `}
                          />

                          {touched && !emailValid && (
                            <p className="mt-1 text-[11px] text-red-400">
                              Enter a valid email address.
                            </p>
                          )}
                        </div>

                        {/* Password */}

                        <div>
                          <div
                            className="
                            mb-1.5
                            flex
                            items-center
                            justify-between
                          "
                          >
                            <label
                              className="
                              text-xs
                              font-medium
                              text-[#E8D889]/65
                            "
                            >
                              Password
                            </label>

                            <button
                              type="button"
                              onClick={() => {
                                clearErrors();
                                setTouched(false);
                                setMode("forgot");
                              }}
                              className="
                                text-[11px]
                                font-medium
                                text-[#E8D889]/35
                                transition-colors
                                hover:text-[#FF8C2B]
                              "
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
                              className={`
                                w-full
                                rounded-xl
                                border
                                bg-[#E8D889]/[0.035]
                                px-4
                                py-3
                                pr-12
                                text-sm
                                text-[#E8D889]
                                outline-none
                                transition-all
                                placeholder:text-[#E8D889]/20
                                focus:bg-[#E8D889]/[0.05]
                                focus:ring-4
                                focus:ring-[#FF8C2B]/10
                                ${
                                  touched && !passwordValid
                                    ? "border-red-400"
                                    : "border-[#E8D889]/10 focus:border-[#FF8C2B]"
                                }
                              `}
                            />

                            <button
                              type="button"
                              onClick={() => setShowPassword((prev) => !prev)}
                              className="
                                absolute
                                right-3
                                top-1/2
                                -translate-y-1/2
                                rounded-lg
                                p-1.5
                                text-[#E8D889]/35
                                transition
                                hover:bg-[#E8D889]/5
                                hover:text-[#E8D889]
                              "
                              aria-label={
                                showPassword ? "Hide password" : "Show password"
                              }
                            >
                              {showPassword ? "◉" : "◌"}
                            </button>
                          </div>

                          {touched && !passwordValid && (
                            <p className="mt-1 text-[11px] text-red-400">
                              Enter your password.
                            </p>
                          )}
                        </div>

                        {/* Login button */}

                        <motion.button
                          whileHover={
                            formValid && !loading
                              ? {
                                  y: -2,
                                  boxShadow: "0 15px 35px rgba(255,140,43,.25)",
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
                          className={`
                            mt-1
                            flex
                            w-full
                            items-center
                            justify-center
                            rounded-xl
                            px-5
                            py-3.5
                            text-sm
                            font-semibold
                            text-[#E8D889]
                            transition-all
                            ${
                              formValid && !loading
                                ? "bg-[#FF8C2B] hover:bg-[#E94B27]"
                                : "cursor-not-allowed bg-[#E8D889]/10 text-[#E8D889]/25"
                            }
                          `}
                        >
                          {loading ? (
                            <span className="flex items-center gap-2">
                              <span
                                className="
                                h-4
                                w-4
                                animate-spin
                                rounded-full
                                border-2
                                border-[#E8D889]/40
                                border-t-white
                              "
                              />
                              Signing in...
                            </span>
                          ) : (
                            "Log in →"
                          )}
                        </motion.button>
                      </form>

                      {/* Divider */}

                      <div
                        className="
                        my-5
                        flex
                        items-center
                        gap-3
                      "
                      >
                        <div className="h-px flex-1 bg-[#E8D889]/10" />

                        <span className="text-[11px] text-[#E8D889]/25">OR</span>

                        <div className="h-px flex-1 bg-[#E8D889]/10" />
                      </div>

                      {/* Google */}

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
                        className="
                          flex
                          w-full
                          items-center
                          justify-center
                          gap-3
                          rounded-xl
                          border
                          border-[#E8D889]/10
                          bg-[#E8D889]/[0.035]
                          px-4
                          py-3
                          text-sm
                          font-medium
                          text-[#E8D889]
                          transition-all
                          hover:bg-[#E8D889]/[0.07]
                          hover:shadow-lg
                        "
                      >
                        <span className="font-semibold">G</span>
                        Continue with Google
                      </motion.button>

                      {/* Signup */}

                      <p
                        className="
                        mt-5
                        border-t
                        border-[#E8D889]/10
                        pt-4
                        text-center
                        text-sm
                        text-[#E8D889]/35
                      "
                      >
                        Don't have an account?{" "}
                        <Link
                          to="/signup"
                          className="
                            font-semibold
                            text-[#FF8C2B]
                            transition-colors
                            hover:text-[#FF8C2B]
                          "
                        >
                          Create one
                        </Link>
                      </p>
                    </motion.div>
                  )}

                  {/* =================================================
                      FORGOT PASSWORD
                  ================================================= */}

                  {mode === "forgot" && (
                    <motion.div
                      key="forgot"
                      variants={cardVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{
                        duration: 0.3,
                      }}
                      className="relative z-10"
                    >
                      <button
                        type="button"
                        onClick={switchToLogin}
                        className="
                          mb-5
                          flex
                          items-center
                          gap-1.5
                          text-xs
                          font-medium
                          text-[#E8D889]/35
                          transition
                          hover:text-[#FF8C2B]
                        "
                      >
                        ← Back to login
                      </button>

                      <div
                        className="
                        mb-5
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        bg-[#FF8C2B]/10
                        text-lg
                        text-[#FF8C2B]
                      "
                      >
                        ✉
                      </div>

                      <p
                        className="
                        text-xs
                        font-semibold
                        uppercase
                        tracking-[0.14em]
                        text-[#FF8C2B]
                      "
                      >
                        Account recovery
                      </p>

                      <h2
                        className="
                        mt-2
                        text-3xl
                        font-semibold
                        tracking-[-0.04em]
                        text-[#E8D889]
                      "
                      >
                        Forgot your password?
                      </h2>

                      <p
                        className="
                        mt-2
                        text-sm
                        leading-6
                        text-[#E8D889]/40
                      "
                      >
                        Enter your email and we'll send you a secure
                        verification code.
                      </p>

                      {serverError && (
                        <p
                          className="
                          mt-4
                          rounded-xl
                          border
                          border-red-400/10
                          bg-red-500/10
                          px-4
                          py-2.5
                          text-[11px]
                          text-red-400
                        "
                        >
                          {serverError}
                        </p>
                      )}

                      <form onSubmit={handleForgotPassword} className="mt-6">
                        <label
                          className="
                          mb-1.5
                          block
                          text-xs
                          font-medium
                          text-[#E8D889]/65
                        "
                        >
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
                          className={`
                            w-full
                            rounded-xl
                            border
                            bg-[#E8D889]/[0.035]
                            px-4
                            py-3
                            text-sm
                            text-[#E8D889]
                            outline-none
                            transition-all
                            placeholder:text-[#E8D889]/20
                            focus:bg-[#E8D889]/[0.05]
                            focus:border-[#FF8C2B]
                            focus:ring-4
                            focus:ring-[#FF8C2B]/10
                            ${
                              touched && !emailValid
                                ? "border-red-400"
                                : "border-[#E8D889]/10"
                            }
                          `}
                        />

                        {touched && !emailValid && (
                          <p className="mt-1 text-[11px] text-red-400">
                            Enter a valid email address.
                          </p>
                        )}

                        <motion.button
                          whileHover={
                            emailValid && !loading
                              ? {
                                  y: -2,
                                  boxShadow: "0 15px 35px rgba(255,140,43,.25)",
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
                          className={`
                            mt-5
                            flex
                            w-full
                            items-center
                            justify-center
                            rounded-xl
                            px-5
                            py-3.5
                            text-sm
                            font-semibold
                            text-[#E8D889]
                            transition-all
                            ${
                              emailValid && !loading
                                ? "bg-[#FF8C2B] hover:bg-[#E94B27]"
                                : "cursor-not-allowed bg-[#E8D889]/10 text-[#E8D889]/25"
                            }
                          `}
                        >
                          {loading ? (
                            <span className="flex items-center gap-2">
                              <span
                                className="
                                h-4
                                w-4
                                animate-spin
                                rounded-full
                                border-2
                                border-[#E8D889]/40
                                border-t-white
                              "
                              />
                              Sending code...
                            </span>
                          ) : (
                            "Send verification code →"
                          )}
                        </motion.button>
                      </form>

                      <p
                        className="
                        mt-5
                        text-center
                        text-xs
                        leading-5
                        text-[#E8D889]/25
                      "
                      >
                        For your security, we'll only send a code if an account
                        exists with this email.
                      </p>
                    </motion.div>
                  )}

                  {/* =================================================
                      OTP
                  ================================================= */}

                  {mode === "otp" && (
                    <motion.div
                      key="otp"
                      variants={cardVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{
                        duration: 0.3,
                      }}
                      className="relative z-10"
                    >
                      <button
                        type="button"
                        onClick={changeEmail}
                        className="
                          mb-5
                          flex
                          items-center
                          gap-1.5
                          text-xs
                          font-medium
                          text-[#E8D889]/35
                          transition
                          hover:text-[#FF8C2B]
                        "
                      >
                        ← Change email
                      </button>

                      <div
                        className="
                        mb-5
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        bg-[#FF8C2B]/10
                        text-lg
                        text-[#FF8C2B]
                      "
                      >
                        ✦
                      </div>

                      <p
                        className="
                        text-xs
                        font-semibold
                        uppercase
                        tracking-[0.14em]
                        text-[#FF8C2B]
                      "
                      >
                        Verify your email
                      </p>

                      <h2
                        className="
                        mt-2
                        text-3xl
                        font-semibold
                        tracking-[-0.04em]
                        text-[#E8D889]
                      "
                      >
                        Enter your code
                      </h2>

                      <p
                        className="
                        mt-2
                        text-sm
                        leading-6
                        text-[#E8D889]/40
                      "
                      >
                        Enter the 6-digit code we sent to{" "}
                        <span className="font-medium text-[#E8D889]/70">
                          {email}
                        </span>
                        .
                      </p>

                      {serverError && (
                        <p
                          className="
                          mt-4
                          rounded-xl
                          border
                          border-red-400/10
                          bg-red-500/10
                          px-4
                          py-2.5
                          text-[11px]
                          text-red-400
                        "
                        >
                          {serverError}
                        </p>
                      )}

                      <form onSubmit={handleVerifyOtp} className="mt-7">
                        <div
                          className="
                            flex
                            justify-between
                            gap-2
                          "
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
                              className={`
                                  h-12
                                  w-full
                                  rounded-xl
                                  border
                                  bg-[#E8D889]/[0.035]
                                  text-center
                                  text-lg
                                  font-semibold
                                  text-[#E8D889]
                                  outline-none
                                  transition-all
                                  focus:border-[#FF8C2B]
                                  focus:bg-[#E8D889]/[0.05]
                                  focus:ring-4
                                  focus:ring-[#FF8C2B]/10
                                  ${
                                    serverError
                                      ? "border-red-400/40"
                                      : "border-[#E8D889]/10"
                                  }
                                `}
                            />
                          ))}
                        </div>

                        <motion.button
                          whileHover={
                            otpValid && !loading
                              ? {
                                  y: -2,
                                  boxShadow: "0 15px 35px rgba(255,140,43,.25)",
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
                          className={`
                            mt-5
                            flex
                            w-full
                            items-center
                            justify-center
                            rounded-xl
                            px-5
                            py-3.5
                            text-sm
                            font-semibold
                            text-[#E8D889]
                            transition-all
                            ${
                              otpValid && !loading
                                ? "bg-[#FF8C2B] hover:bg-[#E94B27]"
                                : "cursor-not-allowed bg-[#E8D889]/10 text-[#E8D889]/25"
                            }
                          `}
                        >
                          {loading ? (
                            <span className="flex items-center gap-2">
                              <span
                                className="
                                h-4
                                w-4
                                animate-spin
                                rounded-full
                                border-2
                                border-[#E8D889]/40
                                border-t-white
                              "
                              />
                              Verifying...
                            </span>
                          ) : (
                            "Verify code →"
                          )}
                        </motion.button>
                      </form>

                      <div className="mt-5 text-center">
                        <p className="text-xs text-[#E8D889]/30">
                          Didn't receive the code?
                        </p>

                        <button
                          type="button"
                          disabled={resendTimer > 0 || loading}
                          onClick={handleResendOtp}
                          className={`
                            mt-1
                            text-xs
                            font-semibold
                            ${
                              resendTimer > 0
                                ? "text-[#E8D889]/20"
                                : "text-[#FF8C2B] hover:text-[#FF8C2B]"
                            }
                          `}
                        >
                          {resendTimer > 0
                            ? `Resend in ${resendTimer}s`
                            : "Resend code"}
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* =================================================
                      RESET
                  ================================================= */}

                  {mode === "reset" && (
                    <motion.div
                      key="reset"
                      variants={cardVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{
                        duration: 0.3,
                      }}
                      className="relative z-10"
                    >
                      <p
                        className="
                        text-xs
                        font-semibold
                        uppercase
                        tracking-[0.14em]
                        text-[#FF8C2B]
                      "
                      >
                        Almost there
                      </p>

                      <h2
                        className="
                        mt-2
                        text-3xl
                        font-semibold
                        tracking-[-0.04em]
                        text-[#E8D889]
                      "
                      >
                        Create a new password
                      </h2>

                      <p
                        className="
                        mt-2
                        text-sm
                        leading-6
                        text-[#E8D889]/40
                      "
                      >
                        Choose a strong password you haven't used before.
                      </p>

                      {serverError && (
                        <p
                          className="
                          mt-4
                          rounded-xl
                          border
                          border-red-400/10
                          bg-red-500/10
                          px-4
                          py-2.5
                          text-[11px]
                          text-red-400
                        "
                        >
                          {serverError}
                        </p>
                      )}

                      <form
                        onSubmit={handleResetPassword}
                        className="mt-6 space-y-4"
                      >
                        {/* New password */}

                        <div>
                          <label
                            className="
                            mb-1.5
                            block
                            text-xs
                            font-medium
                            text-[#E8D889]/65
                          "
                          >
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
                              className={`
                                w-full
                                rounded-xl
                                border
                                bg-[#E8D889]/[0.035]
                                px-4
                                py-3
                                pr-12
                                text-sm
                                text-[#E8D889]
                                outline-none
                                transition-all
                                placeholder:text-[#E8D889]/20
                                focus:bg-[#E8D889]/[0.05]
                                focus:ring-4
                                focus:ring-[#FF8C2B]/10
                                ${
                                  newPassword.length > 0 && !newPasswordValid
                                    ? "border-red-400"
                                    : "border-[#E8D889]/10 focus:border-[#FF8C2B]"
                                }
                              `}
                            />

                            <button
                              type="button"
                              onClick={() =>
                                setShowNewPassword((prev) => !prev)
                              }
                              className="
                                absolute
                                right-3
                                top-1/2
                                -translate-y-1/2
                                rounded-lg
                                p-1.5
                                text-[#E8D889]/35
                                hover:bg-[#E8D889]/5
                              "
                            >
                              {showNewPassword ? "◉" : "◌"}
                            </button>
                          </div>

                          <p
                            className={`
                              mt-1.5
                              text-[11px]
                              ${
                                newPassword.length > 0 && !newPasswordValid
                                  ? "text-red-400"
                                  : "text-[#E8D889]/25"
                              }
                            `}
                          >
                            At least 8 characters with uppercase, lowercase,
                            number, and special character.
                          </p>
                        </div>

                        {/* Confirm */}

                        <div>
                          <label
                            className="
                            mb-1.5
                            block
                            text-xs
                            font-medium
                            text-[#E8D889]/65
                          "
                          >
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
                              className={`
                                w-full
                                rounded-xl
                                border
                                bg-[#E8D889]/[0.035]
                                px-4
                                py-3
                                pr-12
                                text-sm
                                text-[#E8D889]
                                outline-none
                                transition-all
                                placeholder:text-[#E8D889]/20
                                focus:bg-[#E8D889]/[0.05]
                                focus:ring-4
                                focus:ring-[#FF8C2B]/10
                                ${
                                  confirmPassword.length > 0 &&
                                  !confirmPasswordValid
                                    ? "border-red-400"
                                    : "border-[#E8D889]/10 focus:border-[#FF8C2B]"
                                }
                              `}
                            />

                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword((prev) => !prev)
                              }
                              className="
                                absolute
                                right-3
                                top-1/2
                                -translate-y-1/2
                                rounded-lg
                                p-1.5
                                text-[#E8D889]/35
                                hover:bg-[#E8D889]/5
                              "
                            >
                              {showConfirmPassword ? "◉" : "◌"}
                            </button>
                          </div>

                          {confirmPassword.length > 0 &&
                            !confirmPasswordValid && (
                              <p className="mt-1.5 text-[11px] text-red-400">
                                Passwords don't match.
                              </p>
                            )}
                        </div>

                        <motion.button
                          whileHover={
                            resetValid && !loading
                              ? {
                                  y: -2,
                                  boxShadow: "0 15px 35px rgba(255,140,43,.25)",
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
                          className={`
                            flex
                            w-full
                            items-center
                            justify-center
                            rounded-xl
                            px-5
                            py-3.5
                            text-sm
                            font-semibold
                            text-[#E8D889]
                            transition-all
                            ${
                              resetValid && !loading
                                ? "bg-[#FF8C2B] hover:bg-[#E94B27]"
                                : "cursor-not-allowed bg-[#E8D889]/10 text-[#E8D889]/25"
                            }
                          `}
                        >
                          {loading ? (
                            <span className="flex items-center gap-2">
                              <span
                                className="
                                h-4
                                w-4
                                animate-spin
                                rounded-full
                                border-2
                                border-[#E8D889]/40
                                border-t-white
                              "
                              />
                              Updating password...
                            </span>
                          ) : (
                            "Reset password →"
                          )}
                        </motion.button>
                      </form>
                    </motion.div>
                  )}

                  {/* =================================================
                      SUCCESS
                  ================================================= */}

                  {mode === "success" && (
                    <motion.div
                      key="success"
                      variants={cardVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{
                        duration: 0.3,
                      }}
                      className="
                        relative
                        z-10
                        flex
                        min-h-[470px]
                        flex-col
                        items-center
                        justify-center
                        text-center
                      "
                    >
                      <motion.div
                        initial={{
                          scale: 0,
                          opacity: 0,
                          rotate: -20,
                        }}
                        animate={{
                          scale: 1,
                          opacity: 1,
                          rotate: 0,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 18,
                        }}
                        className="
                          flex
                          h-16
                          w-16
                          items-center
                          justify-center
                          rounded-2xl
                          bg-emerald-500/10
                          text-2xl
                          text-emerald-400
                          shadow-[0_0_40px_rgba(52,211,153,.1)]
                        "
                      >
                        ✓
                      </motion.div>

                      <h2
                        className="
                        mt-6
                        text-3xl
                        font-semibold
                        tracking-[-0.04em]
                        text-[#E8D889]
                      "
                      >
                        Password updated
                      </h2>

                      <p
                        className="
                        mt-3
                        max-w-xs
                        text-sm
                        leading-6
                        text-[#E8D889]/40
                      "
                      >
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
                        className="
                          mt-7
                          rounded-xl
                          bg-[#FF8C2B]
                          px-6
                          py-3.5
                          text-sm
                          font-semibold
                          text-[#E8D889]
                          shadow-[0_10px_30px_rgba(255,140,43,.2)]
                          transition
                          hover:bg-[#E94B27]
                        "
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
