import { AIProvider } from "./provider.interface.js";
import { AIProviderError } from "./provider.error.js";

export class MockProvider extends AIProvider {
  async generateResponse(messages) {
    const lastUserMessage = [...messages].reverse().find((message) => message.role === "user");

    return {
      role: "assistant",
      content: `Mock response to: ${lastUserMessage.content}`,
    };
  }

  async generateTitle(content) {
    return {
      role: "assistant",
      content: `Mock Title: ${content.slice(0, 30)}`,
    };
    // throw new AIProviderError("AI provider request failed", "openai", 502);
  }
}
