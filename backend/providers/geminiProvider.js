import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIProvider } from './aiProvider.js';
import { config } from '../config/env.js';

export class GeminiProvider extends AIProvider {
  constructor() {
    super('Gemini');
    if (!config.geminiApiKey) throw new Error('Gemini API Key missing');
    const genAI = new GoogleGenerativeAI(config.geminiApiKey);
    this.model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
  }

  async generateContent(prompt, history = []) {
    const chat = this.model.startChat({
      history: history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      })),
    });

    const result = await chat.sendMessage(prompt);
    return result.response.text();
  }
}
