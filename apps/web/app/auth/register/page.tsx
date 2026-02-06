"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "../../../shared/components/Button";
import { TextInput } from "../../../shared/components/TextInput";
import { useAuth } from "../../../shared/providers/AuthProvider";
import { useToastContext } from "../../../shared/providers/ToastProvider";

export default function RegisterPage() {
  const router = useRouter();
  const { signUp, status } = useAuth();
  const toast = useToastContext();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    try {
      await signUp(form);
      toast.push({ title: "Account created!", description: "Welcome to Devagent.", tone: "success" });
      router.push("/dashboard");
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
          placeholder="Your name"
          required
        />
        <TextInput
          id="email"
          label="Email"
          type="email"
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          placeholder="you@example.com"
          required
        />
        <TextInput
          id="password"
          label="Password"
          type="password"
          value={form.password}
          onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
          placeholder="At least 10 characters"
          required
          hint="Use at least 10 characters with a mix of symbols."
        />
        <Button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Creating..." : "Create account"}
        </Button>
        <p style={{ textAlign: "center", marginTop: "16px", color: "var(--muted)" }}>
          Already have an account?{" "}
          <Link href="/auth/login" style={{ color: "var(--primary)", fontWeight: 600 }}>
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
