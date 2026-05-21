/**
 * update-el-levels.js
 * Updates all students' el_level (Emerging / Expanding / Bridging)
 * to match their overall_level (1–4) from ELPAC scores.
 *
 * Mapping:
 *   overall_level = 4  →  "Bridging"
 *   overall_level = 3  →  "Expanding"
 *   overall_level = 2  →  "Expanding"
 *   overall_level = 1  →  "Emerging"
 *
 * Usage: node scripts/update-el-levels.js
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://bogllcjeaqoghabmbxhy.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvZ2xsY2plYXFvZ2hhYm1ieGh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTU0ODY3MSwiZXhwIjoyMDg3MTI0NjcxfQ.cP3lxGGkKtPu5gAVx-c9bOBu9eD4BTNb51JXs-UCsuI';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

/**
 * Maps an overall ELPAC level (1–4) to an ELD classification string.
 *
 * @param {number|null} level
 * @returns {string|null} "Emerging", "Expanding", "Bridging", or null if unknown
 */
function mapLevelToEL(level) {
    if (level === 4) return 'Bridging';
    if (level === 3) return 'Expanding';
    if (level === 2) return 'Expanding';
    if (level === 1) return 'Emerging';
    return null;
}

async function main() {
    console.log('Fetching all students from database...\n');

    // Fetch all students (id, name, grade, overall_level)
    const { data: students, error: fetchErr } = await supabase
        .from('students')
        .select('id, ssid, name, grade, overall_level, el_level');

    if (fetchErr) {
        console.error('Failed to fetch students:', fetchErr.message);
        process.exit(1);
    }

    console.log(`Found ${students.length} students in DB\n`);

    let updated = 0;
    let skipped = 0;
    let errors = 0;

    for (const student of students) {
        const newEL = mapLevelToEL(student.overall_level);

        if (!newEL) {
            console.log(`  SKIPPED: ${student.name} (SSID: ${student.ssid}) — overall_level is ${student.overall_level}`);
            skipped++;
            continue;
        }

        // Skip if already set correctly (idempotent)
        if (student.el_level === newEL) {
            console.log(`  ✓ Already correct: ${student.name} → ${newEL}`);
            continue;
        }

        const { error: updateErr } = await supabase
            .from('students')
            .update({ el_level: newEL })
            .eq('id', student.id);

        if (updateErr) {
            console.log(`  ERROR updating ${student.name} (SSID: ${student.ssid}): ${updateErr.message}`);
            errors++;
        } else {
            console.log(`  UPDATED: ${student.name} (G${student.grade}) — overall=${student.overall_level} → ${newEL}`);
            updated++;
        }
    }

    console.log(`\n=== SUMMARY ===`);
    console.log(`Updated:   ${updated}`);
    console.log(`Skipped:   ${skipped}`);
    console.log(`Errors:    ${errors}`);
    console.log(`Total:     ${students.length}`);
}

main().catch(console.error);