import { COOKIE_NAMES } from "../utils/cookies.js";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export const csrfProtection = (req, res, next) => {
  if (SAFE_METHODS.has(req.method)) return next();

  // Signed upload PUTs are authorized via signature, and the upload URL cannot be obtained without CSRF-protected auth.
  if (req.method === "PUT" && req.path.startsWith("/api/uploads/put/") && req.query?.sig) return next();

  const authHeader = req.headers.authorization;
  const usingBearer = typeof authHeader === "string" && authHeader.startsWith("Bearer ");
  if (usingBearer) return next();

  const hasSessionCookies =
    Boolean(req.cookies?.[COOKIE_NAMES.access]) || Boolean(req.cookies?.[COOKIE_NAMES.refresh]);
  if (!hasSessionCookies) return next();

  const csrfCookie = req.cookies?.[COOKIE_NAMES.csrf];
  const csrfHeader = req.get("X-XSRF-TOKEN") || req.get("X-CSRF-Token");
  if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
    return res.status(403).json({ message: "CSRF token invalid" });
  }
  return next();
};
