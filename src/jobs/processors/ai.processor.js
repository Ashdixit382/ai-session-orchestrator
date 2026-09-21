import { generateAIResponse } from "../../ai/ai.service.js";
import { publishRealtimeEvent } from "../../realtime/realtime.publisher.js";

export const processAIJob = async (job) => {
  const { userId, conversationId, messageId } = job.data;

  const assistantMessage = await generateAIResponse(userId, conversationId, messageId);

  await publishRealtimeEvent("ai:Response", {
    conversationId,
    message: assistantMessage,
  });

  return {
    success: true,
    conversationId,
    messageId: assistantMessage._id.toString(),
  };
};
