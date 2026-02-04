import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export type AuthPayload = {
  userId: string;
  email: string;
};

export type AuthenticatedRequest = Express.Request & {
  user?: AuthPayload;
};

export function authenticate(
  req: AuthenticatedRequest,
  res: Express.Response,
  next: Express.NextFunction
) {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: "Missing Authorization header" });
  }

  const [, token] = header.split(" ");
  if (!token) {
    return res.status(401).json({ message: "Invalid Authorization header" });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
