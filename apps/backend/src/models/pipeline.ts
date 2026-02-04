export type Pipeline = {
  id: string;
  projectId: string;
  status: "queued" | "running" | "blocked" | "completed";
  createdAt: Date;
};

export type PipelineStage = {
  id: string;
  pipelineId: string;
  name: string;
  status: "pending" | "in_progress" | "blocked" | "completed";
  position: number;
  startedAt: Date | null;
  completedAt: Date | null;
};
