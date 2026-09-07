import app from "./app.js";
import config from "./config/index.js";
import connectDB from "./database/connectDB.js";
import logger from "./utils/logger.js";
import mongoose from "mongoose";
import { connectRedis, disconnectRedis } from "../src/database/redis.js";

const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();

    const server = app.listen(config.port, () => {
      logger.info(`Server is listening on port ${config.port}`);
    });

    const gracefulShutdown = async (signal) => {
      logger.info(`${signal} received. Starting graceful shutdown...`);

      server.close(async () => {
        logger.info("HTTP server closed");

        try {
          await mongoose.connection.close();
          await disconnectRedis();

          logger.info("MongoDB connection closed");

          process.exit(0);
        } catch (error) {
          logger.error(
            {
              err: error,
            },
            "Error during graceful shutdown",
          );

          process.exit(1);
        }
      });
    };

    process.on("SIGTERM", () => {
      gracefulShutdown("SIGTERM");
    });

    process.on("SIGINT", () => {
      gracefulShutdown("SIGINT");
    });
  } catch (error) {
    logger.error(
      {
        err: error,
      },
      "Failed to start application",
    );

    process.exit(1);
  }
};

startServer();
