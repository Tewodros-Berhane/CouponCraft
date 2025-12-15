import { Router } from "express";
import QRCode from "qrcode";
import { prisma } from "../db/prisma.js";

export const qrRouter = Router();

qrRouter.get("/:shareId", async (req, res) => {
  const share = await prisma.share.findUnique({ where: { id: req.params.shareId } });
  if (!share) return res.status(404).json({ message: "Share not found" });
  const link = share.config?.shareUrl || share.config?.link || share.config?.url;
  if (!link) return res.status(400).json({ message: "Share link not available" });
  try {
    const png = await QRCode.toBuffer(link, { margin: 1, width: 320 });
    res.setHeader("Content-Type", "image/png");
    res.send(png);
  } catch (err) {
    res.status(500).json({ message: "Failed to generate QR" });
  }
});
