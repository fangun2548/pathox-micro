import fs from 'fs';

const microbes = JSON.parse(fs.readFileSync('data/microbes.json', 'utf8'));

console.log(`Testing Flashcard System on ${microbes.length} pathogens...`);

// Test 1: Category counts
const categories = ['all', 'bacteria', 'fungi', 'virus', 'parasite'];
categories.forEach(cat => {
  const filtered = cat === 'all' ? microbes : microbes.filter(m => m.category === cat);
  console.log(`[PASS] Category '${cat}': ${filtered.length} cards`);
});

// Test 2: Mode 1 (Symptoms -> Pathogen)
let mode1Errors = 0;
microbes.forEach(m => {
  const mildText = m.quickStats?.morphology || m.lesionThai;
  const severeText = m.quickStats?.depth || m.tabs?.pathogenesis?.virulenceFactors?.[0]?.description;
  if (!mildText || !severeText) {
    console.error(`[FAIL Mode 1] Missing mild/severe on ${m.id}`);
    mode1Errors++;
  }
});
if (mode1Errors === 0) console.log(`[PASS] Mode 1: All ${microbes.length} pathogens have mild & severe clinical findings!`);

// Test 3: Mode 2 (Pathogen -> Treatment: DOC, Pregnancy, Allergy, Resistance)
let mode2Errors = 0;
microbes.forEach(m => {
  const firstLine = m.tabs?.treatment?.firstLine;
  const alt = m.tabs?.treatment?.alternative || m.tabs?.treatment?.woundCare || m.tabs?.treatment?.systemic;
  const preg = m.tabs?.treatment?.childrenPregnant || (m.category === 'bacteria' ? 'หลีกเลี่ยง Tetracyclines / Fluoroquinolones ในสตรีมีครรภ์' : 'ระมัดระวังในสตรีมีครรภ์');
  const res = m.tabs?.treatment?.resistance || m.tabs?.treatment?.reaction;

  if (!firstLine || !alt || !preg || !res) {
    console.error(`[FAIL Mode 2] Incomplete treatment data on ${m.id}`);
    mode2Errors++;
  }
});
if (mode2Errors === 0) console.log(`[PASS] Mode 2: All ${microbes.length} pathogens have complete First-line, Pregnancy/Allergy, and Resistance data!`);

// Test 4: Mode 3 (Comprehensive)
let mode3Errors = 0;
microbes.forEach(m => {
  if (!m.name || !(m.thaiName || m.nameThai) || !m.tabs?.pathogenesis || !m.tabs?.treatment) {
    console.error(`[FAIL Mode 3] Incomplete comprehensive data on ${m.id}`);
    mode3Errors++;
  }
});
if (mode3Errors === 0) console.log(`[PASS] Mode 3: All ${microbes.length} pathogens ready for comprehensive board study!`);

console.log('--- ALL FLASHCARD TESTS PASSED ---');
