// ============================================================================
// Pathox-Micro · Frank H. Netter, M.D. Medical Atlas Plates
// References directly to:
// - Plate BP 1: Cross Section of Skin (Epidermis, Dermis, Hypodermis, Papillae)
// - Plate 70 & 71: Tongue & Fauces (Dorsum of Tongue, Circumvallate Papillae, Arch)
// - Plate 283: Mucosa & Musculature of Large Intestine (Haustra, Plicae, Taeniae Coli)
//
// Style Characteristics of Frank Netter:
// - Warm ivory parchment plate background (#fcfbf7 / #faf7f2) with classic double-line border
// - Rich gouache & watercolor wash layering (warm dermal hues, rich mucosal reds, adipose yellow)
// - Delicate anatomical pen-and-ink hatching lines indicating tissue grain and curvature
// - Thin medical leader lines with solid circular anchor dots & clean typography
// - Infectious pathology imagined directly into authentic Netter anatomical dissections
// ============================================================================

export function renderNetterPlate(microbe) {
  if (!microbe) return '';

  const id = microbe.id;
  let plateArt = '';
  let plateSubtitle = 'Section: Cutaneous & Infectious Pathology';
  let plateNumber = 'Plate BP 1-A';

  switch (id) {
    case 'variola-virus':
      plateNumber = 'Plate BP 1-A';
      plateSubtitle = 'Skin Cross Section: Smallpox Pustule with Central Umbilication';
      plateArt = renderVariolaNetterPlate();
      break;

    case 'staphylococcus-aureus':
      plateNumber = 'Plate BP 1-B';
      plateSubtitle = 'Epidermal Cleavage & Honey-Colored Crusts (Non-Bullous Impetigo)';
      plateArt = renderStaphNetterPlate();
      break;

    case 'bacillus-anthracis':
      plateNumber = 'Plate 430-A';
      plateSubtitle = 'Forearm Cutaneous Anthrax: Sunken Coal-Black Eschar & Edema';
      plateArt = renderAnthraxNetterPlate();
      break;

    case 'treponema-pallidum':
      plateNumber = 'Plate 364-A';
      plateSubtitle = 'Primary Syphilis: Solitary Hard Chancre with Indurated Margin';
      plateArt = renderSyphilisNetterPlate();
      break;

    case 'varicella-zoster':
      plateNumber = 'Plate 182-A';
      plateSubtitle = 'Cutaneous Varicella: "Dew Drop on a Rose Petal" & Pleomorphic Stages';
      plateArt = renderVZVNetterPlate();
      break;

    case 'borrelia-burgdorferi':
      plateNumber = 'Plate 472-A';
      plateSubtitle = 'Thigh Cutaneous Anatomy: Erythema Migrans Annular Target';
      plateArt = renderLymeNetterPlate();
      break;

    case 'candida-albicans':
      plateNumber = 'Plate 71-A';
      plateSubtitle = 'Oral Cavity & Dorsum of Tongue: Pseudomembranous Candidiasis';
      plateArt = renderCandidaNetterPlate();
      break;

    case 'clostridioides-difficile':
      plateNumber = 'Plate 283-A';
      plateSubtitle = 'Colonic Mucosa & Musculature: Pseudomembranous Colitis (Volcano Plaques)';
      plateArt = renderCdiffNetterPlate();
      break;

    case 'entamoeba-histolytica':
      plateNumber = 'Plate 283-B';
      plateSubtitle = 'Cecum & Colonic Wall Cross-Section: Flask-Shaped Amoebic Ulcer';
      plateArt = renderEntamoebaNetterPlate();
      break;

    default:
      plateArt = renderGenericNetterPlate(microbe);
  }

  return `
    <svg id="netter-plate-svg" class="netter-plate-svg" viewBox="0 0 960 620" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Netter Authentic Parchment Background Gradient -->
        <linearGradient id="netter-parchment-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fdfcf9" />
          <stop offset="50%" stop-color="#f8f5ee" />
          <stop offset="100%" stop-color="#f2ede2" />
        </linearGradient>

        <!-- Dermal & Epidermal Tones -->
        <linearGradient id="netter-epidermis-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#f2a893" />
          <stop offset="60%" stop-color="#e08e78" />
          <stop offset="100%" stop-color="#c6715b" />
        </linearGradient>

        <linearGradient id="netter-dermis-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#e27e72" />
          <stop offset="50%" stop-color="#c8564b" />
          <stop offset="100%" stop-color="#a43328" />
        </linearGradient>

        <radialGradient id="netter-pus-grad" cx="45%" cy="38%" r="65%">
          <stop offset="0%" stop-color="#fffeea" />
          <stop offset="45%" stop-color="#fef08a" />
          <stop offset="80%" stop-color="#eab308" />
          <stop offset="100%" stop-color="#b45309" />
        </radialGradient>

        <radialGradient id="netter-honey-grad" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#fef08a" />
          <stop offset="30%" stop-color="#f59e0b" />
          <stop offset="70%" stop-color="#d97706" />
          <stop offset="100%" stop-color="#78350f" />
        </radialGradient>

        <radialGradient id="netter-eschar-grad" cx="45%" cy="40%" r="65%">
          <stop offset="0%" stop-color="#52525b" />
          <stop offset="50%" stop-color="#27272a" />
          <stop offset="85%" stop-color="#18181b" />
          <stop offset="100%" stop-color="#09090b" />
        </radialGradient>

        <linearGradient id="netter-mucosa-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f43f5e" />
          <stop offset="55%" stop-color="#be123c" />
          <stop offset="100%" stop-color="#881337" />
        </linearGradient>

        <!-- Netter Soft Shadow -->
        <filter id="parchment-shadow" x="-3%" y="-3%" width="106%" height="106%">
          <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#000000" flood-opacity="0.6"/>
        </filter>
        <filter id="netter-part-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#0284c7" flood-opacity="0.9"/>
        </filter>
      </defs>

      <!-- ================================================================== -->
      <!-- THE NETTER PARCHMENT PLATE CONTAINER                               -->
      <!-- ================================================================== -->
      <g filter="url(#parchment-shadow)">
        <!-- Outer Plate Canvas (Warm Ivory Parchment) -->
        <rect x="8" y="8" width="944" height="604" rx="10" ry="10" fill="url(#netter-parchment-grad)" stroke="#1c1917" stroke-width="2" />
        
        <!-- Classic Netter Double Ink Border Lines -->
        <rect x="18" y="18" width="924" height="584" rx="6" ry="6" fill="none" stroke="#292524" stroke-width="1.2" />
        <rect x="22" y="22" width="916" height="576" rx="4" ry="4" fill="none" stroke="#78716c" stroke-width="0.8" />
      </g>

      <!-- ================================================================== -->
      <!-- PLATE HEADER (Netter Academic Plate Typography)                    -->
      <!-- ================================================================== -->
      <g transform="translate(38, 48)">
        <!-- Plate Number & Citation Header -->
        <text x="0" y="0" font-family="'Georgia', 'Times New Roman', serif" font-size="13" font-weight="700" fill="#78350f" letter-spacing="1">
          ${plateNumber}
        </text>
        <text x="0" y="22" font-family="'Georgia', 'Times New Roman', serif" font-size="22" font-weight="700" fill="#1c1917" letter-spacing="0.2">
          ${escapeXml(microbe.name)}
        </text>
        <text x="0" y="40" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" font-weight="600" fill="#57534e">
          ${escapeXml(plateSubtitle)} · ${escapeXml(microbe.scientificName)}
        </text>
      </g>

      <!-- ================================================================== -->
      <!-- PLATE MAIN MEDICAL ARTWORK                                         -->
      <!-- ================================================================== -->
      <g id="plate-art-content" transform="translate(0, 35)">
        ${plateArt}
      </g>

      <!-- ================================================================== -->
      <!-- PLATE FOOTER (Netter Medical Signature & High-Yield Label)         -->
      <!-- ================================================================== -->
      <g transform="translate(38, 582)">
        <text x="0" y="0" font-family="'Georgia', serif" font-size="11" font-style="italic" fill="#78716c">
          Reference: Netter Atlas of Human Anatomy · Clinical &amp; Infectious Microbiology High-Yield Plate
        </text>
        <text x="884" y="0" text-anchor="end" font-family="'Georgia', serif" font-size="12" font-weight="700" fill="#1c1917" letter-spacing="0.5">
          &copy; PATHOX-MICRO
        </text>
      </g>
    </svg>
  `;
}

