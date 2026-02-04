import { pool } from "./pool.js";

export async function checkDatabaseHealth(): Promise<boolean> {
  const result = await pool.query("SELECT 1");
  return result.rowCount === 1;
}
