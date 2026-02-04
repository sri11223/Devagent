import { apiFetch } from "../../lib/apiClient";

export type Pipeline = {
  id: string;
  projectId: string;
  status: "queued" | "running" | "blocked" | "completed";
  createdAt: string;
};

export type PipelineStage = {
  id: string;
  pipelineId: string;
  name: string;
  status: "pending" | "in_progress" | "blocked" | "completed";
  position: number;
  startedAt: string | null;
  completedAt: string | null;
};

export type TaskContract = {
  id: string;
  pipelineId: string;
  agent: string;
  objective: string;
  input: Record<string, unknown>;
  output: Record<string, unknown> | null;
  status: "draft" | "in_progress" | "review" | "approved" | "rejected";
  createdAt: string;
  reviews?: Array<{
    id: string;
    reviewer: string;
    notes: string;
    status: "requested" | "approved" | "changes_requested";
    createdAt: string;
  }>;
};

export async function listPipelinesByProject(projectId: string) {
  return apiFetch<{ pipelines: Pipeline[] }>(`/orchestrator/projects/${projectId}/pipelines`);
}

export async function createPipeline(projectId: string) {
  return apiFetch<{ pipeline: Pipeline }>("/orchestrator/pipelines", {
    method: "POST",
    body: JSON.stringify({ projectId })
  });
}

export async function getPipelineDetail(pipelineId: string) {
  return apiFetch<{ pipeline: Pipeline; stages: PipelineStage[]; contracts: TaskContract[] }>(
    `/orchestrator/pipelines/${pipelineId}`
  );
}