// ----------------------------------------------------------------------------
// Helper: Draw Netter-Style Medical Leader Line with Solid Anchor Dot
// ----------------------------------------------------------------------------
function drawLeader(dotX, dotY, elbowX, elbowY, endX, endY, text, isLeft = false) {
  const estimatedWidth = (text || '').length * 6.8;
  
  // Guard against clipping left border (x < 38)
  if (isLeft && (endX - estimatedWidth < 38)) {
    isLeft = false;
    endX = Math.max(38, endX - 6);
  }
  
  // Guard against clipping right border (x > 922)
  if (!isLeft && (endX + estimatedWidth > 922)) {
    isLeft = true;
    endX = Math.min(922, endX + 6);
  }

  const textAnchor = isLeft ? 'end' : 'start';
  const textX = isLeft ? endX - 6 : endX + 6;

  return `
    <g class="netter-leader-line">
      <!-- Anchor Dot on Anatomical Tissue -->
      <circle cx="${dotX}" cy="${dotY}" r="3.5" fill="#1c1917" stroke="#ffffff" stroke-width="1.2" />
      
      <!-- Crisp Angled Leader Line -->
      <polyline points="${dotX},${dotY} ${elbowX},${elbowY} ${endX},${endY}" 
                fill="none" stroke="#1c1917" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
      
      <!-- Medical Label Text (Netter Typographic Style with Ivory Halo) -->
      <text x="${textX}" y="${endY + 3.5}" 
            text-anchor="${textAnchor}" 
            font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
            font-size="10.5" 
            font-weight="700" 
            fill="#1c1917" 
            paint-order="stroke fill" 
            stroke="#fdfcf9" 
            stroke-width="3" 
            stroke-linejoin="round" 
            letter-spacing="0.3">
        ${escapeXml(text)}
      </text>
    </g>
  `;
}

