import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { chatWithProject } from "../controllers/aiController.js";

const router = express.Router();

router.use(authMiddleware);
router.post("/projects/:projectId/ai/chat", chatWithProject);

export default router;
