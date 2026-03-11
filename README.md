ResumeForge – AI-Powered Resume Builder








ResumeForge is a full-stack AI-powered resume builder designed to help professionals quickly create polished, ATS-friendly resumes using modern templates, intelligent suggestions, and real-time editing.

The application provides a structured editing experience, cloud persistence, version history tracking, and resume import capabilities.

🚀 Features
Resume Creation

Create and edit resumes through a structured editor.

Real-time split-screen preview while editing.

Cloud persistence with Supabase.

Professional Templates

Switch instantly between 6 professionally designed templates:

Classic

Modern

Minimal

Creative

Tech

Executive

Each template uses the same structured data model but renders different layouts.

AI Assistance

AI tools help improve resume quality by:

Generating professional summaries

Improving experience bullet points

Suggesting relevant skills

The backend processes resume content using pattern-based NLP logic optimized for professional language.

Resume Import

Users can upload an existing resume to automatically populate the editor.

Supported formats:

PDF

DOCX

The backend extracts text and maps it into editable resume sections.

Version History

Every save creates a resume snapshot stored in the database.

Users can:

view previous versions

restore earlier versions

experiment without losing work

PDF Export

Resumes can be exported as pixel-perfect PDFs while preserving template layout and typography.

Authentication

Secure login powered by Supabase.

Supported methods:

Email authentication

Google OAuth login

📸 Screenshots

(Add screenshots to docs/screenshots folder and update paths)

Dashboard

Resume Editor

Template Selection

AI Assistance

🧩 System Architecture

The application follows a three-layer architecture.

User Browser
     ↓
React Frontend (Vite)
     ↓
Express Backend API
     ↓
Supabase (PostgreSQL + Auth)
Frontend Responsibilities

Resume editor interface

Template rendering

AI interaction UI

Resume preview

PDF export

File uploads

Backend Responsibilities

Resume CRUD operations

Version history management

Resume import parsing

AI text processing

Secure communication with Supabase

Database Responsibilities

Authentication

Resume storage

Version snapshot storage

🛠 Tech Stack
Frontend

React 18

TypeScript

Vite

Tailwind CSS

shadcn/ui

Framer Motion

Lucide Icons

Supabase Auth Client

Backend

Node.js

Express.js

TypeScript

Multer (file uploads)

pdf-parse (PDF parsing)

Mammoth (DOCX parsing)

Database

Supabase

PostgreSQL

Row Level Security (RLS)

Supabase Authentication

📁 Project Structure
ResumeForge
│
├── frontend/             # React + Vite application
│   ├── src/
│   │   ├── components/
│   │   │   ├── resume/
│   │   │   └── ui/
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   └── editor/
│   │   ├── hooks/
│   │   └── lib/
│
├── backend/              # Express API server
│   ├── routes/
│   │   ├── resumes
│   │   ├── versions
│   │   ├── ai
│   │   └── import
│   ├── services/
│   │   ├── resumeService
│   │   ├── aiService
│   │   └── importService
│   └── index.ts
│
└── db/
    └── schema.sql
🗄 Database Schema

The database structure follows this relationship:

auth.users
     ↓
profiles
     ↓
resumes
     ↓
resume_versions
profiles

Stores metadata for authenticated users.

resumes

Stores the current editable resume.

resume_versions

Stores historical snapshots for version restoration.

🔌 API Endpoints
Resume Management
POST   /api/resumes
GET    /api/resumes
PUT    /api/resumes/:id
DELETE /api/resumes/:id
Version History
GET  /api/versions/:resumeId
POST /api/versions
POST /api/versions/restore
AI Assistance
POST /api/ai/summary
POST /api/ai/improve
POST /api/ai/skills
Resume Import
POST /api/import-resume

Accepts:

PDF

DOCX

⚙️ Setup Instructions
Prerequisites

Node.js v18+

Supabase project

Environment Variables
Frontend (frontend/.env)
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=http://localhost:3001/api
Backend (backend/.env)
PORT=3001
SUPABASE_URL=your_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
Installation

Clone the repository:

git clone <repo-url>
cd resumeforge

Start backend:

cd backend
npm install
npm run dev

Start frontend:

cd ../frontend
npm install
npm run dev

Application runs at:

http://localhost:5173
💡 Assumptions

Resumes are stored as structured JSON to allow template switching without data loss.

AI suggestions use rule-based processing but can be extended to LLM APIs.

Version history stores snapshots instead of diffs for simplicity.

PDF export is handled client-side to preserve template styling.

🚀 Future Improvements

Potential enhancements:

LinkedIn profile import

AI job description matching

ATS compatibility scoring

Collaborative resume editing

Resume analytics and feedback

📄 License

MIT License
Free to use and modify.

👍 What This README Achieves

Your repo now clearly demonstrates:

system architecture

database design

API design

AI integration

product thinking

Which are exactly the things reviewers evaluate in technical assignments.
