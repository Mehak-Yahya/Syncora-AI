import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* -------------------------------------------------------
   API
------------------------------------------------------- */

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

/* -------------------------------------------------------
   Icons
------------------------------------------------------- */

const MailIcon = ({ size = 17 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

const UsersIcon = ({ size = 17 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const ArrowRightIcon = ({ size = 15 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

const ArrowLeftIcon = ({ size = 15 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 12H5" />
    <path d="m11 18-6-6 6-6" />
  </svg>
);

const XIcon = ({ size = 14 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 6l12 12" />
    <path d="M18 6 6 18" />
  </svg>
);

/* -------------------------------------------------------
   Animation presets
------------------------------------------------------- */

const pageTransition = {
  hidden: {
    opacity: 0,
    y: 18,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const itemTransition = {
  hidden: {
    opacity: 0,
    y: 12,
  },

  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay,
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

/* -------------------------------------------------------
   Component
------------------------------------------------------- */

const InviteTeam = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  /* -------------------------------------------------------
     Protect onboarding route
  ------------------------------------------------------- */

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);

        if (
          user.onboardingCompleted === true &&
          localStorage.getItem("creatingAdditionalWorkspace") !== "1"
        ) {
          navigate("/dashboard", { replace: true });
        }
      } catch (error) {
        console.error("Unable to read stored user:", error);
      }
    }
  }, [navigate]);

  /* -------------------------------------------------------
     Add teammate
  ------------------------------------------------------- */

  const handleAddInvite = () => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      setEmailError("Enter a teammate email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setEmailError("Enter a valid email address.");
      return;
    }

    if (invites.includes(trimmedEmail)) {
      setEmailError("This teammate has already been added.");
      return;
    }

    setInvites((prev) => [...prev, trimmedEmail]);
    setEmail("");
    setEmailError("");
  };

  /* -------------------------------------------------------
     Remove teammate
  ------------------------------------------------------- */

  const handleRemoveInvite = (emailToRemove) => {
    setInvites((prev) =>
      prev.filter((invite) => invite !== emailToRemove)
    );
  };

  /* -------------------------------------------------------
     Finish onboarding
  ------------------------------------------------------- */

  const handleComplete = async () => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/login", { replace: true });
      return;
    }

    setLoading(true);
    setEmailError("");

    try {
      const user = JSON.parse(storedUser);

      const response = await fetch(
        `${API_URL}/api/auth/onboarding/complete`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            workspace: JSON.parse(
              localStorage.getItem("onboardingWorkspace") || "{}"
            ),

            invites,

            createNewWorkspace:
              localStorage.getItem("creatingAdditionalWorkspace") === "1",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to complete onboarding."
        );
      }

      const profileData =
        localStorage.getItem("onboardingProfile");

      const workspaceData =
        localStorage.getItem("onboardingWorkspace");

      /* -----------------------------------------------------
         Update local user
      ----------------------------------------------------- */

      const updatedUser = {
        ...user,
        ...data.user,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      /* -----------------------------------------------------
         Save onboarding invites
      ----------------------------------------------------- */

      localStorage.setItem(
        "onboardingInvites",
        JSON.stringify(invites)
      );

      localStorage.removeItem(
        "creatingAdditionalWorkspace"
      );

      if (profileData) {
        localStorage.setItem(
          "completedProfile",
          profileData
        );
      }

      if (workspaceData) {
        localStorage.setItem(
          "completedWorkspace",
          workspaceData
        );
      }

      await new Promise((resolve) =>
        setTimeout(resolve, 350)
      );

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Unable to complete onboarding:",
        error
      );

      setEmailError(
        error.message ||
          "Unable to complete onboarding. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------------
     Render
  ------------------------------------------------------- */

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#151D2B] px-4 py-5 text-[#F5F0E8] sm:px-6 lg:px-8">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        {/* Central orange glow */}

        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            left-1/2
            top-[32%]
            h-[520px]
            w-[520px]
            -translate-x-1/2
            rounded-full
            bg-[#7AA6FF]/10
            blur-[140px]
          "
        />

        {/* Blue ambient glow */}

        <motion.div
          animate={{
            x: [-70, 90, -70],
            y: [20, -30, 20],
            opacity: [0.03, 0.075, 0.03],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            right-[5%]
            top-[18%]
            h-[300px]
            w-[300px]
            rounded-full
            bg-[#5965FF]
            blur-[120px]
          "
        />

        {/* Bottom glow */}

        <motion.div
          animate={{
            x: [0, -50, 0],
            opacity: [0.025, 0.06, 0.025],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            bottom-[-180px]
            left-[20%]
            h-[400px]
            w-[400px]
            rounded-full
            bg-[#7AA6FF]
            blur-[130px]
          "
        />

        {/* Grid */}

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(245,240,232,0.7) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(245,240,232,0.7) 1px,
                transparent 1px
              )
            `,
            backgroundSize: "56px 56px",
          }}
        />

        {/* Fade */}

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#151D2B]/20 to-[#151D2B]" />

        {/* Vignette */}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#151D2B_92%)]" />
      </div>

      {/* =====================================================
          DECORATIVE ICONS
      ===================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.8,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: [0, -5, 0],
        }}
        transition={{
          opacity: {
            duration: 0.7,
            delay: 0.5,
          },
          scale: {
            duration: 0.7,
            delay: 0.5,
          },
          y: {
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
        className="
          pointer-events-none
          absolute
          left-[6%]
          top-[27%]
          hidden
          lg:block
        "
      >
        <div
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-2xl
            border
            border-[#F5F0E8]/[0.08]
            bg-[#F5F0E8]/[0.025]
            text-[#7AA6FF]
            shadow-[0_20px_60px_rgba(0,0,0,0.3)]
          "
        >
          <UsersIcon size={17} />
        </div>
      </motion.div>

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.8,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: [0, 5, 0],
        }}
        transition={{
          opacity: {
            duration: 0.7,
            delay: 0.65,
          },
          scale: {
            duration: 0.7,
            delay: 0.65,
          },
          y: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
        className="
          pointer-events-none
          absolute
          right-[7%]
          top-[22%]
          hidden
          lg:block
        "
      >
        <div
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-2xl
            border
            border-[#F5F0E8]/[0.08]
            bg-[#F5F0E8]/[0.025]
            text-[#7AA6FF]
            shadow-[0_20px_60px_rgba(0,0,0,0.3)]
          "
        >
          <MailIcon size={17} />
        </div>
      </motion.div>

      {/* =====================================================
          PAGE
      ===================================================== */}

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-40px)] w-full max-w-4xl items-center justify-center">

        <motion.div
          variants={pageTransition}
          initial="hidden"
          animate="visible"
          className="w-full"
        >

          {/* =================================================
              HEADER
          ================================================= */}

          <header className="mb-5 flex items-center justify-between">

            <motion.div
              initial={{
                opacity: 0,
                x: -10,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.5,
                delay: 0.15,
              }}
              className="flex items-center gap-2.5"
            >
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-[#F5F0E8]/[0.09]
                  bg-[#F5F0E8]/[0.045]
                  shadow-lg
                "
              >
                <span className="text-sm font-bold text-[#7AA6FF]">
                  S
                </span>
              </div>

              <div>
                <p className="text-sm font-semibold tracking-[-0.02em] text-[#F5F0E8]">
                  Syncora
                </p>

                <p className="text-[8px] font-medium uppercase tracking-[0.18em] text-[#737C89]">
                  Engineering workspace
                </p>
              </div>
            </motion.div>

            <motion.span
              initial={{
                opacity: 0,
                x: 10,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.5,
                delay: 0.2,
              }}
              className="text-[10px] font-medium text-[#737C89]"
            >
              Step 3 of 3
            </motion.span>
          </header>

          {/* =================================================
              PROGRESS
          ================================================= */}

          <div className="relative mt-6 h-1 overflow-hidden rounded-full bg-[#F5F0E8]/[0.07]">

            <motion.div
              initial={{
                width: 0,
              }}
              animate={{
                width: "100%",
              }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                relative
                h-full
                rounded-full
                bg-[#7AA6FF]
                shadow-[0_0_12px_rgba(122,166,255,0.45)]
              "
            >
              <motion.div
                animate={{
                  x: ["-100%", "300%"],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "linear",
                  repeatDelay: 1.5,
                }}
                className="
                  absolute
                  inset-y-0
                  w-20
                  bg-gradient-to-r
                  from-transparent
                  via-white/30
                  to-transparent
                "
              />
            </motion.div>
          </div>

          {/* =================================================
              MAIN CARD
          ================================================= */}

          <motion.section
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              relative
              mt-7
              overflow-hidden
              rounded-[24px]
              border
              border-[#F5F0E8]/[0.085]
              bg-[#0C0F14]
              shadow-[0_30px_90px_rgba(0,0,0,0.45)]
            "
          >

            {/* Top highlight */}

            <motion.div
              animate={{
                opacity: [0.25, 0.7, 0.25],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="
                pointer-events-none
                absolute
                left-[10%]
                right-[10%]
                top-0
                h-px
                bg-gradient-to-r
                from-transparent
                via-[#7AA6FF]
                to-transparent
              "
            />

            {/* Inner glow */}

            <div
              className="
                pointer-events-none
                absolute
                -right-24
                -top-24
                h-64
                w-64
                rounded-full
                bg-[#7AA6FF]/[0.035]
                blur-[80px]
              "
            />

            <div className="relative p-5 sm:p-8 lg:p-9">

              {/* =================================================
                  INTRO
              ================================================= */}

              <motion.div
                variants={itemTransition}
                initial="hidden"
                animate="visible"
                custom={0.25}
              >
                <div className="flex items-center gap-2">

                  <span
                    className="
                      flex
                      h-6
                      w-6
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      bg-[#7AA6FF]/10
                      text-[#7AA6FF]
                    "
                  >
                    <UsersIcon size={13} />
                  </span>

                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7AA6FF]">
                    Your team
                  </span>
                </div>

                <h1
                  className="
                    mt-3
                    text-[30px]
                    font-semibold
                    leading-[1.08]
                    tracking-[-0.045em]
                    text-[#F5F0E8]
                    sm:text-[38px]
                  "
                >
                  Invite your teammates.
                </h1>

                <p
                  className="
                    mt-2.5
                    max-w-xl
                    text-[11px]
                    leading-5
                    text-[#9AA3B0]
                    sm:text-xs
                  "
                >
                  Syncora works better when your engineering team
                  is connected. Invite teammates now or skip this
                  step and invite them later.
                </p>
              </motion.div>

              {/* =================================================
                  EMAIL INPUT + ADD BUTTON
              ================================================= */}

              <motion.div
                variants={itemTransition}
                initial="hidden"
                animate="visible"
                custom={0.38}
                className="mt-7"
              >

                {/* Label */}

                <div className="mb-2 flex h-5 items-center gap-2">

                  <span className="flex h-5 w-5 shrink-0 items-center justify-center text-[#8D96A3]">
                    <MailIcon size={14} />
                  </span>

                  <label
                    htmlFor="teammate-email"
                    className="
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.08em]
                      text-[#A3ABB7]
                    "
                  >
                    Teammate email
                  </label>

                </div>

                {/* Input + Button SAME ROW */}

                <div className="flex w-full items-center gap-2">

                  <input
                    id="teammate-email"
                    type="email"
                    value={email}
                    placeholder="name@company.com"
                    onChange={(e) => {
                      setEmail(e.target.value);

                      if (emailError) {
                        setEmailError("");
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddInvite();
                      }
                    }}
                    className="
                      h-11
                      min-w-0
                      flex-1
                      rounded-xl
                      border
                      border-[#F5F0E8]/[0.09]
                      bg-[#F5F0E8]/[0.025]
                      px-4
                      text-xs
                      text-[#F5F0E8]
                      placeholder:text-[#4F5865]
                      outline-none
                      transition-all
                      duration-200
                      hover:border-[#F5F0E8]/[0.16]
                      hover:bg-[#F5F0E8]/[0.035]
                      focus:border-[#7AA6FF]/60
                      focus:bg-[#7AA6FF]/[0.025]
                      focus:ring-4
                      focus:ring-[#7AA6FF]/[0.06]
                    "
                  />

                  <motion.button
                    whileHover={{
                      y: -1,
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                    type="button"
                    onClick={handleAddInvite}
                    disabled={loading}
                    className="
                      h-11
                      shrink-0
                      rounded-xl
                      bg-[#7AA6FF]
                      px-4
                      text-[12px]
                      font-semibold
                      text-[#F5F0E8]
                      shadow-[0_8px_24px_rgba(122,166,255,0.16)]
                      transition-all
                      duration-200
                      hover:bg-[#7AA6FF]
                      hover:shadow-[0_12px_30px_rgba(122,166,255,0.24)]
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                      sm:px-5
                    "
                  >
                    Add teammate
                  </motion.button>

                </div>

                {/* Error / hint */}

                <AnimatePresence mode="wait">
                  {emailError ? (
                    <motion.p
                      key="error"
                      initial={{
                        opacity: 0,
                        y: -4,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: -4,
                      }}
                      className="mt-2 text-[9px] text-red-400"
                    >
                      {emailError}
                    </motion.p>
                  ) : (
                    <motion.p
                      key="hint"
                      initial={{
                        opacity: 0,
                      }}
                      animate={{
                        opacity: 1,
                      }}
                      className="mt-1.5 text-[10px] text-[#747E8C]"
                    >
                      Press Enter or click Add teammate to add an invitation.
                    </motion.p>
                  )}
                </AnimatePresence>

              </motion.div>

              {/* =================================================
                  ADDED TEAMMATES
              ================================================= */}

              <AnimatePresence>
                {invites.length > 0 && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      height: 0,
                      y: 8,
                    }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      height: 0,
                      y: -5,
                    }}
                    transition={{
                      duration: 0.35,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="mt-5 overflow-hidden"
                  >

                    <div
                      className="
                        rounded-2xl
                        border
                        border-[#F5F0E8]/[0.06]
                        bg-[#F5F0E8]/[0.018]
                        p-3.5
                      "
                    >

                      <div className="flex items-center justify-between">

                        <div className="flex items-center gap-2">

                          <span
                            className="
                              flex
                              h-6
                              w-6
                              shrink-0
                              items-center
                              justify-center
                              rounded-lg
                              bg-[#7AA6FF]/10
                              text-[#7AA6FF]
                            "
                          >
                            <UsersIcon size={12} />
                          </span>

                          <p className="text-[11px] font-semibold text-[#A3ABB7]">
                            Invitations
                          </p>

                        </div>

                        <span
                          className="
                            rounded-full
                            bg-[#F5F0E8]/[0.05]
                            px-2
                            py-1
                            text-[10px]
                            font-medium
                            text-[#747E8C]
                          "
                        >
                          {invites.length}{" "}
                          {invites.length === 1
                            ? "teammate"
                            : "teammates"}
                        </span>

                      </div>

                      <div className="mt-3 space-y-2">

                        <AnimatePresence initial={false}>
                          {invites.map((invite) => (
                            <motion.div
                              key={invite}
                              initial={{
                                opacity: 0,
                                x: -10,
                                scale: 0.98,
                              }}
                              animate={{
                                opacity: 1,
                                x: 0,
                                scale: 1,
                              }}
                              exit={{
                                opacity: 0,
                                x: 10,
                                scale: 0.98,
                              }}
                              transition={{
                                duration: 0.25,
                              }}
                              className="
                                flex
                                min-h-[44px]
                                items-center
                                justify-between
                                rounded-xl
                                border
                                border-[#F5F0E8]/[0.07]
                                bg-[#F5F0E8]/[0.025]
                                px-3
                                py-2
                              "
                            >

                              <div className="flex min-w-0 items-center gap-2.5">

                                <div
                                  className="
                                    flex
                                    h-7
                                    w-7
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-[#7AA6FF]/10
                                    text-[#7AA6FF]
                                  "
                                >
                                  <MailIcon size={12} />
                                </div>

                                <span className="truncate text-[10px] text-[#A3ABB7]">
                                  {invite}
                                </span>

                              </div>

                              <motion.button
                                whileHover={{
                                  scale: 1.08,
                                }}
                                whileTap={{
                                  scale: 0.9,
                                }}
                                type="button"
                                onClick={() =>
                                  handleRemoveInvite(invite)
                                }
                                className="
                                  ml-3
                                  flex
                                  h-7
                                  w-7
                                  shrink-0
                                  items-center
                                  justify-center
                                  rounded-lg
                                  text-[#68717D]
                                  transition-colors
                                  duration-200
                                  hover:bg-red-500/10
                                  hover:text-red-400
                                "
                                aria-label={`Remove ${invite}`}
                              >
                                <XIcon size={13} />
                              </motion.button>

                            </motion.div>
                          ))}
                        </AnimatePresence>

                      </div>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>

              {/* =================================================
                  INFO
              ================================================= */}

              <motion.div
                variants={itemTransition}
                initial="hidden"
                animate="visible"
                custom={0.5}
                className="
                  mt-5
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-[#F5F0E8]/[0.05]
                  bg-[#F5F0E8]/[0.015]
                  px-3
                  py-2.5
                "
              >
                <span
                  className="
                    h-1.5
                    w-1.5
                    shrink-0
                    rounded-full
                    bg-[#7AA6FF]
                    shadow-[0_0_8px_rgba(122,166,255,0.7)]
                  "
                />

                <p className="text-[10px] leading-4 text-[#747E8C]">
                  Invitations can be managed anytime from your
                  workspace settings.
                </p>
              </motion.div>

              {/* =================================================
                  ACTIONS
              ================================================= */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.65,
                  duration: 0.45,
                }}
                className="
                  mt-7
                  flex
                  flex-col-reverse
                  gap-3
                  border-t
                  border-[#F5F0E8]/[0.06]
                  pt-5
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >

                {/* Back */}

                <motion.button
                  whileHover={{
                    x: -2,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  type="button"
                  onClick={() =>
                    navigate("/onboarding/workspace")
                  }
                  disabled={loading}
                  className="
                    group
                    flex
                    items-center
                    gap-2
                    self-start
                    rounded-xl
                    px-2
                    py-2
                    text-[10px]
                    font-medium
                    text-[#7D8795]
                    transition-colors
                    duration-200
                    hover:text-[#F5F0E8]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  <ArrowLeftIcon size={13} />
                  <span>Back</span>
                </motion.button>

                {/* Finish actions */}

                <div className="flex items-center justify-between gap-3 sm:justify-end">

                  {/* Skip */}

                  <motion.button
                    whileHover={{
                      y: -1,
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                    type="button"
                    onClick={handleComplete}
                    disabled={loading}
                    className="
                      rounded-xl
                      px-3
                      py-3
                      text-[11px]
                      font-medium
                      text-[#7D8795]
                      transition-all
                      duration-200
                      hover:bg-[#F5F0E8]/[0.035]
                      hover:text-[#F5F0E8]
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    Skip for now
                  </motion.button>

                  {/* Finish */}

                  <motion.button
                    whileHover={{
                      y: -2,
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                    type="button"
                    onClick={handleComplete}
                    disabled={loading}
                    className="
                      group
                      relative
                      overflow-hidden
                      rounded-xl
                      bg-[#7AA6FF]
                      px-5
                      py-3
                      text-[12px]
                      font-semibold
                      text-[#F5F0E8]
                      shadow-[0_10px_30px_rgba(122,166,255,0.18)]
                      transition-all
                      duration-200
                      hover:bg-[#7AA6FF]
                      hover:shadow-[0_14px_40px_rgba(122,166,255,0.28)]
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >

                    <span
                      className="
                        pointer-events-none
                        absolute
                        inset-0
                        -translate-x-full
                        bg-gradient-to-r
                        from-transparent
                        via-white/20
                        to-transparent
                        transition-transform
                        duration-700
                        group-hover:translate-x-full
                      "
                    />

                    <span className="relative z-10 flex items-center gap-2">

                      {loading
                        ? "Setting up..."
                        : "Finish setup"}

                      {!loading && (
                        <span className="transition-transform duration-200 group-hover:translate-x-1">
                          <ArrowRightIcon size={13} />
                        </span>
                      )}

                    </span>
                  </motion.button>

                </div>
              </motion.div>

            </div>
          </motion.section>

          {/* =================================================
              FOOTER
          ================================================= */}

          <motion.p
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 0.9,
              duration: 0.5,
            }}
            className="mt-4 text-center text-[9px] text-[#59616D]"
          >
            You can invite and manage teammates anytime from
            your workspace.
          </motion.p>

        </motion.div>
      </div>
    </main>
  );
};

export default InviteTeam;