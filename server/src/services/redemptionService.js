import { nanoid } from "nanoid";
import { prisma } from "../db/prisma.js";
import { isCouponActive, parseUsageLimit } from "../utils/couponStatus.js";

export const getRedemptionCounts = async ({ couponId, customerRef }) => {
  const total = await prisma.redemption.count({
    where: { couponId, status: "redeemed" },
  });

  const byCustomer = customerRef
    ? await prisma.redemption.count({
        where: { couponId, status: "redeemed", customerRef },
      })
    : 0;

  return { total, byCustomer };
};

export const validateRedemptionEligibility = async ({ coupon, customerRef, now }) => {
  if (!isCouponActive(coupon, now)) {
    return { ok: false, reason: "Coupon is not active or expired" };
  }

  const validity = coupon.validity || {};
  const usageType = validity.usageLimit;
  const totalLimit = parseUsageLimit(validity.totalLimit);
  const perCustomerLimit = parseUsageLimit(validity.perCustomerLimit);

  let enforceTotal = false;
  let enforceCustomer = false;

  if (!usageType || usageType === "unlimited") {
    enforceTotal = totalLimit !== null;
    enforceCustomer = perCustomerLimit !== null;
  } else if (usageType === "total_limit") {
    enforceTotal = true;
  } else if (usageType === "per_customer") {
    enforceCustomer = true;
  } else if (usageType === "both") {
    enforceTotal = true;
    enforceCustomer = true;
  }

  enforceCustomer = enforceCustomer && !!customerRef;

  if (!enforceTotal && !enforceCustomer) {
    return { ok: true };
  }

  const counts = await getRedemptionCounts({ couponId: coupon.id, customerRef: enforceCustomer ? customerRef : null });

  if (enforceTotal && totalLimit !== null && counts.total >= totalLimit) {
    return { ok: false, reason: "Coupon redemption limit reached" };
  }

  if (enforceCustomer && perCustomerLimit !== null && counts.byCustomer >= perCustomerLimit) {
    return { ok: false, reason: "Customer redemption limit reached" };
  }

  return { ok: true };
};

export const recordRedemption = async ({ couponId, shareId, customerRef, context, now, tx } = {}) => {
  const createRecords = async (client) => {
    if (shareId) {
      await client.share.update({
        where: { id: shareId },
        data: { redemptions: { increment: 1 } },
      });
    }

    const redemption = await client.redemption.create({
      data: {
        id: nanoid(),
        couponId,
        status: "redeemed",
        customerRef: customerRef || null,
        context: context || {},
        redeemedAt: now,
      },
    });

    await client.analyticsEvent.create({
      data: {
        id: nanoid(),
        couponId,
        eventType: "redemption",
        meta: { ...(context || {}), ...(shareId ? { shareId } : {}) },
      },
    });

    return redemption;
  };

  if (tx) {
    const redemption = await createRecords(tx);
    return { redemptionId: redemption.id };
  }

  const redemption = await prisma.$transaction(async (transaction) => createRecords(transaction));
  return { redemptionId: redemption.id };
};
