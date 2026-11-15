// ============================================================================
// Pathox-Micro · Medical Anatomy & Clinical Lesion Visualizer
// 1. Cutaneous/Systemic Pathogens:
//    - Clean White Humanoid Mannequin (ตัวละครสีขาว) showing exact anatomical site & distribution
//    - High-Resolution Magnified Lesion Anatomy Box with cross-sections and clinical hallmarks
// 2. Gastrointestinal / Internal Organ Pathogens:
//    - Direct Organ View (โชว์รอยโรคบนอวัยวะโดยตรง: ลิ้น/ช่องปาก, ผนังลำไส้ใหญ่, แผลรูปขวดชมพู่)
// ============================================================================

export function renderLesionSVG(microbe) {
  if (!microbe) return '';

  const isOrgan = microbe.viewType === 'organ';
  let content = '';

  if (isOrgan) {
    if (microbe.id === 'candida-albicans') {
      content = renderCandidaOralCavity();
    } else if (microbe.id === 'clostridioides-difficile') {
      content = renderCdiffColitis();
    } else if (microbe.id === 'entamoeba-histolytica') {
      content = renderEntamoebaFlaskUlcer();
    } else {
      content = renderGenericOrgan(microbe);
    }
  } else {
    content = renderHumanoidWithMagnifiedLesion(microbe);
  }

  return `
    <svg id="medical-lesion-svg" class="medical-lesion-svg" viewBox="0 0 920 600" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Gradients -->
        <linearGradient id="body-white-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="60%" stop-color="#f8fafc" />
          <stop offset="100%" stop-color="#e2e8f0" />
        </linearGradient>

        <linearGradient id="panel-bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0f172a" stop-opacity="0.95" />
          <stop offset="100%" stop-color="#1e293b" stop-opacity="0.95" />
        </linearGradient>

        <linearGradient id="gold-honey-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fde047" />
          <stop offset="40%" stop-color="#f59e0b" />
          <stop offset="100%" stop-color="#b45309" />
        </linearGradient>

        <linearGradient id="black-eschar-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#27272a" />
          <stop offset="60%" stop-color="#18181b" />
          <stop offset="100%" stop-color="#09090b" />
        </linearGradient>

        <!-- Drop Shadows & Glow Filters -->
        <filter id="soft-panel-shadow" x="-5%" y="-5%" width="110%" height="110%">
          <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#000000" flood-opacity="0.55"/>
        </filter>
        <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#38bdf8" flood-opacity="0.8"/>
        </filter>
        <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#ef4444" flood-opacity="0.85"/>
        </filter>
      </defs>

      <!-- Main Content Stage -->
      ${content}
    </svg>
  `;
}

// ============================================================================
// DUAL-PANEL VIEW: White Humanoid Body (Left) + Magnified Lesion Anatomy (Right)
// ============================================================================
function renderHumanoidWithMagnifiedLesion(microbe) {
  const id = microbe.id;

  // Configuration per cutaneous pathogen
  let focusCoords = { x: 195, y: 155 }; // Default pointer on body
  let distributionLabel = 'Anatomical Lesion Location';
  let magnifiedContent = '';

  switch (id) {
    case 'variola-virus':
      focusCoords = { x: 130, y: 260 }; // Forearm / Hand
      distributionLabel = 'การกระจายตัว: Centrifugal (เด่นที่ใบหน้า แขน ขา ฝ่ามือฝ่าเท้า)';
      magnifiedContent = renderVariolaMagnified();
      break;

    case 'staphylococcus-aureus':
      focusCoords = { x: 195, y: 108 }; // Perioral face
      distributionLabel = 'ตำแหน่งรอยโรค: Perioral Facial Region (รอบปากและร่องจมูก)';
      magnifiedContent = renderStaphMagnified();
      break;

    case 'bacillus-anthracis':
      focusCoords = { x: 125, y: 275 }; // Forearm
      distributionLabel = 'ตำแหน่งรอยโรค: Exposed Skin of Forearm (ท่อนแขนด้านนอก)';
      magnifiedContent = renderAnthraxMagnified();
      break;

    case 'treponema-pallidum':
      focusCoords = { x: 195, y: 310 }; // Genital / Inguinal
      distributionLabel = 'ตำแหน่งรอยโรค: Genital / Inguinal Area (อวัยวะเพศภายนอกและขาหนีบ)';
      magnifiedContent = renderSyphilisMagnified();
      break;

    case 'varicella-zoster':
      focusCoords = { x: 195, y: 215 }; // Trunk / Chest
      distributionLabel = 'การกระจายตัว: Centripetal (หนาแน่นที่ลำตัวและหน้าอก ไม่ค่อยพบฝ่ามือฝ่าเท้า)';
      magnifiedContent = renderVZVMagnified();
      break;

    case 'borrelia-burgdorferi':
      focusCoords = { x: 170, y: 360 }; // Thigh / Inguinal
      distributionLabel = 'ตำแหน่งรอยโรค: Thigh & Inguinal Region (รอยเห็บกัดที่ต้นขา)';
      magnifiedContent = renderLymeMagnified();
      break;

    default:
      focusCoords = { x: 195, y: 200 };
      distributionLabel = 'ตำแหน่งรอยโรคทางคลินิก';
      magnifiedContent = `<text x="650" y="300" text-anchor="middle" fill="#94a3b8">Magnified Lesion Detail</text>`;
  }

  return `
    <g id="dual-panel-container">
      <!-- ============================================================== -->
      <!-- LEFT PANEL: Clean White Anatomical Mannequin (ตัวละครสีขาว)      -->
      <!-- ============================================================== -->
      <g id="body-map-panel" transform="translate(10, 15)">
        <!-- Panel Base Card -->
        <rect x="10" y="10" width="370" height="550" rx="16" fill="url(#panel-bg-grad)" stroke="#334155" stroke-width="1.5" filter="url(#soft-panel-shadow)" />

        <!-- Panel Header -->
        <g transform="translate(25, 38)">
          <circle cx="10" cy="0" r="7" fill="#38bdf8" />
          <text x="24" y="5" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#38bdf8" letter-spacing="0.5">
            ANATOMICAL DISTRIBUTION MAP (แผนที่ตำแหน่งรอยโรค)
          </text>
        </g>

        <!-- Subtitle: Specific distribution -->
        <text x="35" y="65" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="600" fill="#94a3b8">
          ${escapeXml(distributionLabel)}
        </text>

        <!-- The White Humanoid Figure (Center x ≈ 195, y ≈ 90 to 500) -->
        <g id="white-humanoid-body">
          ${renderWhiteHumanoidMannequin(id)}
        </g>

        <!-- Connecting Line from Body to Right Box -->
        <path d="M ${focusCoords.x},${focusCoords.y} Q ${focusCoords.x + 90},${focusCoords.y - 20} 380,${focusCoords.y}" 
              stroke="#38bdf8" stroke-width="2.5" stroke-dasharray="5,4" fill="none" />
        <circle cx="${focusCoords.x}" cy="${focusCoords.y}" r="8" fill="#38bdf8" fill-opacity="0.3" stroke="#38bdf8" stroke-width="2.5" />
        <circle cx="${focusCoords.x}" cy="${focusCoords.y}" r="3" fill="#ffffff" />
      </g>

      <!-- ============================================================== -->
      <!-- RIGHT PANEL: High-Yield Magnified Lesion Anatomy Box          -->
      <!-- ============================================================== -->
      <g id="magnified-lesion-panel" transform="translate(400, 15)">
        <!-- Panel Base Card -->
        <rect x="10" y="10" width="490" height="550" rx="16" fill="url(#panel-bg-grad)" stroke="#38bdf8" stroke-width="2" filter="url(#soft-panel-shadow)" />

        <!-- Panel Header Title -->
        <g transform="translate(30, 42)">
          <rect x="0" y="-12" width="12" height="12" rx="3" fill="#f43f5e" />
          <text x="20" y="0" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="800" fill="#ffffff" letter-spacing="0.4">
            ${escapeXml(microbe.lesionTitle || 'MAGNIFIED LESION ANATOMY')}
          </text>
        </g>
        <text x="30" y="66" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" font-weight="600" fill="#94a3b8">
          ${escapeXml(microbe.lesionThai || '')}
        </text>

        <!-- Magnified Anatomy Graphic -->
        <g id="magnified-graphic-content" transform="translate(20, 80)">
          ${magnifiedContent}
        </g>

        <!-- Bottom Guide Hint -->
        <g transform="translate(30, 532)">
          <rect x="0" y="0" width="450" height="22" rx="6" fill="#0f172a" stroke="#334155" stroke-width="1" />
          <text x="225" y="15" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10.5" font-weight="600" fill="#38bdf8">
            ✦ คลิกส่วนประกอบในภาพเพื่อเน้นข้อมูลและเปิดดูสรุปใน Medical Drawer
          </text>
        </g>
      </g>
    </g>
  `;
}

