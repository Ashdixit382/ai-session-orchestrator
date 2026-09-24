import redisClient from "../database/redis.js";
import { acquireLock, releaseLock } from "./distributedLock.js";

await redisClient.connect();

const key = "ai:lock:test";

const token1 = await acquireLock(key);

console.log("Worker 1 token:", token1);

// Worker 2 tries to release Worker 1's lock
const wrongRelease = await releaseLock(key, "fake-token");

console.log("Worker 2 release result:", wrongRelease);

// Worker 1 should still own the lock
const token2 = await acquireLock(key);

console.log("Worker 2 acquire attempt:", token2);

// Now Worker 1 releases its own lock
const correctRelease = await releaseLock(key, token1);

console.log("Worker 1 release result:", correctRelease);

// Worker 2 should now be able to acquire it
const token3 = await acquireLock(key);

console.log("Worker 2 acquire after release:", token3);

await releaseLock(key, token3);

await redisClient.quit();
