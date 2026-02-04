"use client";

import { useState } from "react";
import { Button } from "../../../shared/components/Button";
import { TextInput } from "../../../shared/components/TextInput";
import { useAuth } from "../../../shared/providers/AuthProvider";
import { useToastContext } from "../../../shared/providers/ToastProvider";

export default function RegisterPage() {
  const { signUp, status } = useAuth();
  const toast = useToastContext();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    try {
      await signUp(form);
      toast.push({ title: "Account created", description: "Welcome to Devagent.", tone: "success" });
    } catch (error) {
      toast.push({ title: "Sign up failed", description: (error as Error).message, tone: "error" });
    }
  }

  return (
    <div className="auth-layout">
      <section>
        <h1>Create your account</h1>
        <p className="subtitle">Launch a new workspace and coordinate multi-agent builds.</p>
      </section>
      <form className="form" onSubmit={handleSubmit}>
        <TextInput
          id="name"
          label="Name"
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          required
        />
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
          hint="Use at least 10 characters with a mix of symbols."
        />
        <Button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Creating..." : "Create account"}
        </Button>
      </form>
    </div>
  );
}
