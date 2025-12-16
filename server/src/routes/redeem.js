import { Router } from "express";
import { prisma } from "../db/prisma.js";
import { isCouponActive } from "../utils/couponStatus.js";

export const redeemRouter = Router();

// Public endpoint: resolve shareId -> coupon + business, and record a real "click" on open.
redeemRouter.get("/:shareId", async (req, res) => {
  const { shareId } = req.params;

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

  await prisma.$transaction([
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
  ]);

  const shareUrl = share.config?.shareUrl || null;

  return res.json({
    data: {
      share: {
        id: share.id,
        type: share.type,
        channel: share.channel,
        clicks: share.clicks + 1,
        redemptions: share.redemptions,
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
    },
  });
});

