import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { createProjectSchema, updateProjectSchema } from "../schemas/projectSchemas.js";
import { create, detail, list, remove, update } from "../controllers/projectController.js";

const router = Router();

router.use(authenticate);

router.get("/", list);
router.post("/", validateBody(createProjectSchema), create);
router.get("/:projectId", detail);
router.patch("/:projectId", validateBody(updateProjectSchema), update);
router.delete("/:projectId", remove);

export default router;
