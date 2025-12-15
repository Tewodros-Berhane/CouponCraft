import { Router } from "express";
import { nanoid } from "nanoid";
import { requireAuth } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { signUploadSchema } from "../validators.js";

export const uploadsRouter = Router();

uploadsRouter.use(requireAuth);

uploadsRouter.post("/sign", validate(signUploadSchema), (req, res) => {
  const { filename, contentType } = req.body;
  // Placeholder signed URL; replace with S3/GCS logic later.
  const key = `${Date.now()}-${nanoid()}-${filename}`;
  const fakeUrl = `https://uploads.example.com/${key}`;
  return res.json({
    uploadUrl: fakeUrl,
    assetUrl: fakeUrl,
    contentType,
    expiresIn: 900,
  });
});
