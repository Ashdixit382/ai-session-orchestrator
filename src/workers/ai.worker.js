import { Worker } from "bullmq";
import { processAIJob } from "../jobs/processors/ai.processor.js";
import connectDB from "../database/connectDB.js";
import redisClient from "../database/redis.js";
import Message from "../message/message.model.js";
import Conversation from "../conversations/conversation.model.js";

await connectDB();
await redisClient.connect();

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

worker.on("failed", async (job, error) => {
  console.error(`AI job ${job?.id} failed:`, error.message);

  if (!job) {
    return;
  }

  const maxAttempts = job.opts.attempts ?? 1;

  const isFinalAttempt = job.attemptsMade >= maxAttempts;

  if (!isFinalAttempt) {
    return;
  }

  const { messageId, conversationId, userId, sequence } = job.data;

  await Message.findOneAndUpdate(
    {
      _id: messageId,
      conversation: conversationId,
      aiStatus: "pending",
    },
    {
      $set: {
        aiStatus: "failed",
      },
    },
  );

  await Conversation.findOneAndUpdate(
    {
      _id: conversationId,
      user: userId,
      processedSequence: sequence - 1,
    },
    {
      $set: {
        processedSequence: sequence,
      },
    },
  );
});

console.log("AI worker started");
