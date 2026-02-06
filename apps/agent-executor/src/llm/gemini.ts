/**
 * Google Gemini Integration
 * FREE API with generous limits!
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

// Lazy-initialize to ensure API key is loaded from .env first
let genAI: GoogleGenerativeAI | null = null;

function getGeminiClient(): GoogleGenerativeAI {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not found in environment variables');
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function callGemini(
  messages: AIMessage[],
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}
): Promise<string> {
  const {
    model = 'gemini-2.5-flash',
    temperature = 0.7,
    maxTokens = 8000,  // Increased from 4000 for complex JSON responses
  } = options;

  try {
    const geminiModel = getGeminiClient().getGenerativeModel({ model });

    // Convert messages to Gemini format
    const systemPrompt = messages.find(m => m.role === 'system')?.content || '';
    const userMessages = messages.filter(m => m.role === 'user');
    
    const prompt = systemPrompt 
      ? `${systemPrompt}\n\n${userMessages.map(m => m.content).join('\n')}`
      : userMessages.map(m => m.content).join('\n');

    const result = await geminiModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens,
      },
    });

    return result.response.text();
  } catch (error: any) {
    console.error('❌ Gemini API Error:', error.message);
    throw error;
  }
}

export async function callGeminiWithJSON(
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

  const response = await callGemini(enhancedMessages, {
    ...options,
    temperature: options.temperature ?? 0.3,
  });

  try {
    // Clean up markdown code blocks if present
    const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('❌ Failed to parse JSON response:', response);
    throw new Error('Gemini did not return valid JSON');
  }
}
