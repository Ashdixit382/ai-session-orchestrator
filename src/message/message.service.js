import Message from "./message.model.js";
import Conversation from "../conversations/conversation.model.js";
import { AppError } from "../utils/AppError.js";
import { generateAIResponse, generateConversationTitle } from "../ai/ai.service.js";
import conversationQueue from "../jobs/queues/conversation.queue.js";

export const sendMessage = async (userId, conversationId, messageData) => {
  const conversation = await Conversation.findOne({
    _id: conversationId,
    user: userId,
  });

  if (!conversation) {
    throw new AppError("Conversation not found", 404);
  }

  const messageCount = await Message.countDocuments({
    conversation: conversationId,
  });

  const isFirstMessage = messageCount === 0;

  const userMessage = await Message.create({
    conversation: conversationId,
    role: "user",
    content: messageData.content,
  });

  try {
    if (isFirstMessage) {
      await conversationQueue.add(
        "generate-title",
        {
          conversationId: conversation._id.toString(),
          content: messageData.content,
          userId: userId.toString(),
        },
        {
          jobId: `title-${conversation._id}`,
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 1000,
          },
          removeOnComplete: {
            age: 3600,
            count: 1000,
          },
          removeOnFail: {
            age: 86400,
            count: 5000,
          },
        },
      );
    }

    const assistantMessage = await generateAIResponse(userId, conversationId);

    return {
      userMessage,
      assistantMessage,
    };
  } catch (error) {
    await userMessage.deleteOne();

    throw error;
  }
};

export const createMessage = async (userId, conversationId, messageData) => {
  const conversation = await Conversation.findOne({
    _id: conversationId,
    user: userId,
  });

  if (!conversation) {
    throw new AppError("Conversation not found", 404);
  }

  const message = await Message.create({
    conversation: conversationId,
    role: "user",
    content: messageData.content,
  });

  return message;
};

export const getMessage = async (userId, conversationId) => {
  const conversation = await Conversation.findOne({
    _id: conversationId,
    user: userId,
  });

  if (!conversation) {
    throw new AppError("Conversation not found", 404);
  }

  const messages = await Message.find({
    conversation: conversationId,
  }).sort({
    createdAt: 1,
  });

  return messages;
};

export const updateMessage = async (userId, conversationId, messageId, messageData) => {
  const conversation = await Conversation.findOne({
    _id: conversationId,
    user: userId,
  });

  if (!conversation) {
    throw new AppError("Conversation not found", 404);
  }

  const message = await Message.findOneAndUpdate(
    {
      _id: messageId,
      conversation: conversationId,
      role: "user",
    },
    {
      $set: {
        content: messageData.content,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!message) {
    throw new AppError("Message not found", 404);
  }

  return message;
};
