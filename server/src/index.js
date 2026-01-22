import { createServer } from "http";
import { config } from "./config.js";
import { createApp } from "./app.js";
import { logger } from "./logger.js";
import { cleanupExpiredRedeemTokens, scheduleCleanup } from "./jobs/cleanupRedeemTokens.js";

const start = async () => {
  const app = await createApp();
  const server = createServer(app);
  server.listen(config.port, () => {
    logger.info(`API listening on http://localhost:${config.port}`);
  });

  const runCleanup = async () => {
    const count = await cleanupExpiredRedeemTokens(new Date());
    if (count > 0) {
      logger.info({ count }, "Expired redeem tokens cleaned");
    }
  };

  scheduleCleanup(runCleanup, 24 * 60 * 60 * 1000);
  runCleanup().catch((err) => {
    logger.error(err, "Redeem token cleanup failed");
  });
};

start().catch((err) => {
  logger.error(err, "Failed to start server");
  process.exit(1);
});
