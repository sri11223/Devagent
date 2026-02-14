import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.js";
import {
  addReview,
  createContract,
  createPipelineForProject,
  getPipelineDetail,
  getProjectPipelines,
  updateContractStatus,
  updateStage
} from "../services/orchestratorService.js";

export async function listByProject(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const pipelines = await getProjectPipelines(req.user.userId, req.params.projectId);
    return res.status(200).json({ pipelines });
  } catch (error) {
    return res.status(404).json({ message: (error as Error).message });
  }
}

export async function create(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const pipeline = await createPipelineForProject(req.user.userId, req.body.projectId);
    return res.status(201).json({ pipeline });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
}

export async function detail(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const detail = await getPipelineDetail(req.params.pipelineId);
    return res.status(200).json(detail);
  } catch (error) {
    return res.status(404).json({ message: (error as Error).message });
  }
}

import { addTaskToQueue } from "../services/queueService.js";

export async function createContractForPipeline(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const contract = await createContract(req.params.pipelineId, req.body);

    // Add to queue for asynchronous processing
    await addTaskToQueue(contract);

    return res.status(201).json({ contract });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
}

export async function updateContract(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const contract = await updateContractStatus(req.params.contractId, req.body.status);
    return res.status(200).json({ contract });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
}

export async function createReviewForContract(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const review = await addReview(req.params.contractId, req.body);
    return res.status(201).json({ review });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
}

export async function updateStageStatus(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const stage = await updateStage(req.params.pipelineId, req.params.stageId, req.body.status);
    return res.status(200).json({ stage });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
}