// ============================================================================
// 1. Variola Virus (Smallpox): Plate BP 1 Reference
// Skin & Subcutaneous Tissue Cross Section with Deep Umbilicated Pustule
// ============================================================================
function renderVariolaNetterPlate() {
  return `
    <g id="variola-netter-plate">
      <!-- ============================================== -->
      <!-- Realistic Skin Cross-Section Block             -->
      <!-- ============================================== -->
      <!-- Hypodermis / Subcutaneous Adipose Lobules (Base) -->
      <rect x="70" y="380" width="820" height="110" fill="#fef08a" opacity="0.3" />
      <!-- Netter Adipose Tissue Globules -->
      <g fill="#fde047" stroke="#ca8a04" stroke-width="1" opacity="0.45">
        <circle cx="120" cy="420" r="14" /><circle cx="145" cy="425" r="12" /><circle cx="170" cy="415" r="15" />
        <circle cx="210" cy="435" r="16" /><circle cx="240" cy="425" r="13" /><circle cx="720" cy="425" r="15" />
        <circle cx="750" cy="430" r="14" /><circle cx="780" cy="420" r="16" /><circle cx="815" cy="435" r="13" />
      </g>

      <!-- Reticular Dermis (Warm Dermal Flesh with Fine Collagen Hatching) -->
      <path d="M 70,210 L 890,210 L 890,395 L 70,395 Z" fill="url(#netter-dermis-grad)" stroke="#1c1917" stroke-width="1.6" />
      
      <!-- Fine Netter Dermal Hatching (Collagen Bundles) -->
      <g stroke="#7f1d1d" stroke-width="0.8" opacity="0.35">
        <line x1="90" y1="240" x2="190" y2="255" /><line x1="120" y1="290" x2="220" y2="305" />
        <line x1="100" y1="340" x2="210" y2="355" /><line x1="720" y1="240" x2="840" y2="260" />
        <line x1="750" y1="290" x2="860" y2="310" /><line x1="730" y1="340" x2="850" y2="360" />
      </g>

      <!-- Epidermis Layer with Stratum Corneum & Dermal Papillae Undulations -->
      <path d="M 70,175 C 180,175 280,175 320,175 C 360,110 600,110 640,175 C 680,175 780,175 890,175 L 890,212 L 70,212 Z" 
            fill="url(#netter-epidermis-grad)" stroke="#1c1917" stroke-width="1.8" />
      
      <!-- Stratum Corneum Keratinized Surface Layer -->
      <path d="M 70,175 C 180,175 280,175 320,175 C 360,110 600,110 640,175 C 680,175 780,175 890,175" 
            fill="none" stroke="#fed7aa" stroke-width="3" />

      <!-- Pronounced Dermal Hyperemia (Vasodilation around pustule) -->
      <ellipse cx="480" cy="285" rx="260" ry="130" fill="#dc2626" opacity="0.25" />

      <!-- ============================================== -->
      <!-- Interactive: Hard Shotty Pustule Dome          -->
      <!-- ============================================== -->
      <g class="interactive-part" data-part-id="shotty_dome" title="Hard Shotty Pustule Dome">
        <!-- Deep-Seated Multilocular Pustule in Dermis -->
        <path d="M 325,175 C 320,300 390,375 480,375 C 570,375 640,300 635,175 C 600,115 360,115 325,175 Z" 
              fill="url(#netter-pus-grad)" stroke="#1c1917" stroke-width="2.5" />
        
        <!-- Multilocular Fibrous Septa -->
        <path d="M 395,200 Q 425,290 415,355" stroke="#92400e" stroke-width="2" stroke-dasharray="4,2" fill="none" />
        <path d="M 565,200 Q 535,290 545,355" stroke="#92400e" stroke-width="2" stroke-dasharray="4,2" fill="none" />
        
        <!-- Dense Polymorphonuclear Leukocytes & Necrotic Debris -->
        <circle cx="420" cy="270" r="22" fill="#facc15" opacity="0.65" />
        <circle cx="540" cy="270" r="24" fill="#facc15" opacity="0.65" />
        <circle cx="480" cy="325" r="28" fill="#eab308" opacity="0.7" />
      </g>

      <!-- ============================================== -->
      <!-- Interactive: Central Umbilication              -->
      <!-- ============================================== -->
      <g class="interactive-part" data-part-id="umbilication" title="Central Umbilication">
        <!-- Hallmark Central Inverted Necrotic Dimple -->
        <path d="M 425,130 C 450,205 510,205 535,130 Q 480,150 425,130 Z" 
              fill="#881337" stroke="#450a0a" stroke-width="2.5" />
        
        <!-- Central Dermal Adnexal Tethering Strand -->
        <line x1="480" y1="185" x2="480" y2="365" stroke="#7f1d1d" stroke-width="2.5" stroke-dasharray="5,3" />
      </g>

      <!-- ============================================== -->
      <!-- Interactive: Guarnieri Inclusion Bodies Inset  -->
      <!-- ============================================== -->
      <g class="interactive-part" data-part-id="guarnieri_bodies" title="Guarnieri Inclusion Bodies">
        <g transform="translate(100, 260)">
          <!-- Inset Frame -->
          <rect x="0" y="0" width="180" height="85" rx="4" fill="#ffffff" stroke="#1c1917" stroke-width="1.5" />
          <circle cx="42" cy="42" r="28" fill="#fdf4ff" stroke="#a855f7" stroke-width="1.8" />
          <!-- Keratinocyte Nucleus -->
          <ellipse cx="26" cy="46" rx="9" ry="14" fill="#4c1d95" />
          <!-- Intracytoplasmic Eosinophilic Guarnieri Body -->
          <circle cx="48" cy="38" r="14" fill="#ec4899" stroke="#be185d" stroke-width="1" />
          <circle cx="52" cy="34" r="4" fill="#ffffff" opacity="0.8" />

          <text x="76" y="34" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="10.5" font-weight="800" fill="#86198f">Guarnieri Bodies</text>
          <text x="76" y="48" font-family="sans-serif" font-size="9" fill="#57534e">Intracytoplasmic</text>
          <text x="76" y="60" font-family="sans-serif" font-size="9" fill="#57534e">Eosinophilic Inclusions</text>
        </g>
      </g>

      <!-- ============================================== -->
      <!-- Netter-Style Anatomical Leader Lines           -->
      <!-- ============================================== -->
      ${drawLeader(480, 145, 480, 75, 290, 75, 'CENTRAL UMBILICATION (Dimple)', true)}
      ${drawLeader(570, 240, 680, 240, 730, 240, 'HARD SHOTTY PUSTULE DOME')}
      ${drawLeader(780, 175, 830, 150, 850, 150, 'STRATUM CORNEUM / EPIDERMIS')}
      ${drawLeader(780, 260, 830, 260, 850, 260, 'RETICULAR DERMIS (Deep-seated)')}
      ${drawLeader(780, 415, 830, 415, 850, 415, 'SUBCUTANEOUS ADIPOSE TISSUE')}

      <!-- High-Yield Synchrony Stamp -->
      <g transform="translate(340, 425)">
        <rect x="0" y="0" width="280" height="28" rx="4" fill="#1c1917" stroke="#ca8a04" stroke-width="1.5" />
        <text x="140" y="19" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11" font-weight="800" fill="#fde047">
          ALL LESIONS AT SAME STAGE • BB-PELLET
        </text>
      </g>
    </g>
  `;
}

