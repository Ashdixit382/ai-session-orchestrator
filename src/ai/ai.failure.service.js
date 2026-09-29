import Message from "../message/message.model.js";
import Conversation from "../conversations/conversation.model.js";
import { AppError } from "../utils/AppError.js";

export const markAIJobAsFailed = async (userId, conversationId, messageId, sequence) => {
  const message = await Message.findOneAndUpdate(
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
      new: true,
    },
  );

  if (!message) {
    throw new AppError("Message not found or already processed", 404);
  }

  const conversation = await Conversation.findOneAndUpdate(
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

  if (!conversation) {
    throw new AppError(
      `Failed to advance processed sequence for conversation ${conversationId}`,
      409,
    );
  }

  return {
    message,
    conversation,
  };
};
