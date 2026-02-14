/**
 * Agent Executor - Main Entry Point
 * 
 * This service:
 * 1. Listens to Redis Queue for new task contracts
 * 2. Routes contracts to appropriate AI agents
 * 3. Saves generated code to file system
 * 4. Updates contract status in database
 */

// CRITICAL: Load env vars FIRST, before any other imports!
import dotenv from 'dotenv';
dotenv.config();

// Debug: Check if API key loaded
console.log('🔑 Environment Check:');
console.log('   GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? `${process.env.GEMINI_API_KEY.substring(0, 10)}...` : '❌ NOT FOUND');
console.log('   AI_PROVIDER:', process.env.AI_PROVIDER);
console.log('   DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Missing');
console.log('');

import { startWorker } from './queue/worker.js';

async function main() {
  console.log('🚀 Agent Executor Starting...\n');
  console.log(`📂 Output directory: ${process.env.OUTPUT_DIR}`);
  console.log(`🔗 Backend API: ${process.env.BACKEND_API_URL}\n`);

  // Start the BullMQ Worker
  startWorker();
}

main().catch(console.error);
