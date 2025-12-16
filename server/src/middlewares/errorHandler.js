import { logger } from "../logger.js";

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, _next) => {
  logger.error({ err, path: req.path }, "Unhandled error");
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Internal server error",
    ...(err.details ? { details: err.details } : {}),
  });
};
