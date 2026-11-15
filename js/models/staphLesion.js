// ============================================================================
// Staph aureus Lesion · 3D Clinical Lesion (Honey-Colored Crusts & Abscess)
// Kurzgesagt Cel-Shaded Skin Block with Subcorneal Cleft & Coagulase Fibrin Wall
// ============================================================================

import * as THREE from 'three';
import { createKurzgesagtMesh, createKurzgesagtMaterial } from '../toonMaterials.js';

export function createStaphLesionModel() {
  const rootGroup = new THREE.Group();
  rootGroup.name = "staph-impetigo-abscess";

  // Palette: Golden Honey, Purulent Yellow, and Coagulase Purple
  const EPIDERMIS_COLOR = 0xfecdd3;     // Skin epidermis
  const DERMIS_COLOR = 0xfb7185;        // Vascular dermis
  const SUBCUTIS_COLOR = 0xfef08a;      // Fat layer
  const HONEY_CRUST_COLOR = 0xf59e0b;   // Hallmark Amber/Golden Honey Crust
  const SUBCORNEAL_CLEFT = 0xfde047;    // Blister cleft
  const ABSCESS_PUS = 0xfef9c3;         // Liquefied pus core
  const FIBRIN_WALL_COLOR = 0x8b5cf6;   // Protective Fibrin Capsule (from Coagulase)
  const ERYTHEMA_HALO = 0xec4899;       // Cellulitic erythematous halo

  // Dimensions of Skin Block
  const blockW = 4.6;
  const blockD = 3.6;
  const blockH_Epi = 0.45;
  const blockH_Der = 1.1;
  const blockH_Fat = 0.7;
  const totalH = blockH_Epi + blockH_Der + blockH_Fat;

  // Containers for cutaway animation
  const backSkinGroup = new THREE.Group();
  backSkinGroup.name = "staph-back-half";
  const frontSkinGroup = new THREE.Group();
  frontSkinGroup.name = "staph-front-half";
  const internalsGroup = new THREE.Group();
  internalsGroup.name = "staph-internals";

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

    // Fat (Bottom)
    const fatGeom = new THREE.BoxGeometry(blockW, blockH_Fat, halfD);
    const fatMesh = createKurzgesagtMesh(fatGeom, SUBCUTIS_COLOR, {
      partId: "abscess_pus_core",
      partName: "Subcutaneous Tissue",
      outlineThickness: 0.03
    });
    fatMesh.position.set(0, -totalH * 0.5 + blockH_Fat * 0.5, 0);
    halfGroup.add(fatMesh);

    // Dermis (Middle)
    const dermGeom = new THREE.BoxGeometry(blockW, blockH_Der, halfD);
    const dermMesh = createKurzgesagtMesh(dermGeom, DERMIS_COLOR, {
      partId: "erythematous_halo",
      partName: "Inflamed Dermal Layer",
      outlineThickness: 0.03
    });
    dermMesh.position.set(0, -totalH * 0.5 + blockH_Fat + blockH_Der * 0.5, 0);
    halfGroup.add(dermMesh);

    // Epidermis (Top)
    const epiGeom = new THREE.BoxGeometry(blockW, blockH_Epi, halfD);
    const epiMesh = createKurzgesagtMesh(epiGeom, EPIDERMIS_COLOR, {
      partId: "subcorneal_cleft",
      partName: "Stratum Corneum & Granulosum",
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
  // 2. Erythematous Cellulitic Base & Nodule
  // --------------------------------------------------------------------------
  const noduleRadius = 1.45;
  const noduleGeom = new THREE.SphereGeometry(noduleRadius, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.5);
  noduleGeom.scale(1.0, 0.45, 1.0);
  const noduleMesh = createKurzgesagtMesh(noduleGeom, ERYTHEMA_HALO, {
    partId: "erythematous_halo",
    partName: "Fluctuant Erythematous Nodule",
    outlineThickness: 0.03
  });
  noduleMesh.position.set(0, totalH * 0.5, 0);
  rootGroup.add(noduleMesh);

  // --------------------------------------------------------------------------
  // 3. Honey-Colored Golden Crusts (สะเก็ดสีน้ำผึ้ง)
  // --------------------------------------------------------------------------
  // Golden irregular crystalline crust flakes characteristic of Impetigo
  const crustGroup = new THREE.Group();
  crustGroup.name = "honey-crusts";

  function createHoneyFlake(size, x, z, rot) {
    const flakeGeom = new THREE.CylinderGeometry(size, size * 1.15, 0.12, 7);
    const flake = createKurzgesagtMesh(flakeGeom, HONEY_CRUST_COLOR, {
      partId: "honey_crust",
      partName: "Honey-Colored Amber Crust Flake",
      outlineThickness: 0.02
    });
    flake.position.set(x, totalH * 0.5 + noduleRadius * 0.42 + 0.04, z);
    flake.rotation.y = rot;
    flake.rotation.z = (Math.random() - 0.5) * 0.2;
    return flake;
  }

  // Central main crust and satellite flakes
  const mainCrust = createHoneyFlake(0.65, 0, 0, 0.4);
  crustGroup.add(mainCrust);
  crustGroup.add(createHoneyFlake(0.42, 0.65, 0.35, 1.2));
  crustGroup.add(createHoneyFlake(0.38, -0.62, 0.4, 0.8));
  crustGroup.add(createHoneyFlake(0.45, -0.4, -0.55, 2.1));
  crustGroup.add(createHoneyFlake(0.35, 0.55, -0.48, 1.7));
  crustGroup.add(createHoneyFlake(0.28, 0.85, -0.1, 0.3));

  rootGroup.add(crustGroup);

  // --------------------------------------------------------------------------
  // 4. Subcorneal Cleft (Exfoliatin-induced intraepidermal cleavage)
  // --------------------------------------------------------------------------
  const cleftGeom = new THREE.CylinderGeometry(noduleRadius * 0.88, noduleRadius * 0.92, 0.1, 24);
  const cleftMesh = createKurzgesagtMesh(cleftGeom, SUBCORNEAL_CLEFT, {
    partId: "subcorneal_cleft",
    partName: "Subcorneal Cleavage Space (Desmoglein-1 Split)",
    outlineThickness: 0.02
  });
  cleftMesh.position.set(0, totalH * 0.5 + 0.22, 0);
  internalsGroup.add(cleftMesh);

  // --------------------------------------------------------------------------
  // 5. Deep Dermal Abscess Pocket & Protective Fibrin Wall
  // --------------------------------------------------------------------------
  // Outer Fibrin Wall (Synthesized by Staphylococcal Coagulase enzyme)
  const fibrinGeom = new THREE.SphereGeometry(1.05, 24, 24);
  fibrinGeom.scale(1.0, 0.85, 1.0);
  const fibrinMesh = createKurzgesagtMesh(fibrinGeom, FIBRIN_WALL_COLOR, {
    partId: "fibrin_capsule",
    partName: "Protective Fibrin Wall (Coagulase Barrier)",
    outlineThickness: 0.025
  });
  fibrinMesh.position.set(0, totalH * 0.5 - 0.65, 0);
  internalsGroup.add(fibrinMesh);

  // Inner Liquefied Pus Core (Dense dead neutrophils & staph bacteria)
  const pusCoreGeom = new THREE.SphereGeometry(0.82, 20, 20);
  pusCoreGeom.scale(1.0, 0.85, 1.0);
  const pusCoreMesh = createKurzgesagtMesh(pusCoreGeom, ABSCESS_PUS, {
    partId: "abscess_pus_core",
    partName: "Liquefied Necrotic Pus Core (Pus Cells)",
    outlineThickness: 0.02
  });
  pusCoreMesh.position.set(0, totalH * 0.5 - 0.65, 0.02);
  internalsGroup.add(pusCoreMesh);

  // --------------------------------------------------------------------------
  // Cutaway Controls
  // --------------------------------------------------------------------------
  let cutawayProgress = 0;

  rootGroup.userData.setCutaway = (t) => {
    cutawayProgress = Math.max(0, Math.min(1, t));

    // Smooth forward slide of front half
    frontSkinGroup.position.z = cutawayProgress * 2.5;
    frontSkinGroup.position.y = cutawayProgress * -0.4;
    frontSkinGroup.rotation.x = cutawayProgress * 0.25;
    frontSkinGroup.scale.setScalar(1.0 - cutawayProgress * 0.08);

    // Crack open the front crust flakes slightly
    crustGroup.position.z = cutawayProgress * 0.3;
    crustGroup.rotation.x = cutawayProgress * -0.15;

    // Bring deep abscess cavity forward into clear view
    internalsGroup.position.z = cutawayProgress * 0.1;
  };

  rootGroup.userData.getCutaway = () => cutawayProgress;

  rootGroup.userData.update = (time) => {
    // Subtle glistening sheen pulse on honey crusts
    const pulse = 1 + Math.sin(time * 2.5) * 0.01;
    mainCrust.scale.set(pulse, 1, pulse);
  };

  rootGroup.userData.setCutaway(0);

  return rootGroup;
}
