import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import { validatePathogenRecord } from '../ingest_lecture.mjs';
import { batch1BacteriaA } from './batch1_bacteria_a.mjs';
import { batch2BacteriaB } from './batch2_bacteria_b.mjs';
import { batch3VirusesA } from './batch3_viruses_a.mjs';
import { batch3VirusesB } from './batch3_viruses_b.mjs';
import { batch4FungiParasites } from './batch4_fungi_parasites.mjs';

const DB_PATH = path.join(process.cwd(), 'data', 'microbes.json');
const BACKUP_PATH = path.join(process.cwd(), 'data', 'microbes.json.bak');
const IMAGES_DIR = path.join(process.cwd(), 'assets', 'images', 'clinical');
const USER_AGENT = 'PathoxMicroClinicalAtlas/2.0 (Educational Medical Microbiology App; https://github.com/fangun2548/pathox-micro)';

if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function fetchBuffer(targetUrl, retries = 3) {
  return new Promise((resolve, reject) => {
    const req = https.get(targetUrl, { headers: { 'User-Agent': USER_AGENT } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307) {
        if (res.headers.location) {
          return resolve(fetchBuffer(res.headers.location, retries));
        }
      }
      if (res.statusCode === 429 && retries > 0) {
        const wait = 2500 * (4 - retries);
        return sleep(wait).then(() => fetchBuffer(targetUrl, retries - 1)).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} on ${targetUrl}`));
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    });
    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error(`Timeout on ${targetUrl}`));
    });
  });
}

function isGoodClinicalFilename(title) {
  const lower = title.toLowerCase();
  if (!/\.(jpg|jpeg|png)$/i.test(lower)) return false;
  // Filter out maps, flags, logos, book covers, charts, portraits
  const bad = ['map', 'distribution', 'logo', 'flag', 'icon', 'chart', 'graph', 'poster', 'stamp', 'book', 'cover', 'portrait', 'doctor', 'statue', 'timeline', 'epidemiology', 'cases_by', 'deaths_by', 'world_', 'global_'];
  if (bad.some(w => lower.includes(w))) return false;
  return true;
}

async function searchWikimediaImage(query) {
  const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(query)}&gsrlimit=8&prop=imageinfo&iiprop=url|mime|size|extmetadata&iiurlwidth=800&format=json`;
  const buf = await fetchBuffer(apiUrl);
  const data = JSON.parse(buf.toString('utf8'));
  if (!data.query || !data.query.pages) return null;

  const pages = Object.values(data.query.pages)
    .sort((a, b) => (a.index || 99) - (b.index || 99));

  for (const p of pages) {
    if (!p.title || !p.imageinfo || !p.imageinfo[0]) continue;
    const info = p.imageinfo[0];
    const mime = info.mime || '';
    if (!mime.startsWith('image/jpeg') && !mime.startsWith('image/png')) continue;
    if (!isGoodClinicalFilename(p.title)) continue;
    if (info.width && info.width < 220) continue;

    const dlUrl = info.thumburl || info.url;
    const rawArtist = info.extmetadata?.Artist?.value || '';
    const cleanArtist = rawArtist.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 80);
    const license = info.extmetadata?.LicenseShortName?.value || 'Wikimedia Commons';
    const cleanTitle = p.title.replace(/^File:/i, '');

    return {
      title: cleanTitle,
      url: dlUrl,
      source: cleanArtist
        ? `Wikimedia Commons (${cleanTitle}) · ${cleanArtist} (${license})`
        : `Wikimedia Commons (${cleanTitle}) · ${license}`
    };
  }
  return null;
}

async function fetchImageForPathogen(record) {
  const c = record.clinicalCases[0];
  const destPath = path.join(IMAGES_DIR, c.localFileName);

  // Cache hit?
  if (fs.existsSync(destPath) && fs.statSync(destPath).size > 2000) {
    console.log(`  [CACHE] ${c.localFileName} already exists.`);
    delete c.imageQueries;
    return true;
  }

  const queries = [
    ...(c.imageQueries || []),
    record.scientificName.split('(')[0].trim(),
    record.name.split('(')[0].trim()
  ];

  for (const q of queries) {
    try {
      const hit = await searchWikimediaImage(q);
      if (hit && hit.url) {
        const imgBuf = await fetchBuffer(hit.url);
        if (imgBuf && imgBuf.length > 2000) {
          fs.writeFileSync(destPath, imgBuf);
          c.source = hit.source;
          c.downloadSource = hit.title;
          delete c.imageQueries;
          console.log(`  [OK] ${record.id} -> ${hit.title} (${Math.round(imgBuf.length / 1024)} KB)`);
          await sleep(350);
          return true;
        }
      }
    } catch (e) {
      // try next query
    }
    await sleep(250);
  }

  console.warn(`  [MISS] Could not download image for ${record.id}`);
  delete c.imageQueries;
  return false;
}

async function main() {
  const allNew = [
    ...batch1BacteriaA,
    ...batch2BacteriaB,
    ...batch3VirusesA,
    ...batch3VirusesB,
    ...batch4FungiParasites
  ];

  console.log(`Prepared ${allNew.length} candidate new pathogens across 4 batches.`);

  const rawDB = fs.readFileSync(DB_PATH, 'utf8');
  const existingDB = JSON.parse(rawDB);
  const existingIds = new Set(existingDB.map(m => m.id));

  // Filter strictly to pathogens NOT already in database
  const toAdd = allNew.filter(m => !existingIds.has(m.id));
  console.log(`Existing DB count: ${existingDB.length} | Missing pathogens to add: ${toAdd.length}`);

  if (toAdd.length === 0) {
    console.log('Nothing new to add!');
    return;
  }

  // Backup before mutation
  fs.writeFileSync(BACKUP_PATH, rawDB, 'utf8');
  console.log(`[BACKUP] Saved backup to ${BACKUP_PATH}\n`);

  const missed = [];
  for (let i = 0; i < toAdd.length; i++) {
    const rec = toAdd[i];
    process.stdout.write(`[${i + 1}/${toAdd.length}] Fetching image for ${rec.id}... `);
    const ok = await fetchImageForPathogen(rec);
    if (!ok) missed.push(rec.id);
  }

  console.log(`\nImage fetch complete. Missed: ${missed.length}`, missed);

  // Merge and validate every single record
  const merged = [...existingDB, ...toAdd];
  merged.forEach(validatePathogenRecord);

  fs.writeFileSync(DB_PATH, JSON.stringify(merged, null, 2), 'utf8');
  console.log(`\n========================================================`);
  console.log(`[SUCCESS] Added ${toAdd.length} new pathogens! Total DB: ${merged.length}`);
  console.log(`========================================================`);
}

main().catch(err => {
  console.error('[FATAL]', err);
  process.exit(1);
});
