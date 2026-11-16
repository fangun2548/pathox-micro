/**
 * Pathox-Micro · Lecture Ingestion & Pathogen Pipeline
 * 
 * Purpose:
 *   Rapidly, accurately, and stably ingests new medical microbiology data
 *   (from lecture notes, PDFs, textbook excerpts, or JSON manifests)
 *   into Pathox-Micro's database and clinical image library.
 * 
 * 3 Pillars:
 *   1. เสถียร (Stability): Schema verification, safe backups, local image caching.
 *   2. ถูกต้อง (Accuracy): Strict 5-dimension medical structure & verified citations.
 *   3. รวดเร็ว (Speed): Automated stream downloading, zero-reload static JSON sync.
 * 
 * Usage:
 *   node scripts/ingest_lecture.mjs <input-manifest.json>
 *   node scripts/ingest_lecture.mjs --validate
 */

import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';

const DB_PATH = path.join(process.cwd(), 'data', 'microbes.json');
const BACKUP_PATH = path.join(process.cwd(), 'data', 'microbes.json.bak');
const IMAGES_DIR = path.join(process.cwd(), 'assets', 'images', 'clinical');
const USER_AGENT = 'PathoxMicroApp/1.0 (https://github.com/fangun2548/pathox-micro; fangun2548@gmail.com)';

// Ensure image directory exists
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

