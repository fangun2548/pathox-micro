// ============================================================================
// Pathox-Micro · Kurzgesagt 2D Vector Clinical Lesions Engine
// 2D Flat Vector Illustrations of Clinical Lesions (Ulcers, Pustules, Crusts, Rashes)
// ============================================================================

export function renderKurzgesagtSVG(microbe, mode = 'cutaway') {
  const isCutaway = mode === 'cutaway';
  const width = 800;
  const height = 560;

  let content = '';

  switch (microbe.id) {
    case 'variola-virus':
      content = renderVariolaPustuleSVG(isCutaway);
      break;
    case 'staphylococcus-aureus':
      content = renderStaphCrustsSVG(isCutaway);
      break;
    case 'bacillus-anthracis':
      content = renderAnthraxEscharSVG(isCutaway);
      break;
    case 'treponema-pallidum':
      content = renderSyphilisChancreSVG(isCutaway);
      break;
    case 'varicella-zoster':
      content = renderHerpesDewDropSVG(isCutaway);
      break;
    case 'borrelia-burgdorferi':
      content = renderLymeBullsEyeSVG(isCutaway);
      break;
    case 'candida-albicans':
      content = renderCandidaThrushSVG(isCutaway);
      break;
    default:
      content = renderVariolaPustuleSVG(isCutaway);
      break;
  }

  return `
    <svg 
      id="kurzgesagt-svg"
      viewBox="0 0 ${width} ${height}" 
      width="100%" 
      height="100%" 
      xmlns="http://www.w3.org/2000/svg"
      style="filter: drop-shadow(0 16px 40px rgba(0,0,0,0.5));"
    >
      <defs>
        <!-- Background Vignette Glow -->
        <radialGradient id="lesion-halo-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${microbe.badgeColor || '#38bdf8'}" stop-opacity="0.22" />
          <stop offset="70%" stop-color="${microbe.badgeColor || '#38bdf8'}" stop-opacity="0.05" />
          <stop offset="100%" stop-color="#090d16" stop-opacity="0" />
        </radialGradient>

        <!-- Skin Layer Gradients (Kurzgesagt Warm Flesh & Dermal Tones) -->
        <linearGradient id="epidermis-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fed7aa" />
          <stop offset="100%" stop-color="#fbcfe8" />
        </linearGradient>

        <linearGradient id="dermis-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fda4af" />
          <stop offset="50%" stop-color="#fb7185" />
          <stop offset="100%" stop-color="#f43f5e" />
        </linearGradient>

        <linearGradient id="fat-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fef08a" />
          <stop offset="100%" stop-color="#facc15" />
        </linearGradient>

        <!-- Lesion Palette Gradients -->
        <linearGradient id="pustule-roof-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fef08a" />
          <stop offset="50%" stop-color="#fca5a5" />
          <stop offset="100%" stop-color="#f87171" />
        </linearGradient>

        <linearGradient id="pus-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="40%" stop-color="#fef08a" />
          <stop offset="100%" stop-color="#facc15" />
        </linearGradient>

        <linearGradient id="honey-crust-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fef08a" />
          <stop offset="40%" stop-color="#f59e0b" />
          <stop offset="100%" stop-color="#d97706" />
        </linearGradient>

        <linearGradient id="coal-black-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#3f3f46" />
          <stop offset="50%" stop-color="#18181b" />
          <stop offset="100%" stop-color="#09090b" />
        </linearGradient>

        <linearGradient id="chancre-base-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fb7185" />
          <stop offset="100%" stop-color="#e11d48" />
        </linearGradient>

        <!-- Shading Filters -->
        <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <!-- Background Ambient Vignette Halo -->
      <circle cx="400" cy="280" r="300" fill="url(#lesion-halo-glow)" pointer-events="none" />

      <!-- Lesion Root Group -->
      <g id="pathogen-root" class="kurzgesagt-pathogen-group">
        ${content}
      </g>
    </svg>
  `;
}