// ----------------------------------------------------------------------------
// White Stylized Anatomical Mannequin (ตัวละครสีขาว สัดส่วนกายวิภาคชัดเจน)
// ----------------------------------------------------------------------------
function renderWhiteHumanoidMannequin(pathogenId) {
  // Base Mannequin Geometry (Clean White Human Silhouette, Proportional)
  // Head at x=195, y=110, r=22
  // Torso x=175-215, y=140-270
  // Arms stretching slightly out
  // Legs down to y=490
  let rashMarkers = '';

  if (pathogenId === 'variola-virus') {
    // Centrifugal: Face, Forearms, Hands, Soles (High density on periphery)
    rashMarkers = `
      <!-- Face -->
      <circle cx="188" cy="105" r="3" fill="#dc2626" />
      <circle cx="202" cy="105" r="3" fill="#dc2626" />
      <circle cx="195" cy="115" r="3" fill="#dc2626" />
      <circle cx="190" cy="120" r="3" fill="#dc2626" />
      <!-- Forearms & Hands (Dense!) -->
      <circle cx="140" cy="240" r="3.5" fill="#dc2626" />
      <circle cx="132" cy="255" r="3.5" fill="#dc2626" />
      <circle cx="125" cy="270" r="4" fill="#dc2626" />
      <circle cx="120" cy="285" r="3.5" fill="#dc2626" />
      <circle cx="250" cy="240" r="3.5" fill="#dc2626" />
      <circle cx="258" cy="255" r="3.5" fill="#dc2626" />
      <circle cx="265" cy="270" r="4" fill="#dc2626" />
      <circle cx="270" cy="285" r="3.5" fill="#dc2626" />
      <!-- Lower Legs & Soles (Dense!) -->
      <circle cx="178" cy="420" r="3.5" fill="#dc2626" />
      <circle cx="175" cy="445" r="3.5" fill="#dc2626" />
      <circle cx="172" cy="470" r="4" fill="#dc2626" />
      <circle cx="212" cy="420" r="3.5" fill="#dc2626" />
      <circle cx="215" cy="445" r="3.5" fill="#dc2626" />
      <circle cx="218" cy="470" r="4" fill="#dc2626" />
      <!-- Sparse on trunk (Centrifugal contrast!) -->
      <circle cx="195" cy="180" r="2" fill="#ef4444" opacity="0.6" />
      <circle cx="190" cy="220" r="2" fill="#ef4444" opacity="0.6" />
    `;
  } else if (pathogenId === 'staphylococcus-aureus') {
    // Perioral facial crusts
    rashMarkers = `
      <!-- Highlighting circle on mouth/nose -->
      <circle cx="195" cy="118" r="14" fill="#f59e0b" fill-opacity="0.25" stroke="#f59e0b" stroke-width="2" stroke-dasharray="3,2" />
      <circle cx="190" cy="116" r="3" fill="#f59e0b" />
      <circle cx="200" cy="116" r="3" fill="#f59e0b" />
      <circle cx="195" cy="122" r="3.5" fill="#fbbf24" />
    `;
  } else if (pathogenId === 'bacillus-anthracis') {
    // Forearm black eschar
    rashMarkers = `
      <circle cx="128" cy="270" r="14" fill="#18181b" fill-opacity="0.3" stroke="#18181b" stroke-width="2" />
      <ellipse cx="128" cy="270" rx="6" ry="8" fill="#18181b" stroke="#38bdf8" stroke-width="1.5" />
      <circle cx="128" cy="270" r="18" fill="none" stroke="#ef4444" stroke-width="1" stroke-dasharray="4,3" />
    `;
  } else if (pathogenId === 'treponema-pallidum') {
    // Genital chancre
    rashMarkers = `
      <circle cx="195" cy="305" r="12" fill="#0284c7" fill-opacity="0.3" stroke="#0284c7" stroke-width="2" />
      <circle cx="195" cy="305" r="5" fill="#f43f5e" stroke="#0284c7" stroke-width="1.5" />
    `;
  } else if (pathogenId === 'varicella-zoster') {
    // Centripetal: Dense on Trunk & Chest, Sparing Distal Limbs
    rashMarkers = `
      <!-- Trunk & Chest (Very Dense!) -->
      <circle cx="185" cy="160" r="3" fill="#f43f5e" />
      <circle cx="205" cy="160" r="3" fill="#f43f5e" />
      <circle cx="195" cy="175" r="3.5" fill="#38bdf8" />
      <circle cx="180" cy="190" r="3" fill="#f43f5e" />
      <circle cx="210" cy="190" r="3" fill="#38bdf8" />
      <circle cx="195" cy="205" r="3.5" fill="#fbbf24" />
      <circle cx="185" cy="220" r="3" fill="#f43f5e" />
      <circle cx="205" cy="220" r="3" fill="#38bdf8" />
      <circle cx="195" cy="240" r="3" fill="#fbbf24" />
      <circle cx="180" cy="250" r="3" fill="#f43f5e" />
      <circle cx="210" cy="250" r="3" fill="#38bdf8" />
      <!-- Spares palms & soles -->
    `;
  } else if (pathogenId === 'borrelia-burgdorferi') {
    // Thigh tick bite with bullseye target
    rashMarkers = `
      <circle cx="178" cy="365" r="18" fill="#fee2e2" stroke="#ef4444" stroke-width="2.5" />
      <circle cx="178" cy="365" r="10" fill="#ffffff" stroke="#fca5a5" stroke-width="1.5" />
      <circle cx="178" cy="365" r="3.5" fill="#be123c" />
    `;
  }

  return `
    <g id="humanoid-mesh" filter="drop-shadow(0 8px 16px rgba(0,0,0,0.4))">
      <!-- Head -->
      <ellipse cx="195" cy="110" rx="22" ry="28" fill="url(#body-white-grad)" stroke="#334155" stroke-width="2" />
      
      <!-- Neck -->
      <path d="M 188,136 L 188,148 L 202,148 L 202,136 Z" fill="url(#body-white-grad)" stroke="#334155" stroke-width="2" />

      <!-- Torso (Chest, Abdomen, Pelvis) -->
      <path d="M 165,152 C 165,148 225,148 225,152 L 220,240 C 220,270 215,290 205,300 L 195,305 L 185,300 C 175,290 170,270 170,240 Z" 
            fill="url(#body-white-grad)" stroke="#334155" stroke-width="2" stroke-linejoin="round" />
      
      <!-- Clavicle line cues -->
      <path d="M 175,160 Q 195,165 215,160" stroke="#cbd5e1" stroke-width="1.5" fill="none" />
      <!-- Pectoral / Chest contours -->
      <path d="M 178,185 Q 195,190 212,185" stroke="#cbd5e1" stroke-width="1.2" fill="none" />

      <!-- Left Arm (Viewer's Left) -->
      <path d="M 165,155 C 150,180 135,215 132,245 C 130,265 125,280 120,290 C 117,295 124,298 127,294 C 132,284 138,265 140,245 C 145,215 155,185 168,168 Z" 
            fill="url(#body-white-grad)" stroke="#334155" stroke-width="2" />

      <!-- Right Arm (Viewer's Right) -->
      <path d="M 225,155 C 240,180 255,215 258,245 C 260,265 265,280 270,290 C 273,295 266,298 263,294 C 258,284 252,265 250,245 C 245,215 235,185 222,168 Z" 
            fill="url(#body-white-grad)" stroke="#334155" stroke-width="2" />

      <!-- Left Leg (Viewer's Left) -->
      <path d="M 175,295 C 172,330 170,370 172,410 C 173,440 170,470 168,495 L 180,495 C 183,470 186,440 186,410 C 186,370 188,330 192,298 Z" 
            fill="url(#body-white-grad)" stroke="#334155" stroke-width="2" />

      <!-- Right Leg (Viewer's Right) -->
      <path d="M 215,295 C 218,330 220,370 218,410 C 217,440 220,470 222,495 L 210,495 C 207,470 204,440 204,410 C 204,370 202,330 198,298 Z" 
            fill="url(#body-white-grad)" stroke="#334155" stroke-width="2" />

      <!-- Anatomical Ground Marker -->
      <ellipse cx="195" cy="505" rx="50" ry="8" fill="#0f172a" opacity="0.6" />

      <!-- Pathogen Specific Lesion Distribution Markers on the Body -->
      ${rashMarkers}
    </g>
  `;
}

