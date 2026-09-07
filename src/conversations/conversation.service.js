import { AppError } from "../utils/AppError.js";
import Conversation from "./conversation.model.js";
import { setCache, getCache, deleteCache } from "../services/cache.service.js";
import logger from "../utils/logger.js";

export const createConversation = async (userId, conversationData) => {
  const conversation = await Conversation.create({
    user: userId,
    title: conversationData.title,
  });

  await deleteCache(`conversations:${userId}`);

  return conversation;
};

export const getConversations = async (userId) => {
  const cacheKey = `conversations:${userId}`;

  const cached = await getCache(cacheKey);

  if (cached) {
    logger.info("Conversation cache hit");
    return cached;
  }

  logger.info("Conversation cache miss");

  const conversations = await Conversation.find({
    user: userId,
  }).sort({
    updatedAt: -1,
  });

  await setCache(cacheKey, conversations, 360);

  return conversations;
};

export const getConversationById = async (userId, conversationId) => {
  const cacheKey = `conversation:${conversationId}`;

  const cached = await getCache(cacheKey);

  if (cached) {
    return cached;
  }

  const conversation = await Conversation.findOne({
    _id: conversationId,
    user: userId,
  });

  if (!conversation) {
    throw new AppError("Conversation not found", 404);
  }

  await setCache(cacheKey, conversation, 60);

  return conversation;
};

export const updateConversation = async (userId, conversationId, conversationData) => {
  const conversation = await Conversation.findOneAndUpdate(
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

  await deleteCache(`conversations:${userId}`);
  await deleteCache(`conversation:${conversationId}`);

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

  await deleteCache(`conversations:${userId}`);
  await deleteCache(`conversation:${conversationId}`);
};
