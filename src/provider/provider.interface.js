export class AIProvider {
  async generateResponse(messages) {
    throw new Error("generateResponse() must be implemented");
  }

  async generateTitle(content) {
    throw new Error("generateTitle() must be implemented");
  }
}