// ============================================================================
// MAGNIFIED LESIONS (Right Panel Content)
// ============================================================================

// 1. Variola Virus (Smallpox): Cross-section of Dermis + Deep Umbilicated Pustule
function renderVariolaMagnified() {
  return `
    <g id="variola-magnified">
      <!-- Anatomical Skin Layers (Stratum corneum, Epidermis, Dermis) -->
      <rect x="20" y="40" width="410" height="340" rx="10" fill="#0b1329" stroke="#1e293b" stroke-width="1.5" />

      <!-- Layer 1: Epidermis Band -->
      <path d="M 20,120 C 120,120 180,120 225,120 C 270,120 330,120 430,120 L 430,70 L 20,70 Z" fill="#fca5a5" fill-opacity="0.4" />
      <text x="35" y="95" font-family="sans-serif" font-size="10" font-weight="700" fill="#f87171">EPIDERMIS (ผิวหนังชั้นกำพร้า)</text>

      <!-- Layer 2: Dermis Band (Deep-seated) -->
      <path d="M 20,120 L 430,120 L 430,370 L 20,370 Z" fill="#fee2e2" fill-opacity="0.1" />
      <text x="35" y="145" font-family="sans-serif" font-size="10" font-weight="700" fill="#fca5a5">RETICULAR DERMIS (ผิวหนังแท้ชั้นลึก - ฝังลึกเกิด Pockmark Scar)</text>

      <!-- Inflammatory Erythematous Halo Ring in Dermis -->
      <ellipse cx="225" cy="220" rx="150" ry="100" fill="#ef4444" fill-opacity="0.15" />

      <!-- Interactive: Hard Shotty Pustule Dome (Deep in Dermis) -->
      <g class="interactive-part" data-part-id="shotty_dome" title="Hard Shotty Pustule Dome">
        <!-- Dome Shape -->
        <path d="M 120,240 C 120,130 330,130 330,240 C 330,300 120,300 120,240 Z" 
              fill="#fef08a" stroke="#ca8a04" stroke-width="4" />
        
        <!-- Dense cellular debris & neutrophil infiltration -->
        <circle cx="160" cy="230" r="12" fill="#facc15" opacity="0.6" />
        <circle cx="290" cy="230" r="14" fill="#facc15" opacity="0.6" />
        <circle cx="225" cy="250" r="16" fill="#facc15" opacity="0.7" />

        <!-- High-Yield Callout Tag -->
        <rect x="250" y="275" width="165" height="24" rx="6" fill="#0f172a" stroke="#eab308" stroke-width="1.5" />
        <text x="332" y="291" text-anchor="middle" font-family="sans-serif" font-size="10.5" font-weight="800" fill="#fef08a">
          SHOTTY DOME (ตุ่มหนองแข็งลึก)
        </text>
      </g>

      <!-- Interactive: Central Umbilication (Bellybutton Dimple) -->
      <g class="interactive-part" data-part-id="umbilication" title="Central Umbilication">
        <!-- Deep Central Invagination / Tethering -->
        <path d="M 195,145 C 215,195 235,195 255,145 Q 225,160 195,145 Z" 
              fill="#dc2626" stroke="#991b1b" stroke-width="3" />
        
        <!-- Tethering dermal band pulling center downward -->
        <line x1="225" y1="185" x2="225" y2="280" stroke="#b91c1c" stroke-width="3" stroke-dasharray="4,2" />
        
        <!-- Callout Banner -->
        <rect x="135" y="15" width="180" height="26" rx="13" fill="#dc2626" />
        <text x="225" y="32" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="800" fill="#ffffff">
          CENTRAL UMBILICATION (รอยบุ๋มสะดือ)
        </text>
        <line x1="225" y1="41" x2="225" y2="150" stroke="#dc2626" stroke-width="2" />
        <polygon points="225,152 221,144 229,144" fill="#dc2626" />
      </g>

      <!-- Interactive: Guarnieri Inclusion Bodies in Dermis Keratinocytes -->
      <g class="interactive-part" data-part-id="guarnieri_bodies" title="Guarnieri Inclusion Bodies">
        <g transform="translate(60, 260)">
          <circle cx="20" cy="20" r="22" fill="#581c87" stroke="#c084fc" stroke-width="2" />
          <circle cx="20" cy="20" r="10" fill="#d8b4fe" />
          <circle cx="20" cy="20" r="4" fill="#3b0764" />
          <text x="50" y="24" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#d8b4fe">
            Guarnieri Inclusion Body
          </text>
        </g>
      </g>
    </g>
  `;
}

