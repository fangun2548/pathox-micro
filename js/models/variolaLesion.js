// ============================================================================
// Variola Virus Lesion · 3D Clinical Lesion (Umbilicated Pustule)
// Kurzgesagt Cel-Shaded Skin Block with Central Umbilication & Cutaway Pus Core
// ============================================================================

import * as THREE from 'three';
import { createKurzgesagtMesh, createKurzgesagtMaterial } from '../toonMaterials.js';

export function createVariolaLesionModel() {
  const rootGroup = new THREE.Group();
  rootGroup.name = "variola-pustule";

  // Palette: Kurzgesagt Dermatological Colors
  const EPIDERMIS_COLOR = 0xfecdd3;     // Light healthy skin tone (Rose-pink)
  const DERMIS_COLOR = 0xfb7185;        // Deeper vascular dermis
  const SUBCUTIS_COLOR = 0xfef08a;      // Subcutaneous fat lobules (Yellow)
  const PUSTULE_ROOF = 0xfca5a5;        // Tense epidermal pustule wall
  const UMBILICATION_COLOR = 0x881337;  // Deep reddish-brown necrotic umbilicated center
  const PUS_COLOR = 0xfef08a;           // Thick yellow-white purulent exudate
  const ERYTHEMA_HALO = 0xef4444;       // Intense red inflammatory ring
  const NECROTIC_CORE = 0x991b1b;       // Necrotic dermal debris & Guarnieri inclusions

  // Dimensions of Skin Block
  const blockW = 4.6;
  const blockD = 3.6;
  const blockH_Epi = 0.45;
  const blockH_Der = 1.1;
  const blockH_Fat = 0.7;
  const totalH = blockH_Epi + blockH_Der + blockH_Fat; // ~2.25

  // Groups for cutaway separation
  const backSkinGroup = new THREE.Group();
  backSkinGroup.name = "skin-back-half";
  const frontSkinGroup = new THREE.Group();
  frontSkinGroup.name = "skin-front-half";
  const internalsGroup = new THREE.Group();
  internalsGroup.name = "pustule-internals";

  rootGroup.add(backSkinGroup);
  rootGroup.add(frontSkinGroup);
  rootGroup.add(internalsGroup);

  // --------------------------------------------------------------------------
  // 1. Skin Block Slices (Epidermis, Dermis, Subcutaneous Fat)
  // --------------------------------------------------------------------------
  function createSkinBlockHalf(isFront = false) {
    const halfGroup = new THREE.Group();
    const halfD = blockD * 0.5;
    const zOffset = isFront ? halfD * 0.5 : -halfD * 0.5;

    // Subcutaneous Fat (Bottom)
    const fatGeom = new THREE.BoxGeometry(blockW, blockH_Fat, halfD);
    const fatMesh = createKurzgesagtMesh(fatGeom, SUBCUTIS_COLOR, {
      partId: "dermis_subcutis",
      partName: "Subcutaneous Fat (Hypodermis)",
      outlineThickness: 0.03
    });
    fatMesh.position.set(0, -totalH * 0.5 + blockH_Fat * 0.5, 0);
    halfGroup.add(fatMesh);

    // Dermis (Middle)
    const dermGeom = new THREE.BoxGeometry(blockW, blockH_Der, halfD);
    const dermMesh = createKurzgesagtMesh(dermGeom, DERMIS_COLOR, {
      partId: "dermis_subcutis",
      partName: "Dermis (Vascular Bed)",
      outlineThickness: 0.03
    });
    dermMesh.position.set(0, -totalH * 0.5 + blockH_Fat + blockH_Der * 0.5, 0);
    halfGroup.add(dermMesh);

    // Epidermis (Top Surface Layer)
    const epiGeom = new THREE.BoxGeometry(blockW, blockH_Epi, halfD);
    const epiMesh = createKurzgesagtMesh(epiGeom, EPIDERMIS_COLOR, {
      partId: "epidermal_roof",
      partName: "Stratum Corneum & Epidermis",
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
  // 2. Erythematous Halo on Skin Surface
  // --------------------------------------------------------------------------
  const haloGeom = new THREE.RingGeometry(1.0, 1.85, 32);
  haloGeom.rotateX(-Math.PI / 2);
  const haloMesh = createKurzgesagtMesh(haloGeom, ERYTHEMA_HALO, {
    partId: "erythema_halo",
    partName: "Erythematous Inflammatory Halo",
    outlineThickness: 0.015,
    transparent: true,
    opacity: 0.88
  });
  haloMesh.position.set(0, totalH * 0.5 + 0.005, 0);
  rootGroup.add(haloMesh);

  // --------------------------------------------------------------------------
  // 3. Umbilicated Pustule Dome (Hemisphere with Inverted Central Crater)
  // --------------------------------------------------------------------------
  const pustuleRadius = 1.35;
  const pustuleHeight = 0.95;

  // We build a LatheGeometry to create the exact cross-sectional profile of an Umbilicated Pustule:
  // Starts at outer base, curves up into a dome, and dips down in the center to form the umbilicus!
  function createUmbilicatedPoints() {
    const points = [];
    const segments = 18;
    for (let i = 0; i <= segments; i++) {
      const u = i / segments; // 0 to 1 (center to outer rim)
      const r = u * pustuleRadius;
      let y = 0;
      if (u < 0.28) {
        // Central Umbilication Dip (inverted pit)
        const dip = (1 - (u / 0.28)) * 0.32;
        y = pustuleHeight * 0.65 - dip;
      } else {
        // High dome curving down to skin level
        const domeProg = (u - 0.28) / 0.72;
        y = pustuleHeight * (1 - Math.pow(domeProg, 1.6));
      }
      points.push(new THREE.Vector2(r, y));
    }
    return points;
  }

  const lathePoints = createUmbilicatedPoints();

  // Back half of pustule dome
  const backPustuleGeom = new THREE.LatheGeometry(lathePoints, 24, Math.PI, Math.PI);
  const backPustule = createKurzgesagtMesh(backPustuleGeom, PUSTULE_ROOF, {
    partId: "epidermal_roof",
    partName: "Tense Epidermal Pustule Roof (Posterior)",
    outlineThickness: 0.035
  });
  backPustule.position.y = totalH * 0.5;
  backSkinGroup.add(backPustule);

  // Front cutaway half of pustule dome
  const frontPustuleGeom = new THREE.LatheGeometry(lathePoints, 24, 0, Math.PI);
  const frontPustule = createKurzgesagtMesh(frontPustuleGeom, PUSTULE_ROOF, {
    partId: "epidermal_roof",
    partName: "Tense Epidermal Pustule Roof (Anterior)",
    outlineThickness: 0.035
  });
  frontPustule.position.y = totalH * 0.5;
  frontSkinGroup.add(frontPustule);

  // Central Umbilicus Plug (The brown/red sunken necrotic crater)
  const umbilicusGeom = new THREE.CylinderGeometry(0.38, 0.15, 0.2, 16);
  const umbilicusMesh = createKurzgesagtMesh(umbilicusGeom, UMBILICATION_COLOR, {
    partId: "umbilication",
    partName: "Central Umbilication Dimple (รอยบุ๋มสะดือ)",
    outlineThickness: 0.02
  });
  umbilicusMesh.position.set(0, totalH * 0.5 + pustuleHeight * 0.62, 0);
  rootGroup.add(umbilicusMesh);

  // --------------------------------------------------------------------------
  // 4. Internal Deep Pus Cavity (Revealed on Cutaway)
  // --------------------------------------------------------------------------
  const pusDiscGeom = new THREE.CircleGeometry(pustuleRadius * 0.85, 24);
  pusDiscGeom.rotateX(-Math.PI / 2);
  const pusMesh = createKurzgesagtMesh(pusDiscGeom, PUS_COLOR, {
    partId: "pus_cavity",
    partName: "Multilocular Purulent Exudate (Pus Cavity)",
    outlineThickness: 0.02
  });
  pusMesh.position.set(0, totalH * 0.5 + 0.2, 0);
  internalsGroup.add(pusMesh);

  // Deep Dermal Extension Cone (Showing depth of Smallpox pustule down into dermis)
  const deepConeGeom = new THREE.ConeGeometry(pustuleRadius * 0.75, 1.1, 20);
  deepConeGeom.rotateX(Math.PI);
  const deepConeMesh = createKurzgesagtMesh(deepConeGeom, PUS_COLOR, {
    partId: "pus_cavity",
    partName: "Deep Dermal Pus Infiltration (Mid-Dermis)",
    outlineThickness: 0.025
  });
  deepConeMesh.position.set(0, totalH * 0.5 - 0.55, 0);
  internalsGroup.add(deepConeMesh);

  // Guarnieri inclusion bodies (Pink/purple micro-dots scattered inside pus core)
  const inclusionsGroup = new THREE.Group();
  inclusionsGroup.name = "guarnieri-bodies";
  const incGeom = new THREE.SphereGeometry(0.065, 8, 8);
  const incMat = createKurzgesagtMaterial(NECROTIC_CORE);

  for (let i = 0; i < 16; i++) {
    const incMesh = new THREE.Mesh(incGeom, incMat);
    const angle = Math.random() * Math.PI * 2;
    const rad = Math.random() * (pustuleRadius * 0.6);
    const yDepth = Math.random() * -0.8;
    incMesh.position.set(
      Math.cos(angle) * rad,
      totalH * 0.5 + yDepth,
      Math.sin(angle) * rad
    );
    inclusionsGroup.add(incMesh);
  }
  internalsGroup.add(inclusionsGroup);

  // --------------------------------------------------------------------------
  // Cutaway & Interaction Controls
  // --------------------------------------------------------------------------
  let cutawayProgress = 0;

  rootGroup.userData.setCutaway = (t) => {
    cutawayProgress = Math.max(0, Math.min(1, t));

    // Smoothly slide and rotate front skin half away
    frontSkinGroup.position.z = cutawayProgress * 2.5;
    frontSkinGroup.position.y = cutawayProgress * -0.4;
    frontSkinGroup.rotation.x = cutawayProgress * 0.25;

    // Scale down slightly when pulled away
    frontSkinGroup.scale.setScalar(1.0 - cutawayProgress * 0.08);

    // Bring deep dermal pus core forward slightly to make cross-section pop
    internalsGroup.position.z = cutawayProgress * 0.05;
  };

  rootGroup.userData.getCutaway = () => cutawayProgress;

  rootGroup.userData.update = (time) => {
    // Subtle pulsating tension in the pustule
    const tension = 1 + Math.sin(time * 2.0) * 0.008;
    umbilicusMesh.scale.set(tension, 1, tension);
  };

  rootGroup.userData.setCutaway(0);

  return rootGroup;
}
