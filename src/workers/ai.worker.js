import { Worker, UnrecoverableError } from "bullmq";
import mongoose from "mongoose";
import { processAIJob } from "../jobs/processors/ai.processor.js";
import connectDB from "../database/connectDB.js";
import redisClient from "../database/redis.js";
import Message from "../message/message.model.js";
import Conversation from "../conversations/conversation.model.js";
import { publishRealtimeEvent } from "../realtime/realtime.publisher.js";

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

  const isUnrecoverable = error instanceof UnrecoverableError;

  const isFinalAttempt = isUnrecoverable || job.attemptsMade >= maxAttempts;

  if (!isFinalAttempt) {
    return;
  }

  const { messageId, conversationId, userId, sequence } = job.data;

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      // 1. Mark user message as failed
      const updatedMessage = await Message.findOneAndUpdate(
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
        {
          session,
          new: true,
        },
      );

      if (!updatedMessage) {
        throw new Error(`Failed to mark message ${messageId} as failed`);
      }

      // 2. Advance processed sequence
      const updatedConversation = await Conversation.findOneAndUpdate(
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
        {
          session,
          new: true,
        },
      );

      if (!updatedConversation) {
        throw new Error(`Failed to advance processed sequence for conversation ${conversationId}`);
      }
    });
  } finally {
    await session.endSession();
  }

  // 3. Publish only after transaction succeeds
  await publishRealtimeEvent("ai:error", {
    conversationId,
    messageId,
    sequence,
    message: error.message || "AI response generation failed",
  });
});

const shutdown = async (signal) => {
  console.log(`${signal} received. Shutting down AI worker...`);

  await worker.close();

  await redisClient.quit();

  await mongoose.connection.close();

  console.log("AI worker shut down gracefully");

  process.exit(0);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

console.log("AI worker started");
