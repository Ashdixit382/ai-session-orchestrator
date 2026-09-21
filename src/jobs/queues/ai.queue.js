import { Queue } from "bullmq";

const aiQueue = new Queue("ai", {
  connection: {
    host: "localhost",
    port: 6379,
  },
});

export default aiQueue;
