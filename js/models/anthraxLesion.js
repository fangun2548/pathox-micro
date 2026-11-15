// ============================================================================
// Anthrax Lesion · 3D Clinical Lesion (Black Eschar & Gelatinous Edema)
// Kurzgesagt Cel-Shaded Skin Block with Sunken Necrotic Coal Eschar & Satellite Vesicles
// ============================================================================

import * as THREE from 'three';
import { createKurzgesagtMesh, createKurzgesagtMaterial } from '../toonMaterials.js';

export function createAnthraxLesionModel() {
  const rootGroup = new THREE.Group();
  rootGroup.name = "anthrax-black-eschar";

  // Palette: Coal-Black, Gelatinous Edema Amber, and Satellite Cyan
  const EPIDERMIS_COLOR = 0xfecdd3;       // Skin epidermis
  const DERMIS_COLOR = 0xfb7185;          // Vascular dermis
  const SUBCUTIS_COLOR = 0xfef08a;        // Fat layer
  const BLACK_ESCHAR_COLOR = 0x18181b;    // Sunken Coal-Black Necrotic Eschar
  const SATELLITE_VESICLE_COLOR = 0x38bdf8;// Serous satellite vesicles
  const GELATINOUS_EDEMA_COLOR = 0xfde68a; // Pale jelly-like non-pitting edema
  const NECROTIC_DERMIS_COLOR = 0x78716c; // Thrombosed ischemic necrosis

  // Dimensions of Swollen Skin Block (Notice thicker dermis from Edema Factor!)
  const blockW = 4.8;
  const blockD = 3.8;
  const blockH_Epi = 0.45;
  const blockH_Der = 1.45; // Swollen by edema
  const blockH_Fat = 0.7;
  const totalH = blockH_Epi + blockH_Der + blockH_Fat;

  // Containers
  const backSkinGroup = new THREE.Group();
  backSkinGroup.name = "anthrax-back-half";
  const frontSkinGroup = new THREE.Group();
  frontSkinGroup.name = "anthrax-front-half";
  const internalsGroup = new THREE.Group();
  internalsGroup.name = "anthrax-internals";

  rootGroup.add(backSkinGroup);
  rootGroup.add(frontSkinGroup);
  rootGroup.add(internalsGroup);

  // --------------------------------------------------------------------------
  // 1. Skin Block Slices (with Gelatinous Swelling)
  // --------------------------------------------------------------------------
  function createSkinBlockHalf(isFront = false) {
    const halfGroup = new THREE.Group();
    const halfD = blockD * 0.5;
    const zOffset = isFront ? halfD * 0.5 : -halfD * 0.5;

    // Fat (Bottom)
    const fatGeom = new THREE.BoxGeometry(blockW, blockH_Fat, halfD);
    const fatMesh = createKurzgesagtMesh(fatGeom, SUBCUTIS_COLOR, {
      partId: "gelatinous_edema",
      partName: "Subcutaneous Bed",
      outlineThickness: 0.03
    });
    fatMesh.position.set(0, -totalH * 0.5 + blockH_Fat * 0.5, 0);
    halfGroup.add(fatMesh);

    // Swollen Edematous Dermis (Middle)
    const dermGeom = new THREE.BoxGeometry(blockW, blockH_Der, halfD);
    const dermMesh = createKurzgesagtMesh(dermGeom, GELATINOUS_EDEMA_COLOR, {
      partId: "gelatinous_edema",
      partName: "Gelatinous Non-Pitting Dermal Edema (EF Toxin)",
      outlineThickness: 0.03
    });
    dermMesh.position.set(0, -totalH * 0.5 + blockH_Fat + blockH_Der * 0.5, 0);
    halfGroup.add(dermMesh);

    // Epidermis (Top)
    const epiGeom = new THREE.BoxGeometry(blockW, blockH_Epi, halfD);
    const epiMesh = createKurzgesagtMesh(epiGeom, EPIDERMIS_COLOR, {
      partId: "satellite_vesicles",
      partName: "Stretched Epidermal Surface",
      outlineThickness: 0.03
    });
    epiMesh.position.set(0, totalH * 0.5 - blockH_Epi * 0.5, 0);
    halfGroup.add(epiMesh);

    halfGroup.position.z = zOffset;
    return halfGroup;
  }

  const backSkin = createSkinBlockHalf(false);
  backSkinGroup.add(backSkin);

  const frontSkin = createSkinBlockHalf(true);
  frontSkinGroup.add(frontSkin);

  // --------------------------------------------------------------------------
  // 2. Central Coal-Black Sunken Eschar (สะเก็ดเนื้อตายสีดำสนิท)
  // --------------------------------------------------------------------------
  // The eschar is tough, dry, irregular, and slightly sunken (depressed crater)
  const escharRadius = 1.15;
  const escharGeom = new THREE.CylinderGeometry(escharRadius, escharRadius * 1.1, 0.22, 18);
  const escharMesh = createKurzgesagtMesh(escharGeom, BLACK_ESCHAR_COLOR, {
    partId: "black_eschar",
    partName: "Coal-Black Necrotic Eschar (Lethal Factor)",
    outlineThickness: 0.035
  });
  escharMesh.position.set(0, totalH * 0.5 + 0.04, 0);
  rootGroup.add(escharMesh);

  // Inner textured coal facets
  const coalFacetGeom = new THREE.DodecahedronGeometry(0.55, 0);
  coalFacetGeom.scale(1.4, 0.25, 1.4);
  const coalFacet = createKurzgesagtMesh(coalFacetGeom, BLACK_ESCHAR_COLOR, {
    partId: "black_eschar",
    partName: "Charcoal Crust Surface",
    outlineThickness: 0.02
  });
  coalFacet.position.set(0, totalH * 0.5 + 0.16, 0);
  rootGroup.add(coalFacet);

  // --------------------------------------------------------------------------
  // 3. Ring of Satellite Vesicles (วงตุ่มน้ำใสบริวาร)
  // --------------------------------------------------------------------------
  const satelliteGroup = new THREE.Group();
  satelliteGroup.name = "satellite-vesicles";
  const numSatellites = 12;
  const satelliteRadius = escharRadius + 0.38;

  for (let i = 0; i < numSatellites; i++) {
    const angle = (i / numSatellites) * Math.PI * 2;
    const vGeom = new THREE.SphereGeometry(0.18, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const vMesh = createKurzgesagtMesh(vGeom, SATELLITE_VESICLE_COLOR, {
      partId: "satellite_vesicles",
      partName: "Satellite Vesicle (Hemorrhagic-Serous Fluid)",
      outlineThickness: 0.015,
      transparent: true,
      opacity: 0.9
    });
    vMesh.position.set(
      Math.cos(angle) * satelliteRadius,
      totalH * 0.5 + 0.01,
      Math.sin(angle) * satelliteRadius
    );
    satelliteGroup.add(vMesh);
  }
  rootGroup.add(satelliteGroup);

  // --------------------------------------------------------------------------
  // 4. Deep Ischemic Necrosis & Edema Pockets (Revealed on Cutaway)
  // --------------------------------------------------------------------------
  // Deep necrotic cone beneath the black eschar
  const necroticConeGeom = new THREE.ConeGeometry(escharRadius * 0.95, 1.2, 18);
  necroticConeGeom.rotateX(Math.PI);
  const necroticConeMesh = createKurzgesagtMesh(necroticConeGeom, NECROTIC_DERMIS_COLOR, {
    partId: "necrotic_dermis",
    partName: "Coagulative Ischemic Necrosis & Thrombosis",
    outlineThickness: 0.025
  });
  necroticConeMesh.position.set(0, totalH * 0.5 - 0.6, 0);
  internalsGroup.add(necroticConeMesh);

  // Edema fluid pools (Pale translucent discs showing fluid collection in dermis)
  const poolGeom = new THREE.CylinderGeometry(0.45, 0.45, 0.08, 12);
  const pool1 = createKurzgesagtMesh(poolGeom, GELATINOUS_EDEMA_COLOR, {
    partId: "gelatinous_edema",
    partName: "Gelatinous Dermal Edema Fluid (cAMP Accumulation)",
    outlineThickness: 0.015
  });
  pool1.position.set(-1.3, totalH * 0.5 - 0.5, 0);
  internalsGroup.add(pool1);

  const pool2 = createKurzgesagtMesh(poolGeom, GELATINOUS_EDEMA_COLOR, {
    partId: "gelatinous_edema",
    partName: "Gelatinous Dermal Edema Fluid",
    outlineThickness: 0.015
  });
  pool2.position.set(1.2, totalH * 0.5 - 0.7, 0);
  internalsGroup.add(pool2);

  // --------------------------------------------------------------------------
  // Cutaway Controls
  // --------------------------------------------------------------------------
  let cutawayProgress = 0;

  rootGroup.userData.setCutaway = (t) => {
    cutawayProgress = Math.max(0, Math.min(1, t));

    // Slide front half forward
    frontSkinGroup.position.z = cutawayProgress * 2.5;
    frontSkinGroup.position.y = cutawayProgress * -0.4;
    frontSkinGroup.rotation.x = cutawayProgress * 0.25;
    frontSkinGroup.scale.setScalar(1.0 - cutawayProgress * 0.08);

    // Crack open the front satellites
    satelliteGroup.position.z = cutawayProgress * 0.2;

    // Bring internal necrotic cone forward
    internalsGroup.position.z = cutawayProgress * 0.1;
  };

  rootGroup.userData.getCutaway = () => cutawayProgress;

  rootGroup.userData.update = (time) => {
    // Subtle glassy shimmer on satellite vesicles
    const wave = Math.sin(time * 3.0) * 0.04;
    satelliteGroup.scale.set(1 + wave * 0.2, 1, 1 + wave * 0.2);
  };

  rootGroup.userData.setCutaway(0);

  return rootGroup;
}
