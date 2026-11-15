# Pathox-Micro Project Rules & Workflow Memory

## Project Overview
Pathox-Micro is an interactive 2D Clinical Microbiology Visualizer designed for medical students preparing for NL1 and USMLE Step 1.
Instead of showing generic pathogen models, it displays **Real Clinical Case Photographs (ภาพเคสจริงจาก CDC/WHO)** of lesions and manifestations, backed by a comprehensive **5-dimension High-Yield Medical Drawer**.

---

## ⭐️ 3 Core Pillars (สิ่งสำคัญสูงสุด 3 ประการ)

1. **เสถียร (Stability)**:
   - **Local Asset Caching**: All clinical photographs must be stored locally under `assets/images/clinical/` (never rely solely on external live image URLs).
   - **Schema Safety**: Always validate `data/microbes.json` using `node scripts/ingest_lecture.mjs --validate`.
   - **Automatic Backup**: Backups are saved to `data/microbes.json.bak` before any database modifications.
   - **UI Robustness**: Never write code that breaks on missing data; always provide sensible medical fallbacks.

2. **ถูกต้อง (Accuracy)**:
   - **Authentic Case Photos**: 1 to 2+ real clinical photos per pathogen showing primary and variant presentations (e.g. Smallpox centrifugal vs umbilicated; Anthrax neck eschar vs forearm edema; Syphilis chancre vs palmar rash).
   - **Complete 5-Dimension Structure**:
     1. `morphology`: Lesion description, depth, palpation feel, key findings.
     2. `pathogenesis`: Toxins, virulence factors, invasion mechanics.
     3. `diagnosis`: Staining, culture agar, biochemical tests.
     4. `clinical`: High-yield NL1 vignettes, buzzwords, classic board presentation.
     5. `treatment`: First-line DOC, alternatives, resistance mechanisms (e.g. mecA).
   - **Verified Attribution**: Always cite source (e.g., CDC PHIL ID, WHO Eradication Archive).

3. **รวดเร็ว (Speed)**:
   - **Fast Ingestion Pipeline**: Ingest new lecture files directly using `scripts/ingest_lecture.mjs`.
   - **Performance**: Pure vanilla JavaScript and CSS, 60 FPS rendering, zero lag.

---

## Ingesting New Lecture Files
When the user provides a new lecture file (PDF, slides, text notes):
1. Extract pathogen metadata into the 5-dimension schema.
2. Identify 1–2 real clinical photographs from CDC PHIL or Wikimedia Commons.
3. Ingest and cache using `node scripts/ingest_lecture.mjs <file.json>`.
4. Validate with `node scripts/ingest_lecture.mjs --validate`.
5. Verify on `http://localhost:3000/`.
