
import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  analyzeRepository,
  getEngineeringContext,
} from "../controllers/repositoryAnalysisController.js";

const router = express.Router();

router.use(authMiddleware);

// Analyze a synced repository
router.post(
  "/projects/:projectId/analyze",
  analyzeRepository
);

// Get the generated Engineering Context
router.get(
  "/projects/:projectId/context",
  getEngineeringContext
);

export default router;

