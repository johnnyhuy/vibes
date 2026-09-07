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
scene.fog = new THREE.Fog(0x0a0a0a, 20, 50);

// Camera
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, -SEMICIRCLE_RADIUS * 1.5, SEMICIRCLE_RADIUS * 0.8);
camera.lookAt(0, 0, 0);

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
controls.minDistance = 10;
controls.maxDistance = 40;
controls.maxPolarAngle = Math.PI / 2;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;

// Lighting
function setupLighting() {
  // Ambient light
  const ambient = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambient);

  // Key light (main directional)
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
  keyLight.position.set(15, 10, 15);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 2048;
  keyLight.shadow.mapSize.height = 2048;
  keyLight.shadow.camera.left = -20;
  keyLight.shadow.camera.right = 20;
  keyLight.shadow.camera.top = 20;
  keyLight.shadow.camera.bottom = -20;
  scene.add(keyLight);

  // Fill light
  const fillLight = new THREE.DirectionalLight(0x88aaff, 0.8);
  fillLight.position.set(-10, 8, -10);
  scene.add(fillLight);

  // Rim light (backlight)
  const rimLight = new THREE.DirectionalLight(0xffffee, 0.6);
  rimLight.position.set(0, 5, -15);
  scene.add(rimLight);
}

// Create laptop geometry
function createLaptop() {
  const laptop = new THREE.Group();

  // Base (keyboard section)
  const baseGeometry = new THREE.BoxGeometry(LAPTOP_WIDTH, LAPTOP_DEPTH, LAPTOP_THICKNESS);
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: 0xb0b0bb,
    metalness: 0.8,
    roughness: 0.3
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
    
    scene.add(laptop);
    laptops.push(laptop);
  }

  return laptops;
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
  camera.position.set(0, -SEMICIRCLE_RADIUS * 1.5, SEMICIRCLE_RADIUS * 0.8);
  camera.lookAt(0, 0, 0);
  controls.reset();
  controls.autoRotate = true;
  btnRotate.classList.add('active');
  btnRotate.textContent = 'Auto-Rotate';
});

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
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
const laptops = createSemicircleArray();

console.log(`✅ Created ${LAPTOP_COUNT} laptops in semicircle`);
console.log('📐 Procedural geometry — no external models loaded');

animate();
