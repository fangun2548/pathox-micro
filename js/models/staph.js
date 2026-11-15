// ============================================================================
// Staphylococcus aureus · 3D Kurzgesagt Model
// Gram-positive Grape-like Cocci Cluster with Cutaway Cell Wall & Protein A
// ============================================================================

import * as THREE from 'three';
import { createKurzgesagtMesh, createKurzgesagtMaterial } from '../toonMaterials.js';

export function createStaphModel() {
  const rootGroup = new THREE.Group();
  rootGroup.name = "staphylococcus-aureus";

  // Palette: Vibrant Gram-positive violet/purple & Gold (aureus = golden)
  const COCCUS_COLOR = 0x7c3aed;      // Deep crystal violet
  const COCCUS_ACCENT = 0x8b5cf6;     // Lighter purple
  const PEPTIDO_COLOR = 0x9333ea;     // Thick peptidoglycan layer
  const MEMBRANE_COLOR = 0x2563eb;    // Plasma membrane (blue)
  const CYTO_COLOR = 0x1e1b4b;        // Dark cytoplasm
  const NUCLEOID_COLOR = 0x10b981;    // Bacterial DNA chromosome (emerald)
  const PROTEIN_A_COLOR = 0xf59e0b;   // Protein A spikes (golden yellow)

  const clusterGroup = new THREE.Group();
  clusterGroup.name = "grape-cluster";
  rootGroup.add(clusterGroup);

  // Cluster sphere coordinates (simulating irregular grape cluster)
  const sphereRadius = 0.72;
  const clusterPositions = [
    // Surrounding background cocci
    { x: -0.9, y: 0.8, z: -0.5, r: 0.68 },
    { x: 0.8, y: 0.9, z: -0.6, r: 0.72 },
    { x: 1.1, y: -0.2, z: -0.4, r: 0.70 },
    { x: -1.2, y: -0.3, z: -0.3, r: 0.74 },
    { x: -0.4, y: -1.1, z: -0.4, r: 0.69 },
    { x: 0.6, y: -1.0, z: -0.5, r: 0.71 },
    { x: 0.0, y: 1.3, z: -0.8, r: 0.65 },
    { x: -0.8, y: -0.9, z: 0.4, r: 0.66 },
    { x: 0.9, y: -0.7, z: 0.3, r: 0.68 },
    { x: -1.0, y: 0.5, z: 0.4, r: 0.67 },
    { x: 0.7, y: 0.6, z: 0.5, r: 0.70 },
    { x: 0.0, y: -1.3, z: 0.1, r: 0.64 }
  ];

  const cocciMeshes = [];

  // Generate standard cluster cocci
  clusterPositions.forEach((pos, idx) => {
    const geom = new THREE.SphereGeometry(pos.r, 20, 20);
    const color = (idx % 2 === 0) ? COCCUS_COLOR : COCCUS_ACCENT;
    const coccus = createKurzgesagtMesh(geom, color, {
      partId: "cluster",
      partName: `S. aureus Coccus (#${idx + 1})`,
      outlineThickness: 0.035
    });
    coccus.position.set(pos.x, pos.y, pos.z);
    coccus.userData.originalPos = new THREE.Vector3(pos.x, pos.y, pos.z);
    clusterGroup.add(coccus);
    cocciMeshes.push(coccus);
  });

  // --------------------------------------------------------------------------
  // The Hero Coccus (Center Front) with Cutaway Anatomy
  // --------------------------------------------------------------------------
  const heroGroup = new THREE.Group();
  heroGroup.name = "hero-coccus";
  heroGroup.position.set(0, 0, 0.45);
  heroGroup.userData.originalPos = new THREE.Vector3(0, 0, 0.45);
  clusterGroup.add(heroGroup);

  const heroRadius = 0.95;

  // Back hemisphere of Hero Coccus
  const backGeom = new THREE.SphereGeometry(
    heroRadius, 28, 28,
    0, Math.PI * 2,
    Math.PI * 0.5, Math.PI * 0.5
  );
  const backMesh = createKurzgesagtMesh(backGeom, COCCUS_COLOR, {
    partId: "peptidoglycan_wall",
    partName: "Gram+ Cell Wall (Posterior)",
    outlineThickness: 0.035
  });
  backMesh.rotation.x = Math.PI; // Face cut surface towards +Z
  heroGroup.add(backMesh);

  // Front hemisphere of Hero Coccus (animated cutaway)
  const frontCutawayGroup = new THREE.Group();
  frontCutawayGroup.name = "front-cutaway-shell";
  heroGroup.add(frontCutawayGroup);

  const frontGeom = new THREE.SphereGeometry(
    heroRadius, 28, 28,
    0, Math.PI * 2,
    0, Math.PI * 0.5
  );
  const frontMesh = createKurzgesagtMesh(frontGeom, COCCUS_COLOR, {
    partId: "peptidoglycan_wall",
    partName: "Thick Peptidoglycan Wall (Anterior)",
    outlineThickness: 0.035
  });
  frontMesh.rotation.x = -Math.PI * 0.5;
  frontCutawayGroup.add(frontMesh);

  // --------------------------------------------------------------------------
  // Internal Anatomy of Hero Coccus
  // --------------------------------------------------------------------------
  const heroInternals = new THREE.Group();
  heroInternals.name = "hero-internals";
  heroGroup.add(heroInternals);

  // 1. Cut Section Wall Rim (showing wall thickness)
  const rimGeom = new THREE.RingGeometry(heroRadius * 0.82, heroRadius, 32);
  const rimMesh = createKurzgesagtMesh(rimGeom, PEPTIDO_COLOR, {
    partId: "peptidoglycan_wall",
    partName: "Thick Peptidoglycan Cross-section (Gram+)",
    outlineThickness: 0.02
  });
  rimMesh.position.z = 0.001;
  heroInternals.add(rimMesh);

  // 2. Plasma Membrane Ring
  const memGeom = new THREE.RingGeometry(heroRadius * 0.77, heroRadius * 0.82, 32);
  const memMesh = createKurzgesagtMesh(memGeom, MEMBRANE_COLOR, {
    partId: "membrane_cytoplasm",
    partName: "Plasma Membrane Bilayer",
    outlineThickness: 0.015
  });
  memMesh.position.z = 0.002;
  heroInternals.add(memMesh);

  // 3. Cytoplasm Disc
  const cytoGeom = new THREE.CircleGeometry(heroRadius * 0.77, 32);
  const cytoMesh = createKurzgesagtMesh(cytoGeom, CYTO_COLOR, {
    partId: "membrane_cytoplasm",
    partName: "Bacterial Cytoplasm",
    outlineThickness: 0.015
  });
  cytoMesh.position.z = 0.0015;
  heroInternals.add(cytoMesh);

  // 4. Coiled Circular DNA Nucleoid (glowing green tangled chromosome)
  const nucleoidPoints = [];
  const loops = 12;
  for (let i = 0; i <= loops * 16; i++) {
    const t = i / (loops * 16);
    const angle = t * Math.PI * 2 * loops;
    const rad = 0.15 + 0.35 * Math.sin(t * Math.PI * 3.5);
    const x = Math.cos(angle) * rad + Math.sin(t * 10) * 0.05;
    const y = Math.sin(angle) * rad + Math.cos(t * 8) * 0.05;
    nucleoidPoints.push(new THREE.Vector3(x, y, 0.04));
  }
  const nucleoidCurve = new THREE.CatmullRomCurve3(nucleoidPoints);
  const nucleoidGeom = new THREE.TubeGeometry(nucleoidCurve, 90, 0.03, 6, false);
  const nucleoidMesh = createKurzgesagtMesh(nucleoidGeom, NUCLEOID_COLOR, {
    partId: "membrane_cytoplasm",
    partName: "Circular Bacterial Chromosome (DNA)",
    outlineThickness: 0.015
  });
  heroInternals.add(nucleoidMesh);

  // 5. Protein A Spikes (Golden Y-shaped molecules on outer surface)
  const proteinAGroup = new THREE.Group();
  proteinAGroup.name = "protein_a";
  heroGroup.add(proteinAGroup);

  function createYSpike() {
    const yGroup = new THREE.Group();
    // Stem
    const stemGeom = new THREE.CylinderGeometry(0.03, 0.03, 0.28, 8);
    const stemMesh = createKurzgesagtMesh(stemGeom, PROTEIN_A_COLOR, {
      partId: "protein_a",
      partName: "Protein A (Fc receptor binder)",
      outlineThickness: 0.015
    });
    stemMesh.position.y = 0.14;
    yGroup.add(stemMesh);

    // Left arm of Y
    const armGeom = new THREE.CylinderGeometry(0.025, 0.025, 0.16, 8);
    const armLeft = createKurzgesagtMesh(armGeom, PROTEIN_A_COLOR, {
      partId: "protein_a",
      partName: "Protein A Arm",
      outlineThickness: 0.015
    });
    armLeft.position.set(-0.06, 0.30, 0);
    armLeft.rotation.z = Math.PI / 4;
    yGroup.add(armLeft);

    // Right arm of Y
    const armRight = createKurzgesagtMesh(armGeom, PROTEIN_A_COLOR, {
      partId: "protein_a",
      partName: "Protein A Arm",
      outlineThickness: 0.015
    });
    armRight.position.set(0.06, 0.30, 0);
    armRight.rotation.z = -Math.PI / 4;
    yGroup.add(armRight);

    return yGroup;
  }

  // Attach Protein A around the perimeter of the Hero coccus
  const spikeCount = 14;
  for (let i = 0; i < spikeCount; i++) {
    const angle = (i / spikeCount) * Math.PI * 2;
    const spike = createYSpike();
    spike.position.set(
      Math.cos(angle) * (heroRadius + 0.02),
      Math.sin(angle) * (heroRadius + 0.02),
      0
    );
    spike.rotation.z = angle - Math.PI / 2;
    proteinAGroup.add(spike);
  }

  // --------------------------------------------------------------------------
  // Cutaway & Explode Animations
  // --------------------------------------------------------------------------
  let cutawayProgress = 0;

  rootGroup.userData.setCutaway = (t) => {
    cutawayProgress = Math.max(0, Math.min(1, t));

    // Open front shell of hero coccus
    frontCutawayGroup.position.z = cutawayProgress * 2.0;
    frontCutawayGroup.position.y = cutawayProgress * 0.9;
    frontCutawayGroup.rotation.x = -Math.PI * 0.5 - cutawayProgress * 0.6;
    frontCutawayGroup.scale.setScalar(1.0 - cutawayProgress * 0.1);

    // Explode surrounding cocci outward to give clear view
    cocciMeshes.forEach((coccus) => {
      const orig = coccus.userData.originalPos;
      const dir = orig.clone().normalize();
      coccus.position.copy(orig).addScaledVector(dir, cutawayProgress * 0.85);
    });

    // Move hero coccus slightly forward
    heroGroup.position.z = 0.45 + cutawayProgress * 0.35;
  };

  rootGroup.userData.getCutaway = () => cutawayProgress;

  rootGroup.userData.update = (time) => {
    // Gentle floating cluster sway
    clusterGroup.rotation.y = Math.sin(time * 0.5) * 0.05;
    clusterGroup.rotation.x = Math.cos(time * 0.4) * 0.04;
  };

  rootGroup.userData.setCutaway(0);

  return rootGroup;
}
