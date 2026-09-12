import Conversation from "../../conversations/conversation.model.js";
import { generateConversationTitle } from "../../ai/ai.service.js";

export const processConversationJob = async (job) => {
  const { conversationId, content } = job.data;

  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  try {
    const title = await generateConversationTitle(content);

    conversation.title = title;
  } catch (error) {
    conversation.title = content.slice(0, 50);
  }

  await conversation.save();

  return {
    success: true,
    conversationId,
    title: conversation.title,
  };
};
