import crypto from "node:crypto";

const getKey = () =>
  crypto
    .createHash("sha256")
    .update(process.env.GITHUB_TOKEN_ENCRYPTION_KEY || "")
    .digest();

export const encryptSecret = (value) => {
  if (!process.env.GITHUB_TOKEN_ENCRYPTION_KEY) {
    throw new Error("GITHUB_TOKEN_ENCRYPTION_KEY is not configured.");
  }

  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);

  return {
    encrypted: encrypted.toString("base64"),
    iv: iv.toString("base64"),
    authTag: cipher.getAuthTag().toString("base64"),
  };
};

export const decryptSecret = ({ encrypted, iv, authTag }) => {
  if (!process.env.GITHUB_TOKEN_ENCRYPTION_KEY) {
    throw new Error("GITHUB_TOKEN_ENCRYPTION_KEY is not configured.");
  }

  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    getKey(),
    Buffer.from(iv, "base64")
  );
  decipher.setAuthTag(Buffer.from(authTag, "base64"));

  return Buffer.concat([
    decipher.update(Buffer.from(encrypted, "base64")),
    decipher.final(),
  ]).toString("utf8");
};
