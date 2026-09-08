import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { collectMeshCorners, computeHorseshoePose } from './framing.js';

// Configuration
const LAPTOP_COUNT = 51;
const SEMICIRCLE_RADIUS = 14.0;
const ARC_ANGLE = 180.0;
const LAPTOP_WIDTH = 0.68;
const LAPTOP_DEPTH = 0.58;
const LAPTOP_THICKNESS = 0.05;
const SCREEN_HEIGHT = 0.78;
const SCREEN_TILT = THREE.MathUtils.degToRad(20);

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
scene.fog = new THREE.Fog(0x000000, 80, 160);

// Camera — FOV stays moderate; distance comes from orbit-safe horseshoe fit.
const CAMERA_FOV = 40;
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

// Controls — stay above the ground plane so auto-rotate cannot graze the arc edge-on.
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minPolarAngle = 0.24;
controls.maxPolarAngle = Math.PI * 0.38;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.25;

const framedPose = {
  position: new THREE.Vector3(),
  target: new THREE.Vector3(),
};

function frameCameraToArc(root) {
  const points = collectMeshCorners(root);
  const pose = computeHorseshoePose({
    points,
    vFov: THREE.MathUtils.degToRad(camera.fov),
    aspect: camera.aspect,
    liftY: SCREEN_HEIGHT * 0.28,
    fallbackRadius: SEMICIRCLE_RADIUS,
  });

  camera.near = Math.max(0.1, pose.distance / 80);
  camera.far = Math.max(200, pose.distance * 8);
  camera.updateProjectionMatrix();
  camera.position.copy(pose.position);
  camera.lookAt(pose.target);

  controls.target.copy(pose.target);
  controls.minDistance = pose.distance * 0.45;
  controls.maxDistance = pose.distance * 2.8;
  controls.update();

  framedPose.position.copy(camera.position);
  framedPose.target.copy(pose.target);

  if (scene.fog) {
    scene.fog.near = pose.distance * 1.85;
    scene.fog.far = pose.distance * 4.2;
  }
}

const shared = {
  base: new THREE.MeshStandardMaterial({
    color: 0xc4c4ce,
    metalness: 0.5,
    roughness: 0.32,
  }),
  keys: new THREE.MeshStandardMaterial({
    color: 0x2a2c32,
    metalness: 0.15,
    roughness: 0.55,
  }),
  lid: new THREE.MeshStandardMaterial({
    color: 0xb8bac4,
    metalness: 0.55,
    roughness: 0.3,
  }),
  displays: [
    new THREE.MeshStandardMaterial({
      color: 0x10161c,
      emissive: 0x4a90b8,
      emissiveIntensity: 0.85,
      roughness: 0.2,
      metalness: 0.04,
    }),
    new THREE.MeshStandardMaterial({
      color: 0x0e141a,
      emissive: 0x3a6ea4,
      emissiveIntensity: 0.75,
      roughness: 0.2,
      metalness: 0.04,
    }),
    new THREE.MeshStandardMaterial({
      color: 0x121820,
      emissive: 0x5a88b0,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.04,
    }),
  ],
};

function setupLighting() {
  const hemi = new THREE.HemisphereLight(0xdce6f2, 0x111318, 0.7);
  scene.add(hemi);

  const ambient = new THREE.AmbientLight(0xffffff, 0.32);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.55);
  keyLight.position.set(10, 24, 28);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 2048;
  keyLight.shadow.mapSize.height = 2048;
  keyLight.shadow.camera.left = -24;
  keyLight.shadow.camera.right = 24;
  keyLight.shadow.camera.top = 24;
  keyLight.shadow.camera.bottom = -24;
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x88aaff, 0.85);
  fillLight.position.set(-20, 16, 10);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xffffee, 1.05);
  rimLight.position.set(6, 14, -22);
  scene.add(rimLight);
}

/**
 * Y-up laptop sitting on XZ. Default facing +Z (screen toward +Z, hinge at -Z).
 * Blender's script is Z-up on XY — do not copy those coords into Three.js.
 */