async function fetchBuffer(targetUrl) {
  return new Promise((resolve, reject) => {
    https.get(targetUrl, { headers: { 'User-Agent': USER_AGENT } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return resolve(fetchBuffer(res.headers.location));
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} on ${targetUrl}`));
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

async function resolveDirectWikimediaUrl(filename) {
  if (filename.startsWith('http')) return filename;
  const cleanTitle = filename.replace(/^File:/i, '');
  const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(cleanTitle)}&prop=imageinfo&iiprop=url&format=json`;
  const buf = await fetchBuffer(apiUrl);
  const data = JSON.parse(buf.toString('utf8'));
  const pages = data.query.pages;
  const page = Object.values(pages)[0];
  if (page && page.imageinfo && page.imageinfo[0]) {
    const rawUrl = page.imageinfo[0].url;
    return rawUrl.split('?')[0];
  }
  return null;
}

// ----------------------------------------------------------------------------
// Helper: Download verified clinical image to local assets
// ----------------------------------------------------------------------------
export async function downloadClinicalImage(wikimediaFileOrUrl, saveFileName) {
  const destPath = path.join(IMAGES_DIR, saveFileName);
  
  // If already exists and has size > 1000 bytes, skip re-download
  if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1000) {
    console.log(`  [CACHE HIT] ${saveFileName} already cached.`);
    return `assets/images/clinical/${saveFileName}`;
  }

  try {
    const directUrl = await resolveDirectWikimediaUrl(wikimediaFileOrUrl);
    if (!directUrl) {
      console.warn(`  [WARN] Failed to resolve URL for ${wikimediaFileOrUrl}`);
      return null;
    }
    console.log(`  [DOWNLOADING] ${saveFileName} from ${directUrl}`);
    const buffer = await fetchBuffer(directUrl);
    fs.writeFileSync(destPath, buffer);
    console.log(`  [OK] Saved ${saveFileName} (${buffer.length} bytes)`);
    return `assets/images/clinical/${saveFileName}`;
  } catch (err) {
    console.warn(`  [WARN] Failed to download ${wikimediaFileOrUrl}: ${err.message}`);
    return null;
  }
}

// ----------------------------------------------------------------------------
// Validation Schema: Ensure all 5 dimensions and clinical cases are complete
// ----------------------------------------------------------------------------
export function validatePathogenRecord(p) {
  const required = ['id', 'name', 'thaiName', 'scientificName', 'category', 'clinicalCases', 'tabs'];
  for (const field of required) {
    if (!p[field]) {
      throw new Error(`Record ${p.id || 'UNKNOWN'} is missing required field: "${field}"`);
    }
  }

  // Verify category
  const validCategories = ['virus', 'bacteria', 'fungi', 'parasite'];
  if (!validCategories.includes(p.category)) {
    throw new Error(`Invalid category "${p.category}" for ${p.id}. Must be one of: ${validCategories.join(', ')}`);
  }

  // Verify clinical cases (at least 1, recommended 2+)
  if (!Array.isArray(p.clinicalCases) || p.clinicalCases.length === 0) {
    throw new Error(`Pathogen ${p.id} must have at least 1 clinical case in clinicalCases`);
  }

  p.clinicalCases.forEach((c, idx) => {
    if (!c.title || !c.image || !c.source) {
      throw new Error(`Pathogen ${p.id} clinical case #${idx + 1} missing title, image, or source`);
    }
    const resolvedPath = path.join(process.cwd(), c.image);
    if (!fs.existsSync(resolvedPath)) {
      console.warn(`  [CAUTION] Image file does not exist locally: ${c.image}`);
    }
  });

  // Verify 5 medical tabs
  const tabs = p.tabs;
  const hasClinical = tabs.clinical || tabs.pearls;
  if (!tabs.morphology || !tabs.pathogenesis || !tabs.diagnosis || !hasClinical || !tabs.treatment) {
    throw new Error(`Pathogen ${p.id} tabs must contain all 5 dimensions: morphology, pathogenesis, diagnosis, clinical/pearls, treatment`);
  }

  return true;
}

// ----------------------------------------------------------------------------
// Main Ingestion Workflow
// ----------------------------------------------------------------------------
export async function ingestLectureData(newRecords) {
  if (!fs.existsSync(DB_PATH)) {
    throw new Error(`Database not found at ${DB_PATH}`);
  }

  // Backup current DB
  const rawDB = fs.readFileSync(DB_PATH, 'utf8');
  fs.writeFileSync(BACKUP_PATH, rawDB, 'utf8');
  console.log(`[BACKUP] Created database backup at ${BACKUP_PATH}`);

  const existingDB = JSON.parse(rawDB);
  const existingMap = new Map(existingDB.map(m => [m.id, m]));

  let added = 0;
  let updated = 0;

  for (const record of newRecords) {
    console.log(`\nProcessing pathogen: ${record.name} (${record.id})`);

    // Download any external images in clinicalCases
    if (record.clinicalCases && Array.isArray(record.clinicalCases)) {
      for (let i = 0; i < record.clinicalCases.length; i++) {
        const c = record.clinicalCases[i];
        if (c.downloadSource) {
          const safeFileName = c.localFileName || `${record.id}_case${i + 1}.jpg`;
          const localPath = await downloadClinicalImage(c.downloadSource, safeFileName);
          if (localPath) {
            c.image = localPath;
          }
        }
      }
    }

    // Validate
    validatePathogenRecord(record);

    if (existingMap.has(record.id)) {
      existingMap.set(record.id, { ...existingMap.get(record.id), ...record });
      updated++;
      console.log(`  [UPDATE] Updated existing record: ${record.id}`);
    } else {
      existingMap.set(record.id, record);
      added++;
      console.log(`  [ADD] Inserted new record: ${record.id}`);
    }
  }

  const finalArray = Array.from(existingMap.values());
  fs.writeFileSync(DB_PATH, JSON.stringify(finalArray, null, 2), 'utf8');
  console.log(`\n=======================================================`);
  console.log(`[SUCCESS] Ingestion completed! Added: ${added}, Updated: ${updated}, Total: ${finalArray.length}`);
  console.log(`=======================================================`);
  return finalArray;
}

// CLI Runner
if (process.argv[1] && process.argv[1].endsWith('ingest_lecture.mjs')) {
  const args = process.argv.slice(2);
  if (args.includes('--validate')) {
    try {
      const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
      console.log(`Validating ${db.length} existing records in database...`);
      db.forEach(validatePathogenRecord);
      console.log(`[PASS] All ${db.length} pathogen records are 100% valid!`);
    } catch (e) {
      console.error(`[FAIL] Validation error: ${e.message}`);
      process.exit(1);
    }
  } else if (args[0] && fs.existsSync(args[0])) {
    const data = JSON.parse(fs.readFileSync(args[0], 'utf8'));
    const records = Array.isArray(data) ? data : [data];
    ingestLectureData(records).catch(err => {
      console.error(`[ERROR] Ingestion failed: ${err.message}`);
      process.exit(1);
    });
  } else {
    console.log(`Usage: node scripts/ingest_lecture.mjs <file.json> | --validate`);
  }
}
