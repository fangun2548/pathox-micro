// ============================================================================
// Herpes / VZV Lesion · 3D Clinical Lesion ('Dew Drop on a Rose Petal')
// Kurzgesagt Cel-Shaded Skin Block with Crystal Teardrop Vesicle & Giant Cells
// ============================================================================

import * as THREE from 'three';
import { createKurzgesagtMesh, createKurzgesagtMaterial } from '../toonMaterials.js';

export function createHerpesLesionModel() {
  const rootGroup = new THREE.Group();
  rootGroup.name = "herpes-dewdrop-vesicle";

  // Palette: Rose Petal Erythema, Crystal Cyan Tear-drop, and Giant Cell Violet
  const EPIDERMIS_COLOR = 0xfecdd3;         // Epidermis
  const DERMIS_COLOR = 0xfb7185;            // Vascular dermis
  const SUBCUTIS_COLOR = 0xfef08a;          // Subcutaneous fat
  const ROSE_PETAL_BASE = 0xf43f5e;         // Vibrant Rose-Petal Erythema Base
  const DEW_DROP_COLOR = 0x38bdf8;          // Crystal-clear serous vesicle
  const ACANTHOLYTIC_COLOR = 0xa7f3d0;      // Swollen ballooning keratinocytes
  const GIANT_CELL_COLOR = 0x8b5cf6;        // Multinucleated Giant Cells (Tzanck+)

  // Dimensions of Skin Block
  const blockW = 4.6;
  const blockD = 3.6;
  const blockH_Epi = 0.45;
  const blockH_Der = 1.1;
  const blockH_Fat = 0.7;
  const totalH = blockH_Epi + blockH_Der + blockH_Fat;

  // Containers
  const backSkinGroup = new THREE.Group();
  backSkinGroup.name = "herpes-back-half";
  const frontSkinGroup = new THREE.Group();
  frontSkinGroup.name = "herpes-front-half";
  const internalsGroup = new THREE.Group();
  internalsGroup.name = "herpes-internals";

  rootGroup.add(backSkinGroup);
  rootGroup.add(frontSkinGroup);
  rootGroup.add(internalsGroup);

  // --------------------------------------------------------------------------
  // 1. Skin Block Slices
  // --------------------------------------------------------------------------
  function createSkinBlockHalf(isFront = false) {
    const halfGroup = new THREE.Group();
    const halfD = blockD * 0.5;
    const zOffset = isFront ? halfD * 0.5 : -halfD * 0.5;

    // Fat (Bottom)
    const fatGeom = new THREE.BoxGeometry(blockW, blockH_Fat, halfD);
    const fatMesh = createKurzgesagtMesh(fatGeom, SUBCUTIS_COLOR, {
      partId: "erythematous_base",
      partName: "Subcutaneous Layer",
      outlineThickness: 0.03
    });
    fatMesh.position.set(0, -totalH * 0.5 + blockH_Fat * 0.5, 0);
    halfGroup.add(fatMesh);

    // Dermis (Middle)
    const dermGeom = new THREE.BoxGeometry(blockW, blockH_Der, halfD);
    const dermMesh = createKurzgesagtMesh(dermGeom, DERMIS_COLOR, {
      partId: "erythematous_base",
      partName: "Papillary & Reticular Dermis",
      outlineThickness: 0.03
    });
    dermMesh.position.set(0, -totalH * 0.5 + blockH_Fat + blockH_Der * 0.5, 0);
    halfGroup.add(dermMesh);

    // Epidermis (Top)
    const epiGeom = new THREE.BoxGeometry(blockW, blockH_Epi, halfD);
    const epiMesh = createKurzgesagtMesh(epiGeom, EPIDERMIS_COLOR, {
      partId: "clear_vesicle",
      partName: "Stratum Corneum Roof",
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
  // 2. Rose-Petal Erythematous Macular Base (ฐานแดงกลีบกุหลาบ)
  // --------------------------------------------------------------------------
  const roseBaseGeom = new THREE.CircleGeometry(1.65, 32);
  roseBaseGeom.rotateX(-Math.PI / 2);
  const roseBaseMesh = createKurzgesagtMesh(roseBaseGeom, ROSE_PETAL_BASE, {
    partId: "erythematous_base",
    partName: "Rose-Petal Erythematous Base (Neurogenic Vasodilation)",
    outlineThickness: 0.02
  });
  roseBaseMesh.position.set(0, totalH * 0.5 + 0.01, 0);
  rootGroup.add(roseBaseMesh);

  // --------------------------------------------------------------------------
  // 3. Crystal-Clear Dew-Drop Vesicle (ตุ่มน้ำใสรูปหยดน้ำ)
  // --------------------------------------------------------------------------
  // Delicate water-droplet teardrop profile
  const dropletRadius = 1.05;
  const dropletHeight = 1.25;

  const dropGeom = new THREE.SphereGeometry(
    dropletRadius, 28, 28,
    0, Math.PI * 2,
    0, Math.PI * 0.5
  );
  dropGeom.scale(1.0, dropletHeight / dropletRadius, 1.0);

  const dropMesh = createKurzgesagtMesh(dropGeom, DEW_DROP_COLOR, {
    partId: "clear_vesicle",
    partName: "Crystal-Clear Dew-Drop Vesicle (Serous Fluid)",
    outlineThickness: 0.03,
    transparent: true,
    opacity: 0.85
  });
  dropMesh.position.set(0, totalH * 0.5 + 0.02, 0);
  rootGroup.add(dropMesh);

  // --------------------------------------------------------------------------
  // 4. Acantholysis & Multinucleated Giant Cells (Revealed on Cutaway)
  // --------------------------------------------------------------------------
  // Floor of the intraepidermal blister
  const blisterFloorGeom = new THREE.CircleGeometry(dropletRadius * 0.95, 24);
  blisterFloorGeom.rotateX(-Math.PI / 2);
  const blisterFloor = createKurzgesagtMesh(blisterFloorGeom, 0xfca5a5, {
    partId: "ballooning_cells",
    partName: "Intraepidermal Blister Floor (Acantholysis Plane)",
    outlineThickness: 0.015
  });
  blisterFloor.position.set(0, totalH * 0.5 + 0.03, 0);
  internalsGroup.add(blisterFloor);

  // Floating Acantholytic / Ballooned Keratinocytes
  const acanthoGroup = new THREE.Group();
  acanthoGroup.name = "acantholytic-cells";
  const acanthoGeom = new THREE.SphereGeometry(0.08, 10, 10);
  const acanthoMat = createKurzgesagtMaterial(ACANTHOLYTIC_COLOR);

  for (let i = 0; i < 14; i++) {
    const cell = new THREE.Mesh(acanthoGeom, acanthoMat);
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * (dropletRadius * 0.65);
    cell.position.set(
      Math.cos(angle) * r,
      totalH * 0.5 + 0.2 + Math.random() * 0.45,
      Math.sin(angle) * r
    );
    acanthoGroup.add(cell);
  }
  internalsGroup.add(acanthoGroup);

  // Multinucleated Giant Cells (Fused Syncytia with molded nuclei)
  function createGiantCell(x, z, scale) {
    const giantGroup = new THREE.Group();
    // Main fused cytoplasm
    const bodyGeom = new THREE.SphereGeometry(0.24 * scale, 12, 12);
    bodyGeom.scale(1.3, 0.7, 1.1);
    const bodyMesh = createKurzgesagtMesh(bodyGeom, GIANT_CELL_COLOR, {
      partId: "multinucleated_giant",
      partName: "Multinucleated Giant Cell (Tzanck Smear Positive)",
      outlineThickness: 0.015
    });
    giantGroup.add(bodyMesh);

    // Molded Nuclei inside
    const nucGeom = new THREE.SphereGeometry(0.065 * scale, 8, 8);
    const nucMat = createKurzgesagtMaterial(0x4c1d95); // Deep purple Cowdry nucleus
    for (let i = -1; i <= 1; i++) {
      const nuc = new THREE.Mesh(nucGeom, nucMat);
      nuc.position.set(i * 0.1 * scale, 0.03 * scale, 0);
      giantGroup.add(nuc);
    }

    giantGroup.position.set(x, totalH * 0.5 + 0.12, z);
    return giantGroup;
  }

  internalsGroup.add(createGiantCell(-0.35, 0.1, 1.1));
  internalsGroup.add(createGiantCell(0.4, -0.2, 0.95));
  internalsGroup.add(createGiantCell(0.05, 0.35, 1.0));

  // --------------------------------------------------------------------------
  // Cutaway Controls
  // --------------------------------------------------------------------------
  let cutawayProgress = 0;

  rootGroup.userData.setCutaway = (t) => {
    cutawayProgress = Math.max(0, Math.min(1, t));

    // Slide front skin block forward
    frontSkinGroup.position.z = cutawayProgress * 2.5;
    frontSkinGroup.position.y = cutawayProgress * -0.4;
    frontSkinGroup.rotation.x = cutawayProgress * 0.25;
    frontSkinGroup.scale.setScalar(1.0 - cutawayProgress * 0.08);

    // Open droplet roof to reveal contents
    dropMesh.position.z = cutawayProgress * 0.25;
    dropMesh.material.opacity = 0.85 - cutawayProgress * 0.35;

    // Bring giant cells and acantholytic cells forward
    internalsGroup.position.z = cutawayProgress * 0.1;
  };

  rootGroup.userData.getCutaway = () => cutawayProgress;

  rootGroup.userData.update = (time) => {
    // Subtle glassy dew-drop wobble
    const wobble = Math.sin(time * 2.2) * 0.015;
    dropMesh.scale.set(1 + wobble, 1 - wobble * 0.5, 1 + wobble);
  };

  rootGroup.userData.setCutaway(0);

  return rootGroup;
}
