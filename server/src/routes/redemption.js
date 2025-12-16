import { Router } from "express";
import { nanoid } from "nanoid";
import { prisma } from "../db/prisma.js";
import { validate } from "../middlewares/validate.js";
import { redemptionValidateSchema, redemptionConfirmSchema } from "../validators.js";
import { isCouponActive } from "../utils/couponStatus.js";

export const redemptionRouter = Router();

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
  const { couponId, customerRef, context, shareId } = req.body;
  const coupon = await prisma.coupon.findUnique({ where: { id: couponId } });
  if (!coupon) return res.status(404).json({ message: "Coupon not found" });
  if (!isCouponActive(coupon)) {
    return res.status(400).json({ message: "Coupon is not active or expired" });
  }

  if (shareId) {
    const share = await prisma.share.findUnique({ where: { id: shareId } });
    if (!share) return res.status(404).json({ message: "Share not found" });
    if (share.couponId !== couponId) {
      return res.status(400).json({ message: "Share does not match coupon" });
    }
  }

  if (shareId) {
    const [, redemption] = await prisma.$transaction([
      prisma.share.update({
        where: { id: shareId },
        data: { redemptions: { increment: 1 } },
      }),
      prisma.redemption.create({
        data: {
          id: nanoid(),
          couponId,
          status: "redeemed",
          customerRef: customerRef || null,
          context: context || {},
          redeemedAt: new Date(),
        },
      }),
      prisma.analyticsEvent.create({
        data: {
          id: nanoid(),
          couponId,
          eventType: "redemption",
          meta: { ...(context || {}), shareId },
        },
      }),
    ]);
    return res.status(201).json({ data: redemption });
  }

  const [redemption] = await prisma.$transaction([
    prisma.redemption.create({
      data: {
        id: nanoid(),
        couponId,
        status: "redeemed",
        customerRef: customerRef || null,
        context: context || {},
        redeemedAt: new Date(),
      },
    }),
    prisma.analyticsEvent.create({
      data: {
        id: nanoid(),
        couponId,
        eventType: "redemption",
        meta: context || {},
      },
    }),
  ]);
  return res.status(201).json({ data: redemption });
});
