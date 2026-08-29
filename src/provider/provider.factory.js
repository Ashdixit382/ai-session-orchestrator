import { OpenAIProvider } from "./openai.provider.js";
import { AppError } from "../utils/AppError.js";
export const getAIProvider = (providerName) => {
  switch (providerName) {
    case "openai":
      return new OpenAIProvider();

    default:
      throw new AppError(`Unsupported AI provider: ${providerName}`, 400);
  }
};
