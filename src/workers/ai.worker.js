import { Worker } from "bullmq";
import { processAIJob } from "../jobs/processors/ai.processor.js";
import connectDB from "../database/connectDB.js";

await connectDB();

const worker = new Worker("ai", processAIJob, {
  connection: {
    host: "localhost",
    port: 6379,
  },
  concurrency: 3,
});

worker.on("completed", (job, result) => {
  console.log(`AI job ${job.id} completed`);
  console.log(result);
});

worker.on("failed", (job, error) => {
  console.error(`AI job ${job?.id} failed:`, error.message);
});

console.log("AI worker started");
