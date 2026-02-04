"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "../../shared/components/Button";
import { TextInput } from "../../shared/components/TextInput";
import { EmptyState } from "../../shared/components/EmptyState";
import { SectionHeader } from "../../shared/components/SectionHeader";
import { Tag } from "../../shared/components/Tag";
import { useAuth } from "../../shared/providers/AuthProvider";
import { useToastContext } from "../../shared/providers/ToastProvider";
import { useProjects } from "../../shared/hooks/useProjects";
import { usePipelines } from "../../shared/hooks/usePipelines";
import type { Project } from "../../features/projects/api";

export default function DashboardPage() {
  const { user, status } = useAuth();
  const toast = useToastContext();
  const { projects, loading, error, load, create } = useProjects();
  const [form, setForm] = useState({ name: "", description: "", status: "planned" as Project["status"] });
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) ?? null,
    [projects, selectedProjectId]
  );

  const pipelineHook = usePipelines(selectedProject?.id);

  useEffect(() => {
    if (status === "authenticated") {
      load();
    }
  }, [status, load]);

  useEffect(() => {
    if (!selectedProjectId && projects.length) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

  useEffect(() => {
    pipelineHook.load();
  }, [pipelineHook, selectedProject?.id]);

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

  async function handleCreatePipeline() {
    if (!selectedProject) {
      toast.push({ title: "Select a project", description: "Choose a project before creating a pipeline." });
      return;
    }
    try {
      await pipelineHook.create();
      toast.push({ title: "Pipeline created", description: "Agents are now assigned to stages.", tone: "success" });
    } catch (err) {
      toast.push({ title: "Pipeline failed", description: (err as Error).message, tone: "error" });
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
            <button
              key={project.id}
              className={`card project-card ${selectedProjectId === project.id ? "selected" : ""}`}
              type="button"
              onClick={() => setSelectedProjectId(project.id)}
            >
              <Tag tone={project.status === "completed" ? "success" : "primary"}>{project.status}</Tag>
              <h3>{project.name}</h3>
              <p>{project.description ?? "No description provided."}</p>
              <small>Updated {new Date(project.updatedAt).toLocaleString()}</small>
            </button>
          ))}
          {!projects.length && !loading && (
            <EmptyState
              title="No projects yet"
              description="Create your first project to kick off the orchestrator pipeline."
            />
          )}
        </div>
      </section>

      <section className="panel">
        <SectionHeader
          title="Pipeline runs"
          subtitle="Track orchestration status, stage progress, and agent contracts."
        >
          <Button variant="secondary" onClick={handleCreatePipeline} disabled={!selectedProject}>
            Create pipeline
          </Button>
        </SectionHeader>
        {selectedProject ? (
          <div className="pipeline-overview">
            <div className="pipeline-header">
              <h3>{selectedProject.name}</h3>
              <span>Project ID: {selectedProject.id}</span>
            </div>
            {pipelineHook.error && <p className="error">{pipelineHook.error}</p>}
            <div className="grid">
              {pipelineHook.pipelines.map((pipeline) => (
                <div key={pipeline.id} className="card">
                  <Tag tone={pipeline.status === "completed" ? "success" : "warning"}>{pipeline.status}</Tag>
                  <h4>Pipeline #{pipeline.id.slice(0, 8)}</h4>
                  <p>Created {new Date(pipeline.createdAt).toLocaleString()}</p>
                  <Button variant="ghost" onClick={() => pipelineHook.loadDetail(pipeline.id)}>
                    View stages
                  </Button>
                </div>
              ))}
              {!pipelineHook.pipelines.length && (
                <EmptyState
                  title="No pipelines yet"
                  description="Create a pipeline to orchestrate agents across architecture, build, and deployment."
                />
              )}
            </div>
            {pipelineHook.detail && (
              <div className="pipeline-detail">
                <h3>Stages for pipeline {pipelineHook.detail.pipeline.id.slice(0, 8)}</h3>
                <div className="grid">
                  {pipelineHook.detail.stages.map((stage) => (
                    <div key={stage.id} className="card">
                      <Tag tone={stage.status === "completed" ? "success" : "primary"}>{stage.status}</Tag>
                      <h4>{stage.name}</h4>
                      <p>Position: {stage.position}</p>
                    </div>
                  ))}
                </div>
                <SectionHeader title="Agent task contracts" subtitle="Contracts and review status for this pipeline." />
                <div className="grid">
                  {pipelineHook.detail.contracts.map((contract) => (
                    <div key={contract.id} className="card">
                      <Tag tone={contract.status === "approved" ? "success" : "warning"}>{contract.status}</Tag>
                      <h4>{contract.agent}</h4>
                      <p>{contract.objective}</p>
                      <small>Created {new Date(contract.createdAt).toLocaleString()}</small>
                    </div>
                  ))}
                  {!pipelineHook.detail.contracts.length && (
                    <EmptyState
                      title="No contracts yet"
                      description="Agent task contracts will appear here once the pipeline begins execution."
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <EmptyState
            title="Select a project"
            description="Choose a project to view pipelines and orchestrator output."
          />
        )}
      </section>
    </div>
  );
}
