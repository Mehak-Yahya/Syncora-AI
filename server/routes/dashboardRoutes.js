import express from "express";
import protect from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import Workspace from "../models/Workspace.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password"
    );
    const workspace = await Workspace.findOne({
      $or: [
        { owner: req.user._id },
        { "members.user": req.user._id },
      ],
    }).select("name slug description visibility members");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        provider: user.provider,
        onboardingCompleted: user.onboardingCompleted,
        workspace: workspace
          ? {
              id: workspace._id,
              name: workspace.name,
              slug: workspace.slug,
              description: workspace.description,
              visibility: workspace.visibility,
              memberCount: workspace.members.length,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Dashboard route error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load dashboard.",
    });
  }
});

export default router;

