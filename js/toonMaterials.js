// ============================================================================
// Pathox-Micro · Kurzgesagt Cel-Shading & Inverted-Hull Outline Engine
// ============================================================================

import * as THREE from 'three';

/**
 * Creates a discrete 3-tone or 4-tone gradient texture for cel-shading.
 * Produces the clean stepped comic-book shading characteristic of Kurzgesagt.
 */
export function createSteppedGradientMap(steps = [0.35, 0.7, 1.0]) {
  const size = steps.length;
  const data = new Uint8Array(size);
  for (let i = 0; i < size; i++) {
    data[i] = Math.floor(steps[i] * 255);
  }
  const texture = new THREE.DataTexture(data, size, 1, THREE.RedFormat);
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}

// Global gradient maps for reuse
export const defaultGradientMap = createSteppedGradientMap([0.3, 0.65, 1.0]);
export const highContrastGradientMap = createSteppedGradientMap([0.2, 0.55, 0.9, 1.0]);

/**
 * Creates an Inverted-Hull Outline Shader Material.
 * Vertex shader extrudes vertices along normal vectors.
 * Renders on THREE.BackSide to produce a crisp cartoon vector border.
 */
export function createOutlineMaterial(color = 0x0f172a, thickness = 0.035) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uThickness: { value: thickness }
    },
    vertexShader: `
      uniform float uThickness;
      void main() {
        vec3 normalExtruded = position + normal * uThickness;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(normalExtruded, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      void main() {
        gl_FragColor = vec4(uColor, 1.0);
      }
    `,
    side: THREE.BackSide,
    depthWrite: true,
    depthTest: true
  });
}

/**
 * Creates a complete Kurzgesagt Cel-Shaded Material.
 */
export function createKurzgesagtMaterial(color, options = {}) {
  const gradient = options.gradientMap || defaultGradientMap;
  const material = new THREE.MeshToonMaterial({
    color: new THREE.Color(color),
    gradientMap: gradient,
    roughness: options.roughness !== undefined ? options.roughness : 0.4,
    wireframe: options.wireframe || false,
    transparent: options.transparent || false,
    opacity: options.opacity !== undefined ? options.opacity : 1.0,
    side: options.side || THREE.FrontSide
  });

  return material;
}

/**
 * Wraps any geometry into a Kurzgesagt style mesh with an integrated Inverted-Hull outline.
 * Returns a THREE.Group or Mesh with outline attached.
 */
export function createKurzgesagtMesh(geometry, baseColor, options = {}) {
  const thickness = options.outlineThickness !== undefined ? options.outlineThickness : 0.04;
  const outlineColor = options.outlineColor !== undefined ? options.outlineColor : 0x0a0f1d;
  
  // Base Toon Mesh
  const baseMaterial = createKurzgesagtMaterial(baseColor, options);
  const mesh = new THREE.Mesh(geometry, baseMaterial);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  // Inverted Hull Outline Mesh
  if (!options.noOutline) {
    const outlineMaterial = createOutlineMaterial(outlineColor, thickness);
    const outlineMesh = new THREE.Mesh(geometry, outlineMaterial);
    outlineMesh.name = "outline";
    outlineMesh.renderOrder = 0;
    mesh.add(outlineMesh);
    mesh.userData.outlineMesh = outlineMesh;
  }

  // Store metadata
  mesh.userData.originalColor = new THREE.Color(baseColor);
  if (options.partId) mesh.userData.partId = options.partId;
  if (options.partName) mesh.userData.partName = options.partName;

  return mesh;
}
