import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateWorkspace = ({ existingUser = false }) => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    // Not logged in → Login
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    // Already completed onboarding → Dashboard
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);

        if (user.onboardingCompleted === true && user.workspace && !isExistingWorkspaceSetup) {
          navigate("/dashboard", { replace: true });
        }
      } catch (error) {
        console.error("Unable to read user data:", error);
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
  };

  const handleContinue = async (e) => {
    e.preventDefault();

    if (!formData.workspaceName.trim()) {
      return;
    }

    if (isExistingWorkspaceSetup) {
      const token = localStorage.getItem("token");
      setCreatingWorkspace(true);
      setWorkspaceError("");

      try {
        const response = await fetch(`${API_URL}/api/auth/workspace`, {
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
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.message || "Unable to create workspace.");
        }

        const storedUser = localStorage.getItem("user");
        const currentUser = storedUser ? JSON.parse(storedUser) : {};
        localStorage.setItem(
          "user",
          JSON.stringify({ ...currentUser, ...(data.user || {}) })
        );
        localStorage.removeItem("creatingAdditionalWorkspace");
        navigate("/dashboard", { replace: true });
      } catch (error) {
        setWorkspaceError(error.message || "Unable to create workspace.");
      } finally {
        setCreatingWorkspace(false);
      }

      return;
    }

    // Store temporary onboarding data.
    // Final database save should happen when onboarding is completed.
    localStorage.setItem(
      "onboardingWorkspace",
      JSON.stringify(formData)
    );

    if (isExistingWorkspaceSetup) {
      localStorage.setItem("creatingAdditionalWorkspace", "1");
    } else {
      localStorage.removeItem("creatingAdditionalWorkspace");
    }

    navigate("/onboarding/invite");
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
            {isExistingWorkspaceSetup ? "Workspace setup" : "Step 2 of 3"}
          </span>
        </header>

        {/* Progress */}
        <div className="mt-7 h-1.5 overflow-hidden rounded-full bg-[#E8E3DC]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: isExistingWorkspaceSetup ? "100%" : "66.66%" }}
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
              {isExistingWorkspaceSetup ? "New workspace" : "Your workspace"}
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
              {isExistingWorkspaceSetup
                ? "Create another engineering workspace."
                : "Create your engineering workspace."}
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#77716A]">
              {isExistingWorkspaceSetup
                ? "Set up a fresh workspace for your next team, product, or project."
                : "Give your team a shared place to plan, build, collaborate, and ship software together."}
            </p>
          </div>

          <form onSubmit={handleContinue} className="mt-8">

            {/* Workspace Name */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#4F4B46]">
                Workspace name
              </label>

              <input
                type="text"
                name="workspaceName"
                value={formData.workspaceName}
                onChange={handleWorkspaceNameChange}
                placeholder="My Engineering Team"
                required
                className="w-full rounded-xl border border-[#DDD8D0] bg-[#FBFAF8] px-4 py-3 text-sm outline-none transition focus:border-[#FF5C35] focus:bg-white focus:ring-4 focus:ring-orange-500/10"
              />

              <p className="mt-1.5 text-[11px] text-[#9A948B]">
                This is the name your teammates will see.
              </p>
            </div>

            {/* Workspace URL */}
            <div className="mt-5">
              <label className="mb-1.5 block text-xs font-medium text-[#4F4B46]">
                Workspace URL
              </label>

              <div className="flex">
                <span className="flex items-center rounded-l-xl border border-r-0 border-[#DDD8D0] bg-[#F3F0EB] px-3 text-xs text-[#8A857D]">
                  syncora.app/
                </span>

                <input
                  type="text"
                  name="workspaceSlug"
                  value={formData.workspaceSlug}
                  onChange={handleChange}
                  placeholder="my-team"
                  required
                  className="w-full rounded-r-xl border border-[#DDD8D0] bg-[#FBFAF8] px-4 py-3 text-sm outline-none transition focus:border-[#FF5C35] focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                />
              </div>

              <p className="mt-1.5 text-[11px] text-[#9A948B]">
                You can change this later from workspace settings.
              </p>
            </div>

            {/* Description */}
            <div className="mt-5">
              <label className="mb-1.5 block text-xs font-medium text-[#4F4B46]">
                Workspace description
                <span className="ml-1 font-normal text-[#A09A91]">
                  Optional
                </span>
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="What is your team building?"
                className="w-full resize-none rounded-xl border border-[#DDD8D0] bg-[#FBFAF8] px-4 py-3 text-sm outline-none transition focus:border-[#FF5C35] focus:bg-white focus:ring-4 focus:ring-orange-500/10"
              />
            </div>

            {/* Visibility */}
            <div className="mt-8 border-t border-[#E8E3DC] pt-8">
              <h2 className="text-sm font-semibold">
                Workspace visibility
              </h2>

              <p className="mt-1 text-xs text-[#9A948B]">
                Choose who can access your workspace.
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">

                {/* Private */}
                <label
                  className={`cursor-pointer rounded-2xl border p-4 transition ${
                    formData.visibility === "private"
                      ? "border-[#FF5C35] bg-[#FFF7F4]"
                      : "border-[#E4DFD8] bg-white hover:bg-[#FBFAF8]"
                  }`}
                >
                  <input
                    type="radio"
                    name="visibility"
                    value="private"
                    checked={formData.visibility === "private"}
                    onChange={handleChange}
                    className="sr-only"
                  />

                  <div className="flex items-start gap-3">
                    <span className="text-lg">🔒</span>

                    <div>
                      <p className="text-sm font-semibold">
                        Private
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[#8A857D]">
                        Only invited team members can access this workspace.
                      </p>
                    </div>
                  </div>
                </label>

                {/* Team */}
                <label
                  className={`cursor-pointer rounded-2xl border p-4 transition ${
                    formData.visibility === "team"
                      ? "border-[#FF5C35] bg-[#FFF7F4]"
                      : "border-[#E4DFD8] bg-white hover:bg-[#FBFAF8]"
                  }`}
                >
                  <input
                    type="radio"
                    name="visibility"
                    value="team"
                    checked={formData.visibility === "team"}
                    onChange={handleChange}
                    className="sr-only"
                  />

                  <div className="flex items-start gap-3">
                    <span className="text-lg">👥</span>

                    <div>
                      <p className="text-sm font-semibold">
                        Team
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[#8A857D]">
                        Everyone in your organization can discover it.
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-9 flex items-center justify-between border-t border-[#E8E3DC] pt-6">
              <button
                type="button"
                onClick={() => navigate(isExistingWorkspaceSetup ? "/dashboard" : "/onboarding/profile")}
                className="rounded-xl px-5 py-3 text-sm font-medium text-[#77716A] transition hover:bg-[#F5F2ED]"
              >
                {isExistingWorkspaceSetup ? "← Dashboard" : "← Back"}
              </button>

              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={creatingWorkspace}
                className="rounded-xl bg-[#FF5C35] px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#E94B27] hover:shadow-md"
              >
                {creatingWorkspace ? "Creating..." : isExistingWorkspaceSetup ? "Create workspace →" : "Continue →"}
              </motion.button>
            </div>

            {workspaceError && (
              <p className="mt-4 rounded-lg bg-[#FFF3F1] p-3 text-xs text-[#B23A2B]">
                {workspaceError}
              </p>
            )}

          </form>
        </motion.section>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-[#A09A91]">
          You can manage your workspace settings anytime.
        </p>
      </div>
    </main>
  );
};

export default CreateWorkspace;