// ============================================================================
// Helper: Render Standard Kurzgesagt 2D Skin Tissue Block (Cutaway vs Surface)
// ============================================================================
function renderSkinBlockBase(isCutaway, topY = 320, blockH = 180) {
  return `
    <!-- Skin Block Layers: Subcutis Fat -> Dermis -> Epidermis -->
    <g class="skin-tissue-block">
      <!-- Subcutaneous Fat (Yellow lobules at bottom) -->
      <rect x="150" y="${topY + 120}" width="500" height="60" rx="10" ry="10" 
            fill="url(#fat-grad)" stroke="#0f172a" stroke-width="5" stroke-linejoin="round" />
      <!-- Fat cell bubbles texture -->
      <g fill="#fef9c3" opacity="0.6">
        <circle cx="200" cy="${topY + 150}" r="14" />
        <circle cx="280" cy="${topY + 145}" r="16" />
        <circle cx="360" cy="${topY + 155}" r="15" />
        <circle cx="450" cy="${topY + 148}" r="16" />
        <circle cx="530" cy="${topY + 152}" r="14" />
        <circle cx="600" cy="${topY + 150}" r="13" />
      </g>

      <!-- Dermis Layer (Vascular salmon/rose middle bed) -->
      <rect x="150" y="${topY + 30}" width="500" height="95" 
            fill="url(#dermis-grad)" stroke="#0f172a" stroke-width="5" stroke-linejoin="round" />
      <!-- Stylized Dermal Capillary loops -->
      <g stroke="#991b1b" stroke-width="3" stroke-linecap="round" fill="none">
        <path d="M 220 ${topY + 120} Q 230 ${topY + 50} 240 ${topY + 120}" />
        <path d="M 320 ${topY + 120} Q 330 ${topY + 45} 340 ${topY + 120}" />
        <path d="M 460 ${topY + 120} Q 470 ${topY + 45} 480 ${topY + 120}" />
        <path d="M 560 ${topY + 120} Q 570 ${topY + 50} 580 ${topY + 120}" />
      </g>

      <!-- Epidermis Layer (Top surface peach band) -->
      <rect x="150" y="${topY}" width="500" height="35" rx="8" ry="8" 
            fill="url(#epidermis-grad)" stroke="#0f172a" stroke-width="5" stroke-linejoin="round" />
      
      <!-- Tissue Depth Labels on side -->
      <text x="100" y="${topY + 22}" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#fda4af">EPIDERMIS</text>
      <text x="110" y="${topY + 80}" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#f43f5e">DERMIS</text>
      <text x="90" y="${topY + 155}" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#facc15">SUBCUTIS</text>
    </g>
  `;
}

