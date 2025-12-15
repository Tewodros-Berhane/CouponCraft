import { Router } from "express";
import { nanoid } from "nanoid";
import { prisma } from "../db/prisma.js";
import { requireAuth } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { createShareSchema } from "../validators.js";
import { config } from "../config.js";

export const sharesRouter = Router();

sharesRouter.use(requireAuth);

sharesRouter.get("/:couponId", async (req, res) => {
  const coupon = await prisma.coupon.findUnique({ where: { id: req.params.couponId } });
  if (!coupon) return res.status(404).json({ message: "Coupon not found" });
  const business = await prisma.business.findUnique({ where: { ownerId: req.user.id } });
  if (!business || coupon.businessId !== business.id) {
    return res.status(403).json({ message: "Access denied" });
  }
  const shares = await prisma.share.findMany({
    where: { couponId: coupon.id },
    orderBy: { createdAt: "desc" },
  });
  return res.json({ data: shares });
});

sharesRouter.post("/", validate(createShareSchema), async (req, res) => {
  const { couponId, type, channel, config } = req.body;
  const coupon = await prisma.coupon.findUnique({ where: { id: couponId } });
  if (!coupon) return res.status(404).json({ message: "Coupon not found" });
  const business = await prisma.business.findUnique({ where: { ownerId: req.user.id } });
  if (!business || coupon.businessId !== business.id) {
    return res.status(403).json({ message: "Access denied" });
  }
  const shareId = nanoid();
  const shareUrlBase = (config.clientOrigin || "http://localhost:5173").replace(/\/+$/, "");
  const shareUrl = `${shareUrlBase}/redeem/${shareId}`;

  const share = await prisma.share.create({
    data: {
      id: shareId,
      couponId,
      type,
      channel: channel || null,
      config: { ...(config || {}), shareUrl },
    },
  });
  return res.status(201).json({ data: share });
});
