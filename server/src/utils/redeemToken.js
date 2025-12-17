import crypto from "crypto";
import { nanoid } from "nanoid";

export const generateRedeemToken = () => nanoid(48);

export const hashRedeemToken = (token) =>
  crypto.createHash("sha256").update(String(token || ""), "utf8").digest("hex");

