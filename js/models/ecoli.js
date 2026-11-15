// ============================================================================
// Escherichia coli · 3D Kurzgesagt Model
// Gram-negative Bacillus with Peritrichous Flagella, Cutaway LPS Wall & Plasmids
// ============================================================================

import * as THREE from 'three';
import { createKurzgesagtMesh, createKurzgesagtMaterial } from '../toonMaterials.js';

export function createEcoliModel() {
  const rootGroup = new THREE.Group();
  rootGroup.name = "escherichia-coli";

  // Palette: Vibrant Gram-Negative Safranin Rose-Pink & Bacterial Gold
  const OUTER_MEMBRANE_COLOR = 0xf43f5e; // Safranin pink/rose
  const LPS_SPIKE_COLOR = 0xfb7185;      // Coral LPS spikes
  const PEPTIDO_COLOR = 0xfbbf24;        // Thin peptidoglycan (amber)
  const INNER_MEMBRANE_COLOR = 0x06b6d4; // Inner membrane (cyan)
  const CYTO_COLOR = 0x1e1b4b;           // Cytoplasm interior
  const NUCLEOID_COLOR = 0x38bdf8;       // Circular chromosome loop
  const PLASMID_COLOR = 0x34d399;        // Glowing R-plasmid rings (emerald)
  const FLAGELLA_COLOR = 0xfacc15;       // Peritrichous flagella (yellow)
  const PILI_COLOR = 0xfda4af;           // P-fimbriae (soft rose)

  // Containers
  const backShellGroup = new THREE.Group();
  backShellGroup.name = "ecoli-back-shell";
  const frontShellGroup = new THREE.Group();
  frontShellGroup.name = "ecoli-front-shell";
  const internalGroup = new THREE.Group();
  internalGroup.name = "ecoli-internals";
  const flagellaGroup = new THREE.Group();
  flagellaGroup.name = "ecoli-flagella";

  rootGroup.add(backShellGroup);
  rootGroup.add(frontShellGroup);
  rootGroup.add(internalGroup);
  rootGroup.add(flagellaGroup);

  const rodRadius = 0.85;
  const rodLength = 2.4;

  // --------------------------------------------------------------------------
  // 1. Rod Shell Geometries (Capsule split into Back & Front Cutaway)
  // --------------------------------------------------------------------------
  function createCapsuleHalf(isFront = false) {
    const halfGroup = new THREE.Group();

    // Cylinder body half
    const cylGeom = new THREE.CylinderGeometry(
      rodRadius, rodRadius, rodLength, 24, 1, false,
      isFront ? 0 : Math.PI, Math.PI
    );
    cylGeom.rotateZ(Math.PI / 2);
    const cylMesh = createKurzgesagtMesh(cylGeom, OUTER_MEMBRANE_COLOR, {
      partId: "outer_membrane_lps",
      partName: "Outer Membrane & LPS (Safranin Pink)",
      outlineThickness: 0.035
    });
    halfGroup.add(cylMesh);

    // Left hemisphere cap
    const capLeftGeom = new THREE.SphereGeometry(
      rodRadius, 20, 20,
      isFront ? 0 : Math.PI, Math.PI,
      0, Math.PI
    );
    capLeftGeom.rotateY(Math.PI / 2);
    const capLeft = createKurzgesagtMesh(capLeftGeom, OUTER_MEMBRANE_COLOR, {
      partId: "outer_membrane_lps",
      partName: "Bacterial Capsule End Cap",
      outlineThickness: 0.035
    });
    capLeft.position.x = -rodLength * 0.5;
    halfGroup.add(capLeft);

    // Right hemisphere cap
    const capRightGeom = new THREE.SphereGeometry(
      rodRadius, 20, 20,
      isFront ? 0 : Math.PI, Math.PI,
      0, Math.PI
    );
    capRightGeom.rotateY(-Math.PI / 2);
    const capRight = createKurzgesagtMesh(capRightGeom, OUTER_MEMBRANE_COLOR, {
      partId: "outer_membrane_lps",
      partName: "Bacterial Capsule End Cap",
      outlineThickness: 0.035
    });
    capRight.position.x = rodLength * 0.5;
    halfGroup.add(capRight);

    return halfGroup;
  }

  const backShell = createCapsuleHalf(false);
  backShellGroup.add(backShell);

  const frontShell = createCapsuleHalf(true);
  frontShellGroup.add(frontShell);

  // Surface LPS Spikes & Pili
  function addSurfaceSpikes(targetGroup, zFactor) {
    const spikeGeom = new THREE.CylinderGeometry(0.02, 0.04, 0.22, 6);
    spikeGeom.rotateX(Math.PI / 2);
    const spikeMat = createKurzgesagtMaterial(LPS_SPIKE_COLOR);

    for (let x = -1.2; x <= 1.2; x += 0.4) {
      for (let a = 0.2; a < Math.PI - 0.2; a += 0.55) {
        const spike = new THREE.Mesh(spikeGeom, spikeMat);
        const y = Math.sin(a) * (rodRadius + 0.05);
        const z = zFactor * Math.cos(a) * (rodRadius + 0.05);
        spike.position.set(x, y, z);
        spike.rotation.y = (Math.random() - 0.5) * 0.4;
        targetGroup.add(spike);
      }
    }
  }
  addSurfaceSpikes(frontShellGroup, 1);
  addSurfaceSpikes(backShellGroup, -1);

  // --------------------------------------------------------------------------
  // 2. Cutaway Internal Layers (Cross-section)
  // --------------------------------------------------------------------------
  // A. Thin Amber Peptidoglycan Layer
  const peptidoGeom = new THREE.PlaneGeometry(rodLength * 0.96, rodRadius * 1.8);
  const peptidoMesh = createKurzgesagtMesh(peptidoGeom, PEPTIDO_COLOR, {
    partId: "peptidoglycan_periplasm",
    partName: "Thin Peptidoglycan & Periplasmic Space",
    outlineThickness: 0.02
  });
  peptidoMesh.position.z = 0.01;
  internalGroup.add(peptidoMesh);

  // B. Inner Plasma Membrane
  const innerMemGeom = new THREE.PlaneGeometry(rodLength * 0.92, rodRadius * 1.65);
  const innerMemMesh = createKurzgesagtMesh(innerMemGeom, INNER_MEMBRANE_COLOR, {
    partId: "outer_membrane_lps",
    partName: "Inner Plasma Membrane Bilayer",
    outlineThickness: 0.015
  });
  innerMemMesh.position.z = 0.02;
  internalGroup.add(innerMemMesh);

  // C. Dark Cytoplasm Bed
  const cytoBedGeom = new THREE.PlaneGeometry(rodLength * 0.90, rodRadius * 1.55);
  const cytoBedMesh = createKurzgesagtMesh(cytoBedGeom, CYTO_COLOR, {
    partId: "nucleoid_plasmids",
    partName: "Bacterial Cytosol",
    outlineThickness: 0.015
  });
  cytoBedMesh.position.z = 0.025;
  internalGroup.add(cytoBedMesh);

  // D. Coiled Bacterial Chromosome Loop (Nucleoid)
  const nucleoidPoints = [];
  const nLoops = 14;
  for (let i = 0; i <= nLoops * 14; i++) {
    const t = i / (nLoops * 14);
    const angle = t * Math.PI * 2 * nLoops;
    const x = (t - 0.5) * (rodLength * 0.75);
    const y = Math.sin(angle) * 0.38 * Math.sin(t * Math.PI);
    const z = Math.cos(angle) * 0.12 + 0.06;
    nucleoidPoints.push(new THREE.Vector3(x, y, z));
  }
  const nucleoidCurve = new THREE.CatmullRomCurve3(nucleoidPoints);
  const nucleoidGeom = new THREE.TubeGeometry(nucleoidCurve, 90, 0.035, 6, false);
  const nucleoidMesh = createKurzgesagtMesh(nucleoidGeom, NUCLEOID_COLOR, {
    partId: "nucleoid_plasmids",
    partName: "Circular Chromosomal DNA (~4.6 Mbp)",
    outlineThickness: 0.015
  });
  internalGroup.add(nucleoidMesh);

  // E. Extrachromosomal R-Plasmids (Glowing circular rings)
  const plasmidGeom1 = new THREE.TorusGeometry(0.18, 0.035, 8, 20);
  const plasmid1 = createKurzgesagtMesh(plasmidGeom1, PLASMID_COLOR, {
    partId: "nucleoid_plasmids",
    partName: "R-Plasmid Ring (Antibiotic Resistance)",
    outlineThickness: 0.015
  });
  plasmid1.position.set(-0.75, 0.35, 0.08);
  plasmid1.rotation.x = Math.PI / 4;
  internalGroup.add(plasmid1);

  const plasmidGeom2 = new THREE.TorusGeometry(0.14, 0.03, 8, 20);
  const plasmid2 = createKurzgesagtMesh(plasmidGeom2, PLASMID_COLOR, {
    partId: "nucleoid_plasmids",
    partName: "Colistin Resistance Plasmid (mcr-1)",
    outlineThickness: 0.015
  });
  plasmid2.position.set(0.7, -0.32, 0.08);
  plasmid2.rotation.y = Math.PI / 5;
  internalGroup.add(plasmid2);

  // --------------------------------------------------------------------------
  // 3. Peritrichous Flagella (Long wavy filaments distributed all around)
  // --------------------------------------------------------------------------
  const flagellaList = [];

  function createWavyFlagellum(startX, startY, startZ, dirX, dirY, dirZ) {
    const points = [];
    const length = 3.5;
    const waveCount = 5;
    const segments = 50;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const dist = t * length;
      const wave = Math.sin(t * Math.PI * 2 * waveCount) * 0.28 * t;
      const px = startX + dirX * dist + wave * -dirY;
      const py = startY + dirY * dist + wave * dirX;
      const pz = startZ + dirZ * dist + Math.cos(t * Math.PI * 2 * waveCount) * 0.15 * t;
      points.push(new THREE.Vector3(px, py, pz));
    }

    const curve = new THREE.CatmullRomCurve3(points);
    const geom = new THREE.TubeGeometry(curve, 45, 0.03, 6, false);
    const mesh = createKurzgesagtMesh(geom, FLAGELLA_COLOR, {
      partId: "flagella_pili",
      partName: "Peritrichous Flagellum (H-antigen)",
      outlineThickness: 0.015
    });
    mesh.userData.basePoints = points.map(p => p.clone());
    mesh.userData.dir = new THREE.Vector3(dirX, dirY, dirZ).normalize();
    return mesh;
  }

  // 6 Peritrichous flagella originating from various spots on the bacillus
  const flagellaConfigs = [
    { sx: -1.2, sy: 0.5, sz: -0.4, dx: -0.8, dy: 0.4, dz: -0.3 },
    { sx: -0.6, sy: -0.7, sz: -0.3, dx: -0.5, dy: -0.7, dz: -0.2 },
    { sx: 0.0, sy: 0.8, sz: -0.4, dx: 0.1, dy: 0.9, dz: -0.2 },
    { sx: 0.7, sy: -0.6, sz: -0.3, dx: 0.6, dy: -0.6, dz: -0.3 },
    { sx: 1.3, sy: 0.4, sz: -0.4, dx: 0.8, dy: 0.5, dz: -0.2 },
    { sx: 1.4, sy: -0.3, sz: 0.2, dx: 0.9, dy: -0.4, dz: 0.3 }
  ];

  flagellaConfigs.forEach((cfg) => {
    const fMesh = createWavyFlagellum(cfg.sx, cfg.sy, cfg.sz, cfg.dx, cfg.dy, cfg.dz);
    flagellaGroup.add(fMesh);
    flagellaList.push(fMesh);
  });

  // --------------------------------------------------------------------------
  // Cutaway & Flagellar Swimming Animation
  // --------------------------------------------------------------------------
  let cutawayProgress = 0;

  rootGroup.userData.setCutaway = (t) => {
    cutawayProgress = Math.max(0, Math.min(1, t));

    // Lift front shell away
    frontShellGroup.position.z = cutawayProgress * 2.3;
    frontShellGroup.position.y = cutawayProgress * 0.8;
    frontShellGroup.rotation.x = cutawayProgress * -0.5;
    frontShellGroup.scale.setScalar(1.0 - cutawayProgress * 0.08);

    // Bring internals forward
    internalGroup.position.z = cutawayProgress * 0.15;
  };

  rootGroup.userData.getCutaway = () => cutawayProgress;

  rootGroup.userData.update = (time) => {
    // Undulate flagella to simulate swimming
    flagellaList.forEach((fMesh, idx) => {
      const phase = time * 3.5 + idx * 1.2;
      const sinWave = Math.sin(phase) * 0.06;
      fMesh.rotation.z = Math.sin(phase * 0.8) * 0.08;
      fMesh.rotation.y = Math.cos(phase * 0.7) * 0.08;
    });

    // Subtle bacterium tumbling sway
    rootGroup.position.y = Math.sin(time * 1.2) * 0.05;
  };

  rootGroup.userData.setCutaway(0);

  return rootGroup;
}