// 2. Staphylococcus aureus: Golden Honey-Colored Crusts (Impetigo)
function renderStaphMagnified() {
  return `
    <g id="staph-magnified">
      <rect x="20" y="30" width="410" height="360" rx="10" fill="#0b1329" stroke="#1e293b" stroke-width="1.5" />

      <!-- Epidermis layer with Subcorneal Cleft -->
      <path d="M 30,190 C 150,190 280,190 420,190 L 420,360 L 30,360 Z" fill="#fecdd3" fill-opacity="0.25" />
      <text x="40" y="220" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#fb7185">EPIDERMIS: Stratum Spinosum</text>

      <!-- Interactive: Subcorneal Cleft (Exfoliative Toxin Cleaves Desmoglein-1) -->
      <g class="interactive-part" data-part-id="subcorneal_cleft" title="Subcorneal Cleavage">
        <path d="M 40,150 Q 225,130 410,150 L 410,185 Q 225,170 40,185 Z" fill="#fef08a" fill-opacity="0.4" stroke="#eab308" stroke-width="2" stroke-dasharray="4,3" />
        <rect x="80" y="152" width="290" height="22" rx="4" fill="#0f172a" stroke="#ca8a04" stroke-width="1.5" />
        <text x="225" y="167" text-anchor="middle" font-family="sans-serif" font-size="10.5" font-weight="800" fill="#facc15">
          SUBCORNEAL CLEFT (รอยแยกใต้ชั้น Stratum Corneum)
        </text>
      </g>

      <!-- Interactive: Honey-Colored Golden Crust (Meliceric Crusts) -->
      <g class="interactive-part" data-part-id="honey_crust" title="Honey-Colored Golden Crust">
        <!-- Multilayered, bubbly, dried amber honey crusts on surface -->
        <path d="M 60,135 Q 90,85 140,95 Q 180,60 230,75 Q 290,55 340,85 Q 380,80 395,135 Q 350,145 225,140 Q 100,145 60,135 Z" 
              fill="url(#gold-honey-grad)" stroke="#78350f" stroke-width="3.5" />
        
        <!-- Texture: dried serum droplets and cracks -->
        <ellipse cx="140" cy="105" rx="20" ry="12" fill="#fef08a" opacity="0.6" />
        <ellipse cx="230" cy="95" rx="30" ry="16" fill="#fde047" opacity="0.5" />
        <ellipse cx="320" cy="105" rx="25" ry="14" fill="#fef08a" opacity="0.6" />

        <!-- Amber Honey Drips -->
        <path d="M 120,135 C 115,160 135,160 130,135" fill="#f59e0b" stroke="#92400e" stroke-width="2" />
        <path d="M 280,135 C 275,165 295,165 290,135" fill="#f59e0b" stroke="#92400e" stroke-width="2" />

        <!-- Title Banner -->
        <rect x="90" y="15" width="270" height="28" rx="14" fill="#d97706" />
        <text x="225" y="34" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="800" fill="#ffffff">
          HONEY-COLORED CRUST (สะเก็ดสีน้ำผึ้ง)
        </text>
      </g>

      <!-- Interactive: Coagulase Fibrin Wall -->
      <g class="interactive-part" data-part-id="fibrin_capsule" title="Coagulase Fibrin Wall">
        <g transform="translate(60, 270)">
          <rect x="0" y="0" width="330" height="40" rx="8" fill="#1e1b4b" stroke="#8b5cf6" stroke-width="2" />
          <circle cx="25" cy="20" r="12" fill="#7c3aed" />
          <text x="25" y="24" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="800" fill="#ffffff">Fib</text>
          <text x="50" y="18" font-family="sans-serif" font-size="11" font-weight="700" fill="#c084fc">Coagulase Fibrin Barrier</text>
          <text x="50" y="32" font-family="sans-serif" font-size="9.5" fill="#94a3b8">ผนังไฟบรินกักกันฝี ป้องกันเม็ดเลือดขาวและยาปฏิชีวนะ</text>
        </g>
      </g>
    </g>
  `;
}

// 3. Bacillus anthracis: Coal-Black Sunken Eschar with Satellite Vesicles & Edema
function renderAnthraxMagnified() {
  return `
    <g id="anthrax-magnified">
      <rect x="20" y="30" width="410" height="360" rx="10" fill="#0b1329" stroke="#1e293b" stroke-width="1.5" />

      <!-- Interactive: Gelatinous Non-Pitting Edema (Driven by Edema Factor - EF) -->
      <g class="interactive-part" data-part-id="gelatinous_edema" title="Gelatinous Non-Pitting Edema">
        <!-- Massive swollen pale pink-yellow dermal zone -->
        <ellipse cx="225" cy="210" rx="180" ry="120" fill="#fef08a" fill-opacity="0.2" stroke="#eab308" stroke-width="3" stroke-dasharray="6,4" />
        <rect x="90" y="45" width="270" height="24" rx="12" fill="#713f12" />
        <text x="225" y="61" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="800" fill="#fde047">
          PALE GELATINOUS EDEMA (ชั้นบวมน้ำไม่กดบุ๋ม)
        </text>
      </g>

      <!-- Interactive: Satellite Vesicle Ring (Fluid-filled clear blisters) -->
      <g class="interactive-part" data-part-id="satellite_vesicles" title="Satellite Vesicle Ring">
        <g stroke="#38bdf8" stroke-width="2.5" fill="#bae6fd" fill-opacity="0.8">
          <circle cx="120" cy="210" r="14" />
          <circle cx="135" cy="160" r="12" />
          <circle cx="170" cy="125" r="13" />
          <circle cx="225" cy="115" r="14" />
          <circle cx="280" cy="125" r="13" />
          <circle cx="315" cy="160" r="12" />
          <circle cx="330" cy="210" r="14" />
          <circle cx="315" cy="260" r="13" />
          <circle cx="280" cy="295" r="14" />
          <circle cx="225" cy="305" r="14" />
          <circle cx="170" cy="295" r="13" />
          <circle cx="135" cy="260" r="12" />
        </g>
        <text x="225" y="100" text-anchor="middle" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#38bdf8">
          Satellite Vesicles (วงตุ่มน้ำใสบริวาร)
        </text>
      </g>

      <!-- Interactive: Coal-Black Sunken Eschar (Lethal Factor - LF necrosis) -->
      <g class="interactive-part" data-part-id="black_eschar" title="Coal-Black Sunken Eschar">
        <!-- Sunken black crater -->
        <ellipse cx="225" cy="210" rx="75" ry="55" fill="url(#black-eschar-grad)" stroke="#000000" stroke-width="4" />
        
        <!-- Cragged necrotic texture & fissures -->
        <path d="M 175,200 Q 225,215 275,205 M 200,180 Q 225,210 215,240 M 240,185 Q 230,225 250,235" 
              stroke="#3f3f46" stroke-width="2" fill="none" />

        <!-- Hallmark Banner: PAINLESS BLACK ESCHAR -->
        <rect x="110" y="325" width="230" height="28" rx="14" fill="#09090b" stroke="#eab308" stroke-width="2" />
        <text x="225" y="344" text-anchor="middle" font-family="sans-serif" font-size="11.5" font-weight="900" fill="#facc15">
          BLACK ESCHAR • PAINLESS (ไม่เจ็บ)
        </text>
      </g>
    </g>
  `;
}

