import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "./Sidebar";
import Overview from "./Overview";
import Workspace from "./Workspace";
import Projects from "./Projects";
import Team from "./Team";
import AI from "./AI";
import Modals from "./Modals";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Dashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [activeNav, setActiveNav] = useState("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [overflowOpen, setOverflowOpen] = useState(false);

  const [projects, setProjects] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);

  const [copiedSlug, setCopiedSlug] = useState(false);
  const [workspaceActionError, setWorkspaceActionError] = useState("");
  const [workspaceDetailsExpanded, setWorkspaceDetailsExpanded] = useState(false);
  const [workspaceEditorOpen, setWorkspaceEditorOpen] = useState(false);
  const [workspaceEdit, setWorkspaceEdit] = useState({
    name: "",
    description: "",
    visibility: "private",
  });
  const [savingWorkspace, setSavingWorkspace] = useState(false);

  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [projectForm, setProjectForm] = useState({
    name: "",
    description: "",
  });
  const [projectCollaborators, setProjectCollaborators] = useState("");
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState("");
  const [projectError, setProjectError] = useState("");
  const [creatingProject, setCreatingProject] = useState(false);

  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [sendingInvite, setSendingInvite] = useState(false);

  const [githubPickerOpen, setGithubPickerOpen] = useState(false);
  const [githubRepositories, setGithubRepositories] = useState([]);
  const [githubProjectId, setGithubProjectId] = useState("");
  const [githubLoading, setGithubLoading] = useState(false);
  const [githubError, setGithubError] = useState("");

  const [syncingProjectId, setSyncingProjectId] = useState("");
  const [syncMessage, setSyncMessage] = useState("");
  const [engineeringContexts, setEngineeringContexts] = useState({});
  const [analyzingProjectId, setAnalyzingProjectId] = useState("");
  const [analysisMessage, setAnalysisMessage] = useState({});
  const [expandedAnalysisProjects, setExpandedAnalysisProjects] = useState({});
  const [analysisDetailTabs, setAnalysisDetailTabs] = useState({});
  const [aiProjectId, setAiProjectId] = useState("");
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [aiSources, setAiSources] = useState([]);
  const [aiRetrieval, setAiRetrieval] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const navItems = [
    ["Overview", "⌂"],
    ["Workspace", "▦"],
    ["Projects", "◇"],
    ["Team", "♧"],
    ["AI workspace", "✦"],
  ];

  const token = () => localStorage.getItem("token");

  const apiHeaders = () => ({
    ...(token() ? { Authorization: `Bearer ${token()}` } : {}),
  });

  const handleUnauthorized = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", {
      replace: true,
      state: { message: "Your session has expired. Please log in again." },
    });
  };

  const handleNavClick = (label) => {
    setActiveNav(label);
    setOverflowOpen(false);
  };

  const openWorkspaceDetails = () => {
    setWorkspaceEdit({
      name: activeWorkspace?.name || user?.workspace?.name || "",
      description: activeWorkspace?.description || user?.workspace?.description || "",
      visibility: activeWorkspace?.visibility || user?.workspace?.visibility || "private",
    });
    setWorkspaceDetailsExpanded(true);
  };

  const openWorkspaceEditor = () => {
    openWorkspaceDetails();
    setWorkspaceEditorOpen(true);
  };

  const handleSaveWorkspace = async () => {
    const workspaceId = selectedWorkspaceId || activeWorkspace?._id || user?.workspace?._id;
    if (!workspaceId) return;

    setSavingWorkspace(true);
    setWorkspaceActionError("");

    try {
      const response = await fetch(`${API_URL}/api/auth/workspace/${workspaceId}`, {
        method: "PATCH",
        headers: {
          ...apiHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(workspaceEdit),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Unable to update workspace.");
      }

      setWorkspaces((current) =>
        current.map((workspace) =>
          workspace._id === workspaceId ? { ...workspace, ...data.workspace } : workspace
        )
      );
      setUser((current) => ({
        ...current,
        workspace: { ...(current.workspace || {}), ...data.workspace },
      }));
      setWorkspaceEditorOpen(false);
    } catch (error) {
      setWorkspaceActionError(error.message || "Unable to update workspace.");
    } finally {
      setSavingWorkspace(false);
    }
  };

  const toggleAnalysisDetails = (projectId) => {
    setExpandedAnalysisProjects((current) => ({
      ...current,
      [projectId]: !current[projectId],
    }));
  };

  const setAnalysisDetailTab = (projectId, tab) => {
    setAnalysisDetailTabs((current) => ({
      ...current,
      [projectId]: tab,
    }));
  };

  const handleAskSyncora = async (event, questionOverride = "") => {
    event?.preventDefault();
    const question = (questionOverride || aiQuestion).trim();
    const projectId =
      aiProjectId ||
      projects.find((project) => project.github?.connected)?._id;

    if (!question) {
      setAiError("Enter a question for Syncora AI.");
      return;
    }

    if (!projectId) {
      setAiError("Connect and analyze a repository before asking a question.");
      return;
    }

    setAiProjectId(projectId);
    setAiQuestion(question);
    setAiLoading(true);
    setAiError("");
    setAiAnswer("");
    setAiSources([]);
    setAiRetrieval(null);

    try {
      const response = await fetch(
        `${API_URL}/api/projects/${projectId}/ai/chat`,
        {
          method: "POST",
          headers: {
            ...apiHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question }),
        }
      );
      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Unable to answer this question.");
      }

      setAiAnswer(data.answer || "Syncora AI returned no answer.");
      setAiSources(data.sources || []);
      setAiRetrieval(data.retrieval || null);
    } catch (error) {
      setAiError(error.message || "Unable to answer this question.");
    } finally {
      setAiLoading(false);
    }
  };

  const clearAiConversation = () => {
    setAiQuestion("");
    setAiAnswer("");
    setAiSources([]);
    setAiRetrieval(null);
    setAiError("");
  };

  /* =========================================================
     AUTHENTICATION
  ========================================================= */

  useEffect(() => {
    let mounted = true;

    const verifyUser = async () => {
      const authToken = localStorage.getItem("token");

      if (!authToken) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(`${API_URL}/api/auth/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          signal: controller.signal,
        });

        clearTimeout(timeout);

        const data = await response.json();

        if (!response.ok) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login", { replace: true });
          return;
        }

        if (!mounted) return;

        if (data.user) {
          let dashboardUser = data.user;

          const storedWorkspace =
            localStorage.getItem("completedWorkspace") ||
            localStorage.getItem("onboardingWorkspace");

          /*
           * Temporary local-workspace recovery.
           * Backend remains the source of truth whenever
           * workspace data is already available.
           */
          if (!dashboardUser.workspace && storedWorkspace) {
            try {
              const workspace = JSON.parse(storedWorkspace);

              const localWorkspace = {
                id: workspace._id || workspace.id,
                name: workspace.workspaceName,
                description: workspace.description || "",
                slug: workspace.workspaceSlug,
                visibility: workspace.visibility || "private",
                memberCount: 1,
                members: [
                  {
                    name: dashboardUser.name || dashboardUser.email,
                    email: dashboardUser.email,
                    role: "owner",
                  },
                ],
                pendingInvites: [],
              };

              dashboardUser = {
                ...dashboardUser,
                workspace: localWorkspace,
              };

              const syncResponse = await fetch(
                `${API_URL}/api/auth/onboarding/complete`,
                {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    workspace,
                    invites: JSON.parse(
                      localStorage.getItem("onboardingInvites") || "[]"
                    ),
                  }),
                }
              );

              if (syncResponse.ok) {
                const syncData = await syncResponse.json();

                dashboardUser = {
                  ...dashboardUser,
                  ...(syncData.user || {}),
                  workspace:
                    syncData.user?.workspace || localWorkspace,
                };
              }
            } catch (error) {
              console.error("Unable to restore workspace:", error);
            }
          }

          setUser(dashboardUser);

          localStorage.setItem(
            "user",
            JSON.stringify(dashboardUser)
          );
        } else {
          const storedUser = localStorage.getItem("user");

          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
            } catch {
              localStorage.removeItem("user");
              navigate("/login", { replace: true });
            }
          } else {
            navigate("/login", { replace: true });
          }
        }
      } catch (error) {
        console.error("Dashboard authentication error:", error);

        if (mounted) {
          const storedUser = localStorage.getItem("user");

          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
            } catch {
              localStorage.removeItem("user");
              navigate("/login", { replace: true });
            }
          }
        }
      } finally {
        if (mounted) {
          setCheckingAuth(false);
        }
      }
    };

    verifyUser();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  /* =========================================================
     LOAD PROJECTS + WORKSPACES
  ========================================================= */

  useEffect(() => {
    if (!user) return;

    const loadDashboardData = async () => {
      try {
        const headers = apiHeaders();

        const [projectResponse, workspaceResponse] =
          await Promise.all([
            fetch(
              `${API_URL}/api/projects${selectedWorkspaceId ? `?workspaceId=${selectedWorkspaceId}` : ""}`,
              { headers }
            ),
            fetch(`${API_URL}/api/auth/workspace/list`, { headers }),
          ]);

        const projectData = await projectResponse
          .json()
          .catch(() => ({}));

        const workspaceData = await workspaceResponse
          .json()
          .catch(() => ({}));

        if (projectResponse.ok) {
          setProjects(projectData.projects || []);
        }

        if (workspaceResponse.ok) {
          const loadedWorkspaces =
            workspaceData.workspaces || [];

          setWorkspaces(loadedWorkspaces);

          setSelectedWorkspaceId((currentWorkspaceId) => {
            if (
              currentWorkspaceId &&
              loadedWorkspaces.some(
                (workspace) => workspace._id === currentWorkspaceId
              )
            ) {
              return currentWorkspaceId;
            }

            return (
              loadedWorkspaces[0]?._id ||
              user.workspace?._id ||
              user.workspace?.id ||
              ""
            );
          });
        }
      } catch (error) {
        console.error("Dashboard data loading error:", error);
      }
    };

    loadDashboardData();
  }, [user, selectedWorkspaceId]);

  useEffect(() => {
    if (!user || projects.length === 0) return;

    let mounted = true;

    const loadEngineeringContexts = async () => {
      const contextResults = await Promise.all(
        projects
          .filter((project) => project.github?.connected)
          .map(async (project) => {
            const response = await fetch(
              `${API_URL}/api/projects/${project._id}/context`,
              { headers: apiHeaders() }
            );

            if (response.status === 404) {
              return [project._id, null];
            }

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
              throw new Error(data.message || "Unable to load repository context.");
            }

            return [project._id, data.context || null];
          })
      );

      if (mounted) {
        setEngineeringContexts(Object.fromEntries(contextResults));
      }
    };

    loadEngineeringContexts().catch((error) => {
      if (mounted) {
        setAnalysisMessage({
          type: "error",
          message: error.message || "Unable to load repository context.",
        });
      }
    });

    return () => {
      mounted = false;
    };
  }, [projects, user]);

  /* =========================================================
     GITHUB CALLBACK
  ========================================================= */

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get("projectId");

    if (
      params.get("github") !== "connected" ||
      !projectId
    ) {
      return;
    }

    openGithubRepositoryPicker(projectId);

    window.history.replaceState(
      {},
      "",
      "/dashboard"
    );
  }, []);

  /* =========================================================
     DERIVED DATA
  ========================================================= */

  const connectedProjects = useMemo(
    () =>
      projects.filter(
        (project) => project.github?.connected
      ),
    [projects]
  );

  const selectedAiProject = projects.find(
    (project) => project._id === aiProjectId
  ) || connectedProjects[0];

  const activeWorkspace =
    workspaces.find((workspace) => workspace._id === selectedWorkspaceId) ||
    user?.workspace;

  const memberCount =
    activeWorkspace?.memberCount ||
    activeWorkspace?.members?.length ||
    1;

  const workspaceName =
    activeWorkspace?.name || "Workspace";

  /* =========================================================
     PROJECT ACTIONS
  ========================================================= */

  const openProjectDialog = () => {
    if (!user.workspace) {
      navigate("/workspace/new");
      return;
    }

    setProjectError("");
    setSelectedWorkspaceId(
      user.workspace?._id ||
        user.workspace?.id ||
        workspaces[0]?._id ||
        ""
    );
    setProjectCollaborators("");
    setProjectForm({
      name: "",
      description: "",
    });
    setProjectDialogOpen(true);
  };

  const handleCreateProject = async (event) => {
    event.preventDefault();

    setProjectError("");
    setCreatingProject(true);

    try {
      if (!projectForm.name.trim()) {
        throw new Error("Enter a project name.");
      }

      if (!selectedWorkspaceId) {
        throw new Error("Select a workspace.");
      }

      const response = await fetch(
        `${API_URL}/api/projects`,
        {
          method: "POST",
          headers: {
            ...apiHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: projectForm.name.trim(),
            description: projectForm.description.trim(),
            workspaceId: selectedWorkspaceId,
            collaborators: projectCollaborators
              .split(",")
              .map((email) => email.trim().toLowerCase())
              .filter(Boolean),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to create project."
        );
      }

      if (data.project) {
        setProjects((current) => [
          data.project,
          ...current,
        ]);
      }

      setProjectForm({
        name: "",
        description: "",
      });

      setProjectCollaborators("");
      setProjectDialogOpen(false);
      setActiveNav("Projects");
    } catch (error) {
      setProjectError(
        error.message || "Unable to create project."
      );
    } finally {
      setCreatingProject(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Delete this project?")) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/projects/${projectId}`,
        {
          method: "DELETE",
          headers: apiHeaders(),
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data.message || "Unable to delete project."
        );
      }

      setProjects((current) =>
        current.filter(
          (project) => project._id !== projectId
        )
      );

      setEngineeringContexts((current) => ({
        ...current,
        [projectId]: null,
      }));
    } catch (error) {
      setProjectError(
        error.message || "Unable to delete project."
      );
    }
  };

  const handleAnalyzeRepository = async (projectId) => {
    setAnalyzingProjectId(projectId);
    setAnalysisMessage({});

    try {
      const response = await fetch(
        `${API_URL}/api/projects/${projectId}/analyze`,
        {
          method: "POST",
          headers: apiHeaders(),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Unable to analyze repository.");
      }

      const contextResponse = await fetch(
        `${API_URL}/api/projects/${projectId}/context`,
        { headers: apiHeaders() }
      );
      const contextData = await contextResponse.json().catch(() => ({}));

      if (!contextResponse.ok) {
        throw new Error(
          contextData.message || "Unable to load repository context."
        );
      }

      const context = contextData.context || data.context;

      setEngineeringContexts((current) => ({
        ...current,
        [projectId]: context || null,
      }));
      setAnalysisMessage({
        type: "success",
        projectId,
        message: "Analysis completed.",
      });
    } catch (error) {
      setAnalysisMessage({
        type: "error",
        projectId,
        message: error.message || "Unable to analyze repository.",
      });
    } finally {
      setAnalyzingProjectId("");
    }
  };

  /* =========================================================
     GITHUB
  ========================================================= */

  const openGithubRepositoryPicker = async (projectId) => {
    setGithubProjectId(projectId);
    setGithubPickerOpen(true);
    setGithubLoading(true);
    setGithubError("");

    try {
      const response = await fetch(
        `${API_URL}/api/github/repositories`,
        {
          headers: apiHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to load GitHub repositories."
        );
      }

      setGithubRepositories(
        data.repositories || []
      );
    } catch (error) {
      setGithubError(
        error.message ||
          "Unable to load repositories."
      );
    } finally {
      setGithubLoading(false);
    }
  };

  const handleConnectGithub = async (projectId) => {
    const project = projects.find(
      (item) => item._id === projectId
    );

    if (project?.github?.connected) {
      await openGithubRepositoryPicker(projectId);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/github/auth?projectId=${projectId}`,
        {
          headers: apiHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to start GitHub connection."
        );
      }

      if (data.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (error) {
      setGithubError(
        error.message ||
          "Unable to connect GitHub."
      );
    }
  };

  const handleSelectRepository = async (repository) => {
    setGithubLoading(true);
    setGithubError("");

    try {
      const response = await fetch(
        `${API_URL}/api/github/projects/${githubProjectId}/repository`,
        {
          method: "POST",
          headers: {
            ...apiHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            repositoryId: repository.id,
            owner: repository.owner?.login,
            name: repository.name,
            fullName: repository.full_name,
            url: repository.html_url,
            branch:
              repository.default_branch || "main",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to connect repository."
        );
      }

      if (data.project) {
        setProjects((current) =>
          current.map((project) =>
            project._id === githubProjectId
              ? data.project
              : project
          )
        );
      }

      setGithubPickerOpen(false);
      setSyncMessage(
        "GitHub repository connected successfully."
      );
    } catch (error) {
      setGithubError(
        error.message ||
          "Unable to connect repository."
      );
    } finally {
      setGithubLoading(false);
    }
  };

  const handleSyncRepository = async (projectId) => {
    setSyncingProjectId(projectId);
    setSyncMessage("");

    try {
      if (!token()) {
        handleUnauthorized();
        return;
      }

      const response = await fetch(
        `${API_URL}/api/projects/${projectId}/sync`,
        {
          method: "POST",
          headers: apiHeaders(),
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        if (data.code === "GITHUB_REAUTH_REQUIRED") {
          setProjects((current) =>
            current.map((project) =>
              project._id === projectId
                ? {
                    ...project,
                    github: {
                      ...project.github,
                      connected: false,
                    },
                  }
                : project
            )
          );
        }

        throw new Error(
          data.message ||
            "Unable to sync repository."
        );
      }

      setProjects((current) =>
        current.map((project) =>
          project._id === projectId
            ? {
                ...project,
                repositorySnapshot: data.snapshot || null,
                github: {
                  ...project.github,
                  lastSyncedAt:
                    data.snapshot?.syncedAt ||
                    data.project?.github
                      ?.lastSyncedAt ||
                    project.github?.lastSyncedAt || null,
                },
              }
            : project
        )
      );

      setEngineeringContexts((current) => ({
        ...current,
        [projectId]: null,
      }));

      setSyncMessage(
        data.cached
          ? "Repository was already synced recently. Existing sync data loaded."
          : data.snapshot?.status === "synced"
            ? "Repository synced successfully."
            : data.message || "Repository sync did not complete."
      );
    } catch (error) {
      setSyncMessage(
        error.message ||
          "Unable to sync repository."
      );
    } finally {
      setSyncingProjectId("");
    }
  };

  /* =========================================================
     TEAM
  ========================================================= */

  const handleInviteTeammate = async (event) => {
    event.preventDefault();

    setInviteError("");
    setSendingInvite(true);

    try {
      const email = inviteEmail.trim().toLowerCase();

      if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ) {
        throw new Error(
          "Enter a valid email address."
        );
      }

      if (!user.workspace) {
        throw new Error(
          "Create a workspace before inviting teammates."
        );
      }

      const workspace = {
        workspaceName:
          user.workspace.name,
        workspaceSlug:
          user.workspace.slug,
        description:
          user.workspace.description || "",
        visibility:
          user.workspace.visibility || "private",
      };

      const response = await fetch(
        `${API_URL}/api/auth/onboarding/complete`,
        {
          method: "POST",
          headers: {
            ...apiHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            workspace,
            invites: [email],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to send invitation."
        );
      }

      setUser((current) => ({
        ...current,
        ...(data.user || {}),
        workspace: {
          ...(current.workspace || {}),
          ...(data.user?.workspace || {}),
          pendingInvites: [
            ...(current.workspace?.pendingInvites ||
              []),
            {
              email,
              status: "pending",
            },
          ],
        },
      }));

      setInviteEmail("");
      setInviteDialogOpen(false);
    } catch (error) {
      setInviteError(
        error.message ||
          "Unable to send invitation."
      );
    } finally {
      setSendingInvite(false);
    }
  };

  /* =========================================================
     INVITATIONS
  ========================================================= */

  const handleInvitation = async (
    invitationToken,
    action
  ) => {
    try {
      const response = await fetch(
        `${API_URL}/api/auth/invitations/${invitationToken}/${action}`,
        {
          method: "POST",
          headers: apiHeaders(),
        }
      );

      if (!response.ok) {
        return;
      }

      const result = await response.json().catch(() => ({}));

      const invitation =
        user.invitations?.find(
          (item) =>
            item.token === invitationToken
        );

      if (action === "accept") {
        if (result.workspaceId) {
          setSelectedWorkspaceId(result.workspaceId);
        }

        setUser((current) => ({
          ...current,
          workspace:
            invitation?.workspace
              ? {
                  ...invitation.workspace,
                  memberCount: 1,
                  members: [
                    {
                      name:
                        current.name ||
                        current.email,
                      email: current.email,
                      role: "member",
                    },
                  ],
                  pendingInvites: [],
                }
              : current.workspace,
          invitations:
            current.invitations.filter(
              (item) =>
                item.token !== invitationToken
            ),
        }));

        return;
      }

      setUser((current) => ({
        ...current,
        invitations:
          current.invitations.filter(
            (item) =>
              item.token !== invitationToken
          ),
      }));
    } catch (error) {
      console.error(
        "Invitation action failed:",
        error
      );
    }
  };

  /* =========================================================
     WORKSPACE
  ========================================================= */

  const handleCopyWorkspaceSlug = async () => {
    if (!user.workspace?.slug) return;

    try {
      await navigator.clipboard.writeText(
        user.workspace.slug
      );

      setCopiedSlug(true);

      setTimeout(
        () => setCopiedSlug(false),
        1800
      );
    } catch {
      setWorkspaceActionError(
        "Unable to copy workspace slug."
      );
    }
  };

  const handleDeleteWorkspace = async () => {
    setWorkspaceActionError("");

    if (
      !window.confirm(
        "Delete this workspace and its pending invitations?"
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/auth/workspace`,
        {
          method: "DELETE",
          headers: apiHeaders(),
        }
      );

      if (!response.ok) {
        const data =
          await response.json().catch(
            () => ({})
          );

        throw new Error(
          data.message ||
            "Only the workspace owner can delete it."
        );
      }

      localStorage.removeItem(
        "completedWorkspace"
      );
      localStorage.removeItem(
        "onboardingWorkspace"
      );
      localStorage.removeItem(
        "onboardingProfile"
      );
      localStorage.removeItem(
        "onboardingInvites"
      );

      setUser((current) => ({
        ...current,
        workspace: null,
        invitations: [],
      }));

      setProjects([]);
    } catch (error) {
      setWorkspaceActionError(
        error.message ||
          "Unable to delete workspace."
      );
    }
  };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (checkingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F5F6F8]">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-[#FF5C35] border-t-transparent" />

          <p className="mt-4 text-sm text-[#77716A]">
            Loading Syncora...
          </p>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }
  const dashboard = {
    activeNav,
    aiAnswer,
    aiError,
    aiLoading,
    aiProjectId,
    aiQuestion,
    aiRetrieval,
    aiSources,
    analysisDetailTabs,
    analysisMessage,
    analyzingProjectId,
    engineeringContexts,
    expandedAnalysisProjects,
    connectedProjects,
    copiedSlug,
    creatingProject,
    githubError,
    githubLoading,
    githubPickerOpen,
    githubRepositories,
    handleAnalyzeRepository,
    handleAskSyncora,
    handleConnectGithub,
    handleCopyWorkspaceSlug,
    handleCreateProject,
    handleDeleteProject,
    handleDeleteWorkspace,
    handleInvitation,
    handleInviteTeammate,
    handleLogout,
    handleNavClick,
    handleSaveWorkspace,
    handleSelectRepository,
    handleSyncRepository,
    inviteDialogOpen,
    inviteEmail,
    inviteError,
    memberCount,
    navigate,
    navItems,
    openGithubRepositoryPicker,
    openProjectDialog,
    openWorkspaceEditor,
    overflowOpen,
    projectCollaborators,
    projectDialogOpen,
    projectError,
    projectForm,
    projects,
    savingWorkspace,
    selectedAiProject,
    selectedWorkspaceId,
    sendingInvite,
    setAiAnswer,
    setAiError,
    setAiProjectId,
    setAiQuestion,
    setAnalysisDetailTab,
    setGithubPickerOpen,
    setInviteDialogOpen,
    setInviteEmail,
    setProjectCollaborators,
    setProjectDialogOpen,
    setProjectForm,
    setSelectedWorkspaceId,
    setSidebarOpen,
    setUser,
    setWorkspaceDetailsExpanded,
    setWorkspaceEdit,
    setWorkspaceEditorOpen,
    setOverflowOpen,
    sidebarOpen,
    syncMessage,
    syncingProjectId,
    toggleAnalysisDetails,
    token,
    user,
    workspaceActionError,
    workspaceDetailsExpanded,
    workspaceEdit,
    workspaceEditorOpen,
    workspaceName,
    workspaces,
  };

  return (
    <Sidebar
      dashboard={dashboard}
      modals={<Modals dashboard={dashboard} />}
    >
      {activeNav === "Overview" && <Overview dashboard={dashboard} />}
      {activeNav === "Workspace" && <Workspace dashboard={dashboard} />}
      {activeNav === "Projects" && <Projects dashboard={dashboard} />}
      {activeNav === "Team" && <Team dashboard={dashboard} />}
      {activeNav === "AI workspace" && <AI dashboard={dashboard} />}
    </Sidebar>
  );
};

export default Dashboard;