// ============================================================================
// 1. Variola Virus · Smallpox Umbilicated Pustule (ตุ่มหนองบุ๋มกลาง)
// ============================================================================
function renderVariolaPustuleSVG(isCutaway) {
  const topY = 300;
  return `
    ${renderSkinBlockBase(isCutaway, topY)}

    <!-- Erythematous Inflammatory Halo spreading on skin -->
    <g data-part-id="erythema_halo" class="interactive-part">
      <ellipse cx="400" cy="${topY + 2}" rx="180" ry="24" fill="#ef4444" opacity="0.65" />
    </g>

    ${!isCutaway ? `
      <!-- Clinical Surface View: Tense Pustule with Central Umbilication Dimple -->
      <g data-part-id="epidermal_roof" class="interactive-part">
        <!-- Tense High Dome -->
        <path d="M 290 ${topY + 5} 
                 C 290 220 340 180 400 195 
                 C 460 180 510 220 510 ${topY + 5} Z" 
              fill="url(#pustule-roof-grad)" stroke="#0f172a" stroke-width="6" stroke-linejoin="round" />
        
        <!-- Pustule Highlighting -->
        <path d="M 320 230 Q 350 205 380 205" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round" fill="none" opacity="0.8" />
      </g>

      <!-- Central Umbilication (Inverted Necrotic Dimple) -->
      <g data-part-id="umbilication" class="interactive-part">
        <ellipse cx="400" cy="195" rx="34" ry="16" fill="#881337" stroke="#0f172a" stroke-width="4.5" />
        <ellipse cx="400" cy="195" rx="20" ry="9" fill="#4c0519" />
        <!-- Callout pointer ring -->
        <circle cx="400" cy="195" r="42" fill="none" stroke="#facc15" stroke-width="2.5" stroke-dasharray="6 4" />
      </g>
    ` : `
      <!-- Cross-Section Cutaway: Sliced Open Revealing Deep Dermal Pus Cavity -->
      <!-- Left Half: Intact Pustule Shell -->
      <g data-part-id="epidermal_roof" class="interactive-part">
        <path d="M 400 195 C 340 180 290 220 290 ${topY + 5} L 400 ${topY + 5} Z" 
              fill="url(#pustule-roof-grad)" stroke="#0f172a" stroke-width="5" stroke-linejoin="round" />
      </g>

      <!-- Central Umbilicated Crater Seam -->
      <g data-part-id="umbilication" class="interactive-part">
        <path d="M 370 195 Q 400 215 400 230" stroke="#881337" stroke-width="6" stroke-linecap="round" fill="none" />
        <circle cx="395" cy="205" r="8" fill="#881337" stroke="#0f172a" stroke-width="3" />
      </g>

      <!-- Right Half Cutaway Chamber: Deep Pus Cavity in Dermis -->
      <g data-part-id="pus_cavity" class="interactive-part">
        <!-- Deep Cavity Boundary extending down into Dermis -->
        <path d="M 400 195 
                 C 470 190 510 230 510 ${topY + 5} 
                 L 490 ${topY + 70} 
                 C 460 ${topY + 90} 420 ${topY + 75} 400 ${topY + 70} Z" 
              fill="url(#pus-grad)" stroke="#0f172a" stroke-width="5.5" stroke-linejoin="round" />
        
        <!-- Multilocular fibrous septations -->
        <g stroke="#d97706" stroke-width="3" stroke-linecap="round" fill="none">
          <path d="M 430 220 Q 450 250 440 280" />
          <path d="M 465 240 Q 480 270 470 310" />
        </g>

        <!-- Guarnieri Inclusion Bodies (Eosinophilic pink/red dots in cytoplasm) -->
        <g fill="#be123c" stroke="#0f172a" stroke-width="1.5" filter="url(#neon-glow)">
          <circle cx="430" cy="${topY + 20}" r="6" />
          <circle cx="460" cy="${topY + 35}" r="7" />
          <circle cx="435" cy="${topY + 50}" r="5.5" />
          <circle cx="475" cy="${topY + 55}" r="6" />
        </g>
      </g>

      <!-- Cutaway Center Dashed Line -->
      <line x1="400" y1="185" x2="400" y2="${topY + 80}" stroke="#facc15" stroke-width="4" stroke-dasharray="6 4" />
      <text x="415" y="240" font-family="'Inter', sans-serif" font-size="11" font-weight="800" fill="#991b1b">DEEP PUS CORE</text>
    `}
  `;
}

// ============================================================================
// 2. Staphylococcus aureus · Honey-Colored Crusts (Impetigo) & Abscess
// ============================================================================
function renderStaphCrustsSVG(isCutaway) {
  const topY = 300;
  return `
    ${renderSkinBlockBase(isCutaway, topY)}

    <!-- Cellulitic Erythematous Swelling Nodule -->
    <path d="M 260 ${topY + 5} C 260 250 330 220 400 220 C 470 220 540 250 540 ${topY + 5} Z" 
          fill="#ec4899" opacity="0.8" stroke="#0f172a" stroke-width="5" stroke-linejoin="round" />

    <!-- Honey-Colored Golden Crust Flakes (สะเก็ดสีน้ำผึ้งบนผิว) -->
    <g data-part-id="honey_crust" class="interactive-part">
      <!-- Crystalline amber crust plates -->
      <polygon points="340,215 390,205 410,225 360,235" fill="url(#honey-crust-grad)" stroke="#0f172a" stroke-width="4" />
      <polygon points="415,210 470,215 455,240 405,230" fill="url(#honey-crust-grad)" stroke="#0f172a" stroke-width="4" />
      <polygon points="310,230 350,225 345,245 305,245" fill="url(#honey-crust-grad)" stroke="#0f172a" stroke-width="3.5" />
      <polygon points="460,235 500,230 505,250 465,250" fill="url(#honey-crust-grad)" stroke="#0f172a" stroke-width="3.5" />
      <polygon points="370,230 430,225 425,250 365,250" fill="url(#honey-crust-grad)" stroke="#0f172a" stroke-width="4" />
    </g>

    ${!isCutaway ? `
      <!-- Tense Pus Pointing Head -->
      <circle cx="400" cy="225" r="14" fill="#fef08a" stroke="#0f172a" stroke-width="3.5" />
    ` : `
      <!-- Cross-Section Cutaway: Subcorneal Cleft & Coagulase Fibrin Abscess Wall -->
      <!-- Subcorneal Cleft (Desmoglein-1 Cleavage space) -->
      <g data-part-id="subcorneal_cleft" class="interactive-part">
        <path d="M 320 ${topY} Q 400 ${topY - 15} 480 ${topY}" fill="none" stroke="#fde047" stroke-width="8" stroke-linecap="round" />
        <path d="M 320 ${topY} Q 400 ${topY - 15} 480 ${topY}" fill="none" stroke="#0f172a" stroke-width="3" stroke-dasharray="6 4" />
      </g>

      <!-- Protective Fibrin Wall (Synthesized by Coagulase) -->
      <g data-part-id="fibrin_capsule" class="interactive-part">
        <circle cx="400" cy="${topY + 65}" r="55" fill="#8b5cf6" stroke="#0f172a" stroke-width="5" />
        <text x="365" y="${topY + 30}" font-family="'Inter', sans-serif" font-size="10" font-weight="800" fill="#ffffff">FIBRIN WALL</text>
      </g>

      <!-- Liquefied Pus Core inside Abscess -->
      <g data-part-id="abscess_pus_core" class="interactive-part">
        <circle cx="400" cy="${topY + 65}" r="42" fill="url(#pus-grad)" stroke="#0f172a" stroke-width="4" />
        
        <!-- S. aureus cocci clusters dots inside pus core -->
        <g fill="#7c3aed">
          <circle cx="390" cy="${topY + 60}" r="3.5" />
          <circle cx="396" cy="${topY + 58}" r="3.5" />
          <circle cx="393" cy="${topY + 65}" r="3.5" />
          <circle cx="410" cy="${topY + 70}" r="3.5" />
          <circle cx="415" cy="${topY + 66}" r="3.5" />
        </g>
      </g>
    `}
  `;
}

