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
  const isProd = (process.env.NODE_ENV || "development") === "production";
  if (isProd) {
    throw new Error(`[config] Missing env vars: ${missing.join(", ")}`);
  }
  // Warn instead of crash to ease local onboarding.
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
  uploadLimit: process.env.UPLOAD_BODY_LIMIT || "5mb",
  corsOrigins: (process.env.CLIENT_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((o) => sanitizeOrigin(o.trim()))
    .filter(Boolean),
  databaseUrl: process.env.DATABASE_URL,
  cookieSecure:
    typeof process.env.COOKIE_SECURE === "string"
      ? process.env.COOKIE_SECURE === "true"
      : (process.env.NODE_ENV || "development") === "production",
  cookieSameSite: (process.env.COOKIE_SAMESITE || "lax").toLowerCase(),
};

export { sanitizeOrigin };
