
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import githubRoutes from "./routes/githubRoutes.js";
import syncRoutes from "./routes/syncRoutes.js";
import repositoryAnalysisRoutes from "./routes/repositoryAnalysisRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ---------------------------------------------
// Routes
// ---------------------------------------------

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Syncora API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/github", githubRoutes);
app.use("/api", syncRoutes);
app.use("/api", repositoryAnalysisRoutes);
app.use("/api", aiRoutes);

// ---------------------------------------------
// 404 handler
// ---------------------------------------------

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found.",
  });
});

// ---------------------------------------------
// Global error handler
// ---------------------------------------------

app.use((error, req, res, next) => {
  console.error("API error:", error);

  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error.",
  });
});

export default app;

