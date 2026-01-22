import { Router } from "express";
import { nanoid } from "nanoid";
import { prisma } from "../db/prisma.js";
import { validate } from "../middlewares/validate.js";
import { analyticsEventSchema } from "../validators.js";
import { requireAuth } from "../middlewares/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { calculateConversion, getShareAnalytics } from "../services/analyticsService.js";
import { isCouponActive } from "../utils/couponStatus.js";
import { createRateLimiter } from "../utils/rateLimit.js";
import { getCache, setCache } from "../utils/cache.js";

export const analyticsRouter = Router();

const ingestLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  limit: 30,
  keyPrefix: "analytics-ingest",
});

const clampInt = (value, { min, max, fallback }) => {
  const parsed = parseInt(value, 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(parsed, min), max);
};

const dashboardCacheTtlMs = 60 * 1000;

// Public ingestion endpoint
analyticsRouter.post("/events", ingestLimiter, validate(analyticsEventSchema), asyncHandler(async (req, res) => {
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
}));

// Authenticated: dashboard aggregates for the authenticated business (avoids N+1 calls from UI).
analyticsRouter.get("/dashboard", requireAuth, asyncHandler(async (req, res) => {
  const business = await prisma.business.findUnique({ where: { ownerId: req.user.id } });
  if (!business) return res.status(404).json({ message: "Business not found" });

  const days = clampInt(req.query?.days, { min: 1, max: 365, fallback: 30 });
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const cacheKey = `dashboard:${business.id}:${days}`;
  const cached = getCache(cacheKey);
  if (cached) return res.json({ data: cached });

  const coupons = await prisma.coupon.findMany({
    where: { businessId: business.id },
    select: { id: true, status: true, validity: true, createdAt: true },
  });
  const couponIds = coupons.map((c) => c.id);

  const now = new Date();
  const counts = { active: 0, expired: 0, draft: 0, total: coupons.length };
  coupons.forEach((coupon) => {
    if (coupon.status === "draft") {
      counts.draft += 1;
      return;
    }
    if (coupon.status === "active") {
      if (isCouponActive(coupon, now)) {
        counts.active += 1;
      } else {
        counts.expired += 1;
      }
    }
  });

  if (couponIds.length === 0) {
    const responseData = {
      totalsByCoupon: {},
      totals: { views: 0, clicks: 0, redemptions: 0, total: 0, conversionRate: 0 },
      series: [],
      window: { days, since },
      counts,
    };
    setCache(cacheKey, responseData, dashboardCacheTtlMs);
    return res.json({ data: responseData });
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
  const totals = { views: 0, clicks: 0, redemptions: 0, total: 0, conversionRate: 0 };

  totalsGrouped.forEach((row) => {
    const couponId = row.couponId;
    const eventType = row.eventType;
    const count = row._count?._all || 0;

    if (!totalsByCoupon[couponId]) {
      totalsByCoupon[couponId] = { views: 0, clicks: 0, redemptions: 0, total: 0, conversionRate: 0 };
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

  Object.values(totalsByCoupon).forEach((entry) => {
    entry.conversionRate = calculateConversion(entry.clicks, entry.redemptions);
  });
  totals.conversionRate = calculateConversion(totals.clicks, totals.redemptions);

  const responseData = { totalsByCoupon, totals, series, window: { days, since }, counts };
  setCache(cacheKey, responseData, dashboardCacheTtlMs);
  return res.json({ data: responseData });
}));

// Authenticated: per-share analytics for a single share.
analyticsRouter.get("/shares/:shareId", requireAuth, asyncHandler(async (req, res) => {
  const share = await prisma.share.findUnique({
    where: { id: req.params.shareId },
    include: { coupon: { select: { businessId: true } } },
  });
  if (!share) return res.status(404).json({ message: "Share not found" });

  const business = await prisma.business.findUnique({ where: { ownerId: req.user.id } });
  if (!business || share.coupon.businessId !== business.id) {
    return res.status(403).json({ message: "Access denied" });
  }

  const analytics = await getShareAnalytics(share.id);
  return res.json({ data: analytics });
}));

// Authenticated aggregate endpoint
analyticsRouter.get("/coupons/:couponId", requireAuth, asyncHandler(async (req, res) => {
  const coupon = await prisma.coupon.findUnique({ where: { id: req.params.couponId } });
  if (!coupon) return res.status(404).json({ message: "Coupon not found" });
  const business = await prisma.business.findUnique({ where: { ownerId: req.user.id } });
  if (!business || coupon.businessId !== business.id) {
    return res.status(403).json({ message: "Access denied" });
  }
  const page = clampInt(req.query?.page, { min: 1, max: 1000, fallback: 1 });
  const limit = clampInt(req.query?.limit, { min: 1, max: 100, fallback: 50 });
  const skip = (page - 1) * limit;

  const [events, total, grouped] = await Promise.all([
    prisma.analyticsEvent.findMany({
      where: { couponId: coupon.id },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.analyticsEvent.count({ where: { couponId: coupon.id } }),
    prisma.analyticsEvent.groupBy({
      by: ["eventType"],
      where: { couponId: coupon.id },
      _count: { _all: true },
    }),
  ]);

  const summary = grouped.reduce(
    (acc, row) => {
      const count = row._count?._all || 0;
      acc.total += count;
      acc[row.eventType] = count;
      return acc;
    },
    { total: 0 }
  );

  return res.json({
    data: {
      events,
      summary,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
}));
