# System Architecture

## Overview
The system is a multi-agent pipeline that converts a product idea into a production-ready application. A central orchestrator manages the workflow, ensures consistent artifacts, and enforces quality gates.

## Core Components

### 1) Orchestrator
- Accepts a product request.
- Generates a pipeline plan with ordered stages.
- Assigns tasks to specialized agents.
- Validates outputs against the expected artifacts.
- Coordinates reviews and iteration loops.
- Stores pipeline runs, stages, and task contracts for auditability.

### 2) Specialized Agents
- **Architect Agent**: System design, API spec, data modeling.
- **Backend Agent**: API implementation, validation, business logic.
- **Frontend Agent**: React/Next.js UI, UX, state management.
- **Security Agent**: Threat modeling, auth, hardening.
- **Testing Agent**: Unit, integration, E2E tests.
- **DevOps Agent**: Docker, config, deployment pipeline.

### 3) Shared Contracts
Agents exchange JSON task contracts and review artifacts. Contracts define:
- Objective and success criteria
- Inputs and outputs
- Expected files and validation steps
- Review outcomes and approval status

## Quality Gates
- API and schema validation
- Security checks (auth, secrets, sanitization)
- Test coverage checks
- Build and deploy verification

## Orchestrator Execution
1. Pipeline created per project.
2. Default stages seeded (Architecture, Backend, Frontend, Security, Testing, Deployment).
3. Task contracts created per stage and tracked through review.
4. Stage status updates roll up into pipeline status.

## Data Flow
1. Idea intake
2. Architecture + task contracts
3. Implementation by agents
4. Security hardening
5. Testing and validation
6. Deployment readiness
7. Documentation and handoff
