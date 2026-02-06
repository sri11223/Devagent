// Create a full pipeline to test ALL 6 agents generating a complete app
import pg from 'pg';
import { randomUUID } from 'crypto';

const { Pool } = pg;

const pool = new Pool({
  connectionString: 'postgresql://devagent:devagent@localhost:5432/devagent',
});

// Generate a unique project ID for this test
const projectId = randomUUID();

console.log('\n🚀 Creating FULL PIPELINE TEST');
console.log(`📦 Project ID: ${projectId}`);
console.log('\n📋 Tasks to Generate:\n');

const tasks = [
  {
    agent: 'Architect Agent',
    objective: 'Design complete task management app with real-time collaboration',
    input: {
      requirements: 'Real-time task boards, team collaboration, file attachments, comments, due dates, priority levels, notifications',
      techStack: 'Node.js + Express backend, React + Next.js frontend, PostgreSQL database, Redis caching, WebSockets for real-time',
      scale: 'Support 1000+ concurrent users'
    }
  },
  {
    agent: 'Backend Agent',
    objective: 'Generate complete Express.js backend with all APIs',
    input: {
      architecture: 'Will use architect output',
      features: 'REST API, authentication, task CRUD, real-time WebSocket server, file uploads',
      database: 'PostgreSQL with proper migrations'
    }
  },
  {
    agent: 'Frontend Agent',
    objective: 'Generate React + Next.js frontend with all pages and components',
    input: {
      architecture: 'Will use architect output',
      pages: 'Login, Dashboard, Task Board, Task Details, User Profile, Settings',
      components: 'Task Card, Task List, Comment Thread, File Upload, Notifications'
    }
  },
  {
    agent: 'Security Agent',
    objective: 'Scan code for security vulnerabilities and generate security report',
    input: {
      scope: 'Backend + Frontend code',
      checks: 'SQL injection, XSS, CSRF, authentication flaws, API security'
    }
  },
  {
    agent: 'Testing Agent',
    objective: 'Generate comprehensive test suite',
    input: {
      scope: 'Backend API tests, Frontend component tests, E2E tests',
      framework: 'Jest for unit tests, Playwright for E2E'
    }
  },
  {
    agent: 'DevOps Agent',
    objective: 'Generate deployment configuration and CI/CD pipeline',
    input: {
      platform: 'Docker + Kubernetes',
      ci: 'GitHub Actions for automated testing and deployment',
      monitoring: 'Health checks, logging, error tracking'
    }
  }
];

async function createTasks() {
  try {
    console.log('📝 Creating project, pipeline and tasks...\n');
    
    // Get a user to own the project (use first user)
    const userResult = await pool.query('SELECT id FROM users LIMIT 1');
    if (userResult.rows.length === 0) {
      console.error('❌ No users found. Please create a user first (register on the web app)');
      process.exit(1);
    }
    const userId = userResult.rows[0].id;
    
    // Create a project
    const projectResult = await pool.query(
      `INSERT INTO projects (id, owner_id, name, description, status)
       VALUES ($1, $2, 'Task Management App', 'AI-generated full-stack application', 'in_progress')
       RETURNING id, name`,
      [projectId, userId]
    );
    
    console.log(`✅ Project created: ${projectResult.rows[0].name}`);
    console.log(`   ID: ${projectResult.rows[0].id}\n`);
    
    // Create a pipeline
    const pipelineResult = await pool.query(
      `INSERT INTO orchestrator_pipelines (id, project_id, status)
       VALUES ($1, $1, 'in_progress')
       RETURNING id`,
      [projectId]
    );
    
    console.log(`✅ Pipeline created`);
    console.log(`   ID: ${pipelineResult.rows[0].id}\n`);
    
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      
      const result = await pool.query(
        `INSERT INTO task_contracts (agent, objective, input, status, pipeline_id)
         VALUES ($1, $2, $3, 'draft', $4)
         RETURNING id, agent`,
        [task.agent, task.objective, JSON.stringify(task.input), projectId]
      );
      
      console.log(`✅ ${i + 1}. ${task.agent}`);
      console.log(`   ID: ${result.rows[0].id}`);
      console.log(`   Status: draft (ready for AI)\n`);
    }
    
    console.log('🎯 All tasks created successfully!\n');
    console.log('⏳ The Agent Executor will process these tasks in order:');
    console.log('   1️⃣  Architect designs the system');
    console.log('   2️⃣  Backend agent generates Express.js code');
    console.log('   3️⃣  Frontend agent generates React components');
    console.log('   4️⃣  Security agent scans for vulnerabilities');
    console.log('   5️⃣  Testing agent creates test suites');
    console.log('   6️⃣  DevOps agent creates Docker/CI/CD configs\n');
    console.log('📂 Output will be saved to:');
    console.log(`   D:\\Devagent\\Devagent\\generated-projects\\project-${projectId}\n`);
    console.log('🤖 Make sure Agent Executor is running: npm run dev\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createTasks();
