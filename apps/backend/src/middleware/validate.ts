import { ZodSchema } from "zod";

export function validateBody(schema: ZodSchema) {
  return (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid request", errors: result.error.flatten() });
    }
    req.body = result.data;
    return next();
  };
}
