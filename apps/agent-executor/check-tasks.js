import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: 'postgresql://devagent:devagent@localhost:5432/devagent',
});

async function checkTasks() {
  try {
    const result = await pool.query('SELECT id, agent, status, created_at FROM task_contracts ORDER BY created_at DESC LIMIT 5');
    console.log('\n📋 TASK CONTRACTS IN DATABASE:\n');
    
    if (result.rows.length === 0) {
      console.log('❌ NO TASKS FOUND - Database is empty!');
    } else {
      result.rows.forEach((row, i) => {
        console.log(`${i + 1}. ${row.agent} - ${row.status}`);
        console.log(`   ID: ${row.id}`);
        console.log(`   Created: ${row.created_at}\n`);
      });
    }
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Database Error:', err.message);
    process.exit(1);
  }
}

checkTasks();
