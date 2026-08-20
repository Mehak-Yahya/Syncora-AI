import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  connectRepository,
  githubCallback,
  listRepositories,
  startGitHubAuth,
} from "../controllers/githubController.js";

const router = express.Router();

router.get("/auth", authMiddleware, startGitHubAuth);
router.get("/callback", githubCallback);
router.get("/repositories", authMiddleware, listRepositories);
router.post("/projects/:projectId/repository", authMiddleware, connectRepository);

export default router;
