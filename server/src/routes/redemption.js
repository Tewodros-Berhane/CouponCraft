import { Router } from "express";
import { nanoid } from "nanoid";
import { prisma } from "../db/prisma.js";
import { validate } from "../middlewares/validate.js";
import { redemptionValidateSchema, redemptionConfirmSchema } from "../validators.js";
import { isCouponActive } from "../utils/couponStatus.js";
import { hashRedeemToken } from "../utils/redeemToken.js";
import { requireAuth } from "../middlewares/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const redemptionRouter = Router();

const httpError = (status, message) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

redemptionRouter.post("/validate", validate(redemptionValidateSchema), asyncHandler(async (req, res) => {
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
}));

redemptionRouter.post("/confirm", validate(redemptionConfirmSchema), asyncHandler(async (req, res) => {
  const { couponId, customerRef, context, shareId, redeemToken } = req.body;
  const coupon = await prisma.coupon.findUnique({ where: { id: couponId } });
  if (!coupon) return res.status(404).json({ message: "Coupon not found" });
  if (!isCouponActive(coupon)) {
    return res.status(400).json({ message: "Coupon is not active or expired" });
  }

  if (shareId) {
    if (!redeemToken) {
      return res.status(400).json({ message: "Missing redeemToken" });
    }

    const tokenHash = hashRedeemToken(redeemToken);
    const now = new Date();

    try {
      const redemption = await prisma.$transaction(async (tx) => {
        const share = await tx.share.findUnique({ where: { id: shareId } });
        if (!share) throw httpError(404, "Share not found");
        if (share.couponId !== couponId) throw httpError(400, "Share does not match coupon");

        const used = await tx.redeemToken.updateMany({
          where: {
            tokenHash,
            shareId,
            couponId,
            usedAt: null,
            expiresAt: { gt: now },
          },
          data: { usedAt: now },
        });
        if (used.count !== 1) throw httpError(401, "Invalid or expired redeemToken");

        await tx.share.update({
          where: { id: shareId },
          data: { redemptions: { increment: 1 } },
        });

        const created = await tx.redemption.create({
          data: {
            id: nanoid(),
            couponId,
            status: "redeemed",
            customerRef: customerRef || null,
            context: context || {},
            redeemedAt: now,
          },
        });

        await tx.analyticsEvent.create({
          data: {
            id: nanoid(),
            couponId,
            eventType: "redemption",
            meta: { ...(context || {}), shareId },
          },
        });

        return created;
      });

      return res.status(201).json({ data: redemption });
    } catch (err) {
      if (err?.status) return res.status(err.status).json({ message: err.message });
      throw err;
    }
  }

  await new Promise((resolve) => requireAuth(req, res, resolve));
  if (res.headersSent) return;

    const business = await prisma.business.findUnique({ where: { ownerId: req.user.id } });
    if (!business || coupon.businessId !== business.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    const now = new Date();
    const [redemption] = await prisma.$transaction([
      prisma.redemption.create({
        data: {
          id: nanoid(),
          couponId,
          status: "redeemed",
          customerRef: customerRef || null,
          context: { ...(context || {}), source: (context || {})?.source || "staff" },
          redeemedAt: now,
        },
      }),
      prisma.analyticsEvent.create({
        data: {
          id: nanoid(),
          couponId,
          eventType: "redemption",
          meta: { ...(context || {}), source: (context || {})?.source || "staff" },
        },
      }),
    ]);

    return res.status(201).json({ data: redemption });
}));
