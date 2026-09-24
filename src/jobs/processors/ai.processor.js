import { generateAIResponse } from "../../ai/ai.service.js";
import { publishRealtimeEvent } from "../../realtime/realtime.publisher.js";
import { acquireLock, releaseLock } from "../../utils/distributedLock.js";
import Conversation from "../../conversations/conversation.model.js";
import { DelayedError } from "bullmq";
import Message from "../../message/message.model.js";

export const processAIJob = async (job, token) => {
  const { userId, conversationId, messageId, sequence } = job.data;

  const lockKey = `ai:lock:conversation:${conversationId}`;

  // 1. Check conversation first
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

  // 3. Now acquire the conversation lock
  const lockToken = await acquireLock(lockKey);

  if (!lockToken) {
    await job.moveToDelayed(Date.now() + 1000, token);

    throw new DelayedError();
  }

  try {
    const assistantMessage = await generateAIResponse(userId, conversationId, messageId);

    await publishRealtimeEvent("ai:response", {
      conversationId,
      messageId: assistantMessage._id.toString(),
      message: assistantMessage,
    });

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
    // 7. Always release Redis lock
    await releaseLock(lockKey, lockToken);
  }
};