// ============================================================================
// 3. Bacillus anthracis · Anthrax Coal-Black Eschar (แผลสะเก็ดดำสนิท ไม่เจ็บ)
// ============================================================================
function renderAnthraxEscharSVG(isCutaway) {
  const topY = 280;
  return `
    ${renderSkinBlockBase(isCutaway, topY, 210)}

    <!-- Gelatinous Non-Pitting Edema Swelling in Dermis -->
    <g data-part-id="gelatinous_edema" class="interactive-part">
      <path d="M 180 ${topY + 10} C 180 200 620 200 620 ${topY + 10} Z" 
            fill="#fef08a" opacity="0.75" stroke="#facc15" stroke-width="5" stroke-linejoin="round" />
      <text x="200" y="220" font-family="'Inter', sans-serif" font-size="11" font-weight="800" fill="#b45309">GELATINOUS EDEMA (EF)</text>
    </g>

    <!-- Ring of Satellite Vesicles (วงตุ่มน้ำใสบริวาร) -->
    <g data-part-id="satellite_vesicles" class="interactive-part" fill="#38bdf8" stroke="#0f172a" stroke-width="3">
      <circle cx="310" cy="225" r="14" />
      <circle cx="340" cy="210" r="12" />
      <circle cx="400" cy="205" r="13" />
      <circle cx="460" cy="210" r="12" />
      <circle cx="490" cy="225" r="14" />
      <circle cx="505" cy="255" r="13" />
      <circle cx="485" cy="280" r="13" />
      <circle cx="315" cy="280" r="13" />
      <circle cx="295" cy="255" r="13" />
    </g>

    <!-- Coal-Black Sunken Necrotic Eschar Plate -->
    <g data-part-id="black_eschar" class="interactive-part">
      <ellipse cx="400" cy="250" rx="80" ry="38" fill="url(#coal-black-grad)" stroke="#0f172a" stroke-width="6" />
      <!-- Textured Coal Cracks -->
      <g stroke="#52525b" stroke-width="3" stroke-linecap="round" fill="none">
        <path d="M 350 250 L 390 245 L 430 255 L 460 245" />
        <path d="M 380 235 L 400 255 L 415 265" />
      </g>
      <text x="350" y="255" font-family="'Inter', sans-serif" font-size="12" font-weight="900" fill="#ffffff" letter-spacing="1">PAINLESS ESCHAR</text>
    </g>

    ${isCutaway ? `
      <!-- Cross-Section Cutaway: Coagulative Dermal Thrombosis & Necrosis -->
      <g data-part-id="necrotic_dermis" class="interactive-part">
        <path d="M 350 ${topY + 30} L 450 ${topY + 30} L 420 ${topY + 110} L 380 ${topY + 110} Z" 
              fill="#78716c" stroke="#0f172a" stroke-width="5" />
        <!-- Thrombosed necrotic blood vessels -->
        <g stroke="#18181b" stroke-width="5" stroke-linecap="round">
          <line x1="390" y1="${topY + 45}" x2="410" y2="${topY + 95}" />
          <line x1="410" y1="${topY + 45}" x2="390" y2="${topY + 95}" />
        </g>
      </g>
    ` : ''}
  `;
}

