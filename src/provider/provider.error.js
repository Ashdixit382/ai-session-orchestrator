export class AIProviderError extends Error {
  constructor(message, provider, statusCode = 502, retryable = true) {
    super(message);

    this.name = "AIProviderError";
    this.provider = provider;
    this.statusCode = statusCode;
    this.retryable = retryable;
  }
}
