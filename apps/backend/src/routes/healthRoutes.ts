import { Router } from "express";
import { checkDatabaseHealth } from "../db/health.js";

const router = Router();

router.get("/", async (_req, res) => {
  const dbHealthy = await checkDatabaseHealth();
  return res.status(dbHealthy ? 200 : 500).json({ status: "ok", dbHealthy });
});

export default router;