function createLaptop(displayMaterial) {
  const laptop = new THREE.Group();

  const base = new THREE.Mesh(
    new THREE.BoxGeometry(LAPTOP_WIDTH, LAPTOP_THICKNESS, LAPTOP_DEPTH),
    shared.base
  );
  base.position.y = LAPTOP_THICKNESS * 0.5;
  base.castShadow = true;
  base.receiveShadow = true;
  laptop.add(base);

  const keys = new THREE.Mesh(
    new THREE.BoxGeometry(LAPTOP_WIDTH * 0.78, LAPTOP_THICKNESS * 0.35, LAPTOP_DEPTH * 0.5),
    shared.keys
  );
  keys.position.set(0, LAPTOP_THICKNESS + 0.002, LAPTOP_DEPTH * 0.05);
  laptop.add(keys);

  const screen = new THREE.Group();
  const lid = new THREE.Mesh(
    new THREE.BoxGeometry(LAPTOP_WIDTH * 0.96, SCREEN_HEIGHT, LAPTOP_THICKNESS * 0.7),
    shared.lid
  );
  lid.position.y = SCREEN_HEIGHT * 0.5;
  lid.castShadow = true;
  screen.add(lid);

  const display = new THREE.Mesh(
    new THREE.PlaneGeometry(LAPTOP_WIDTH * 0.86, SCREEN_HEIGHT * 0.82),
    displayMaterial
  );
  display.position.set(0, SCREEN_HEIGHT * 0.5, LAPTOP_THICKNESS * 0.38);
  screen.add(display);

  screen.position.set(0, LAPTOP_THICKNESS, -LAPTOP_DEPTH * 0.5);
  screen.rotation.x = -SCREEN_TILT;
  laptop.add(screen);

  return laptop;
}

function createSemicircleArray() {
  const root = new THREE.Group();
  root.name = 'SemicircleArc';
  const laptops = [];
  const angleStep = (ARC_ANGLE * Math.PI / 180) / (LAPTOP_COUNT - 1);
  const startAngle = -(ARC_ANGLE * Math.PI / 180) / 2;

  for (let i = 0; i < LAPTOP_COUNT; i += 1) {
    const laptop = createLaptop(shared.displays[i % shared.displays.length]);
    // Horizontal XZ semicircle, bulge at -Z, open diameter on X facing +Z / camera.
    const angle = startAngle + i * angleStep;
    const x = SEMICIRCLE_RADIUS * Math.sin(angle);
    const z = -SEMICIRCLE_RADIUS * Math.cos(angle);

    laptop.position.set(x, 0, z);
    laptop.rotation.y = -angle;
    root.add(laptop);
    laptops.push(laptop);
  }

  scene.add(root);
  return { root, laptops };
}

function createGround() {
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(28, 64),
    new THREE.MeshStandardMaterial({
      color: 0x0b0c10,
      roughness: 0.88,
      metalness: 0.12,
    })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(0, -0.01, -SEMICIRCLE_RADIUS * 0.45);
  ground.receiveShadow = true;
  scene.add(ground);
}

const btnRotate = document.getElementById('btn-rotate');
const btnReset = document.getElementById('btn-reset');
let arcRoot = null;

btnRotate.addEventListener('click', () => {
  controls.autoRotate = !controls.autoRotate;
  btnRotate.classList.toggle('active');
  btnRotate.textContent = controls.autoRotate ? 'Auto-Rotate' : 'Manual';
});

btnReset.addEventListener('click', () => {
  if (arcRoot) frameCameraToArc(arcRoot);
  else {
    camera.position.copy(framedPose.position);
    camera.lookAt(framedPose.target);
    controls.target.copy(framedPose.target);
    controls.update();
  }
  controls.autoRotate = true;
  btnRotate.classList.add('active');
  btnRotate.textContent = 'Auto-Rotate';
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  if (arcRoot) frameCameraToArc(arcRoot);
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

setupLighting();
createGround();
const { root, laptops } = createSemicircleArray();
arcRoot = root;
frameCameraToArc(arcRoot);

console.log(`✅ Created ${laptops.length} laptops in an XZ semicircle`);
console.log('📐 Procedural geometry — no external models loaded');
console.log('📷 Camera framed above-front to the horseshoe (orbit-safe)');

animate();
