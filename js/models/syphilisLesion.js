// ============================================================================
// Syphilis Hard Chancre · 3D Clinical Lesion (Painless Indurated Ulcer)
// Kurzgesagt Cel-Shaded Skin Block with Punched-Out Crater, Clean Base & Plasma Cells
// ============================================================================

import * as THREE from 'three';
import { createKurzgesagtMesh, createKurzgesagtMaterial } from '../toonMaterials.js';

export function createSyphilisLesionModel() {
  const rootGroup = new THREE.Group();
  rootGroup.name = "syphilis-hard-chancre";

  // Palette: Cartilaginous Blue-Grey Rim, Clean Reddish-Pink Base, and Plasma Purple
  const EPIDERMIS_COLOR = 0xfecdd3;         // Healthy skin epidermis
  const DERMIS_COLOR = 0xfb7185;            // Vascular dermis
  const SUBCUTIS_COLOR = 0xfef08a;          // Subcutaneous fat
  const INDURATED_RIM_COLOR = 0x0284c7;     // Firm cartilaginous indurated elevated border
  const CLEAN_BASE_COLOR = 0xf43f5e;        // Glistening clean reddish-pink granulating base
  const ENDARTERITIS_COLOR = 0x9333ea;      // Endarteritis obliterans (thickened vessels)
  const PLASMA_CELL_COLOR = 0xa855f7;       // Perivascular plasma cell infiltrate

  // Dimensions of Skin Block
  const blockW = 4.6;
  const blockD = 3.6;
  const blockH_Epi = 0.45;
  const blockH_Der = 1.1;
  const blockH_Fat = 0.7;
  const totalH = blockH_Epi + blockH_Der + blockH_Fat;

  // Containers
  const backSkinGroup = new THREE.Group();
  backSkinGroup.name = "chancre-back-half";
  const frontSkinGroup = new THREE.Group();
  frontSkinGroup.name = "chancre-front-half";
  const internalsGroup = new THREE.Group();
  internalsGroup.name = "chancre-internals";

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
      partId: "plasma_cell_infiltrate",
      partName: "Subcutaneous Fat",
      outlineThickness: 0.03
    });
    fatMesh.position.set(0, -totalH * 0.5 + blockH_Fat * 0.5, 0);
    halfGroup.add(fatMesh);

    // Dermis (Middle)
    const dermGeom = new THREE.BoxGeometry(blockW, blockH_Der, halfD);
    const dermMesh = createKurzgesagtMesh(dermGeom, DERMIS_COLOR, {
      partId: "endarteritis_vessels",
      partName: "Dermis (Endarteritis Obliterans Zone)",
      outlineThickness: 0.03
    });
    dermMesh.position.set(0, -totalH * 0.5 + blockH_Fat + blockH_Der * 0.5, 0);
    halfGroup.add(dermMesh);

    // Epidermis (Top)
    const epiGeom = new THREE.BoxGeometry(blockW, blockH_Epi, halfD);
    const epiMesh = createKurzgesagtMesh(epiGeom, EPIDERMIS_COLOR, {
      partId: "indurated_rim",
      partName: "Epidermal Surface Border",
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
  // 2. Punched-Out Crater Rim (Indurated Cartilaginous Border)
  // --------------------------------------------------------------------------
  // The Chancre border is rolled, sharply demarcated, and button-hard (Indurated)
  const craterOuterR = 1.35;
  const craterInnerR = 0.88;
  const rimHeight = 0.38;

  const rimGeom = new THREE.CylinderGeometry(craterInnerR, craterOuterR, rimHeight, 28, 1, true);
  const rimMesh = createKurzgesagtMesh(rimGeom, INDURATED_RIM_COLOR, {
    partId: "indurated_rim",
    partName: "Indurated Elevated Cartilaginous Margin",
    outlineThickness: 0.03
  });
  rimMesh.position.set(0, totalH * 0.5 + rimHeight * 0.5, 0);
  rootGroup.add(rimMesh);

  // --------------------------------------------------------------------------
  // 3. Clean Granulating Ulcer Base (Glistening red-pink, NO purulent slough)
  // --------------------------------------------------------------------------
  const baseGeom = new THREE.CircleGeometry(craterInnerR * 0.98, 28);
  baseGeom.rotateX(-Math.PI / 2);
  const baseMesh = createKurzgesagtMesh(baseGeom, CLEAN_BASE_COLOR, {
    partId: "clean_ulcer_base",
    partName: "Clean Glistening Red Base (Absence of Pus)",
    outlineThickness: 0.02
  });
  baseMesh.position.set(0, totalH * 0.5 + 0.02, 0);
  rootGroup.add(baseMesh);

  // Thin glistening film on top of clean base
  const serousGeom = new THREE.CircleGeometry(craterInnerR * 0.85, 20);
  serousGeom.rotateX(-Math.PI / 2);
  const serousMesh = createKurzgesagtMesh(serousGeom, 0xfecdd3, {
    partId: "clean_ulcer_base",
    partName: "Serous Exudate (Teeming with Treponemes)",
    outlineThickness: 0.015,
    transparent: true,
    opacity: 0.65
  });
  serousMesh.position.set(0, totalH * 0.5 + 0.03, 0);
  rootGroup.add(serousMesh);

  // --------------------------------------------------------------------------
  // 4. Histological Endarteritis Obliterans & Plasma Cells (Revealed on Cutaway)
  // --------------------------------------------------------------------------
  // Thickened blood vessels with narrowed concentric lumens (Endarteritis)
  function createThickenedArteriole(x, y, z) {
    const vesselGroup = new THREE.Group();
    // Outer wall (hyperplastic smooth muscle & pericytes)
    const outerGeom = new THREE.CylinderGeometry(0.22, 0.22, 0.6, 12);
    const outerMesh = createKurzgesagtMesh(outerGeom, ENDARTERITIS_COLOR, {
      partId: "endarteritis_vessels",
      partName: "Endarteritis Obliterans (Concentric Vascular Narrowing)",
      outlineThickness: 0.015
    });
    vesselGroup.add(outerMesh);

    // Choked narrow red lumen
    const lumenGeom = new THREE.CylinderGeometry(0.06, 0.06, 0.62, 10);
    const lumenMesh = createKurzgesagtMesh(lumenGeom, 0xdc2626, {
      partId: "endarteritis_vessels",
      partName: "Choked Arteriolar Lumen",
      outlineThickness: 0.01
    });
    vesselGroup.add(lumenMesh);

    vesselGroup.position.set(x, y, z);
    vesselGroup.rotation.z = Math.PI / 3;
    return vesselGroup;
  }

  internalsGroup.add(createThickenedArteriole(-0.6, totalH * 0.5 - 0.45, 0));
  internalsGroup.add(createThickenedArteriole(0.7, totalH * 0.5 - 0.65, 0));
  internalsGroup.add(createThickenedArteriole(0.1, totalH * 0.5 - 0.85, 0));

  // Dense Plasma Cell Infiltrates (Sheets of purple spheres surrounding the vessels)
  const plasmaGroup = new THREE.Group();
  plasmaGroup.name = "plasma-cells";
  const pcGeom = new THREE.SphereGeometry(0.06, 8, 8);
  const pcMat = createKurzgesagtMaterial(PLASMA_CELL_COLOR);

  for (let i = 0; i < 24; i++) {
    const pc = new THREE.Mesh(pcGeom, pcMat);
    pc.position.set(
      (Math.random() - 0.5) * 1.8,
      totalH * 0.5 - 0.3 - Math.random() * 0.7,
      (Math.random() - 0.5) * 0.4
    );
    plasmaGroup.add(pc);
  }
  internalsGroup.add(plasmaGroup);

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

    // Crack open the front rim
    rimMesh.position.z = cutawayProgress * 0.15;

    // Bring deep vascular endarteritis forward into clear view
    internalsGroup.position.z = cutawayProgress * 0.1;
  };

  rootGroup.userData.getCutaway = () => cutawayProgress;

  rootGroup.userData.update = (time) => {
    // Subtle glassy sheen shimmer on the clean base
    const glisten = 0.55 + Math.sin(time * 2.0) * 0.15;
    serousMesh.material.opacity = glisten;
  };

  rootGroup.userData.setCutaway(0);

  return rootGroup;
}
