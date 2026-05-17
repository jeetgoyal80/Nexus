import app from "./app.js";

import { connectDB } from "../config/db.js";
import { env } from "../config/env.js";
import logger from "../config/logger.js";

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT}`);
    });

    const shutdown = (signal) => {
      logger.info(`${signal} received. Shutting down gracefully.`);
      server.close(() => {
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (error) {
    logger.error(error.message);
    process.exit(1);
  }
};

startServer();