// ============================================================================
// 2. Staphylococcus aureus: Plate BP 1 & Facial Skin Reference
// Honey-Colored Golden Crusts (Non-Bullous Impetigo) & Subcorneal Cleft
// ============================================================================
function renderStaphNetterPlate() {
  return `
    <g id="staph-netter-plate">
      <!-- Dermis Block -->
      <rect x="80" y="240" width="800" height="220" fill="url(#netter-dermis-grad)" stroke="#1c1917" stroke-width="1.6" />
      
      <!-- Marked Perilesional Erythema -->
      <ellipse cx="480" cy="270" rx="320" ry="120" fill="#dc2626" opacity="0.3" />

      <!-- Stratum Spinosum / Viable Epidermis -->
      <rect x="80" y="180" width="800" height="60" fill="url(#netter-epidermis-grad)" stroke="#1c1917" stroke-width="1.5" />
      
      <!-- Interactive: Subcorneal Cleft (Exfoliative toxin Desmoglein-1) -->
      <g class="interactive-part" data-part-id="subcorneal_cleft" title="Subcorneal Cleavage">
        <path d="M 120,175 Q 480,160 840,175 L 840,195 Q 480,180 120,195 Z" 
              fill="#fef08a" opacity="0.55" stroke="#ca8a04" stroke-width="1.8" stroke-dasharray="4,2" />
      </g>

      <!-- ============================================== -->
      <!-- Interactive: Honey-Colored Golden Crust        -->
      <!-- ============================================== -->
      <g class="interactive-part" data-part-id="honey_crust" title="Honey-Colored Golden Crust">
        <!-- Undulating stuck-on dried amber crusts (Meliceric crusts) -->
        <path d="M 160,175 C 210,85 310,75 390,95 C 460,65 560,60 630,90 C 700,70 760,110 790,175 Q 480,165 160,175 Z" 
              fill="url(#netter-honey-grad)" stroke="#78350f" stroke-width="2.5" />
        
        <!-- Dried exudate fissures & amber highlights -->
        <path d="M 270,135 Q 310,105 370,125" stroke="#fef08a" stroke-width="2.5" fill="none" opacity="0.8" />
        <path d="M 440,110 Q 510,90 570,115" stroke="#fef08a" stroke-width="3" fill="none" opacity="0.8" />
        <path d="M 640,115 Q 690,100 730,130" stroke="#fef08a" stroke-width="2.5" fill="none" opacity="0.8" />

        <ellipse cx="310" cy="130" rx="25" ry="14" fill="#fbbf24" opacity="0.75" />
        <ellipse cx="480" cy="115" rx="38" ry="20" fill="#fde047" opacity="0.85" />
        <ellipse cx="640" cy="125" rx="30" ry="16" fill="#fbbf24" opacity="0.75" />
      </g>

      <!-- ============================================== -->
      <!-- Interactive: Coagulase Fibrin Barrier          -->
      <!-- ============================================== -->
      <g class="interactive-part" data-part-id="fibrin_capsule" title="Coagulase Fibrin Wall">
        <g transform="translate(100, 330)">
          <rect x="0" y="0" width="280" height="75" rx="4" fill="#ffffff" stroke="#7c3aed" stroke-width="1.6" />
          <rect x="15" y="20" width="30" height="35" rx="3" fill="#6d28d9" />
          <text x="30" y="42" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="900" fill="#ffffff">Fib</text>
          <text x="56" y="32" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11" font-weight="800" fill="#6d28d9">Coagulase Fibrin Barrier</text>
          <text x="56" y="48" font-family="sans-serif" font-size="9" fill="#57534e">Fibrin mesh shields abscess wall</text>
          <text x="56" y="62" font-family="sans-serif" font-size="9" fill="#78716c">Protects bacteria from neutrophil penetration</text>
        </g>
      </g>

      <!-- Bacterial Morphology Inset (Clusters of Gram-positive Cocci) -->
      <g transform="translate(680, 330)">
        <rect x="0" y="0" width="190" height="75" rx="4" fill="#ffffff" stroke="#1c1917" stroke-width="1.5" />
        <!-- Grape-like clusters -->
        <g fill="#6d28d9" stroke="#4c1d95" stroke-width="1">
          <circle cx="30" cy="28" r="6" /><circle cx="40" cy="25" r="6" /><circle cx="35" cy="35" r="6" />
          <circle cx="45" cy="33" r="6" /><circle cx="52" cy="27" r="6" /><circle cx="38" cy="44" r="6" />
        </g>
        <text x="70" y="32" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="10.5" font-weight="800" fill="#4c1d95">S. aureus (Cocci)</text>
        <text x="70" y="46" font-family="sans-serif" font-size="9" fill="#57534e">Gram (+) Grape-like Clusters</text>
        <text x="70" y="60" font-family="sans-serif" font-size="9" fill="#78716c">Catalase (+), Coagulase (+)</text>
      </g>

      <!-- Netter Leader Lines -->
      ${drawLeader(480, 85, 480, 45, 300, 45, 'HONEY-COLORED CRUSTS (Meliceric)', true)}
      ${drawLeader(740, 185, 800, 130, 830, 130, 'SUBCORNEAL CLEAVAGE (Desmoglein-1)')}
      ${drawLeader(780, 210, 830, 210, 850, 210, 'STRATUM SPINOSUM')}
      ${drawLeader(780, 280, 830, 280, 850, 280, 'DERMIS (Erythematous base)')}
    </g>
  `;
}

