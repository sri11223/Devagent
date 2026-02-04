import pg from "pg";
import { env } from "../config/env.js";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: env.DATABASE_URL
});

pool.on("error", (error) => {
  // eslint-disable-next-line no-console
  console.error("Unexpected PG error", error);
});
