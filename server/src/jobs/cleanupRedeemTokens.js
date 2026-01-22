import { prisma } from "../db/prisma.js";
import { logger } from "../logger.js";

export const cleanupExpiredRedeemTokens = async (now = new Date()) => {
  const result = await prisma.redeemToken.deleteMany({
    where: { expiresAt: { lt: now } },
  });
  return result.count;
};

export const scheduleCleanup = (task, intervalMs) => {
  setInterval(() => {
    task().catch((err) => {
      logger.error(err, "Redeem token cleanup failed");
    });
  }, intervalMs);
};
