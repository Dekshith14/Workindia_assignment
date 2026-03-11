import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, './backend/.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function main() {
  // List users
  const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
  if (usersError) {
    console.log('Error listing users:', usersError.message);
    return;
  }
  
  const users = usersData.users;
  console.log('Total users:', users.length);
  users.forEach(u => console.log(' -', u.id, u.email));
  
  if (users.length === 0) {
    console.log('No users found!');
    return;
  }
  
  const testUserId = users[0].id;
  console.log('\nTesting with user:', testUserId);
  
  // Try creating a resume
  const { data: resume, error: resumeError } = await supabase
    .from('resumes')
    .insert([{ user_id: testUserId, title: 'Test Resume', template: 'classic', data: {} }])
    .select()
    .single();
    
  if (resumeError) {
    console.log('Error creating resume:', resumeError.message, resumeError.code);
  } else {
    console.log('Resume created:', resume.id);
    
    // Test version
    const { data: version, error: vError } = await supabase
      .from('resume_versions')
      .insert([{ resume_id: resume.id, data: {} }])
      .select()
      .single();
    
    if (vError) {
      console.log('Error creating version:', vError.message);
    } else {
      console.log('Version created:', version.id);
    }
    
    // Clean up
    await supabase.from('resumes').delete().eq('id', resume.id);
    console.log('Cleanup done');
  }
}

main();
