import redisClient from "../database/redis.js";
import { randomUUID } from "crypto";

export const acquireLock = async (key, ttl = 120) => {
  const token = randomUUID();

  const result = await redisClient.set(key, token, {
    NX: true,
    EX: ttl,
  });

  if (result !== "OK") {
    return null;
  }
  return token;
};

export const renewLock = async (key, token, ttl = 30) => {
  const script = `
    if redis.call("GET", KEYS[1]) == ARGV[1] then
      return redis.call("EXPIRE", KEYS[1], ARGV[2])
    else
      return 0
    end
  `;

  return redisClient.eval(script, {
    keys: [key],
    arguments: [token, ttl.toString()],
  });
};

export const releaseLock = async (key, token) => {
  const script = `
    if redis.call("GET", KEYS[1]) == ARGV[1] then
      return redis.call("DEL", KEYS[1])
    else
      return 0
    end
  `;

  return redisClient.eval(script, {
    keys: [key],
    arguments: [token],
  });
};
