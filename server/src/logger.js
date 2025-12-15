import pino from "pino";
import pinoHttp from "pino-http";
import { config } from "./config.js";

const baseLogger = pino({
  level: process.env.LOG_LEVEL || (config.env === "production" ? "info" : "debug"),
  transport: config.env === "production" ? undefined : { target: "pino-pretty" },
});

export const logger = baseLogger;
export const httpLogger = pinoHttp({
  logger: baseLogger,
  customProps: (req) => ({ requestId: req.id }),
});
