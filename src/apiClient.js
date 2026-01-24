import axios from 'axios';
import {
  getAccessToken,
  getRefreshToken,
  setAuthTokens,
  clearAuthTokens,
} from './utils/authTokens';

const resolveApiBaseUrl = () => {
  const configured = import.meta.env.VITE_API_URL;
  if (!configured) return '/api';

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
      (url.hostname === 'localhost' || url.hostname === '127.0.0.1')
    ) {
      return '/api';
    }

    return configured;
  } catch {
    return configured;
  }
};

export const API_BASE_URL = resolveApiBaseUrl();

let refreshPromise = null;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
});

const authApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
});

const refreshAccessToken = async () => {
  if (!refreshPromise) {
    const refreshToken = getRefreshToken();
    refreshPromise = authApi
      .post('/auth/refresh', refreshToken ? { refreshToken } : undefined)
      .then((response) => {
        const tokens = response?.data?.data?.tokens;
        if (tokens?.accessToken) {
          setAuthTokens(tokens);
        }
        return response;
      })
      .catch((error) => {
        clearAuthTokens();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

const applyAuthHeader = (config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    if (!config.headers.Authorization && !config.headers.authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
};

api.interceptors.request.use(applyAuthHeader);
authApi.interceptors.request.use(applyAuthHeader);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;
    const code = error?.response?.data?.code;
    const message = error?.response?.data?.message;
    const url = originalRequest?.url || '';
    const hasAccessToken = Boolean(getAccessToken());

    // If the caller isn't authenticated yet (common on first load), avoid a pointless refresh attempt.
    if (
      status === 401 &&
      !hasAccessToken &&
      (url.includes('/auth/me') ||
        code === 'AUTH_TOKEN_MISSING' ||
        message === 'Missing auth token')
    ) {
      return Promise.reject(error);
    }
    if (status === 401 && url.includes('/auth/refresh')) {
      return Promise.reject(error);
    }
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await refreshAccessToken();
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
