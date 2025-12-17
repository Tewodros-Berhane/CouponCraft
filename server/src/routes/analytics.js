import { Router } from "express";
import { nanoid } from "nanoid";
import rateLimit from "express-rate-limit";
import { prisma } from "../db/prisma.js";
import { validate } from "../middlewares/validate.js";
import { analyticsEventSchema } from "../validators.js";
import { requireAuth } from "../middlewares/auth.js";

export const analyticsRouter = Router();

const ingestLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

const clampInt = (value, { min, max, fallback }) => {
  const parsed = parseInt(value, 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(parsed, min), max);
};

// Public ingestion endpoint
analyticsRouter.post("/events", ingestLimiter, validate(analyticsEventSchema), async (req, res) => {
  const { couponId, eventType, meta } = req.body;
  const coupon = await prisma.coupon.findUnique({ where: { id: couponId } });
  if (!coupon) return res.status(404).json({ message: "Coupon not found" });

  // For click/redemption, require a shareId and validate it belongs to the coupon to reduce spoofing.
  if (eventType === "click" || eventType === "redemption") {
    const shareId = meta?.shareId;
    if (!shareId) return res.status(400).json({ message: "shareId required for this event" });
    const share = await prisma.share.findUnique({ where: { id: shareId } });
    if (!share || share.couponId !== couponId) {
      return res.status(400).json({ message: "Invalid shareId for coupon" });
    }
  }

  const event = await prisma.analyticsEvent.create({
    data: {
      id: nanoid(),
      couponId,
      eventType,
      meta: meta || {},
    },
  });
  return res.status(201).json({ data: event });
});

// Authenticated: dashboard aggregates for the authenticated business (avoids N+1 calls from UI).
analyticsRouter.get("/dashboard", requireAuth, async (req, res) => {
  const business = await prisma.business.findUnique({ where: { ownerId: req.user.id } });
  if (!business) return res.status(404).json({ message: "Business not found" });

  const days = clampInt(req.query?.days, { min: 1, max: 365, fallback: 30 });
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const coupons = await prisma.coupon.findMany({
    where: { businessId: business.id },
    select: { id: true },
  });
  const couponIds = coupons.map((c) => c.id);

  if (couponIds.length === 0) {
    return res.json({
      data: {
        totalsByCoupon: {},
        totals: { views: 0, clicks: 0, redemptions: 0, total: 0 },
        series: [],
        window: { days, since },
      },
    });
  }

  const [totalsGrouped, eventsForSeries] = await Promise.all([
    prisma.analyticsEvent.groupBy({
      by: ["couponId", "eventType"],
      where: { couponId: { in: couponIds }, createdAt: { gte: since } },
      _count: { _all: true },
    }),
    prisma.analyticsEvent.findMany({
      where: { couponId: { in: couponIds }, createdAt: { gte: since } },
      select: { eventType: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const totalsByCoupon = {};
  const totals = { views: 0, clicks: 0, redemptions: 0, total: 0 };

  totalsGrouped.forEach((row) => {
    const couponId = row.couponId;
    const eventType = row.eventType;
    const count = row._count?._all || 0;

    if (!totalsByCoupon[couponId]) {
      totalsByCoupon[couponId] = { views: 0, clicks: 0, redemptions: 0, total: 0 };
    }

    totalsByCoupon[couponId].total += count;
    totals.total += count;

    if (eventType === "view") {
      totalsByCoupon[couponId].views += count;
      totals.views += count;
    } else if (eventType === "click") {
      totalsByCoupon[couponId].clicks += count;
      totals.clicks += count;
    } else if (eventType === "redemption") {
      totalsByCoupon[couponId].redemptions += count;
      totals.redemptions += count;
    }
  });

  const seriesMap = new Map();
  eventsForSeries.forEach((ev) => {
    const key = new Date(ev.createdAt).toISOString().slice(0, 10);
    const entry = seriesMap.get(key) || { date: key, views: 0, clicks: 0, redemptions: 0 };
    if (ev.eventType === "view") entry.views += 1;
    if (ev.eventType === "click") entry.clicks += 1;
    if (ev.eventType === "redemption") entry.redemptions += 1;
    seriesMap.set(key, entry);
  });

  const series = Array.from(seriesMap.values()).map((item) => ({
    ...item,
    label: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  }));

  return res.json({ data: { totalsByCoupon, totals, series, window: { days, since } } });
});

// Authenticated aggregate endpoint
analyticsRouter.get("/coupons/:couponId", requireAuth, async (req, res) => {
  const coupon = await prisma.coupon.findUnique({ where: { id: req.params.couponId } });
  if (!coupon) return res.status(404).json({ message: "Coupon not found" });
  const business = await prisma.business.findUnique({ where: { ownerId: req.user.id } });
  if (!business || coupon.businessId !== business.id) {
    return res.status(403).json({ message: "Access denied" });
  }
  const events = await prisma.analyticsEvent.findMany({
    where: { couponId: coupon.id },
  });
  const summary = events.reduce(
    (acc, ev) => {
      acc.total += 1;
      acc[ev.eventType] = (acc[ev.eventType] || 0) + 1;
      return acc;
    },
    { total: 0 }
  );
  return res.json({ data: { events, summary } });
});
