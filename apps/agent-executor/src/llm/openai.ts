/**
 * OpenAI GPT-4 Integration
 */

import OpenAI from 'openai';

// Only initialize if API key is provided
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function callGPT4(
  messages: AIMessage[],
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}
): Promise<string> {
  const {
    model = process.env.OPENAI_MODEL || 'gpt-4-turbo',
    temperature = 0.7,
    maxTokens = 4000,
  } = options;

  if (!openai) {
    throw new Error('OpenAI API key not configured. Set OPENAI_API_KEY in .env or use a different AI provider.');
  }

  try {
    const completion = await openai.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error: any) {
    console.error('❌ OpenAI API Error:', error.message);
    throw error;
  }
}

export async function callGPT4WithJSON(
  messages: AIMessage[],
  options: {
    model?: string;
    temperature?: number;
  } = {}
): Promise<any> {
  const response = await callGPT4(messages, {
    ...options,
    temperature: options.temperature ?? 0.3, // Lower temp for JSON
  });

  try {
    return JSON.parse(response);
  } catch (error) {
    console.error('❌ Failed to parse JSON response:', response);
    throw new Error('GPT-4 did not return valid JSON');
  }
}
