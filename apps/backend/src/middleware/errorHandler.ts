import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (error instanceof ZodError) {
    return res.status(400).json({ message: "Validation error", errors: error.flatten() });
  }

  // eslint-disable-next-line no-console
  console.error("Unhandled error", error);
  return res.status(500).json({ message: "Internal server error" });
}
