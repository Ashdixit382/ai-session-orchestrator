export class AIProviderError extends Error {
  constructor(message, provider, statusCode = 502) {
    super(message);

    this.name = "AIProviderError";
    this.provider = provider;
    this.statusCode = statusCode;
  }
}