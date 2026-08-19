import express from "express";

import {
  signup,
  login,
  googleLogin,
  googleCallback,
  forgotPassword,
  verifyResetOtp,
  resendResetOtp,
  resetPassword,
} from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Authentication
router.post("/signup", signup);
router.post("/login", login);
router.get("/google", googleLogin);
router.get("/google/callback", googleCallback);

// Password recovery
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/resend-reset-otp", resendResetOtp);
router.post("/reset-password", resetPassword);

// Current user
router.get("/me", authMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      provider: req.user.provider,
    },
  });
});

export default router;