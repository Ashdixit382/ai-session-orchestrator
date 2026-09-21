import Message from "../message/message.model.js";
import config from "../config/index.js";
import { AppError } from "../utils/AppError.js";

export const buildConversationContext = async (conversationId, messageId) => {
  const targetMessage = await Message.findOne({
    _id: messageId,
    conversation: conversationId,
  });

  if (!targetMessage) {
    throw new AppError("Message not found", 404);
  }

  const messages = await Message.find({
    conversation: conversationId,
    createdAt: { $lte: targetMessage.createdAt },
  })
    .sort({
      createdAt: -1,
    })
    .limit(config.aiContextMessageLimit);

  messages.reverse();

  return [
    {
      role: "system",
      content: config.aiSystemPrompt,
    },

    ...messages.map((message) => ({
      role: message.role,
      content: message.content,
    })),
  ];
};
