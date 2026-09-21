import { createClient } from "redis";
import config from "../config/index.js";

const subscriber = createClient({
  url: config.redisUrl,
});

subscriber.on("error", (error) => {
  console.error("Redis subscriber error:", error);
});

await subscriber.connect();

export const subscribeToRealtimeEvents = async (callback) => {
  await subscriber.subscribe("ai:Response", (message) => {
    const data = JSON.parse(message);

    callback("ai:response", data);
  });
};
