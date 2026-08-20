import mongoose from "mongoose";

const codeChunkSchema = new mongoose.Schema(
  {
    path: String,
    language: String,
    content: String,
    startLine: Number,
    endLine: Number,
  },
  { _id: false }
);

const codebaseIndexSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      unique: true,
      index: true,
    },
    repositorySnapshot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RepositorySnapshot",
      required: true,
    },
    status: {
      type: String,
      enum: ["indexing", "ready", "failed"],
      default: "indexing",
    },
    fileCount: { type: Number, default: 0 },
    chunkCount: { type: Number, default: 0 },
    error: { type: String, default: "" },
    chunks: { type: [codeChunkSchema], default: [] },
    indexedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("CodebaseIndex", codebaseIndexSchema);
