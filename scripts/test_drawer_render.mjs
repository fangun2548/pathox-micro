import fs from 'node:fs';

const db = JSON.parse(fs.readFileSync('data/microbes.json', 'utf8'));

// Mock DOM elements
class MockElement {
  constructor(id) {
    this.id = id;
    this.innerHTML = '';
    this.textContent = '';
    this.style = {};
    this.children = [];
  }
  appendChild(child) {
    this.children.push(child);
  }
  querySelectorAll() {
    return [];
  }
}

const dom = {};
const ids = [
  'drawer-pathogen-name',
  'drawer-thai-name',
  'virulence-factors-container',
  'immune-evasion-card',
  'immune-evasion-list',
  'transmission-text',
  'diagnosis-stains',
  'diagnosis-culture',
  'biochemical-card',
  'diagnosis-biochemical',
  'treatment-firstline',
  'treatment-alternative',
  'treatment-resistance'
];
ids.forEach(id => dom[id] = new MockElement(id));

global.document = {
  getElementById: (id) => dom[id] || null,
  createElement: (tag) => new MockElement(tag)
};

const toSafeArray = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val.map(x => typeof x === 'string' ? x : JSON.stringify(x));
  if (typeof val === 'string') return [val];
  return [String(val)];
};

let errors = 0;

db.forEach((microbe, index) => {
  try {
    // Tab 1: Pathogenesis
    const vfs = microbe.tabs?.pathogenesis?.virulenceFactors || [];
    if (vfs.length === 0) throw new Error(`Microbe ${microbe.id} has NO virulence factors!`);
    vfs.forEach(vf => {
      const text = vf.mechanism || vf.desc;
      if (!text) throw new Error(`Microbe ${microbe.id} VF "${vf.name}" has no description!`);
    });

    const immune = toSafeArray(microbe.tabs?.pathogenesis?.immuneEvasion);
    if (immune.length === 0) throw new Error(`Microbe ${microbe.id} has NO immune evasion data!`);

    const trans = microbe.tabs?.pathogenesis?.transmission;
    if (!trans) throw new Error(`Microbe ${microbe.id} has NO transmission text!`);

    // Tab 2: Diagnosis
    const stains = toSafeArray(microbe.tabs?.diagnosis?.stains || microbe.tabs?.diagnosis?.staining);
    if (stains.length === 0) throw new Error(`Microbe ${microbe.id} has NO stains!`);

    const culture = toSafeArray(microbe.tabs?.diagnosis?.culture);
    if (culture.length === 0) throw new Error(`Microbe ${microbe.id} has NO culture info!`);

    const bio = toSafeArray(microbe.tabs?.diagnosis?.biochemical || microbe.tabs?.diagnosis?.serology || microbe.tabs?.diagnosis?.tests);
    if (bio.length === 0) throw new Error(`Microbe ${microbe.id} has NO biochemical/serology info!`);

    // Tab 3: Treatment
    const firstLine = microbe.tabs?.treatment?.firstLine;
    if (!firstLine) throw new Error(`Microbe ${microbe.id} has NO firstLine treatment!`);

    const alt = microbe.tabs?.treatment?.alternative || microbe.tabs?.treatment?.woundCare || microbe.tabs?.treatment?.systemic || microbe.tabs?.treatment?.allergy;
    if (!alt) throw new Error(`Microbe ${microbe.id} has NO alternative treatment!`);

    const res = microbe.tabs?.treatment?.resistance || microbe.tabs?.treatment?.prevention || microbe.tabs?.treatment?.antitoxin;
    if (!res) throw new Error(`Microbe ${microbe.id} has NO resistance/warning info!`);

    console.log(`[PASS] #${index + 1} ${microbe.id} -> All 3 tabs verified!`);
  } catch (err) {
    console.error(`[FAIL] #${index + 1} ${microbe.id}: ${err.message}`);
    errors++;
  }
});

console.log(`\nVerification finished with ${errors} errors.`);
if (errors > 0) process.exit(1);
