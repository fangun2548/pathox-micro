// ============================================================================
// Variola Virus (Smallpox) · 3D Kurzgesagt Model
// Brick-shaped virion with cutaway Dumbbell Core, Lateral Bodies, and dsDNA
// ============================================================================

import * as THREE from 'three';
import { createKurzgesagtMesh, createKurzgesagtMaterial } from '../toonMaterials.js';

export function createVariolaModel() {
  const rootGroup = new THREE.Group();
  rootGroup.name = "variola-virus";

  // Configuration colors from Kurzgesagt aesthetic
  const ENVELOPE_COLOR = 0xbe123c;   // Crimson red brick envelope
  const ENVELOPE_RIM = 0x9f1239;
  const CORE_COLOR = 0x06b6d4;       // Electric cyan dumbbell core
  const LATERAL_COLOR = 0xf59e0b;    // Golden lateral bodies
  const DNA_COLOR = 0xa855f7;        // Glowing purple dsDNA coil
  const SPIKE_COLOR = 0xfb7185;      // Coral surface tubules

  // Containers for cutaway animation
  const shellGroup = new THREE.Group();
  shellGroup.name = "envelope-shell";
  const frontShellGroup = new THREE.Group();
  frontShellGroup.name = "front-shell";
  const backShellGroup = new THREE.Group();
  backShellGroup.name = "back-shell";
  const internalGroup = new THREE.Group();
  internalGroup.name = "internal-structures";

  // --------------------------------------------------------------------------
  // 1. Brick-shaped Envelope (Rounded Box)
  // --------------------------------------------------------------------------
  const brickWidth = 3.8;
  const brickHeight = 2.8;
  const brickDepth = 2.2;
  const cornerRadius = 0.6;

  // Function to create a rounded brick half (back half and front cutaway half)
  function createBrickHalfGeometry(isFront = false) {
    // We create a box geometry with bevel or smooth segments
    // For smooth Kurzgesagt style, an elongated sphere or rounded box works wonders
    const geom = new THREE.BoxGeometry(
      brickWidth,
      brickHeight,
      brickDepth * 0.5,
      16, 16, 8
    );

    // Round the vertices to produce organic brick shape
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);

      // Spherize edges slightly
      const len = Math.sqrt(x * x + y * y + z * z);
      const factor = 0.12;
      x += (x / (len + 0.001)) * factor;
      y += (y / (len + 0.001)) * factor;

      pos.setXYZ(i, x, y, z);
    }
    geom.computeVertexNormals();
    return geom;
  }

  // Back shell (stationary)
  const backGeom = createBrickHalfGeometry(false);
  const backMesh = createKurzgesagtMesh(backGeom, ENVELOPE_COLOR, {
    partId: "envelope",
    partName: "Outer Envelope (Membrane)",
    outlineThickness: 0.04
  });
  backMesh.position.z = -brickDepth * 0.25;
  backShellGroup.add(backMesh);

  // Front shell (animated cutaway)
  const frontGeom = createBrickHalfGeometry(true);
  const frontMesh = createKurzgesagtMesh(frontGeom, ENVELOPE_COLOR, {
    partId: "envelope",
    partName: "Outer Envelope (Cutaway Half)",
    outlineThickness: 0.04
  });
  frontMesh.position.z = brickDepth * 0.25;
  frontShellGroup.add(frontMesh);

  // Add decorative surface ridges/tubules to both shells
  function addSurfaceTubules(targetGroup, zSign) {
    const tubuleGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.35, 8);
    tubuleGeom.rotateX(Math.PI / 2);
    const tubuleMat = createKurzgesagtMaterial(SPIKE_COLOR);

    for (let x = -1.5; x <= 1.5; x += 0.55) {
      for (let y = -1.1; y <= 1.1; y += 0.55) {
        if (Math.abs(x) > 1.3 && Math.abs(y) > 0.9) continue; // skip corners
        const tubule = new THREE.Mesh(tubuleGeom, tubuleMat);
        tubule.position.set(
          x + (Math.random() - 0.5) * 0.1,
          y + (Math.random() - 0.5) * 0.1,
          zSign * (brickDepth * 0.5 + 0.08)
        );
        tubule.rotation.z = Math.random() * Math.PI;
        targetGroup.add(tubule);
      }
    }
  }

  addSurfaceTubules(frontShellGroup, 1);
  addSurfaceTubules(backShellGroup, -1);

  shellGroup.add(backShellGroup);
  shellGroup.add(frontShellGroup);
  rootGroup.add(shellGroup);

  // --------------------------------------------------------------------------
  // 2. Dumbbell-Shaped Core (แกนกลางรูปดัมเบลล์)
  // --------------------------------------------------------------------------
  const dumbbellGroup = new THREE.Group();
  dumbbellGroup.name = "dumbbell_core";

  // Left bulb of the dumbbell
  const bulbLeftGeom = new THREE.SphereGeometry(0.85, 24, 24);
  bulbLeftGeom.scale(1.0, 1.25, 0.75);
  const bulbLeft = createKurzgesagtMesh(bulbLeftGeom, CORE_COLOR, {
    partId: "dumbbell_core",
    partName: "Dumbbell Core (Left Lobe)",
    outlineThickness: 0.035
  });
  bulbLeft.position.x = -1.0;
  dumbbellGroup.add(bulbLeft);

  // Right bulb of the dumbbell
  const bulbRightGeom = new THREE.SphereGeometry(0.85, 24, 24);
  bulbRightGeom.scale(1.0, 1.25, 0.75);
  const bulbRight = createKurzgesagtMesh(bulbRightGeom, CORE_COLOR, {
    partId: "dumbbell_core",
    partName: "Dumbbell Core (Right Lobe)",
    outlineThickness: 0.035
  });
  bulbRight.position.x = 1.0;
  dumbbellGroup.add(bulbRight);

  // Pinched waist / bridge of the dumbbell (curved biconcave center)
  const waistGeom = new THREE.CylinderGeometry(0.48, 0.48, 1.4, 24);
  waistGeom.rotateZ(Math.PI / 2);
  waistGeom.scale(1.0, 1.0, 0.65);
  const waist = createKurzgesagtMesh(waistGeom, CORE_COLOR, {
    partId: "dumbbell_core",
    partName: "Dumbbell Core (Biconcave Waist)",
    outlineThickness: 0.035
  });
  dumbbellGroup.add(waist);

  // Core border line / internal seam
  const coreCoreMesh = dumbbellGroup;
  internalGroup.add(dumbbellGroup);

  // --------------------------------------------------------------------------
  // 3. Lateral Bodies (Two Golden protein masses on top & bottom concavities)
  // --------------------------------------------------------------------------
  const lateralTopGeom = new THREE.SphereGeometry(0.55, 20, 20);
  lateralTopGeom.scale(1.5, 0.6, 0.75);
  const lateralTop = createKurzgesagtMesh(lateralTopGeom, LATERAL_COLOR, {
    partId: "lateral_bodies",
    partName: "Top Lateral Body",
    outlineThickness: 0.035
  });
  lateralTop.position.set(0, 0.82, 0);
  internalGroup.add(lateralTop);

  const lateralBottomGeom = new THREE.SphereGeometry(0.55, 20, 20);
  lateralBottomGeom.scale(1.5, 0.6, 0.75);
  const lateralBottom = createKurzgesagtMesh(lateralBottomGeom, LATERAL_COLOR, {
    partId: "lateral_bodies",
    partName: "Bottom Lateral Body",
    outlineThickness: 0.035
  });
  lateralBottom.position.set(0, -0.82, 0);
  internalGroup.add(lateralBottom);

  // --------------------------------------------------------------------------
  // 4. Linear dsDNA Genome (Tightly coiled strand inside the dumbbell core)
  // --------------------------------------------------------------------------
  const dnaCurvePoints = [];
  const dnaLoops = 14;
  for (let i = 0; i < dnaLoops * 20; i++) {
    const t = i / (dnaLoops * 20);
    const angle = t * Math.PI * 2 * dnaLoops;
    const x = Math.sin(t * Math.PI) * 1.8 - 0.9;
    const y = Math.sin(angle) * 0.35 * Math.sin(t * Math.PI * 1.0);
    const z = Math.cos(angle) * 0.35 * Math.sin(t * Math.PI * 1.0) + 0.15;
    dnaCurvePoints.push(new THREE.Vector3(x, y, z));
  }
  const dnaCurve = new THREE.CatmullRomCurve3(dnaCurvePoints);
  const dnaGeom = new THREE.TubeGeometry(dnaCurve, 120, 0.05, 8, false);
  const dnaMesh = createKurzgesagtMesh(dnaGeom, DNA_COLOR, {
    partId: "genome_dna",
    partName: "Linear dsDNA Genome (~186 kbp)",
    outlineThickness: 0.02
  });
  internalGroup.add(dnaMesh);

  rootGroup.add(internalGroup);

  // --------------------------------------------------------------------------
  // Cutaway & Animation Hooks
  // --------------------------------------------------------------------------
  let cutawayProgress = 0; // 0 = closed, 1 = fully open cutaway

  rootGroup.userData.setCutaway = (t) => {
    cutawayProgress = Math.max(0, Math.min(1, t));
    // Smooth translation of the front shell forward and slightly upward
    frontShellGroup.position.z = brickDepth * 0.25 + cutawayProgress * 2.8;
    frontShellGroup.position.y = cutawayProgress * 0.8;
    frontShellGroup.rotation.x = cutawayProgress * -0.4;
    frontShellGroup.scale.setScalar(1.0 - cutawayProgress * 0.05);

    // Slightly separate lateral bodies when exploded for dramatic visibility
    lateralTop.position.y = 0.82 + cutawayProgress * 0.45;
    lateralBottom.position.y = -0.82 - cutawayProgress * 0.45;

    // Bring DNA forward slightly in full cutaway
    dnaMesh.position.z = cutawayProgress * 0.2;
  };

  rootGroup.userData.getCutaway = () => cutawayProgress;

  // Gentle floating animation update
  rootGroup.userData.update = (time) => {
    // Subtle breathing pulsing
    const breathe = 1 + Math.sin(time * 1.5) * 0.015;
    rootGroup.scale.set(breathe, breathe, breathe);
  };

  // Start closed by default
  rootGroup.userData.setCutaway(0);

  return rootGroup;
}
