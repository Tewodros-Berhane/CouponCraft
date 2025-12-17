import express, { Router } from "express";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { nanoid } from "nanoid";
import { requireAuth } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { signUploadSchema } from "../validators.js";
import { config } from "../config.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const uploadsRouter = Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.resolve(__dirname, "../../uploads");

const allowedContentTypes = new Map([
  ["image/png", ".png"],
  ["image/jpeg", ".jpg"],
  ["image/webp", ".webp"],
  ["image/svg+xml", ".svg"],
]);

const isSafeKey = (key) => /^[a-zA-Z0-9_-]+\.(png|jpg|webp|svg)$/.test(key);

const signaturePayload = ({ key, contentType, exp }) => `${key}.${contentType}.${exp}`;

const sign = (payload) => crypto.createHmac("sha256", config.jwtSecret).update(payload).digest("hex");

const safeEqual = (a, b) => {
  const aa = Buffer.from(String(a || ""), "utf8");
  const bb = Buffer.from(String(b || ""), "utf8");
  if (aa.length !== bb.length) return false;
  return crypto.timingSafeEqual(aa, bb);
};

// Public: resolve an uploaded asset
uploadsRouter.get("/assets/:key", asyncHandler(async (req, res) => {
  const { key } = req.params;
  if (!isSafeKey(key)) return res.status(404).json({ message: "Not found" });
  const filePath = path.join(uploadsDir, key);
  try {
    await fs.access(filePath);
    res.setHeader("Cache-Control", "public, max-age=3600");
    return res.sendFile(filePath);
  } catch {
    return res.status(404).json({ message: "Not found" });
  }
}));

// Public: signed upload PUT (raw body)
uploadsRouter.put(
  "/put/:key",
  express.raw({ type: "*/*", limit: config.uploadLimit }),
  asyncHandler(async (req, res) => {
    const { key } = req.params;
    const { exp, sig, contentType } = req.query || {};

    if (!isSafeKey(key)) return res.status(404).json({ message: "Not found" });
    if (!exp || !sig || !contentType) return res.status(400).json({ message: "Missing signature" });
    if (!allowedContentTypes.has(String(contentType))) {
      return res.status(400).json({ message: "Unsupported contentType" });
    }

    const expMs = Number(exp);
    if (!Number.isFinite(expMs) || expMs < Date.now()) {
      return res.status(403).json({ message: "Upload URL expired" });
    }

    const expected = sign(signaturePayload({ key, contentType, exp: expMs }));
    if (!safeEqual(expected, sig)) {
      return res.status(403).json({ message: "Invalid signature" });
    }

    const body = req.body;
    if (!Buffer.isBuffer(body) || body.length === 0) {
      return res.status(400).json({ message: "Empty upload" });
    }

    const ext = allowedContentTypes.get(String(contentType));
    if (!key.endsWith(ext)) {
      return res.status(400).json({ message: "Key does not match contentType" });
    }

    await fs.mkdir(uploadsDir, { recursive: true });
    const filePath = path.join(uploadsDir, key);
    try {
      await fs.writeFile(filePath, body, { flag: "wx" });
    } catch (err) {
      if (err?.code === "EEXIST") {
        return res.status(409).json({ message: "Upload already exists" });
      }
      throw err;
    }

    return res.status(200).send();
  })
);

// Authenticated: request a signed upload URL
uploadsRouter.post("/sign", requireAuth, validate(signUploadSchema), (req, res) => {
  const { contentType } = req.body;
  const ext = allowedContentTypes.get(contentType);
  if (!ext) {
    return res.status(400).json({ message: "Unsupported contentType" });
  }

  const key = `${Date.now()}-${nanoid()}${ext}`;
  const expiresIn = 900;
  const exp = Date.now() + expiresIn * 1000;
  const sig = sign(signaturePayload({ key, contentType, exp }));

  return res.json({
    uploadUrl: `/api/uploads/put/${encodeURIComponent(key)}?contentType=${encodeURIComponent(contentType)}&exp=${encodeURIComponent(exp)}&sig=${encodeURIComponent(sig)}`,
    assetUrl: `/api/uploads/assets/${encodeURIComponent(key)}`,
    contentType,
    expiresIn,
  });
});