// 4. Treponema pallidum: Primary Syphilis Hard Chancre (Cartilage Induration + Clean Bed)
function renderSyphilisMagnified() {
  return `
    <g id="syphilis-magnified">
      <rect x="20" y="30" width="410" height="360" rx="10" fill="#0b1329" stroke="#1e293b" stroke-width="1.5" />

      <!-- Interactive: Indurated Elevated Margin (Cartilage-hard rim) -->
      <g class="interactive-part" data-part-id="indurated_rim" title="Indurated Elevated Margin">
        <!-- Rolled, elevated smooth border -->
        <ellipse cx="225" cy="190" rx="150" ry="105" fill="#0369a1" fill-opacity="0.3" stroke="#0284c7" stroke-width="6" />
        <rect x="100" y="45" width="250" height="26" rx="13" fill="#0369a1" />
        <text x="225" y="62" text-anchor="middle" font-family="sans-serif" font-size="11.5" font-weight="800" fill="#ffffff">
          INDURATED ROLLED MARGIN (ขอบแข็งเหมือนกระดูกอ่อน)
        </text>
      </g>

      <!-- Interactive: Clean Granulating Ulcer Bed (No pus, red base) -->
      <g class="interactive-part" data-part-id="clean_ulcer_base" title="Clean Granulating Ulcer Bed">
        <!-- Clean, glistening pink-red crater -->
        <ellipse cx="225" cy="190" rx="110" ry="75" fill="#e11d48" stroke="#be123c" stroke-width="3" />
        
        <!-- Clean granulating surface cues (No exudate/purulence) -->
        <ellipse cx="200" cy="175" rx="30" ry="18" fill="#fb7185" fill-opacity="0.5" />
        <ellipse cx="250" cy="205" rx="35" ry="20" fill="#fb7185" fill-opacity="0.5" />

        <rect x="110" y="175" width="230" height="26" rx="6" fill="#881337" stroke="#ffffff" stroke-width="1" />
        <text x="225" y="192" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="900" fill="#ffffff">
          CLEAN BASE • NO PUS (ก้นแผลสะอาด ไร้หนอง)
        </text>
      </g>

      <!-- Interactive: Endarteritis Obliterans (Vessel pathology) -->
      <g class="interactive-part" data-part-id="endarteritis_vessels" title="Endarteritis Obliterans">
        <g transform="translate(60, 310)">
          <rect x="0" y="0" width="330" height="40" rx="8" fill="#1e1b4b" stroke="#9333ea" stroke-width="2" />
          <circle cx="25" cy="20" r="12" fill="#7e22ce" stroke="#c084fc" stroke-width="2" />
          <circle cx="25" cy="20" r="4" fill="#3b0764" />
          <text x="50" y="18" font-family="sans-serif" font-size="11" font-weight="700" fill="#d8b4fe">Endarteritis Obliterans</text>
          <text x="50" y="32" font-family="sans-serif" font-size="9.5" fill="#94a3b8">หลอดเลือดเล็กในชั้นหนังแท้หนาตัวตีบตันล้อมรอบด้วย Plasma cells</text>
        </g>
      </g>
    </g>
  `;
}

// 5. Varicella-Zoster Virus: "Dew Drops on a Rose Petal" & Pleomorphic Stages
function renderVZVMagnified() {
  return `
    <g id="vzv-magnified">
      <rect x="20" y="30" width="410" height="360" rx="10" fill="#0b1329" stroke="#1e293b" stroke-width="1.5" />

      <!-- Interactive: Rose-Petal Erythematous Base -->
      <g class="interactive-part" data-part-id="erythematous_base" title="Rose-Petal Erythematous Base">
        <ellipse cx="225" cy="210" rx="130" ry="85" fill="#fb7185" fill-opacity="0.35" stroke="#e11d48" stroke-width="3.5" />
        <rect x="90" y="45" width="270" height="24" rx="12" fill="#be123c" />
        <text x="225" y="61" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="800" fill="#ffffff">
          ROSE-PETAL BASE (ฐานผิวหนังสีแดงกุหลาบ)
        </text>
      </g>

      <!-- Interactive: Crystal-Clear Dew-Drop Blister -->
      <g class="interactive-part" data-part-id="clear_vesicle" title="Crystal-Clear Dew-Drop Blister">
        <!-- Teardrop Clear Vesicle -->
        <path d="M 225,125 C 175,175 165,225 185,255 C 205,275 245,275 265,255 C 285,225 275,175 225,125 Z" 
              fill="#bae6fd" fill-opacity="0.85" stroke="#0284c7" stroke-width="3" />
        
        <!-- Glass reflections -->
        <path d="M 200,195 Q 185,230 205,245" stroke="#ffffff" stroke-width="4" stroke-linecap="round" fill="none" />
        <circle cx="245" cy="205" r="5" fill="#ffffff" />

        <rect x="110" y="275" width="230" height="26" rx="6" fill="#0369a1" stroke="#ffffff" stroke-width="1" />
        <text x="225" y="292" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="900" fill="#ffffff">
          DEW DROP VESICLE (ตุ่มน้ำใสหยดน้ำค้าง)
        </text>
      </g>

      <!-- Interactive: Giant Cells / Tzanck Smear -->
      <g class="interactive-part" data-part-id="giant_cells" title="Multinucleated Giant Cells">
        <g transform="translate(60, 315)">
          <rect x="0" y="0" width="330" height="38" rx="8" fill="#1e1b4b" stroke="#8b5cf6" stroke-width="1.5" />
          <ellipse cx="25" cy="19" rx="16" ry="12" fill="#581c87" />
          <circle cx="18" cy="16" r="3.5" fill="#c084fc" />
          <circle cx="26" cy="15" r="3" fill="#c084fc" />
          <circle cx="23" cy="22" r="3.5" fill="#c084fc" />
          <text x="50" y="17" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#d8b4fe">Tzanck Smear (+): Multinucleated Giant Cells</text>
          <text x="50" y="30" font-family="sans-serif" font-size="9" fill="#94a3b8">เซลล์เคอราติโนไซต์หลอมรวมหลายนิวเคลียส (แยกไม่ออกระหว่าง VZV กับ HSV)</text>
        </g>
      </g>
    </g>
  `;
}

