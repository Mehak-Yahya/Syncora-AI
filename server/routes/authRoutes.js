import express from "express";

import {
  signup,
  login,
  googleLogin,
  googleCallback,
  completeOnboarding,
  forgotPassword,
  verifyResetOtp,
  resendResetOtp,
  resetPassword,
} from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import {
  acceptInvitation,
  declineInvitation,
  listMyInvitations,
} from "../controllers/invitationController.js";
import {
  deleteWorkspace,
  createWorkspace,
  listWorkspaces,
  updateWorkspace,
} from "../controllers/workspaceController.js";
import Workspace from "../models/Workspace.js";
import Invitation from "../models/Invitation.js";

const router = express.Router();

// Authentication
router.post("/signup", signup);
router.post("/login", login);
router.get("/google", googleLogin);
router.get("/google/callback", googleCallback);
router.post("/onboarding/complete", authMiddleware, completeOnboarding);
router.get("/invitations/mine", authMiddleware, listMyInvitations);
router.post("/invitations/:token/accept", authMiddleware, acceptInvitation);
router.post("/invitations/:token/decline", authMiddleware, declineInvitation);
router.get("/workspace/list", authMiddleware, listWorkspaces);
router.post("/workspace", authMiddleware, createWorkspace);
router.delete("/workspace", authMiddleware, deleteWorkspace);
router.patch("/workspace/:workspaceId", authMiddleware, updateWorkspace);

// Password recovery
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/resend-reset-otp", resendResetOtp);
router.post("/reset-password", resetPassword);

// Current user
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const workspace = await Workspace.findOne({
      $or: [
        { owner: req.user._id },
        { "members.user": req.user._id },
      ],
    })
      .select("name slug description visibility owner members")
      .populate("members.user", "name email");

    const pendingInvites = workspace && String(workspace.owner) === String(req.user._id)
      ? await Invitation.find({
          workspace: workspace._id,
          status: "pending",
          expiresAt: { $gt: new Date() },
        }).select("email status expiresAt createdAt")
      : [];
    const incomingInvitations = await Invitation.find({
      email: req.user.email.toLowerCase(),
      status: "pending",
      expiresAt: { $gt: new Date() },
    })
      .select("+token email expiresAt")
      .populate("workspace", "name slug description")
      .populate("project", "name description");
    const workspaceMembers = workspace
      ? workspace.members.map((member) => ({
          name: member.user?.name || member.user?.email || "Workspace member",
          email: member.user?.email || "",
          role: member.role,
        }))
      : [];

    if (
      workspace &&
      String(workspace.owner) === String(req.user._id) &&
      !workspaceMembers.some((member) => member.role === "owner")
    ) {
      workspaceMembers.unshift({
        name: req.user.name || req.user.email,
        email: req.user.email,
        role: "owner",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        provider: req.user.provider,
        onboardingCompleted: req.user.onboardingCompleted,
        invitations: incomingInvitations.map((invitation) => ({
          token: invitation.token,
          expiresAt: invitation.expiresAt,
          workspace: invitation.workspace,
          project: invitation.project,
        })),
        workspace: workspace
          ? {
              id: workspace._id,
              owner: workspace.owner,
              name: workspace.name,
              slug: workspace.slug,
              description: workspace.description,
              visibility: workspace.visibility,
              memberCount: workspaceMembers.length,
              members: workspaceMembers,
              pendingInvites: pendingInvites.map((invite) => ({
                email: invite.email,
                status: invite.status,
                expiresAt: invite.expiresAt,
              })),
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Current user workspace error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load your workspace.",
    });
  }
});

export default router;