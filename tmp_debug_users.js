import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, './backend/.env') });

console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('KEY prefix:', process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 30));

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function main() {
  // List users to see what's there
  const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
  if (usersError) {
    console.log('Error listing users:', usersError.message);
    return;
  }
  
  const users = usersData.users;
  console.log('\nTotal users in auth:', users.length);
  users.forEach(u => console.log(' - User:', u.id, '| Email:', u.email, '| Created:', u.created_at));

  // Also check profiles
  const { data: profiles, error: pError } = await supabase.from('profiles').select('*');
  if (pError) {
    console.log('Profiles error:', pError.message);
  } else {
    console.log('\nTotal profiles:', profiles.length);
    profiles.forEach(p => console.log(' - Profile:', p.user_id, '|', p.email));
  }
}

main();
