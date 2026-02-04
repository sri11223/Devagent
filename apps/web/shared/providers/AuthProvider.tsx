"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { login, me, register } from "../../features/auth/api";
import { tokenStorage } from "../utils/storage";

export type AuthUser = { id: string; email: string; name: string; createdAt: string };

type AuthContextValue = {
  user: AuthUser | null;
  status: "idle" | "loading" | "authenticated" | "unauthenticated";
  signIn: (payload: { email: string; password: string }) => Promise<void>;
  signUp: (payload: { name: string; email: string; password: string }) => Promise<void>;
  signOut: () => void;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthContextValue["status"]>("idle");

  const refresh = useCallback(async () => {
    const token = tokenStorage.get();
    if (!token) {
      setUser(null);
      setStatus("unauthenticated");
      return;
    }

    setStatus("loading");
    try {
      const response = await me();
      setUser(response.user);
      setStatus("authenticated");
    } catch (error) {
      tokenStorage.clear();
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const signIn = useCallback(async (payload: { email: string; password: string }) => {
    setStatus("loading");
    const response = await login(payload);
    tokenStorage.set(response.token);
    setUser(response.user);
    setStatus("authenticated");
  }, []);

  const signUp = useCallback(async (payload: { name: string; email: string; password: string }) => {
    setStatus("loading");
    const response = await register(payload);
    tokenStorage.set(response.token);
    setUser(response.user);
    setStatus("authenticated");
  }, []);

  const signOut = useCallback(() => {
    tokenStorage.clear();
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  const value = useMemo(
    () => ({ user, status, signIn, signUp, signOut, refresh }),
    [user, status, signIn, signUp, signOut, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
