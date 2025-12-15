import { createServer } from "http";
import { config } from "./config.js";
import { createApp } from "./app.js";
import { logger } from "./logger.js";

const start = async () => {
  const app = await createApp();
  const server = createServer(app);
  server.listen(config.port, () => {
    logger.info(`API listening on http://localhost:${config.port}`);
  });
};

start().catch((err) => {
  logger.error(err, "Failed to start server");
  process.exit(1);
});
