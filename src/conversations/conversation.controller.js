import {
  createConversation,
  getConversations,
  getConversationById,
  updateConversation,
  deleteConversation,
} from "./conversation.service.js";

export const createConversationController = async (req, res) => {
  const userId = req.user.userId;

  const conversation = await createConversation(userId, req.body);

  return res.status(201).json({
    success: true,
    data: conversation,
  });
};

export const getConversationsController = async (req, res) => {
  const userId = req.user.userId;

  const conversations = await getConversations(userId);

  return res.status(200).json({
    success: true,
    data: conversations,
  });
};

export const getConversationController = async (req, res) => {
  const userId = req.user.userId;
  const { conversationId } = req.params;

  const conversation = await getConversationById(userId, conversationId);

  return res.status(200).json({
    success: true,
    data: conversation,
  });
};

export const updateConversationController = async (req, res) => {
  const userId = req.user.userId;
  const { conversationId } = req.params;

  const conversation = await updateConversation(userId, conversationId, req.body);

  return res.status(200).json({
    success: true,
    data: conversation,
  });
};

export const deleteConversationController = async (req, res) => {
  const userId = req.user.userId;
  const { conversationId } = req.params;

  await deleteConversation(userId, conversationId);

  return res.status(200).json({
    success: true,
    message: "Conversation deleted successfully",
  });
};
