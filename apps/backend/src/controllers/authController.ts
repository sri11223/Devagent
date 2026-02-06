import { Request, Response } from "express";
import { registerUser, loginUser, getCurrentUser } from "../services/authService.js";
import { AuthenticatedRequest } from "../middleware/auth.js";

export async function register(req: Request, res: Response) {
  try {
    const result = await registerUser(req.body);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const result = await loginUser(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(401).json({ message: (error as Error).message });
  }
}

export async function me(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await getCurrentUser(req.user.userId);
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(404).json({ message: (error as Error).message });
  }
}
