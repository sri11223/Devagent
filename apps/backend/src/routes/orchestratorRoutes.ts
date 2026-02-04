import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import {
  createContractSchema,
  createPipelineSchema,
  createReviewSchema,
  updateContractStatusSchema,
  updateStageSchema
} from "../schemas/orchestratorSchemas.js";
import {
  create,
  createContractForPipeline,
  createReviewForContract,
  detail,
  listByProject,
  updateContract,
  updateStageStatus
} from "../controllers/orchestratorController.js";

const router = Router();

router.use(authenticate);

router.get("/projects/:projectId/pipelines", listByProject);
router.post("/pipelines", validateBody(createPipelineSchema), create);
router.get("/pipelines/:pipelineId", detail);
router.post("/pipelines/:pipelineId/contracts", validateBody(createContractSchema), createContractForPipeline);
router.patch("/contracts/:contractId/status", validateBody(updateContractStatusSchema), updateContract);
router.post("/contracts/:contractId/reviews", validateBody(createReviewSchema), createReviewForContract);
router.patch("/pipelines/:pipelineId/stages/:stageId", validateBody(updateStageSchema), updateStageStatus);

export default router;
