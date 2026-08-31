import { OpenAIProvider } from "./openai.provider.js";
import { AppError } from "../utils/AppError.js";
import { MockProvider } from "./mock.provider.js";

export const getAIProvider = (providerName) => {
  switch (providerName) {
    case "openai":
      return new OpenAIProvider();

    case "mock":
      return new MockProvider();

    default:
      throw new AppError(`Unsupported AI provider: ${providerName}`, 400);
  }
};
