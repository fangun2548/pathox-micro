// ============================================================================
// Bacteriophage T4 · 3D Kurzgesagt Model
// Lunar-lander viral machine with Icosahedral Head, dsDNA, Sheath & Articulated Fibers
// ============================================================================

import * as THREE from 'three';
import { createKurzgesagtMesh, createKurzgesagtMaterial } from '../toonMaterials.js';

export function createBacteriophageModel() {
  const rootGroup = new THREE.Group();
  rootGroup.name = "bacteriophage-t4";

  // Palette: Kurzgesagt Sci-Fi Cyan, Teal, and Violet
  const CAPSID_COLOR = 0x0284c7;    // Deep sky blue
  const SHEATH_COLOR = 0x0d9488;    // Teal sheath
  const INNER_TUBE_COLOR = 0x06b6d4;// Bright cyan core tube
  const BASEPLATE_COLOR = 0x0f766e; // Deep teal baseplate
  const FIBER_COLOR = 0x38bdf8;     // Cyan tail fibers
  const DNA_COLOR = 0xa855f7;       // Glowing purple dsDNA

  // Containers
  const headGroup = new THREE.Group();
  headGroup.name = "head-group";
  const tailGroup = new THREE.Group();
  tailGroup.name = "tail-group";
  const fibersGroup = new THREE.Group();
  fibersGroup.name = "fibers-group";

  rootGroup.add(headGroup);
  rootGroup.add(tailGroup);
  rootGroup.add(fibersGroup);

  // Position offset to balance model around origin
  headGroup.position.y = 1.35;
  tailGroup.position.y = 0.0;
  fibersGroup.position.y = -1.2;

  // --------------------------------------------------------------------------
  // 1. Icosahedral Capsid Head (with Cutaway Front Lid)
  // --------------------------------------------------------------------------
  const headRadius = 1.25;

  // Back capsid shell
  const backCapsidGeom = new THREE.IcosahedronGeometry(headRadius, 0);
  backCapsidGeom.scale(1.0, 1.25, 1.0);
  const backCapsidMesh = createKurzgesagtMesh(backCapsidGeom, CAPSID_COLOR, {
    partId: "capsid_head",
    partName: "Icosahedral Capsid Head (Posterior)",
    outlineThickness: 0.035
  });
  headGroup.add(backCapsidMesh);

  // Front Cutaway Lid
  const frontLidGroup = new THREE.Group();
  frontLidGroup.name = "capsid-front-lid";
  const frontCapsidGeom = new THREE.IcosahedronGeometry(headRadius * 1.02, 0);
  frontCapsidGeom.scale(1.0, 1.25, 1.0);
  const frontCapsidMesh = createKurzgesagtMesh(frontCapsidGeom, CAPSID_COLOR, {
    partId: "capsid_head",
    partName: "Icosahedral Capsid Facets",
    outlineThickness: 0.035
  });
  frontLidGroup.add(frontCapsidMesh);
  headGroup.add(frontLidGroup);

  // --------------------------------------------------------------------------
  // 2. High-Density dsDNA Coil Inside Capsid Head
  // --------------------------------------------------------------------------
  const dnaPoints = [];
  const dnaSegments = 160;
  for (let i = 0; i < dnaSegments; i++) {
    const t = i / dnaSegments;
    const phi = Math.acos(1 - 2 * t);
    const theta = Math.sqrt(dnaSegments * Math.PI) * phi * 1.8;
    const r = (headRadius * 0.72) * Math.sin(phi);
    const x = r * Math.cos(theta);
    const y = (t - 0.5) * 2.1 * (headRadius * 0.72);
    const z = r * Math.sin(theta);
    dnaPoints.push(new THREE.Vector3(x, y, z));
  }
  const dnaCurve = new THREE.CatmullRomCurve3(dnaPoints);
  const dnaGeom = new THREE.TubeGeometry(dnaCurve, 100, 0.04, 6, false);
  const dnaMesh = createKurzgesagtMesh(dnaGeom, DNA_COLOR, {
    partId: "capsid_head",
    partName: "Pressurized Linear dsDNA (~50 atm)",
    outlineThickness: 0.02
  });
  headGroup.add(dnaMesh);

  // --------------------------------------------------------------------------
  // 3. Collar & Whiskers
  // --------------------------------------------------------------------------
  const collarGeom = new THREE.CylinderGeometry(0.35, 0.42, 0.16, 12);
  const collarMesh = createKurzgesagtMesh(collarGeom, BASEPLATE_COLOR, {
    partId: "collar_whisker",
    partName: "Collar Disc & Whiskers",
    outlineThickness: 0.03
  });
  collarMesh.position.y = -0.15;
  tailGroup.add(collarMesh);

  // --------------------------------------------------------------------------
  // 4. Contractile Tail Sheath & Inner Tube
  // --------------------------------------------------------------------------
  const sheathLength = 1.35;
  const sheathRingsCount = 8;
  const sheathRings = [];

  // Inner hollow injection tube
  const innerTubeGeom = new THREE.CylinderGeometry(0.12, 0.12, sheathLength + 0.3, 12);
  const innerTubeMesh = createKurzgesagtMesh(innerTubeGeom, INNER_TUBE_COLOR, {
    partId: "contractile_sheath",
    partName: "Rigid Hollow Injection Core Tube",
    outlineThickness: 0.025
  });
  innerTubeMesh.position.y = -sheathLength * 0.5 - 0.2;
  tailGroup.add(innerTubeMesh);

  // Outer ribbed contractile sheath rings
  for (let i = 0; i < sheathRingsCount; i++) {
    const ringGeom = new THREE.TorusGeometry(0.28, 0.075, 10, 16);
    ringGeom.rotateX(Math.PI / 2);
    const ringMesh = createKurzgesagtMesh(ringGeom, SHEATH_COLOR, {
      partId: "contractile_sheath",
      partName: "Contractile Sheath Helical Ring",
      outlineThickness: 0.02
    });
    ringMesh.position.y = -0.32 - (i / (sheathRingsCount - 1)) * (sheathLength - 0.2);
    ringMesh.userData.origY = ringMesh.position.y;
    tailGroup.add(ringMesh);
    sheathRings.push(ringMesh);
  }

  // --------------------------------------------------------------------------
  // 5. Hexagonal Baseplate with Tail Pins
  // --------------------------------------------------------------------------
  const baseplateGeom = new THREE.CylinderGeometry(0.52, 0.45, 0.18, 6);
  const baseplateMesh = createKurzgesagtMesh(baseplateGeom, BASEPLATE_COLOR, {
    partId: "baseplate_fibers",
    partName: "Hexagonal Sensory Baseplate",
    outlineThickness: 0.03
  });
  baseplateMesh.position.y = -sheathLength - 0.18;
  tailGroup.add(baseplateMesh);

  // Small tail pins underneath baseplate
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const pinGeom = new THREE.ConeGeometry(0.04, 0.18, 6);
    pinGeom.rotateX(Math.PI);
    const pinMesh = createKurzgesagtMesh(pinGeom, FIBER_COLOR, {
      partId: "baseplate_fibers",
      partName: "Cell-Wall Penetrating Pin",
      outlineThickness: 0.015
    });
    pinMesh.position.set(
      Math.cos(angle) * 0.35,
      -sheathLength - 0.32,
      Math.sin(angle) * 0.35
    );
    tailGroup.add(pinMesh);
  }

  // --------------------------------------------------------------------------
  // 6. Six Articulated Jointed Tail Fibers (Spider landing legs)
  // --------------------------------------------------------------------------
  const fiberMeshes = [];

  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const fiberRoot = new THREE.Group();
    fiberRoot.position.set(
      Math.cos(angle) * 0.45,
      -sheathLength - 0.18,
      Math.sin(angle) * 0.45
    );
    fiberRoot.rotation.y = angle;

    // Upper Leg (Femur)
    const upperLegGeom = new THREE.CylinderGeometry(0.045, 0.04, 1.25, 8);
    upperLegGeom.rotateZ(Math.PI / 3);
    upperLegGeom.translate(0.55, -0.3, 0);
    const upperLeg = createKurzgesagtMesh(upperLegGeom, FIBER_COLOR, {
      partId: "baseplate_fibers",
      partName: "Jointed Tail Fiber (Upper Segment)",
      outlineThickness: 0.02
    });
    fiberRoot.add(upperLeg);

    // Knee Joint
    const kneeGeom = new THREE.SphereGeometry(0.08, 12, 12);
    const knee = createKurzgesagtMesh(kneeGeom, BASEPLATE_COLOR, {
      partId: "baseplate_fibers",
      partName: "Fiber Knee Joint",
      outlineThickness: 0.02
    });
    knee.position.set(1.1, -0.6, 0);
    fiberRoot.add(knee);

    // Lower Leg (Tibia) reaching down to surface
    const lowerLegGeom = new THREE.CylinderGeometry(0.04, 0.03, 1.35, 8);
    lowerLegGeom.rotateZ(-Math.PI / 6);
    lowerLegGeom.translate(0.35, -0.65, 0);
    const lowerLeg = createKurzgesagtMesh(lowerLegGeom, FIBER_COLOR, {
      partId: "baseplate_fibers",
      partName: "Jointed Tail Fiber (Landing Foot)",
      outlineThickness: 0.02
    });
    lowerLeg.position.set(1.1, -0.6, 0);
    fiberRoot.add(lowerLeg);

    tailGroup.add(fiberRoot);
    fiberMeshes.push(fiberRoot);
  }

  // --------------------------------------------------------------------------
  // Cutaway & Sheath Contraction Animation
  // --------------------------------------------------------------------------
  let cutawayProgress = 0;

  rootGroup.userData.setCutaway = (t) => {
    cutawayProgress = Math.max(0, Math.min(1, t));

    // Capsid lid opens upward and shifts forward
    frontLidGroup.position.z = cutawayProgress * 1.8;
    frontLidGroup.position.y = cutawayProgress * 0.7;
    frontLidGroup.rotation.x = cutawayProgress * -0.5;
    frontLidGroup.scale.setScalar(1.0 - cutawayProgress * 0.1);

    // Contractile Sheath demonstration: compress sheath rings upward
    sheathRings.forEach((ring, idx) => {
      const origY = ring.userData.origY;
      const compression = (idx / (sheathRingsCount - 1)) * 0.45 * cutawayProgress;
      ring.position.y = origY + compression;
    });

    // Baseplate moves slightly upward during contraction
    baseplateMesh.position.y = -sheathLength - 0.18 + cutawayProgress * 0.4;

    // Tail fibers flex outwards like spider legs crouching
    fiberMeshes.forEach((fiber) => {
      fiber.rotation.z = cutawayProgress * -0.25;
    });
  };

  rootGroup.userData.getCutaway = () => cutawayProgress;

  rootGroup.userData.update = (time) => {
    // Subtle rhythmic robotic landing bobbing
    const bob = Math.sin(time * 2.0) * 0.02;
    headGroup.position.y = 1.35 + bob;
  };

  rootGroup.userData.setCutaway(0);

  return rootGroup;
}
