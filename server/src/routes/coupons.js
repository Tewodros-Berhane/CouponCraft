import { Router } from "express";
import { nanoid } from "nanoid";
import { requireAuth } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { couponSchema } from "../validators.js";
import { prisma } from "../db/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const couponsRouter = Router();

couponsRouter.use(requireAuth);

const parsePagination = (req) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
  return { page, limit, skip: (page - 1) * limit };
};

couponsRouter.get("/", asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req);
  const business = await prisma.business.findUnique({ where: { ownerId: req.user.id } });
  if (!business) {
    return res.status(404).json({ message: "Business not found" });
  }
  const [total, coupons] = await Promise.all([
    prisma.coupon.count({ where: { businessId: business.id } }),
    prisma.coupon.findMany({
      where: { businessId: business.id },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
  ]);
  return res.json({
    data: coupons,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
  });
}));

couponsRouter.post("/", validate(couponSchema), asyncHandler(async (req, res) => {
  const business = await prisma.business.findUnique({ where: { ownerId: req.user.id } });
  if (!business) {
    return res.status(404).json({ message: "Business not found" });
  }
  const coupon = await prisma.coupon.create({
    data: {
      id: nanoid(),
      businessId: business.id,
      status: req.body.status || "draft",
      template: req.body.template,
      discount: req.body.discount,
      validity: req.body.validity,
      customization: req.body.customization,
      currentStep: req.body.currentStep || 1,
    },
  });
  return res.status(201).json({ data: coupon });
}));

couponsRouter.get("/:id", asyncHandler(async (req, res) => {
  const coupon = await prisma.coupon.findUnique({ where: { id: req.params.id } });
  if (!coupon) {
    return res.status(404).json({ message: "Coupon not found" });
  }
  const business = await prisma.business.findUnique({ where: { ownerId: req.user.id } });
  if (!business || coupon.businessId !== business.id) {
    return res.status(403).json({ message: "Access denied" });
  }
  return res.json({ data: coupon });
}));

couponsRouter.patch("/:id", validate(couponSchema), asyncHandler(async (req, res) => {
  const coupon = await prisma.coupon.findUnique({ where: { id: req.params.id } });
  if (!coupon) {
    return res.status(404).json({ message: "Coupon not found" });
  }
  const business = await prisma.business.findUnique({ where: { ownerId: req.user.id } });
  if (!business || coupon.businessId !== business.id) {
    return res.status(403).json({ message: "Access denied" });
  }
  const updated = await prisma.coupon.update({
    where: { id: req.params.id },
    data: {
      status: req.body.status || coupon.status,
      template: req.body.template,
      discount: req.body.discount,
      validity: req.body.validity,
      customization: req.body.customization,
      currentStep: req.body.currentStep ?? coupon.currentStep,
    },
  });
  return res.json({ data: updated });
}));
