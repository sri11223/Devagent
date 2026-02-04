import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { createPipelineSchema } from "../schemas/orchestratorSchemas.js";
import { create, detail, listByProject } from "../controllers/orchestratorController.js";

const router = Router();

router.use(authenticate);

router.get("/projects/:projectId/pipelines", listByProject);
router.post("/pipelines", validateBody(createPipelineSchema), create);
router.get("/pipelines/:pipelineId", detail);

export default router;
