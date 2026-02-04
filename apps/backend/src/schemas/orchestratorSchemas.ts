import { z } from "zod";

export const createPipelineSchema = z.object({
  projectId: z.string().uuid()
});
