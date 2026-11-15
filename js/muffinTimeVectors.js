// ============================================================================
// Pathox-Micro · Muffin Time Style Vector Card Generator
// Authentic asdfmovie / Muffin Time card game aesthetic:
// - Vibrant cyan rounded card border (14px)
// - Bold comic headline with black outline & cyan fill
// - Lowercase/sentence-case subtitle rule
// - Minimalist stickman vector illustration with bold 5px black ink strokes
// - Vibrant pop-color lesion focal points & comic sound-effect bursts
// - High-yield clinical accuracy for NL1 / USMLE
// ============================================================================

export function renderMuffinTimeCard(microbe, mode = 'cutaway') {
  if (!microbe) return '';

  const id = microbe.id;
  let illustration = '';

  switch (id) {
    case 'variola-virus':
      illustration = renderVariolaCard();
      break;
    case 'staphylococcus-aureus':
      illustration = renderStaphCard();
      break;
    case 'bacillus-anthracis':
      illustration = renderAnthraxCard();
      break;
    case 'treponema-pallidum':
      illustration = renderSyphilisCard();
      break;
    case 'varicella-zoster':
      illustration = renderVZVCard();
      break;
    case 'borrelia-burgdorferi':
      illustration = renderLymeCard();
      break;
    case 'candida-albicans':
      illustration = renderCandidaCard();
      break;
    default:
      illustration = renderDefaultCard(microbe);
  }

  // Card Header Title & Subtitle
  const cardTitle = microbe.cardTitle || microbe.name.toUpperCase();
  const cardSubtitle = microbe.cardSubtitle || 'a wild clinical lesion appears! choose your action wisely';
  const cardBadge = microbe.cardBadge || 'ACTION';

  // Subtitle splitting for clean 2-line rendering if long
  const subtitleLines = splitSubtitle(cardSubtitle, 52);

  return `
    <svg id="muffin-card-svg" class="muffin-card-svg" viewBox="0 0 500 720" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Shadow filter -->
        <filter id="card-soft-shadow" x="-8%" y="-8%" width="116%" height="116%">
          <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.45"/>
        </filter>
        <filter id="part-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#38bdf8" flood-opacity="0.9"/>
        </filter>
      </defs>

      <!-- Outer Card Shadow & Container -->
      <g filter="url(#card-soft-shadow)">
        <!-- Card White Base Canvas -->
        <rect x="12" y="12" width="476" height="696" rx="28" ry="28" fill="#ffffff" />
        
        <!-- Thick Vibrant Muffin-Time Border (Signature Cyan/Blue) -->
        <rect x="12" y="12" width="476" height="696" rx="28" ry="28" fill="none" stroke="#00a8e8" stroke-width="15" />
      </g>

      <!-- Inner Thin Border Guide -->
      <rect x="23" y="23" width="454" height="674" rx="20" ry="20" fill="none" stroke="#e2e8f0" stroke-width="1.5" />

      <!-- ================================================================== -->
      <!-- CARD HEADER: Bangers / Impact style comic title                    -->
      <!-- ================================================================== -->
      <g id="card-header-group">
        <!-- Main Card Title: Cyan fill with solid black stroke outline -->
        <text x="250" y="68" 
              text-anchor="middle" 
              font-family="'Impact', 'Bangers', 'Arial Black', sans-serif" 
              font-size="44" 
              font-weight="900" 
              letter-spacing="1.5"
              fill="#5ce1e6" 
              stroke="#000000" 
              stroke-width="5" 
              paint-order="stroke fill"
              stroke-linejoin="round">
          ${cardTitle}
        </text>

        <!-- Subtitle: Clean Sans-Serif Rule Text -->
        ${subtitleLines.map((line, i) => `
          <text x="250" y="${98 + (i * 18)}" 
                text-anchor="middle" 
                font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif" 
                font-size="13.5" 
                font-weight="700" 
                fill="#1e293b">
            ${escapeXml(line)}
          </text>
        `).join('')}
      </g>

      <!-- Divider line under header -->
      <line x1="40" y1="${98 + (subtitleLines.length * 18) + 10}" x2="460" y2="${98 + (subtitleLines.length * 18) + 10}" stroke="#000000" stroke-width="3" stroke-linecap="round" />

      <!-- ================================================================== -->
      <!-- CENTRAL ILLUSTRATION: Minimalist Asdfmovie Stickman & Clinical Lesion -->
      <!-- ================================================================== -->
      <g id="card-art-group" transform="translate(0, ${subtitleLines.length > 1 ? 10 : 0})">
        ${illustration}
      </g>

      <!-- ================================================================== -->
      <!-- CARD FOOTER: High-yield banner + ACTION / CATEGORY Badge          -->
      <!-- ================================================================== -->
      <g id="card-footer-group">
        <!-- Thin bottom divider -->
        <line x1="30" y1="655" x2="470" y2="655" stroke="#f1f5f9" stroke-width="2" stroke-linecap="round" />
        
        <!-- Pathogen High-Yield Tag -->
        <text x="35" y="685" 
              font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif" 
              font-size="12" 
              font-weight="800" 
              fill="#94a3b8" 
              letter-spacing="0.5">
          ${escapeXml(microbe.scientificName || microbe.name)}
        </text>

        <!-- Signature Muffin Time Bottom-Right "ACTION" / Badge -->
        <text x="465" y="685" 
              text-anchor="end" 
              font-family="'Impact', 'Bangers', 'Arial Black', sans-serif" 
              font-size="32" 
              font-weight="900" 
              letter-spacing="1" 
              fill="#00a8e8">
          ${cardBadge}
        </text>
      </g>
    </svg>
  `;
}

