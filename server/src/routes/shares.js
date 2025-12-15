import { Router } from "express";
import { nanoid } from "nanoid";
import { prisma } from "../db/prisma.js";
import { requireAuth } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { createShareSchema } from "../validators.js";
import { config } from "../config.js";

export const sharesRouter = Router();

// Public tracking endpoint
sharesRouter.post("/:id/track", async (req, res) => {
  const { id } = req.params;
  const { event } = req.body || {};
  if (!["click", "redemption"].includes(event)) {
    return res.status(400).json({ message: "Invalid event" });
  }
  const share = await prisma.share.findUnique({ where: { id } });
  if (!share) return res.status(404).json({ message: "Share not found" });
  const data =
    event === "click"
      ? { clicks: { increment: 1 } }
      : { redemptions: { increment: 1 } };
  const updated = await prisma.share.update({
    where: { id },
    data,
  });
  await prisma.analyticsEvent.create({
    data: {
      couponId: share.couponId,
      eventType: event === "click" ? "click" : "redemption",
      meta: { shareId: id },
    },
  });
  return res.json({ data: updated });
});

sharesRouter.get("/:couponId", requireAuth, async (req, res) => {
  const coupon = await prisma.coupon.findUnique({ where: { id: req.params.couponId } });
  if (!coupon) return res.status(404).json({ message: "Coupon not found" });
  const business = await prisma.business.findUnique({ where: { ownerId: req.user.id } });
  if (!business || coupon.businessId !== business.id) {
    return res.status(403).json({ message: "Access denied" });
  }
  const shares = await prisma.share.findMany({
    where: { couponId: coupon.id },
    orderBy: { createdAt: "desc" },
  });
  return res.json({ data: shares });
});

sharesRouter.post("/", requireAuth, validate(createShareSchema), async (req, res) => {
  const { couponId, type, channel, config: cfg } = req.body;
  const coupon = await prisma.coupon.findUnique({ where: { id: couponId } });
  if (!coupon) return res.status(404).json({ message: "Coupon not found" });
  const business = await prisma.business.findUnique({ where: { ownerId: req.user.id } });
  if (!business || coupon.businessId !== business.id) {
    return res.status(403).json({ message: "Access denied" });
  }
  const shareId = nanoid();
  const shareUrlBase = (config.clientOrigin || "http://localhost:5173").replace(/\/+$/, "");
  const shareUrl = `${shareUrlBase}/redeem/${shareId}`;

  const share = await prisma.share.create({
    data: {
      id: shareId,
      couponId,
      type,
      channel: channel || null,
      config: { ...(cfg || {}), shareUrl },
    },
  });
  return res.status(201).json({ data: share });
});