// ============================================================================
// 3. Bacillus anthracis: Plate 430 Forearm Reference
// Sunken Coal-Black Eschar, Satellite Vesicles, & Gelatinous Edema
// ============================================================================
function renderAnthraxNetterPlate() {
  return `
    <g id="anthrax-netter-plate">
      <!-- Forearm Skin Base -->
      <rect x="70" y="90" width="820" height="390" rx="12" fill="#b96a58" stroke="#1c1917" stroke-width="1.8" />
      
      <!-- Interactive: Gelatinous Non-Pitting Edema (EF) -->
      <g class="interactive-part" data-part-id="gelatinous_edema" title="Gelatinous Non-Pitting Edema">
        <!-- Pale, gelatinous non-pitting dermal swelling -->
        <ellipse cx="480" cy="285" rx="330" ry="165" fill="#fef08a" opacity="0.35" stroke="#ca8a04" stroke-width="2" stroke-dasharray="6,4" />
      </g>

      <!-- Interactive: Satellite Vesicle Ring -->
      <g class="interactive-part" data-part-id="satellite_vesicles" title="Satellite Vesicle Ring">
        <!-- Ring of clear fluid-filled blisters encircling the central eschar -->
        <g fill="#e0f2fe" stroke="#0284c7" stroke-width="2" opacity="0.9">
          <circle cx="340" cy="285" r="16" /><circle cx="355" cy="235" r="15" /><circle cx="395" cy="195" r="16" />
          <circle cx="450" cy="175" r="17" /><circle cx="510" cy="175" r="17" /><circle cx="565" cy="195" r="16" />
          <circle cx="605" cy="235" r="15" /><circle cx="620" cy="285" r="16" /><circle cx="605" cy="335" r="15" />
          <circle cx="565" cy="375" r="16" /><circle cx="510" cy="395" r="17" /><circle cx="450" cy="395" r="17" />
          <circle cx="395" cy="375" r="16" /><circle cx="355" cy="335" r="15" />
        </g>
        <!-- Specular glints -->
        <circle cx="453" cy="171" r="4.5" fill="#ffffff" /><circle cx="508" cy="171" r="4.5" fill="#ffffff" />
      </g>

      <!-- ============================================== -->
      <!-- Interactive: Coal-Black Sunken Eschar          -->
      <!-- ============================================== -->
      <g class="interactive-part" data-part-id="black_eschar" title="Coal-Black Sunken Eschar">
        <!-- Sunken necrotic black ulcer crater -->
        <ellipse cx="480" cy="285" rx="100" ry="75" fill="url(#netter-eschar-grad)" stroke="#09090b" stroke-width="3.5" />
        
        <!-- Fissured leathery necrotic plate texture -->
        <path d="M 420,275 Q 480,295 540,270" stroke="#71717a" stroke-width="2.5" fill="none" />
        <path d="M 445,250 Q 475,280 490,325" stroke="#71717a" stroke-width="2.5" fill="none" />
        <path d="M 515,245 Q 500,290 530,315" stroke="#71717a" stroke-width="2.5" fill="none" />
      </g>

      <!-- Netter Leader Lines -->
      ${drawLeader(480, 285, 480, 430, 310, 430, 'COAL-BLACK SUNKEN ESCHAR (Painless)', true)}
      ${drawLeader(580, 185, 680, 130, 710, 130, 'SATELLITE VESICLES (Clear fluid)')}
      ${drawLeader(230, 220, 160, 160, 120, 160, 'GELATINOUS NON-PITTING EDEMA (EF)', true)}

      <!-- Pathognomonic Stamp -->
      <g transform="translate(620, 420)">
        <rect x="0" y="0" width="260" height="28" rx="4" fill="#1c1917" stroke="#ca8a04" stroke-width="1.5" />
        <text x="130" y="19" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11" font-weight="800" fill="#fde047">
          PAINLESS ESCHAR • B. ANTHRACIS
        </text>
      </g>
    </g>
  `;
}

// ============================================================================
// 4. Treponema pallidum: Plate 364 External Genitalia Reference
// Primary Syphilis Hard Chancre (Hunterian Chancre with Induration)
// ============================================================================
function renderSyphilisNetterPlate() {
  return `
    <g id="syphilis-netter-plate">
      <!-- Cutaneous/Mucosal Tissue Block -->
      <rect x="70" y="90" width="820" height="390" rx="12" fill="#a44c4c" stroke="#1c1917" stroke-width="1.8" />
      
      <!-- Tissue Hyperemia -->
      <ellipse cx="480" cy="285" rx="360" ry="170" fill="#c06050" opacity="0.6" />

      <!-- Interactive: Indurated Elevated Margin (Cartilage firmness) -->
      <g class="interactive-part" data-part-id="indurated_rim" title="Indurated Elevated Margin">
        <!-- Elevated rolled border -->
        <ellipse cx="480" cy="285" rx="200" ry="130" fill="#0284c7" opacity="0.3" stroke="#0369a1" stroke-width="5" />
        <ellipse cx="480" cy="285" rx="170" ry="105" fill="#f43f5e" opacity="0.3" stroke="#0284c7" stroke-width="3" stroke-dasharray="6,3" />
      </g>

      <!-- ============================================== -->
      <!-- Interactive: Clean Granulating Ulcer Bed       -->
      <!-- ============================================== -->
      <g class="interactive-part" data-part-id="clean_ulcer_base" title="Clean Granulating Ulcer Bed">
        <!-- Clean, glistening pink-red crater (no pus) -->
        <ellipse cx="480" cy="285" rx="135" ry="85" fill="#e11d48" stroke="#9f1239" stroke-width="2.5" />
        
        <!-- Vascular loops / granulation buds -->
        <ellipse cx="450" cy="270" rx="35" ry="20" fill="#fb7185" opacity="0.65" />
        <ellipse cx="510" cy="300" rx="40" ry="22" fill="#fb7185" opacity="0.65" />
        <circle cx="480" cy="280" r="15" fill="#f43f5e" />
      </g>

      <!-- Interactive: Endarteritis Obliterans Microscopic Inset -->
      <g class="interactive-part" data-part-id="endarteritis_vessels" title="Endarteritis Obliterans">
        <g transform="translate(680, 310)">
          <rect x="0" y="0" width="190" height="85" rx="4" fill="#ffffff" stroke="#7c3aed" stroke-width="1.6" />
          <circle cx="35" cy="42" r="22" fill="#ede9fe" stroke="#6d28d9" stroke-width="2" />
          <circle cx="35" cy="42" r="8" fill="#581c87" />
          <circle cx="35" cy="42" r="3" fill="#ffffff" />
          <text x="68" y="34" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="10.5" font-weight="800" fill="#6d28d9">Endarteritis</text>
          <text x="68" y="48" font-family="sans-serif" font-size="9.5" fill="#1c1917">Obliterans</text>
          <text x="68" y="62" font-family="sans-serif" font-size="8.5" fill="#78716c">Plasma cell cuffing</text>
        </g>
      </g>

      <!-- Netter Leader Lines -->
      ${drawLeader(480, 285, 480, 430, 280, 430, 'CLEAN GRANULATING BASE (No pus)', true)}
      ${drawLeader(320, 230, 220, 160, 180, 160, 'INDURATED ROLLED BORDER (Cartilage-hard)', true)}
    </g>
  `;
}

