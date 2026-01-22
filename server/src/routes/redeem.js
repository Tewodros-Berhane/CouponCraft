import { Router } from "express";
import rateLimit from "express-rate-limit";
import { prisma } from "../db/prisma.js";
import { isCouponActive } from "../utils/couponStatus.js";
import { generateRedeemToken, hashRedeemToken } from "../utils/redeemToken.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const redeemRouter = Router();

const redeemLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

// Public endpoint: resolve shareId -> coupon + business, and record a real "click" on open.
redeemRouter.get("/:shareId", redeemLimiter, asyncHandler(async (req, res) => {
  const { shareId } = req.params;
  res.setHeader("Cache-Control", "no-store");

  const share = await prisma.share.findUnique({
    where: { id: shareId },
    include: {
      coupon: {
        include: {
          business: true,
        },
      },
    },
  });

  if (!share) return res.status(404).json({ message: "Share not found" });

  if (!isCouponActive(share.coupon)) {
    return res.status(404).json({ message: "Coupon not available" });
  }

  const redeemToken = generateRedeemToken();
  const redeemTokenHash = hashRedeemToken(redeemToken);
  const redeemTokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  const [updatedShare] = await prisma.$transaction([
    prisma.share.update({
      where: { id: shareId },
      data: { clicks: { increment: 1 } },
    }),
    prisma.analyticsEvent.create({
      data: {
        couponId: share.couponId,
        eventType: "click",
        meta: { shareId },
      },
    }),
    prisma.redeemToken.create({
      data: {
        tokenHash: redeemTokenHash,
        shareId,
        couponId: share.couponId,
        expiresAt: redeemTokenExpiresAt,
      },
    }),
  ]);

  const shareUrl = updatedShare.config?.shareUrl || null;

  return res.json({
    data: {
      share: {
        id: share.id,
        type: share.type,
        channel: share.channel,
        clicks: updatedShare.clicks,
        redemptions: updatedShare.redemptions,
        shareUrl,
        createdAt: share.createdAt,
      },
      coupon: {
        id: share.coupon.id,
        status: share.coupon.status,
        template: share.coupon.template,
        discount: share.coupon.discount,
        validity: share.coupon.validity,
        customization: share.coupon.customization,
      },
      business: {
        id: share.coupon.business.id,
        name: share.coupon.business.name,
        type: share.coupon.business.type,
        phone: share.coupon.business.phone,
      },
      redeemToken,
      redeemTokenExpiresAt,
    },
  });
}));
