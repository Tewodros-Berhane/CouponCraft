import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { prisma } from "../db/prisma.js";
import { COOKIE_NAMES } from "../utils/cookies.js";

export const requireAuth = async (req, res, next) => {
  const header = req.headers.authorization;
  const bearerToken =
    typeof header === "string" && header.startsWith("Bearer ") ? header.replace("Bearer ", "") : null;
  const cookieToken = req.cookies?.[COOKIE_NAMES.access] || null;
  const token = bearerToken || cookieToken;

  if (!token) {
    return res.status(401).json({ message: "Missing auth token" });
  }
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      include: { business: true },
    });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
