import { Queue } from "bullmq";

const conversationQueue = new Queue("conversation", {
  connection: {
    host: "localhost",
    port: 6379,
  },
});

export default conversationQueue;
