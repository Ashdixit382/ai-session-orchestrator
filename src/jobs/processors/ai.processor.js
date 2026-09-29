import { generateAIResponse } from "../../ai/ai.service.js";
import { publishRealtimeEvent } from "../../realtime/realtime.publisher.js";
import { acquireLock, releaseLock, renewLock } from "../../utils/distributedLock.js";
import Conversation from "../../conversations/conversation.model.js";
import { DelayedError, UnrecoverableError } from "bullmq";
import Message from "../../message/message.model.js";
import { AIProviderError } from "../../provider/provider.error.js";

export const processAIJob = async (job, token) => {
  const { userId, conversationId, messageId, sequence } = job.data;

  const lockKey = `ai:lock:conversation:${conversationId}`;

  // 1. Check conversation
  const conversation = await Conversation.findOne({
    _id: conversationId,
    user: userId,
  });

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  // 2. Sequence is not ready → delay the job
  if (sequence !== conversation.processedSequence + 1) {
    await job.moveToDelayed(Date.now() + 1000, token);

    throw new DelayedError();
  }

  // 3. Acquire conversation lock
  const lockToken = await acquireLock(lockKey);

  if (!lockToken) {
    await job.moveToDelayed(Date.now() + 1000, token);

    throw new DelayedError();
  }

  // 4. Keep lock alive during long AI generation
  const lockTtl = 30;

  const renewalInterval = setInterval(async () => {
    try {
      const renewed = await renewLock(lockKey, lockToken, lockTtl);

      if (renewed !== 1) {
        console.error(`Failed to renew lock for conversation ${conversationId}`);
      }
    } catch (error) {
      console.error(`Lock renewal error for conversation ${conversationId}:`, error);
    }
  }, 10_000);

  try {
    let assistantMessage;

    try {
      assistantMessage = await generateAIResponse(userId, conversationId, messageId, sequence);
    } catch (error) {
      // Permanent provider error → don't let BullMQ retry it
      if (error instanceof AIProviderError && !error.retryable) {
        throw new UnrecoverableError(error.message);
      }

      // Temporary provider error → BullMQ should retry
      throw error;
    }

    // 5. Publish successful response
    await publishRealtimeEvent("ai:response", {
      conversationId,
      messageId: assistantMessage._id.toString(),
      message: assistantMessage,
    });

    // 6. Mark user message as completed
    await Message.findOneAndUpdate(
      {
        _id: messageId,
        conversation: conversationId,
        aiStatus: "pending",
      },
      {
        $set: {
          aiStatus: "completed",
        },
      },
    );

    // 7. Advance processed sequence atomically
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
        new: true,
      },
    );

    if (!updatedConversation) {
      throw new Error(`Failed to update processed sequence for conversation ${conversationId}`);
    }

    return {
      success: true,
      conversationId,
      messageId: assistantMessage._id.toString(),
    };
  } finally {
    // 8. Stop renewal and release lock
    clearInterval(renewalInterval);

    await releaseLock(lockKey, lockToken);
  }
};
