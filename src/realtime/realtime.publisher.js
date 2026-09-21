import { createClient } from "redis";
import config from "../config/index.js";

const publisher = createClient({
  url: config.redisUrl,
});

publisher.on("error", (error) => {
  console.error("Redis publisher error:", error);
});

await publisher.connect();

export const publishRealtimeEvent = async (event, data) => {
  await publisher.publish(event, JSON.stringify(data));
};
