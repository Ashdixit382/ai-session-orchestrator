import { AppError } from "../utils/AppError.js";
import Conversation from "./conversation.model.js";

export const createConversation = async (userId, conversationData) => {
  const conversation = await Conversation.create({
    user: userId,
    title: conversationData.title,
  });

  return conversation;
};

export const getConversations = async (userId) => {
  const conversations = await Conversation.find({
    user: userId,
  }).sort({
    updatedAt: -1,
  });

  return conversations;
};

export const getConversationById = async (userId, conversationId) => {
  const conversation = await Conversation.find({
    _id: conversationId,
    user: userId,
  });

  if (!conversation) {
    throw new AppError("Conversation not found", 404);
  }
  return conversation;
};

export const updateConversation = (userId, conversationId, conversationData) => {
  const conversation = Conversation.findOneAndUpdate(
    {
      _id: conversationId,
      user: userId,
    },
    {
      $set: {
        title: conversationData.title,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!conversation) {
    throw new AppError("Conversation not found", 404);
  }

  return conversation;
};

export const deleteConversation = async (userId, conversationId) => {
  const conversation = await Conversation.findOneAndDelete({
    _id: conversationId,
    user: userId,
  });

  if (!conversation) {
    throw new AppError("Conversation not found", 404);
  }
};
