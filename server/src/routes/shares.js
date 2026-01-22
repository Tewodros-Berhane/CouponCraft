import { Router } from "express";
import rateLimit from "express-rate-limit";
import { prisma } from "../db/prisma.js";
import { requireAuth } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { createShareSchema } from "../validators.js";
import { config, sanitizeOrigin } from "../config.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createShareForCoupon, mapShareSummary } from "../services/shareService.js";

export const sharesRouter = Router();

const resolveShareOrigin = (req) => {
  const requestOrigin = req?.get?.("origin");
  if (requestOrigin) {
    const normalized = sanitizeOrigin(requestOrigin);
    if (config.corsOrigins.includes(normalized)) return normalized;
  }

  const fallback = config.corsOrigins?.[0] || config.clientOrigin || "http://localhost:5173";
  const first = String(fallback).split(",")[0].trim();
  return sanitizeOrigin(first) || "http://localhost:5173";
};

const trackLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

// Public tracking endpoint
sharesRouter.post("/:id/track", trackLimiter, asyncHandler(async (req, res) => {
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
}));

sharesRouter.get("/:couponId", requireAuth, asyncHandler(async (req, res) => {
  const coupon = await prisma.coupon.findUnique({ where: { id: req.params.couponId } });
  if (!coupon) return res.status(404).json({ message: "Coupon not found" });
  const business = await prisma.business.findUnique({ where: { ownerId: req.user.id } });
  if (!business || coupon.businessId !== business.id) {
    return res.status(403).json({ message: "Access denied" });
  }
  const shares = await prisma.share.findMany({
    where: { couponId: coupon.id, type: { in: ["link", "qr"] } },
    orderBy: { createdAt: "desc" },
  });
  return res.json({ data: shares.map(mapShareSummary) });
}));

sharesRouter.post("/", requireAuth, validate(createShareSchema), asyncHandler(async (req, res) => {
  const { couponId, type } = req.body;
  const share = await createShareForCoupon({
    couponId,
    type,
    ownerId: req.user.id,
    requestOrigin: resolveShareOrigin(req),
  });
  return res.status(201).json({ data: share });
}));
