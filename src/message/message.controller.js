import { createMessage, getMessage, updateMessage, sendMessage } from "./message.service.js";
import { publishRealtimeEvent } from "../realtime/realtime.publisher.js";
import { sendMessageSchema } from "./message.schema.js";
import { AppError } from "../utils/AppError.js";
import { isValidObjectId } from "../utils/validators.js";

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

  if (!isValidObjectId(conversationId)) {
    throw new AppError("Invalid conversation ID", 400);
  }

  const result = sendMessageSchema.safeParse(req.body);

  if (!result.success) {
    throw new AppError(result.error.issues[0].message, 400);
  }

  const data = await sendMessage(userId, conversationId, result.data);

  await publishRealtimeEvent("message:new", {
    conversationId,
    message: data.userMessage,
  });

  return res.status(201).json({
    success: true,
    data,
  });
};

export const getMessageController = async (req, res) => {
  const userId = req.user.userId;
  const { conversationId } = req.params;

  if (!isValidObjectId(conversationId)) {
    throw new AppError("Invalid conversation ID", 400);
  }

  const { limit = 20, cursor } = req.query;

  const parsedLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);

  const data = await getMessage(userId, conversationId, parsedLimit, cursor);

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
