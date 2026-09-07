import { createClient } from "redis";
import config from "../config/index.js";
import logger from "../utils/logger.js";

const redisClient = createClient({
  url: config.redisUrl,
});

redisClient.on("error", (error) => {
  logger.error(
    {
      err: error,
    },
    "Redis client error",
  );
});

redisClient.on("connect", () => {
  logger.info("Redis connecting...");
});

redisClient.on("ready", () => {
  logger.info("Redis connection ready");
});

redisClient.on("end", () => {
  logger.info("Redis connection closed");
});

export const connectRedis = async () => {
  if (redisClient.isOpen) {
    return;
  }

  await redisClient.connect();
};

export const disconnectRedis = async () => {
  if (!redisClient.isOpen) {
    return;
  }

  await redisClient.quit();
};

export default redisClient;
