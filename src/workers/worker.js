import { Worker } from "bullmq";
import { processConversationJob } from "../jobs/processors/conversation.processor.js";
import logger from "../utils/logger.js";

const worker = new Worker("conversation", processConversationJob , {
  connection: {
    host: "localhost",
    port: 6379,
  },
  concurrency: 3,
});

worker.on("completed", (job) => {
  logger.info(
    {
      jobId: job.id,
      jobName: job.name,
      attemptsMade: job.attemptsMade,
    },
    "Background job completed",
  );
});

worker.on("failed", (job, error) => {
  logger.error(
    {
      jobId: job?.id,
      jobName: job?.name,
      attemptsMade: job?.attemptsMade,
      err: error,
    },
    "Background job failed",
  );
});

worker.on("error", (error) => {
  logger.error(
    {
      err: error,
    },
    "Worker error",
  );
});

const gracefulShutdown = async (signal) => {
  console.log(`${signal} received. Shutting down worker...`);

  await worker.close();

  console.log("Worker closed");

  process.exit(0);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

console.log("worker started");
