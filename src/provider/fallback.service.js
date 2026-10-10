import config from "../config/index.js";
import { getAIProvider } from "./provider.factory.js";
import { AIProviderError } from "./provider.error.js";

const shouldFallback = (error) => {
  if (error instanceof AIProviderError && !error.retryable) {
    return false;
  }

  return true;
};

export const generateWithFallback = async (messages) => {
  const primaryProvider = getAIProvider(config.aiProvider);

  try {
    return await primaryProvider.generateResponse(messages);
  } catch (error) {
    if (!shouldFallback(error)) {
      throw error;
    }

    if (!config.aiFallbackProvider) {
      throw error;
    }

    if (config.aiFallbackProvider === config.aiProvider) {
      throw error;
    }

    const fallbackProvider = getAIProvider(config.aiFallbackProvider);

    return await fallbackProvider.generateResponse(messages);
  }
};

export const generateTitleWithFallback = async (content) => {
  const primaryProvider = getAIProvider(config.aiProvider);

  try {
    return await primaryProvider.generateTitle(content);
  } catch (error) {
    if (!shouldFallback(error)) {
      throw error;
    }

    if (!config.aiFallbackProvider) {
      throw error;
    }

    if (config.aiFallbackProvider === config.aiProvider) {
      throw error;
    }

    const fallbackProvider = getAIProvider(config.aiFallbackProvider);

    return await fallbackProvider.generateTitle(content);
  }
};
