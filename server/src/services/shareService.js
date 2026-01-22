import { nanoid } from "nanoid";
import { prisma } from "../db/prisma.js";
import { sanitizeOrigin } from "../config.js";

const createHttpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

export const buildShareUrl = (appOrigin, shareId) => {
  const origin = sanitizeOrigin(appOrigin);
  if (!origin) {
    throw createHttpError(500, "Share origin is not configured");
  }
  return `${origin}/coupon/${shareId}`;
};

export const mapShareDto = (share) => ({
  id: share?.id,
  type: share?.type,
  shareUrl: share?.config?.shareUrl || null,
});

export const mapShareSummary = (share) => ({
  id: share?.id,
  type: share?.type,
  channel: share?.type,
  shareUrl: share?.config?.shareUrl || null,
  clicks: share?.clicks || 0,
  redemptions: share?.redemptions || 0,
  createdAt: share?.createdAt || null,
});

export const createShareForCoupon = async ({ couponId, type, ownerId, requestOrigin }) => {
  if (!["link", "qr"].includes(type)) {
    throw createHttpError(400, "Invalid share type");
  }

  const coupon = await prisma.coupon.findUnique({ where: { id: couponId } });
  if (!coupon) {
    throw createHttpError(404, "Coupon not found");
  }

  const business = await prisma.business.findUnique({ where: { ownerId } });
  if (!business || coupon.businessId !== business.id) {
    throw createHttpError(403, "Access denied");
  }

  const existing = await prisma.share.findFirst({ where: { couponId, type } });
  if (existing) {
    const existingUrl = existing.config?.shareUrl;
    if (!existingUrl || !existingUrl.includes("/coupon/")) {
      const shareUrl = buildShareUrl(requestOrigin, existing.id);
      const updated = await prisma.share.update({
        where: { id: existing.id },
        data: { config: { ...(existing.config || {}), shareUrl } },
      });
      return mapShareDto(updated);
    }
    return mapShareDto(existing);
  }

  const shareId = nanoid();
  const shareUrl = buildShareUrl(requestOrigin, shareId);

  const share = await prisma.share.create({
    data: {
      id: shareId,
      couponId,
      type,
      config: { shareUrl },
    },
  });

  return mapShareDto(share);
};
