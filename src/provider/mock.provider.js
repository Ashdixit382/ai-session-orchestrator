import { AIProvider } from "./provider.interface.js";

export class MockProvider extends AIProvider {
  async generateResponse(messages) {
    const lastUserMessage = [...messages].reverse().find((message) => message.role === "user");

    return {
      role: "assistant",
      content: `Mock response to: ${lastUserMessage.content}`,
    };
  }
}
