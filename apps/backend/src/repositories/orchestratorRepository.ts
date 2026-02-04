import { pool } from "../db/pool.js";
import { Pipeline, PipelineStage } from "../models/pipeline.js";
import { TaskContract, AgentReview } from "../models/taskContract.js";

const DEFAULT_STAGES = [
  "Architecture",
  "Backend",
  "Frontend",
  "Security",
  "Testing",
  "Deployment"
];

export async function createPipeline(projectId: string): Promise<Pipeline> {
  const result = await pool.query<Pipeline>(
    "INSERT INTO orchestrator_pipelines (project_id) VALUES ($1) RETURNING id, project_id as \"projectId\", status, created_at as \"createdAt\"",
    [projectId]
  );
  const pipeline = result.rows[0];

  await Promise.all(
    DEFAULT_STAGES.map((stage, index) =>
      pool.query(
        "INSERT INTO pipeline_stages (pipeline_id, name, status, position) VALUES ($1, $2, $3, $4)",
        [pipeline.id, stage, "pending", index + 1]
      )
    )
  );

  return pipeline;
}

export async function listPipelinesByProject(projectId: string): Promise<Pipeline[]> {
  const result = await pool.query<Pipeline>(
    "SELECT id, project_id as \"projectId\", status, created_at as \"createdAt\" FROM orchestrator_pipelines WHERE project_id = $1 ORDER BY created_at DESC",
    [projectId]
  );
  return result.rows;
}

export async function findPipelineById(id: string): Promise<Pipeline | null> {
  const result = await pool.query<Pipeline>(
    "SELECT id, project_id as \"projectId\", status, created_at as \"createdAt\" FROM orchestrator_pipelines WHERE id = $1",
    [id]
  );
  return result.rows[0] ?? null;
}

export async function listPipelineStages(pipelineId: string): Promise<PipelineStage[]> {
  const result = await pool.query<PipelineStage>(
    "SELECT id, pipeline_id as \"pipelineId\", name, status, position, started_at as \"startedAt\", completed_at as \"completedAt\" FROM pipeline_stages WHERE pipeline_id = $1 ORDER BY position ASC",
    [pipelineId]
  );
  return result.rows;
}

export async function listTaskContracts(pipelineId: string): Promise<TaskContract[]> {
  const result = await pool.query<TaskContract>(
    "SELECT id, pipeline_id as \"pipelineId\", agent, objective, input, output, status, created_at as \"createdAt\" FROM task_contracts WHERE pipeline_id = $1 ORDER BY created_at DESC",
    [pipelineId]
  );
  return result.rows;
}

export async function listReviewsForContract(taskContractId: string): Promise<AgentReview[]> {
  const result = await pool.query<AgentReview>(
    "SELECT id, task_contract_id as \"taskContractId\", reviewer, notes, status, created_at as \"createdAt\" FROM agent_reviews WHERE task_contract_id = $1 ORDER BY created_at DESC",
    [taskContractId]
  );
  return result.rows;
}

export async function createTaskContract(input: {
  pipelineId: string;
  agent: string;
  objective: string;
  payload: Record<string, unknown>;
}): Promise<TaskContract> {
  const result = await pool.query<TaskContract>(
    "INSERT INTO task_contracts (pipeline_id, agent, objective, input) VALUES ($1, $2, $3, $4) RETURNING id, pipeline_id as \"pipelineId\", agent, objective, input, output, status, created_at as \"createdAt\"",
    [input.pipelineId, input.agent, input.objective, input.payload]
  );
  return result.rows[0];
}

export async function updateTaskContractStatus(contractId: string, status: TaskContract["status"]): Promise<TaskContract> {
  const result = await pool.query<TaskContract>(
    "UPDATE task_contracts SET status = $1 WHERE id = $2 RETURNING id, pipeline_id as \"pipelineId\", agent, objective, input, output, status, created_at as \"createdAt\"",
    [status, contractId]
  );
  return result.rows[0];
}

export async function createReview(input: {
  contractId: string;
  reviewer: string;
  notes: string;
  status: AgentReview["status"];
}): Promise<AgentReview> {
  const result = await pool.query<AgentReview>(
    "INSERT INTO agent_reviews (task_contract_id, reviewer, notes, status) VALUES ($1, $2, $3, $4) RETURNING id, task_contract_id as \"taskContractId\", reviewer, notes, status, created_at as \"createdAt\"",
    [input.contractId, input.reviewer, input.notes, input.status]
  );
  return result.rows[0];
}

export async function updateStageStatus(stageId: string, status: PipelineStage["status"]): Promise<PipelineStage> {
  const result = await pool.query<PipelineStage>(
    "UPDATE pipeline_stages SET status = $1, started_at = CASE WHEN $1 = 'in_progress' THEN NOW() ELSE started_at END, completed_at = CASE WHEN $1 = 'completed' THEN NOW() ELSE completed_at END WHERE id = $2 RETURNING id, pipeline_id as \"pipelineId\", name, status, position, started_at as \"startedAt\", completed_at as \"completedAt\"",
    [status, stageId]
  );
  return result.rows[0];
}

export async function updatePipelineStatus(pipelineId: string, status: Pipeline["status"]): Promise<Pipeline> {
  const result = await pool.query<Pipeline>(
    "UPDATE orchestrator_pipelines SET status = $1 WHERE id = $2 RETURNING id, project_id as \"projectId\", status, created_at as \"createdAt\"",
    [status, pipelineId]
  );
  return result.rows[0];
}
