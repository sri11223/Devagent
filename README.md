# Multi-Agent Autonomous Software Engineering System

This repository contains a production-grade, multi-agent system that turns product ideas into fully deployed, scalable applications. The system is designed around specialized agents coordinated by an orchestrator that enforces a structured pipeline from idea intake through deployment.

## Goals
- **Production-grade output**: clean architecture, strong typing, input validation, centralized error handling, and security by default.
- **End-to-end delivery**: architecture, implementation, tests, deployment, and documentation are all first-class outputs.
- **Agent collaboration**: agents exchange structured task contracts (JSON) and review each other’s work.

## Repository Layout
```
/apps
  /backend             # Express + TypeScript API
  /web                 # Next.js + TypeScript UI
/docs                  # Architecture, ADRs, and design documentation
/infra                 # Docker compose and infrastructure scripts
```
## Backend (Express + PostgreSQL)
### Features
- JWT authentication and rate-limited API endpoints
- Modular service/repository layers with validation
- PostgreSQL schema included in `apps/backend/sql/schema.sql`

### Quickstart
1. Install dependencies:
   ```bash
   cd apps/backend
   npm install
   ```
2. Configure environment variables:
   ```bash
   export DATABASE_URL=postgres://devagent:devagent@localhost:5432/devagent
   export JWT_SECRET=change-me-please-change-me
   export JWT_EXPIRES_IN=1h
   export CORS_ORIGIN=http://localhost:3000
   export PORT=4000
   ```
3. Run schema SQL against your database.
4. Start the API:
   ```bash
   npm run dev
   ```

## Frontend (Next.js)
### Features
- Auth flows (register/login) with token storage
- Dashboard for creating and listing project requests
- Modular UI components and feature APIs

### Quickstart
1. Install dependencies:
   ```bash
   cd apps/web
   npm install
   ```
2. Set the API base URL:
   ```bash
   export NEXT_PUBLIC_API_URL=http://localhost:4000/api
   ```
3. Run the UI:
   ```bash
   npm run dev
   ```
## Docker (Optional)
Use Docker Compose for a local Postgres and API environment:
```bash
cd infra
docker compose up --build
```
## Next Steps
- Define the orchestrator workflow and agent task contract schema.
- Implement orchestrator service and agent workers.
- Add CI pipelines with tests and security checks.
