import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";

export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: env.NODE_ENV === "development" ? 10000 : 300, // Very high limit in dev for testing
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks and auth in development
    if (env.NODE_ENV === "development") {
      return req.path === "/api/health" || req.path.startsWith("/api/auth");
    }
    return req.path === "/api/health";
  },
  message: { message: "Too many requests, please try again later." }
});
