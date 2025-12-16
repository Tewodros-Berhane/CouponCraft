export const isCouponActive = (coupon) => {
  if (!coupon) return false;
  if (coupon.status !== "active") return false;
  const endDate = coupon.validity?.endDate ? new Date(coupon.validity.endDate) : null;
  if (endDate && endDate < new Date()) return false;
  return true;
};

