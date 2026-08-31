import OpenAI from "openai";
import { AIProvider } from "./provider.interface.js";
import config from "../config/index.js";
import { AIProviderError } from "./provider.error.js";

export class OpenAIProvider extends AIProvider {
  constructor() {
    super();

    this.client = new OpenAI({
      apiKey: config.openAIApiKey,
    });
  }

  async generateResponse(messages) {
    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
      });

      return response.choices[0].message;
    } catch (error) {
      throw new AIProviderError("AI provider request failed", "openai", 502);
    }
  }
}
