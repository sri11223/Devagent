# Agent Executor

**The brain of Devagent** - This service actually generates code using AI.

## What It Does

1. **Polls database** for new task contracts (every 5 seconds)
2. **Routes to AI agents** based on agent type
3. **Calls GPT-4/Claude** to generate actual code
4. **Saves files** to `generated-projects/` folder
5. **Updates database** with output and status

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy .env.example to .env
cp .env.example .env

# 3. Add your OpenAI API key
# Edit .env and set OPENAI_API_KEY=sk-your-key-here

# 4. Start the executor
npm run dev
```

## How It Works

```
┌─────────────────────────────────────────┐
│  Database: task_contracts table         │
│  Has new contract with status='draft'   │
└──────────────┬──────────────────────────┘
               │
               ▼
    ┌──────────────────────┐
    │  Agent Executor      │
    │  Picks up task       │
    └──────────────────────┘
               │
               ▼
    ┌──────────────────────┐
    │  Routes to Agent     │
    │  (Architect/Backend) │
    └──────────────────────┘
               │
               ▼
    ┌──────────────────────┐
    │  Calls GPT-4         │
    │  Generates code      │
    └──────────────────────┘
               │
               ▼
    ┌──────────────────────┐
    │  Saves to Disk       │
    │  /generated-projects/│
    └──────────────────────┘
               │
               ▼
    ┌──────────────────────┐
    │  Updates Database    │
    │  Status: 'completed' │
    └──────────────────────┘
```

## Generated Output

Files are saved to:
```
D:/Devagent/Devagent/generated-projects/
└── project-{uuid}/
    ├── architecture/
    │   ├── ARCHITECTURE.md
    │   ├── tech-stack.json
    │   └── api-spec.json
    ├── backend/
    │   ├── package.json
    │   ├── src/
    │   │   ├── server.ts
    │   │   └── routes/
    │   └── __tests__/
    ├── frontend/
    │   ├── package.json
    │   ├── app/
    │   └── components/
    ├── security/
    │   └── SECURITY_REPORT.md
    └── DEPLOYMENT.md
```

## Environment Variables

- `OPENAI_API_KEY` - Your OpenAI API key (required)
- `DATABASE_URL` - PostgreSQL connection string
- `OUTPUT_DIR` - Where to save generated code
- `BACKEND_API_URL` - API to update contract status

## Testing

```bash
# Watch the logs
npm run dev

# Create a test contract in database
psql $DATABASE_URL
INSERT INTO task_contracts (agent, objective, input, status, ...)
VALUES ('Architect Agent', 'Design e-commerce system', '{}', 'draft', ...);

# Watch agent executor pick it up and generate code!
```
