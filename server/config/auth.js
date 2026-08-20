import dotenv from "dotenv";

dotenv.config();

const jwtSecret =
  process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET;

if (!jwtSecret) {
  throw new Error(
    "JWT_SECRET or JWT_ACCESS_SECRET must be configured."
  );
}

export default jwtSecret;