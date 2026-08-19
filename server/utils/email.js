import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendResetOtp = async (email, otp) => {
  await transporter.sendMail({
    from: `"Syncora" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Syncora password reset code",
    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 520px;
        margin: 0 auto;
        padding: 40px 24px;
        color: #171717;
      ">
        <div style="
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: #FF5C35;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 24px;
        ">
          S
        </div>

        <h1 style="font-size: 28px; margin-bottom: 12px;">
          Reset your password
        </h1>

        <p style="color: #77716A; line-height: 1.6;">
          We received a request to reset your Syncora password.
          Use the verification code below:
        </p>

        <div style="
          margin: 30px 0;
          padding: 20px;
          background: #FFF0EB;
          border-radius: 14px;
          text-align: center;
        ">
          <span style="
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #FF5C35;
          ">
            ${otp}
          </span>
        </div>

        <p style="color: #77716A; line-height: 1.6;">
          This code expires in <strong>10 minutes</strong>.
        </p>

        <p style="
          margin-top: 30px;
          font-size: 13px;
          color: #9A948C;
        ">
          If you didn't request a password reset, you can safely ignore
          this email.
        </p>

        <p style="
          margin-top: 30px;
          font-weight: 600;
        ">
          — Syncora
        </p>
      </div>
    `,
  });
};