import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { soundEngine } from '../audio/soundEngine';
import { MemoryPhoto } from '../data/galleryData';

// Pre-allocated math helpers to eliminate Garbage Collection in render loop
const _vec3 = new THREE.Vector3();
const _targetVec = new THREE.Vector3();
const _matrix = new THREE.Matrix4();
const _color = new THREE.Color();
const _raycaster = new THREE.Raycaster();
const _pointer = new THREE.Vector2();

export interface UniverseCallbacks {
  onPhotoSelected?: (photo: MemoryPhoto) => void;
  onSceneChange?: (sceneIndex: number) => void;
  onFirstInteraction?: () => void;
  onEnvelopeOpened?: () => void;
}

export class ThreeUniverse {
  private container: HTMLDivElement;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private clock = new THREE.Clock();
  private animationFrameId: number | null = null;
  private callbacks: UniverseCallbacks;

  // Scene state
  public currentScene = 1; // 1 to 6
  public controls!: OrbitControls;
  private isTransitioningScene = false;
  private pointerDownPos = { x: 0, y: 0 };
  private pointerDownTime = 0;

  private targetCameraPos = new THREE.Vector3(0, 0, 14);
  private targetCameraLookAt = new THREE.Vector3(0, 0, 0);
  private currentCameraLookAt = new THREE.Vector3(0, 0, 0);

  // Parallax mouse offset
  private mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

  // 1. Scene 1 & 2: Celestial Pearl Orb & Rings
  private orbGroup!: THREE.Group;
  private coreSphere!: THREE.Mesh;
  private innerGlow!: THREE.Mesh;
  private ring1!: THREE.Mesh;
  private ring2!: THREE.Mesh;
  private ring3!: THREE.Mesh;
  private coreHeart!: THREE.Mesh;
  private coreLabel!: THREE.Mesh;

  // 2. Petals InstancedMesh (Scene 2 & Ambient)
  private petalMesh!: THREE.InstancedMesh;
  private petalCount = 420;
  private petalData: Array<{
    pos: THREE.Vector3;
    rot: THREE.Euler;
    rotSpeed: THREE.Vector3;
    speed: THREE.Vector3;
    scale: number;
    phase: number;
  }> = [];

  // 3. Ambient Stardust
  private stardustPoints!: THREE.Points;
  private stardustCount = 1100;

  // 4. Scene 3: Memory Galaxy Cards
  private galleryGroup!: THREE.Group;
  private cardMeshes: Array<{
    group: THREE.Group;
    photo: MemoryPhoto;
    basePos: THREE.Vector3;
    baseRot: THREE.Euler;
    mesh: THREE.Mesh;
  }> = [];
  private hoveredCard: THREE.Group | null = null;

  // 5. Scene 5: 3D Envelope & Letter
  private envelopeGroup!: THREE.Group;
  private envelopeFlap!: THREE.Mesh;
  private letterMesh!: THREE.Mesh;
  public isEnvelopeOpen = false;

  // 6. Scene 6: Heart Constellation Particles
  private heartParticles!: THREE.Points;
  private heartCount = 1800;
  private heartPositions: Float32Array;
  private heartTargetPositions: Float32Array;
  private heartCurrentPositions: Float32Array;

  // 7. Touch Flower Explosion Emitter
  private burstParticles: Array<{
    mesh: THREE.Mesh;
    velocity: THREE.Vector3;
    rotSpeed: THREE.Vector3;
    life: number;
    maxLife: number;
    scale: number;
    kind: 'petal' | 'heart' | 'spark';
  }> = [];
  private burstGroup!: THREE.Group;
  private grandBloomCooldown = 0;
  private isGrandBlooming = false;
  private sharedPetalGeo!: THREE.PlaneGeometry;
  private sharedHeartGeo!: THREE.ShapeGeometry;
  private sharedSparkGeo!: THREE.SphereGeometry;

  constructor(container: HTMLDivElement, callbacks: UniverseCallbacks = {}) {
    this.container = container;
    this.callbacks = callbacks;

    this.heartPositions = new Float32Array(this.heartCount * 3);
    this.heartTargetPositions = new Float32Array(this.heartCount * 3);
    this.heartCurrentPositions = new Float32Array(this.heartCount * 3);

    this.init();
    if ((this as any)._webglFailed) return;
    this.setupEvents();
    this.animate();
  }

