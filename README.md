# ResumeForge – Professional AI Resume Builder

ResumeForge is a full-stack application designed to help professionals craft standout resumes with ease. Featuring AI-powered suggestions, real-time preview, and multiple professional templates.

## 🚀 Features

- **Split-Screen Editor**: Real-time preview as you type your resume details.
- **AI-Powered Assistance**: Generate professional summaries, improve bullet points, and suggest relevant skills using AI.
- **Multiple Templates**: Choose from Classic, Modern, Minimal, Creative, Tech, and Executive styles.
- **Version History**: Automatic snapshot save on every update, with one-click restore.
- **PDF Export**: Pixel-perfect PDF generation preserving template layouts.
- **Cloud Sync**: Securely store and manage multiple resumes.

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS & shadcn/ui
- **State Management**: React Query (TanStack Query)
- **Animations**: Framer Motion

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database/Auth**: Supabase

### Infrastructure
- **Database**: PostgreSQL (via Supabase)
- **Auth**: Supabase Auth (Email & Google OAuth)
- **Deployment**: Vercel (Frontend), Supabase Functions (AI Logic)

## 📁 Project Structure

```text
├── frontend/             # React + Vite application
│   ├── src/
│   │   ├── components/
│   │   │   ├── resume/   # Resume specific components
│   │   │   ├── templates/# Resume template styles
│   │   │   └── ui/       # Shared UI components (shadcn)
│   │   ├── pages/        # Application pages
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Helper libraries & API client
│   │   └── utils/        # Utility functions
├── backend/              # Node.js server
│   ├── routes/           # API endpoints
│   ├── services/         # Business logic
│   └── config/           # Server configuration
└── db/                   # Database schema & migrations
    ├── schema.sql        # Database schema definition
    └── migrations/       # SQL migration history
```

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- Supabase Account

### Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:3001/api
```

### Local Development

1. **Install Dependencies**:
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

2. **Run Backend**:
   ```bash
   cd backend
   npm run dev
   ```

3. **Run Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

## 🗄 Database Schema

The core database tables include:
- `profiles`: User information and settings.
- `resumes`: Main resume data, including title, template, and content JSON.
- `resume_versions`: Historical snapshots of resume data for the versioning system.

Full schema details can be found in `db/schema.sql`.

## 📄 License

MIT
