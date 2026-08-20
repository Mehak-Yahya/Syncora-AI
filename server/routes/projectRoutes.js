import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
	createProject,
	deleteProject,
	listProjects,
} from "../controllers/projectController.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/", listProjects);
router.post("/", createProject);
router.delete("/:projectId", deleteProject);

export default router;
