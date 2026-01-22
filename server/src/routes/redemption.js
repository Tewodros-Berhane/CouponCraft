import { Router } from "express";
import { prisma } from "../db/prisma.js";
import { validate } from "../middlewares/validate.js";
import { redemptionValidateSchema, redemptionConfirmSchema } from "../validators.js";
import { hashRedeemToken } from "../utils/redeemToken.js";
import { requireAuth } from "../middlewares/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { recordRedemption, validateRedemptionEligibility } from "../services/redemptionService.js";
import { createRateLimiter } from "../utils/rateLimit.js";

export const redemptionRouter = Router();

const validateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  limit: 60,
  keyPrefix: "redemption-validate",
});

const confirmLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  limit: 30,
  keyPrefix: "redemption-confirm",
});

const httpError = (status, message) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

redemptionRouter.post("/validate", validateLimiter, validate(redemptionValidateSchema), asyncHandler(async (req, res) => {
  const { couponId, customerRef } = req.body;
  const coupon = await prisma.coupon.findUnique({ where: { id: couponId } });
  if (!coupon) return res.status(404).json({ message: "Coupon not found" });
  const validation = await validateRedemptionEligibility({ coupon, customerRef, now: new Date() });
  return res.json({
    data: {
      valid: validation.ok,
      reason: validation.ok ? null : validation.reason,
    },
  });
}));

redemptionRouter.post("/confirm", confirmLimiter, validate(redemptionConfirmSchema), asyncHandler(async (req, res) => {
  const { couponId, customerRef, context, shareId, redeemToken } = req.body;
  const coupon = await prisma.coupon.findUnique({ where: { id: couponId } });
  if (!coupon) return res.status(404).json({ message: "Coupon not found" });
  const now = new Date();

  if (shareId) {
    const eligibility = await validateRedemptionEligibility({ coupon, customerRef, now });
    if (!eligibility.ok) {
      return res.status(400).json({ message: eligibility.reason || "Coupon is not active or expired" });
    }
    if (!redeemToken) {
      return res.status(400).json({ message: "Missing redeemToken" });
    }

    const tokenHash = hashRedeemToken(redeemToken);

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

        return recordRedemption({
          couponId,
          shareId,
          customerRef,
          context,
          now,
          tx,
        });
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

  const eligibility = await validateRedemptionEligibility({ coupon, customerRef, now });
  if (!eligibility.ok) {
    return res.status(400).json({ message: eligibility.reason || "Coupon is not active or expired" });
  }

  const staffContext = {
    ...(context || {}),
    source: (context || {})?.source || "staff",
  };

  const redemption = await recordRedemption({
    couponId,
    customerRef,
    context: staffContext,
    now,
  });

  return res.status(201).json({ data: redemption });
}));
