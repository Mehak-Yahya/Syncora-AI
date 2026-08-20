import Project from "../models/Project.js";
import RepositorySnapshot from "../models/RepositorySnapshot.js";
import Workspace from "../models/Workspace.js";
import Invitation from "../models/Invitation.js";
import crypto from "node:crypto";
import { sendInvitationEmail } from "../utils/email.js";

const getAccessibleWorkspace = (userId, workspaceId) =>
  Workspace.findOne({
    ...(workspaceId ? { _id: workspaceId } : {}),
    $or: [{ owner: userId }, { "members.user": userId }],
  });

export const listProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      ...(req.query.workspaceId ? { workspace: req.query.workspaceId } : {}),
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    })
      .sort({ createdAt: -1 })
      .select("name description status github createdAt owner members")
      .populate("owner", "name email")
      .populate("members", "name email")
      .lean();

    const snapshots = await RepositorySnapshot.find({
      project: { $in: projects.map((project) => project._id) },
    }).lean();

    const snapshotsByProject = new Map(
      snapshots.map((snapshot) => [
        snapshot.project.toString(),
        snapshot,
      ])
    );

    const projectsWithSnapshots = projects.map((project) => ({
      ...project,
      repositorySnapshot: snapshotsByProject.get(
        project._id.toString()
      ) || null,
    }));

    return res.status(200).json({
      success: true,
      projects: projectsWithSnapshots,
    });
  } catch (error) {
    console.error("Project listing error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load projects.",
    });
  }
};

export const createProject = async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const description = req.body.description?.trim() || "";
    const workspaceId = req.body.workspaceId;
    const collaborators = [
      ...new Set(
        (req.body.collaborators || [])
          .map((email) => email?.trim().toLowerCase())
          .filter((email) => email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      ),
    ];

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Project name is required.",
      });
    }

    const workspace = await getAccessibleWorkspace(req.user._id, workspaceId);

    if (!workspace) {
      return res.status(400).json({
        success: false,
        message: "Create or join a workspace before creating a project.",
      });
    }

    const project = await Project.create({
      workspace: workspace._id,
      owner: req.user._id,
      name,
      description,
      members: [req.user._id],
    });

    await Promise.all(
      collaborators.map(async (email) => {
        const invitation = await Invitation.create({
          workspace: workspace._id,
          project: project._id,
          inviter: req.user._id,
          email,
          token: crypto.randomBytes(32).toString("hex"),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        try {
          await sendInvitationEmail({
            email,
            inviterName: req.user.name || req.user.email,
            workspaceName: workspace.name,
            projectName: name,
            token: invitation.token,
          });
        } catch (emailError) {
          console.error("Project invitation email error:", emailError.message);
        }
      })
    );

    return res.status(201).json({ success: true, project });
  } catch (error) {
    console.error("Project creation error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to create project.",
    });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const workspace = await getAccessibleWorkspace(req.user._id);
    const project = workspace
      ? await Project.findOneAndDelete({
          _id: req.params.projectId,
          workspace: workspace._id,
        })
      : null;

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    return res.status(200).json({ success: true, message: "Project deleted." });
  } catch (error) {
    console.error("Project deletion error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to delete project.",
    });
  }
};
