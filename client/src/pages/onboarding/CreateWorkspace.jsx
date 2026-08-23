import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* -------------------------------------------------------
   Icons
------------------------------------------------------- */

const LockIcon = ({ size = 18 }) => (
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
    <rect x="4" y="10" width="16" height="11" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
);

const UsersIcon = ({ size = 18 }) => (
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

const SparkIcon = ({ size = 15 }) => (
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
    <path d="m12 3-1.5 5.5L5 10l5.5 1.5L12 17l1.5-5.5L19 10l-5.5-1.5L12 3Z" />
    <path d="m19 16-.7 2.3L16 19l2.3.7L19 22l.7-2.3L22 19l-2.3-.7L19 16Z" />
  </svg>
);

const CheckIcon = ({ size = 14 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m5 12 4 4L19 6" />
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

const formItem = {
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

const CreateWorkspace = ({ existingUser = false }) => {
  const navigate = useNavigate();

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

  const isExistingWorkspaceSetup =
    existingUser ||
    new URLSearchParams(window.location.search).get("recreate") === "1";

  const [formData, setFormData] = useState({
    workspaceName: "",
    workspaceSlug: "",
    description: "",
    visibility: "private",
  });

  const [creatingWorkspace, setCreatingWorkspace] = useState(false);
  const [workspaceError, setWorkspaceError] = useState("");

  /* -------------------------------------------------------
     Authentication / onboarding guard
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
          user.workspace &&
          !isExistingWorkspaceSetup
        ) {
          navigate("/dashboard", { replace: true });
        }
      } catch (error) {
        console.error("Unable to read user data:", error);
      }
    }
  }, [navigate, isExistingWorkspaceSetup]);

  /* -------------------------------------------------------
     Form handlers
  ------------------------------------------------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (workspaceError) {
      setWorkspaceError("");
    }
  };

  const handleWorkspaceNameChange = (e) => {
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      workspaceName: value,
      workspaceSlug: value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, ""),
    }));

    if (workspaceError) {
      setWorkspaceError("");
    }
  };

  /* -------------------------------------------------------
     Submit
  ------------------------------------------------------- */

  const handleContinue = async (e) => {
    e.preventDefault();

    if (!formData.workspaceName.trim()) {
      return;
    }

    if (!formData.workspaceSlug.trim()) {
      setWorkspaceError("Please enter a workspace URL.");
      return;
    }

    /* -----------------------------------------------------
       Existing user / additional workspace
    ----------------------------------------------------- */

    if (isExistingWorkspaceSetup) {
      const token = localStorage.getItem("token");

      setCreatingWorkspace(true);
      setWorkspaceError("");

      try {
        const response = await fetch(
          `${API_URL}/api/auth/workspace`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: formData.workspaceName,
              slug: formData.workspaceSlug,
              description: formData.description,
              visibility: formData.visibility,
            }),
          }
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to create workspace."
          );
        }

        const storedUser = localStorage.getItem("user");

        const currentUser = storedUser
          ? JSON.parse(storedUser)
          : {};

        localStorage.setItem(
          "user",
          JSON.stringify({
            ...currentUser,
            ...(data.user || {}),
          })
        );

        localStorage.removeItem("creatingAdditionalWorkspace");

        navigate("/dashboard", {
          replace: true,
        });
      } catch (error) {
        setWorkspaceError(
          error.message || "Unable to create workspace."
        );
      } finally {
        setCreatingWorkspace(false);
      }

      return;
    }

    /* -----------------------------------------------------
       Store temporary onboarding data
    ----------------------------------------------------- */

    localStorage.setItem(
      "onboardingWorkspace",
      JSON.stringify(formData)
    );

    localStorage.removeItem("creatingAdditionalWorkspace");

    navigate("/onboarding/invite");
  };

  /* -------------------------------------------------------
     Visibility options
  ------------------------------------------------------- */

  const visibilityOptions = [
    {
      value: "private",
      title: "Private",
      description:
        "Only invited members can access this workspace.",
      icon: <LockIcon size={17} />,
    },
    {
      value: "team",
      title: "Team",
      description:
        "Everyone in your organization can discover it.",
      icon: <UsersIcon size={17} />,
    },
  ];

  /* -------------------------------------------------------
     Render
  ------------------------------------------------------- */

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07090D] px-4 py-5 text-white sm:px-6 lg:px-8">
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* Central orange spotlight */}

        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.16, 0.27, 0.16],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            left-1/2
            top-[35%]
            h-[520px]
            w-[520px]
            -translate-x-1/2
            rounded-full
            bg-[#FF5C35]/10
            blur-[140px]
          "
        />

        {/* Blue moving light */}

        <motion.div
          animate={{
            x: [-80, 100, -80],
            y: [20, -40, 20],
            opacity: [0.035, 0.08, 0.035],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            right-[5%]
            top-[20%]
            h-[300px]
            w-[300px]
            rounded-full
            bg-[#5965FF]
            blur-[120px]
          "
        />

        {/* Subtle lower glow */}

        <motion.div
          animate={{
            x: [0, -50, 0],
            opacity: [0.03, 0.07, 0.03],
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
            bg-[#FF5C35]
            blur-[130px]
          "
        />

        {/* Grid */}

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(255,255,255,0.7) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(255,255,255,0.7) 1px,
                transparent 1px
              )
            `,
            backgroundSize: "56px 56px",
          }}
        />

        {/* Vertical fade */}

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#07090D]/20 to-[#07090D]" />

        {/* Vignette */}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#07090D_92%)]" />
      </div>

      {/* =====================================================
          SMALL DECORATIVE ELEMENTS
      ===================================================== */}

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
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
            border-white/[0.08]
            bg-white/[0.025]
            text-[#FF6847]
            shadow-[0_20px_60px_rgba(0,0,0,0.3)]
          "
        >
          <SparkIcon size={17} />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
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
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            border
            border-white/[0.08]
            bg-white/[0.025]
            text-[#FF6847]
            shadow-[0_20px_60px_rgba(0,0,0,0.3)]
          "
        >
          <ArrowRightIcon size={18} />
        </div>
      </motion.div>

      {/* =====================================================
          PAGE
      ===================================================== */}

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-40px)] w-full max-w-6xl items-center justify-center">
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
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
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
                  border-white/[0.09]
                  bg-white/[0.045]
                  shadow-lg
                "
              >
                <span className="text-sm font-bold text-[#FF6847]">
                  S
                </span>
              </div>

              <div>
                <p className="text-sm font-semibold tracking-[-0.02em] text-white">
                  Syncora
                </p>

                <p className="text-[8px] font-medium uppercase tracking-[0.18em] text-[#737C89]">
                  Engineering workspace
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.2,
              }}
              className="flex items-center gap-3"
            >
              <span className="hidden text-[10px] font-medium text-[#737C89] sm:block">
                {isExistingWorkspaceSetup
                  ? "Workspace setup"
                  : "Step 2 of 3"}
              </span>

              {!isExistingWorkspaceSetup && (
                <div className="flex gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FF5C35]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FF5C35]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
                </div>
              )}
            </motion.div>
          </header>

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
              overflow-hidden
              rounded-[24px]
              border
              border-white/[0.085]
              bg-[#0C0F14]
              shadow-[0_30px_90px_rgba(0,0,0,0.45)]
            "
          >
            {/* Animated top line */}

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
                via-[#FF5C35]
                to-transparent
              "
            />

            {/* Subtle inner orange light */}

            <div
              className="
                pointer-events-none
                absolute
                -right-24
                -top-24
                h-64
                w-64
                rounded-full
                bg-[#FF5C35]/[0.035]
                blur-[80px]
              "
            />

            <div className="relative p-5 sm:p-7 lg:p-8">
              {/* =============================================
                  INTRO
              ============================================= */}

              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div>
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
                      delay: 0.25,
                      duration: 0.45,
                    }}
                    className="mb-2.5 flex items-center gap-2"
                  >
                    <span
                      className="
                        flex
                        h-6
                        w-6
                        items-center
                        justify-center
                        rounded-lg
                        bg-[#FF5C35]/10
                        text-[#FF6847]
                      "
                    >
                      <SparkIcon size={13} />
                    </span>

                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#FF6847]">
                      {isExistingWorkspaceSetup
                        ? "New workspace"
                        : "Your workspace"}
                    </span>
                  </motion.div>

                  <motion.h1
                    initial={{
                      opacity: 0,
                      y: 8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: 0.3,
                      duration: 0.5,
                    }}
                    className="
                      max-w-2xl
                      text-[30px]
                      font-semibold
                      leading-[1.08]
                      tracking-[-0.045em]
                      text-white
                      sm:text-[38px]
                    "
                  >
                    {isExistingWorkspaceSetup
                      ? "Create another engineering workspace."
                      : "Create your engineering workspace."}
                  </motion.h1>

                  <motion.p
                    initial={{
                      opacity: 0,
                      y: 8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: 0.38,
                      duration: 0.5,
                    }}
                    className="
                      mt-2.5
                      max-w-2xl
                      text-[11px]
                      leading-5
                      text-[#9AA3B0]
                      sm:text-xs
                    "
                  >
                    {isExistingWorkspaceSetup
                      ? "Set up a fresh workspace for your next team, product, or project."
                      : "Give your team a shared place to plan, build, collaborate, and ship software together."}
                  </motion.p>
                </div>

                {/* ===========================================
                    MINI PREVIEW
                =========================================== */}

                <motion.div
                  initial={{
                    opacity: 0,
                    x: 15,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay: 0.45,
                    duration: 0.5,
                  }}
                  className="
                    hidden
                    w-48
                    shrink-0
                    rounded-2xl
                    border
                    border-white/[0.075]
                    bg-white/[0.02]
                    p-3
                    md:block
                  "
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="
                        flex
                        h-7
                        w-7
                        items-center
                        justify-center
                        rounded-lg
                        bg-[#FF5C35]/10
                        text-[#FF6847]
                      "
                    >
                      <SparkIcon size={12} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-[10px] font-semibold text-white">
                        {formData.workspaceName ||
                          "Your workspace"}
                      </p>

                      <p className="truncate text-[11px] text-[#7D8795]">
                        {formData.workspaceSlug
                          ? `syncora.app/${formData.workspaceSlug}`
                          : "syncora.app/your-team"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.05]">
                    <motion.div
                      animate={{
                        width: [
                          "25%",
                          "60%",
                          "40%",
                          "72%",
                          "25%",
                        ],
                      }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="h-full rounded-full bg-[#FF5C35]/55"
                    />
                  </div>
                </motion.div>
              </div>

              {/* =============================================
                  FORM
              ============================================= */}

              <form
                onSubmit={handleContinue}
                className="mt-7"
              >
                <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                  {/* =========================================
                      LEFT
                  ========================================= */}

                  <div className="space-y-5">
                    {/* Workspace name */}

                    <motion.div
                      variants={formItem}
                      initial="hidden"
                      animate="visible"
                      custom={0.5}
                    >
                      <label
                        htmlFor="workspaceName"
                        className="
                          mb-1.5
                          block
                          text-[10px]
                          font-semibold
                          uppercase
                          tracking-[0.08em]
                          text-[#A3ABB7]
                        "
                      >
                        Workspace name
                      </label>

                      <input
                        id="workspaceName"
                        type="text"
                        name="workspaceName"
                        value={formData.workspaceName}
                        onChange={handleWorkspaceNameChange}
                        placeholder="My Engineering Team"
                        required
                        className="
                          w-full
                          rounded-xl
                          border
                          border-white/[0.09]
                          bg-white/[0.025]
                          px-3.5
                          py-3
                          text-xs
                          text-white
                          outline-none
                          transition-all
                          duration-200
                          placeholder:text-[#59616D]
                          hover:border-white/[0.16]
                          hover:bg-white/[0.035]
                          focus:border-[#FF5C35]/60
                          focus:bg-[#FF5C35]/[0.025]
                          focus:ring-4
                          focus:ring-[#FF5C35]/[0.06]
                        "
                      />

                      <p className="mt-1.5 text-[11px] text-[#747E8C]">
                        This is the name your teammates will see.
                      </p>
                    </motion.div>

                    {/* Workspace URL */}

                    <motion.div
                      variants={formItem}
                      initial="hidden"
                      animate="visible"
                      custom={0.58}
                    >
                      <label
                        htmlFor="workspaceSlug"
                        className="
                          mb-1.5
                          block
                          text-[10px]
                          font-semibold
                          uppercase
                          tracking-[0.08em]
                          text-[#A3ABB7]
                        "
                      >
                        Workspace URL
                      </label>

                      <div className="flex">
                        <span
                          className="
                            flex
                            items-center
                            rounded-l-xl
                            border
                            border-r-0
                            border-white/[0.09]
                            bg-white/[0.045]
                            px-3
                            text-[10px]
                            text-[#7D8795]
                          "
                        >
                          syncora.app/
                        </span>

                        <input
                          id="workspaceSlug"
                          type="text"
                          name="workspaceSlug"
                          value={formData.workspaceSlug}
                          onChange={handleChange}
                          placeholder="my-team"
                          required
                          className="
                            min-w-0
                            flex-1
                            rounded-r-xl
                            border
                            border-white/[0.09]
                            bg-white/[0.025]
                            px-3.5
                            py-3
                            text-xs
                            text-white
                            outline-none
                            transition-all
                            duration-200
                            placeholder:text-[#59616D]
                            hover:border-white/[0.16]
                            focus:border-[#FF5C35]/60
                            focus:bg-[#FF5C35]/[0.025]
                            focus:ring-4
                            focus:ring-[#FF5C35]/[0.06]
                          "
                        />
                      </div>

                      <p className="mt-1.5 text-[11px] text-[#747E8C]">
                        You can change this later from workspace
                        settings.
                      </p>
                    </motion.div>

                    {/* Description */}

                    <motion.div
                      variants={formItem}
                      initial="hidden"
                      animate="visible"
                      custom={0.66}
                    >
                      <label
                        htmlFor="description"
                        className="
                          mb-1.5
                          block
                          text-[10px]
                          font-semibold
                          uppercase
                          tracking-[0.08em]
                          text-[#A3ABB7]
                        "
                      >
                        Workspace description

                        <span className="ml-1.5 font-normal normal-case tracking-normal text-[#747E8C]">
                          Optional
                        </span>
                      </label>

                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        placeholder="What is your team building?"
                        className="
                          w-full
                          resize-none
                          rounded-xl
                          border
                          border-white/[0.09]
                          bg-white/[0.025]
                          px-3.5
                          py-3
                          text-xs
                          text-white
                          outline-none
                          transition-all
                          duration-200
                          placeholder:text-[#59616D]
                          hover:border-white/[0.16]
                          focus:border-[#FF5C35]/60
                          focus:bg-[#FF5C35]/[0.025]
                          focus:ring-4
                          focus:ring-[#FF5C35]/[0.06]
                        "
                      />
                    </motion.div>
                  </div>

                  {/* =========================================
                      RIGHT
                  ========================================= */}

                  <motion.div
                    variants={formItem}
                    initial="hidden"
                    animate="visible"
                    custom={0.58}
                  >
                    <div className="mb-3">
                      <p
                        className="
                          text-[10px]
                          font-semibold
                          uppercase
                          tracking-[0.08em]
                          text-[#A3ABB7]
                        "
                      >
                        Workspace visibility
                      </p>

                      <p className="mt-1 text-[9px] text-[#747E8C]">
                        Choose who can access your workspace.
                      </p>
                    </div>

                    <div className="grid gap-2.5">
                      {visibilityOptions.map((option) => {
                        const selected =
                          formData.visibility === option.value;

                        return (
                          <motion.label
                            key={option.value}
                            whileHover={{
                              y: -3,
                              scale: 1.01,
                            }}
                            whileTap={{
                              scale: 0.985,
                            }}
                            transition={{
                              duration: 0.2,
                            }}
                            className={`
                              group
                              relative
                              cursor-pointer
                              overflow-hidden
                              rounded-2xl
                              border
                              p-3.5
                              transition-all
                              duration-200
                              ${
                                selected
                                  ? "border-[#FF5C35]/55 bg-[#FF5C35]/[0.075] shadow-[0_12px_40px_rgba(255,92,53,0.10)]"
                                  : "border-white/[0.075] bg-white/[0.018] hover:border-white/[0.14] hover:bg-white/[0.035]"
                              }
                            `}
                          >
                            <input
                              type="radio"
                              name="visibility"
                              value={option.value}
                              checked={selected}
                              onChange={handleChange}
                              className="sr-only"
                            />

                            {selected && (
                              <motion.div
                                layoutId="visibilityGlow"
                                transition={{
                                  type: "spring",
                                  stiffness: 250,
                                  damping: 25,
                                }}
                                className="
                                  absolute
                                  -right-8
                                  -top-8
                                  h-20
                                  w-20
                                  rounded-full
                                  bg-[#FF5C35]/15
                                  blur-2xl
                                "
                              />
                            )}

                            <div className="relative flex items-start gap-3">
                              <div
                                className={`
                                  flex
                                  h-9
                                  w-9
                                  shrink-0
                                  items-center
                                  justify-center
                                  rounded-xl
                                  border
                                  transition-all
                                  duration-200
                                  ${
                                    selected
                                      ? "border-[#FF5C35]/30 bg-[#FF5C35]/10 text-[#FF6847]"
                                      : "border-white/[0.08] bg-white/[0.025] text-[#7D8795]"
                                  }
                                `}
                              >
                                {option.icon}
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                  <p className="text-xs font-semibold text-white">
                                    {option.title}
                                  </p>

                                  <motion.div
                                    animate={{
                                      scale: selected ? 1 : 0.85,
                                    }}
                                    className={`
                                      flex
                                      h-4
                                      w-4
                                      items-center
                                      justify-center
                                      rounded-full
                                      border
                                      transition-all
                                      duration-200
                                      ${
                                        selected
                                          ? "border-[#FF5C35] bg-[#FF5C35] text-white"
                                          : "border-white/[0.15] text-transparent"
                                      }
                                    `}
                                  >
                                    <CheckIcon size={10} />
                                  </motion.div>
                                </div>

                                <p className="mt-1 text-[9px] leading-4 text-[#808A98]">
                                  {option.description}
                                </p>
                              </div>
                            </div>
                          </motion.label>
                        );
                      })}
                    </div>

                    {/* Info */}

                    <div
                      className="
                        mt-3
                        rounded-xl
                        border
                        border-white/[0.06]
                        bg-white/[0.018]
                        px-3
                        py-2.5
                      "
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="
                            h-1.5
                            w-1.5
                            shrink-0
                            rounded-full
                            bg-[#FF5C35]
                            shadow-[0_0_8px_rgba(255,92,53,0.7)]
                          "
                        />

                        <p className="text-[11px] leading-4 text-[#747E8C]">
                          You can change visibility and permissions
                          later.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* =============================================
                    ERROR
                ============================================= */}

                {workspaceError && (
                  <motion.p
                    initial={{
                      opacity: 0,
                      y: -5,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="
                      mt-5
                      rounded-xl
                      border
                      border-red-500/20
                      bg-red-500/[0.06]
                      px-3
                      py-2.5
                      text-[10px]
                      text-red-400
                    "
                  >
                    {workspaceError}
                  </motion.p>
                )}

                {/* =============================================
                    ACTIONS
                ============================================= */}

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
                    delay: 0.85,
                    duration: 0.45,
                  }}
                  className="
                    mt-7
                    flex
                    items-center
                    justify-between
                    border-t
                    border-white/[0.06]
                    pt-5
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
                      navigate(
                        isExistingWorkspaceSetup
                          ? "/dashboard"
                          : "/onboarding/profile"
                      )
                    }
                    className="
                      group
                      flex
                      items-center
                      gap-2
                      rounded-xl
                      px-2
                      py-2
                      text-[10px]
                      font-medium
                      text-[#7D8795]
                      transition-colors
                      duration-200
                      hover:text-white
                    "
                  >
                    <ArrowLeftIcon size={13} />

                    <span>
                      {isExistingWorkspaceSetup
                        ? "Dashboard"
                        : "Back"}
                    </span>
                  </motion.button>

                  {/* Continue */}

                  <motion.button
                    whileHover={{
                      y: -2,
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                    type="submit"
                    disabled={creatingWorkspace}
                    className="
                      group
                      relative
                      overflow-hidden
                      rounded-xl
                      bg-[#FF5C35]
                      px-5
                      py-3
                      text-[10px]
                      font-semibold
                      text-white
                      shadow-[0_10px_30px_rgba(255,92,53,0.18)]
                      transition-all
                      duration-200
                      hover:bg-[#FF6847]
                      hover:shadow-[0_14px_40px_rgba(255,92,53,0.28)]
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >
                    {/* Hover sweep */}

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
                      {creatingWorkspace
                        ? "Creating..."
                        : isExistingWorkspaceSetup
                        ? "Create workspace"
                        : "Continue"}

                      {!creatingWorkspace && (
                        <motion.span className="transition-transform duration-200 group-hover:translate-x-1">
                          <ArrowRightIcon size={13} />
                        </motion.span>
                      )}
                    </span>
                  </motion.button>
                </motion.div>
              </form>
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
              delay: 1,
              duration: 0.5,
            }}
            className="mt-4 text-center text-[11px] text-[#59616D]"
          >
            You can manage your workspace settings anytime.
          </motion.p>
        </motion.div>
      </div>
    </main>
  );
};

export default CreateWorkspace;