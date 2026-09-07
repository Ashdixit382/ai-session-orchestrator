import redisClient from "../database/redis.js";
import logger from "../utils/logger.js";

export const getCache = async (key) => {
  try {
    const value = await redisClient.get(key);

    if (!value) {
      return null;
    }

    return JSON.parse(value);
  } catch (error) {
    logger.error(
      {
        err: error,
        key,
      },
      "Redis cache read failed",
    );

    return null;
  }
};

export const setCache = async (key, value, ttlSeconds = 60) => {
  try {
    await redisClient.set(key, JSON.stringify(value), {
      EX: ttlSeconds,
    });
  } catch (error) {
    logger.error(
      {
        err: error,
        key,
      },
      "Redis cache write failed",
    );
  }
};

export const deleteCache = async (key) => {
  try {
    await redisClient.del(key);
  } catch (error) {
    logger.error(
      {
        err: error,
        key,
      },
      "Redis cache deletion failed",
    );
  }
};
