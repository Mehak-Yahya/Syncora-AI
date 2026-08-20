import mongoose from "mongoose";

const repositorySnapshotSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      unique: true,
    },
    commitSha: String,
    fileCount: {
      type: Number,
      default: 0,
    },
    folderCount: {
      type: Number,
      default: 0,
    },
    importantFiles: [mongoose.Schema.Types.Mixed],
    commit: mongoose.Schema.Types.Mixed,
    metadata: mongoose.Schema.Types.Mixed,
    files: [mongoose.Schema.Types.Mixed],
    commits: [mongoose.Schema.Types.Mixed],
    issues: [mongoose.Schema.Types.Mixed],
    pullRequests: [mongoose.Schema.Types.Mixed],
    status: {
      type: String,
      enum: ["syncing", "synced", "failed"],
      default: "syncing",
    },
    error: String,
    syncedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("RepositorySnapshot", repositorySnapshotSchema);
