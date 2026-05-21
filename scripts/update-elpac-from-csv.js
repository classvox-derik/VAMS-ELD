/**
 * update-elpac-from-csv.js
 * Merges ELPAC_All_Students.csv into src/data/elpac-scores.json,
 * adding test_date and prior-year fields while preserving oral_score / written_score.
 *
 * Usage: node scripts/update-elpac-from-csv.js
 */

const fs   = require("fs");
const path = require("path");

const ROOT     = path.resolve(__dirname, "..");
const CSV_PATH = path.join(ROOT, "ELPAC_All_Students.csv");
const JSON_PATH = path.join(ROOT, "src", "data", "elpac-scores.json");

// ── helpers ────────────────────────────────────────────────────────────────

function parseLevelNumber(raw) {
  if (!raw || raw.trim() === "") return null;
  const m = raw.match(/\d+/);
  return m ? parseInt(m[0], 10) : null;
}

function parseScore(raw) {
  if (!raw || raw.trim() === "") return null;
  const n = parseInt(raw.trim(), 10);
  return isNaN(n) ? null : n;
}

function normalizeListening(raw) {
  // Keep consistent with existing JSON short labels
  const r = (raw || "").trim();
  if (r.startsWith("Well"))        return "Well Developed";
  if (r.startsWith("Somewhat"))    return "Somewhat/Moderately";
  if (r.startsWith("Beginning"))   return "Beginning to Develop";
  return r;
}

// ── read existing JSON ─────────────────────────────────────────────────────
const existing = JSON.parse(fs.readFileSync(JSON_PATH, "utf8"));

// ── parse CSV ──────────────────────────────────────────────────────────────
const csvText = fs.readFileSync(CSV_PATH, "utf8");
const lines   = csvText.split(/\r?\n/).filter(l => l.trim() !== "");
const headers = lines[0].split(",");

console.log("Headers:", headers);

let updated = 0;
let added   = 0;

for (let i = 1; i < lines.length; i++) {
  // CSV may have commas inside quoted fields — simple split is fine here
  // (the source file doesn't have quoted commas)
  const cols = lines[i].split(",");

  const grade         = parseInt(cols[0], 10);
  const name          = cols[1].trim();
  const ssid          = cols[2].trim();
  const testDate      = cols[3].trim();
  const overallLevel  = parseLevelNumber(cols[4]);
  const currentScore  = parseScore(cols[5]);
  const listening     = normalizeListening(cols[6]);
  const speaking      = normalizeListening(cols[7]);
  const reading       = normalizeListening(cols[8]);
  const writing       = normalizeListening(cols[9]);

  const py1Grade  = (cols[10] || "").trim() || null;
  const py1Score  = parseScore(cols[11]);
  const py1Level  = parseLevelNumber(cols[12]);

  const py2Grade  = (cols[13] || "").trim() || null;
  const py2Score  = parseScore(cols[14]);
  const py2Level  = parseLevelNumber(cols[15]);

  const py3Grade  = (cols[16] || "").trim() || null;
  const py3Score  = parseScore(cols[17]);
  const py3Level  = parseLevelNumber(cols[18]);

  if (!ssid) continue;

  const isNew = !existing[ssid];

  existing[ssid] = {
    ...(existing[ssid] || {}),   // preserve oral_score, written_score, etc.
    name,
    grade,
    ssid,
    elpac_score:    currentScore,
    elpac_level:    overallLevel,
    listening,
    speaking,
    reading,
    writing,
    test_date:      testDate || null,
    prior_yr1_grade: py1Grade,
    prior_yr1_score: py1Score,
    prior_yr1_level: py1Level,
    prior_yr2_grade: py2Grade,
    prior_yr2_score: py2Score,
    prior_yr2_level: py2Level,
    prior_yr3_grade: py3Grade,
    prior_yr3_score: py3Score,
    prior_yr3_level: py3Level,
  };

  if (isNew) { added++;   console.log(`  + Added   ${ssid} – ${name}`); }
  else        { updated++; console.log(`  ↺ Updated ${ssid} – ${name}`); }
}

fs.writeFileSync(JSON_PATH, JSON.stringify(existing, null, 2), "utf8");
console.log(`\nDone. ${updated} updated, ${added} added. Written to ${JSON_PATH}`);
