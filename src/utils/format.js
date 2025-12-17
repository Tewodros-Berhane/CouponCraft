const toDate = (value) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
};

export const formatDate = (value, fallback = "N/A", locale = "en-US") => {
  const date = toDate(value);
  if (!date) return fallback;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
};

export const formatDateTime = (value, fallback = "N/A", locale = "en-US") => {
  const date = toDate(value);
  if (!date) return fallback;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const formatNumber = (value, fallback = "—", locale = "en-US") => {
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num)) return fallback;
  return new Intl.NumberFormat(locale).format(num);
};

export const formatCurrency = (
  value,
  fallback = "—",
  { currency = "USD", locale = "en-US", maximumFractionDigits = 2 } = {}
) => {
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num)) return fallback;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits,
  }).format(num);
};

