import Link from "next/link";
import { Button } from "../shared/components/Button";
import { Card } from "../shared/components/Card";
import { SectionHeader } from "../shared/components/SectionHeader";

const highlights = [
  {
    title: "Architecture-first planning",
    description: "Generate system designs, API contracts, and data models before a single line of code ships."
  },
  {
    title: "Specialized agent fleet",
    description: "Coordinate backend, frontend, security, testing, and DevOps agents with explicit contracts."
  },
  {
    title: "Production-grade delivery",
    description: "Gate every pipeline with validation, reviews, tests, and deployment checks."
  }
];

const metrics = [
  { label: "Median cycle time", value: "4.2 hrs" },
  { label: "Validation gates", value: "12+" },
  { label: "Pipeline success rate", value: "98%" }
];

export default function HomePage() {
  return (
    <div>
      <section className="hero">
        <div>
          <p className="eyebrow">Autonomous delivery platform</p>
          <h1>Ship production-ready software from a single product idea.</h1>
          <p className="subtitle">
            Devagent orchestrates a fleet of specialized agents that design, build, test, secure, and deploy
            full-stack applications with real-world rigor.
          </p>
          <div className="hero-actions">
            <Link href="/auth/register">
              <Button>Start a workspace</Button>
            </Link>
            <Link href="/marketing">
              <Button variant="secondary">Explore the platform</Button>
            </Link>
          </div>
        </div>
        <div className="hero-card">
          <h3>Pipeline snapshot</h3>
          <ul>
            <li>
              <strong>Architect</strong>
              <span>System map, API contracts</span>
            </li>
            <li>
              <strong>Backend</strong>
              <span>Services, validation, data layer</span>
            </li>
            <li>
              <strong>Frontend</strong>
              <span>UX flows, components, state</span>
            </li>
            <li>
              <strong>Security</strong>
              <span>Threat model, hardening, auth</span>
            </li>
            <li>
              <strong>Testing</strong>
              <span>Unit, integration, E2E suites</span>
            </li>
            <li>
              <strong>DevOps</strong>
              <span>CI/CD, deployment scripts</span>
            </li>
          </ul>
        </div>
      </section>

      <SectionHeader title="What you get" subtitle="Every delivery includes the artifacts needed for production." />
      <div className="grid">
        {highlights.map((feature) => (
          <Card key={feature.title} title={feature.title}>
            <p>{feature.description}</p>
          </Card>
        ))}
      </div>

      <section className="metrics">
        {metrics.map((metric) => (
          <div key={metric.label} className="metric">
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </div>
        ))}
      </section>

      <section className="cta">
        <div>
          <h2>Ready to scale your delivery engine?</h2>
          <p className="subtitle">Create a workspace and let the orchestrator guide every step.</p>
        </div>
        <Link href="/auth/register">
          <Button>Launch Devagent</Button>
        </Link>
      </section>
    </div>
  );
}
