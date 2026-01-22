import rateLimit from "express-rate-limit";

export const createRateLimiter = ({ windowMs, limit, keyPrefix }) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => `${keyPrefix}:${req.ip}`,
    message: { message: "Too many requests, please try again later." },
  });