// 6. Borrelia burgdorferi: Erythema Migrans Annular Bull's-Eye Target
function renderLymeMagnified() {
  return `
    <g id="lyme-magnified">
      <rect x="20" y="30" width="410" height="360" rx="10" fill="#0b1329" stroke="#1e293b" stroke-width="1.5" />

      <!-- Interactive: Expanding Annular Red Border (>5cm) -->
      <g class="interactive-part" data-part-id="expanding_border" title="Expanding Annular Red Border">
        <circle cx="225" cy="200" r="145" fill="#fee2e2" fill-opacity="0.3" stroke="#ef4444" stroke-width="12" />
        <rect x="90" y="42" width="270" height="26" rx="13" fill="#dc2626" />
        <text x="225" y="59" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="800" fill="#ffffff">
          EXPANDING BORDER &gt; 5 CM (ขอบแดงวงแหวนขยาย)
        </text>
      </g>

      <!-- Interactive: Intermediate Clearing Ring -->
      <g class="interactive-part" data-part-id="clearing_zone" title="Intermediate Clearing Ring">
        <circle cx="225" cy="200" r="95" fill="#0b1329" stroke="#fca5a5" stroke-width="3" stroke-dasharray="4,2" />
        <text x="225" y="145" text-anchor="middle" font-family="sans-serif" font-size="10.5" font-weight="800" fill="#94a3b8">
          CENTRAL CLEARING (วงผิวหนังซีดใสตรงกลาง)
        </text>
      </g>

      <!-- Interactive: Central Bite Punctum / Papule -->
      <g class="interactive-part" data-part-id="central_bite" title="Central Punctum / Bite Papule">
        <circle cx="225" cy="200" r="35" fill="#ef4444" stroke="#b91c1c" stroke-width="3" />
        <circle cx="225" cy="200" r="8" fill="#7f1d1d" />

        <rect x="145" y="275" width="160" height="24" rx="6" fill="#991b1b" />
        <text x="225" y="291" text-anchor="middle" font-family="sans-serif" font-size="10.5" font-weight="800" fill="#ffffff">
          TICK BITE SITE (รอยเห็บกัด)
        </text>
      </g>
    </g>
  `;
}

// ============================================================================
// DIRECT ORGAN VIEWS: Gastrointestinal & Mucosal Pathogens
// ============================================================================

// 7. Candida albicans: Oral Cavity & Tongue (ช่องปากและลิ้น)
function renderCandidaOralCavity() {
  return `
    <g id="candida-organ-view">
      <!-- Main Organ Container Card -->
      <rect x="20" y="20" width="880" height="560" rx="16" fill="url(#panel-bg-grad)" stroke="#38bdf8" stroke-width="2" filter="url(#soft-panel-shadow)" />

      <!-- Header Title -->
      <g transform="translate(45, 55)">
        <rect x="0" y="-12" width="12" height="12" rx="3" fill="#f43f5e" />
        <text x="22" y="0" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="800" fill="#ffffff" letter-spacing="0.4">
          DIRECT ORGAN VIEW: ORAL CAVITY &amp; TONGUE (ช่องปากและลิ้น)
        </text>
        <text x="22" y="22" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="600" fill="#94a3b8">
          Oral Thrush (ฝ้าขาวคอตเทจชีสในปากที่ขูดออกได้และมีเลือดซึม — Pathognomonic)
        </text>
      </g>

      <!-- ============================================== -->
      <!-- Anatomical Oral Cavity Illustration            -->
      <!-- ============================================== -->
      <g transform="translate(180, 80)">
        <!-- Outer Lips / Mouth Contour -->
        <ellipse cx="280" cy="230" rx="240" ry="170" fill="#881337" stroke="#4c0519" stroke-width="4" />
        
        <!-- Oropharyngeal Throat Cavity (Deep dark posterior) -->
        <ellipse cx="280" cy="180" rx="160" ry="90" fill="#3b0712" />

        <!-- Upper Teeth Arch -->
        <path d="M 160,140 Q 280,165 400,140 L 390,120 Q 280,145 170,120 Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2" />
        
        <!-- Uvula (ลิ้นไก่) -->
        <path d="M 272,130 C 272,165 288,165 288,130 Z" fill="#e11d48" stroke="#9f1239" stroke-width="1.5" />

        <!-- Protruding Tongue (Dorsal Surface) -->
        <path d="M 140,240 C 140,380 200,430 280,430 C 360,430 420,380 420,240 Q 280,260 140,240 Z" 
              fill="#fb7185" stroke="#be123c" stroke-width="4" />

        <!-- Interactive: Underlying Erythematous Mucosa (Where scraped off!) -->
        <g class="interactive-part" data-part-id="erythematous_mucosa" title="Underlying Erythematous Mucosa">
          <!-- Raw bleeding exposed base on right side of tongue -->
          <path d="M 285,280 Q 350,270 365,330 Q 310,360 285,280 Z" fill="#b91c1c" stroke="#7f1d1d" stroke-width="3" />
          
          <!-- Blood droplets weeping from capillaries -->
          <circle cx="310" cy="305" r="4.5" fill="#ef4444" />
          <circle cx="335" cy="315" r="4" fill="#ef4444" />
          <circle cx="320" cy="335" r="3.5" fill="#ef4444" />

          <!-- High-Yield Callout -->
          <rect x="360" y="270" width="190" height="26" rx="6" fill="#7f1d1d" stroke="#ffffff" stroke-width="1" />
          <text x="455" y="287" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="800" fill="#ffffff">
            RAW BLEEDING BASE (เลือดซึม)
          </text>
          <line x1="360" y1="283" x2="335" y2="300" stroke="#ef4444" stroke-width="2" />
        </g>

        <!-- Interactive: White Curd Pseudomembranous Plaques (Cottage Cheese) -->
        <g class="interactive-part" data-part-id="white_curds" title="White Curd-like Pseudomembranous Plaques">
          <!-- Clumpy white cottage-cheese patches on tongue -->
          <ellipse cx="205" cy="285" rx="35" ry="20" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" />
          <ellipse cx="230" cy="325" rx="40" ry="24" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" />
          <ellipse cx="250" cy="370" rx="30" ry="18" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" />
          <ellipse cx="200" cy="350" rx="25" ry="16" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" />

          <!-- Fluffy curd texture highlights -->
          <circle cx="215" cy="280" r="8" fill="#f8fafc" />
          <circle cx="240" cy="320" r="10" fill="#f8fafc" />
          <circle cx="235" cy="335" r="9" fill="#f1f5f9" />

          <!-- Callout Banner -->
          <rect x="-10" y="270" width="200" height="26" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5" />
          <text x="90" y="287" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="800" fill="#38bdf8">
            WHITE CURD (ฝ้าขาวคอตเทจชีส)
          </text>
          <line x1="190" y1="283" x2="215" y2="295" stroke="#38bdf8" stroke-width="2" />
        </g>

        <!-- Wooden Tongue Depressor Spatula scraping the tongue -->
        <g transform="translate(320, 240) rotate(-35)">
          <rect x="0" y="0" width="180" height="24" rx="12" fill="#d97706" stroke="#78350f" stroke-width="2.5" />
          <text x="90" y="16" text-anchor="middle" font-family="sans-serif" font-size="9.5" font-weight="700" fill="#ffffff">
            SPATULA / TONGUE DEPRESSOR
          </text>
        </g>
      </g>

      <!-- Bottom Clinical Comparison Box (VS Leukoplakia) -->
      <g transform="translate(45, 520)">
        <rect x="0" y="0" width="830" height="34" rx="8" fill="#0f172a" stroke="#e11d48" stroke-width="1.5" />
        <text x="20" y="22" font-family="sans-serif" font-size="11.5" font-weight="700" fill="#fca5a5">
          ★ จุดเน้นออกสอบ NL1: Oral Candidiasis ขูดฝ้าขาวออกได้ และเห็นพื้นผิวข้างใต้แดงมีเลือดซึม (Scrapes off &amp; bleeds) ต่างจาก Oral Leukoplakia ที่ขูดไม่ออก!
        </text>
      </g>
    </g>
  `;
}

