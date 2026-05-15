/**
 * Abstract Base Class for AI Providers.
 * Ensures consistent interface across Gemini, OpenAI, etc.
 */
export class AIProvider {
  constructor(name) {
    this.name = name;
  }

  async generateContent(prompt, context = []) {
    throw new Error('Method generateContent() must be implemented');
  }
}
