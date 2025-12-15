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

export const couponSchema = Joi.object({
  template: Joi.any(),
  discount: Joi.object({
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
  }).required(),
  validity: Joi.object({
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
  }).required(),
  customization: Joi.object({
    businessName: Joi.string().required(),
    title: Joi.string().required(),
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
  }).required(),
  status: Joi.string().valid("draft", "active").default("draft"),
  currentStep: Joi.number().integer().min(1).max(10).optional(),
});
