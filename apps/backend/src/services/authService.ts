import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { createUser, findUserByEmail, findUserById } from "../repositories/userRepository.js";
import { PublicUser } from "../models/user.js";

function toPublicUser(user: Awaited<ReturnType<typeof findUserById>>): PublicUser {
  if (!user) {
    throw new Error("User not found");
  }
  const { passwordHash: _passwordHash, ...rest } = user;
  return rest;
}

export async function registerUser(input: {
  email: string;
  name: string;
  password: string;
}): Promise<{ user: PublicUser; token: string }> {
  const existing = await findUserByEmail(input.email);
  if (existing) {
    throw new Error("Email already in use");
  }

  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await createUser({
    email: input.email,
    name: input.name,
    passwordHash
  });

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions
  );

  return { user: toPublicUser(user), token };
}

export async function loginUser(input: {
  email: string;
  password: string;
}): Promise<{ user: PublicUser; token: string }> {
  const user = await findUserByEmail(input.email);
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions
  );

  return { user: toPublicUser(user), token };
}

export async function getCurrentUser(userId: string): Promise<PublicUser> {
  const user = await findUserById(userId);
  return toPublicUser(user);
}
