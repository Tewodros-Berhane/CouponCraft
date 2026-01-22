import Joi from "joi";

export const registerSchema = Joi.object({
  businessName: Joi.string().min(2).max(120).required(),
  ownerName: Joi.string().min(2).max(120).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(7).max(32).required(),
  businessType: Joi.string().min(2).max(60).required(),
  password: Joi.string().min(8).max(128).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
});

const discountShape = {
  type: Joi.string().valid("percentage", "fixed", "bogo", "free_shipping").required(),
  percentage: Joi.number().min(0).max(100).optional(),
  amount: Joi.number().min(0).optional(),
  bogoType: Joi.string().optional(),
  minimumType: Joi.string().optional(),
  minimumAmount: Joi.number().min(0).allow("").optional(),
  minimumQuantity: Joi.number().min(0).allow("").optional(),
  specificProducts: Joi.boolean().optional(),
  stackable: Joi.boolean().optional(),
  firstTimeOnly: Joi.boolean().optional(),
  customCode: Joi.string().allow("").optional(),
};

const validityShape = {
  type: Joi.string().valid("date_range", "duration").required(),
  startDate: Joi.string().allow("").optional(),
  endDate: Joi.string().allow("").optional(),
  startTime: Joi.string().allow("").optional(),
  endTime: Joi.string().allow("").optional(),
  timeZone: Joi.string().allow("").optional(),
  durationDays: Joi.number().min(0).allow("").optional(),
  usageLimit: Joi.string().allow("").optional(),
  totalLimit: Joi.string().allow("").optional(),
  perCustomerLimit: Joi.string().allow("").optional(),
  autoDeactivate: Joi.boolean().optional(),
  expirationReminders: Joi.boolean().optional(),
  partialRedemption: Joi.boolean().optional(),
};

const customizationShapeDraft = {
  businessName: Joi.string().allow("").optional(),
  title: Joi.string().allow("").optional(),
  description: Joi.string().allow("").optional(),
  terms: Joi.string().allow("").optional(),
  logo: Joi.any().optional(),
  colors: Joi.object({
    primary: Joi.string().allow("").optional(),
    secondary: Joi.string().allow("").optional(),
    accent: Joi.string().allow("").optional(),
    text: Joi.string().allow("").optional(),
  }).optional(),
  font: Joi.string().allow("").optional(),
  showLogo: Joi.boolean().optional(),
  includeQR: Joi.boolean().optional(),
  decorativeBorder: Joi.boolean().optional(),
  gradientBackground: Joi.boolean().optional(),
  customCode: Joi.string().allow("").optional(),
};

const customizationShapeActive = {
  ...customizationShapeDraft,
  businessName: Joi.string().min(1).required(),
  title: Joi.string().min(1).required(),
};

export const businessUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(120).required(),
  phone: Joi.string().min(7).max(32).allow(null, "").optional(),
  type: Joi.string().min(2).max(60).allow(null, "").optional(),
});

export const couponSchema = Joi.object({
  template: Joi.any().optional(),
  discount: Joi.alternatives().conditional("status", {
    is: "active",
    then: Joi.object(discountShape).required(),
    otherwise: Joi.object(discountShape)
      .fork(
        Object.keys(discountShape),
        (schema) => schema.allow(null, "").optional()
      )
      .optional()
      .unknown(true),
  }),
  validity: Joi.alternatives().conditional("status", {
    is: "active",
    then: Joi.object(validityShape).required(),
    otherwise: Joi.object(validityShape)
      .fork(
        Object.keys(validityShape),
        (schema) => schema.allow(null, "").optional()
      )
      .optional()
      .unknown(true),
  }),
  customization: Joi.alternatives().conditional("status", {
    is: "active",
    then: Joi.object(customizationShapeActive).required(),
    otherwise: Joi.object(customizationShapeDraft)
      .fork(
        Object.keys(customizationShapeDraft),
        (schema) => (schema.allow ? schema.allow(null, "") : schema)
      )
      .optional()
      .unknown(true),
  }),
  status: Joi.string().valid("draft", "active").default("draft"),
  currentStep: Joi.number().integer().min(1).max(10).optional(),
});

export const signUploadSchema = Joi.object({
  filename: Joi.string().min(1).max(255).required(),
  contentType: Joi.string().min(3).max(255).required(),
});

export const createShareSchema = Joi.object({
  couponId: Joi.string().required(),
  type: Joi.string().valid("link", "qr").required(),
});

export const analyticsEventSchema = Joi.object({
  couponId: Joi.string().required(),
  eventType: Joi.string().valid("view", "click", "redemption").required(),
  meta: Joi.object().unknown(true).optional(),
});

export const redemptionValidateSchema = Joi.object({
  couponId: Joi.string().required(),
  customerRef: Joi.string().allow("", null).optional(),
});

export const redemptionConfirmSchema = Joi.object({
  couponId: Joi.string().required(),
  shareId: Joi.string().allow("", null).optional(),
  redeemToken: Joi.string().allow("", null).optional(),
  customerRef: Joi.string().allow("", null).optional(),
  context: Joi.object().unknown(true).optional(),
});
