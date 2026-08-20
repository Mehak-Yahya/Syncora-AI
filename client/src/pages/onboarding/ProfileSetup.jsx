import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

    // Keep onboarding data temporarily.
    // We will save it to MongoDB later.
    localStorage.setItem(
      "syncoraOnboardingProfile",
      JSON.stringify(formData)
    );

    navigate("/onboarding/workspace");
  };

  return (
    <main className="min-h-screen bg-[#FAF9F6] px-5 py-8 text-[#171717] sm:px-8">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF5C35] text-sm font-bold text-white shadow-sm">
              S
            </div>

            <span className="text-lg font-semibold tracking-[-0.02em]">
              Syncora
            </span>
          </div>

          <span className="text-xs font-medium text-[#9A948B]">
            Step 1 of 3
          </span>
        </header>

        {/* Progress */}
        <div className="mt-7 h-1.5 overflow-hidden rounded-full bg-[#E8E3DC]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "33.33%" }}
            transition={{ duration: 0.6 }}
            className="h-full rounded-full bg-[#FF5C35]"
          />
        </div>

        {/* Main Card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8 rounded-3xl border border-[#E4DFD8] bg-white p-6 shadow-[0_20px_60px_rgba(40,35,30,0.06)] sm:p-9"
        >
          {/* Intro */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#FF5C35]">
              Your profile
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
              Tell us about yourself.
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#77716A]">
              Help your teammates understand who you are and give
              Syncora better context for your engineering workspace.
            </p>
          </div>

          <form onSubmit={handleContinue} className="mt-8">

            {/* Profile Picture */}
            <div className="flex flex-col items-center border-b border-[#E8E3DC] pb-8 sm:flex-row sm:items-center sm:gap-6">
              <div className="relative">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile preview"
                    className="h-24 w-24 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-[#FFF0EB] text-2xl font-semibold text-[#FF5C35]">
                    +
                  </div>
                )}

                <label
                  htmlFor="profileImage"
                  className="absolute -bottom-2 -right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl border border-[#E4DFD8] bg-white text-sm shadow-sm transition hover:bg-[#F8F6F2]"
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

              <div className="mt-4 text-center sm:mt-0 sm:text-left">
                <p className="text-sm font-semibold">
                  Profile picture
                </p>

                <p className="mt-1 text-xs leading-5 text-[#9A948B]">
                  Add a professional photo so your team can recognize you.
                </p>
              </div>
            </div>

            {/* Basic Information */}
            <div className="mt-8">
              <h2 className="text-sm font-semibold">
                Basic information
              </h2>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">

                {/* Full Name */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#4F4B46]">
                    Full name
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Mehak Yahya"
                    className="w-full rounded-xl border border-[#DDD8D0] bg-[#FBFAF8] px-4 py-3 text-sm outline-none transition focus:border-[#FF5C35] focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                  />
                </div>

                {/* Username */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#4F4B46]">
                    Username
                  </label>

                  <div className="flex">
                    <span className="flex items-center rounded-l-xl border border-r-0 border-[#DDD8D0] bg-[#F3F0EB] px-3 text-sm text-[#8A857D]">
                      @
                    </span>

                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="mehak"
                      className="w-full rounded-r-xl border border-[#DDD8D0] bg-[#FBFAF8] px-4 py-3 text-sm outline-none transition focus:border-[#FF5C35] focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                    />
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="mt-4">
                <label className="mb-1.5 block text-xs font-medium text-[#4F4B46]">
                  Bio
                </label>

                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Tell your teammates a little about yourself..."
                  className="w-full resize-none rounded-xl border border-[#DDD8D0] bg-[#FBFAF8] px-4 py-3 text-sm outline-none transition focus:border-[#FF5C35] focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                />
              </div>
            </div>

            {/* Engineering Information */}
            <div className="mt-8 border-t border-[#E8E3DC] pt-8">
              <h2 className="text-sm font-semibold">
                Engineering profile
              </h2>

              <div className="mt-4">

                {/* GitHub */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#4F4B46]">
                    GitHub username
                  </label>

                  <input
                    type="text"
                    name="githubUsername"
                    value={formData.githubUsername}
                    onChange={handleChange}
                    placeholder="github-username"
                    className="w-full rounded-xl border border-[#DDD8D0] bg-[#FBFAF8] px-4 py-3 text-sm outline-none transition focus:border-[#FF5C35] focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                  />

                  <p className="mt-1.5 text-[11px] text-[#9A948B]">
                    You can connect your GitHub account later.
                  </p>
                </div>

                {/* Skills */}
                <div className="mt-4">
                  <label className="mb-1.5 block text-xs font-medium text-[#4F4B46]">
                    Skills
                  </label>

                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="React, Node.js, MongoDB, Python..."
                    className="w-full rounded-xl border border-[#DDD8D0] bg-[#FBFAF8] px-4 py-3 text-sm outline-none transition focus:border-[#FF5C35] focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                  />

                  <p className="mt-1.5 text-[11px] text-[#9A948B]">
                    Separate skills with commas.
                  </p>
                </div>

                {/* Experience */}
                <div className="mt-4">
                  <label className="mb-1.5 block text-xs font-medium text-[#4F4B46]">
                    Experience
                  </label>

                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#DDD8D0] bg-[#FBFAF8] px-4 py-3 text-sm outline-none transition focus:border-[#FF5C35] focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                  >
                    <option value="">
                      Select your experience level
                    </option>

                    <option value="student">
                      Student
                    </option>

                    <option value="junior">
                      Junior Developer
                    </option>

                    <option value="mid">
                      Mid-level Developer
                    </option>

                    <option value="senior">
                      Senior Developer
                    </option>

                    <option value="lead">
                      Tech Lead
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-8 border-t border-[#E8E3DC] pt-8">
              <h2 className="text-sm font-semibold">
                Social links
              </h2>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">

                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="LinkedIn URL"
                  className="w-full rounded-xl border border-[#DDD8D0] bg-[#FBFAF8] px-4 py-3 text-sm outline-none transition focus:border-[#FF5C35] focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                />

                <input
                  type="url"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleChange}
                  placeholder="Portfolio URL"
                  className="w-full rounded-xl border border-[#DDD8D0] bg-[#FBFAF8] px-4 py-3 text-sm outline-none transition focus:border-[#FF5C35] focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-9 flex items-center justify-end border-t border-[#E8E3DC] pt-6">
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="rounded-xl bg-[#FF5C35] px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#E94B27] hover:shadow-md"
              >
                Continue →
              </motion.button>
            </div>

          </form>
        </motion.section>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-[#A09A91]">
          You can update your profile anytime from Settings.
        </p>
      </div>
    </main>
  );
};

export default ProfileSetup;