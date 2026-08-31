import Message from "../message/message.model.js";

export const buildConversationContext = async (conversationId) => {
  const messages = await Message.find({
    conversation: conversationId,
  }).sort({
    createdAt: 1,
  });

  return [
    {
      role: "system",
      content:
        "You are a helpful software engineering assistant. Give clear, accurate, and concise answers.",
    },

    ...messages.map((message) => ({
      role: message.role,
      content: message.content,
    })),
  ];
};
