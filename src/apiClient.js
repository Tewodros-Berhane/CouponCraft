import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

let accessToken = localStorage.getItem("authToken") || null;
let refreshToken = localStorage.getItem("refreshToken") || null;
let refreshPromise = null;

export const tokenStore = {
  setTokens: (access, refresh) => {
    accessToken = access;
    refreshToken = refresh || refreshToken;
    if (access) localStorage.setItem("authToken", access);
    if (refresh) localStorage.setItem("refreshToken", refresh);
  },
  clear: () => {
    accessToken = null;
    refreshToken = null;
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
  },
  getAccess: () => accessToken,
  getRefresh: () => refreshToken,
};

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = tokenStore.getAccess();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const refreshAccessToken = async () => {
  if (!tokenStore.getRefresh()) throw new Error("No refresh token");
  if (!refreshPromise) {
    refreshPromise = api
      .post("/auth/refresh", { refreshToken: tokenStore.getRefresh() })
      .then((res) => {
        const newAccess = res?.data?.tokens?.accessToken;
        const newRefresh = res?.data?.tokens?.refreshToken;
        tokenStore.setTokens(newAccess, newRefresh);
        return newAccess;
      })
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
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAccessToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        tokenStore.clear();
      }
    }
    return Promise.reject(error);
  }
);

export default api;
