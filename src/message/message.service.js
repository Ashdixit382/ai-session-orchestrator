import Message from "./message.model.js";
import Conversation from "../conversations/conversation.model.js";
import { AppError } from "../utils/AppError.js";
import { generateAIResponse, generateConversationTitle } from "../ai/ai.service.js";

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
      try {
        const title = await generateConversationTitle(messageData.content);

        conversation.title = title;
      } catch (error) {
        conversation.title = messageData.content.slice(0, 50);
      }

      await conversation.save();
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
