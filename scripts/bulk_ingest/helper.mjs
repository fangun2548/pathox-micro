/**
 * Helper to build 100% schema-compliant Pathox-Micro pathogen records
 * adhering to all 5 NL1/USMLE medical dimensions + Atomic Flashcard fields.
 */

const CATEGORY_META = {
  bacteria: { label: 'แบคทีเรีย (Bacteria)', badge: 'BACTERIA', defaultColor: '#0284c7' },
  virus:    { label: 'ไวรัส (Viruses)',      badge: 'VIRUS',    defaultColor: '#7c3aed' },
  fungi:    { label: 'เชื้อรา (Fungi)',      badge: 'FUNGI',    defaultColor: '#d97706' },
  parasite: { label: 'ปรสิต (Parasites)',    badge: 'PARASITE', defaultColor: '#059669' }
};

export function makePathogen(s) {
  const cat = CATEGORY_META[s.category] || CATEGORY_META.bacteria;
  const imgFile = `${s.id.replace(/-/g, '_')}_case1.jpg`;

  return {
    id: s.id,
    name: s.name,
    thaiName: s.thaiName,
    scientificName: s.scientificName,
    category: s.category,
    categoryLabel: cat.label,
    cardTitle: s.cardTitle || s.name.toUpperCase(),
    cardSubtitle: s.cardSubtitle || s.lesionThai,
    cardBadge: cat.badge,
    lesionTitle: s.lesionTitle,
    lesionThai: s.lesionThai,
    badgeColor: s.badgeColor || cat.defaultColor,
    quickStats: {
      depth: s.severe,
      morphology: s.mild,
      palpation: s.palpation || s.lesionTitle,
      distribution: s.distribution || 'อวัยวะเป้าหมายหลักตามพยาธิสภาพของเชื้อ',
      epidemiology: s.transmission
    },
    flashcard: {
      mild: s.mild,
      severe: s.severe,
      doc: s.fcDoc,
      pregnancy: s.fcPreg,
      allergy: s.fcAlt
    },
    morphologicalParts: s.parts || [
      {
        id: `${s.id}_primary`,
        name: s.lesionTitle,
        thaiName: s.lesionThai,
        color: s.badgeColor || cat.defaultColor,
        description: s.mild
      },
      {
        id: `${s.id}_severe`,
        name: 'Invasive / Severe Manifestation',
        thaiName: 'อาการรุนแรง / ภาวะแทรกซ้อนสำคัญ',
        color: '#e11d48',
        description: s.severe
      }
    ],
    clinicalCases: [
      {
        id: `${s.id}-case-1`,
        title: `Case 1: ${s.lesionTitle} (${s.thaiName})`,
        badge: `เคสที่ 1: ${s.lesionTitle}`,
        caption: s.lesionThai,
        imageQueries: s.imageQueries,
        localFileName: imgFile,
        image: `assets/images/clinical/${imgFile}`,
        source: s.sourceFallback || 'Wikimedia Commons / CDC Public Health Image Library (PHIL)',
        description: `${s.lesionThai} — ${s.mild} หากลุกลามรุนแรงอาจเกิด ${s.severe}`,
        keyFindings: s.keyFindings || [s.lesionTitle, s.staining]
      }
    ],
    tabs: {
      morphology: {
        overview: `${s.lesionThai} · ${s.mild}`,
        keyFeatures: [s.lesionTitle, s.mild, s.severe]
      },
      pathogenesis: {
        virulenceFactors: s.vf.map(([name, mechanism]) => ({ name, mechanism })),
        immuneEvasion: s.immune,
        transmission: s.transmission
      },
      diagnosis: {
        staining: s.staining,
        stains: [s.staining],
        culture: Array.isArray(s.culture) ? s.culture : [s.culture],
        biochemical: Array.isArray(s.biochem) ? s.biochem : [s.biochem]
      },
      clinical: {
        boardBuzzwords: s.buzzwords,
        classicVignette: s.vignette,
        riskGroups: s.riskGroups || ['ผู้ป่วยกลุ่มเสี่ยงและภูมิคุ้มกันบกพร่อง']
      },
      treatment: {
        firstLine: s.firstLine,
        alternative: s.alternative,
        childrenPregnant: s.fcPreg,
        resistance: s.resistance
      }
    }
  };
}
