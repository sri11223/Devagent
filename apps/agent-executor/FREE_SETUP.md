# 🆓 FREE AI SETUP GUIDE

## ⭐ Option 1: Google Gemini (RECOMMENDED - FREE FOREVER!)

### Why Gemini?
- ✅ **Completely FREE** (no credit card required)
- ✅ **60 requests/minute** rate limit (enough for development)
- ✅ **High quality** code generation
- ✅ **No expiration** on free tier

### Setup (2 minutes):

1. **Get API Key:**
   - Go to: https://aistudio.google.com/app/apikey
   - Click "Create API Key"
   - Copy the key

2. **Configure:**
   ```bash
   cd apps/agent-executor
   cp .env.example .env
   notepad .env
   ```

3. **Add to .env:**
   ```bash
   AI_PROVIDER=gemini
   GEMINI_API_KEY=your-actual-key-here-from-google
   ```

4. **Install and Run:**
   ```bash
   npm install
   npm run dev
   ```

**DONE!** Agent executor will use Gemini for FREE! 🎉

---

## 🏠 Option 2: Ollama (Run AI Locally - 100% FREE!)

### Why Ollama?
- ✅ **100% FREE** - runs on your computer
- ✅ **No API key** needed
- ✅ **No rate limits**
- ✅ **Privacy** - code never leaves your PC
- ❌ Slower than cloud APIs
- ❌ Needs 8GB+ RAM

### Setup (5 minutes):

1. **Install Ollama:**
   - Download: https://ollama.ai/download
   - Run installer
   - Open PowerShell

2. **Download Model:**
   ```bash
   ollama pull llama3.2
   # Wait 2-3 minutes (downloads 2GB model)
   ```

3. **Start Ollama:**
   ```bash
   ollama serve
   # Keep this terminal open
   ```

4. **Configure Agent Executor:**
   ```bash
   cd apps/agent-executor
   cp .env.example .env
   notepad .env
   ```

5. **Add to .env:**
   ```bash
   AI_PROVIDER=ollama
   OLLAMA_URL=http://localhost:11434
   ```

6. **Run:**
   ```bash
   npm install
   npm run dev
   ```

**DONE!** Agent executor uses local AI model! 🏠

---

## 💰 Option 3: OpenAI (Paid, High Quality)

### Why OpenAI?
- ✅ **Best quality** code generation
- ✅ **$5 free credit** for new accounts
- ❌ **Paid** after credit runs out (~$0.20/project)

### Setup:

1. **Get API Key:**
   - Go to: https://platform.openai.com/api-keys
   - Sign up
   - Create API key

2. **Add to .env:**
   ```bash
   AI_PROVIDER=openai
   OPENAI_API_KEY=sk-your-actual-key
   ```

---

## 🎯 Which Should You Use?

| Use Case | Recommendation |
|----------|----------------|
| **Just testing** | Google Gemini (free, fast setup) |
| **Privacy important** | Ollama (local, free) |
| **Best quality needed** | OpenAI (paid, best results) |
| **No internet** | Ollama (runs offline) |
| **Production** | OpenAI or Gemini Pro |

---

## 🚀 Test It Works

```bash
# Terminal 1: Backend
cd apps/backend
npm run dev

# Terminal 2: Agent Executor
cd apps/agent-executor
npm run dev
# You should see: "🤖 Using AI provider: gemini"

# Terminal 3: Create test task
# (Use the PowerShell commands from earlier)
```

Watch Agent Executor terminal - it will:
1. Pick up task
2. Call Gemini (FREE!)
3. Generate code
4. Save to /generated-projects/

---

## ❓ Do You Need BullMQ or Queue Workers?

### Short Answer: **NO, not yet!**

### Current Setup (Simple Polling):
```javascript
// Agent executor checks database every 5 seconds
setInterval(pollForTasks, 5000);
```

**This works PERFECTLY for:**
- ✅ 1-10 users
- ✅ Development/testing
- ✅ Simple setup (no Redis needed)

### When to Add BullMQ:
- ❌ 100+ concurrent users
- ❌ Processing 100+ tasks/minute
- ❌ Need retry logic
- ❌ Need job priorities

### Recommendation:
**Start with simple polling!** It works great. Add BullMQ later if you need it.

---

## 📊 Cost Comparison

| Provider | Cost | Rate Limit | Setup Time |
|----------|------|------------|------------|
| **Gemini** | $0 | 60/min | 2 min |
| **Ollama** | $0 | Unlimited | 5 min |
| **OpenAI** | $0.20/project | Varies | 3 min |

---

## ✅ Quick Start (Recommended Path)

```bash
# 1. Get Gemini key (https://aistudio.google.com/app/apikey)

# 2. Setup
cd apps/agent-executor
npm install
cp .env.example .env

# 3. Edit .env
AI_PROVIDER=gemini
GEMINI_API_KEY=your-key-here

# 4. Run
npm run dev

# 5. Create task contract and watch it generate code!
```

**Total time: 3 minutes**
**Total cost: $0.00** 🎉