// ============================================================================
// 5. Varicella-Zoster Virus: Plate 182 Chest Wall Skin Reference
// "Dew Drop on a Rose Petal" & Coexisting Pleomorphic Stages
// ============================================================================
function renderVZVNetterPlate() {
  return `
    <g id="vzv-netter-plate">
      <!-- Skin Base -->
      <rect x="70" y="90" width="820" height="390" rx="12" fill="#b86858" stroke="#1c1917" stroke-width="1.8" />

      <!-- Interactive: Rose-Petal Erythematous Base -->
      <g class="interactive-part" data-part-id="erythematous_base" title="Rose-Petal Erythematous Base">
        <!-- Bright, circumscribed erythematous rose-petal macule -->
        <ellipse cx="480" cy="285" rx="170" ry="110" fill="#f43f5e" opacity="0.65" stroke="#be123c" stroke-width="2.5" />
      </g>

      <!-- ============================================== -->
      <!-- Interactive: Crystal-Clear Dew-Drop Blister    -->
      <!-- ============================================== -->
      <g class="interactive-part" data-part-id="clear_vesicle" title="Crystal-Clear Dew-Drop Blister">
        <!-- Delicate, crystal-clear teardrop vesicle perched on the macule -->
        <path d="M 480,170 C 415,230 405,300 435,330 C 465,360 515,360 545,330 C 575,300 545,230 480,170 Z" 
              fill="#e0f2fe" opacity="0.88" stroke="#0284c7" stroke-width="2" />
        
        <!-- Surface tension light glints -->
        <path d="M 450,255 Q 430,295 455,320" stroke="#ffffff" stroke-width="4" stroke-linecap="round" fill="none" />
        <circle cx="510" cy="265" r="6" fill="#ffffff" />
      </g>

      <!-- Multi-Stage Progression Inset (Pleomorphism: Macule -> Papule -> Vesicle -> Crust) -->
      <g transform="translate(680, 230)">
        <rect x="0" y="0" width="190" height="150" rx="4" fill="#ffffff" stroke="#1c1917" stroke-width="1.5" />
        <text x="95" y="24" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="10.5" font-weight="800" fill="#1c1917">
          PLEOMORPHIC STAGES
        </text>
        <circle cx="35" cy="50" r="10" fill="#f43f5e" />
        <text x="55" y="54" font-family="sans-serif" font-size="9.5" fill="#1c1917">1. Macule</text>
        <circle cx="35" cy="78" r="10" fill="#fb923c" />
        <text x="55" y="82" font-family="sans-serif" font-size="9.5" fill="#1c1917">2. Papule</text>
        <circle cx="35" cy="106" r="10" fill="#38bdf8" />
        <text x="55" y="110" font-family="sans-serif" font-size="9.5" fill="#1c1917">3. Clear Vesicle</text>
        <circle cx="35" cy="132" r="8" fill="#78350f" stroke="#a16207" />
        <text x="55" y="136" font-family="sans-serif" font-size="9.5" fill="#1c1917">4. Crusted Scab</text>
      </g>

      <!-- Netter Leader Lines -->
      ${drawLeader(480, 170, 480, 85, 300, 85, 'DEW DROP ON A ROSE PETAL (VZV)', true)}
      ${drawLeader(330, 245, 230, 170, 180, 170, 'ERYTHEMATOUS MACULAR BASE', true)}
    </g>
  `;
}

// ============================================================================
// 6. Borrelia burgdorferi: Plate 472 Thigh Reference
// Erythema Migrans Annular Bull's-Eye Target Rash (>5cm)
// ============================================================================
function renderLymeNetterPlate() {
  return `
    <g id="lyme-netter-plate">
      <!-- Thigh Skin Base -->
      <rect x="70" y="90" width="820" height="390" rx="12" fill="#af6252" stroke="#1c1917" stroke-width="1.8" />

      <!-- Interactive: Expanding Annular Red Border (>5cm) -->
      <g class="interactive-part" data-part-id="expanding_border" title="Expanding Annular Red Border">
        <circle cx="480" cy="285" r="160" fill="#fee2e2" opacity="0.4" stroke="#ef4444" stroke-width="12" />
      </g>

      <!-- Interactive: Intermediate Clearing Ring -->
      <g class="interactive-part" data-part-id="clearing_zone" title="Intermediate Clearing Ring">
        <circle cx="480" cy="285" r="105" fill="#af6252" stroke="#fca5a5" stroke-width="2" stroke-dasharray="6,3" />
      </g>

      <!-- Interactive: Central Bite Punctum / Papule -->
      <g class="interactive-part" data-part-id="central_bite" title="Central Punctum / Bite Papule">
        <circle cx="480" cy="285" r="38" fill="#b91c1c" stroke="#7f1d1d" stroke-width="2.5" />
        <circle cx="480" cy="285" r="10" fill="#450a0a" />
      </g>

      <!-- Netter Leader Lines -->
      ${drawLeader(480, 125, 480, 65, 300, 65, 'EXPANDING ANNULAR BORDER (> 5 CM)', true)}
      ${drawLeader(560, 230, 670, 180, 710, 180, 'INTERMEDIATE CLEARING RING')}
      ${drawLeader(480, 285, 480, 435, 320, 435, 'CENTRAL TICK BITE PUNCTUM (Ixodes)', true)}
    </g>
  `;
}

