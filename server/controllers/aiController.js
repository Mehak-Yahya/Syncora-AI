import Project from "../models/Project.js";
import EngineeringContext from "../models/EngineeringContext.js";
import RepositorySnapshot from "../models/RepositorySnapshot.js";
import { buildProjectContext } from "../services/projectContextService.js";
import { generateProjectAnswer } from "../services/llmService.js";
import { retrieveRelevantCode } from "../services/codeRetrievalService.js";

const MAX_QUESTION_LENGTH = 1000;

export const chatWithProject = async (req, res) => {
  try {
    const question = typeof req.body?.question === "string"
      ? req.body.question.trim()
      : "";

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Enter a question for Syncora AI.",
      });
    }

    if (question.length > MAX_QUESTION_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `Question must be ${MAX_QUESTION_LENGTH} characters or fewer.`,
      });
    }

    const project = await Project.findOne({
      _id: req.params.projectId,
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found or you do not have access to it.",
      });
    }

    const engineeringContext = await EngineeringContext.findOne({
      project: project._id,
      analysisStatus: "completed",
    });

    if (!engineeringContext) {
      return res.status(409).json({
        success: false,
        message: "Analyze this repository before asking Syncora AI questions.",
      });
    }

    const snapshot = await RepositorySnapshot.findOne({
      _id: engineeringContext.repositorySnapshot,
      project: project._id,
      status: "synced",
    });

    if (!snapshot) {
      return res.status(409).json({
        success: false,
        message: "Sync this repository before asking Syncora AI questions.",
      });
    }

    const projectContext = buildProjectContext({
      project,
      engineeringContext,
      snapshot,
    });
    const retrieval = await retrieveRelevantCode({
      projectId: project._id,
      snapshotId: snapshot._id,
      question,
    });
    projectContext.relevantCode = retrieval.chunks;
    const answer = await generateProjectAnswer({ question, projectContext });

    return res.status(200).json({
      success: true,
      answer,
      projectId: project._id,
      contextUsed: true,
      retrieval: {
        indexed: retrieval.indexed,
        chunkCount: retrieval.chunks.length,
      },
      sources: retrieval.sources,
    });
  } catch (error) {
    console.error("Project AI error:", error.message);

    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Unable to answer this question right now.",
      code: error.code,
    });
  }
};
