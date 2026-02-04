import { apiFetch } from "../../lib/apiClient";

export type Project = {
  id: string;
  name: string;
  description: string | null;
  status: "planned" | "active" | "completed";
  createdAt: string;
  updatedAt: string;
};

export async function listProjects() {
  return apiFetch<{ projects: Project[] }>("/projects");
}

export async function createProject(payload: {
  name: string;
  description?: string | null;
  status: Project["status"];
}) {
  return apiFetch<{ project: Project }>("/projects", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
