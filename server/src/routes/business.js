import { Router } from "express";
import { prisma } from "../db/prisma.js";
import { requireAuth } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { businessUpdateSchema } from "../validators.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const businessRouter = Router();

businessRouter.use(requireAuth);

businessRouter.get("/", asyncHandler(async (req, res) => {
  const business = await prisma.business.findUnique({ where: { ownerId: req.user.id } });
  if (!business) {
    return res.status(404).json({ message: "Business not found" });
  }
  return res.json({ data: business });
}));

businessRouter.patch("/", validate(businessUpdateSchema), asyncHandler(async (req, res) => {
  const business = await prisma.business.findUnique({ where: { ownerId: req.user.id } });
  if (!business) {
    return res.status(404).json({ message: "Business not found" });
  }
  const updated = await prisma.business.update({
    where: { id: business.id },
    data: {
      name: req.body.name,
      phone: req.body.phone || null,
      type: req.body.type || null,
    },
  });
  return res.json({ data: updated });
}));
