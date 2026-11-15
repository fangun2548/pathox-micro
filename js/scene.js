// ============================================================================
// Pathox-Micro · 3D Scene Controller (Clinical Lesions & Skin Blocks)
// ============================================================================

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { createVariolaLesionModel } from './models/variolaLesion.js';
import { createStaphLesionModel } from './models/staphLesion.js';
import { createAnthraxLesionModel } from './models/anthraxLesion.js';
import { createSyphilisLesionModel } from './models/syphilisLesion.js';
import { createHerpesLesionModel } from './models/herpesLesion.js';

export class MicrobeScene {
  constructor(canvasContainer) {
    this.container = canvasContainer;
    this.currentModel = null;
    this.currentModelId = null;
    this.currentModelGroup = new THREE.Group();
    this.isAutoRotating = true;
    this.isOutlinesVisible = true;
    this.cutawayTarget = 0;
    this.cutawayCurrent = 0;
    this.clock = new THREE.Clock();

    // Raycasting & Hover state
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(-999, -999);
    this.hoveredMesh = null;
    this.selectedPartId = null;

    // Callbacks
    this.onHoverPart = null;
    this.onClickPart = null;

    this.init();
  }

  init() {
    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0f1d); // Deep cosmic navy
    this.scene.fog = new THREE.FogExp2(0x0a0f1d, 0.035);

