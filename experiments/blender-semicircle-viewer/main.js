import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Configuration
const LAPTOP_COUNT = 51;
const SEMICIRCLE_RADIUS = 12.0;
const ARC_ANGLE = 180.0;
const LAPTOP_WIDTH = 0.8;
const LAPTOP_DEPTH = 0.6;
const LAPTOP_THICKNESS = 0.05;
const SCREEN_HEIGHT = 0.5;

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);
scene.fog = new THREE.Fog(0x0a0a0a, 80, 160);

// Camera — FOV is moderate; distance is computed from the arc bounds so
// 51 laptops read as a visible semicircle instead of a cropped mega-arc.
const CAMERA_FOV = 42;
const camera = new THREE.PerspectiveCamera(
  CAMERA_FOV,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI * 0.72;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.25;

const framedPose = {
  position: new THREE.Vector3(),
  target: new THREE.Vector3(),
};

function frameCameraToArc(root) {
  const box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3());
  const sphere = box.getBoundingSphere(new THREE.Sphere());
  const center = sphere.center;

  const aspect = Math.max(camera.aspect, 0.01);
  const vFov = THREE.MathUtils.degToRad(camera.fov);
  const hFov = 2 * Math.atan(Math.tan(vFov * 0.5) * aspect);
  const fitHeight = (size.y * 0.5) / Math.tan(vFov * 0.5);
  const fitWidth = (size.x * 0.5) / Math.tan(vFov * 0.5) / aspect;
  const aabbDist = Math.max(fitHeight, fitWidth, 1) * 1.32;
  const limit = Math.min(Math.tan(vFov * 0.5), Math.tan(hFov * 0.5));
  const sphereDist = Math.max((sphere.radius / Math.max(limit, 0.05)) * 1.08, 1);
  // Wide: AABB hero fill. Narrow: blend toward the sphere so orbit doesn't clip,
  // without pushing the camera so far the 51 laptops become a hairline.
  const distance = aspect >= 1
    ? aabbDist
    : THREE.MathUtils.lerp(aabbDist, sphereDist, 0.28);

  const direction = new THREE.Vector3(0.12, -0.42, 0.9).normalize();
  camera.near = Math.max(0.1, distance / 80);
  camera.far = Math.max(200, distance * 8);
  camera.updateProjectionMatrix();
  camera.position.copy(center).addScaledVector(direction, distance);
  camera.lookAt(center);

  controls.target.copy(center);
  controls.minDistance = distance * 0.45;
  controls.maxDistance = distance * 2.4;
  controls.update();

  framedPose.position.copy(camera.position);
  framedPose.target.copy(center);

  if (scene.fog) {
    // Fog starts behind the subject so the 51 laptops stay readable.
    scene.fog.near = distance * 1.45;
    scene.fog.far = distance * 3.2;
  }
}

// Lighting
function setupLighting() {
  const hemi = new THREE.HemisphereLight(0xc8d4e8, 0x1a1a1e, 0.55);
  scene.add(hemi);

  const ambient = new THREE.AmbientLight(0xffffff, 0.22);
  scene.add(ambient);

  // Key — from the same below-front quarter as the framed camera
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.35);
  keyLight.position.set(18, -8, 28);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 2048;
  keyLight.shadow.mapSize.height = 2048;
  keyLight.shadow.camera.left = -24;
  keyLight.shadow.camera.right = 24;
  keyLight.shadow.camera.top = 24;
  keyLight.shadow.camera.bottom = -24;
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x88aaff, 0.7);
  fillLight.position.set(-16, 10, 12);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xffffee, 0.85);
  rimLight.position.set(4, 6, -18);
  scene.add(rimLight);
}

// Create laptop geometry
function createLaptop() {
  const laptop = new THREE.Group();

  // Base (keyboard section)
  const baseGeometry = new THREE.BoxGeometry(LAPTOP_WIDTH, LAPTOP_DEPTH, LAPTOP_THICKNESS);
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: 0xc4c4ce,
    metalness: 0.45,
    roughness: 0.35,
    envMapIntensity: 0.4,
  });
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  base.castShadow = true;
  base.receiveShadow = true;
  laptop.add(base);

  // Screen
  const screenGeometry = new THREE.BoxGeometry(
    LAPTOP_WIDTH * 0.95,
    LAPTOP_THICKNESS * 0.5,
    SCREEN_HEIGHT
  );
  const screenMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1e28,
    emissive: 0x334455,
    emissiveIntensity: 0.3,
    roughness: 0.2
  });
  const screen = new THREE.Mesh(screenGeometry, screenMaterial);
  screen.position.set(0, -LAPTOP_DEPTH / 2 - 0.02, SCREEN_HEIGHT / 2);
  screen.rotation.x = -Math.PI * 0.42; // ~105° laptop open angle
  screen.castShadow = true;
  laptop.add(screen);

  return laptop;
}

// Create semicircle array
function createSemicircleArray() {
  const root = new THREE.Group();
  root.name = 'SemicircleArc';
  const laptops = [];
  const angleStep = (ARC_ANGLE * Math.PI / 180) / (LAPTOP_COUNT - 1);
  const startAngle = -(ARC_ANGLE * Math.PI / 180) / 2;

  for (let i = 0; i < LAPTOP_COUNT; i++) {
    const laptop = createLaptop();
    
    // Calculate position
    const angle = startAngle + (i * angleStep);
    const x = SEMICIRCLE_RADIUS * Math.cos(angle);
    const y = SEMICIRCLE_RADIUS * Math.sin(angle);
    
    laptop.position.set(x, y, 0);
    laptop.rotation.z = angle + Math.PI / 2; // Face outward
    
    root.add(laptop);
    laptops.push(laptop);
  }

  scene.add(root);
  return { root, laptops };
}

// Ground plane (optional, for shadows)
function createGround() {
  const groundGeometry = new THREE.CircleGeometry(30, 64);
  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x0f0f0f,
    roughness: 0.8,
    metalness: 0.2
  });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = 0;
  ground.position.z = -0.1;
  ground.receiveShadow = true;
  scene.add(ground);
}

// UI controls
const btnRotate = document.getElementById('btn-rotate');
const btnReset = document.getElementById('btn-reset');

btnRotate.addEventListener('click', () => {
  controls.autoRotate = !controls.autoRotate;
  btnRotate.classList.toggle('active');
  btnRotate.textContent = controls.autoRotate ? 'Auto-Rotate' : 'Manual';
});

btnReset.addEventListener('click', () => {
  camera.position.copy(framedPose.position);
  camera.lookAt(framedPose.target);
  controls.target.copy(framedPose.target);
  controls.update();
  controls.autoRotate = true;
  btnRotate.classList.add('active');
  btnRotate.textContent = 'Auto-Rotate';
});

let arcRoot = null;

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  if (arcRoot) frameCameraToArc(arcRoot);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

// Initialize
setupLighting();
createGround();
const { root, laptops } = createSemicircleArray();
arcRoot = root;
frameCameraToArc(arcRoot);

console.log(`✅ Created ${laptops.length} laptops in semicircle`);
console.log('📐 Procedural geometry — no external models loaded');
console.log('📷 Camera framed to arc bounds (full 180° visible)');

animate();
