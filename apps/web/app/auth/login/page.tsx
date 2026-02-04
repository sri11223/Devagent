"use client";

import { useState } from "react";
import { Button } from "../../../shared/components/Button";
import { TextInput } from "../../../shared/components/TextInput";
import { useAuth } from "../../../shared/providers/AuthProvider";
import { useToastContext } from "../../../shared/providers/ToastProvider";

export default function LoginPage() {
  const { signIn, status } = useAuth();
  const toast = useToastContext();
  const [form, setForm] = useState({ email: "", password: "" });

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    try {
      await signIn(form);
      toast.push({ title: "Welcome back", description: "You are now signed in.", tone: "success" });
    } catch (error) {
      toast.push({ title: "Sign in failed", description: (error as Error).message, tone: "error" });
    }
  }

  return (
    <div className="auth-layout">
      <section>
        <h1>Welcome back</h1>
        <p className="subtitle">Sign in to manage your autonomous delivery pipelines.</p>
      </section>
      <form className="form" onSubmit={handleSubmit}>
        <TextInput
          id="email"
          label="Email"
          type="email"
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          required
        />
        <TextInput
          id="password"
          label="Password"
          type="password"
          value={form.password}
          onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
          required
        />
        <Button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
