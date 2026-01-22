const resolveTimeZone = (timeZone) => {
  if (timeZone) return timeZone;
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
};

const buildZonedDate = (dateStr, timeStr, timeZone) => {
  if (!dateStr) return null;
  const [year, month, day] = String(dateStr).split("-").map(Number);
  if (!year || !month || !day) return null;

  const [hour, minute] = String(timeStr || "00:00").split(":").map(Number);
  const utcDate = new Date(Date.UTC(year, month - 1, day, hour || 0, minute || 0, 0));

  const zone = resolveTimeZone(timeZone);
  try {
    const localeDate = new Date(utcDate.toLocaleString("en-US", { timeZone: zone }));
    const offsetMs = localeDate.getTime() - utcDate.getTime();
    return new Date(utcDate.getTime() - offsetMs);
  } catch {
    return utcDate;
  }
};

export const parseUsageLimit = (value) => {
  if (value === null || value === undefined) return null;

  if (typeof value === "string") {
    const trimmed = value.trim().toLowerCase();
    if (!trimmed || trimmed === "unlimited") return null;
    const parsed = Number(trimmed);
    if (!Number.isFinite(parsed) || parsed <= 0) return null;
    return Math.floor(parsed);
  }

  if (typeof value === "number") {
    if (!Number.isFinite(value) || value <= 0) return null;
    return Math.floor(value);
  }

  return null;
};

export const resolveValidityWindow = (validity, anchorDate) => {
  if (!validity) return {};

  if (validity.type === "date_range") {
    const start = buildZonedDate(validity.startDate, validity.startTime || "00:00", validity.timeZone);
    const end = buildZonedDate(validity.endDate, validity.endTime || "23:59", validity.timeZone);
    return {
      startsAt: start || undefined,
      endsAt: end || undefined,
    };
  }

  if (validity.type === "duration") {
    const durationDays = parseUsageLimit(validity.durationDays);
    if (!durationDays) return {};
    const startsAt = anchorDate ? new Date(anchorDate) : new Date();
    const endsAt = new Date(startsAt);
    endsAt.setDate(endsAt.getDate() + durationDays);
    return { startsAt, endsAt };
  }

  return {};
};

export const isCouponActive = (coupon, now = new Date()) => {
  if (!coupon) return false;
  if (coupon.status !== "active") return false;

  const validity = coupon.validity || {};
  if (!validity.type || validity.type === "no_expiry") return true;

  const anchorDate = coupon.createdAt ? new Date(coupon.createdAt) : now;
  const { startsAt, endsAt } = resolveValidityWindow(validity, anchorDate);

  if ((validity.type === "date_range" || validity.type === "duration") && !startsAt && !endsAt) {
    return false;
  }

  if (startsAt && now < startsAt) return false;
  if (endsAt && now > endsAt) return false;
  return true;
};