    // 2. Camera - Angled nicely to see the top lesion and the cutaway skin block
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 100);
    this.camera.position.set(0, 2.8, 6.8);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.container.appendChild(this.renderer.domElement);

    // 4. OrbitControls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.minDistance = 2.5;
    this.controls.maxDistance = 16.0;
    this.controls.autoRotate = this.isAutoRotating;
    this.controls.autoRotateSpeed = 0.7;
    this.controls.target.set(0, 0.4, 0);

    // 5. Lighting
    this.setupLighting();

    // 6. Background Particles
    this.setupBackgroundParticles();

    // 7. Add root model container
    this.scene.add(this.currentModelGroup);

    // 8. Event Listeners
    window.addEventListener('resize', this.onWindowResize.bind(this));
    this.renderer.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.renderer.domElement.addEventListener('pointerdown', this.onPointerDown.bind(this));
    this.renderer.domElement.addEventListener('pointerup', this.onPointerUp.bind(this));

    this.pointerDownPos = { x: 0, y: 0 };

    // 9. Start Render Loop
    this.animate();
  }

  setupLighting() {
    // Ambient light - deep rich indigo fill
    const ambientLight = new THREE.AmbientLight(0x334155, 1.25);
    this.scene.add(ambientLight);

    // Key Light - Bright crisp warm sun overhead
    this.keyLight = new THREE.DirectionalLight(0xffffff, 2.1);
    this.keyLight.position.set(5, 9, 6);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 1024;
    this.keyLight.shadow.mapSize.height = 1024;
    this.keyLight.shadow.bias = -0.001;
    this.scene.add(this.keyLight);

    // Fill Light - Soft cyan/blue from opposite flank
    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.85);
    fillLight.position.set(-6, 3, -4);
    this.scene.add(fillLight);

    // Rim / Backlight - Vibrant magenta/violet rim light
    const rimLight = new THREE.DirectionalLight(0xa855f7, 1.0);
    rimLight.position.set(0, -6, -5);
    this.scene.add(rimLight);
  }

  setupBackgroundParticles() {
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const palette = [
      new THREE.Color(0x38bdf8),
      new THREE.Color(0xa855f7),
      new THREE.Color(0xf43f5e),
      new THREE.Color(0xf59e0b)
    ];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 18;

      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3 + 0] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  loadModel(modelId) {
    if (this.currentModelId === modelId && this.currentModel) return;

    this.disposeCurrentModel();

    let newModel = null;
    switch (modelId) {
      case 'variola-pustule':
        newModel = createVariolaLesionModel();
        break;
      case 'staph-impetigo-abscess':
        newModel = createStaphLesionModel();
        break;
      case 'anthrax-black-eschar':
        newModel = createAnthraxLesionModel();
        break;
      case 'syphilis-hard-chancre':
        newModel = createSyphilisLesionModel();
        break;
      case 'herpes-dewdrop-vesicle':
        newModel = createHerpesLesionModel();
        break;
      default:
        console.warn(`Unknown model ID: ${modelId}`);
        newModel = createVariolaLesionModel();
        break;
    }

    this.currentModel = newModel;
    this.currentModelId = modelId;
    this.currentModelGroup.add(this.currentModel);

    // Initial entrance scale animation
    this.currentModel.scale.set(0.001, 0.001, 0.001);
    this.targetScale = 1.0;
    this.currentScale = 0.001;

    // Reset cutaway slider state
    this.cutawayTarget = 0;
    this.cutawayCurrent = 0;
    if (this.currentModel.userData.setCutaway) {
      this.currentModel.userData.setCutaway(0);
    }

    // Reset camera nicely
    this.resetCamera();
  }

  disposeCurrentModel() {
    if (!this.currentModel) return;

    this.currentModel.traverse((node) => {
      if (node.isMesh) {
        if (node.geometry) node.geometry.dispose();
        if (node.material) {
          if (Array.isArray(node.material)) {
            node.material.forEach((m) => m.dispose());
          } else {
            node.material.dispose();
          }
        }
      }
    });

    this.currentModelGroup.remove(this.currentModel);
    this.currentModel = null;
    this.hoveredMesh = null;
  }

  setCutaway(value) {
    this.cutawayTarget = Math.max(0, Math.min(1, value));
  }

  toggleAutoRotate() {
    this.isAutoRotating = !this.isAutoRotating;
    this.controls.autoRotate = this.isAutoRotating;
    return this.isAutoRotating;
  }

  toggleOutlines() {
    this.isOutlinesVisible = !this.isOutlinesVisible;
    if (this.currentModel) {
      this.currentModel.traverse((node) => {
        if (node.name === "outline") {
          node.visible = this.isOutlinesVisible;
        }
      });
    }
    return this.isOutlinesVisible;
  }

  resetCamera() {
    this.controls.target.set(0, 0.4, 0);
    this.camera.position.set(0, 2.8, 6.8);
    this.controls.update();
  }

  focusOnPart(partId) {
    if (!this.currentModel) return;

    this.selectedPartId = partId;
    let targetMesh = null;

    this.currentModel.traverse((node) => {
      if (node.isMesh && node.userData.partId === partId && !targetMesh) {
        targetMesh = node;
      }
    });

    if (targetMesh) {
      const box = new THREE.Box3().setFromObject(targetMesh);
      const center = box.getCenter(new THREE.Vector3());
      this.controls.target.copy(center);
      this.controls.update();
    }
  }

  onMouseMove(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.checkRaycastHover();
  }

  onPointerDown(event) {
    this.pointerDownPos = { x: event.clientX, y: event.clientY };
  }

  onPointerUp(event) {
    const dx = Math.abs(event.clientX - this.pointerDownPos.x);
    const dy = Math.abs(event.clientY - this.pointerDownPos.y);

    if (dx < 6 && dy < 6) {
      this.handleMeshClick();
    }
  }

  checkRaycastHover() {
    if (!this.currentModel) return;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.currentModel.children, true);

    const validHit = intersects.find(
      (hit) => hit.object.isMesh && hit.object.name !== "outline" && hit.object.userData.partId
    );

    if (validHit) {
      const mesh = validHit.object;
      if (this.hoveredMesh !== mesh) {
        this.resetHoverState();
        this.hoveredMesh = mesh;
        this.applyHoverHighlight(mesh);

        if (this.onHoverPart) {
          this.onHoverPart({
            id: mesh.userData.partId,
            name: mesh.userData.partName,
            point: validHit.point
          });
        }
      }
    } else {
      if (this.hoveredMesh) {
        this.resetHoverState();
        if (this.onHoverPart) this.onHoverPart(null);
      }
    }
  }

  applyHoverHighlight(mesh) {
    if (mesh.userData.outlineMesh) {
      mesh.userData.outlineMesh.material.uniforms.uColor.value.setHex(0x38bdf8);
      mesh.userData.outlineMesh.material.uniforms.uThickness.value = 0.065;
    }
  }

  resetHoverState() {
    if (this.hoveredMesh) {
      if (this.hoveredMesh.userData.outlineMesh) {
        this.hoveredMesh.userData.outlineMesh.material.uniforms.uColor.value.setHex(0x0a0f1d);
        this.hoveredMesh.userData.outlineMesh.material.uniforms.uThickness.value = 0.035;
      }
      this.hoveredMesh = null;
    }
  }

  handleMeshClick() {
    if (this.hoveredMesh && this.onClickPart) {
      this.onClickPart({
        id: this.hoveredMesh.userData.partId,
        name: this.hoveredMesh.userData.partName
      });
    }
  }

  onWindowResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // Scale-in entrance lerp
    if (this.currentScale < this.targetScale) {
      this.currentScale += (this.targetScale - this.currentScale) * 0.12;
      if (this.currentModel) {
        this.currentModel.scale.set(this.currentScale, this.currentScale, this.currentScale);
      }
    }

    // Cutaway animation lerp
    if (Math.abs(this.cutawayCurrent - this.cutawayTarget) > 0.001) {
      this.cutawayCurrent += (this.cutawayTarget - this.cutawayCurrent) * 0.14;
      if (this.currentModel && this.currentModel.userData.setCutaway) {
        this.currentModel.userData.setCutaway(this.cutawayCurrent);
      }
    }

    // Update model procedural animation (glistening, tension, etc.)
    if (this.currentModel && this.currentModel.userData.update) {
      this.currentModel.userData.update(elapsedTime);
    }

    // Gentle rotation of background particles
    if (this.particles) {
      this.particles.rotation.y = elapsedTime * 0.012;
    }

    // Update controls
    this.controls.update();

    // Render frame
    this.renderer.render(this.scene, this.camera);
  }
}
