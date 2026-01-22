import { Router } from "express";
import { createRequire } from "module";
import { config } from "../config.js";

const require = createRequire(import.meta.url);
const pkg = require("../../package.json");
const version = pkg?.version || "unknown";

export const buildHealthPayload = ({ status, env, version: resolvedVersion }) => ({
  status,
  env,
  version: resolvedVersion,
});

export const healthRouter = Router();

healthRouter.get("/healthz", (_req, res) => {
  res.json(buildHealthPayload({ status: "ok", env: config.env, version }));
});
