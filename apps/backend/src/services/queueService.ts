import { Queue } from "bullmq";
import { env } from "../config/env.js";

import { TaskContract } from "../models/taskContract.js";

// Import Shared TaskContract from models

// Reuse the Redis connection details from environment or defaults
const connection = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
};

export const taskQueue = new Queue("agent-tasks", { connection });

export async function addTaskToQueue(contract: TaskContract) {
  try {
    console.log(`[Queue] Adding task ${contract.id} for agent ${contract.agent}`);

    await taskQueue.add("execute-agent", {
      contractId: contract.id,
      agent: contract.agent,
      objective: contract.objective
    }, {
      removeOnComplete: true,
      removeOnFail: false,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      }
    });

    return true;
  } catch (error) {
    console.error(`[Queue] Failed to add task ${contract.id}:`, error);
    return false;
  }
}
