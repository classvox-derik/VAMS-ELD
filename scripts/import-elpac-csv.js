const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://bogllcjeaqoghabmbxhy.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvZ2xsY2plYXFvZ2hhYm1ieGh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTU0ODY3MSwiZXhwIjoyMDg3MTI0NjcxfQ.cP3lxGGkKtPu5gAVx-c9bOBu9eD4BTNb51JXs-UCsuI';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

// ── Parse CSV line respecting quoted fields ──
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (const ch of line) {
        if (ch === '"') {
            inQuotes = !inQuotes;
        } else if (ch === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += ch;
        }
    }
    result.push(current.trim());
    return result;
}

// ── Parse the full CSV into objects ──
function parseCSV(csvPath) {
    const raw = fs.readFileSync(csvPath, 'utf-8').replace(/\r/g, '');
    const lines = raw.split('\n').filter(l => l.trim().length > 0);
    if (lines.length < 2) {
        console.error('CSV is empty or missing header');
        process.exit(1);
    }
    const headers = parseCSVLine(lines[0]);
    const students = [];
    for (let i = 1; i < lines.length; i++) {
        const vals = parseCSVLine(lines[i]);
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = vals[j] || '';
        }
        students.push(obj);
    }
    return students;
}

// ── Run raw SQL via Supabase pg-meta API ──
async function runSQL(sql) {
    const url = `${SUPABASE_URL}/pg-meta/v1/query`;
    const resp = await fetch(url, {
        method: 'POST',
        headers: {
            'apikey': SERVICE_KEY,
            'Authorization': `Bearer ${SERVICE_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: sql }),
    });
    if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`pg-meta query failed (${resp.status}): ${text}`);
    }
    return resp.json();
}

// ── Determine prior year data matching 1-grade-below and 2-grades-below ──
function extractPriorData(row) {
    const currentGrade = parseInt(row['Grade'], 10);

    // Parse prior year entries from CSV
    const priorEntries = [];

    const yr1GradeRaw = (row['Prior Yr 1 Grade'] || '').replace('Grade ', '');
    const yr2GradeRaw = (row['Prior Yr 2 Grade'] || '').replace('Grade ', '');

    if (yr1GradeRaw) {
        priorEntries.push({
            grade: parseInt(yr1GradeRaw, 10),
            score: parseInt(row['Prior Yr 1 Score'], 10) || null,
            level: row['Prior Yr 1 Level'] ? parseInt(row['Prior Yr 1 Level'].replace('Level ', ''), 10) : null,
        });
    }
    if (yr2GradeRaw) {
        priorEntries.push({
            grade: parseInt(yr2GradeRaw, 10),
            score: parseInt(row['Prior Yr 2 Score'], 10) || null,
            level: row['Prior Yr 2 Level'] ? parseInt(row['Prior Yr 2 Level'].replace('Level ', ''), 10) : null,
        });
    }

    let prior1 = { grade: null, score: null, level: null };  // 1 grade below
    let prior2 = { grade: null, score: null, level: null };  // 2 grades below

    for (const entry of priorEntries) {
        if (isNaN(entry.grade)) continue;
        if (entry.grade === currentGrade - 1) {
            prior1 = entry;
        } else if (entry.grade === currentGrade - 2) {
            prior2 = entry;
        }
    }

    return { prior1, prior2 };
}

// ── Add columns via pg-meta API ──
async function ensureColumns() {
    console.log('Adding ELPAC columns to students table...');
    const sql = `
        ALTER TABLE public.students
            ADD COLUMN IF NOT EXISTS elpac_score          INTEGER,
            ADD COLUMN IF NOT EXISTS elpac_listening      TEXT,
            ADD COLUMN IF NOT EXISTS elpac_speaking       TEXT,
            ADD COLUMN IF NOT EXISTS elpac_reading        TEXT,
            ADD COLUMN IF NOT EXISTS elpac_writing        TEXT,
            ADD COLUMN IF NOT EXISTS prior_yr1_grade      TEXT,
            ADD COLUMN IF NOT EXISTS prior_yr1_score      INTEGER,
            ADD COLUMN IF NOT EXISTS prior_yr1_level      INTEGER,
            ADD COLUMN IF NOT EXISTS prior_yr2_grade      TEXT,
            ADD COLUMN IF NOT EXISTS prior_yr2_score      INTEGER,
            ADD COLUMN IF NOT EXISTS prior_yr2_level      INTEGER,
            ADD COLUMN IF NOT EXISTS elpac_test_date      TEXT;
    `;
    try {
        const result = await runSQL(sql);
        console.log('Columns added successfully via pg-meta API.');
    } catch (err) {
        console.log('pg-meta API failed:', err.message);
        console.log('Trying alternative approach: direct REST SQL...');
        // Fall back: try using the REST endpoint for SQL
        try {
            const altResp = await fetch(`${SUPABASE_URL}/rest/v1/`, {
                method: 'POST',
                headers: {
                    'apikey': SERVICE_KEY,
                    'Authorization': `Bearer ${SERVICE_KEY}`,
                    'Content-Type': 'application/sql',
                    'Prefer': 'tx=commit',
                },
                body: sql,
            });
            console.log('REST SQL status:', altResp.status);
            if (altResp.status >= 200 && altResp.status < 300) {
                console.log('Columns added successfully via REST SQL.');
            } else {
                const text = await altResp.text();
                throw new Error(`REST SQL failed: ${text}`);
            }
        } catch (e2) {
            console.error('');
            console.error('Could not add columns automatically. Please run the following SQL');
            console.error('in your Supabase Dashboard → SQL Editor:');
            console.error('');
            console.error(sql);
            console.error('');
            process.exit(1);
        }
    }
}

// ── Main import ──
async function main() {
    const csvPath = path.join(__dirname, '..', 'ELPAC_All_Students.csv');
    const rows = parseCSV(csvPath);
    console.log(`Parsed ${rows.length} student records from CSV\n`);

    // Step 1: Ensure DB columns exist
    await ensureColumns();

    // Step 2: Fetch all students from DB
    const { data: dbStudents, error: fetchErr } = await supabase
        .from('students')
        .select('id, ssid, name, grade');

    if (fetchErr) {
        console.error('Failed to fetch students from DB:', fetchErr.message);
        process.exit(1);
    }

    // Build SSID -> DB student mapping
    const ssidToDb = {};
    for (const s of dbStudents) {
        ssidToDb[s.ssid] = s;
    }
    console.log(`Found ${dbStudents.length} students in database\n`);

    let updated = 0;
    let skipped = 0;
    let errors = 0;

    for (const row of rows) {
        const ssid = row['SSID'];
        const name = row['Name'];
        const grade = parseInt(row['Grade'], 10);
        const overallLevel = parseInt(row['Overall Level'], 10);
        const scaleScore = parseInt(row['Current Score'], 10);
        const testDate = row['Test Date'];

        // Domain scores
        const listening = row['Listening'];
        const speaking = row['Speaking'];
        const reading = row['Reading'];
        const writing = row['Writing'];

        // Prior year data (matched by grade level)
        const { prior1, prior2 } = extractPriorData(row);

        if (!ssidToDb[ssid]) {
            console.log(`  NOT IN DB: ${name} (SSID: ${ssid}) - SKIPPED`);
            skipped++;
            continue;
        }

        const dbStudent = ssidToDb[ssid];

        const updateData = {
            overall_level: overallLevel,
            elpac_score: scaleScore,
            elpac_test_date: testDate,
            elpac_listening: listening,
            elpac_speaking: speaking,
            elpac_reading: reading,
            elpac_writing: writing,
            prior_yr1_grade: prior1.grade !== null ? `Grade ${prior1.grade}` : null,
            prior_yr1_score: prior1.score,
            prior_yr1_level: prior1.level,
            prior_yr2_grade: prior2.grade !== null ? `Grade ${prior2.grade}` : null,
            prior_yr2_score: prior2.score,
            prior_yr2_level: prior2.level,
        };

        const { error: updateErr } = await supabase
            .from('students')
            .update(updateData)
            .eq('id', dbStudent.id);

        if (updateErr) {
            console.log(`  ERROR updating ${name} (SSID: ${ssid}): ${updateErr.message}`);
            errors++;
        } else {
            console.log(`  UPDATED: ${name} (G${grade})`);
            console.log(`    Score=${scaleScore}  Level=${overallLevel}  Date=${testDate}`);
            console.log(`    L=${listening}  S=${speaking}  R=${reading}  W=${writing}`);
            if (prior1.grade) console.log(`    Prior Yr (G${prior1.grade}): Score=${prior1.score}  Level=${prior1.level}`);
            if (prior2.grade) console.log(`    Prior 2Yr (G${prior2.grade}): Score=${prior2.score}  Level=${prior2.level}`);
            updated++;
        }
    }

    console.log(`\n=== IMPORT SUMMARY ===`);
    console.log(`Updated:    ${updated}`);
    console.log(`Skipped:    ${skipped}`);
    console.log(`Errors:     ${errors}`);
    console.log(`Total CSV:  ${rows.length}`);
}

main().catch(console.error);