// ============================================================================
// 4. Treponema pallidum · Primary Syphilis Hard Chancre (แผลริมแข็ง ก้นสะอาด)
// ============================================================================
function renderSyphilisChancreSVG(isCutaway) {
  const topY = 300;
  return `
    ${renderSkinBlockBase(isCutaway, topY)}

    <!-- Punched-Out Crater Basin -->
    <g data-part-id="indurated_rim" class="interactive-part">
      <!-- Elevated Indurated Cartilaginous Border (Rolled rim) -->
      <ellipse cx="400" cy="${topY}" rx="120" ry="45" fill="#0284c7" stroke="#0f172a" stroke-width="6" />
      <text x="330" y="${topY - 30}" font-family="'Inter', sans-serif" font-size="11" font-weight="800" fill="#38bdf8">INDURATED RIM (CARTILAGINOUS)</text>
    </g>

    <!-- Clean Granulating Ulcer Bed (Glistening red-pink, NO purulent slough) -->
    <g data-part-id="clean_ulcer_base" class="interactive-part">
      <ellipse cx="400" cy="${topY + 5}" rx="85" ry="30" fill="url(#chancre-base-grad)" stroke="#0f172a" stroke-width="4.5" />
      <!-- Glistening serous sheen highlight -->
      <ellipse cx="380" cy="${topY}" rx="55" ry="15" fill="#fecdd3" opacity="0.65" />
      <text x="355" y="${topY + 9}" font-family="'Inter', sans-serif" font-size="11" font-weight="900" fill="#ffffff">CLEAN BASE (NO PUS)</text>
    </g>

    ${isCutaway ? `
      <!-- Cross-Section Cutaway: Endarteritis Obliterans & Plasma Cells -->
      <g data-part-id="endarteritis_vessels" class="interactive-part">
        <!-- Thickened Arteriole with choked lumen -->
        <circle cx="340" cy="${topY + 70}" r="25" fill="#9333ea" stroke="#0f172a" stroke-width="4" />
        <circle cx="340" cy="${topY + 70}" r="8" fill="#dc2626" stroke="#0f172a" stroke-width="2" />
        
        <circle cx="460" cy="${topY + 70}" r="25" fill="#9333ea" stroke="#0f172a" stroke-width="4" />
        <circle cx="460" cy="${topY + 70}" r="8" fill="#dc2626" stroke="#0f172a" stroke-width="2" />
      </g>

      <!-- Plasma Cell Infiltrates -->
      <g data-part-id="plasma_cells" class="interactive-part" fill="#a855f7" stroke="#0f172a" stroke-width="1.5">
        <circle cx="320" cy="${topY + 55}" r="6" />
        <circle cx="360" cy="${topY + 55}" r="6" />
        <circle cx="330" cy="${topY + 95}" r="6" />
        <circle cx="440" cy="${topY + 55}" r="6" />
        <circle cx="480" cy="${topY + 55}" r="6" />
        <circle cx="470" cy="${topY + 95}" r="6" />
      </g>
      <text x="350" y="${topY + 115}" font-family="'Inter', sans-serif" font-size="10" font-weight="800" fill="#a855f7">ENDARTERITIS + PLASMA CELLS</text>
    ` : ''}
  `;
}

