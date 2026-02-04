import { pool } from "../db/pool.js";
import { User } from "../models/user.js";

export async function findUserByEmail(email: string): Promise<User | null> {
  const result = await pool.query<User>(
    "SELECT id, email, name, password_hash as \"passwordHash\", created_at as \"createdAt\" FROM users WHERE email = $1",
    [email]
  );
  return result.rows[0] ?? null;
}

export async function findUserById(id: string): Promise<User | null> {
  const result = await pool.query<User>(
    "SELECT id, email, name, password_hash as \"passwordHash\", created_at as \"createdAt\" FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0] ?? null;
}

export async function createUser(user: {
  email: string;
  name: string;
  passwordHash: string;
}): Promise<User> {
  const result = await pool.query<User>(
    "INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3) RETURNING id, email, name, password_hash as \"passwordHash\", created_at as \"createdAt\"",
    [user.email, user.name, user.passwordHash]
  );
  return result.rows[0];
}
