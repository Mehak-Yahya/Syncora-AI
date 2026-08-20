import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "paused", "completed"],
      default: "active",
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    github: {
      connected: {
        type: Boolean,
        default: false,
      },
      connectedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      repositoryId: Number,
      owner: String,
      name: String,
      fullName: String,
      url: String,
      branch: String,
      lastSyncedAt: Date,
    },
  },
  { timestamps: true }
);

projectSchema.index({ workspace: 1, createdAt: -1 });

export default mongoose.model("Project", projectSchema);