// ============================================================================
// 7. Candida albicans: Plate 70 & 71 Reference
// Dorsum of Tongue & Fauces with White Curd Pseudomembranes (Oral Thrush)
// ============================================================================
function renderCandidaNetterPlate() {
  return `
    <g id="candida-netter-plate">
      <!-- Oral Cavity Arch (Plate 71 Fauces reference) -->
      <path d="M 200,110 Q 480,70 760,110 L 780,480 Q 480,510 180,480 Z" fill="#581c2d" stroke="#1c1917" stroke-width="2.5" />
      
      <!-- Hard & Soft Palate with Palatine Rugae -->
      <path d="M 220,120 Q 480,170 740,120 L 730,165 Q 480,205 230,165 Z" fill="#9f1239" opacity="0.8" />
      <path d="M 320,140 Q 480,165 640,140" stroke="#f43f5e" stroke-width="2" fill="none" opacity="0.6" />

      <!-- Uvula (ลิ้นไก่) -->
      <path d="M 470,165 C 470,215 490,215 490,165 Z" fill="#e11d48" stroke="#881337" stroke-width="1.5" />

      <!-- Palatoglossal Arch & Palatine Tonsils (Plate 71) -->
      <ellipse cx="270" cy="220" rx="20" ry="35" fill="#881337" />
      <ellipse cx="690" cy="220" rx="20" ry="35" fill="#881337" />

      <!-- Dorsum of Tongue (Anatomy of Plate 70 & 71: Terminal Sulcus & Papillae) -->
      <path d="M 230,270 C 230,450 320,490 480,490 C 640,490 730,450 730,270 Q 480,300 230,270 Z" 
            fill="#e11d48" stroke="#881337" stroke-width="3" />

      <!-- V-shaped Sulcus Terminalis & Circumvallate Papillae (Plate 70) -->
      <path d="M 330,285 L 480,310 L 630,285" stroke="#9f1239" stroke-width="2" fill="none" opacity="0.7" />
      <circle cx="360" cy="290" r="4.5" fill="#9f1239" /><circle cx="400" cy="298" r="4.5" fill="#9f1239" />
      <circle cx="440" cy="304" r="5" fill="#9f1239" /><circle cx="480" cy="310" r="5.5" fill="#9f1239" />
      <circle cx="520" cy="304" r="5" fill="#9f1239" /><circle cx="560" cy="298" r="4.5" fill="#9f1239" />
      <circle cx="600" cy="290" r="4.5" fill="#9f1239" />

      <!-- Interactive: Underlying Erythematous Mucosa (Where scraped off!) -->
      <g class="interactive-part" data-part-id="erythematous_mucosa" title="Underlying Erythematous Mucosa">
        <!-- Raw bleeding exposed base on right half of tongue -->
        <path d="M 470,320 Q 600,310 630,410 Q 520,440 470,320 Z" fill="#991b1b" stroke="#7f1d1d" stroke-width="2.5" />
        <circle cx="520" cy="360" r="4" fill="#ef4444" /><circle cx="560" cy="380" r="4.5" fill="#ef4444" />
        <circle cx="585" cy="350" r="3.5" fill="#ef4444" /><circle cx="535" cy="405" r="4" fill="#ef4444" />
      </g>

      <!-- Interactive: White Curd Pseudomembranous Plaques (Cottage cheese) -->
      <g class="interactive-part" data-part-id="white_curds" title="White Curd-like Pseudomembranous Plaques">
        <ellipse cx="330" cy="350" rx="60" ry="35" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" />
        <ellipse cx="380" cy="410" rx="50" ry="30" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" />
        <ellipse cx="430" cy="360" rx="40" ry="25" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" />
        <ellipse cx="310" cy="420" rx="35" ry="22" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" />

        <circle cx="340" cy="345" r="14" fill="#f8fafc" />
        <circle cx="375" cy="405" r="16" fill="#f8fafc" />
        <circle cx="420" cy="355" r="12" fill="#f8fafc" />
      </g>

      <!-- Wooden Tongue Depressor Spatula -->
      <g transform="translate(530, 270) rotate(-30)">
        <rect x="0" y="0" width="220" height="26" rx="13" fill="#d97706" stroke="#78350f" stroke-width="2" />
        <text x="110" y="17" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="10" font-weight="700" fill="#ffffff">
          TONGUE DEPRESSOR (ขูดฝ้าขาว)
        </text>
      </g>

      <!-- Netter Leader Lines -->
      ${drawLeader(330, 350, 200, 350, 160, 350, 'WHITE CURD PLAQUES (Cottage cheese)', true)}
      ${drawLeader(560, 380, 680, 380, 720, 380, 'RAW BLEEDING BASE (Scrapes off!)')}
      ${drawLeader(480, 310, 480, 250, 320, 250, 'CIRCUMVALLATE PAPILLAE (Plate 70)', true)}
      ${drawLeader(480, 175, 480, 130, 340, 130, 'UVULA & PALATE', true)}
    </g>
  `;
}

// ============================================================================
// 8. Clostridioides difficile: Plate 283 Reference
// Mucosa & Musculature of Large Intestine with Volcano-Like Pseudomembranes
// ============================================================================
function renderCdiffNetterPlate() {
  return `
    <g id="cdiff-netter-plate">
      <!-- Colonic Lumen View based on Netter Plate 283 -->
      <rect x="60" y="90" width="840" height="390" rx="14" fill="#450a0a" stroke="#1c1917" stroke-width="2" />
      
      <!-- Interactive: Hyperemic Fragile Colonic Mucosa -->
      <g class="interactive-part" data-part-id="erythematous_colonic_mucosa" title="Hyperemic Fragile Colonic Mucosa">
        <!-- Haustra & Semilunar Folds (Plicae semilunares coli - Plate 283) -->
        <path d="M 60,180 Q 480,240 900,180" stroke="#991b1b" stroke-width="24" fill="none" opacity="0.75" />
        <path d="M 60,320 Q 480,380 900,320" stroke="#991b1b" stroke-width="26" fill="none" opacity="0.75" />
        <path d="M 60,430 Q 480,480 900,430" stroke="#991b1b" stroke-width="20" fill="none" opacity="0.75" />
      </g>

      <!-- Interactive: Eruptive Pseudomembrane Plaques (Volcano Plaques) -->
      <g class="interactive-part" data-part-id="pseudomembrane_plaque" title="Eruptive Pseudomembrane Plaque">
        <!-- Classic Volcano Plaques (Yellow-white raised mounds) -->
        <!-- Center Giant Plaque -->
        <ellipse cx="480" cy="260" rx="85" ry="48" fill="#fef08a" stroke="#ca8a04" stroke-width="3" />
        <ellipse cx="480" cy="260" rx="45" ry="24" fill="#fef9c3" />
        <circle cx="480" cy="260" r="14" fill="#eab308" />

        <!-- Surrounding Multiple Satellite Volcano Plaques -->
        <ellipse cx="250" cy="220" rx="55" ry="32" fill="#fef08a" stroke="#ca8a04" stroke-width="2.5" />
        <circle cx="250" cy="220" r="10" fill="#eab308" />

        <ellipse cx="710" cy="230" rx="65" ry="38" fill="#fef08a" stroke="#ca8a04" stroke-width="2.5" />
        <circle cx="710" cy="230" r="12" fill="#eab308" />

        <ellipse cx="340" cy="380" rx="60" ry="35" fill="#fef08a" stroke="#ca8a04" stroke-width="2.5" />
        <ellipse cx="620" cy="370" rx="65" ry="38" fill="#fef08a" stroke="#ca8a04" stroke-width="2.5" />
      </g>

      <!-- Interactive: Volcano Core Exudate Flow -->
      <g class="interactive-part" data-part-id="volcano_exudate_core" title="Volcano Core Exudate Flow">
        <line x1="710" y1="268" x2="770" y2="330" stroke="#ca8a04" stroke-width="2" />
        <circle cx="710" cy="268" r="4.5" fill="#ca8a04" />
      </g>

      <!-- Netter Leader Lines -->
      ${drawLeader(480, 212, 480, 70, 280, 70, 'VOLCANO-LIKE PSEUDOMEMBRANES', true)}
      ${drawLeader(200, 200, 160, 140, 100, 140, 'FRIABLE ERYTHEMATOUS COLON MUCOSA', true)}
      ${drawLeader(770, 330, 820, 330, 850, 330, 'Fibrin & Neutrophil Exudate (Erupting)')}
      ${drawLeader(600, 320, 700, 300, 730, 300, 'PLICAE SEMILUNARES (Haustra)')}
    </g>
  `;
}

