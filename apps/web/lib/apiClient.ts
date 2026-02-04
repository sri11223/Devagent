import { config } from "./config";
import { tokenStorage } from "../shared/utils/storage";

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = tokenStorage.get();
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${config.apiBaseUrl}${path}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: "Unknown error" }));
    throw new Error(errorBody.message ?? "Request failed");
  }

  return response.json() as Promise<T>;
}
