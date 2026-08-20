import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getSyncStatus, syncRepository } from "../controllers/syncController.js";

const router = express.Router();

router.use(authMiddleware);
router.post("/projects/:projectId/sync", syncRepository);
router.get("/projects/:projectId/sync/status", getSyncStatus);

export default router;
