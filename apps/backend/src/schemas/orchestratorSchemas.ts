import { z } from "zod";

export const createPipelineSchema = z.object({
  projectId: z.string().uuid()
});

export const createContractSchema = z.object({
  agent: z.string().min(2),
  objective: z.string().min(5),
  input: z.record(z.string(), z.unknown()).default({})
});

export const updateContractStatusSchema = z.object({
  status: z.enum(["draft", "in_progress", "review", "approved", "rejected"])
});

export const createReviewSchema = z.object({
  reviewer: z.string().min(2),
  notes: z.string().min(3),
  status: z.enum(["requested", "approved", "changes_requested"]).default("requested")
});

export const updateStageSchema = z.object({
  status: z.enum(["pending", "in_progress", "blocked", "completed"])
});
