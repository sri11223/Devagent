import { findProjectById } from "../repositories/projectRepository.js";
import {
  createPipeline,
  findPipelineById,
  listPipelineStages,
  listPipelinesByProject,
  listTaskContracts,
  listReviewsForContract
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
