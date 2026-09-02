import Message from "../message/message.model.js";
import config from "../config/index.js";

export const buildConversationContext = async (conversationId) => {
  const messages = await Message.find({
    conversation: conversationId,
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
