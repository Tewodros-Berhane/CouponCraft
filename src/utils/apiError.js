export const getApiErrorMessage = (error, fallback = "Something went wrong") => {
  const message = error?.response?.data?.message || error?.message;
  if (typeof message === "string" && message.trim()) return message;
  return fallback;
};

