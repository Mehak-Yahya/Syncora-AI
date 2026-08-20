import Invitation from "../models/Invitation.js";
import Workspace from "../models/Workspace.js";

export const createWorkspace = async (req, res) => {
  try {
    const workspaceName = req.body.name?.trim();

    if (!workspaceName) {
      return res.status(400).json({
        success: false,
        message: "Workspace name is required.",
      });
    }

    const baseSlug =
      req.body.slug?.trim().toLowerCase() ||
      workspaceName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    let slug = baseSlug || "workspace";
    let suffix = 2;

    while (await Workspace.exists({ slug })) {
      slug = `${baseSlug || "workspace"}-${suffix}`;
      suffix += 1;
    }

    const workspace = await Workspace.create({
      name: workspaceName,
      slug,
      description: req.body.description?.trim() || "",
      visibility: req.body.visibility === "public" ? "public" : "private",
      owner: req.user._id,
      members: [{ user: req.user._id, role: "owner" }],
    });

    return res.status(201).json({
      success: true,
      message: "Workspace created.",
      workspace: workspace.toObject(),
    });
  } catch (error) {
    console.error("Workspace creation error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to create workspace.",
    });
  }
};

export const listWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({
      $or: [
        { owner: req.user._id },
        { "members.user": req.user._id },
      ],
    })
      .select("name slug description visibility owner members")
      .populate("members.user", "name email");

    const normalizedWorkspaces = workspaces.map((workspace) => {
      const data = workspace.toObject();
      const members = (data.members || []).map((member) => ({
        name: member.user?.name || member.user?.email || "Workspace member",
        email: member.user?.email || "",
        role: member.role || "member",
      }));

      if (
        String(data.owner) === String(req.user._id) &&
        !members.some((member) => member.role === "owner")
      ) {
        members.unshift({
          name: req.user.name || req.user.email,
          email: req.user.email,
          role: "owner",
        });
      }

      return {
        ...data,
        members,
        memberCount: members.length,
      };
    });

    return res.status(200).json({
      success: true,
      workspaces: normalizedWorkspaces,
    });
  } catch (error) {
    console.error("Workspace listing error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load workspaces.",
    });
  }
};

export const updateWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findOne({
      _id: req.params.workspaceId,
      owner: req.user._id,
    });

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found or you are not the owner.",
      });
    }

    const name = req.body.name?.trim();
    const description = req.body.description?.trim();

    if (name !== undefined && !name) {
      return res.status(400).json({
        success: false,
        message: "Workspace name is required.",
      });
    }

    if (name !== undefined) workspace.name = name;
    if (description !== undefined) workspace.description = description;
    if (req.body.visibility !== undefined) {
      workspace.visibility = req.body.visibility === "public" ? "public" : "private";
    }

    await workspace.save();

    return res.status(200).json({
      success: true,
      message: "Workspace updated.",
      workspace: workspace.toObject(),
    });
  } catch (error) {
    console.error("Workspace update error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update workspace.",
    });
  }
};

export const deleteWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findOne({ owner: req.user._id });

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found.",
      });
    }

    await Invitation.deleteMany({ workspace: workspace._id });
    await workspace.deleteOne();

    // Deleting a workspace does not make the account a new user.
    req.user.onboardingCompleted = true;
    await req.user.save();

    return res.status(200).json({
      success: true,
      message: "Workspace deleted.",
    });
  } catch (error) {
    console.error("Workspace deletion error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to delete workspace.",
    });
  }
};
