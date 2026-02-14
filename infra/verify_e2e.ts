import axios from 'axios';

const API_URL = 'http://localhost:4000/api';
// Use a new email every time to avoid unique constraint errors
const EMAIL = `test-${Date.now()}@example.com`;
const PASSWORD = 'password123';

async function runTest() {
    console.log('🚀 Starting E2E Verification...');

    try {
        // 1. Register
        console.log('1️⃣ Registering user...');
        await axios.post(`${API_URL}/auth/register`, {
            email: EMAIL,
            password: PASSWORD,
            name: 'Test User'
        });
        console.log('✅ Registered');

        // 2. Login
        console.log('2️⃣ Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: EMAIL,
            password: PASSWORD
        });
        const token = loginRes.data.token;
        console.log('✅ Logged in. Token received.');

        const headers = { Authorization: `Bearer ${token}` };

        // 3. Create Project
        console.log('3️⃣ Creating Project...');
        const projectRes = await axios.post(`${API_URL}/projects`, {
            name: 'E2E Test Project',
            description: 'Testing the new architecture'
        }, { headers });
        const projectId = projectRes.data.project.id;
        console.log(`✅ Project created: ${projectId}`);

        // 4. Create Pipeline
        console.log('4️⃣ Creating Pipeline...');
        const pipelineRes = await axios.post(`${API_URL}/orchestrator/pipelines`, {
            projectId
        }, { headers });
        const pipelineId = pipelineRes.data.pipeline.id;
        console.log(`✅ Pipeline created: ${pipelineId}`);

        // 5. Create Task
        console.log('5️⃣ Creating Task Contract (Push to Queue)...');
        const contractRes = await axios.post(`${API_URL}/orchestrator/pipelines/${pipelineId}/contracts`, {
            agent: 'Architect Agent', // Must match agent name in executor
            objective: 'Design a simple Hello World app',
            input: { requirements: 'Just a hello world' }
        }, { headers });
        const contractId = contractRes.data.contract.id;
        console.log(`✅ Task created: ${contractId}`);

        console.log('\n🎉 E2E Test Passed! Task pushed to queue.');
        console.log(`🆔 Contract ID to check in logs: ${contractId}`);
        console.log(`📧 User Email: ${EMAIL}`);

    } catch (error: any) {
        console.log('❌ Test Failed:', error.response?.data || error.message);
        process.exit(1);
    }
}

runTest();