// ============================================================================
// 5. Varicella-Zoster Virus · "Dew Drops on a Rose Petal" (ตุ่มน้ำใสบนฐานแดง)
// ============================================================================
function renderHerpesDewDropSVG(isCutaway) {
  const topY = 310;
  return `
    ${renderSkinBlockBase(isCutaway, topY)}

    <!-- Rose-Petal Erythematous Macular Base (ฐานแดงกลีบกุหลาบ) -->
    <g data-part-id="erythematous_base" class="interactive-part">
      <ellipse cx="400" cy="${topY}" rx="145" ry="32" fill="#f43f5e" opacity="0.9" stroke="#0f172a" stroke-width="5" />
      <text x="320" y="${topY + 20}" font-family="'Inter', sans-serif" font-size="11" font-weight="800" fill="#ffffff">ROSE-PETAL BASE</text>
    </g>

    <!-- Crystal-Clear Dew-Drop Vesicle (ตุ่มน้ำใสรูปหยดน้ำ) -->
    <g data-part-id="clear_vesicle" class="interactive-part">
      <!-- Water Droplet Silhouette -->
      <path d="M 400 160 
               C 460 220 480 270 470 305 
               C 460 315 340 315 330 305 
               C 320 270 340 220 400 160 Z" 
            fill="#38bdf8" opacity="0.82" stroke="#0f172a" stroke-width="6" stroke-linejoin="round" />
      
      <!-- Glistening Teardrop Curved Highlight -->
      <path d="M 360 240 Q 370 200 395 180" stroke="#ffffff" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.9" />
      <circle cx="360" cy="260" r="5" fill="#ffffff" opacity="0.9" />
    </g>

    ${isCutaway ? `
      <!-- Cross-Section Cutaway: Acantholysis & Multinucleated Giant Cells -->
      <g data-part-id="ballooning_cells" class="interactive-part" fill="#a7f3d0" stroke="#0f172a" stroke-width="2">
        <!-- Floating Acantholytic Keratinocytes -->
        <circle cx="380" cy="265" r="9" />
        <circle cx="420" cy="255" r="8" />
        <circle cx="400" cy="285" r="9" />
      </g>

      <!-- Multinucleated Giant Cells (Tzanck Smear Positive) -->
      <g data-part-id="giant_cells" class="interactive-part">
        <ellipse cx="400" cy="${topY - 10}" rx="28" ry="14" fill="#8b5cf6" stroke="#0f172a" stroke-width="3.5" />
        <!-- Molded nuclei inside -->
        <circle cx="390" cy="${topY - 10}" r="4.5" fill="#4c1d95" />
        <circle cx="400" cy="${topY - 10}" r="4.5" fill="#4c1d95" />
        <circle cx="410" cy="${topY - 10}" r="4.5" fill="#4c1d95" />
      </g>
      <text x="325" y="225" font-family="'Inter', sans-serif" font-size="10" font-weight="800" fill="#0284c7">TZANCK GIANT CELLS</text>
    ` : ''}
  `;
}

// ============================================================================
// 6. Borrelia burgdorferi · Erythema Migrans (Bull's Eye Rash / ผื่นเป้าตาวัว)
// ============================================================================
function renderLymeBullsEyeSVG(isCutaway) {
  return `
    <!-- Top-Down Dermatological View of Bull's-Eye Target Rash -->
    <!-- Skin canvas background circle -->
    <circle cx="400" cy="270" r="230" fill="url(#epidermis-grad)" stroke="#0f172a" stroke-width="6" />

    <!-- Outer Expanding Annular Red Border (ขอบแดงวงขยาย > 5 cm) -->
    <g data-part-id="expanding_border" class="interactive-part">
      <circle cx="400" cy="270" r="195" fill="none" stroke="#ef4444" stroke-width="38" opacity="0.9" />
      <circle cx="400" cy="270" r="214" fill="none" stroke="#0f172a" stroke-width="4.5" stroke-dasharray="8 6" />
      <text x="300" y="95" font-family="'Inter', sans-serif" font-size="12" font-weight="900" fill="#dc2626" letter-spacing="1">EXPANDING ANNULAR BORDER (> 5 CM)</text>
    </g>

    <!-- Intermediate Clearing Ring (วงใสระหว่างกลาง) -->
    <g data-part-id="clearing_zone" class="interactive-part">
      <circle cx="400" cy="270" r="140" fill="#fed7aa" opacity="0.95" stroke="#0f172a" stroke-width="3" stroke-dasharray="6 4" />
      <text x="330" y="160" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#9a3412">CLEARING ZONE</text>
    </g>

    <!-- Central Bite Papule / Punctum (ตุ่มแดงรอยกัดเห็บตรงกลาง) -->
    <g data-part-id="central_bite" class="interactive-part">
      <circle cx="400" cy="270" r="50" fill="#be123c" stroke="#0f172a" stroke-width="5" />
      <!-- Central bite puncture dot -->
      <circle cx="400" cy="270" r="8" fill="#450a0a" />
      <text x="350" y="275" font-family="'Inter', sans-serif" font-size="11" font-weight="900" fill="#ffffff">TICK BITE</text>
    </g>

    <!-- Cute Kurzgesagt Ixodes Tick crawling nearby -->
    <g class="kurzgesagt-tick" transform="translate(530, 290) rotate(25) scale(0.65)">
      <ellipse cx="0" cy="0" rx="20" ry="26" fill="#78350f" stroke="#0f172a" stroke-width="4" />
      <ellipse cx="0" cy="-24" rx="10" ry="8" fill="#451a03" stroke="#0f172a" stroke-width="3" />
      <!-- 8 legs -->
      <g stroke="#0f172a" stroke-width="4" stroke-linecap="round" fill="none">
        <path d="M -15 -10 L -35 -20" />
        <path d="M -18 0 L -40 0" />
        <path d="M -18 10 L -38 20" />
        <path d="M -12 20 L -30 35" />
        <path d="M 15 -10 L 35 -20" />
        <path d="M 18 0 L 40 0" />
        <path d="M 18 10 L 38 20" />
        <path d="M 12 20 L 30 35" />
      </g>
    </g>
  `;
}

