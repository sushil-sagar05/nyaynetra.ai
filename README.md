
⚖ Nyaynetra – AI-Powered Legal Document Analyzer

Nyaynetra is a full-stack LegalTech platform that helps users instantly analyze legal documents using AI-powered NLP workflows.

From contract summarization to clause tagging and risk detection — Nyaynetra combines deep AI pipelines with a production-grade backend and clean frontend UI.

> ⚡ Current Status: Live & deployed
💬 Next Feature: Q/A system using LangChain + RAG




---

🚀 Features

📄 Summarize Legal Documents

🔖 Tag Key Clauses like Indemnity, Termination, Confidentiality

🚨 Detect Risky Language using domain-specific embeddings

🧠 Legal Q/A Assistant (Coming Soon)



---

🧠 AI/NLP Pipeline

Originally built in Flask with all models running locally, later migrated to Hugging Face Spaces for lighter, scalable deployment.

The AI logic performs:

Text Preprocessing + NLP cleanup

Chunking: Splits long docs into model-sized sections

Summarization: Using legal-summarizer (T5 fine-tuned)

Clause Tagging: Rule + embedding-based classification

Risk Detection: Semantic similarity using InLegalBERT + SentenceTransformers

Embeddings: Generated via HF Transformers, used across multiple tasks


Flask services now act as thin, async bridges to FastAPI endpoints hosted on HF Spaces — greatly reducing backend load.


---

⚙ System Architecture

Next.js (Frontend)
   │
   ▼
Express.js (Main Backend - TypeScript)
   │
   ├── Handles auth, user mgmt, document history, rate-limiting
   ├── Coordinates with Flask layer via secure endpoints
   │
   ▼
Flask Microservices (Lightweight)
   │
   ▼
Hugging Face Spaces (FastAPI AI endpoints)


---

🧱 Tech Stack

Frontend

Next.js

Tailwind CSS (UI styling)
shadcn ui components

Axios + Context API (state + network)


Backend

TypeScript + Express.js

MongoDB (user & document data)

Rate Limiting, API Gateway, Cron Jobs

Authentication (guest + user roles)


AI Layer

Flask (Python) – NLP coordination

Hugging Face Spaces (FastAPI-hosted AI models)

legal-summarizer, InLegalBERT, sentence-transformers



---

🧪 Example Use Case

1. Upload a legal contract (PDF/Text)


2. System preprocesses and chunks content


3. Generates:

Summary

Tagged clauses (like Termination, NDA)

Risk assessment of sections



4. Stores results tied to user profile




---

🛠 Local Setup (Optional – for dev/testing)

> Note: Requires access to internal Flask + HF API URLs (not public)



# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
npm install
npm run dev

# Flask (if running locally for dev)
cd ml_services
pip install -r requirements.txt
python app.py


---

🗺 Roadmap

[x] AI Summarization (T5)

[x] Clause Tagging (manual + vector-based)

[x] Risk Detection

[x] Transition to Hugging Face Spaces

[x] Rate-limited Backend Gateway

[x] Guest + Auth flows

[ ] 💬 Q/A Assistant using LangChain + RAG

---

🤝 Contribution

This is a personal project but open for contributions, feedback, or collaboration in Legal AI.

If you're interested in improving:

AI pipelines

LangChain integration

UI experience

Deployment & DevOps

Feel free to open issues or connect.
