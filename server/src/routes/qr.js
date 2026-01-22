import { Router } from "express";
import QRCode from "qrcode";
import { prisma } from "../db/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createRateLimiter } from "../utils/rateLimit.js";

export const qrRouter = Router();

const qrLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  limit: 60,
  keyPrefix: "qr",
});

qrRouter.get("/:shareId", qrLimiter, asyncHandler(async (req, res) => {
  const share = await prisma.share.findUnique({ where: { id: req.params.shareId } });
  if (!share) return res.status(404).json({ message: "Share not found" });
  const link = share.config?.shareUrl;
  if (!link) return res.status(400).json({ message: "Share link not available" });
  try {
    const format = (req.query.format || "png").toString().toLowerCase();
    const size = Math.min(Math.max(parseInt(req.query.size, 10) || 320, 200), 1000);
    if (format === "svg") {
      const svg = await QRCode.toString(link, { margin: 1, type: "svg", width: size });
      res.setHeader("Content-Type", "image/svg+xml");
      res.send(svg);
      return;
    }
    if (format !== "png") {
      res.status(400).json({ message: "Unsupported format" });
      return;
    }
    const png = await QRCode.toBuffer(link, { margin: 1, width: size });
    res.setHeader("Content-Type", "image/png");
    res.send(png);
  } catch (err) {
    res.status(500).json({ message: "Failed to generate QR" });
  }
}));
