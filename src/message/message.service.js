import Message from "./message.model.js";
import Conversation from "../conversations/conversation.model.js";
import { AppError } from "../utils/AppError.js";

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
