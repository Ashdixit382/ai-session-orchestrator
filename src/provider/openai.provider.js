import OpenAI from "openai";
import { AIProvider } from "./provider.interface.js";
import config from "../config/index.js";

export class OpenAIProvider extends AIProvider {
  constructor() {
    super();

    this.client = new OpenAI({
      apiKey: config.openAIApiKey,
    });
  }

  async generateResponse(messages) {
    const response = await this.client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
    });

    return response.choices[0].message;
  }
}