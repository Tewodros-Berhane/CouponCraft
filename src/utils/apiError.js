export const getApiErrorMessage = (error, fallback = "Something went wrong") => {
  const status = error?.response?.status;
  const data = error?.response?.data;

  if (status === 429) return "Too many requests. Please try again shortly.";

  const firstDetail = Array.isArray(data?.details) ? data.details?.[0]?.message : null;
  if (typeof firstDetail === "string" && firstDetail.trim()) return firstDetail;

  const message = data?.message || error?.message;
  if (typeof message === "string" && message.trim()) return message;
  return fallback;
};
