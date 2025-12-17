import axios from "axios";

const resolveApiBaseUrl = () => {
  const configured = import.meta.env.VITE_API_URL;
  if (!configured) return "/api";

  const isAbsolute = /^https?:\/\//i.test(configured);
  if (!isAbsolute) return configured;

  try {
    const url = new URL(configured);
    const currentOrigin = window?.location?.origin;

    // If the app is being accessed via a LAN host (e.g., 192.168.x.x) but the API is configured
    // as localhost, cookie-based auth breaks due to cross-site SameSite restrictions.
    // Prefer the Vite proxy (/api) in that case so cookies are first-party for the app origin.
    if (
      currentOrigin &&
      url.origin !== currentOrigin &&
      (url.hostname === "localhost" || url.hostname === "127.0.0.1")
    ) {
      return "/api";
    }

    return configured;
  } catch {
    return configured;
  }
};

const API_BASE_URL = resolveApiBaseUrl();

let refreshPromise = null;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
});

const authApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
});

const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = authApi
      .post("/auth/refresh")
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;
    const url = originalRequest?.url || "";
    if (status === 401 && url.includes("/auth/refresh")) {
      return Promise.reject(error);
    }
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await refreshAccessToken();
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
