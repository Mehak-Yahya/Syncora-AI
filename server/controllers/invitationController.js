import Invitation from "../models/Invitation.js";
import Workspace from "../models/Workspace.js";
import Project from "../models/Project.js";

export const listMyInvitations = async (req, res) => {
  try {
    const invitations = await Invitation.find({
      email: req.user.email.toLowerCase(),
      status: "pending",
      expiresAt: { $gt: new Date() },
    })
      .select("+token email expiresAt createdAt")
      .populate("workspace", "name slug description")
      .populate("project", "name description");

    return res.status(200).json({
      success: true,
      invitations: invitations.map((invitation) => ({
        token: invitation.token,
        email: invitation.email,
        expiresAt: invitation.expiresAt,
        workspace: invitation.workspace,
        project: invitation.project,
      })),
    });
  } catch (error) {
    console.error("Invitation listing error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load invitations.",
    });
  }
};

export const acceptInvitation = async (req, res) => {
  try {
    const invitation = await Invitation.findOne({
      token: req.params.token,
      status: "pending",
      expiresAt: { $gt: new Date() },
    });

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message: "This invitation is invalid or has expired.",
      });
    }

    if (invitation.email !== req.user.email.toLowerCase()) {
      return res.status(403).json({
        success: false,
        message: "Sign in with the invited email address to accept this invitation.",
      });
    }

    await Workspace.findByIdAndUpdate(invitation.workspace, {
      $addToSet: {
        members: { user: req.user._id, role: "member" },
      },
    });

    if (invitation.project) {
      await Project.findByIdAndUpdate(invitation.project, {
        $addToSet: { members: req.user._id },
      });
    }

    invitation.status = "accepted";
    await invitation.save();

    return res.status(200).json({
      success: true,
      message: "Invitation accepted.",
      workspaceId: invitation.workspace,
      projectId: invitation.project || null,
    });
  } catch (error) {
    console.error("Invitation acceptance error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to accept this invitation.",
    });
  }
};

export const declineInvitation = async (req, res) => {
  try {
    const invitation = await Invitation.findOne({
      token: req.params.token,
      email: req.user.email.toLowerCase(),
      status: "pending",
    });

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message: "Invitation not found or already handled.",
      });
    }

    if (invitation.project) {
      await Project.findByIdAndUpdate(invitation.project, {
        $pull: { members: req.user._id },
      });
    } else {
      await Workspace.findByIdAndUpdate(invitation.workspace, {
        $pull: {
          members: { user: req.user._id },
        },
      });
    }

    invitation.status = "declined";
    await invitation.save();

    return res.status(200).json({
      success: true,
      message: "Invitation declined.",
    });
  } catch (error) {
    console.error("Invitation decline error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to decline invitation.",
    });
  }
};
