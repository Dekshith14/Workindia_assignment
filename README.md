# ResumeForge – Professional AI Resume Builder

ResumeForge is a full-stack application designed to help professionals craft standout resumes with ease. Version 2.0 features a premium design system, AI-powered suggestions, real-time preview, and multiple professional templates.

## 🚀 Features

- **AI-Powered Assistance**: Generate professional summaries, improve experience bullet points with action-verbs, and get skill suggestions based on your target role.
- **Resume Import (PDF/DOCX)**: Intelligent parser that extracts personal info, experience, and education from existing documents to jumpstart your resume.
- **Split-Screen Editor**: Real-time side-by-side preview — see your changes as you type.
- **6 Professional Templates**: Switch instantly between Classic, Modern, Minimal, Creative, Tech, and Executive styles.
- **Version History**: Automatic snapshot system. Every save creates a restorable version, allowing you to experiment without fear.
- **PDF Export**: Pixel-perfect PDF generation that preserves complex template layouts.
- **Cloud Sync**: Securely store and manage your resumes via Supabase integration.

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Bundler**: Vite
- **Styling**: Vanilla CSS + Tailwind CSS (Custom Design System)
- **UI Components**: shadcn/ui + Lucide Icons
- **Animations**: Framer Motion
- **Services**: Supabase Auth & Storage

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js (ES Modules)
- **Language**: TypeScript
- **Parsing**: `pdf-parse` (PDF) & `mammoth` (DOCX)
- **AI Logic**: Pattern-based NLP optimization for professional terminology.

## 📁 Project Structure

```text
├── frontend/             # React + Vite application
│   ├── src/
│   │   ├── components/
│   │   │   ├── resume/   # Form & Preview logic
│   │   │   └── ui/       # Shared design system components
│   │   ├── pages/        # Auth, Dashboard, and Editor
│   │   └── lib/          # API Client & Utility functions
├── backend/              # Express API Server
│   ├── routes/           # AI, Resumes, Versions, and Import
│   ├── services/         # Parsing & AI logic
│   └── index.ts          # Server entry point
└── db/                   # Database schema definitions
```

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- A Supabase Project (Database + Auth)

### 1. Environment Variables

**Frontend (`frontend/.env`):**
```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
VITE_API_URL=http://localhost:3001/api
```

**Backend (`backend/.env`):**
```env
PORT=3001
SUPABASE_URL=your_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 2. Installation & Running

```bash
# Clone the repository
git clone <repo-url>
cd resumeforge

# Install and run Backend
cd backend
npm install
npm run dev

# Install and run Frontend (New Terminal)
cd ../frontend
npm install
npm run dev
```

The application will be available at `http://localhost:5173`.

## 💡 Assumptions Made

1. **Storage**: Resumes are stored as JSON in Supabase. PDF exports are generated client-side using a browser-print based strategy for maximum fidelity.
2. **AI Processing**: The current AI implementation uses pattern-based optimization in the backend (`aiService.ts`) for speed and reliability. This can be easily swapped for an LLM API (OpenAI/Gemini).
3. **Database**: Profiles are automatically linked via Supabase Auth metadata.
4. **Ports**: The system assumes the Backend runs on `3001` and the Frontend on `5173`.

## 📄 License

MIT - Free to use and modify.
