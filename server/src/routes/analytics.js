import { Router } from "express";
import { nanoid } from "nanoid";
import { prisma } from "../db/prisma.js";
import { validate } from "../middlewares/validate.js";
import { analyticsEventSchema } from "../validators.js";
import { requireAuth } from "../middlewares/auth.js";

export const analyticsRouter = Router();

// Public ingestion endpoint
analyticsRouter.post("/events", validate(analyticsEventSchema), async (req, res) => {
  const { couponId, eventType, meta } = req.body;
  const coupon = await prisma.coupon.findUnique({ where: { id: couponId } });
  if (!coupon) return res.status(404).json({ message: "Coupon not found" });
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
