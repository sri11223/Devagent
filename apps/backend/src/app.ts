import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes/index.js";
import { env } from "./config/env.js";
import { apiRateLimiter } from "./middleware/rateLimit.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(morgan("combined"));
app.use(express.json({ limit: "1mb" }));
app.use(apiRateLimiter);

app.get("/", (_req, res) => {
  res.status(200).json({ message: "Devagent API" });
});

app.use("/api", routes);

app.use(errorHandler);

export default app;
