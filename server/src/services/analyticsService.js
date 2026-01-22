import { prisma } from "../db/prisma.js";

export const calculateConversion = (clicks, redemptions) => {
  const safeClicks = Number(clicks) || 0;
  const safeRedemptions = Number(redemptions) || 0;
  if (safeClicks === 0) return 0;
  return safeRedemptions / safeClicks;
};

export const getShareAnalytics = async (shareId) => {
  const share = await prisma.share.findUnique({ where: { id: shareId } });
  if (!share) return null;

  const [grouped, lastEvent] = await Promise.all([
    prisma.analyticsEvent.groupBy({
      by: ["eventType"],
      where: {
        couponId: share.couponId,
        eventType: { in: ["click", "redemption"] },
        meta: {
          path: ["shareId"],
          equals: shareId,
        },
      },
      _count: { _all: true },
    }),
    prisma.analyticsEvent.findFirst({
      where: {
        couponId: share.couponId,
        meta: {
          path: ["shareId"],
          equals: shareId,
        },
      },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    }),
  ]);

  let clicks = 0;
  let redemptions = 0;
  grouped.forEach((row) => {
    const count = row?._count?._all || 0;
    if (row.eventType === "click") clicks = count;
    if (row.eventType === "redemption") redemptions = count;
  });

  const conversionRate = calculateConversion(clicks, redemptions);

  return {
    shareId: share.id,
    clicks,
    redemptions,
    conversionRate,
    lastActivityAt: lastEvent?.createdAt || null,
  };
};
