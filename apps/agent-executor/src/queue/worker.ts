import { Worker, Job } from "bullmq";
import { executeAgent, TaskContract } from "../agents/index.js";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

// Redis connection
const connection = {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
};

// Database connection for updating status
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export const startWorker = () => {
    console.log("👷 Starting Agent Worker...");

    const worker = new Worker(
        "agent-tasks",
        async (job: Job) => {
            console.log(`\n📨 Received Job ${job.id}: ${job.name}`);
            const { contractId, agent, objective } = job.data;

            try {
                // 1. Fetch full contract details from DB to ensure we have latest state
                const result = await pool.query(
                    "SELECT * FROM task_contracts WHERE id = $1",
                    [contractId]
                );

                if (result.rows.length === 0) {
                    throw new Error(`Contract ${contractId} not found`);
                }

                const contract = result.rows[0] as TaskContract;

                // 2. Update status to in_progress
                await pool.query(
                    "UPDATE task_contracts SET status = 'in_progress' WHERE id = $1",
                    [contractId]
                );

                // 3. Execute the agent
                console.log(`🤖 Executing ${agent}...`);
                const output = await executeAgent(contract);

                // 4. Update status to review (or whatever executeAgent returns)
                await pool.query(
                    "UPDATE task_contracts SET output = $1, status = 'review' WHERE id = $2",
                    [JSON.stringify(output), contractId]
                );

                console.log(`✅ Job ${job.id} completed successfully`);
                return output;

            } catch (error) {
                console.error(`❌ Job ${job.id} failed:`, error);

                // Update status to failed
                await pool.query(
                    "UPDATE task_contracts SET status = 'failed' WHERE id = $1",
                    [contractId]
                );

                throw error;
            }
        },
        {
            connection,
            concurrency: 5 // Process 5 agents in parallel
        }
    );

    worker.on("completed", (job) => {
        console.log(`🎉 Job ${job.id} finished!`);
    });

    worker.on("failed", (job, err) => {
        console.error(`💀 Job ${job?.id} failed with ${err.message}`);
    });

    console.log("🚀 Worker is ready and listening for tasks!");
};
