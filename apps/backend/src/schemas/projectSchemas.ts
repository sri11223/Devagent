import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().max(1000).nullable().optional(),
  status: z.enum(["planned", "active", "completed"]).default("planned")
});

export const updateProjectSchema = createProjectSchema.partial();
