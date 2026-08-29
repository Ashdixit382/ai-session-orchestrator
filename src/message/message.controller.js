import { createMessage, getMessage, updateMessage, sendMessage } from "./message.service.js";

export const createMessageController = async (req, res) => {
  const userId = req.user.userId;
  const { conversationId } = req.params;

  const data = await createMessage(userId, conversationId, req.body);

  return res.status(201).json({
    success: true,
    data,
  });
};

export const sendMessageController = async (req, res) => {
  const userId = req.user.userId;
  const { conversationId } = req.params;

  const data = await sendMessage(userId, conversationId, req.body);

  return res.status(201).json({
    success: true,
    data,
  });
};

export const getMessageController = async (req, res) => {
  const userId = req.user.userId;
  const { conversationId } = req.params;

  const data = await getMessage(userId, conversationId);

  return res.status(200).json({
    success: true,
    data,
  });
};

export const updateMessageController = async (req, res) => {
  const userId = req.user.userId;

  const { conversationId, messageId } = req.params;

  const message = await updateMessage(userId, conversationId, messageId, req.body);

  return res.status(200).json({
    success: true,
    data: message,
  });
};
