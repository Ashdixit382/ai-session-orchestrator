import Conversation from "../conversations/conversation.model.js";
import { AppError } from "../utils/AppError.js";
import Message from "../message/message.model.js";
import { getAIProvider } from "../provider/provider.factory.js";
import config from "../config/index.js";
import { buildConversationContext } from "./context.service.js";

export const generateAIResponse = async (userId, conversationId) => {
  const exist = await Conversation.findOne({
    user: userId,
    _id: conversationId,
  });

  if (!exist) {
    throw new AppError("Conversation not found", 404);
  }

  const providerMessages = await buildConversationContext(conversationId);

  const provider = getAIProvider(config.aiProvider);

  const response = await provider.generateResponse(providerMessages);

  const assistantMessage = await Message.create({
    conversation: conversationId,
    role: "assistant",
    content: response.content,
  });

  return assistantMessage;
};
