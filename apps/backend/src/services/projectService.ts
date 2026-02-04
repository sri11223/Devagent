import {
  createProject as createProjectRepo,
  deleteProject as deleteProjectRepo,
  findProjectById,
  listProjects,
  updateProject as updateProjectRepo
} from "../repositories/projectRepository.js";
import { Project } from "../models/project.js";

export async function listUserProjects(ownerId: string): Promise<Project[]> {
  return listProjects(ownerId);
}

export async function getProject(ownerId: string, id: string): Promise<Project> {
  const project = await findProjectById(id, ownerId);
  if (!project) {
    throw new Error("Project not found");
  }
  return project;
}

export async function createProject(ownerId: string, input: {
  name: string;
  description: string | null;
  status: Project["status"];
}): Promise<Project> {
  return createProjectRepo({ ownerId, ...input });
}

export async function updateProject(ownerId: string, id: string, updates: Partial<Project>): Promise<Project> {
  const project = await updateProjectRepo(id, ownerId, updates);
  if (!project) {
    throw new Error("Project not found");
  }
  return project;
}

export async function deleteProject(ownerId: string, id: string): Promise<void> {
  const removed = await deleteProjectRepo(id, ownerId);
  if (!removed) {
    throw new Error("Project not found");
  }
}
