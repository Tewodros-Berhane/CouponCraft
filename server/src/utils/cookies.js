import crypto from "crypto";
import { config } from "../config.js";

export const COOKIE_NAMES = {
  access: "access_token",
  refresh: "refresh_token",
  csrf: "XSRF-TOKEN",
};

const normalizeSameSite = () => {
  const value = (config.cookieSameSite || "lax").toLowerCase();
  if (value === "strict" || value === "lax") return value;
  if (value === "none") {
    // Browsers require Secure for SameSite=None. Fall back for local HTTP dev.
    return config.cookieSecure ? "none" : "lax";
  }
  return "lax";
};

const durationToMs = (value, fallbackMs) => {
  if (!value) return fallbackMs;
  if (typeof value === "number" && Number.isFinite(value)) return value * 1000;
  const text = String(value).trim();
  const match = /^(\d+)\s*([smhd])$/.exec(text);
  if (!match) return fallbackMs;
  const count = Number(match[1]);
  const unit = match[2];
  const mult = unit === "s" ? 1000 : unit === "m" ? 60_000 : unit === "h" ? 3_600_000 : 86_400_000;
  return count * mult;
};

const baseCookieOptions = () => ({
  secure: Boolean(config.cookieSecure),
  sameSite: normalizeSameSite(),
});

export const setSessionCookies = (res, tokens) => {
  const accessMaxAge = durationToMs(config.jwtExpiresIn, 60 * 60 * 1000);
  const refreshMaxAge = durationToMs(config.refreshExpiresIn, 7 * 24 * 60 * 60 * 1000);

  res.cookie(COOKIE_NAMES.access, tokens.accessToken, {
    ...baseCookieOptions(),
    httpOnly: true,
    path: "/",
    maxAge: accessMaxAge,
  });
  res.cookie(COOKIE_NAMES.refresh, tokens.refreshToken, {
    ...baseCookieOptions(),
    httpOnly: true,
    path: "/api/auth",
    maxAge: refreshMaxAge,
  });
};

export const clearSessionCookies = (res) => {
  res.clearCookie(COOKIE_NAMES.access, { ...baseCookieOptions(), httpOnly: true, path: "/" });
  res.clearCookie(COOKIE_NAMES.refresh, { ...baseCookieOptions(), httpOnly: true, path: "/api/auth" });
  res.clearCookie(COOKIE_NAMES.csrf, { ...baseCookieOptions(), httpOnly: false, path: "/" });
};

export const ensureCsrfCookie = (req, res) => {
  if (req.cookies?.[COOKIE_NAMES.csrf]) return req.cookies[COOKIE_NAMES.csrf];
  const token = crypto.randomBytes(32).toString("hex");
  const csrfMaxAge = durationToMs(config.refreshExpiresIn, 7 * 24 * 60 * 60 * 1000);
  res.cookie(COOKIE_NAMES.csrf, token, {
    ...baseCookieOptions(),
    httpOnly: false,
    path: "/",
    maxAge: csrfMaxAge,
  });
  return token;
};
