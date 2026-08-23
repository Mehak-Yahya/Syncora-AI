import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import syncoraLogo from "../../assets/logo.png";

const ProfileSetup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    bio: "",
    githubUsername: "",
    skills: "",
    experience: "",
    linkedin: "",
    portfolio: "",
  });

  const [profileImage, setProfileImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setProfileImage(URL.createObjectURL(file));
  };

  const handleContinue = (e) => {
    e.preventDefault();

    localStorage.setItem(
      "syncoraOnboardingProfile",
      JSON.stringify(formData)
    );

    navigate("/onboarding/workspace");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07090D] px-4 py-5 text-white sm:px-6 lg:px-8">
      {/* =========================================================
          BACKGROUND
      ========================================================= */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* Main orange glow */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.16, 0.24, 0.16],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[8%] top-[15%] h-[420px] w-[420px] rounded-full bg-[#FF5C35]/10 blur-[120px]"
        />

        {/* Blue glow */}
        <motion.div
          animate={{
            x: [0, 60, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-[-120px] top-[8%] h-[430px] w-[430px] rounded-full bg-[#5865F2]/10 blur-[120px]"
        />

        {/* Bottom glow */}
        <motion.div
          animate={{
            x: [0, -50, 0],
            opacity: [0.08, 0.16, 0.08],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[-180px] left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-[#FF5C35]/10 blur-[130px]"
        />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
            backgroundSize: "55px 55px",
          }}
        />

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_25%,#07090D_90%)]" />
      </div>

      {/* =========================================================
          PAGE
      ========================================================= */}

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-40px)] max-w-[1180px] flex-col">
        {/* =======================================================
            TOP BAR
        ======================================================= */}

        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{
                rotate: 6,
                scale: 1.05,
              }}
              className="relative flex h-9 w-9 items-center justify-center"
            >
              <div className="absolute inset-0 rounded-xl bg-[#FF5C35]/20 blur-lg" />

              <img
                src={syncoraLogo}
                alt="Syncora"
                className="relative h-9 w-9 rounded-xl object-contain"
              />
            </motion.div>

            <div>
              <p className="text-sm font-semibold tracking-tight">
                Syncora
              </p>

              <p className="text-[9px] uppercase tracking-[0.2em] text-[#626B78]">
                Engineering OS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-[10px] font-medium text-[#626B78] sm:block">
              PROFILE SETUP
            </span>

            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-7 rounded-full bg-[#FF5C35]" />
              <span className="h-1.5 w-7 rounded-full bg-white/10" />
              <span className="h-1.5 w-7 rounded-full bg-white/10" />
            </div>

            <span className="text-[10px] font-semibold text-[#89919D]">
              01 / 03
            </span>
          </div>
        </motion.header>

        {/* =======================================================
            MAIN
        ======================================================= */}

        <div className="flex flex-1 items-center justify-center py-6 lg:py-8">
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.7,
              ease: "easeOut",
            }}
            className="grid w-full max-w-[1080px] overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0D1016]/90 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl lg:grid-cols-[0.78fr_1.22fr]"
          >
            {/* ===================================================
                LEFT VISUAL PANEL
            =================================================== */}

            <section className="relative hidden overflow-hidden border-r border-white/[0.07] lg:flex lg:min-h-[620px] lg:flex-col lg:justify-between">
              {/* 3D Orb */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{
                    rotateX: [0, 8, 0, -8, 0],
                    rotateY: [0, -12, 0, 12, 0],
                  }}
                  transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                  className="relative h-[260px] w-[260px]"
                >
                  {/* Outer ring */}
                  <motion.div
                    animate={{
                      rotateZ: 360,
                    }}
                    transition={{
                      duration: 18,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-0 rounded-full border border-[#FF5C35]/20"
                  />

                  <motion.div
                    animate={{
                      rotateZ: -360,
                    }}
                    transition={{
                      duration: 25,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-[25px] rounded-full border border-dashed border-white/[0.08]"
                  />

                  {/* Glow */}
                  <div className="absolute inset-[45px] rounded-full bg-[#FF5C35]/15 blur-[45px]" />

                  {/* Core */}
                  <motion.div
                    animate={{
                      y: [0, -12, 0],
                      rotateZ: [0, 3, 0, -3, 0],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute left-1/2 top-1/2 flex h-[125px] w-[125px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[32px] border border-white/[0.1] bg-gradient-to-br from-[#FF5C35]/20 via-[#171B23] to-[#0B0D12] shadow-[0_25px_70px_rgba(255,92,53,0.12)]"
                  >
                    <img
                      src={syncoraLogo}
                      alt=""
                      className="h-[65px] w-[65px] object-contain"
                    />
                  </motion.div>

                  {/* Floating dots */}
                  <motion.span
                    animate={{
                      y: [0, -18, 0],
                      opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                    }}
                    className="absolute -right-3 top-[70px] h-2 w-2 rounded-full bg-[#FF5C35] shadow-[0_0_15px_#FF5C35]"
                  />

                  <motion.span
                    animate={{
                      y: [0, 15, 0],
                      opacity: [0.3, 0.9, 0.3],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                    }}
                    className="absolute bottom-[50px] left-2 h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_12px_white]"
                  />
                </motion.div>
              </div>

              {/* Top content */}
              <div className="relative z-10 p-8">
                <span className="inline-flex rounded-full border border-[#FF5C35]/20 bg-[#FF5C35]/[0.07] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#FF7657]">
                  Your identity
                </span>

                <h2 className="mt-5 max-w-[280px] text-3xl font-semibold leading-[1.08] tracking-[-0.05em]">
                  Make your workspace feel like yours.
                </h2>

                <p className="mt-4 max-w-[290px] text-xs leading-6 text-[#68717E]">
                  Your profile helps teammates know who you are,
                  what you build, and how you work.
                </p>
              </div>

              {/* Bottom info */}
              <div className="relative z-10 p-8">
                <div className="flex items-center gap-3 border-t border-white/[0.07] pt-5">
                  <div className="flex -space-x-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#0D1016] bg-[#293241] text-[9px] font-semibold">
                      A
                    </div>
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#0D1016] bg-[#FF5C35] text-[9px] font-semibold">
                      M
                    </div>
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#0D1016] bg-[#475569] text-[9px] font-semibold">
                      +
                    </div>
                  </div>

                  <p className="text-[10px] text-[#626B78]">
                    Built for modern engineering teams
                  </p>
                </div>
              </div>
            </section>

            {/* ===================================================
                FORM PANEL
            =================================================== */}

            <section className="p-5 sm:p-7 lg:p-9">
              {/* Heading */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#FF6848]">
                  Profile
                </p>

                <h1 className="mt-2 text-[28px] font-semibold tracking-[-0.045em] text-white sm:text-[32px]">
                  Tell us about yourself.
                </h1>

                <p className="mt-2 max-w-[500px] text-xs leading-5 text-[#6F7885]">
                  Add a few details so your team can recognize
                  you and Syncora can personalize your workspace.
                </p>
              </div>

              <form onSubmit={handleContinue} className="mt-6">
                {/* =================================================
                    PROFILE HEADER
                ================================================= */}

                <div className="flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-3.5">
                  <div className="relative shrink-0">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile preview"
                        className="h-16 w-16 rounded-2xl border border-white/10 object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#FF5C35]/20 bg-[#FF5C35]/10 text-lg font-semibold text-[#FF7657]">
                        {formData.fullName
                          ? formData.fullName.charAt(0).toUpperCase()
                          : "+"}
                      </div>
                    )}

                    <label
                      htmlFor="profileImage"
                      className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 cursor-pointer items-center justify-center rounded-lg border border-[#222832] bg-[#171B22] text-[10px] text-white transition hover:bg-[#222832]"
                    >
                      ✎
                    </label>

                    <input
                      id="profileImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-white">
                      Profile picture
                    </p>

                    <p className="mt-1 max-w-[340px] text-[11px] leading-4 text-[#656E7B]">
                      Use a professional photo or let Syncora
                      generate your initials automatically.
                    </p>
                  </div>
                </div>

                {/* =================================================
                    BASIC INFO
                ================================================= */}

                <div className="mt-5">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FF5C35]" />

                    <h2 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#87909D]">
                      Basic information
                    </h2>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field
                      label="Full name"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Mehak Yahya"
                    />

                    <div>
                      <label className="mb-1.5 block text-[10px] font-medium text-[#8B94A1]">
                        Username
                      </label>

                      <div className="flex">
                        <span className="flex h-10 items-center rounded-l-xl border border-r-0 border-white/[0.08] bg-white/[0.035] px-3 text-xs text-[#59626F]">
                          @
                        </span>

                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          placeholder="mehak"
                          className="h-10 w-full rounded-r-xl border border-white/[0.08] bg-[#0A0D12] px-3 text-xs text-white outline-none transition placeholder:text-[#3F4752] focus:border-[#FF5C35]/60 focus:bg-[#0C1016] focus:ring-2 focus:ring-[#FF5C35]/10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="mb-1.5 block text-[10px] font-medium text-[#8B94A1]">
                      Bio
                    </label>

                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Software developer focused on building useful products..."
                      className="w-full resize-none rounded-xl border border-white/[0.08] bg-[#0A0D12] px-3.5 py-2.5 text-xs leading-5 text-white outline-none transition placeholder:text-[#3F4752] focus:border-[#FF5C35]/60 focus:bg-[#0C1016] focus:ring-2 focus:ring-[#FF5C35]/10"
                    />
                  </div>
                </div>

                {/* =================================================
                    ENGINEERING
                ================================================= */}

                <div className="mt-5">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FF5C35]" />

                    <h2 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#87909D]">
                      Engineering profile
                    </h2>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field
                      label="GitHub username"
                      name="githubUsername"
                      value={formData.githubUsername}
                      onChange={handleChange}
                      placeholder="github-username"
                    />

                    <div>
                      <label className="mb-1.5 block text-[10px] font-medium text-[#8B94A1]">
                        Experience
                      </label>

                      <select
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        className="h-10 w-full rounded-xl border border-white/[0.08] bg-[#0A0D12] px-3 text-xs text-white outline-none transition focus:border-[#FF5C35]/60 focus:ring-2 focus:ring-[#FF5C35]/10"
                      >
                        <option value="">
                          Select experience
                        </option>
                        <option value="student">Student</option>
                        <option value="junior">
                          Junior Developer
                        </option>
                        <option value="mid">
                          Mid-level Developer
                        </option>
                        <option value="senior">
                          Senior Developer
                        </option>
                        <option value="lead">Tech Lead</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-3">
                    <Field
                      label="Skills"
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      placeholder="React, Node.js, MongoDB, Python..."
                    />

                    <p className="mt-1.5 text-[11px] text-[#4F5865]">
                      Separate multiple skills with commas.
                    </p>
                  </div>
                </div>

                {/* =================================================
                    LINKS
                ================================================= */}

                <div className="mt-5">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#5865F2]" />

                    <h2 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#87909D]">
                      Links
                    </h2>

                    <span className="text-[9px] text-[#4E5662]">
                      Optional
                    </span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field
                      label="LinkedIn"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      placeholder="linkedin.com/in/username"
                      type="url"
                    />

                    <Field
                      label="Portfolio"
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleChange}
                      placeholder="yourportfolio.com"
                      type="url"
                    />
                  </div>
                </div>

                {/* =================================================
                    ACTION
                ================================================= */}

                <div className="mt-6 flex items-center justify-between border-t border-white/[0.07] pt-5">
                  <p className="hidden text-[11px] text-[#4E5662] sm:block">
                    You can update these details later.
                  </p>

                  <motion.button
                    whileHover={{
                      y: -2,
                      boxShadow:
                        "0 12px 35px rgba(255,92,53,.22)",
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                    type="submit"
                    className="group ml-auto flex items-center gap-2 rounded-xl bg-[#FF5C35] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#FF6948]"
                  >
                    Continue

                    <motion.span
                      animate={{
                        x: [0, 3, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      →
                    </motion.span>
                  </motion.button>
                </div>
              </form>
            </section>
          </motion.div>
        </div>

        {/* Bottom */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="pb-1 text-center text-[9px] text-[#414955]"
        >
          Your profile. Your identity. Your engineering workspace.
        </motion.footer>
      </div>
    </main>
  );
};

/* =============================================================
   REUSABLE FIELD
============================================================= */

const Field = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-[10px] font-medium text-[#8B94A1]"
      >
        {label}
      </label>

      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-10 w-full rounded-xl border border-white/[0.08] bg-[#0A0D12] px-3.5 text-xs text-white outline-none transition placeholder:text-[#3F4752] hover:border-white/[0.12] focus:border-[#FF5C35]/60 focus:bg-[#0C1016] focus:ring-2 focus:ring-[#FF5C35]/10"
      />
    </div>
  );
};

export default ProfileSetup;