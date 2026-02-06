/**
 * Ollama Integration (Run AI models locally - 100% FREE!)
 * No API key needed, runs on your computer
 */

import axios from 'axios';

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function callOllama(
  messages: AIMessage[],
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}
): Promise<string> {
  const {
    model = 'llama3.2',
    temperature = 0.7,
  } = options;

  try {
    // Convert messages to Ollama format
    const systemPrompt = messages.find(m => m.role === 'system')?.content || '';
    const userMessages = messages.filter(m => m.role === 'user');
    
    const prompt = systemPrompt 
      ? `${systemPrompt}\n\n${userMessages.map(m => m.content).join('\n')}`
      : userMessages.map(m => m.content).join('\n');

    const response = await axios.post(`${OLLAMA_URL}/api/generate`, {
      model,
      prompt,
      stream: false,
      options: {
        temperature,
      },
    });

    return response.data.response;
  } catch (error: any) {
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Ollama is not running. Install from https://ollama.ai and run: ollama serve');
    }
    console.error('❌ Ollama Error:', error.message);
    throw error;
  }
}

export async function callOllamaWithJSON(
  messages: AIMessage[],
  options: {
    model?: string;
    temperature?: number;
  } = {}
): Promise<any> {
  const systemMsg = messages.find(m => m.role === 'system');
  const enhancedMessages = [
    {
      role: 'system' as const,
      content: `${systemMsg?.content || ''}\n\nIMPORTANT: Return ONLY valid JSON, no markdown, no explanations.`,
    },
    ...messages.filter(m => m.role !== 'system'),
  ];

  const response = await callOllama(enhancedMessages, {
    ...options,
    temperature: options.temperature ?? 0.3,
  });

  try {
    const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('❌ Failed to parse JSON response:', response);
    throw new Error('Ollama did not return valid JSON');
  }
}
