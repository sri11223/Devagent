/**
 * Agent Executor - Main Entry Point
 * 
 * This service:
 * 1. Polls the database for new task contracts
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

import { Pool } from 'pg';
import { TaskQueue } from './queue/taskQueue.js';
import { executeAgent } from './agents/index.js';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function pollForTasks() {
  console.log('🔍 Polling for pending task contracts...');
  
  try {
    // Find task contracts that are "draft" status
    const result = await pool.query(
      `SELECT tc.*, op.project_id
       FROM task_contracts tc
       JOIN orchestrator_pipelines op ON tc.pipeline_id = op.id
       WHERE tc.status = 'draft'
       ORDER BY tc.created_at ASC
       LIMIT 1`
    );

    if (result.rows.length === 0) {
      console.log('No pending tasks. Waiting...');
      return;
    }

    const contract = result.rows[0];
    console.log(`\n⚙️  Found task: ${contract.agent} - ${contract.objective}`);

    // Update status to in_progress
    await pool.query(
      `UPDATE task_contracts SET status = 'in_progress'
       WHERE id = $1`,
      [contract.id]
    );

    // Execute the agent (this calls GPT-4/Claude)
    console.log(`🤖 Executing ${contract.agent}...`);
    const output = await executeAgent(contract);

    // Save output to contract
    await pool.query(
      `UPDATE task_contracts 
       SET output = $1, status = 'review'
       WHERE id = $2`,
      [JSON.stringify(output), contract.id]
    );

    console.log(`✅ Task completed! Output saved.`);
    console.log(`📁 Generated files in: ${output.outputPath}`);

  } catch (error) {
    console.error('❌ Error processing task:', error);
  }
}

async function main() {
  console.log('🚀 Agent Executor Starting...\n');
  console.log(`📂 Output directory: ${process.env.OUTPUT_DIR}`);
  console.log(`🔗 Backend API: ${process.env.BACKEND_API_URL}\n`);

  // Poll every 5 seconds
  setInterval(pollForTasks, 5000);
  
  // Also run immediately
  pollForTasks();
}

main().catch(console.error);
