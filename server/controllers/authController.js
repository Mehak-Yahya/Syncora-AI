import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
import User from "../models/User.js";
import Workspace from "../models/Workspace.js";
import Invitation from "../models/Invitation.js";
import { hashPassword } from "../utils/password.js";
import { sendInvitationEmail, sendResetOtp } from "../utils/email.js";
import crypto from "node:crypto";
import jwtSecret from "../config/auth.js";

dotenv.config();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL
);

const redirectToLogin = (res, params) => {
  const query = new URLSearchParams(params).toString();
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

  return res.redirect(`${clientUrl}/login?${query}`);
};

// SIGNUP
export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Please enter a valid email address.",
      });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character.",
      });
    }

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      email: normalizedEmail,
      password: hashedPassword,
      provider: "local",
    });

    const token = jwt.sign(
      {
        userId: user._id,
      },
      jwtSecret,
      {
        expiresIn: "7d",
      }
    );

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        provider: user.provider,
        onboardingCompleted: user.onboardingCompleted,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    return res.status(500).json({
      message: "Something went wrong while creating your account.",
    });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Please enter a valid email address.",
      });
    }

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        code: "USER_NOT_FOUND",
        message:
          "No account exists with this email. Please create an account first.",
      });
    }

    if (user.provider !== "local") {
      return res.status(400).json({
        success: false,
        code: "GOOGLE_ACCOUNT",
        message:
          "This account uses Google sign-in. Please continue with Google.",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        code: "INVALID_PASSWORD",
        message:
          "Incorrect password. Please check your password and try again.",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
      },
      jwtSecret,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        provider: user.provider,
        onboardingCompleted: user.onboardingCompleted,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while logging in.",
    });
  }
};

export const completeOnboarding = async (req, res) => {
  try {
    const { workspace: workspaceInput = {}, invites = [] } = req.body;
    const workspaceName = workspaceInput.workspaceName?.trim();

    if (!workspaceName) {
      return res.status(400).json({
        success: false,
        message: "Workspace name is required.",
      });
    }

    let workspace = await Workspace.findOne({ owner: req.user._id });

    if (!workspace) {
      const baseSlug =
        workspaceInput.workspaceSlug?.trim().toLowerCase() ||
        workspaceName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      let slug = baseSlug || "workspace";
      let suffix = 2;

      while (await Workspace.exists({ slug })) {
        slug = `${baseSlug || "workspace"}-${suffix}`;
        suffix += 1;
      }

      workspace = await Workspace.create({
        name: workspaceName,
        slug,
        description: workspaceInput.description?.trim() || "",
        visibility: workspaceInput.visibility === "public" ? "public" : "private",
        owner: req.user._id,
        members: [{ user: req.user._id, role: "owner" }],
      });
    }

    const uniqueInvites = [
      ...new Set(
        invites
          .map((email) => email?.trim().toLowerCase())
          .filter((email) => email && emailRegex.test(email))
      ),
    ];

    const invitationResults = await Promise.all(
      uniqueInvites.map(async (email) => {
        const existing = await Invitation.findOne({
          workspace: workspace._id,
          email,
          status: "pending",
          expiresAt: { $gt: new Date() },
        });

        if (existing) return existing;

        const invitation = await Invitation.create({
          workspace: workspace._id,
          inviter: req.user._id,
          email,
          token: crypto.randomBytes(32).toString("hex"),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        try {
          await sendInvitationEmail({
            email,
            inviterName: req.user.name || req.user.email,
            workspaceName: workspace.name,
            token: invitation.token,
          });
        } catch (emailError) {
          console.error("Invitation email error:", emailError.message);
        }

        return invitation;
      })
    );

    req.user.onboardingCompleted = true;
    await req.user.save();

    return res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        provider: req.user.provider,
        onboardingCompleted: true,
        workspace: {
          id: workspace._id,
          owner: workspace.owner,
          name: workspace.name,
          slug: workspace.slug,
          memberCount: workspace.members.length,
        },
      },
      invitationsCreated: invitationResults.length,
    });
  } catch (error) {
    console.error("Onboarding completion error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to complete onboarding.",
    });
  }
};

// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account exists with this email.",
      });
    }

    if (user.provider !== "local") {
      return res.status(400).json({
        success: false,
        message:
          "This account uses Google sign-in. Please continue with Google.",
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    user.resetOtp = otp;

    // OTP valid for 10 minutes
    user.resetOtpExpires = new Date(
      Date.now() + 10 * 60 * 1000
    );

    user.resetOtpVerified = false;

    await user.save();

    await sendResetOtp(normalizedEmail, otp);

    return res.status(200).json({
      success: true,
      message: "Verification code sent successfully.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to send verification code.",
    });
  }
};

// RESEND RESET OTP
export const resendResetOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account exists with this email.",
      });
    }

    if (user.provider !== "local") {
      return res.status(400).json({
        success: false,
        message:
          "This account uses Google sign-in. Please continue with Google.",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    user.resetOtp = otp;
    user.resetOtpExpires = new Date(
      Date.now() + 10 * 60 * 1000
    );
    user.resetOtpVerified = false;

    await user.save();
    await sendResetOtp(normalizedEmail, otp);

    return res.status(200).json({
      success: true,
      message: "A new verification code has been sent.",
    });
  } catch (error) {
    console.error("Resend OTP error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to resend verification code.",
    });
  }
};

// VERIFY RESET OTP
export const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and verification code are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select(
      "+resetOtp +resetOtpExpires +resetOtpVerified"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Account not found.",
      });
    }

    if (!user.resetOtp || !user.resetOtpExpires) {
      return res.status(400).json({
        success: false,
        message:
          "No active verification code. Please request a new one.",
      });
    }

    if (user.resetOtpExpires < new Date()) {
      user.resetOtp = null;
      user.resetOtpExpires = null;
      user.resetOtpVerified = false;

      await user.save();

      return res.status(400).json({
        success: false,
        message:
          "This verification code has expired. Please request a new one.",
      });
    }

    if (user.resetOtp !== otp.toString()) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code.",
      });
    }

    user.resetOtpVerified = true;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully.",
    });
  } catch (error) {
    console.error("Verify OTP error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to verify the code.",
    });
  }
};
// RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email, verification code, and new password are required.",
      });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select(
      "+resetOtp +resetOtpExpires +resetOtpVerified"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Account not found.",
      });
    }

    if (!user.resetOtpVerified) {
      return res.status(400).json({
        success: false,
        message:
          "Please verify your email before resetting your password.",
      });
    }

    if (
      !user.resetOtp ||
      user.resetOtp !== otp.toString()
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code.",
      });
    }

    if (
      !user.resetOtpExpires ||
      user.resetOtpExpires < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Your verification code has expired. Please request a new one.",
      });
    }

    // Hash new password
    user.password = await bcrypt.hash(password, 12);

    // Clear reset data
    user.resetOtp = null;
    user.resetOtpExpires = null;
    user.resetOtpVerified = false;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully.",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to reset your password.",
    });
  }
};

// GOOGLE LOGIN
export const googleLogin = (req, res) => {
  const authorizationUrl = googleClient.generateAuthUrl({
    access_type: "offline",
    prompt: "select_account",
    scope: ["openid", "email", "profile"],
  });

  return res.redirect(authorizationUrl);
};

export const googleCallback = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return redirectToLogin(res, {
        googleError: "Google sign-in was cancelled.",
      });
    }

    const { tokens } = await googleClient.getToken(code);
    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const profile = ticket.getPayload();

    if (!profile?.sub || !profile.email || !profile.email_verified) {
      return redirectToLogin(res, {
        googleError: "Google could not verify this account.",
      });
    }

    const normalizedEmail = profile.email.toLowerCase();
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      user = await User.create({
        name: profile.name || "Syncora user",
        email: normalizedEmail,
        provider: "google",
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return redirectToLogin(res, { token });
  } catch (error) {
    console.error("Google login error:", error);

    return redirectToLogin(res, {
      googleError: "Unable to sign in with Google. Please try again.",
    });
  }
};