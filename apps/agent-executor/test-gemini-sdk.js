// Direct test of Gemini SDK with the API key
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

console.log('🔑 API Key:', apiKey?.substring(0, 15) + '...');
console.log('🔑 Full Key Length:', apiKey?.length);
console.log('');

const genAI = new GoogleGenerativeAI(apiKey || '');
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

console.log('🤖 Testing Gemini API call...');

const result = await model.generateContent({
  contents: [{ role: 'user', parts: [{ text: 'Say "Hello, it works!" and nothing else.' }] }],
});

console.log('✅ Response:', result.response.text());
console.log('\n🎉 SUCCESS!! Gemini API works!');