// ============================================================================
// 7. Candida albicans · Oral Thrush (ฝ้าขาวขูดออกได้บนเยื่อบุสีแดงสด)
// ============================================================================
function renderCandidaThrushSVG(isCutaway) {
  const topY = 280;
  return `
    <!-- Oral Mucosal Tissue Base (Erythematous Tongue / Palate) -->
    <g data-part-id="erythematous_mucosa" class="interactive-part">
      <rect x="160" y="${topY}" width="480" height="180" rx="20" ry="20" 
            fill="#f43f5e" stroke="#0f172a" stroke-width="6" stroke-linejoin="round" />
      <!-- Raw bleeding mucosal texture -->
      <path d="M 220 ${topY + 60} Q 320 ${topY + 30} 420 ${topY + 60} T 600 ${topY + 50}" 
            stroke="#9f1239" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.6" />
      <!-- Bleeding petechiae dots -->
      <circle cx="280" cy="${topY + 110}" r="5" fill="#881337" />
      <circle cx="450" cy="${topY + 120}" r="5" fill="#881337" />
      <text x="180" y="${topY + 160}" font-family="'Inter', sans-serif" font-size="11" font-weight="800" fill="#ffffff">RAW ERYTHEMATOUS BASE (BLEEDS ON SCRAPING)</text>
    </g>

    <!-- Thick White Curd-Like Pseudomembranous Plaques (ฝ้าขาวขูดออกได้) -->
    <g data-part-id="white_curds" class="interactive-part">
      <!-- Fluffy white curd patches (Cottage cheese appearance) -->
      <path d="M 240 ${topY + 30} 
               Q 270 ${topY} 310 ${topY + 20} 
               Q 350 ${topY - 10} 400 ${topY + 25} 
               Q 440 ${topY} 480 ${topY + 20} 
               Q 520 ${topY + 5} 550 ${topY + 35} 
               Q 530 ${topY + 80} 470 ${topY + 70} 
               Q 410 ${topY + 95} 350 ${topY + 75} 
               Q 280 ${topY + 85} 240 ${topY + 30} Z" 
            fill="#f8fafc" stroke="#0f172a" stroke-width="5.5" stroke-linejoin="round" />
      
      <!-- Curd texture crevices -->
      <g stroke="#cbd5e1" stroke-width="3" stroke-linecap="round" fill="none">
        <path d="M 300 ${topY + 35} Q 330 ${topY + 45} 360 ${topY + 30}" />
        <path d="M 410 ${topY + 35} Q 440 ${topY + 50} 480 ${topY + 40}" />
      </g>

      <text x="290" y="${topY + 55}" font-family="'Inter', sans-serif" font-size="12" font-weight="900" fill="#0f172a" letter-spacing="1">CURD-LIKE PLAQUES</text>
    </g>

    ${isCutaway ? `
      <!-- Cross-Section Cutaway: Showing Tongue Scraper Peeling White Curds -->
      <g class="tongue-blade-scraper">
        <!-- Wooden tongue depressor scraping curd -->
        <rect x="460" y="${topY - 60}" width="40" height="140" rx="6" ry="6" transform="rotate(25 460 280)" 
              fill="#fed7aa" stroke="#0f172a" stroke-width="4" />
        <text x="510" y="${topY - 20}" font-family="'Inter', sans-serif" font-size="11" font-weight="900" fill="#facc15">SCRAPES OFF!</text>
      </g>
    ` : ''}
  `;
}
