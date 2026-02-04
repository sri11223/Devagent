import Link from "next/link";
import { Button } from "../../shared/components/Button";
import { Card } from "../../shared/components/Card";
import { SectionHeader } from "../../shared/components/SectionHeader";
import { Tag } from "../../shared/components/Tag";

const pipelineStages = [
  {
    title: "Architecture",
    description: "System design, APIs, and data modeling with clear decisions and ADRs."
  },
  {
    title: "Implementation",
    description: "Backend and frontend agents deliver scalable services and UX-ready interfaces."
  },
  {
    title: "Hardening",
    description: "Security and testing agents lock down vulnerabilities and ensure regressions are caught."
  },
  {
    title: "Deployment",
    description: "DevOps agent ships containers, environment configs, and deployment scripts."
  }
];

const extras = [
  {
    title: "Agent review loops",
    description: "Built-in review checklists and cross-agent validation to keep quality high."
  },
  {
    title: "Observability",
    description: "Structured logs, audit trails, and pipeline analytics out of the box."
  },
  {
    title: "Security posture",
    description: "Threat modeling, secrets scanning, and vulnerability remediation baked in."
  }
];

export default function MarketingPage() {
  return (
    <div className="marketing">
      <section className="hero hero-marketing">
        <div>
          <Tag tone="success">New</Tag>
          <h1>Autonomous delivery, designed for modern product teams.</h1>
          <p className="subtitle">
            Align your teams around a consistent, auditable pipeline that turns product requests into
            production-grade releases.
          </p>
          <div className="hero-actions">
            <Link href="/auth/register">
              <Button>Start a pilot</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="secondary">View dashboard</Button>
            </Link>
          </div>
        </div>
        <div className="marketing-panel">
          <h3>What makes Devagent different</h3>
          <ul>
            <li>Structured task contracts between agents</li>
            <li>Quality gates enforced at every stage</li>
            <li>Reusable patterns and shared knowledge</li>
            <li>Security and compliance baked into delivery</li>
          </ul>
        </div>
      </section>

      <SectionHeader
        title="Pipeline architecture"
        subtitle="Each delivery moves through a deterministic sequence of stages."
      />
      <div className="grid">
        {pipelineStages.map((stage) => (
          <Card key={stage.title} title={stage.title} eyebrow="Stage">
            <p>{stage.description}</p>
          </Card>
        ))}
      </div>

      <SectionHeader title="Extraordinary by design" subtitle="Premium features that push quality even further." />
      <div className="grid">
        {extras.map((item) => (
          <Card key={item.title} title={item.title}>
            <p>{item.description}</p>
          </Card>
        ))}
      </div>

      <section className="cta">
        <div>
          <h2>Build faster with confidence.</h2>
          <p className="subtitle">Spin up your workspace and see your next release ship itself.</p>
        </div>
        <Link href="/auth/register">
          <Button>Launch Devagent</Button>
        </Link>
      </section>
    </div>
  );
}
