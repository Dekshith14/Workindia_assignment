import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, './backend/.env') });

// Get PAT from command line argument
const PAT = process.argv[2];
if (!PAT) {
  console.error('Usage: npx tsx tmp_apply_schema.js <your-supabase-pat>');
  console.error('\nTo get your PAT:');
  console.error('1. Go to https://supabase.com/dashboard/account/tokens');
  console.error('2. Create a new access token');
  console.error('3. Run: npx tsx tmp_apply_schema.js YOUR_TOKEN_HERE');
  process.exit(1);
}

const SUPABASE_URL = process.env.SUPABASE_URL;
const projectRef = SUPABASE_URL.replace('https://', '').replace('.supabase.co', '');

const schemaSQL = fs.readFileSync(path.resolve(__dirname, './db/schema.sql'), 'utf8');

async function runSQL(sql) {
  const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${PAT}`,
    },
    body: JSON.stringify({ query: sql }),
  });
  
  const data = await response.json();
  return { status: response.status, data };
}

async function main() {
  console.log(`Applying schema to project: ${projectRef}`);
  
  const result = await runSQL(schemaSQL);
  console.log('Status:', result.status);
  
  if (result.status === 200) {
    console.log('✅ Schema applied successfully!');
  } else {
    console.log('Response:', JSON.stringify(result.data, null, 2));
    
    // If schema already partially exists, try idempotent approach
    if (result.data?.message?.includes('already exists') || result.status === 400) {
      console.log('\n⚠️  Some objects already exist. Trying to add missing tables...');
      
      const missingTableSQL = `
        -- Only create if not exists (safe to run multiple times)
        DO $$ BEGIN
          IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
            CREATE TABLE public.profiles (
              id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
              user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
              display_name TEXT,
              email TEXT,
              created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
              updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
            );
          END IF;
          
          IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'resumes') THEN
            CREATE TABLE public.resumes (
              id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
              user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
              title TEXT NOT NULL DEFAULT 'Untitled Resume',
              template TEXT NOT NULL DEFAULT 'classic',
              data JSONB NOT NULL DEFAULT '{}'::jsonb,
              is_paid_template_unlocked BOOLEAN NOT NULL DEFAULT false,
              created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
              updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
            );
          END IF;
          
          IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'resume_versions') THEN
            CREATE TABLE public.resume_versions (
              id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
              resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
              data JSONB NOT NULL DEFAULT '{}'::jsonb,
              created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
            );
          END IF;
        END $$;
        
        -- Enable RLS (safe to run multiple times)
        ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
        ALTER TABLE IF EXISTS public.resumes ENABLE ROW LEVEL SECURITY;
        ALTER TABLE IF EXISTS public.resume_versions ENABLE ROW LEVEL SECURITY;
      `;
      
      const r2 = await runSQL(missingTableSQL);
      console.log('Status:', r2.status);
      console.log('Result:', JSON.stringify(r2.data, null, 2));
    }
  }
}

main().catch(console.error);
