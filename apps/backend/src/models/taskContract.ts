export type TaskContract = {
  id: string;
  pipelineId: string;
  agent: string;
  objective: string;
  input: Record<string, unknown>;
  output: Record<string, unknown> | null;
  status: "draft" | "in_progress" | "review" | "approved" | "rejected";
  createdAt: Date;
};

export type AgentReview = {
  id: string;
  taskContractId: string;
  reviewer: string;
  notes: string;
  status: "requested" | "approved" | "changes_requested";
  createdAt: Date;
};
