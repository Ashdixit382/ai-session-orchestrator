import { acquireLock, releaseLock } from "./distributedLock.js";
import redisClient from "../database/redis.js";
await redisClient.connect();

const key = "ai:lock:test";
const token1 = await acquireLock(key);

console.log("Worker 1 token:", token1);

const token2 = await acquireLock(key);

console.log("Worker 2 token:", token2);

await releaseLock(key, token1);

console.log("Worker 1 released the lock");

const token3 = await acquireLock(key);

console.log("Worker 3 token:", token3);

await redisClient.close();
