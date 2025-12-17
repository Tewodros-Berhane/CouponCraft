import { Router } from "express";
import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";
import { prisma } from "../db/prisma.js";
import { requireAuth } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { createShareSchema, updateShareSchema } from "../validators.js";
import { config, sanitizeOrigin } from "../config.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const sharesRouter = Router();

const pickShareBaseOrigin = (req) => {
  const requestOrigin = req?.get?.("origin");
  if (requestOrigin) {
    const normalized = sanitizeOrigin(requestOrigin);
    if (config.corsOrigins.includes(normalized)) return normalized;
  }

  const fallback = config.corsOrigins?.[0] || config.clientOrigin || "http://localhost:5173";
  const first = String(fallback).split(",")[0].trim();
  return sanitizeOrigin(first) || "http://localhost:5173";
};

const buildShareUrl = (req, shareId, utm) => {
  const base = pickShareBaseOrigin(req).replace(/\/+$/, "");
  const url = new URL(`${base}/redeem/${shareId}`);

  const source = utm?.source ? String(utm.source) : "";
  const medium = utm?.medium ? String(utm.medium) : "";
  const campaign = utm?.campaign ? String(utm.campaign) : "";

  if (source) url.searchParams.set("utm_source", source);
  if (medium) url.searchParams.set("utm_medium", medium);
  if (campaign) url.searchParams.set("utm_campaign", campaign);

  return url.toString();
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
    where: { couponId: coupon.id },
    orderBy: { createdAt: "desc" },
  });
  return res.json({ data: shares });
}));

sharesRouter.post("/", requireAuth, validate(createShareSchema), asyncHandler(async (req, res) => {
  const { couponId, type, channel, config: cfg } = req.body;
  const coupon = await prisma.coupon.findUnique({ where: { id: couponId } });
  if (!coupon) return res.status(404).json({ message: "Coupon not found" });
  const business = await prisma.business.findUnique({ where: { ownerId: req.user.id } });
  if (!business || coupon.businessId !== business.id) {
    return res.status(403).json({ message: "Access denied" });
  }
  const shareId = nanoid();

  const incomingConfig = { ...(cfg || {}) };
  delete incomingConfig.shareUrl;

  const shareUrl = buildShareUrl(req, shareId, incomingConfig.utm);

  const share = await prisma.share.create({
    data: {
      id: shareId,
      couponId,
      type,
      channel: channel || null,
      config: { ...incomingConfig, shareUrl },
    },
  });
  return res.status(201).json({ data: share });
}));

sharesRouter.patch("/:id", requireAuth, validate(updateShareSchema), asyncHandler(async (req, res) => {
  const share = await prisma.share.findUnique({ where: { id: req.params.id } });
  if (!share) return res.status(404).json({ message: "Share not found" });

  const coupon = await prisma.coupon.findUnique({ where: { id: share.couponId } });
  if (!coupon) return res.status(404).json({ message: "Coupon not found" });

  const business = await prisma.business.findUnique({ where: { ownerId: req.user.id } });
  if (!business || coupon.businessId !== business.id) {
    return res.status(403).json({ message: "Access denied" });
  }

  const incomingConfig = { ...(req.body.config || {}) };
  delete incomingConfig.shareUrl;

  const nextConfig = { ...(share.config || {}), ...incomingConfig };

  if (Object.prototype.hasOwnProperty.call(req.body, "expiresAt")) {
    nextConfig.expiresAt = req.body.expiresAt ? new Date(req.body.expiresAt).toISOString() : null;
  }

  if (Object.prototype.hasOwnProperty.call(req.body, "password")) {
    const password = req.body.password ? String(req.body.password) : "";
    if (!password) {
      nextConfig.passwordHash = null;
      nextConfig.passwordProtected = false;
    } else {
      nextConfig.passwordHash = await bcrypt.hash(password, 10);
      nextConfig.passwordProtected = true;
    }
  }

  nextConfig.shareUrl = buildShareUrl(req, share.id, nextConfig.utm);

  const updated = await prisma.share.update({
    where: { id: share.id },
    data: {
      channel: Object.prototype.hasOwnProperty.call(req.body, "channel") ? (req.body.channel || null) : share.channel,
      config: nextConfig,
    },
  });

  return res.json({ data: updated });
}));
