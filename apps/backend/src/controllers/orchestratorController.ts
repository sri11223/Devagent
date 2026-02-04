import { AuthenticatedRequest } from "../middleware/auth.js";
import { createPipelineForProject, getPipelineDetail, getProjectPipelines } from "../services/orchestratorService.js";

export async function listByProject(req: AuthenticatedRequest, res: Express.Response) {
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

export async function create(req: AuthenticatedRequest, res: Express.Response) {
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

export async function detail(req: AuthenticatedRequest, res: Express.Response) {
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
