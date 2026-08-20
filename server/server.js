import dotenv from "dotenv";
dotenv.config();

import "./config/auth.js";
import app from "./app.js";
import connectDB from "./config/db.js";
import mongoose from "mongoose";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  // Remove the legacy single-workspace owner index after allowing multiple workspaces.
  try {
    await mongoose.connection.collection("workspaces").dropIndex("owner_1");
    console.log("Removed legacy workspace owner index");
  } catch (error) {
    if (error.codeName !== "IndexNotFound") {
      console.error("Workspace index migration warning:", error.message);
    }
  }

  app.listen(PORT, () => {
    console.log(`Syncora API running on port ${PORT}`);
  });
};

startServer();