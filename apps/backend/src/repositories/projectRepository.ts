import { pool } from "../db/pool.js";
import { Project } from "../models/project.js";

export async function listProjects(ownerId: string): Promise<Project[]> {
  const result = await pool.query<Project>(
    "SELECT id, owner_id as \"ownerId\", name, description, status, created_at as \"createdAt\", updated_at as \"updatedAt\" FROM projects WHERE owner_id = $1 ORDER BY updated_at DESC",
    [ownerId]
  );
  return result.rows;
}

export async function findProjectById(id: string, ownerId: string): Promise<Project | null> {
  const result = await pool.query<Project>(
    "SELECT id, owner_id as \"ownerId\", name, description, status, created_at as \"createdAt\", updated_at as \"updatedAt\" FROM projects WHERE id = $1 AND owner_id = $2",
    [id, ownerId]
  );
  return result.rows[0] ?? null;
}

export async function createProject(input: {
  ownerId: string;
  name: string;
  description: string | null;
  status: Project["status"];
}): Promise<Project> {
  const result = await pool.query<Project>(
    "INSERT INTO projects (owner_id, name, description, status) VALUES ($1, $2, $3, $4) RETURNING id, owner_id as \"ownerId\", name, description, status, created_at as \"createdAt\", updated_at as \"updatedAt\"",
    [input.ownerId, input.name, input.description, input.status]
  );
  return result.rows[0];
}

export async function updateProject(
  id: string,
  ownerId: string,
  updates: Partial<Pick<Project, "name" | "description" | "status">>
): Promise<Project | null> {
  const fields: string[] = [];
  const values: Array<string | null> = [];
  let index = 1;

  if (updates.name !== undefined) {
    fields.push(`name = $${index}`);
    values.push(updates.name);
    index += 1;
  }
  if (updates.description !== undefined) {
    fields.push(`description = $${index}`);
    values.push(updates.description ?? null);
    index += 1;
  }
  if (updates.status !== undefined) {
    fields.push(`status = $${index}`);
    values.push(updates.status);
    index += 1;
  }

  if (fields.length === 0) {
    return findProjectById(id, ownerId);
  }

  values.push(id, ownerId);
  const query = `UPDATE projects SET ${fields.join(", ")}, updated_at = NOW() WHERE id = $${index} AND owner_id = $${index + 1} RETURNING id, owner_id as \"ownerId\", name, description, status, created_at as \"createdAt\", updated_at as \"updatedAt\"`;
  const result = await pool.query<Project>(query, values);
  return result.rows[0] ?? null;
}

export async function deleteProject(id: string, ownerId: string): Promise<boolean> {
  const result = await pool.query("DELETE FROM projects WHERE id = $1 AND owner_id = $2", [id, ownerId]);
  return result.rowCount === 1;
}