// ============================================================================
// 9. Entamoeba histolytica: Plate 283 Colonic Wall Histology Reference
// Histological Cross-Section of Cecal Wall with Pathognomonic Flask-Shaped Ulcer
// ============================================================================
function renderEntamoebaNetterPlate() {
  return `
    <g id="entamoeba-netter-plate">
      <!-- Colonic Wall Layers (Plate 283 Histology) -->
      <!-- 1. Mucosa Layer (Columnar epithelium & Crypts of Lieberkuhn) -->
      <rect x="60" y="110" width="840" height="80" fill="url(#netter-mucosa-grad)" stroke="#1c1917" stroke-width="2" />
      
      <!-- Muscularis Mucosae Thin Boundary (Plate 283) -->
      <line x1="60" y1="190" x2="900" y2="190" stroke="#fda4af" stroke-width="4" />

      <!-- 2. Submucosa Layer (Loose connective tissue where amoeba excavates laterally) -->
      <rect x="60" y="192" width="840" height="200" fill="#fecdd3" stroke="#1c1917" stroke-width="2" />

      <!-- 3. Muscularis Propria (Inner circular & outer longitudinal muscle - Plate 283) -->
      <rect x="60" y="392" width="840" height="70" fill="#1e1b4b" stroke="#312e81" stroke-width="2" />

      <!-- ============================================== -->
      <!-- THE FLASK-SHAPED ULCER (แผลรูปขวดชมพู่)       -->
      <!-- ============================================== -->
      <!-- Interactive: Narrow Mucosal Neck -->
      <g class="interactive-part" data-part-id="flask_neck" title="Narrow Mucosal Neck">
        <!-- Narrow punctate breach through Mucosa -->
        <path d="M 440,110 L 440,190 L 520,190 L 520,110 Z" fill="#0f172a" />
      </g>

      <!-- Interactive: Broad Submucosal Necrotic Cavity -->
      <g class="interactive-part" data-part-id="flask_base" title="Broad Submucosal Necrotic Cavity">
        <!-- Expanding lateral flask cavity undermining mucosa -->
        <path d="M 440,190 C 320,205 240,240 240,300 C 240,360 340,380 480,380 C 620,380 720,360 720,300 C 720,240 640,205 520,190 Z" 
              fill="#0f172a" stroke="#991b1b" stroke-width="3.5" />
        
        <!-- Liquefactive necrosis & tissue debris in base -->
        <ellipse cx="480" cy="310" rx="190" ry="55" fill="#881337" opacity="0.65" />
      </g>

      <!-- Interactive: Trophozoites with Ingested RBCs (Erythrophagocytosis) -->
      <g class="interactive-part" data-part-id="trophozoite_rbc" title="Trophozoite with Ingested RBCs">
        <g transform="translate(300, 240)">
          <ellipse cx="40" cy="40" rx="42" ry="32" fill="#065f46" stroke="#34d399" stroke-width="2.5" />
          <circle cx="30" cy="35" r="9" fill="#047857" stroke="#a7f3d0" stroke-width="1.8" />
          <circle cx="30" cy="35" r="3" fill="#ffffff" />
          <!-- Ingested Red Blood Cells (Erythrophagocytosis) -->
          <circle cx="58" cy="30" r="7" fill="#ef4444" stroke="#7f1d1d" stroke-width="1.5" />
          <circle cx="50" cy="48" r="7" fill="#ef4444" stroke="#7f1d1d" stroke-width="1.5" />
          <circle cx="35" cy="52" r="6" fill="#ef4444" stroke="#7f1d1d" stroke-width="1.5" />
        </g>
      </g>

      <!-- Netter Leader Lines -->
      ${drawLeader(480, 110, 480, 60, 300, 60, 'NARROW MUCOSAL NECK (Pinhead entry)', true)}
      ${drawLeader(480, 360, 480, 430, 270, 430, 'BROAD SUBMUCOSAL CAVITY (Flask-shaped ulcer)', true)}
      ${drawLeader(350, 270, 420, 270, 470, 270, 'Trophozoite with ingested RBCs (Erythrophagocytosis)')}
      ${drawLeader(840, 150, 870, 150, 890, 150, 'MUCOSA')}
      ${drawLeader(840, 290, 870, 290, 890, 290, 'SUBMUCOSA')}
      ${drawLeader(840, 425, 870, 425, 890, 425, 'MUSCULARIS PROPRIA')}
    </g>
  `;
}

function renderGenericNetterPlate(microbe) {
  return `
    <g id="generic-netter-plate">
      <rect x="70" y="90" width="820" height="390" rx="10" fill="#f8f5ee" stroke="#1c1917" stroke-width="2" />
      <text x="480" y="280" text-anchor="middle" font-family="'Georgia', serif" font-size="20" font-weight="700" fill="#1c1917">
        ${escapeXml(microbe.name)}
      </text>
    </g>
  `;
}

function escapeXml(unsafe) {
  return String(unsafe || '').replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}
