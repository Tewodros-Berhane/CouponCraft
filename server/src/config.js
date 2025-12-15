import dotenv from "dotenv";

dotenv.config();

const required = [
  "JWT_SECRET",
  "CLIENT_ORIGIN",
  "DATABASE_URL",
];

const sanitizeOrigin = (origin) => origin?.replace(/\/+$/, "");

const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  // Warn instead of crash to ease local onboarding, but log clearly.
  // In production, prefer failing fast.
  console.warn(`[config] Missing env vars: ${missing.join(", ")}`);
}

export const config = {
  port: process.env.PORT || 4000,
  env: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  jsonLimit: process.env.JSON_BODY_LIMIT || "1mb",
  corsOrigins: (process.env.CLIENT_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((o) => sanitizeOrigin(o.trim()))
    .filter(Boolean),
  databaseUrl: process.env.DATABASE_URL,
};

export { sanitizeOrigin };