  private init() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    // 1. Scene & Renderer Setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x06020a);
    this.scene.fog = new THREE.FogExp2(0x06020a, 0.028);

    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 150);
    this.camera.position.set(0, 0, 14);
    this.currentCameraLookAt.set(0, 0, 0);

    const isHeadless = navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent);
    try {
      this.renderer = new THREE.WebGLRenderer({
        powerPreference: 'high-performance',
        antialias: true,
        alpha: false,
      });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio, 2));
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.15;
      this.renderer.shadowMap.enabled = !isHeadless;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.container.appendChild(this.renderer.domElement);
    } catch (err) {
      console.error('WebGL unavailable:', err);
      this.container.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:#fce7f3;font-family:serif;text-align:center;padding:2rem;background:radial-gradient(ellipse at center,#2a0a1a 0%,#050207 70%)">
          <h1 style="font-size:1.8rem;margin-bottom:0.75rem;text-shadow:0 0 20px #f472b6">20/10 Lớp 12A1</h1>
          <p style="opacity:0.85;max-width:28rem;line-height:1.6">Trình duyệt hiện tại chưa hỗ trợ WebGL.<br/>Vui lòng mở bằng Chrome / Edge / Safari trên máy có GPU để trải nghiệm đầy đủ hiệu ứng 3D lãng mạn.</p>
        </div>`;
      // Mark as failed so animate/dispose don't crash
      (this as any)._webglFailed = true;
      return;
    }

    // Initialize OrbitControls for intuitive 3D rotation, pan, and zoom
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.055;
    this.controls.minDistance = 2.2;
    this.controls.maxDistance = 60.0;
    this.controls.enablePan = true;
    this.controls.panSpeed = 0.9;
    this.controls.rotateSpeed = 0.75;
    this.controls.zoomSpeed = 1.15;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.42;
    this.controls.target.set(0, 0, 0);
    this.controls.enableZoom = true;
    this.controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN,
    };

    // 2. Studio PBR Environment
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    pmremGenerator.compileEquirectangularShader();
    this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 3. Studio Lighting Rig (3-point)
    const keyLight = new THREE.DirectionalLight(0xffe4e6, 2.8);
    keyLight.position.set(6, 9, 8);
    keyLight.castShadow = !isHeadless;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0004;
    this.scene.add(keyLight);

    const fillLight = new THREE.HemisphereLight(0xffb6c1, 0x1f0e24, 1.8);
    this.scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xff69b4, 3.5, 30);
    rimLight.position.set(-6, -4, -6);
    this.scene.add(rimLight);

    // 4. Build Procedural 3D Subjects
    this.buildCelestialOrb();
    this.buildPetalSwarm();
    this.buildStardust();
    this.buildGalleryConstellation([]);
    this.build3DEnvelope();
    this.buildHeartConstellation();
    this.buildBurstEmitter();

    // Set initial scene camera and dynamic aspect FOV
    this.setScene(1);
    this.updateCameraFov();
  }

  /**
   * Scene 1: Composite Celestial Pearl Orb
   */
  private buildCelestialOrb() {
    this.orbGroup = new THREE.Group();
    this.orbGroup.position.set(0, 0, 0);

    // Soft translucent outer shell — more transparent so "12A1" reads clearly
    const sphereGeo = new THREE.SphereGeometry(1.9, 64, 64);
    const sphereMat = new THREE.MeshPhysicalMaterial({
      color: 0xffd6e8,
      emissive: 0x5c1028,
      emissiveIntensity: 0.28,
      roughness: 0.25,
      metalness: 0.04,
      transmission: 0.9,
      thickness: 1.2,
      clearcoat: 0.85,
      clearcoatRoughness: 0.3,
      reflectivity: 0.55,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    });
    this.coreSphere = new THREE.Mesh(sphereGeo, sphereMat);
    this.coreSphere.castShadow = true;
    this.orbGroup.add(this.coreSphere);

    // Soft inner glow (fog-like core) — keep lighter so text isn't buried
    const innerGeo = new THREE.SphereGeometry(1.05, 32, 32);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xff4d7a,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.innerGlow = new THREE.Mesh(innerGeo, innerMat);
    this.orbGroup.add(this.innerGlow);

    // Beating heart inside the core
    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 0.35);
    heartShape.bezierCurveTo(0, 0.35, -0.1, 0.1, -0.35, 0.1);
    heartShape.bezierCurveTo(-0.7, 0.1, -0.7, 0.45, -0.7, 0.45);
    heartShape.bezierCurveTo(-0.7, 0.7, -0.4, 0.95, 0, 1.25);
    heartShape.bezierCurveTo(0.4, 0.95, 0.7, 0.7, 0.7, 0.45);
    heartShape.bezierCurveTo(0.7, 0.45, 0.7, 0.1, 0.35, 0.1);
    heartShape.bezierCurveTo(0.1, 0.1, 0, 0.35, 0, 0.35);
    const heartGeo = new THREE.ShapeGeometry(heartShape);
    heartGeo.center();
    heartGeo.scale(0.55, 0.55, 0.55);
    const heartMat = new THREE.MeshBasicMaterial({
      color: 0xff1a4d,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.coreHeart = new THREE.Mesh(heartGeo, heartMat);
    this.coreHeart.position.set(0, -0.12, 0);
    this.orbGroup.add(this.coreHeart);

    // Bold solid red "12A1" — always readable inside the core
    const labelCanvas = document.createElement('canvas');
    labelCanvas.width = 1024;
    labelCanvas.height = 512;
    const lctx = labelCanvas.getContext('2d')!;
    lctx.clearRect(0, 0, 1024, 512);

    // Dark soft disc so text never blends into the scene
    const disc = lctx.createRadialGradient(512, 256, 20, 512, 256, 240);
    disc.addColorStop(0, 'rgba(80, 0, 20, 0.75)');
    disc.addColorStop(0.55, 'rgba(60, 0, 15, 0.45)');
    disc.addColorStop(1, 'rgba(40, 0, 10, 0)');
    lctx.fillStyle = disc;
    lctx.fillRect(0, 0, 1024, 512);

    lctx.font = 'bold 220px "Plus Jakarta Sans", Arial Black, system-ui, sans-serif';
    lctx.textAlign = 'center';
    lctx.textBaseline = 'middle';

    // Outer white stroke for contrast
    lctx.lineWidth = 18;
    lctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
    lctx.strokeText('12A1', 512, 256);

    // Strong red fill + glow
    lctx.shadowColor = 'rgba(255, 20, 70, 1)';
    lctx.shadowBlur = 40;
    lctx.fillStyle = '#ff1744';
    lctx.fillText('12A1', 512, 256);
    lctx.shadowBlur = 0;

    // Inner highlight stroke
    lctx.lineWidth = 6;
    lctx.strokeStyle = 'rgba(255, 200, 210, 0.9)';
    lctx.strokeText('12A1', 512, 256);

    const labelTex = new THREE.CanvasTexture(labelCanvas);
    labelTex.colorSpace = THREE.SRGBColorSpace;
    const labelMat = new THREE.MeshBasicMaterial({
      map: labelTex,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      depthTest: true,
      // Normal blending = solid readable text (not washed out additive)
      blending: THREE.NormalBlending,
      opacity: 1,
    });
    // Larger plane so "12A1" fills the core clearly
    this.coreLabel = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 1.6), labelMat);
    this.coreLabel.position.set(0, 0.15, 0);
    this.coreLabel.renderOrder = 10;
    this.orbGroup.add(this.coreLabel);

    // Saturn-like concentric orbital rings
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0xffc0cb,
      emissive: 0xff1493,
      emissiveIntensity: 0.8,
      roughness: 0.3,
      metalness: 0.8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    this.ring1 = new THREE.Mesh(new THREE.RingGeometry(2.3, 2.55, 64), ringMat1);
    this.ring1.rotation.x = Math.PI * 0.4;
    this.ring1.rotation.y = Math.PI * 0.15;
    this.orbGroup.add(this.ring1);

    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0xfce7f3,
      emissive: 0xec4899,
      emissiveIntensity: 0.6,
      roughness: 0.4,
      metalness: 0.5,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6,
    });
    this.ring2 = new THREE.Mesh(new THREE.RingGeometry(3.0, 3.15, 64), ringMat2);
    this.ring2.rotation.x = Math.PI * -0.3;
    this.ring2.rotation.z = Math.PI * 0.2;
    this.orbGroup.add(this.ring2);

    const ringMat3 = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
    });
    this.ring3 = new THREE.Mesh(new THREE.RingGeometry(3.6, 3.7, 64), ringMat3);
    this.ring3.rotation.y = Math.PI * 0.45;
    this.orbGroup.add(this.ring3);

    this.scene.add(this.orbGroup);
  }

  /**
   * Scene 2: Instanced Procedural Floating Petals
   */
  private buildPetalSwarm() {
    // Curved petal shape
    const petalShape = new THREE.Shape();
    petalShape.moveTo(0, 0);
    petalShape.bezierCurveTo(0.2, 0.3, 0.3, 0.8, 0, 1.2);
    petalShape.bezierCurveTo(-0.3, 0.8, -0.2, 0.3, 0, 0);

    const extrudeSettings = {
      depth: 0.02,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.015,
      bevelThickness: 0.01,
    };
    const petalGeo = new THREE.ExtrudeGeometry(petalShape, extrudeSettings);
    petalGeo.center();

    const petalMat = new THREE.MeshPhysicalMaterial({
      color: 0xfda4af,
      roughness: 0.45,
      metalness: 0.05,
      clearcoat: 0.3,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.92,
    });

    this.petalMesh = new THREE.InstancedMesh(petalGeo, petalMat, this.petalCount);
    this.petalMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.petalMesh.castShadow = true;

    for (let i = 0; i < this.petalCount; i++) {
      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * 32,
        (Math.random() - 0.5) * 24,
        (Math.random() - 0.5) * 26
      );
      const rot = new THREE.Euler(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );
      const rotSpeed = new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02
      );
      const speed = new THREE.Vector3(
        (Math.random() - 0.5) * 0.01,
        -0.012 - Math.random() * 0.018,
        (Math.random() - 0.5) * 0.01
      );
      const scale = 0.35 + Math.random() * 0.45;
      const phase = Math.random() * Math.PI * 2;

      this.petalData.push({ pos, rot, rotSpeed, speed, scale, phase });

      _matrix.makeRotationFromEuler(rot);
      _matrix.setPosition(pos);
      _matrix.scale(new THREE.Vector3(scale, scale, scale));
      this.petalMesh.setMatrixAt(i, _matrix);

      // Varied pink tint
      const tint = i % 3 === 0 ? 0xffb6c1 : i % 3 === 1 ? 0xffc0cb : 0xf472b6;
      _color.setHex(tint);
      this.petalMesh.setColorAt(i, _color);
    }

    if (this.petalMesh.instanceColor) {
      this.petalMesh.instanceColor.needsUpdate = true;
    }
    this.petalMesh.instanceMatrix.needsUpdate = true;
    this.scene.add(this.petalMesh);
  }

  /**
   * Ambient Twinkling Stardust
   */
  private buildStardust() {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(this.stardustCount * 3);
    const colors = new Float32Array(this.stardustCount * 3);

    for (let i = 0; i < this.stardustCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 45;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;

      // Pink & champagne gold particles
      if (Math.random() > 0.4) {
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.75 + Math.random() * 0.2;
        colors[i * 3 + 2] = 0.85;
      } else {
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.95;
        colors[i * 3 + 2] = 0.7;
      }
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Circular glowing particle texture
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(244, 114, 182, 0.8)');
    gradient.addColorStop(1, 'rgba(236, 72, 153, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(16, 16, 16, 0, Math.PI * 2);
    ctx.fill();

    const starTexture = new THREE.CanvasTexture(canvas);
    starTexture.colorSpace = THREE.SRGBColorSpace;

    const mat = new THREE.PointsMaterial({
      size: 0.4,
      map: starTexture,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.stardustPoints = new THREE.Points(geo, mat);
    this.scene.add(this.stardustPoints);
  }

  /**
   * Scene 3: 3D Memory Constellation Cylinder of Photos
   */
  public buildGalleryConstellation(memories: MemoryPhoto[]) {
    if (this.galleryGroup) {
      this.scene.remove(this.galleryGroup);
      this.cardMeshes.forEach((item) => {
        item.group.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            obj.geometry.dispose();
            if (Array.isArray(obj.material)) {
              obj.material.forEach((m) => m.dispose());
            } else {
              obj.material.dispose();
            }
          }
        });
      });
      this.cardMeshes = [];
    }

    this.galleryGroup = new THREE.Group();
    this.galleryGroup.position.set(0, 0, 0);

    const textureLoader = new THREE.TextureLoader();
    const count = Math.max(memories.length, 1);

    // --- Spherical net around the central orb ---
    // Radius grows gently with photo count so frames never overlap
    const baseRadius = 9.5;
    const radius = baseRadius + Math.min(4.5, Math.max(0, (count - 12) * 0.18));

    // Card size shrinks slightly when many photos so the sphere stays airy
    const cardScale =
      count <= 12 ? 1.0 :
      count <= 20 ? 0.88 :
      count <= 30 ? 0.78 :
      count <= 45 ? 0.68 : 0.58;

    const frameW = 2.55 * cardScale;
    const frameH = 1.95 * cardScale;
    const picW = 2.35 * cardScale;
    const picH = 1.75 * cardScale;

    // Fibonacci sphere for even distribution over the full sphere surface
    const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // ~2.399

    memories.forEach((photo, idx) => {
      const cardGroup = new THREE.Group();

      // Evenly spaced points on a sphere
      const t = (idx + 0.5) / count;
      const y = 1 - 2 * t;                    // -1 → +1
      const rAtY = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = goldenAngle * idx;

      const x = Math.cos(theta) * rAtY * radius;
      const z = Math.sin(theta) * rAtY * radius;
      const posY = y * radius * 0.92; // slightly flatten vertically for nicer framing

      const basePos = new THREE.Vector3(x, posY, z);

      // Face the card toward the center (orb), so every photo looks inward
      const lookAtCenter = new THREE.Vector3(0, 0, 0);
      cardGroup.position.copy(basePos);
      cardGroup.lookAt(lookAtCenter);
      // Flip 180° so the photo face points outward toward the camera/user
      cardGroup.rotateY(Math.PI);

      const baseRot = cardGroup.rotation.clone();

      // 1. Backing frame (thin box)
      const frameGeo = new THREE.BoxGeometry(frameW, frameH, 0.08);
      const frameMat = new THREE.MeshPhysicalMaterial({
        color: 0x3d0c26,
        metalness: 0.85,
        roughness: 0.25,
        clearcoat: 1.0,
      });
      const frameMesh = new THREE.Mesh(frameGeo, frameMat);
      cardGroup.add(frameMesh);

      // 2. FRONT face — photo
      const picGeo = new THREE.PlaneGeometry(picW, picH);
      const defaultTexture = this.createFallbackCanvasTexture(photo.title);
      const picMat = new THREE.MeshBasicMaterial({
        map: defaultTexture,
        side: THREE.FrontSide,
      });

      textureLoader.load(
        photo.imageUrl,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
          const img = tex.image as HTMLImageElement;
          if (img && img.width && img.height) {
            const imgAspect = img.width / img.height;
            const frameAspect = picW / picH;
            if (imgAspect > frameAspect) {
              const scale = frameAspect / imgAspect;
              tex.repeat.set(scale, 1);
              tex.offset.set((1 - scale) / 2, 0);
            } else {
              const scale = imgAspect / frameAspect;
              tex.repeat.set(1, scale);
              tex.offset.set(0, (1 - scale) / 2);
            }
          }
          picMat.map = tex;
          picMat.needsUpdate = true;
        },
        undefined,
        () => { /* keep fallback */ }
      );

      const picMesh = new THREE.Mesh(picGeo, picMat);
      picMesh.position.z = 0.05;
      cardGroup.add(picMesh);

      // 3. BACK face — elegant reverse with name + 12A1 so frames look good from all angles
      const backTex = this.createCardBackTexture(photo.title);
      const backMat = new THREE.MeshBasicMaterial({
        map: backTex,
        side: THREE.FrontSide,
      });
      const backMesh = new THREE.Mesh(picGeo.clone(), backMat);
      backMesh.position.z = -0.05;
      backMesh.rotation.y = Math.PI; // face outward on the back
      cardGroup.add(backMesh);

      // 4. Glowing edge
      const edgeGeo = new THREE.EdgesGeometry(frameGeo);
      const edgeMat = new THREE.LineBasicMaterial({
        color: 0xf472b6,
        transparent: true,
        opacity: 0.75,
      });
      const edgeLine = new THREE.LineSegments(edgeGeo, edgeMat);
      cardGroup.add(edgeLine);

      frameMesh.userData = { photoId: photo.id, photo };
      picMesh.userData = { photoId: photo.id, photo };
      backMesh.userData = { photoId: photo.id, photo };

      this.galleryGroup.add(cardGroup);
      this.cardMeshes.push({
        group: cardGroup,
        photo,
        basePos,
        baseRot,
        mesh: frameMesh,
      });
    });

    this.scene.add(this.galleryGroup);
  }

  private createFallbackCanvasTexture(title: string): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 384;
    const ctx = canvas.getContext('2d')!;

    const grad = ctx.createLinearGradient(0, 0, 512, 384);
    grad.addColorStop(0, '#f43f5e');
    grad.addColorStop(1, '#831843');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 384);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('12A1 Kỷ Niệm', 256, 180);

    ctx.font = '20px sans-serif';
    ctx.fillStyle = '#fce7f3';
    ctx.fillText(title.substring(0, 24), 256, 220);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  /** Elegant reverse side of each memory card */
  private createCardBackTexture(title: string): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 384;
    const ctx = canvas.getContext('2d')!;

    const grad = ctx.createLinearGradient(0, 0, 512, 384);
    grad.addColorStop(0, '#4a0e2a');
    grad.addColorStop(0.5, '#831843');
    grad.addColorStop(1, '#3b0764');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 384);

    // soft vignette
    const vig = ctx.createRadialGradient(256, 192, 40, 256, 192, 280);
    vig.addColorStop(0, 'rgba(255,100,150,0.25)');
    vig.addColorStop(1, 'rgba(0,0,0,0.35)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, 512, 384);

    // decorative border
    ctx.strokeStyle = 'rgba(252, 231, 243, 0.55)';
    ctx.lineWidth = 6;
    ctx.strokeRect(18, 18, 476, 348);

    ctx.fillStyle = '#fda4af';
    ctx.font = 'bold 36px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(title.substring(0, 22), 256, 160);

    ctx.fillStyle = '#ff1a4d';
    ctx.font = 'bold 52px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.shadowColor = 'rgba(255, 30, 80, 0.8)';
    ctx.shadowBlur = 16;
    ctx.fillText('12A1', 256, 230);
    ctx.shadowBlur = 0;

    ctx.fillStyle = 'rgba(252, 231, 243, 0.7)';
    ctx.font = '18px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText('20/10 · Yêu thương', 256, 290);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  /**
   * Scene 5: 3D Procedural Envelope with interactive opening flap & letter
   */
  private build3DEnvelope() {
    this.envelopeGroup = new THREE.Group();
    this.envelopeGroup.position.set(0, 0, -20); // Positioned for Scene 5
    this.envelopeGroup.scale.set(1.4, 1.4, 1.4);

    // Envelope Pocket Body (white-pink pearlescent cardstock)
    const bodyGeo = new THREE.BoxGeometry(4.2, 2.9, 0.1);
    const paperMat = new THREE.MeshPhysicalMaterial({
      color: 0xfff0f5,
      roughness: 0.5,
      metalness: 0.05,
      clearcoat: 0.2,
      side: THREE.DoubleSide,
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, paperMat);
    bodyMesh.castShadow = true;
    this.envelopeGroup.add(bodyMesh);

    // Envelope Flap (triangular shape at top that pivots)
    const flapShape = new THREE.Shape();
    flapShape.moveTo(-2.1, 0);
    flapShape.lineTo(2.1, 0);
    flapShape.lineTo(0, -1.5);
    flapShape.closePath();

    const flapGeo = new THREE.ShapeGeometry(flapShape);
    this.envelopeFlap = new THREE.Mesh(flapGeo, paperMat);
    this.envelopeFlap.position.set(0, 1.45, 0.052);
    this.envelopeGroup.add(this.envelopeFlap);

    // Heart Wax Seal (Ruby red glossy stamp)
    const sealGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.06, 32);
    const sealMat = new THREE.MeshPhysicalMaterial({
      color: 0xbe123c,
      emissive: 0x9f1239,
      emissiveIntensity: 0.35,
      roughness: 0.15,
      metalness: 0.2,
      clearcoat: 1.0,
    });
    const seal = new THREE.Mesh(sealGeo, sealMat);
    seal.rotation.x = Math.PI / 2;
    seal.position.set(0, 0, 0.09);
    this.envelopeFlap.add(seal);

    // Letter inside (slides up when opened)
    const letterGeo = new THREE.PlaneGeometry(3.8, 2.7);
    const letterCanvas = document.createElement('canvas');
    letterCanvas.width = 512;
    letterCanvas.height = 400;
    const lCtx = letterCanvas.getContext('2d')!;
    lCtx.fillStyle = '#fffdfa';
    lCtx.fillRect(0, 0, 512, 400);

    // Notebook lines
    lCtx.strokeStyle = 'rgba(244, 114, 182, 0.25)';
    lCtx.lineWidth = 2;
    for (let y = 60; y < 400; y += 32) {
      lCtx.beginPath();
      lCtx.moveTo(20, y);
      lCtx.lineTo(492, y);
      lCtx.stroke();
    }

    lCtx.fillStyle = '#be185d';
    lCtx.font = 'bold 24px serif';
    lCtx.textAlign = 'center';
    lCtx.fillText('Gửi những cô gái tuyệt vời của 12A1', 256, 45);

    const letterTex = new THREE.CanvasTexture(letterCanvas);
    letterTex.colorSpace = THREE.SRGBColorSpace;
    const letterMat = new THREE.MeshBasicMaterial({
      map: letterTex,
      side: THREE.DoubleSide,
    });
    this.letterMesh = new THREE.Mesh(letterGeo, letterMat);
    this.letterMesh.position.set(0, 0, 0.04);
    this.envelopeGroup.add(this.letterMesh);

    this.scene.add(this.envelopeGroup);
  }

  public openEnvelope() {
    this.isEnvelopeOpen = true;
    soundEngine.playEnvelopeSound();
    this.callbacks.onEnvelopeOpened?.();
  }

  public closeEnvelope() {
    this.isEnvelopeOpen = false;
  }

  /**
   * Scene 6: Heart Constellation Particle System
   */
  private buildHeartConstellation() {
    for (let i = 0; i < this.heartCount; i++) {
      // Initial disperse positions
      this.heartPositions[i * 3] = (Math.random() - 0.5) * 35;
      this.heartPositions[i * 3 + 1] = (Math.random() - 0.5) * 25;
      this.heartPositions[i * 3 + 2] = -40 + (Math.random() - 0.5) * 20;

      // Current positions
      this.heartCurrentPositions[i * 3] = this.heartPositions[i * 3];
      this.heartCurrentPositions[i * 3 + 1] = this.heartPositions[i * 3 + 1];
      this.heartCurrentPositions[i * 3 + 2] = this.heartPositions[i * 3 + 2];

      // Parametric Heart Formula
      // x = 16 * sin^3(t)
      // y = 13*cos(t) - 5*cos(2t) - 2*cos(3t) - cos(4t)
      const t = (i / this.heartCount) * Math.PI * 2;
      const scale = 0.32;
      const x = 16 * Math.pow(Math.sin(t), 3) * scale + (Math.random() - 0.5) * 0.4;
      const y = (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * scale + (Math.random() - 0.5) * 0.4;
      const z = -40 + (Math.random() - 0.5) * 1.5;

      this.heartTargetPositions[i * 3] = x;
      this.heartTargetPositions[i * 3 + 1] = y + 0.5;
      this.heartTargetPositions[i * 3 + 2] = z;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(this.heartCurrentPositions, 3));

    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255, 230, 240, 1)');
    gradient.addColorStop(0.4, 'rgba(244, 114, 182, 0.9)');
    gradient.addColorStop(1, 'rgba(219, 39, 119, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(16, 16, 16, 0, Math.PI * 2);
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;

    const mat = new THREE.PointsMaterial({
      size: 0.35,
      map: tex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.heartParticles = new THREE.Points(geo, mat);
    this.scene.add(this.heartParticles);
  }

  /**
   * Scene 4 & Global: Flower Burst Emitter + Grand Orb Bloom
   */
  private buildBurstEmitter() {
    this.burstGroup = new THREE.Group();
    this.scene.add(this.burstGroup);

    // Shared geometries (reused for performance)
    this.sharedPetalGeo = new THREE.PlaneGeometry(0.4, 0.4);

    // Simple elegant heart shape
    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 0.35);
    heartShape.bezierCurveTo(0, 0.35, -0.1, 0.1, -0.35, 0.1);
    heartShape.bezierCurveTo(-0.7, 0.1, -0.7, 0.45, -0.7, 0.45);
    heartShape.bezierCurveTo(-0.7, 0.7, -0.4, 0.95, 0, 1.25);
    heartShape.bezierCurveTo(0.4, 0.95, 0.7, 0.7, 0.7, 0.45);
    heartShape.bezierCurveTo(0.7, 0.45, 0.7, 0.1, 0.35, 0.1);
    heartShape.bezierCurveTo(0.1, 0.1, 0, 0.35, 0, 0.35);
    this.sharedHeartGeo = new THREE.ShapeGeometry(heartShape);
    this.sharedHeartGeo.center();
    this.sharedHeartGeo.scale(0.55, 0.55, 0.55);

    this.sharedSparkGeo = new THREE.SphereGeometry(0.08, 8, 8);
  }

  /** Small everyday burst at pointer */
  public triggerFlowerBurst(screenX: number, screenY: number) {
    soundEngine.playBurstSound();

    _pointer.x = (screenX / window.innerWidth) * 2 - 1;
    _pointer.y = -(screenY / window.innerHeight) * 2 + 1;
    _raycaster.setFromCamera(_pointer, this.camera);

    const burstOrigin = new THREE.Vector3();
    _raycaster.ray.at(this.camera.position.z > 0 ? 8 : -8, burstOrigin);

    this.spawnBurstParticles(burstOrigin, 48, 0.14, false);
  }

  /**
   * GRAND BLOOM — click the celestial orb in Scene 4
   * Thousands of petals + hearts explode outward and fill the screen
   */
  public triggerGrandBloomFromOrb() {
    if (this.grandBloomCooldown > 0 || this.isGrandBlooming) return;
    this.grandBloomCooldown = 2.8; // seconds
    this.isGrandBlooming = true;

    soundEngine.playBurstSound();
    // Extra emotional hit
    setTimeout(() => soundEngine.playBurstSound(), 120);
    setTimeout(() => soundEngine.playBurstSound(), 280);

    const origin = this.orbGroup ? this.orbGroup.position.clone() : new THREE.Vector3(0, 0, 0);

    // Dramatic pulse on the orb itself
    if (this.coreSphere) {
      this.coreSphere.scale.set(2.4, 2.4, 2.4);
    }
    if (this.innerGlow) {
      this.innerGlow.scale.set(3.2, 3.2, 3.2);
      (this.innerGlow.material as THREE.MeshBasicMaterial).opacity = 1.0;
    }

    // Massive multi-layer explosion
    // Layer 1: dense pink petals
    this.spawnBurstParticles(origin, 280, 0.22, true, 'petal');
    // Layer 2: floating hearts
    this.spawnBurstParticles(origin, 120, 0.18, true, 'heart');
    // Layer 3: golden / white sparkles
    this.spawnBurstParticles(origin, 160, 0.28, true, 'spark');
    // Layer 4: slow large decorative petals for screen coverage
    this.spawnBurstParticles(origin, 80, 0.09, true, 'petal', 1.4);

    // Soft expanding shockwave ring
    this.spawnShockwaveRing(origin);

    // Reset bloom flag after particles have lived
    setTimeout(() => {
      this.isGrandBlooming = false;
    }, 3200);
  }

  private spawnBurstParticles(
    origin: THREE.Vector3,
    count: number,
    baseSpeed: number,
    isGrand: boolean,
    forceKind?: 'petal' | 'heart' | 'spark',
    sizeMul = 1
  ) {
    const petalColors = [0xff69b4, 0xff1493, 0xff85c0, 0xfce7f3, 0xfbcfe8, 0xf472b6];
    const heartColors = [0xff2d6a, 0xff4d8d, 0xff6b9d, 0xf43f5e, 0xfb7185];
    const sparkColors = [0xfef08a, 0xfde047, 0xffffff, 0xfce7f3, 0xffc0cb];

    for (let i = 0; i < count; i++) {
      const kind = forceKind || (Math.random() < 0.55 ? 'petal' : Math.random() < 0.7 ? 'heart' : 'spark');

      let geo: THREE.BufferGeometry;
      let color: number;
      let baseScale: number;

      if (kind === 'heart') {
        geo = this.sharedHeartGeo;
        color = heartColors[i % heartColors.length];
        baseScale = (0.35 + Math.random() * 0.55) * sizeMul;
      } else if (kind === 'spark') {
        geo = this.sharedSparkGeo;
        color = sparkColors[i % sparkColors.length];
        baseScale = (0.4 + Math.random() * 0.9) * sizeMul;
      } else {
        geo = this.sharedPetalGeo;
        color = petalColors[i % petalColors.length];
        baseScale = (0.5 + Math.random() * 0.9) * sizeMul;
      }

      const mat = new THREE.MeshBasicMaterial({
        color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: kind === 'spark' ? 0.95 : 1.0,
        blending: kind === 'spark' ? THREE.AdditiveBlending : THREE.NormalBlending,
        depthWrite: false,
      });

      const mesh = new THREE.Mesh(geo, mat);
      // Slight random offset so they don't all start at exact center
      mesh.position.set(
        origin.x + (Math.random() - 0.5) * 0.6,
        origin.y + (Math.random() - 0.5) * 0.6,
        origin.z + (Math.random() - 0.5) * 0.6
      );
      mesh.scale.setScalar(baseScale);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

      // Spherical + upward bias for beautiful fountain feel
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.random() * Math.PI;
      const speed = baseSpeed * (0.7 + Math.random() * 1.1) * (isGrand ? 1.35 : 1);

      const velocity = new THREE.Vector3(
        Math.sin(theta) * Math.cos(phi) * speed,
        Math.sin(theta) * Math.sin(phi) * speed * 0.85 + (isGrand ? 0.06 + Math.random() * 0.08 : 0.035),
        Math.cos(theta) * speed
      );

      // Extra outward push on grand bloom for screen coverage
      if (isGrand) {
        velocity.multiplyScalar(1.15 + Math.random() * 0.4);
      }

      const rotSpeed = new THREE.Vector3(
        (Math.random() - 0.5) * (isGrand ? 0.28 : 0.18),
        (Math.random() - 0.5) * (isGrand ? 0.28 : 0.18),
        (Math.random() - 0.5) * 0.15
      );

      const maxLife = isGrand
        ? (kind === 'spark' ? 70 : 90) + Math.random() * 50
        : 55 + Math.random() * 35;

      this.burstGroup.add(mesh);
      this.burstParticles.push({
        mesh,
        velocity,
        rotSpeed,
        life: 0,
        maxLife,
        scale: baseScale,
        kind,
      });
    }
  }

  private spawnShockwaveRing(origin: THREE.Vector3) {
    const ringGeo = new THREE.RingGeometry(0.3, 0.55, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xff69b4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.copy(origin);
    ring.lookAt(this.camera.position);
    this.burstGroup.add(ring);

    // Animate the ring expanding + fading via the main burst loop by treating it as a special particle
    this.burstParticles.push({
      mesh: ring,
      velocity: new THREE.Vector3(0, 0, 0),
      rotSpeed: new THREE.Vector3(0, 0, 0.02),
      life: 0,
      maxLife: 55,
      scale: 1,
      kind: 'spark',
    });

    // Manual expansion handled in animate by checking geometry type
    (ring as any).__isShockwave = true;
  }

  /**
   * Scene Navigation & Camera Orchestration
   */
  public setScene(sceneIndex: number) {
    this.currentScene = Math.max(1, Math.min(6, sceneIndex));

    switch (this.currentScene) {
      case 1:
        // Mysterious Opening: Centered on celestial pearl orb
        this.targetCameraPos.set(0, 0, 11);
        this.targetCameraLookAt.set(0, 0, 0);
        break;
      case 2:
        // Blooming Garden: Sweeping angle through flower field
        this.targetCameraPos.set(1.5, 1.2, 8.5);
        this.targetCameraLookAt.set(0, 0, 0);
        break;
      case 3:
        // Memory Constellation: pull back to see the full spherical photo net
        this.targetCameraPos.set(0, 1.2, 16.5);
        this.targetCameraLookAt.set(0, 0, 0);
        break;
      case 4:
        // Flower Explosion Interactive: Intimate close angle
        this.targetCameraPos.set(0, 0, 7.5);
        this.targetCameraLookAt.set(0, 0, 0);
        break;
      case 5:
        // Envelope & Letter: Focused on 3D envelope at z = -20
        this.targetCameraPos.set(0, 0, -14);
        this.targetCameraLookAt.set(0, 0, -20);
        break;
      case 6:
        // Grand Finale: Cinematic wide pull-back into heart constellation
        this.targetCameraPos.set(0, 0.5, -28);
        this.targetCameraLookAt.set(0, 0.5, -40);
        break;
    }

    this.isTransitioningScene = true;

    if (this.callbacks.onSceneChange) {
      this.callbacks.onSceneChange(this.currentScene);
    }
  }

  private setupEvents() {
    window.addEventListener('resize', this.onResize);
    window.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerdown', this.onPointerDown);
    window.addEventListener('pointerup', this.onPointerUp);
  }

  public updateCameraFov = () => {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    const aspect = width / height;
    this.camera.aspect = aspect;

    // Dynamically adjust FOV based on screen aspect ratio
    // On portrait mobile (aspect < 1.0), expand vertical FOV so central 3D gallery & heart content are never cropped horizontally
    const baseFov = 50;
    if (aspect < 1.0) {
      // Calculate target vertical FOV to maintain horizontal scene width
      const baseHalfFovRad = (baseFov * Math.PI) / 360;
      const targetFovRad = 2 * Math.atan(Math.tan(baseHalfFovRad) / Math.max(aspect, 0.45));
      const targetFov = (targetFovRad * 180) / Math.PI;
      this.camera.fov = Math.min(82, Math.max(baseFov, targetFov));
    } else {
      this.camera.fov = baseFov;
    }

    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  private onResize = () => {
    this.updateCameraFov();
  };

  private onPointerMove = (e: PointerEvent) => {
    this.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;

    // Raycast check for memory cards in Scene 3
    if (this.currentScene === 3) {
      _pointer.x = this.mouse.targetX;
      _pointer.y = this.mouse.targetY;
      _raycaster.setFromCamera(_pointer, this.camera);

      const targets = this.cardMeshes.map((c) => c.mesh);
      const intersects = _raycaster.intersectObjects(targets);

      if (intersects.length > 0) {
        document.body.style.cursor = 'pointer';
        const hitGroup = intersects[0].object.parent as THREE.Group;
        this.hoveredCard = hitGroup;
      } else {
        document.body.style.cursor = 'default';
        this.hoveredCard = null;
      }
    }
  };

  private onPointerDown = (e: PointerEvent) => {
    this.pointerDownPos = { x: e.clientX, y: e.clientY };
    this.pointerDownTime = performance.now();
  };

  private onPointerUp = (e: PointerEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('input') ||
      target.closest('.interactive-modal')
    ) {
      return;
    }

    const dist = Math.hypot(e.clientX - this.pointerDownPos.x, e.clientY - this.pointerDownPos.y);
    const duration = performance.now() - this.pointerDownTime;

    // Distinguish quick tap vs 3D drag
    if (dist < 12 && duration < 450) {
      if (this.currentScene === 1) {
        if (this.callbacks.onFirstInteraction) {
          this.callbacks.onFirstInteraction();
        }
      }

      _pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      _pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
      _raycaster.setFromCamera(_pointer, this.camera);

      // 1. Priority: click the Celestial Orb → Grand Bloom (especially Scene 4)
      if (this.orbGroup && (this.currentScene === 4 || this.currentScene === 2 || this.currentScene === 1)) {
        const orbHits = _raycaster.intersectObjects(this.orbGroup.children, true);
        if (orbHits.length > 0) {
          this.triggerGrandBloomFromOrb();
          return;
        }
      }

      // 2. Memory cards (Scene 3)
      const targets = this.cardMeshes.map((c) => c.mesh);
      const intersects = _raycaster.intersectObjects(targets);
      if (intersects.length > 0) {
        const photo = (intersects[0].object.userData as { photo: MemoryPhoto }).photo;
        if (photo && this.callbacks.onPhotoSelected) {
          this.callbacks.onPhotoSelected(photo);
        }
        return;
      }

      // 3. Envelope (Scene 5)
      if (this.currentScene === 5 && this.envelopeGroup) {
        const envelopeHits = _raycaster.intersectObjects(this.envelopeGroup.children, true);
        if (envelopeHits.length > 0) {
          if (!this.isEnvelopeOpen) {
            this.openEnvelope();
          }
          return;
        }
      }

      // 4. Default small flower burst anywhere else
      this.triggerFlowerBurst(e.clientX, e.clientY);
    }
  };

  /**
   * Main Render Loop with Exponential Damping & Beat Sync
   */
  private animate = () => {
    this.animationFrameId = requestAnimationFrame(this.animate);

    const delta = Math.min(this.clock.getDelta(), 0.1);
    const elapsed = this.clock.getElapsedTime();

    // 1. Audio reactive metrics
    const audio = soundEngine.getAudioMetrics();
    const beatPulse = 1.0 + audio.bass * 0.18;

    // 2. Parallax mouse interpolation
    this.mouse.x = THREE.MathUtils.damp(this.mouse.x, this.mouse.targetX, 4, delta);
    this.mouse.y = THREE.MathUtils.damp(this.mouse.y, this.mouse.targetY, 4, delta);

    // 3. Camera & OrbitControls update with smooth transition damping
    if (this.isTransitioningScene && this.controls) {
      this.camera.position.lerp(this.targetCameraPos, 0.05);
      this.controls.target.lerp(this.targetCameraLookAt, 0.05);
      if (this.camera.position.distanceTo(this.targetCameraPos) < 0.25) {
        this.isTransitioningScene = false;
      }
    }
    if (this.controls) {
      this.controls.update();
    }

    // 4. Animate Celestial Orb, soft core, beating heart & 12A1 label
    if (this.orbGroup) {
      if (!this.isGrandBlooming) {
        const orbScale = 1 + (beatPulse - 1) * 0.35; // gentler shell pulse
        this.coreSphere.scale.set(orbScale, orbScale, orbScale);
        this.innerGlow.scale.set(orbScale * 1.05, orbScale * 1.05, orbScale * 1.05);
      }

      // Only rings spin — shell / heart / 12A1 stay stable so text is readable
      this.ring1.rotation.z += 0.008 * (1.0 + audio.energy);
      this.ring2.rotation.y += 0.006 * (1.0 + audio.energy);
      this.ring3.rotation.x += 0.004;

      // Soft inner glow breathe (keep low so it doesn't hide text)
      if (this.innerGlow) {
        const glowMat = this.innerGlow.material as THREE.MeshBasicMaterial;
        glowMat.opacity = 0.22 + Math.sin(elapsed * 1.6) * 0.08 + audio.bass * 0.1;
      }

      // Heartbeat under the text
      if (this.coreHeart) {
        const t = elapsed * 2.4;
        const beat =
          0.85 +
          Math.max(0, Math.sin(t)) * 0.16 +
          Math.max(0, Math.sin(t * 2.1 - 0.6)) * 0.1 +
          audio.bass * 0.1;
        this.coreHeart.scale.setScalar(beat);
        this.coreHeart.rotation.z = Math.sin(elapsed * 0.6) * 0.06;
        const hm = this.coreHeart.material as THREE.MeshBasicMaterial;
        hm.opacity = 0.7 + Math.sin(t) * 0.2;
      }

      // "12A1" always faces camera, stays locked in the core center
      if (this.coreLabel) {
        this.coreLabel.position.set(0, 0.12, 0);
        this.coreLabel.lookAt(this.camera.position);
        // subtle scale pulse only — never flies away
        const labelPulse = 1 + Math.sin(elapsed * 1.2) * 0.03;
        this.coreLabel.scale.setScalar(labelPulse);
        this.coreLabel.visible = this.currentScene <= 4; // hide when camera flies to letter/finale
      }
      if (this.coreHeart) {
        this.coreHeart.visible = this.currentScene <= 4;
      }
    }

    // 5. Animate Petal Swarm (fluttering, wind turbulence)
    if (this.petalMesh) {
      for (let i = 0; i < this.petalCount; i++) {
        const item = this.petalData[i];
        item.pos.y += item.speed.y * (1.0 + audio.bass * 0.4);
        item.pos.x += Math.sin(elapsed * 1.2 + item.phase) * 0.015;
        item.pos.z += Math.cos(elapsed * 0.9 + item.phase) * 0.012;

        item.rot.x += item.rotSpeed.x;
        item.rot.y += item.rotSpeed.y;
        item.rot.z += item.rotSpeed.z;

        // Reset if falling below boundary
        if (item.pos.y < -16) {
          item.pos.y = 16;
          item.pos.x = (Math.random() - 0.5) * 32;
        }

        _matrix.makeRotationFromEuler(item.rot);
        _matrix.setPosition(item.pos);
        _matrix.scale(new THREE.Vector3(item.scale, item.scale, item.scale));
        this.petalMesh.setMatrixAt(i, _matrix);
      }
      this.petalMesh.instanceMatrix.needsUpdate = true;
    }

    // 6. Animate Memory Constellation — slow continuous 360° around the core
    if (this.galleryGroup) {
      // Always rotate gently so both faces of frames are visible over time
      if (!this.hoveredCard) {
        this.galleryGroup.rotation.y += 0.0022; // ~80s per full turn
        this.galleryGroup.rotation.x = Math.sin(elapsed * 0.12) * 0.04; // soft tilt
      }

      this.cardMeshes.forEach((card) => {
        const isHovered = this.hoveredCard === card.group;
        const targetScale = isHovered ? 1.18 : 1.0;
        card.group.scale.x = THREE.MathUtils.damp(card.group.scale.x, targetScale, 6, delta);
        card.group.scale.y = THREE.MathUtils.damp(card.group.scale.y, targetScale, 6, delta);
        card.group.scale.z = THREE.MathUtils.damp(card.group.scale.z, targetScale, 6, delta);
      });
    }

    // 7. Animate 3D Envelope & Letter (Scene 5)
    if (this.envelopeGroup) {
      const targetFlapRot = this.isEnvelopeOpen ? -Math.PI * 0.85 : 0;
      this.envelopeFlap.rotation.x = THREE.MathUtils.damp(this.envelopeFlap.rotation.x, targetFlapRot, 5, delta);

      const targetLetterY = this.isEnvelopeOpen ? 1.6 : 0;
      this.letterMesh.position.y = THREE.MathUtils.damp(this.letterMesh.position.y, targetLetterY, 4, delta);
    }

    // 8. Animate Heart Constellation (Scene 6)
    if (this.heartParticles) {
      const posAttr = this.heartParticles.geometry.attributes.position as THREE.BufferAttribute;
      const isScene6 = this.currentScene === 6;

      for (let i = 0; i < this.heartCount; i++) {
        const i3 = i * 3;
        const targetX = isScene6 ? this.heartTargetPositions[i3] : this.heartPositions[i3];
        const targetY = isScene6 ? this.heartTargetPositions[i3 + 1] : this.heartPositions[i3 + 1];
        const targetZ = isScene6 ? this.heartTargetPositions[i3 + 2] : this.heartPositions[i3 + 2];

        // Smooth convergence into heart shape
        this.heartCurrentPositions[i3] = THREE.MathUtils.damp(this.heartCurrentPositions[i3], targetX, isScene6 ? 2.5 : 1.5, delta);
        this.heartCurrentPositions[i3 + 1] = THREE.MathUtils.damp(this.heartCurrentPositions[i3 + 1], targetY, isScene6 ? 2.5 : 1.5, delta);
        this.heartCurrentPositions[i3 + 2] = THREE.MathUtils.damp(this.heartCurrentPositions[i3 + 2], targetZ, isScene6 ? 2.5 : 1.5, delta);
      }
      posAttr.needsUpdate = true;

      if (isScene6) {
        this.heartParticles.rotation.z = Math.sin(elapsed * 0.8) * 0.05;
      }
    }

    // 9. Animate Flower Burst Particles + Grand Bloom + Shockwave
    if (this.grandBloomCooldown > 0) {
      this.grandBloomCooldown -= delta;
    }

    // Soft return of orb after grand bloom pulse
    if (this.coreSphere && this.isGrandBlooming) {
      const target = 1.0;
      this.coreSphere.scale.x = THREE.MathUtils.damp(this.coreSphere.scale.x, target, 2.2, delta);
      this.coreSphere.scale.y = this.coreSphere.scale.x;
      this.coreSphere.scale.z = this.coreSphere.scale.x;
      if (this.innerGlow) {
        this.innerGlow.scale.x = THREE.MathUtils.damp(this.innerGlow.scale.x, 1.05, 2.0, delta);
        this.innerGlow.scale.y = this.innerGlow.scale.x;
        this.innerGlow.scale.z = this.innerGlow.scale.x;
      }
    }

    for (let i = this.burstParticles.length - 1; i >= 0; i--) {
      const p = this.burstParticles[i];
      p.life += delta * 60;

      const isShockwave = !!(p.mesh as any).__isShockwave;

      if (isShockwave) {
        // Expanding luminous ring
        const progress = p.life / p.maxLife;
        const grow = 1 + progress * 18;
        p.mesh.scale.set(grow, grow, grow);
        p.mesh.rotation.z += 0.03;
        const mat = p.mesh.material as THREE.MeshBasicMaterial;
        mat.opacity = Math.max(0, 0.9 * (1 - progress));
        if (progress >= 1.0) {
          this.burstGroup.remove(p.mesh);
          p.mesh.geometry.dispose();
          mat.dispose();
          this.burstParticles.splice(i, 1);
        }
        continue;
      }

      p.mesh.position.add(p.velocity);
      // Softer gravity for hearts, stronger for petals
      const grav = p.kind === 'heart' ? 0.0012 : p.kind === 'spark' ? 0.0008 : 0.0022;
      p.velocity.y -= grav;
      // Slight air drag so they don't fly forever
      p.velocity.multiplyScalar(0.992);

      p.mesh.rotation.x += p.rotSpeed.x;
      p.mesh.rotation.y += p.rotSpeed.y;
      p.mesh.rotation.z += p.rotSpeed.z * 0.6;

      const progress = p.life / p.maxLife;
      const mat = p.mesh.material as THREE.MeshBasicMaterial;

      // Beautiful fade curve: stay bright longer then soft dissolve
      const fade = progress < 0.55 ? 1.0 : 1.0 - (progress - 0.55) / 0.45;
      mat.opacity = Math.max(0, fade * (p.kind === 'spark' ? 0.9 : 1.0));

      // Gentle scale breathe on hearts
      if (p.kind === 'heart') {
        const s = p.scale * (1 + Math.sin(p.life * 0.15) * 0.08);
        p.mesh.scale.setScalar(s);
      }

      if (progress >= 1.0) {
        this.burstGroup.remove(p.mesh);
        // Do NOT dispose shared geometries
        if (p.mesh.geometry !== this.sharedPetalGeo &&
            p.mesh.geometry !== this.sharedHeartGeo &&
            p.mesh.geometry !== this.sharedSparkGeo) {
          p.mesh.geometry.dispose();
        }
        mat.dispose();
        this.burstParticles.splice(i, 1);
      }
    }

    // 10. Ambient Twinkling Stardust rotation
    if (this.stardustPoints) {
      this.stardustPoints.rotation.y = elapsed * 0.015;
    }

    this.renderer.render(this.scene, this.camera);
  };

  public dispose() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.controls) {
      this.controls.dispose();
    }
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerdown', this.onPointerDown);
    window.removeEventListener('pointerup', this.onPointerUp);

    this.renderer.dispose();
    if (this.renderer.domElement && this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
