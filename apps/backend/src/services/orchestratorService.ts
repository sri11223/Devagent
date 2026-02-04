import { findProjectById } from "../repositories/projectRepository.js";
import {
  createPipeline,
  createReview,
  createTaskContract,
  findPipelineById,
  listPipelineStages,
  listPipelinesByProject,
  listTaskContracts,
  listReviewsForContract,
  updatePipelineStatus,
  updateStageStatus,
  updateTaskContractStatus
} from "../repositories/orchestratorRepository.js";

export async function createPipelineForProject(ownerId: string, projectId: string) {
  const project = await findProjectById(projectId, ownerId);
  if (!project) {
    throw new Error("Project not found");
  }

  return createPipeline(projectId);
}

export async function getProjectPipelines(ownerId: string, projectId: string) {
  const project = await findProjectById(projectId, ownerId);
  if (!project) {
    throw new Error("Project not found");
  }

  return listPipelinesByProject(projectId);
}

export async function getPipelineDetail(pipelineId: string) {
  const pipeline = await findPipelineById(pipelineId);
  if (!pipeline) {
    throw new Error("Pipeline not found");
  }

  const [stages, contracts] = await Promise.all([
    listPipelineStages(pipelineId),
    listTaskContracts(pipelineId)
  ]);

  const contractsWithReviews = await Promise.all(
    contracts.map(async (contract) => {
      const reviews = await listReviewsForContract(contract.id);
      return { ...contract, reviews };
    })
  );

  return { pipeline, stages, contracts: contractsWithReviews };
}

export async function createContract(pipelineId: string, input: { agent: string; objective: string; input: Record<string, unknown> }) {
  const pipeline = await findPipelineById(pipelineId);
  if (!pipeline) {
    throw new Error("Pipeline not found");
  }
  return createTaskContract({ pipelineId, agent: input.agent, objective: input.objective, payload: input.input });
}

export async function updateContractStatus(contractId: string, status: "draft" | "in_progress" | "review" | "approved" | "rejected") {
  return updateTaskContractStatus(contractId, status);
}

export async function addReview(contractId: string, input: { reviewer: string; notes: string; status: "requested" | "approved" | "changes_requested" }) {
  return createReview({ contractId, reviewer: input.reviewer, notes: input.notes, status: input.status });
}

export async function updateStage(pipelineId: string, stageId: string, status: "pending" | "in_progress" | "blocked" | "completed") {
  const pipeline = await findPipelineById(pipelineId);
  if (!pipeline) {
    throw new Error("Pipeline not found");
  }
  const stage = await updateStageStatus(stageId, status);

  if (status === "in_progress") {
    await updatePipelineStatus(pipelineId, "running");
  }

  if (status === "completed") {
    const stages = await listPipelineStages(pipelineId);
    if (stages.every((item) => item.status === "completed")) {
      await updatePipelineStatus(pipelineId, "completed");
    }
  }

  return stage;
}
