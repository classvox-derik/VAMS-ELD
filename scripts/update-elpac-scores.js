const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const SUPABASE_URL = 'https://bogllcjeaqoghabmbxhy.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvZ2xsY2plYXFvZ2hhYm1ieGh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTU0ODY3MSwiZXhwIjoyMDg3MTI0NjcxfQ.cP3lxGGkKtPu5gAVx-c9bOBu9eD4BTNb51JXs-UCsuI';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

// Load the ELPAC scores from the JSON file
const scoresPath = 'C:\\Users\\Derik Van Diest\\.gemini\\antigravity\\brain\\89895b34-0b44-47b5-adb2-f0c3c0bf4b5f\\scratch\\elpac_scores_final.json';
const elpacScores = JSON.parse(fs.readFileSync(scoresPath, 'utf-8'));

console.log(`Loaded ${Object.keys(elpacScores).length} ELPAC score entries`);

async function addColumns() {
  // Use Supabase's admin RPC or direct fetch to run SQL
  // Since we don't have a custom RPC, we'll use the management API pattern
  // Actually, try using pg REST with postgres schema
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({})
  });
  
  // Try using the SQL via supabase-js raw query
  // This only works with postgres schema and service role
  const { data, error } = await supabase
    .schema('public')
    .rpc('version'); // test if RPC works
    
  console.log('RPC test:', { data, error: error?.message });
}

async function checkColumns() {
  const { data, error } = await supabase
    .from('students')
    .select('id, ssid, elpac_score, elpac_level')
    .limit(1);
  
  if (error) {
    console.log('Columns do not exist:', error.message);
    return false;
  }
  console.log('Columns exist! Sample:', data[0]);
  return true;
}

async function updateScores() {
  // Get all students from DB
  const { data: students, error: fetchErr } = await supabase
    .from('students')
    .select('id, ssid, name, grade');
  
  if (fetchErr) {
    console.error('Failed to fetch students:', fetchErr.message);
    return;
  }
  
  console.log(`\nFound ${students.length} students in DB`);
  
  // Build SSID -> DB student mapping
  const ssidToDb = {};
  for (const s of students) {
    ssidToDb[s.ssid] = s;
  }
  
  let updated = 0;
  let notFound = 0;
  let errors = 0;
  
  for (const [ssid, scoreData] of Object.entries(elpacScores)) {
    if (!ssidToDb[ssid]) {
      console.log(`  NOT IN DB: ${scoreData.name} (SSID: ${ssid})`);
      notFound++;
      continue;
    }
    
    const dbStudent = ssidToDb[ssid];
    
    const { error: updateErr } = await supabase
      .from('students')
      .update({
        elpac_score: scoreData.elpac_score,
        elpac_level: scoreData.elpac_level
      })
      .eq('id', dbStudent.id);
    
    if (updateErr) {
      console.log(`  ERROR updating ${scoreData.name}: ${updateErr.message}`);
      errors++;
    } else {
      console.log(`  Updated: ${scoreData.name} -> Score=${scoreData.elpac_score}, Level=${scoreData.elpac_level}`);
      updated++;
    }
  }
  
  console.log(`\n=== SUMMARY ===`);
  console.log(`Updated: ${updated}`);
  console.log(`Not in DB: ${notFound}`);
  console.log(`Errors: ${errors}`);
}

async function main() {
  // Check if columns already exist
  const columnsExist = await checkColumns();
  
  if (!columnsExist) {
    console.log('\nColumns do not exist. Please add them via Supabase SQL editor:');
    console.log('ALTER TABLE students ADD COLUMN IF NOT EXISTS elpac_score INTEGER, ADD COLUMN IF NOT EXISTS elpac_level INTEGER;');
    console.log('\nTrying anyway with update (will fail if columns not added)...');
  }
  
  await updateScores();
}

main().catch(console.error);
