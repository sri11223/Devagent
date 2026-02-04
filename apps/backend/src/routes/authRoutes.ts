import { Router } from "express";
import { login, me, register } from "../controllers/authController.js";
import { validateBody } from "../middleware/validate.js";
import { loginSchema, registerSchema } from "../schemas/authSchemas.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);
router.get("/me", authenticate, me);

export default router;
