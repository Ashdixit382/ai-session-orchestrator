import Conversation from "../conversations/conversation.model.js";
import { AppError } from "../utils/AppError.js";
import Message from "../message/message.model.js";
import { getAIProvider } from "../provider/provider.factory.js";

export const generateAIResponse = async (userId, conversationId) => {
  const exist = await Conversation.findOne({
    user: userId,
    _id: conversationId,
  });

  if (!exist) {
    throw new AppError("Conversation not found", 404);
  }

  const messages = await Message.find({
    conversation: conversationId,
  }).sort({
    createdAt: 1,
  });

  const providerMessages = messages.map((message) => ({
    role: message.role,
    content: message.content,
  }));

  const provider = getAIProvider("openai");

  const response = await provider.generateResponse(providerMessages);

  const assistantMessage = await Message.create({
    conversation: conversationId,
    role: "assistant",
    content: response.content,
  });

  return assistantMessage;
};
