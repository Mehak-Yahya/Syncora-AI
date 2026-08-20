import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },

    password: {
      type: String,
      required: function () {
        return this.provider === "local";
      },
      minlength: 8,
      select: false,
    },

    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
      required: true,
    },

    onboardingCompleted: {
      type: Boolean,
      default: false,
    },

    // Password reset fields
    resetOtp: {
      type: String,
      select: false,
    },

    resetOtpExpires: {
      type: Date,
      select: false,
    },

    resetOtpAttempts: {
      type: Number,
      default: 0,
      select: false,
    },

    resetOtpVerified: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);