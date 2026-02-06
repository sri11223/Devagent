import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: 'postgresql://devagent:devagent@localhost:5432/devagent',
});

async function checkDraftTasks() {
  try {
    const result = await pool.query("SELECT id, agent, status, objective FROM task_contracts WHERE status='draft' ORDER BY created_at DESC");
    console.log('\n📋 DRAFT TASKS (What agent executor is looking for):\n');
    
    if (result.rows.length === 0) {
      console.log('❌ NO DRAFT TASKS FOUND');
      console.log('\nLet me reset that in_progress task back to draft so Gemini can try again...\n');
      
      const reset = await pool.query("UPDATE task_contracts SET status='draft' WHERE agent='Architect Agent' AND status='in_progress' RETURNING id, agent");
      
      if (reset.rows.length > 0) {
        console.log('✅ RESET COMPLETE:');
        console.log(`   Task ${reset.rows[0].id} - ${reset.rows[0].agent} is now status='draft'`);
        console.log('\n🤖 Agent executor will pick this up in next poll (within 5 seconds)!\n');
      }
    } else {
      result.rows.forEach((row, i) => {
        console.log(`${i + 1}. ${row.agent}`);
        console.log(`   ID: ${row.id}`);
        console.log(`   Objective: ${row.objective}\n`);
      });
    }
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Database Error:', err.message);
    process.exit(1);
  }
}

checkDraftTasks();
