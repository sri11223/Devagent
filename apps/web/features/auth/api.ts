import { apiFetch } from "../../lib/apiClient";

export type AuthResponse = {
  user: { id: string; email: string; name: string; createdAt: string };
  token: string;
};

export async function register(payload: { name: string; email: string; password: string }) {
  return apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function login(payload: { email: string; password: string }) {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function me() {
  return apiFetch<{ user: AuthResponse["user"] }>("/auth/me");
}
