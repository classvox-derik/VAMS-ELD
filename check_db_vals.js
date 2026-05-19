const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = 'https://bogllcjeaqoghabmbxhy.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvZ2xsY2plYXFvZ2hhYm1ieGh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTU0ODY3MSwiZXhwIjoyMDg3MTI0NjcxfQ.cP3lxGGkKtPu5gAVx-c9bOBu9eD4BTNb51JXs-UCsuI';
const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function check() {
  const { data, error } = await supabase.from('students').select('oral_language_level, written_language_level').limit(5);
  console.log(data);
}
check();
