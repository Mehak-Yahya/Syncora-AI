
import mongoose from "mongoose";

const engineeringContextSchema = new mongoose.Schema(
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

    summary: {
      type: String,
      default: "",
    },

    architecture: {
      type: String,
      default: "",
    },

    technologies: {
      languages: {
        type: [String],
        default: [],
      },

      frameworks: {
        type: [String],
        default: [],
      },

      frontend: {
        type: [String],
        default: [],
      },

      backend: {
        type: [String],
        default: [],
      },

      database: {
        type: [String],
        default: [],
      },

      authentication: {
        type: [String],
        default: [],
      },

      testing: {
        type: [String],
        default: [],
      },

      deployment: {
        type: [String],
        default: [],
      },
    },

    importantFiles: [
      {
        path: String,
        purpose: String,
      },
    ],

    projectStructure: {
      type: [
        new mongoose.Schema(
          {
            path: String,
            type: String,
          },
          { _id: false }
        ),
      ],
      default: [],
    },

    activity: {
      commits: {
        type: Number,
        default: 0,
      },

      openIssues: {
        type: Number,
        default: 0,
      },

      openPullRequests: {
        type: Number,
        default: 0,
      },

      lastCommitAt: {
        type: Date,
        default: null,
      },
    },

    analysisStatus: {
      type: String,
      enum: ["pending", "analyzing", "completed", "failed"],
      default: "pending",
    },

    analysisError: {
      type: String,
      default: "",
    },

    analyzedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "EngineeringContext",
  engineeringContextSchema
);

