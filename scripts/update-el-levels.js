/**
 * update-el-levels.js
 * Updates all students' overall_level AND el_level to match the
 * authoritative ELPAC score data in src/data/elpac-scores.json.
 *
 * 1. Reads elpac-scores.json to get the correct elpac_level (overall level 1-4)
 * 2. Updates overall_level in the database to match
 * 3. Maps overall_level → el_level string:
 *      overall_level = 4  →  "Bridging"
 *      overall_level = 3  →  "Expanding"
 *      overall_level = 2  →  "Expanding"
 *      overall_level = 1  →  "Emerging"
 *
 * Usage: node scripts/update-el-levels.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://bogllcjeaqoghabmbxhy.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvZ2xsY2plYXFvZ2hhYm1ieGh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTU0ODY3MSwiZXhwIjoyMDg3MTI0NjcxfQ.cP3lxGGkKtPu5gAVx-c9bOBu9eD4BTNb51JXs-UCsuI';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

/**
 * Maps an overall ELPAC level (1–4) to an ELD classification string.
 */
function mapLevelToEL(level) {
    if (level === 4) return 'Bridging';
    if (level === 3) return 'Expanding';
    if (level === 2) return 'Expanding';
    if (level === 1) return 'Emerging';
    return null;
}

async function main() {
    // Load the authoritative ELPAC scores
    const scoresPath = path.resolve(__dirname, '..', 'src', 'data', 'elpac-scores.json');
    const elpacScores = JSON.parse(fs.readFileSync(scoresPath, 'utf8'));
    console.log(`Loaded ${Object.keys(elpacScores).length} ELPAC score entries from JSON\n`);

    // Build SSID → score data map
    const ssidToScore = {};
    for (const [ssid, data] of Object.entries(elpacScores)) {
        ssidToScore[ssid] = data;
    }

    // Fetch all students from DB
    const { data: students, error: fetchErr } = await supabase
        .from('students')
        .select('id, ssid, name, grade, overall_level, elpac_score, el_level');

    if (fetchErr) {
        console.error('Failed to fetch students:', fetchErr.message);
        process.exit(1);
    }

    console.log(`Found ${students.length} students in DB\n`);

    // Track results
    let updatedOverall = 0;
    let updatedEL = 0;
    let skipped = 0;
    let errors = 0;

    for (const student of students) {
        const scoreData = ssidToScore[student.ssid];

        if (!scoreData) {
            console.log(`  SKIPPED: ${student.name} (SSID: ${student.ssid}) — no ELPAC score data found`);
            skipped++;
            continue;
        }

        const correctOverallLevel = scoreData.elpac_level;
        const correctELLevel = mapLevelToEL(correctOverallLevel);

        if (!correctELLevel) {
            console.log(`  SKIPPED: ${student.name} — invalid elpac_level: ${correctOverallLevel}`);
            skipped++;
            continue;
        }

        const updates = {};

        // Update overall_level if wrong
        if (student.overall_level !== correctOverallLevel) {
            updates.overall_level = correctOverallLevel;
        }

        // Also update elpac_score if it's null in DB but present in JSON
        if (student.elpac_score === null && scoreData.elpac_score !== undefined && scoreData.elpac_score !== null) {
            updates.elpac_score = scoreData.elpac_score;
        }

        // Update el_level if wrong
        if (student.el_level !== correctELLevel) {
            updates.el_level = correctELLevel;
        }

        if (Object.keys(updates).length === 0) {
            console.log(`  ✓ Already correct: ${student.name} → overall=${correctOverallLevel}, el=${correctELLevel}`);
            continue;
        }

        const { error: updateErr } = await supabase
            .from('students')
            .update(updates)
            .eq('id', student.id);

        if (updateErr) {
            console.log(`  ERROR updating ${student.name} (SSID: ${student.ssid}): ${updateErr.message}`);
            errors++;
        } else {
            const parts = [];
            if (updates.overall_level) { parts.push(`overall: ${student.overall_level}→${correctOverallLevel}`); updatedOverall++; }
            if (updates.el_level) { parts.push(`el: ${student.el_level}→${correctELLevel}`); updatedEL++; }
            if (updates.elpac_score) { parts.push(`score: null→${scoreData.elpac_score}`); }
            console.log(`  UPDATED: ${student.name} — ${parts.join(', ')}`);
        }
    }

    console.log(`\n=== SUMMARY ===`);
    console.log(`Overall level updated: ${updatedOverall}`);
    console.log(`EL level updated:      ${updatedEL}`);
    console.log(`Skipped (no data):     ${skipped}`);
    console.log(`Errors:                ${errors}`);
    console.log(`Total students:        ${students.length}`);
}

main().catch(console.error);