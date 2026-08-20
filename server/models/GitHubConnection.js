import mongoose from "mongoose";

const githubConnectionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    encryptedAccessToken: {
      type: String,
      required: true,
      select: false,
    },
    iv: {
      type: String,
      required: true,
      select: false,
    },
    authTag: {
      type: String,
      required: true,
      select: false,
    },
    scopes: [String],
    connectedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("GitHubConnection", githubConnectionSchema);
