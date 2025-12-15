import { Router } from "express";
import { nanoid } from "nanoid";
import { prisma } from "../db/prisma.js";
import { validate } from "../middlewares/validate.js";
import { redemptionValidateSchema, redemptionConfirmSchema } from "../validators.js";

export const redemptionRouter = Router();

const isCouponActive = (coupon) => {
  if (coupon.status !== "active") return false;
  const endDate = coupon.validity?.endDate ? new Date(coupon.validity.endDate) : null;
  if (endDate && endDate < new Date()) return false;
  return true;
};

redemptionRouter.post("/validate", validate(redemptionValidateSchema), async (req, res) => {
  const { couponId } = req.body;
  const coupon = await prisma.coupon.findUnique({ where: { id: couponId } });
  if (!coupon) return res.status(404).json({ message: "Coupon not found" });
  const valid = isCouponActive(coupon);
  return res.json({
    data: {
      valid,
      reason: valid ? null : "Coupon is not active or expired",
    },
  });
});

redemptionRouter.post("/confirm", validate(redemptionConfirmSchema), async (req, res) => {
  const { couponId, customerRef, context } = req.body;
  const coupon = await prisma.coupon.findUnique({ where: { id: couponId } });
  if (!coupon) return res.status(404).json({ message: "Coupon not found" });
  if (!isCouponActive(coupon)) {
    return res.status(400).json({ message: "Coupon is not active or expired" });
  }
  const redemption = await prisma.redemption.create({
    data: {
      id: nanoid(),
      couponId,
      status: "redeemed",
      customerRef: customerRef || null,
      context: context || {},
      redeemedAt: new Date(),
    },
  });
  await prisma.analyticsEvent.create({
    data: {
      id: nanoid(),
      couponId,
      eventType: "redemption",
      meta: context || {},
    },
  });
  return res.status(201).json({ data: redemption });
});