// ----------------------------------------------------------------------------
// Helper: Subtitle text splitting into max characters per line
// ----------------------------------------------------------------------------
function splitSubtitle(text, maxChars = 52) {
  if (text.length <= maxChars) return [text];
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length <= maxChars) {
      currentLine = (currentLine + ' ' + word).trim();
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

function escapeXml(unsafe) {
  return String(unsafe).replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

// ============================================================================
// 1. Variola Virus (Smallpox): "DON'T POP ME!"
// Stickman shivering with synchronized pustules; giant shotty pustule with
// central bellybutton umbilication; evil stickman's needle BENDS with "CLANG!"
// ============================================================================
function renderVariolaCard() {
  return `
    <g id="variola-card-art">
      <!-- Ground line -->
      <line x1="40" y1="620" x2="460" y2="620" stroke="#000000" stroke-width="5" stroke-linecap="round" />

      <!-- Comic sound bubble: *CLANG!* -->
      <g transform="translate(370, 260)">
        <polygon points="0,0 20,-25 45,-15 70,-40 75,-15 105,-20 85,10 100,35 65,25 45,50 35,25 0,0" fill="#fef08a" stroke="#000000" stroke-width="4" stroke-linejoin="round"/>
        <text x="50" y="8" text-anchor="middle" font-family="'Impact', sans-serif" font-size="19" font-weight="900" fill="#dc2626">CLANG!</text>
      </g>

      <!-- Speech Bubble: "TOO HARD TO POP!" -->
      <g transform="translate(310, 160)">
        <path d="M 10,0 L 140,0 Q 150,0 150,10 L 150,50 Q 150,60 140,60 L 50,60 L 30,80 L 35,60 L 10,60 Q 0,60 0,50 L 0,10 Q 0,0 10,0 Z" fill="#ffffff" stroke="#000000" stroke-width="4" />
        <text x="75" y="26" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="900" fill="#000000">TOO HARD TO POP!</text>
        <text x="75" y="44" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" font-weight="700" fill="#64748b">(SHOTTY BB-PELLET)</text>
      </g>

      <!-- ============================================== -->
      <!-- Left Stickman: Terrified Patient Shivering     -->
      <!-- ============================================== -->
      <!-- Body & Limbs -->
      <path d="M 140,340 L 140,490 L 105,620 M 140,490 L 175,620" stroke="#000000" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      
      <!-- Trembling Left Arm held on head -->
      <path d="M 140,380 L 95,330 L 110,270" stroke="#000000" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      <!-- Outstretched Right Arm holding the Giant Lesion -->
      <path d="M 140,380 L 220,380 L 290,380" stroke="#000000" stroke-width="8" stroke-linecap="round" fill="none" />

      <!-- Head (Round circle) -->
      <circle cx="140" cy="280" r="42" fill="#ffffff" stroke="#000000" stroke-width="6" />

      <!-- Expressive Face: Terrified Screaming Eyes & Mouth -->
      <circle cx="126" cy="272" r="5" fill="#000000" />
      <circle cx="154" cy="272" r="5" fill="#000000" />
      <!-- Wide Screaming Mouth -->
      <path d="M 125,295 Q 140,320 155,295 Z" fill="#000000" stroke="#000000" stroke-width="3" />
      
      <!-- Sweat Drops (Blue) -->
      <path d="M 85,250 Q 80,265 85,270 Q 90,265 85,250 Z" fill="#38bdf8" stroke="#000000" stroke-width="2.5" />
      <path d="M 195,245 Q 190,260 195,265 Q 200,260 195,245 Z" fill="#38bdf8" stroke="#000000" stroke-width="2.5" />

      <!-- Small Synchronous Pustules scattered on Face & Body -->
      <circle cx="115" cy="260" r="5" fill="#facc15" stroke="#000000" stroke-width="2.5" />
      <circle cx="165" cy="265" r="5" fill="#facc15" stroke="#000000" stroke-width="2.5" />
      <circle cx="140" cy="245" r="5" fill="#facc15" stroke="#000000" stroke-width="2.5" />
      <circle cx="130" cy="420" r="6" fill="#facc15" stroke="#000000" stroke-width="2.5" />
      <circle cx="150" cy="450" r="6" fill="#facc15" stroke="#000000" stroke-width="2.5" />

      <!-- ============================================== -->
      <!-- Central GIANT Umbilicated Pustule (Interactive) -->
      <!-- ============================================== -->
      <!-- Red Erythematous Inflamed Rim -->
      <ellipse cx="270" cy="380" rx="65" ry="32" fill="#fee2e2" stroke="#ef4444" stroke-width="5" stroke-dasharray="6,4" />

      <!-- Interactive: Shotty Dome -->
      <g class="interactive-part" data-part-id="shotty_dome" title="Hard Shotty Pustule Dome">
        <path d="M 215,380 C 215,300 325,300 325,380 Z" fill="#fef08a" stroke="#000000" stroke-width="6" />
        <!-- Pustular High-Yield Highlight Texture -->
        <circle cx="240" cy="345" r="7" fill="#ffffff" opacity="0.8" />
        <circle cx="295" cy="340" r="5" fill="#ffffff" opacity="0.8" />
      </g>

      <!-- Interactive: Central Umbilication (Bellybutton Dimple) -->
      <g class="interactive-part" data-part-id="umbilication" title="Central Umbilication">
        <!-- Deep Central Dimple -->
        <path d="M 252,320 Q 270,355 288,320 Q 270,332 252,320 Z" fill="#dc2626" stroke="#000000" stroke-width="4.5" />
        <ellipse cx="270" cy="336" rx="6" ry="3" fill="#7f1d1d" />
        <!-- Arrow & Dimple Label -->
        <line x1="270" y1="240" x2="270" y2="315" stroke="#dc2626" stroke-width="3" stroke-linecap="round" />
        <polygon points="270,320 265,310 275,310" fill="#dc2626" />
        <rect x="210" y="215" width="120" height="24" rx="12" ry="12" fill="#fee2e2" stroke="#dc2626" stroke-width="2" />
        <text x="270" y="231" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" font-weight="900" fill="#b91c1c">UMBILICATION</text>
      </g>

      <!-- Interactive: Guarnieri Inclusion Bodies floating in Dermis -->
      <g class="interactive-part" data-part-id="guarnieri_bodies" title="Guarnieri Inclusion Bodies">
        <circle cx="240" cy="415" r="12" fill="#c084fc" stroke="#000000" stroke-width="3.5" />
        <circle cx="240" cy="415" r="5" fill="#7e22ce" />
        <circle cx="290" cy="415" r="10" fill="#c084fc" stroke="#000000" stroke-width="3" />
        <text x="270" y="445" text-anchor="middle" font-family="Arial, sans-serif" font-size="10.5" font-weight="800" fill="#6b21a8">Guarnieri Bodies</text>
      </g>

      <!-- ============================================== -->
      <!-- Right Stickman: Evil Popper with BENT Needle   -->
      <!-- ============================================== -->
      <!-- Attacker Body -->
      <path d="M 420,370 L 420,500 L 390,620 M 420,500 L 445,620" stroke="#000000" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      <!-- Head with Smug/Shocked Face -->
      <circle cx="420" cy="310" r="38" fill="#ffffff" stroke="#000000" stroke-width="6" />
      <circle cx="410" cy="305" r="4.5" fill="#000000" />
      <circle cx="430" cy="305" r="4.5" fill="#000000" />
      <!-- Baffled Wavy Mouth -->
      <path d="M 410,325 Q 420,320 430,325" stroke="#000000" stroke-width="3.5" stroke-linecap="round" fill="none" />

      <!-- Both Hands Pushing the Giant Syringe -->
      <path d="M 420,400 L 375,385 L 340,370" stroke="#000000" stroke-width="6" stroke-linecap="round" fill="none" />

      <!-- Big Metallic Needle Bent in Half upon hitting the BB-pellet -->
      <!-- Syringe Barrel -->
      <rect x="345" y="358" width="45" height="18" rx="3" ry="3" fill="#e2e8f0" stroke="#000000" stroke-width="4" />
      <line x1="390" y1="367" x2="415" y2="367" stroke="#000000" stroke-width="5" stroke-linecap="round" />
      <!-- Needle shaft BENDING backwards! -->
      <path d="M 345,367 L 318,367 Q 312,367 310,355 L 305,335" stroke="#000000" stroke-width="5" stroke-linecap="round" fill="none" />

      <!-- Synchrony High-Yield Badge at Bottom -->
      <g transform="translate(140, 560)">
        <rect x="0" y="0" width="220" height="34" rx="17" ry="17" fill="#0284c7" stroke="#000000" stroke-width="3" />
        <text x="110" y="22" text-anchor="middle" font-family="'Impact', sans-serif" font-size="16" fill="#ffffff" letter-spacing="0.8">ALL AT SAME STAGE!</text>
      </g>
    </g>
  `;
}

// ============================================================================
// 2. Staphylococcus aureus: "HONEY, I'M CRUSTY!"
// Stickman with face covered in golden honey-colored crusts; friendly Staph
// chef stickman pouring honey onto his cheek with a honey dipper!
// ============================================================================
function renderStaphCard() {
  return `
    <g id="staph-card-art">
      <!-- Ground line -->
      <line x1="40" y1="620" x2="460" y2="620" stroke="#000000" stroke-width="5" stroke-linecap="round" />

      <!-- Comic Sparkles ✨ -->
      <g transform="translate(320, 240)">
        <polygon points="0,0 8,15 25,18 12,30 16,46 0,36 -16,46 -12,30 -25,18 -8,15" fill="#f59e0b" stroke="#000000" stroke-width="2.5" />
      </g>
      <g transform="translate(180, 230)">
        <polygon points="0,0 5,10 16,12 8,20 10,30 0,24 -10,30 -8,20 -16,12 -5,10" fill="#fbbf24" stroke="#000000" stroke-width="2" />
      </g>

      <!-- Comic Sound Text: *DRIP!* -->
      <text x="345" y="360" font-family="'Impact', sans-serif" font-size="22" font-weight="900" fill="#d97706" stroke="#000000" stroke-width="3.5" paint-order="stroke fill">DRIP!</text>

      <!-- ============================================== -->
      <!-- Left Stickman: Little Chef Staph aureus        -->
      <!-- ============================================== -->
      <!-- Chef Hat -->
      <path d="M 90,250 C 70,220 90,190 110,200 C 120,180 150,180 155,200 C 175,190 190,220 175,250 Z" fill="#ffffff" stroke="#000000" stroke-width="5" />
      <line x1="90" y1="250" x2="175" y2="250" stroke="#000000" stroke-width="5" />

      <!-- Chef Head -->
      <circle cx="132" cy="285" r="38" fill="#ffffff" stroke="#000000" stroke-width="6" />
      <circle cx="124" cy="280" r="4.5" fill="#000000" />
      <circle cx="144" cy="280" r="4.5" fill="#000000" />
      <!-- Cheerful Chef Smile -->
      <path d="M 124,295 Q 134,310 144,295" stroke="#000000" stroke-width="3.5" stroke-linecap="round" fill="none" />

      <!-- Chef Body & Legs -->
      <path d="M 132,323 L 132,480 L 105,620 M 132,480 L 155,620" stroke="#000000" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      <!-- Chef Arm holding the Honey Dipper -->
      <path d="M 132,360 L 180,350 L 225,320" stroke="#000000" stroke-width="6" stroke-linecap="round" fill="none" />

      <!-- Honey Dipper (Dripping thick golden amber honey) -->
      <rect x="220" y="315" width="40" height="10" rx="3" fill="#b45309" stroke="#000000" stroke-width="3" />
      <circle cx="265" cy="320" r="14" fill="#fbbf24" stroke="#000000" stroke-width="4" />
      <!-- Dripping honey strand -->
      <path d="M 265,334 Q 268,370 262,390" stroke="#f59e0b" stroke-width="6" stroke-linecap="round" fill="none" />

      <!-- Chef's Honey Pot on Floor -->
      <g transform="translate(60, 520)">
        <ellipse cx="35" cy="20" rx="30" ry="12" fill="#d97706" stroke="#000000" stroke-width="4" />
        <path d="M 5,20 L 10,80 Q 35,95 60,80 L 65,20 Z" fill="#f59e0b" stroke="#000000" stroke-width="5" />
        <rect x="15" y="40" width="40" height="22" rx="4" fill="#ffffff" stroke="#000000" stroke-width="2.5" />
        <text x="35" y="56" text-anchor="middle" font-family="'Impact', sans-serif" font-size="12" fill="#b45309">HONEY</text>
      </g>

      <!-- ============================================== -->
      <!-- Center/Right Stickman: Happy Crusty Face       -->
      <!-- ============================================== -->
      <!-- Body & Legs -->
      <path d="M 310,360 L 310,490 L 285,620 M 310,490 L 340,620" stroke="#000000" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      <!-- Thumbs-up Arm -->
      <path d="M 310,390 L 380,410 L 410,370" stroke="#000000" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      <!-- Big Mitten Hand Thumbs-Up -->
      <circle cx="415" cy="365" r="14" fill="#ffffff" stroke="#000000" stroke-width="4.5" />
      <path d="M 415,355 L 415,340" stroke="#000000" stroke-width="5" stroke-linecap="round" />

      <!-- Head (Round circle) -->
      <circle cx="310" cy="280" r="54" fill="#ffffff" stroke="#000000" stroke-width="6" />
      <circle cx="295" cy="265" r="5" fill="#000000" />
      <circle cx="330" cy="265" r="5" fill="#000000" />
      <!-- Cute Smile -->
      <path d="M 295,305 Q 312,325 330,305" stroke="#000000" stroke-width="4.5" stroke-linecap="round" fill="none" />

      <!-- ============================================== -->
      <!-- Interactive: Golden Honey Crust (Impetigo)     -->
      <!-- ============================================== -->
      <g class="interactive-part" data-part-id="honey_crust" title="Honey-Colored Golden Crust">
        <!-- Thick, bubbly, overlapping honey crusts around perioral area -->
        <path d="M 270,290 Q 285,275 305,280 Q 330,270 345,290 Q 355,315 340,335 Q 315,345 285,340 Q 265,325 270,290 Z" 
              fill="#f59e0b" stroke="#000000" stroke-width="5" stroke-linejoin="round" />
        
        <!-- Inner crunchy honey texture -->
        <ellipse cx="300" cy="305" rx="14" ry="8" fill="#fbbf24" stroke="#d97706" stroke-width="2" />
        <ellipse cx="325" cy="315" rx="12" ry="7" fill="#fde047" stroke="#d97706" stroke-width="2" />
        
        <!-- Dripping honey drops from chin -->
        <path d="M 295,340 C 292,365 305,365 300,340 Z" fill="#f59e0b" stroke="#000000" stroke-width="3" />
        <circle cx="300" cy="375" r="5" fill="#fbbf24" stroke="#000000" stroke-width="2.5" />
      </g>

      <!-- Interactive: Subcorneal Cleft (Exfoliative Toxin cleavage) -->
      <g class="interactive-part" data-part-id="subcorneal_cleft" title="Subcorneal Cleavage">
        <path d="M 335,285 Q 355,280 358,295" stroke="#e11d48" stroke-width="4" stroke-linecap="round" fill="none" />
        <text x="390" y="295" font-family="Arial, sans-serif" font-size="10.5" font-weight="800" fill="#e11d48">Subcorneal Split</text>
      </g>

      <!-- Interactive: Coagulase Fibrin Capsule -->
      <g class="interactive-part" data-part-id="fibrin_capsule" title="Coagulase Fibrin Wall">
        <circle cx="310" cy="450" r="22" fill="#ede9fe" stroke="#7c3aed" stroke-width="3.5" stroke-dasharray="5,3" />
        <text x="310" y="454" text-anchor="middle" font-family="'Impact', sans-serif" font-size="11" fill="#6d28d9">COAGULASE</text>
      </g>

      <!-- Big High-Yield Label at Bottom -->
      <g transform="translate(130, 560)">
        <rect x="0" y="0" width="240" height="34" rx="17" ry="17" fill="#d97706" stroke="#000000" stroke-width="3" />
        <text x="120" y="22" text-anchor="middle" font-family="'Impact', sans-serif" font-size="16" fill="#ffffff" letter-spacing="0.8">HONEY-COLORED CRUSTS!</text>
      </g>
    </g>
  `;
}

// ============================================================================
// 3. Bacillus anthracis: "I FEEL NOTHING!"
// Cool stickman with sunglasses & double thumbs-up; coal-black smoking eschar;
// gelatinous jelly swollen arm; attacker's spear does 0 DMG because it's PAINLESS!
// ============================================================================
function renderAnthraxCard() {
  return `
    <g id="anthrax-card-art">
      <!-- Ground line -->
      <line x1="40" y1="620" x2="460" y2="620" stroke="#000000" stroke-width="5" stroke-linecap="round" />

      <!-- Comic Speech Bubble: "I CAN'T FEEL A THING!" -->
      <g transform="translate(230, 160)">
        <path d="M 10,0 L 160,0 Q 170,0 170,10 L 170,50 Q 170,60 160,60 L 40,60 L 20,80 L 28,60 L 10,60 Q 0,60 0,50 L 0,10 Q 0,0 10,0 Z" fill="#ffffff" stroke="#000000" stroke-width="4" />
        <text x="85" y="26" text-anchor="middle" font-family="Arial, sans-serif" font-size="12.5" font-weight="900" fill="#000000">I FEEL NOTHING! :D</text>
        <text x="85" y="45" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" font-weight="800" fill="#15803d">(100% PAINLESS ESCHAR)</text>
      </g>

      <!-- [ 0 DMG ] Comic Shield -->
      <g transform="translate(160, 310)">
        <polygon points="25,0 50,10 50,45 25,60 0,45 0,10" fill="#22c55e" stroke="#000000" stroke-width="3.5" />
        <text x="25" y="36" text-anchor="middle" font-family="'Impact', sans-serif" font-size="15" fill="#ffffff">0 DMG</text>
      </g>

      <!-- ============================================== -->
      <!-- Left Attacker Stickman with Spear              -->
      <!-- ============================================== -->
      <!-- Body & Limbs -->
      <path d="M 90,390 L 90,510 L 60,620 M 90,510 L 115,620" stroke="#000000" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      <!-- Head with Aggressive/Baffled Eyes -->
      <circle cx="90" cy="330" r="36" fill="#ffffff" stroke="#000000" stroke-width="6" />
      <circle cx="82" cy="325" r="4.5" fill="#000000" />
      <circle cx="102" cy="325" r="4.5" fill="#000000" />
      <path d="M 85,345 Q 92,340 100,345" stroke="#000000" stroke-width="3" stroke-linecap="round" fill="none" />
      
      <!-- Hands thrusting spear -->
      <path d="M 90,410 L 130,405 L 185,400" stroke="#000000" stroke-width="6" stroke-linecap="round" fill="none" />
      <!-- Big Sharp Spear Poking the Black Eschar -->
      <line x1="80" y1="415" x2="225" y2="395" stroke="#71717a" stroke-width="5" stroke-linecap="round" />
      <polygon points="238,393 220,385 220,402" fill="#a1a1aa" stroke="#000000" stroke-width="3" />

      <!-- ============================================== -->
      <!-- Center/Right: Cool Stickman with Sunglasses    -->
      <!-- ============================================== -->
      <!-- Body & Legs -->
      <path d="M 330,360 L 330,490 L 305,620 M 330,490 L 360,620" stroke="#000000" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      <!-- Right Thumbs-Up Hand -->
      <path d="M 330,380 L 400,380 L 420,340" stroke="#000000" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      <circle cx="425" cy="335" r="14" fill="#ffffff" stroke="#000000" stroke-width="4.5" />
      <path d="M 425,325 L 425,310" stroke="#000000" stroke-width="5" stroke-linecap="round" />

      <!-- Head (Round circle) -->
      <circle cx="330" cy="280" r="48" fill="#ffffff" stroke="#000000" stroke-width="6" />

      <!-- Cool Black Sunglasses B) -->
      <path d="M 302,272 L 324,272 L 322,286 L 304,286 Z" fill="#000000" />
      <path d="M 334,272 L 356,272 L 354,286 L 336,286 Z" fill="#000000" />
      <line x1="324" y1="274" x2="334" y2="274" stroke="#000000" stroke-width="4" />
      <!-- White specular glint on sunglasses -->
      <line x1="306" y1="275" x2="314" y2="283" stroke="#ffffff" stroke-width="2.5" />
      <line x1="338" y1="275" x2="346" y2="283" stroke="#ffffff" stroke-width="2.5" />

      <!-- Smug Wide Grin -->
      <path d="M 314,302 Q 330,318 346,302" stroke="#000000" stroke-width="4.5" stroke-linecap="round" fill="none" />

      <!-- ============================================== -->
      <!-- Forearm with Massive Gelatinous Edema & Eschar -->
      <!-- ============================================== -->
      <!-- Interactive: Gelatinous Non-Pitting Edema (Jelly swelling) -->
      <g class="interactive-part" data-part-id="gelatinous_edema" title="Gelatinous Non-Pitting Edema">
        <!-- Giant swollen wobbly arm outline -->
        <path d="M 330,390 C 270,360 210,365 200,400 C 195,430 260,450 330,420 Z" 
              fill="#fef08a" opacity="0.85" stroke="#eab308" stroke-width="4" stroke-dasharray="6,4" />
        <!-- Edema Factor label -->
        <text x="245" y="445" font-family="'Impact', sans-serif" font-size="11" fill="#ca8a04">EDEMA FACTOR (EF)</text>
      </g>

      <!-- Arm Bone / Core line -->
      <path d="M 330,390 L 230,400" stroke="#000000" stroke-width="8" stroke-linecap="round" fill="none" />

      <!-- Interactive: Satellite Vesicles Ring -->
      <g class="interactive-part" data-part-id="satellite_vesicles" title="Satellite Vesicle Ring">
        <circle cx="215" cy="378" r="9" fill="#bae6fd" stroke="#000000" stroke-width="3" />
        <circle cx="230" cy="370" r="7" fill="#bae6fd" stroke="#000000" stroke-width="2.5" />
        <circle cx="248" cy="375" r="8" fill="#bae6fd" stroke="#000000" stroke-width="3" />
        <circle cx="255" cy="405" r="8" fill="#bae6fd" stroke="#000000" stroke-width="3" />
        <circle cx="235" cy="425" r="9" fill="#bae6fd" stroke="#000000" stroke-width="3" />
        <circle cx="210" cy="415" r="7" fill="#bae6fd" stroke="#000000" stroke-width="2.5" />
      </g>

      <!-- Interactive: Coal-Black Sunken Eschar -->
      <g class="interactive-part" data-part-id="black_eschar" title="Coal-Black Sunken Eschar">
        <!-- Sunken necrotic black crater -->
        <path d="M 218,390 Q 230,378 244,385 Q 252,400 242,412 Q 228,418 218,405 Z" 
              fill="#18181b" stroke="#000000" stroke-width="5" stroke-linejoin="round" />
        
        <!-- Wisps of Smoke rising from the "Coal" -->
        <path d="M 228,375 Q 222,355 228,340" stroke="#71717a" stroke-width="3" stroke-linecap="round" fill="none" />
        <path d="M 238,375 Q 244,355 238,340" stroke="#71717a" stroke-width="3" stroke-linecap="round" fill="none" />
      </g>

      <!-- Bottom High-Yield Tag -->
      <g transform="translate(130, 560)">
        <rect x="0" y="0" width="240" height="34" rx="17" ry="17" fill="#18181b" stroke="#000000" stroke-width="3" />
        <text x="120" y="22" text-anchor="middle" font-family="'Impact', sans-serif" font-size="16" fill="#facc15" letter-spacing="0.8">BLACK ESCHAR • PAINLESS!</text>
      </g>
    </g>
  `;
}

// ============================================================================
// 4. Treponema pallidum: "HARD AS A ROCK!"
// Whistling stickman tapping his hard cartilaginous chancre with a steel hammer;
// "CLINK! CLINK!" metal sparks fly off because it's button-hard with clean base!
// ============================================================================
function renderSyphilisCard() {
  return `
    <g id="syphilis-card-art">
      <!-- Ground line -->
      <line x1="40" y1="620" x2="460" y2="620" stroke="#000000" stroke-width="5" stroke-linecap="round" />

      <!-- Musical Whistle notes ~♪ -->
      <text x="350" y="210" font-family="'Impact', sans-serif" font-size="28" fill="#0284c7">♪ ♫ ~</text>

      <!-- Comic Sparkles & "CLINK!" on hammer impact -->
      <g transform="translate(180, 310)">
        <polygon points="0,0 15,-10 30,0 20,-15 35,-25 15,-25 0,-40 -5,-25 -25,-25 -10,-15 -20,0" fill="#fef08a" stroke="#000000" stroke-width="3" stroke-linejoin="round"/>
        <text x="8" y="-12" text-anchor="middle" font-family="'Impact', sans-serif" font-size="16" font-weight="900" fill="#b91c1c">CLINK!</text>
      </g>

      <!-- Speech Bubble: "CARTILAGE HARD!" -->
      <g transform="translate(45, 170)">
        <path d="M 10,0 L 150,0 Q 160,0 160,10 L 160,50 Q 160,60 150,60 L 50,60 L 30,80 L 35,60 L 10,60 Q 0,60 0,50 L 0,10 Q 0,0 10,0 Z" fill="#ffffff" stroke="#000000" stroke-width="4" />
        <text x="80" y="26" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="900" fill="#000000">BUTTON INDURATION!</text>
        <text x="80" y="44" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" font-weight="700" fill="#0284c7">(CLEAN RED BASE)</text>
      </g>

      <!-- ============================================== -->
      <!-- Left Stickman: Testing with Hammer             -->
      <!-- ============================================== -->
      <!-- Body & Limbs -->
      <path d="M 120,380 L 120,500 L 95,620 M 120,500 L 145,620" stroke="#000000" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      <!-- Head -->
      <circle cx="120" cy="315" r="38" fill="#ffffff" stroke="#000000" stroke-width="6" />
      <!-- Focused Eyes with safety glasses -->
      <circle cx="112" cy="310" r="4.5" fill="#000000" />
      <circle cx="132" cy="310" r="4.5" fill="#000000" />
      <path d="M 112,328 Q 122,322 132,328" stroke="#000000" stroke-width="3" stroke-linecap="round" fill="none" />

      <!-- Arms swinging steel hammer down onto the ulcer rim -->
      <path d="M 120,390 L 165,370 L 195,335" stroke="#000000" stroke-width="6" stroke-linecap="round" fill="none" />
      <!-- Steel Hammer -->
      <line x1="170" y1="360" x2="210" y2="310" stroke="#71717a" stroke-width="5" stroke-linecap="round" />
      <rect x="200" y="295" width="26" height="18" rx="2" fill="#94a3b8" stroke="#000000" stroke-width="3.5" transform="rotate(-35 210 305)" />

      <!-- ============================================== -->
      <!-- Right Whistling Stickman (Unbothered)          -->
      <!-- ============================================== -->
      <!-- Body & Limbs -->
      <path d="M 320,350 L 320,480 L 295,620 M 320,480 L 350,620" stroke="#000000" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      <!-- Hands resting comfortably on hips -->
      <path d="M 320,380 L 370,410 L 335,430" stroke="#000000" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none" />

      <!-- Head (Round circle) -->
      <circle cx="320" cy="270" r="48" fill="#ffffff" stroke="#000000" stroke-width="6" />
      <!-- Whistling Eyes & Round "O" Mouth -->
      <circle cx="308" cy="260" r="4.5" fill="#000000" />
      <circle cx="334" cy="260" r="4.5" fill="#000000" />
      <circle cx="324" cy="285" r="7" fill="#000000" />

      <!-- ============================================== -->
      <!-- Center: Giant Hard Chancre Ulcer               -->
      <!-- ============================================== -->
      <!-- Thigh hosting the chancre -->
      <path d="M 320,440 L 240,430" stroke="#000000" stroke-width="8" stroke-linecap="round" fill="none" />

      <!-- Interactive: Indurated Rim (Button-Hard Cartilage Margin) -->
      <g class="interactive-part" data-part-id="indurated_rim" title="Indurated Elevated Margin">
        <!-- Elevated rolled border -->
        <ellipse cx="230" cy="420" rx="52" ry="34" fill="#bae6fd" stroke="#0284c7" stroke-width="6" />
        <text x="230" y="380" text-anchor="middle" font-family="'Impact', sans-serif" font-size="11" fill="#0369a1">INDURATED RIM</text>
      </g>

      <!-- Interactive: Clean Ulcer Base (No Pus, Pristine Granulation) -->
      <g class="interactive-part" data-part-id="clean_ulcer_base" title="Clean Granulating Ulcer Bed">
        <!-- Perfectly clean, red granulating ulcer floor -->
        <ellipse cx="230" cy="420" rx="36" ry="22" fill="#f43f5e" stroke="#000000" stroke-width="4" />
        <ellipse cx="225" cy="415" rx="12" ry="6" fill="#fb7185" opacity="0.8" />
        <text x="230" y="425" text-anchor="middle" font-family="Arial, sans-serif" font-size="10.5" font-weight="900" fill="#ffffff">CLEAN BASE</text>
      </g>

      <!-- Interactive: Endarteritis Obliterans vessels -->
      <g class="interactive-part" data-part-id="endarteritis_vessels" title="Endarteritis Obliterans">
        <circle cx="230" cy="475" r="14" fill="#ede9fe" stroke="#9333ea" stroke-width="3" stroke-dasharray="3,2" />
        <circle cx="230" cy="475" r="4" fill="#9333ea" />
        <text x="230" y="505" text-anchor="middle" font-family="Arial, sans-serif" font-size="9.5" font-weight="800" fill="#7e22ce">Endarteritis</text>
      </g>

      <!-- Bottom High-Yield Tag -->
      <g transform="translate(130, 560)">
        <rect x="0" y="0" width="240" height="34" rx="17" ry="17" fill="#0284c7" stroke="#000000" stroke-width="3" />
        <text x="120" y="22" text-anchor="middle" font-family="'Impact', sans-serif" font-size="16" fill="#ffffff" letter-spacing="0.8">HARD CHANCRE • CLEAN BASE</text>
      </g>
    </g>
  `;
}

// ============================================================================
// 5. Varicella-Zoster Virus: "DEW DROP DRAMA!"
// Stickman gardener watering a giant rose petal; atop it sits a crystal-clear
// crying dew drop; 3 rash dots argue: "Macule!", "Papule!", "Crust!" (Pleomorphic)
// ============================================================================
function renderVZVCard() {
  return `
    <g id="vzv-card-art">
      <!-- Ground line -->
      <line x1="40" y1="620" x2="460" y2="620" stroke="#000000" stroke-width="5" stroke-linecap="round" />

      <!-- Speech Bubbles from Arguing Rash Dots -->
      <g transform="translate(320, 150)">
        <path d="M 0,0 L 110,0 Q 120,0 120,10 L 120,35 Q 120,45 110,45 L 20,45 L 10,60 L 15,45 L 0,45 Q -10,45 -10,35 L -10,10 Q -10,0 0,0 Z" fill="#ffffff" stroke="#000000" stroke-width="3.5" />
        <text x="55" y="22" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" font-weight="900" fill="#e11d48">"I'M A MACULE!"</text>
        <text x="55" y="36" text-anchor="middle" font-family="Arial, sans-serif" font-size="9" font-weight="700" fill="#64748b">DIFFERENT STAGES!</text>
      </g>

      <!-- ============================================== -->
      <!-- Left Stickman: Gardener Watering the Petal     -->
      <!-- ============================================== -->
      <!-- Body & Limbs -->
      <path d="M 110,370 L 110,490 L 85,620 M 110,490 L 135,620" stroke="#000000" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      <!-- Head with Cheerful Gardener Hat -->
      <path d="M 75,260 L 145,260 L 135,240 L 85,240 Z" fill="#facc15" stroke="#000000" stroke-width="4" />
      <circle cx="110" cy="290" r="36" fill="#ffffff" stroke="#000000" stroke-width="6" />
      <circle cx="102" cy="285" r="4.5" fill="#000000" />
      <circle cx="122" cy="285" r="4.5" fill="#000000" />
      <path d="M 102,305 Q 112,315 122,305" stroke="#000000" stroke-width="3" stroke-linecap="round" fill="none" />

      <!-- Arms holding Watering Can -->
      <path d="M 110,390 L 150,380 L 180,360" stroke="#000000" stroke-width="6" stroke-linecap="round" fill="none" />
      <!-- Watering Can (Green) -->
      <rect x="175" y="340" width="35" height="28" rx="4" fill="#22c55e" stroke="#000000" stroke-width="3.5" />
      <path d="M 210,350 L 235,335" stroke="#000000" stroke-width="4" stroke-linecap="round" />
      <!-- Falling droplets -->
      <circle cx="242" cy="345" r="3" fill="#38bdf8" />
      <circle cx="248" cy="360" r="3.5" fill="#38bdf8" />

      <!-- ============================================== -->
      <!-- Center: Giant Rose Petal & Crystal Dew Drop    -->
      <!-- ============================================== -->
      <!-- Interactive: Rose-Petal Erythematous Base -->
      <g class="interactive-part" data-part-id="erythematous_base" title="Rose-Petal Erythematous Base">
        <!-- Giant luscious red-pink rose petal -->
        <path d="M 200,450 C 210,380 340,370 370,440 C 370,490 220,510 200,450 Z" 
              fill="#fb7185" stroke="#e11d48" stroke-width="6" stroke-linejoin="round" />
        <path d="M 230,445 Q 285,465 340,435" stroke="#e11d48" stroke-width="3.5" stroke-linecap="round" fill="none" />
        <text x="285" y="485" text-anchor="middle" font-family="'Impact', sans-serif" font-size="12" fill="#9f1239">ROSE PETAL BASE</text>
      </g>

      <!-- Interactive: Clear Dew-Drop Blister (Teardrop vesicle) -->
      <g class="interactive-part" data-part-id="clear_vesicle" title="Crystal-Clear Dew-Drop Blister">
        <!-- Crystal clear water droplet teardrop shape -->
        <path d="M 285,270 C 255,320 235,360 235,385 C 235,420 260,435 285,435 C 310,435 335,420 335,385 C 335,360 315,320 285,270 Z" 
              fill="#bae6fd" stroke="#00a8e8" stroke-width="6" stroke-linejoin="round" />
        
        <!-- Glass reflections on dew drop -->
        <path d="M 260,340 Q 252,370 258,390" stroke="#ffffff" stroke-width="5" stroke-linecap="round" fill="none" />
        <circle cx="310" cy="350" r="5" fill="#ffffff" />
        
        <!-- Cute Little Cartoon Face on the Dew Drop! -->
        <circle cx="275" cy="380" r="3.5" fill="#0369a1" />
        <circle cx="295" cy="380" r="3.5" fill="#0369a1" />
        <path d="M 280,395 Q 285,402 290,395" stroke="#0369a1" stroke-width="2.5" stroke-linecap="round" fill="none" />
      </g>

      <!-- Interactive: Multinucleated Giant Cells (Tzanck Smear) -->
      <g class="interactive-part" data-part-id="giant_cells" title="Multinucleated Giant Cells">
        <g transform="translate(390, 360)">
          <ellipse cx="25" cy="25" rx="30" ry="22" fill="#ede9fe" stroke="#8b5cf6" stroke-width="3.5" />
          <circle cx="15" cy="20" r="6" fill="#6d28d9" />
          <circle cx="30" cy="18" r="5" fill="#6d28d9" />
          <circle cx="24" cy="30" r="6" fill="#6d28d9" />
          <text x="25" y="58" text-anchor="middle" font-family="Arial, sans-serif" font-size="9.5" font-weight="900" fill="#6d28d9">TZANCK (+)</text>
        </g>
      </g>

      <!-- Arguing rash dots in background -->
      <!-- Macule -->
      <circle cx="380" cy="230" r="9" fill="#f43f5e" stroke="#000000" stroke-width="2.5" />
      <!-- Papule -->
      <path d="M 405,250 Q 415,230 425,250 Z" fill="#fb923c" stroke="#000000" stroke-width="2.5" />
      <!-- Crust -->
      <rect x="430" y="240" width="16" height="10" rx="3" fill="#a16207" stroke="#000000" stroke-width="2.5" />

      <!-- Bottom High-Yield Tag -->
      <g transform="translate(110, 560)">
        <rect x="0" y="0" width="280" height="34" rx="17" ry="17" fill="#e11d48" stroke="#000000" stroke-width="3" />
        <text x="140" y="22" text-anchor="middle" font-family="'Impact', sans-serif" font-size="16" fill="#ffffff" letter-spacing="0.8">DEW DROPS ON A ROSE PETAL!</text>
      </g>
    </g>
  `;
}

// ============================================================================
// 6. Borrelia burgdorferi: "TARGET PRACTICE!"
// Stickman standing confused; on his thigh is a giant red bull's-eye target;
// an arrow is stuck in the center; a tiny tick with bow shouts "BULLSEYE! 🎯"
// ============================================================================
function renderLymeCard() {
  return `
    <g id="lyme-card-art">
      <!-- Ground line -->
      <line x1="40" y1="620" x2="460" y2="620" stroke="#000000" stroke-width="5" stroke-linecap="round" />

      <!-- Comic Bubble: "BULLSEYE! 🎯" -->
      <g transform="translate(330, 200)">
        <polygon points="0,0 20,-15 50,-10 70,-30 75,-10 100,-15 85,15 100,35 65,25 50,45 35,25 0,0" fill="#fef08a" stroke="#000000" stroke-width="3.5" stroke-linejoin="round"/>
        <text x="50" y="10" text-anchor="middle" font-family="'Impact', sans-serif" font-size="16" font-weight="900" fill="#dc2626">BULLSEYE!</text>
      </g>

      <!-- ============================================== -->
      <!-- Center Stickman: Looking Down at Rash o_O       -->
      <!-- ============================================== -->
      <!-- Body & Limbs -->
      <path d="M 210,290 L 210,420 L 175,620 M 210,420 L 245,620" stroke="#000000" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      
      <!-- Hands on Hips -->
      <path d="M 210,320 L 160,350 L 190,380" stroke="#000000" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      <path d="M 210,320 L 260,350 L 230,380" stroke="#000000" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none" />

      <!-- Head (Round circle tilted looking down) -->
      <circle cx="210" cy="220" r="46" fill="#ffffff" stroke="#000000" stroke-width="6" />
      <!-- Eyes Looking Down at the Giant Target on Thigh -->
      <circle cx="200" cy="225" r="5" fill="#000000" />
      <circle cx="225" cy="225" r="5" fill="#000000" />
      <!-- Perplexed Wavy Mouth -->
      <path d="M 200,245 Q 212,238 225,245" stroke="#000000" stroke-width="4" stroke-linecap="round" fill="none" />

      <!-- ============================================== -->
      <!-- Giant Erythema Migrans (Bull's-Eye Target Rash)-->
      <!-- ============================================== -->
      <g transform="translate(230, 470)">
        <!-- Interactive: Expanding Annular Red Border -->
        <g class="interactive-part" data-part-id="expanding_border" title="Expanding Annular Red Border">
          <circle cx="0" cy="0" r="85" fill="#fee2e2" stroke="#ef4444" stroke-width="12" />
          <!-- Expanding directional arrows -->
          <path d="M -85,0 L -100,0 M -93,-5 L -100,0 L -93,5" stroke="#ef4444" stroke-width="3" stroke-linecap="round" />
          <path d="M 85,0 L 100,0 M 93,-5 L 100,0 L 93,5" stroke="#ef4444" stroke-width="3" stroke-linecap="round" />
          <text x="0" y="-95" text-anchor="middle" font-family="'Impact', sans-serif" font-size="11" fill="#dc2626">&gt; 5 CM EXPANSION</text>
        </g>

        <!-- Interactive: Intermediate Clearing Ring -->
        <g class="interactive-part" data-part-id="clearing_zone" title="Intermediate Clearing Ring">
          <circle cx="0" cy="0" r="55" fill="#ffffff" stroke="#fca5a5" stroke-width="4" />
          <text x="0" y="40" text-anchor="middle" font-family="Arial, sans-serif" font-size="9" font-weight="800" fill="#94a3b8">CLEARING</text>
        </g>

        <!-- Interactive: Central Bite Papule with Arrow Stuck In It -->
        <g class="interactive-part" data-part-id="central_bite" title="Central Punctum / Bite Papule">
          <circle cx="0" cy="0" r="22" fill="#ef4444" stroke="#991b1b" stroke-width="4" />
          <circle cx="0" cy="0" r="8" fill="#7f1d1d" />

          <!-- Arrow stuck right in the bullseye center! -->
          <line x1="0" y1="0" x2="45" y2="-45" stroke="#78350f" stroke-width="4.5" stroke-linecap="round" />
          <!-- Arrow fletching/feathers -->
          <polygon points="45,-45 55,-55 45,-58" fill="#ef4444" stroke="#000000" stroke-width="1.5" />
          <polygon points="45,-45 58,-45 55,-35" fill="#ef4444" stroke="#000000" stroke-width="1.5" />
        </g>
      </g>

      <!-- ============================================== -->
      <!-- Right Side: Tiny Archer Tick (Ixodes)          -->
      <!-- ============================================== -->
      <g transform="translate(390, 480)">
        <!-- Tick Body (Chubby teardrop) -->
        <ellipse cx="20" cy="30" rx="18" ry="24" fill="#78350f" stroke="#000000" stroke-width="4" />
        <!-- Tick Legs (8 legs for arachnid!) -->
        <path d="M 5,20 L -8,12 M 5,30 L -12,28 M 5,40 L -8,48" stroke="#000000" stroke-width="3" stroke-linecap="round" />
        <path d="M 35,20 L 48,12 M 35,30 L 52,28 M 35,40 L 48,48" stroke="#000000" stroke-width="3" stroke-linecap="round" />
        
        <!-- Archer Robin Hood Hat with Green Feather -->
        <path d="M 5,12 L 35,12 L 20, -5 Z" fill="#15803d" stroke="#000000" stroke-width="2.5" />
        <path d="M 22,-3 Q 28,-18 35,-15" stroke="#ef4444" stroke-width="3" stroke-linecap="round" fill="none" />

        <!-- Cute Cheerful Tick Face -->
        <circle cx="15" cy="22" r="3" fill="#ffffff" />
        <circle cx="15" cy="22" r="1.5" fill="#000000" />
        <circle cx="25" cy="22" r="3" fill="#ffffff" />
        <circle cx="25" cy="22" r="1.5" fill="#000000" />
        <path d="M 16,32 Q 20,36 24,32" stroke="#000000" stroke-width="2" stroke-linecap="round" fill="none" />

        <!-- Tiny Bow in Hand -->
        <path d="M -15,0 Q -25,25 -15,50" stroke="#b45309" stroke-width="3.5" stroke-linecap="round" fill="none" />
        <line x1="-15" y1="0" x2="-15" y2="50" stroke="#000000" stroke-width="1.5" />

        <!-- Label: Ixodes Tick -->
        <text x="20" y="70" text-anchor="middle" font-family="'Impact', sans-serif" font-size="11" fill="#78350f">IXODES TICK</text>
      </g>

      <!-- Bottom High-Yield Tag -->
      <g transform="translate(120, 560)">
        <rect x="0" y="0" width="260" height="34" rx="17" ry="17" fill="#ef4444" stroke="#000000" stroke-width="3" />
        <text x="130" y="22" text-anchor="middle" font-family="'Impact', sans-serif" font-size="16" fill="#ffffff" letter-spacing="0.8">ERYTHEMA MIGRANS BULL'S-EYE!</text>
      </g>
    </g>
  `;
}

// ============================================================================
// 7. Candida albicans: "SCRAPE IT OFF!"
// Stickman sticking out huge pink tongue covered in cottage cheese plaques;
// he is scraping them off with a spoon into a bowl; underlying red surface
// weeps blood: "OUCH! IT BLEEDS! (IT SCRAPES OFF!)" vs grumpy Leukoplakia
// ============================================================================
function renderCandidaCard() {
  return `
    <g id="candida-card-art">
      <!-- Ground line -->
      <line x1="40" y1="620" x2="460" y2="620" stroke="#000000" stroke-width="5" stroke-linecap="round" />

      <!-- Comic Bubble: "IT SCRAPES OFF!" -->
      <g transform="translate(260, 160)">
        <path d="M 10,0 L 160,0 Q 170,0 170,10 L 170,50 Q 170,60 160,60 L 50,60 L 30,80 L 35,60 L 10,60 Q 0,60 0,50 L 0,10 Q 0,0 10,0 Z" fill="#ffffff" stroke="#000000" stroke-width="4" />
        <text x="85" y="26" text-anchor="middle" font-family="Arial, sans-serif" font-size="12.5" font-weight="900" fill="#dc2626">IT SCRAPES OFF & BLEEDS!</text>
        <text x="85" y="45" text-anchor="middle" font-family="Arial, sans-serif" font-size="10.5" font-weight="800" fill="#64748b">(VS LEUKOPLAKIA = NO BLEED)</text>
      </g>

      <!-- ============================================== -->
      <!-- Center Stickman sticking out his giant tongue  -->
      <!-- ============================================== -->
      <!-- Body & Limbs -->
      <path d="M 170,360 L 170,490 L 140,620 M 170,490 L 195,620" stroke="#000000" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      
      <!-- Arm holding Spoon scraping tongue -->
      <path d="M 170,390 L 225,370 L 260,340" stroke="#000000" stroke-width="7" stroke-linecap="round" fill="none" />
      <!-- Silver Spoon -->
      <line x1="240" y1="360" x2="275" y2="330" stroke="#94a3b8" stroke-width="5" stroke-linecap="round" />
      <ellipse cx="282" cy="324" rx="10" ry="7" fill="#cbd5e1" stroke="#000000" stroke-width="3" transform="rotate(-40 282 324)" />

      <!-- Head (Round circle) -->
      <circle cx="170" cy="270" r="50" fill="#ffffff" stroke="#000000" stroke-width="6" />
      <!-- Eyes looking down at tongue -->
      <circle cx="160" cy="255" r="5" fill="#000000" />
      <circle cx="188" cy="255" r="5" fill="#000000" />
      <!-- Wide open mouth with tongue sticking out -->
      <path d="M 145,285 Q 170,310 195,285 Z" fill="#000000" />

      <!-- ============================================== -->
      <!-- Giant Pink Tongue with Candida Curds           -->
      <!-- ============================================== -->
      <!-- Tongue Base Contour -->
      <path d="M 160,295 C 160,350 200,430 250,440 C 300,445 320,390 285,340 C 265,310 195,295 180,295 Z" 
            fill="#fb7185" stroke="#000000" stroke-width="6" stroke-linejoin="round" />

      <!-- Interactive: Underlying Erythematous Mucosa (Where scraped off) -->
      <g class="interactive-part" data-part-id="erythematous_mucosa" title="Underlying Erythematous Mucosa">
        <!-- Raw bleeding red ulcerated patch exposed by spoon -->
        <path d="M 230,345 Q 260,335 270,365 Q 245,375 230,345 Z" fill="#dc2626" stroke="#991b1b" stroke-width="3" />
        <!-- Little blood droplets weeping from raw base -->
        <circle cx="245" cy="358" r="4" fill="#b91c1c" />
        <circle cx="260" cy="352" r="3.5" fill="#b91c1c" />
        <path d="M 245,362 Q 248,375 244,382" stroke="#dc2626" stroke-width="2.5" stroke-linecap="round" fill="none" />
        <text x="255" y="320" text-anchor="middle" font-family="'Impact', sans-serif" font-size="11" fill="#dc2626">RAW & BLEEDING!</text>
      </g>

      <!-- Interactive: White Curd Pseudomembranous Plaques -->
      <g class="interactive-part" data-part-id="white_curds" title="White Curd-like Pseudomembranous Plaques">
        <!-- Clumpy, fluffy cottage-cheese curd clusters -->
        <!-- Cluster 1 -->
        <ellipse cx="210" cy="350" rx="16" ry="10" fill="#ffffff" stroke="#000000" stroke-width="3.5" />
        <ellipse cx="222" cy="345" rx="10" ry="7" fill="#ffffff" stroke="#000000" stroke-width="3" />
        <!-- Cluster 2 -->
        <ellipse cx="245" cy="395" rx="20" ry="12" fill="#ffffff" stroke="#000000" stroke-width="3.5" />
        <ellipse cx="265" cy="405" rx="14" ry="9" fill="#ffffff" stroke="#000000" stroke-width="3" />
        <!-- Cluster 3 -->
        <ellipse cx="225" cy="410" rx="12" ry="8" fill="#ffffff" stroke="#000000" stroke-width="3" />

        <!-- Scraped curd chunk flying off -->
        <ellipse cx="295" cy="315" rx="9" ry="6" fill="#ffffff" stroke="#000000" stroke-width="2.5" />
        <!-- Action speed lines -->
        <line x1="285" y1="322" x2="295" y2="315" stroke="#64748b" stroke-width="2" />
      </g>

      <!-- Cereal Bowl of Scraped "Cottage Cheese" on floor -->
      <g transform="translate(270, 520)">
        <ellipse cx="35" cy="20" rx="30" ry="10" fill="#e2e8f0" stroke="#000000" stroke-width="3.5" />
        <path d="M 5,20 Q 5,60 35,60 Q 65,60 65,20 Z" fill="#38bdf8" stroke="#000000" stroke-width="4" />
        <!-- Heaping pile of white curds -->
        <ellipse cx="35" cy="18" rx="22" ry="12" fill="#ffffff" stroke="#000000" stroke-width="3" />
        <text x="35" y="44" text-anchor="middle" font-family="'Impact', sans-serif" font-size="10.5" fill="#ffffff">CURD PLAQUE</text>
      </g>

      <!-- ============================================== -->
      <!-- Right Side: Grumpy Leukoplakia Stickman        -->
      <!-- ============================================== -->
      <g transform="translate(380, 360)">
        <!-- Head -->
        <circle cx="30" cy="0" r="30" fill="#ffffff" stroke="#000000" stroke-width="5" />
        <!-- Grumpy Face -->
        <circle cx="22" cy="-5" r="3.5" fill="#000000" />
        <circle cx="38" cy="-5" r="3.5" fill="#000000" />
        <!-- Down-turned frown -->
        <path d="M 20,12 Q 30,5 40,12" stroke="#000000" stroke-width="3" stroke-linecap="round" fill="none" />
        <!-- Fixed White Patch on his tongue (Leukoplakia) -->
        <rect x="24" y="16" width="12" height="6" fill="#e2e8f0" stroke="#000000" stroke-width="2" />
        
        <!-- Speech Bubble: "CANNOT SCRAPE :(" -->
        <text x="30" y="-40" text-anchor="middle" font-family="Arial, sans-serif" font-size="9.5" font-weight="800" fill="#64748b">LEUKOPLAKIA:</text>
        <text x="30" y="-28" text-anchor="middle" font-family="Arial, sans-serif" font-size="9" font-weight="700" fill="#64748b">CANNOT SCRAPE!</text>

        <!-- Crossed Arms -->
        <path d="M 30,30 L 30,110 L 15,200 M 30,110 L 45,200" stroke="#000000" stroke-width="5" stroke-linecap="round" fill="none" />
        <path d="M 10,50 L 50,50" stroke="#000000" stroke-width="6" stroke-linecap="round" />
      </g>

      <!-- Bottom High-Yield Tag -->
      <g transform="translate(120, 560)">
        <rect x="0" y="0" width="260" height="34" rx="17" ry="17" fill="#dc2626" stroke="#000000" stroke-width="3" />
        <text x="130" y="22" text-anchor="middle" font-family="'Impact', sans-serif" font-size="16" fill="#ffffff" letter-spacing="0.8">SCRAPES OFF & REVEALS BLOOD!</text>
      </g>
    </g>
  `;
}

// ----------------------------------------------------------------------------
// Fallback Default Card
// ----------------------------------------------------------------------------
function renderDefaultCard(microbe) {
  return `
    <g id="default-card-art">
      <circle cx="250" cy="360" r="120" fill="#f8fafc" stroke="#000000" stroke-width="6" />
      <text x="250" y="370" text-anchor="middle" font-family="'Impact', sans-serif" font-size="28" fill="#0284c7">
        ${escapeXml(microbe.name)}
      </text>
    </g>
  `;
}
