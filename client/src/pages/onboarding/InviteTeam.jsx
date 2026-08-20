import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const InviteTeam = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(false);

  // Protect onboarding route
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    // User must be authenticated
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    // Completed users should never see onboarding again
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

  // Add teammate email
  const handleAddInvite = () => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) return;

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return;
    }

    // Prevent duplicate invitations
    if (invites.includes(trimmedEmail)) {
      return;
    }

    setInvites((prev) => [...prev, trimmedEmail]);
    setEmail("");
  };

  // Remove teammate email
  const handleRemoveInvite = (emailToRemove) => {
    setInvites((prev) =>
      prev.filter((invite) => invite !== emailToRemove)
    );
  };

  // Finish onboarding
  const handleComplete = async () => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/login", { replace: true });
      return;
    }

    setLoading(true);

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
        throw new Error(data.message || "Unable to complete onboarding.");
      }

      /*
       * Temporary onboarding completion.
       *
       * Later this will be replaced with:
       * POST /api/onboarding/complete
       *
       * The backend will then become the source of truth
       * for onboardingCompleted.
       */

      const profileData =
        localStorage.getItem("onboardingProfile");

      const workspaceData =
        localStorage.getItem("onboardingWorkspace");

      // Mark onboarding as completed
      const updatedUser = {
        ...user,
        ...data.user,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      // Save onboarding information temporarily
      localStorage.setItem(
        "onboardingInvites",
        JSON.stringify(invites)
      );
      localStorage.removeItem("creatingAdditionalWorkspace");

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

      // Small transition delay
      await new Promise((resolve) =>
        setTimeout(resolve, 300)
      );

      // FINAL DESTINATION
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error(
        "Unable to complete onboarding:",
        error
      );
    } finally {
      setLoading(false);
    }
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
            Step 3 of 3
          </span>
        </header>

        {/* Progress */}
        <div className="mt-7 h-1.5 overflow-hidden rounded-full bg-[#E8E3DC]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
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
              Your team
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
              Invite your teammates.
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#77716A]">
              Syncora works better when your engineering team is
              connected. Invite teammates now or skip this step and
              invite them later.
            </p>
          </div>

          {/* Invite Form */}
          <div className="mt-8">
            <label className="mb-1.5 block text-xs font-medium text-[#4F4B46]">
              Teammate email
            </label>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddInvite();
                  }
                }}
                placeholder="teammate@example.com"
                className="w-full rounded-xl border border-[#DDD8D0] bg-[#FBFAF8] px-4 py-3 text-sm outline-none transition focus:border-[#FF5C35] focus:bg-white focus:ring-4 focus:ring-orange-500/10"
              />

              <button
                type="button"
                onClick={handleAddInvite}
                className="rounded-xl border border-[#DDD8D0] bg-white px-5 py-3 text-sm font-semibold transition hover:bg-[#F8F6F2]"
              >
                Add
              </button>
            </div>

            <p className="mt-1.5 text-[11px] text-[#9A948B]">
              You can invite more teammates later from your workspace.
            </p>
          </div>

          {/* Invitations */}
          {invites.length > 0 && (
            <div className="mt-6 rounded-2xl border border-[#E8E3DC] bg-[#FBFAF8] p-4">
              <p className="text-xs font-semibold text-[#4F4B46]">
                Invitations
              </p>

              <div className="mt-3 space-y-2">
                {invites.map((invite) => (
                  <div
                    key={invite}
                    className="flex items-center justify-between rounded-xl border border-[#E4DFD8] bg-white px-4 py-3"
                  >
                    <span className="truncate text-sm text-[#4F4B46]">
                      {invite}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveInvite(invite)
                      }
                      className="ml-4 text-xs font-medium text-[#9A948B] transition hover:text-[#FF5C35]"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-9 border-t border-[#E8E3DC] pt-6">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">

              {/* Skip */}
              <button
                type="button"
                onClick={handleComplete}
                disabled={loading}
                className="rounded-xl px-5 py-3 text-sm font-medium text-[#77716A] transition hover:bg-[#F5F2ED] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Skip for now
              </button>

              {/* Finish */}
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleComplete}
                disabled={loading}
                className="rounded-xl bg-[#FF5C35] px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#E94B27] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Setting up..."
                  : "Finish setup →"}
              </motion.button>

            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-[#A09A91]">
          You can invite and manage teammates anytime from your workspace.
        </p>
      </div>
    </main>
  );
};

export default InviteTeam;