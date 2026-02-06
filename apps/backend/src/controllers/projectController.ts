import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.js";
import {
  createProject,
  deleteProject,
  getProject,
  listUserProjects,
  updateProject
} from "../services/projectService.js";

export async function list(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const projects = await listUserProjects(req.user.userId);
  return res.status(200).json({ projects });
}

export async function detail(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const project = await getProject(req.user.userId, req.params.projectId);
    return res.status(200).json({ project });
  } catch (error) {
    return res.status(404).json({ message: (error as Error).message });
  }
}

export async function create(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const project = await createProject(req.user.userId, req.body);
  return res.status(201).json({ project });
}

export async function update(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const project = await updateProject(req.user.userId, req.params.projectId, req.body);
    return res.status(200).json({ project });
  } catch (error) {
    return res.status(404).json({ message: (error as Error).message });
  }
}

export async function remove(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    await deleteProject(req.user.userId, req.params.projectId);
    return res.status(204).send();
  } catch (error) {
    return res.status(404).json({ message: (error as Error).message });
  }
}