// 8. Clostridioides difficile: Colon / Large Intestine Pseudomembranous Colitis
function renderCdiffColitis() {
  return `
    <g id="cdiff-organ-view">
      <rect x="20" y="20" width="880" height="560" rx="16" fill="url(#panel-bg-grad)" stroke="#f59e0b" stroke-width="2" filter="url(#soft-panel-shadow)" />

      <!-- Header Title -->
      <g transform="translate(45, 55)">
        <rect x="0" y="-12" width="12" height="12" rx="3" fill="#f59e0b" />
        <text x="22" y="0" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="800" fill="#ffffff" letter-spacing="0.4">
          DIRECT ORGAN VIEW: COLON / LARGE INTESTINE (ลำไส้ใหญ่)
        </text>
        <text x="22" y="22" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="600" fill="#94a3b8">
          Pseudomembranous Colitis (แผ่นเยื่อหลอกสีเหลืองขาวนูนคล้ายภูเขาไฟบนเยื่อบุลำไส้ใหญ่)
        </text>
      </g>

      <!-- ============================================== -->
      <!-- Colonic Lumen Endoscopic Cutaway View          -->
      <!-- ============================================== -->
      <g transform="translate(60, 95)">
        <!-- Colon Tube Architecture -->
        <rect x="0" y="20" width="760" height="370" rx="20" fill="#450a0a" stroke="#7f1d1d" stroke-width="3" />
        
        <!-- Interactive: Hyperemic Fragile Colonic Mucosa -->
        <g class="interactive-part" data-part-id="erythematous_colonic_mucosa" title="Hyperemic Fragile Colonic Mucosa">
          <!-- Colonic Fold Ridges (Haustra & Plicae semilunares) -->
          <path d="M 0,100 Q 200,140 400,90 Q 600,130 760,100" stroke="#991b1b" stroke-width="12" fill="none" opacity="0.6" />
          <path d="M 0,220 Q 220,260 450,210 Q 630,250 760,220" stroke="#991b1b" stroke-width="14" fill="none" opacity="0.6" />
          <path d="M 0,320 Q 250,350 500,310 Q 650,340 760,320" stroke="#991b1b" stroke-width="12" fill="none" opacity="0.6" />

          <rect x="40" y="45" width="280" height="26" rx="6" fill="#7f1d1d" stroke="#ef4444" stroke-width="1.5" />
          <text x="180" y="62" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="800" fill="#ffffff">
            FRIABLE ERYTHEMATOUS COLON MUCOSA
          </text>
        </g>

        <!-- Interactive: Eruptive Pseudomembrane Plaques (Volcano Plaques) -->
        <g class="interactive-part" data-part-id="pseudomembrane_plaque" title="Eruptive Pseudomembrane Plaque">
          <!-- Eruptive Yellow-White Volcano Plaques scattered on mucosa -->
          <!-- Plaque 1 (Big center) -->
          <ellipse cx="380" cy="180" rx="65" ry="35" fill="#fef08a" stroke="#ca8a04" stroke-width="3" />
          <ellipse cx="380" cy="180" rx="35" ry="18" fill="#fef9c3" />
          <circle cx="380" cy="180" r="10" fill="#eab308" />

          <!-- Plaque 2 -->
          <ellipse cx="180" cy="150" rx="45" ry="25" fill="#fef08a" stroke="#ca8a04" stroke-width="2.5" />
          <circle cx="180" cy="150" r="8" fill="#eab308" />

          <!-- Plaque 3 -->
          <ellipse cx="580" cy="160" rx="55" ry="30" fill="#fef08a" stroke="#ca8a04" stroke-width="2.5" />
          <circle cx="580" cy="160" r="9" fill="#eab308" />

          <!-- Plaque 4 & 5 (Lower row) -->
          <ellipse cx="250" cy="280" rx="50" ry="28" fill="#fef08a" stroke="#ca8a04" stroke-width="2.5" />
          <ellipse cx="500" cy="270" rx="55" ry="30" fill="#fef08a" stroke="#ca8a04" stroke-width="2.5" />

          <!-- Plaque Callout Banner -->
          <rect x="480" y="45" width="240" height="26" rx="6" fill="#854d0e" stroke="#fde047" stroke-width="1.5" />
          <text x="600" y="62" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="800" fill="#fef08a">
            VOLCANO PLAQUES (แผ่นเยื่อหลอกภูเขาไฟ)
          </text>
        </g>

        <!-- Interactive: Volcano Core Exudate Flow (Microscopic eruption cue) -->
        <g class="interactive-part" data-part-id="volcano_exudate_core" title="Volcano Core Exudate Flow">
          <g transform="translate(320, 230)">
            <rect x="0" y="0" width="260" height="34" rx="6" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5" />
            <text x="130" y="21" text-anchor="middle" font-family="sans-serif" font-size="10.5" font-weight="700" fill="#fde047">
              ✦ Eruptive Fibrin &amp; Neutrophil Column
            </text>
          </g>
        </g>
      </g>

      <!-- Bottom High-Yield Strip -->
      <g transform="translate(45, 520)">
        <rect x="0" y="0" width="830" height="34" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5" />
        <text x="20" y="22" font-family="sans-serif" font-size="11.5" font-weight="700" fill="#fde68a">
          ★ จุดเน้นออกสอบ NL1: เกิดหลังได้ยา Clindamycin / Quinolones | ตรวจยืนยันด้วย Stool PCR / Toxin A &amp; B | ยารักษาอันดับ 1: Oral Vancomycin หรือ Fidaxomicin!
        </text>
      </g>
    </g>
  `;
}

