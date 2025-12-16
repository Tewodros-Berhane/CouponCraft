import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import { config, sanitizeOrigin } from "./config.js";
import { logger, httpLogger } from "./logger.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { csrfProtection } from "./middlewares/csrf.js";
import { healthRouter } from "./routes/health.js";
import { authRouter } from "./routes/auth.js";
import { couponsRouter } from "./routes/coupons.js";
import { businessRouter } from "./routes/business.js";
import { uploadsRouter } from "./routes/uploads.js";
import { sharesRouter } from "./routes/shares.js";
import { analyticsRouter } from "./routes/analytics.js";
import { redemptionRouter } from "./routes/redemption.js";
import { qrRouter } from "./routes/qr.js";
import { redeemRouter } from "./routes/redeem.js";

export const createApp = async () => {
  const app = express();
  app.disable("x-powered-by");
  app.use(
    helmet({
      contentSecurityPolicy: config.env === "production" ? undefined : false,
      crossOriginEmbedderPolicy: false,
    })
  );
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const normalized = sanitizeOrigin(origin);
        if (config.corsOrigins.includes(normalized)) {
          return callback(null, true);
        }
        const err = new Error("Not allowed by CORS");
        err.status = 403;
        return callback(err);
      },
      credentials: true,
    })
  );
  app.use(cookieParser());
  app.use(csrfProtection);
  app.use(express.json({ limit: config.jsonLimit || "1mb" }));
  app.use(httpLogger);

  const authLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use("/api/health", healthRouter);
  app.use("/api/auth", authLimiter, authRouter);
  app.use("/api/coupons", couponsRouter);
  app.use("/api/business", businessRouter);
  app.use("/api/uploads", uploadsRouter);
  app.use("/api/shares", sharesRouter);
  app.use("/api/analytics", analyticsRouter);
  app.use("/api/redemption", redemptionRouter);
  app.use("/api/qr", qrRouter);
  app.use("/api/redeem", redeemRouter);

  app.use((_req, res) => res.status(404).json({ message: "Not found" }));
  app.use(errorHandler);

  logger.info("App initialized");
  return app;
};
