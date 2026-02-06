/**
 * AI Provider Router
 * Automatically picks the best available AI provider
 */

import { callGPT4, callGPT4WithJSON } from './openai.js';
import { callGemini, callGeminiWithJSON } from './gemini.js';
import { callOllama, callOllamaWithJSON } from './ollama.js';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export type AIProvider = 'openai' | 'gemini' | 'ollama' | 'auto';

function getProvider(): AIProvider {
  const provider = (process.env.AI_PROVIDER || 'auto').toLowerCase();
  
  if (provider === 'auto') {
    // Priority: Gemini (free) > OpenAI (paid) > Ollama (local)
    if (process.env.GEMINI_API_KEY) return 'gemini';
    if (process.env.OPENAI_API_KEY) return 'openai';
    return 'ollama';
  }
  
  return provider as AIProvider;
}

export async function callAI(
  messages: AIMessage[],
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}
): Promise<string> {
  const provider = getProvider();
  
  console.log(`🤖 Using AI provider: ${provider}`);

  switch (provider) {
    case 'gemini':
      return await callGemini(messages, options);
    case 'openai':
      return await callGPT4(messages, options);
    case 'ollama':
      return await callOllama(messages, options);
    default:
      throw new Error(`Unknown AI provider: ${provider}`);
  }
}

export async function callAIWithJSON(
  messages: AIMessage[],
  options: {
    model?: string;
    temperature?: number;
  } = {}
): Promise<any> {
  const provider = getProvider();
  
  console.log(`🤖 Using AI provider: ${provider} (JSON mode)`);

  switch (provider) {
    case 'gemini':
      return await callGeminiWithJSON(messages, options);
    case 'openai':
      return await callGPT4WithJSON(messages, options);
    case 'ollama':
      return await callOllamaWithJSON(messages, options);
    default:
      throw new Error(`Unknown AI provider: ${provider}`);
  }
}
