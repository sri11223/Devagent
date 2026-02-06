"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const { user, status } = useAuth();
  const toast = useToastContext();
  const { projects, loading, error, load, create } = useProjects();
  const [form, setForm] = useState({ name: "", description: "", status: "planned" as Project["status"] });
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [contractForm, setContractForm] = useState({ agent: "", objective: "", input: "{}" });
  const [reviewForm, setReviewForm] = useState({ contractId: "", reviewer: "", notes: "", status: "requested" as const });

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) ?? null,
    [projects, selectedProjectId]
  );

  const pipelineHook = usePipelines(selectedProject?.id);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

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

  async function handleCreateContract(pipelineId: string) {
    try {
      const parsedInput = contractForm.input ? JSON.parse(contractForm.input) : {};
      await pipelineHook.addContract(pipelineId, {
        agent: contractForm.agent,
        objective: contractForm.objective,
        input: parsedInput
      });
      setContractForm({ agent: "", objective: "", input: "{}" });
      toast.push({ title: "Contract created", description: "Agent contract saved.", tone: "success" });
    } catch (err) {
      toast.push({ title: "Contract failed", description: (err as Error).message, tone: "error" });
    }
  }

  async function handleReview(pipelineId: string) {
    if (!reviewForm.contractId) {
      toast.push({ title: "Select a contract", description: "Choose a contract to review." });
      return;
    }
    try {
      await pipelineHook.addReview(reviewForm.contractId, {
        reviewer: reviewForm.reviewer,
        notes: reviewForm.notes,
        status: reviewForm.status
      }, pipelineId);
      setReviewForm({ contractId: "", reviewer: "", notes: "", status: "requested" });
      toast.push({ title: "Review submitted", description: "Review added to the contract.", tone: "success" });
    } catch (err) {
      toast.push({ title: "Review failed", description: (err as Error).message, tone: "error" });
    }
  }

  if (status === "unauthenticated" || status === "idle" || status === "loading") {
    return (
      <div style={{ padding: "80px 20px", textAlign: "center" }}>
        <p style={{ color: "var(--muted)" }}>
          {status === "loading" || status === "idle" ? "Loading..." : "Redirecting to login..."}
        </p>
      </div>
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
                      <div className="button-row">
                        <Button
                          variant="ghost"
                          onClick={() => pipelineHook.setStageStatus(pipelineHook.detail!.pipeline.id, stage.id, "in_progress")}
                        >
                          Start
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => pipelineHook.setStageStatus(pipelineHook.detail!.pipeline.id, stage.id, "completed")}
                        >
                          Complete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <SectionHeader title="Create task contract" subtitle="Capture objectives and inputs for the next agent." />
                <form
                  className="form form-wide"
                  onSubmit={(event) => {
                    event.preventDefault();
                    handleCreateContract(pipelineHook.detail!.pipeline.id);
                  }}
                >
                  <TextInput
                    id="contract-agent"
                    label="Agent"
                    value={contractForm.agent}
                    onChange={(event) => setContractForm((prev) => ({ ...prev, agent: event.target.value }))}
                    required
                  />
                  <TextInput
                    id="contract-objective"
                    label="Objective"
                    value={contractForm.objective}
                    onChange={(event) => setContractForm((prev) => ({ ...prev, objective: event.target.value }))}
                    required
                  />
                  <div className="input">
                    <label htmlFor="contract-input">Input (JSON)</label>
                    <textarea
                      id="contract-input"
                      value={contractForm.input}
                      onChange={(event) => setContractForm((prev) => ({ ...prev, input: event.target.value }))}
                      rows={4}
                    />
                  </div>
                  <Button type="submit">Create contract</Button>
                </form>
                <SectionHeader title="Agent task contracts" subtitle="Contracts and review status for this pipeline." />
                <div className="grid">
                  {pipelineHook.detail.contracts.map((contract) => (
                    <div key={contract.id} className="card">
                      <Tag tone={contract.status === "approved" ? "success" : "warning"}>{contract.status}</Tag>
                      <h4>{contract.agent}</h4>
                      <p>{contract.objective}</p>
                      <small>Created {new Date(contract.createdAt).toLocaleString()}</small>
                      <div className="button-row">
                        <Button
                          variant="ghost"
                          onClick={() => pipelineHook.updateContract(contract.id, "review", pipelineHook.detail!.pipeline.id)}
                        >
                          Request review
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => pipelineHook.updateContract(contract.id, "approved", pipelineHook.detail!.pipeline.id)}
                        >
                          Approve
                        </Button>
                      </div>
                    </div>
                  ))}
                  {!pipelineHook.detail.contracts.length && (
                    <EmptyState
                      title="No contracts yet"
                      description="Agent task contracts will appear here once the pipeline begins execution."
                    />
                  )}
                </div>
                <SectionHeader title="Submit review" subtitle="Capture reviewer feedback on a contract." />
                <form
                  className="form form-wide"
                  onSubmit={(event) => {
                    event.preventDefault();
                    handleReview(pipelineHook.detail!.pipeline.id);
                  }}
                >
                  <div className="input">
                    <label htmlFor="review-contract">Contract</label>
                    <select
                      id="review-contract"
                      value={reviewForm.contractId}
                      onChange={(event) => setReviewForm((prev) => ({ ...prev, contractId: event.target.value }))}
                    >
                      <option value="">Select a contract</option>
                      {pipelineHook.detail.contracts.map((contract) => (
                        <option key={contract.id} value={contract.id}>
                          {contract.agent} · {contract.objective.slice(0, 24)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <TextInput
                    id="reviewer-name"
                    label="Reviewer"
                    value={reviewForm.reviewer}
                    onChange={(event) => setReviewForm((prev) => ({ ...prev, reviewer: event.target.value }))}
                    required
                  />
                  <div className="input">
                    <label htmlFor="review-notes">Notes</label>
                    <textarea
                      id="review-notes"
                      value={reviewForm.notes}
                      onChange={(event) => setReviewForm((prev) => ({ ...prev, notes: event.target.value }))}
                      rows={3}
                      required
                    />
                  </div>
                  <div className="input">
                    <label htmlFor="review-status">Status</label>
                    <select
                      id="review-status"
                      value={reviewForm.status}
                      onChange={(event) =>
                        setReviewForm((prev) => ({ ...prev, status: event.target.value as typeof reviewForm.status }))
                      }
                    >
                      <option value="requested">Requested</option>
                      <option value="approved">Approved</option>
                      <option value="changes_requested">Changes requested</option>
                    </select>
                  </div>
                  <Button type="submit">Submit review</Button>
                </form>
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
