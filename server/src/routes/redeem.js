import { Router } from "express";
import { prisma } from "../db/prisma.js";
import { isCouponActive } from "../utils/couponStatus.js";
import { generateRedeemToken, hashRedeemToken } from "../utils/redeemToken.js";
import bcrypt from "bcryptjs";

export const redeemRouter = Router();

// Public endpoint: resolve shareId -> coupon + business, and record a real "click" on open.
redeemRouter.get("/:shareId", async (req, res) => {
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

  const expiresAt = share.config?.expiresAt ? new Date(share.config.expiresAt) : null;
  if (expiresAt && Number.isFinite(expiresAt.getTime()) && expiresAt.getTime() <= Date.now()) {
    return res.status(404).json({ message: "Coupon not available", code: "SHARE_EXPIRED" });
  }

  const passwordHash = share.config?.passwordHash;
  if (passwordHash) {
    const provided = req.get("X-Share-Password") || req.query?.password || "";
    if (!provided) {
      return res.status(401).json({ message: "Password required", code: "PASSWORD_REQUIRED" });
    }
    const ok = await bcrypt.compare(String(provided), String(passwordHash));
    if (!ok) {
      return res.status(401).json({ message: "Invalid password", code: "INVALID_PASSWORD" });
    }
  }

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
});
