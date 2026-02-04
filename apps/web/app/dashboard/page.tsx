"use client";

import { useEffect, useState } from "react";
import { Button } from "../../shared/components/Button";
import { TextInput } from "../../shared/components/TextInput";
import { EmptyState } from "../../shared/components/EmptyState";
import { SectionHeader } from "../../shared/components/SectionHeader";
import { Tag } from "../../shared/components/Tag";
import { useAuth } from "../../shared/providers/AuthProvider";
import { useToastContext } from "../../shared/providers/ToastProvider";
import { useProjects } from "../../shared/hooks/useProjects";
import type { Project } from "../../features/projects/api";

export default function DashboardPage() {
  const { user, status } = useAuth();
  const toast = useToastContext();
  const { projects, loading, error, load, create } = useProjects();
  const [form, setForm] = useState({ name: "", description: "", status: "planned" as Project["status"] });

  useEffect(() => {
    if (status === "authenticated") {
      load();
    }
  }, [status, load]);

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    try {
      await create({
        name: form.name,
        description: form.description || null,
        status: form.status
      });
      setForm({ name: "", description: "", status: "planned" });
      toast.push({ title: "Project created", description: "Your request has been queued.", tone: "success" });
    } catch (err) {
      toast.push({ title: "Unable to create project", description: (err as Error).message, tone: "error" });
    }
  }

  if (status === "unauthenticated") {
    return (
      <EmptyState
        title="Sign in to view your pipeline"
        description="Authenticate to create projects and track multi-agent execution."
        action={{ label: "Go to login", href: "/auth/login" }}
      />
    );
  }

  return (
    <div className="dashboard">
      <section className="dashboard-hero">
        <div>
          <h1>Orchestration dashboard</h1>
          <p className="subtitle">
            Track active builds, coordinate agents, and monitor quality gates in a single view.
          </p>
        </div>
        {user && (
          <div className="user-summary">
            <p>Workspace owner</p>
            <strong>{user.name}</strong>
            <span>{user.email}</span>
          </div>
        )}
      </section>

      <section className="panel">
        <SectionHeader
          title="Create a new project"
          subtitle="Provide a short brief and priority. The orchestrator will draft the execution plan."
        />
        <form className="form" onSubmit={handleCreate}>
          <TextInput
            id="project-name"
            label="Project name"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            required
          />
          <div className="input">
            <label htmlFor="project-description">Description</label>
            <textarea
              id="project-description"
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              rows={4}
            />
          </div>
          <div className="input">
            <label htmlFor="project-status">Status</label>
            <select
              id="project-status"
              value={form.status}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, status: event.target.value as Project["status"] }))
              }
            >
              <option value="planned">Planned</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create project"}
          </Button>
        </form>
      </section>

      <section className="panel">
        <SectionHeader title="Active projects" subtitle="Latest pipeline runs and agent outputs." />
        {error && <p className="error">{error}</p>}
        <div className="grid">
          {projects.map((project) => (
            <div key={project.id} className="card project-card">
              <Tag tone={project.status === "completed" ? "success" : "primary"}>{project.status}</Tag>
              <h3>{project.name}</h3>
              <p>{project.description ?? "No description provided."}</p>
              <small>Updated {new Date(project.updatedAt).toLocaleString()}</small>
            </div>
          ))}
          {!projects.length && !loading && (
            <EmptyState
              title="No projects yet"
              description="Create your first project to kick off the orchestrator pipeline."
            />
          )}
        </div>
      </section>
    </div>
  );
}
