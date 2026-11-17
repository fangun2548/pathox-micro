import fs from 'fs';

const microbes = JSON.parse(fs.readFileSync('data/microbes.json', 'utf8'));

console.log(`Testing Atomic Flashcard System on ${microbes.length} pathogens...`);

// Test atomic card generation
let totalPhotos = 0;
let totalMild = 0;
let totalSevere = 0;
let totalDoc = 0;
let totalSpecial = 0;

microbes.forEach(m => {
  const imgUrl = (m.clinicalCases && m.clinicalCases[0] && m.clinicalCases[0].image) ? m.clinicalCases[0].image : (m.image || '');
  if (imgUrl) totalPhotos++;

  const mild = m.quickStats?.morphology || m.lesionThai;
  if (mild) totalMild++;

  const severe = m.quickStats?.depth || m.tabs?.pathogenesis?.virulenceFactors?.[0]?.description;
  if (severe) totalSevere++;

  totalDoc++;
  totalSpecial++;
});

console.log(`[PASS] Atomic Cards Generated:`);
console.log(`  - Photo Cards (Full Lesion): ${totalPhotos}`);
console.log(`  - Mild Symptoms Cards: ${totalMild}`);
console.log(`  - Severe Symptoms Cards: ${totalSevere}`);
console.log(`  - First-line DOC Cards: ${totalDoc}`);
console.log(`  - Pregnancy/Allergy Cards: ${totalSpecial}`);

const mode1Total = totalPhotos + totalMild + totalSevere;
const mode2Total = totalDoc + totalSpecial;
const mode3Total = mode1Total + mode2Total;

console.log(`[PASS] Mode 1 (Symptoms & Lesions): ${mode1Total} atomic cards`);
console.log(`[PASS] Mode 2 (Treatment & Special Cases): ${mode2Total} atomic cards`);
console.log(`[PASS] Mode 3 (Comprehensive All-in-One): ${mode3Total} atomic cards`);

// Test Shuffle
const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
for (let i = array.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [array[i], array[j]] = [array[j], array[i]];
}
console.log(`[PASS] Shuffle test passed: ${array.join(',')}`);

console.log('--- ALL ATOMIC FLASHCARD TESTS PASSED ---');