// 9. Entamoeba histolytica: Colonic Wall Cross-Section with Flask-Shaped Ulcer
function renderEntamoebaFlaskUlcer() {
  return `
    <g id="entamoeba-organ-view">
      <rect x="20" y="20" width="880" height="560" rx="16" fill="url(#panel-bg-grad)" stroke="#10b981" stroke-width="2" filter="url(#soft-panel-shadow)" />

      <!-- Header Title -->
      <g transform="translate(45, 55)">
        <rect x="0" y="-12" width="12" height="12" rx="3" fill="#10b981" />
        <text x="22" y="0" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="800" fill="#ffffff" letter-spacing="0.4">
          DIRECT ORGAN VIEW: COLONIC WALL CROSS-SECTION (ผนังลำไส้ใหญ่ผ่าขวาง)
        </text>
        <text x="22" y="22" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="600" fill="#94a3b8">
          Flask-Shaped Ulcer (แผลรูปขวดชมพู่: ปากแผลแคบที่เยื่อบุ ก้นแผลกว้างลึกในชั้นใต้เยื่อบุ)
        </text>
      </g>

      <!-- ============================================== -->
      <!-- Colonic Wall Histological Cross-Section        -->
      <!-- ============================================== -->
      <g transform="translate(60, 95)">
        <!-- Layer 1: Colonic Mucosa & Crypts (Top) -->
        <rect x="0" y="20" width="760" height="70" fill="#881337" fill-opacity="0.8" stroke="#4c0519" stroke-width="2" />
        <text x="20" y="55" font-family="sans-serif" font-size="11" font-weight="800" fill="#fecdd3">MUCOSA (ชั้นเยื่อบุผิวด้านในลำไส้)</text>

        <!-- Layer 2: Muscularis Mucosae Thin Boundary -->
        <line x1="0" y1="90" x2="760" y2="90" stroke="#fb7185" stroke-width="4" />

        <!-- Layer 3: Submucosa (Loose connective tissue where amoeba spreads laterally!) -->
        <rect x="0" y="92" width="760" height="200" fill="#450a0a" fill-opacity="0.9" stroke="#7f1d1d" stroke-width="2" />
        <text x="20" y="270" font-family="sans-serif" font-size="11" font-weight="800" fill="#fca5a5">SUBMUCOSA (ชั้นใต้เยื่อบุ - เนื้อเยื่อเกี่ยวพันหลวม ถูกย่อยละลายเป็นโพรงกว้าง)</text>

        <!-- Layer 4: Muscularis Propria (Bottom muscle layer) -->
        <rect x="0" y="294" width="760" height="60" fill="#1e1b4b" stroke="#312e81" stroke-width="2" />
        <text x="20" y="330" font-family="sans-serif" font-size="11" font-weight="800" fill="#c7d2fe">MUSCULARIS PROPRIA (ชั้นกล้ามเนื้อผนังลำไส้)</text>

        <!-- ============================================== -->
        <!-- THE FLASK-SHAPED ULCER (แผลรูปขวดชมพู่)       -->
        <!-- ============================================== -->
        <!-- Interactive: Narrow Mucosal Neck -->
        <g class="interactive-part" data-part-id="flask_neck" title="Narrow Mucosal Neck">
          <!-- Small narrow mucosal opening (Pinhead opening) -->
          <path d="M 340,20 L 340,90 L 420,90 L 420,20 Z" fill="#0f172a" />
          
          <rect x="230" y="-10" width="300" height="24" rx="6" fill="#be123c" />
          <text x="380" y="6" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="900" fill="#ffffff">
            NARROW NECK (ปากแผลขนาดเล็กแคบที่เยื่อบุ)
          </text>
          <line x1="380" y1="14" x2="380" y2="50" stroke="#f43f5e" stroke-width="2" />
        </g>

        <!-- Interactive: Broad Submucosal Necrotic Cavity (The Flask Body) -->
        <g class="interactive-part" data-part-id="flask_base" title="Broad Submucosal Necrotic Cavity">
          <!-- Broad lateral undermining flask cavity in submucosa -->
          <path d="M 340,90 C 260,110 180,150 180,210 C 180,270 260,290 380,290 C 500,290 580,270 580,210 C 580,150 500,110 420,90 Z" 
                fill="#0f172a" stroke="#ef4444" stroke-width="3.5" />
          
          <!-- Liquefactive necrosis & debris inside the flask cavity -->
          <ellipse cx="380" cy="220" rx="140" ry="45" fill="#7f1d1d" fill-opacity="0.6" />
          
          <rect x="250" y="240" width="260" height="26" rx="6" fill="#7f1d1d" stroke="#fca5a5" stroke-width="1.5" />
          <text x="380" y="257" text-anchor="middle" font-family="sans-serif" font-size="11.5" font-weight="900" fill="#ffffff">
            BROAD FLASK CAVITY (ก้นแผลกว้างรูปขวด)
          </text>
        </g>

        <!-- Interactive: Trophozoites with Ingested RBCs (Erythrophagocytosis) -->
        <g class="interactive-part" data-part-id="trophozoite_rbc" title="Trophozoite with Ingested RBCs">
          <!-- Amoebic Trophozoite actively migrating at ulcer margin -->
          <g transform="translate(230, 150)">
            <ellipse cx="30" cy="30" rx="32" ry="24" fill="#065f46" stroke="#34d399" stroke-width="2.5" />
            <!-- Pseudopodium -->
            <path d="M 8,20 Q -10,30 5,45" fill="#065f46" stroke="#34d399" stroke-width="2" />
            <!-- Nucleus with central karyosome (Bull's eye nucleus) -->
            <circle cx="25" cy="25" r="7" fill="#047857" stroke="#a7f3d0" stroke-width="1.5" />
            <circle cx="25" cy="25" r="2.5" fill="#ffffff" />
            <!-- Ingested Red Blood Cells (Pathognomonic Erythrophagocytosis!) -->
            <circle cx="45" cy="22" r="5" fill="#ef4444" />
            <circle cx="40" cy="34" r="5" fill="#ef4444" />
            <circle cx="28" cy="38" r="4.5" fill="#ef4444" />
            <text x="75" y="32" font-family="sans-serif" font-size="10.5" font-weight="800" fill="#34d399">
              Trophozoite with ingested RBCs
            </text>
          </g>
        </g>
      </g>

      <!-- Bottom High-Yield Strip -->
      <g transform="translate(45, 520)">
        <rect x="0" y="0" width="830" height="34" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="1.5" />
        <text x="20" y="22" font-family="sans-serif" font-size="11.5" font-weight="700" fill="#a7f3d0">
          ★ จุดเน้นออกสอบ NL1: พบมากที่ Cecum | ตรวจสดพบ Erythrophagocytosis | เสี่ยงเกิด Anchovy paste liver abscess | ต้องให้ Metronidazole + Paromomycin ครบ 2 ขั้นตอน!
        </text>
      </g>
    </g>
  `;
}

function renderGenericOrgan(microbe) {
  return `
    <g id="generic-organ">
      <rect x="20" y="20" width="880" height="560" rx="16" fill="url(#panel-bg-grad)" stroke="#38bdf8" stroke-width="2" />
      <text x="460" y="300" text-anchor="middle" font-family="sans-serif" font-size="20" font-weight="700" fill="#ffffff">
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
