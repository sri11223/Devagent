import { Router } from "express";
import authRoutes from "./authRoutes.js";
import projectRoutes from "./projectRoutes.js";
import healthRoutes from "./healthRoutes.js";
import orchestratorRoutes from "./orchestratorRoutes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/projects", projectRoutes);
router.use("/orchestrator", orchestratorRoutes);

export default router;
