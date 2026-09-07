import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

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

// Camera — FOV stays moderate; distance comes from the 3D bounds.
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
controls.minPolarAngle = 0.28;
controls.maxPolarAngle = Math.PI * 0.44;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.25;

const framedPose = {
  position: new THREE.Vector3(),
  target: new THREE.Vector3(),
};

// ~46° elevation: the XZ bowl reads as a horseshoe, not a foreshortened wire.
const HERO_DIRECTION = new THREE.Vector3(0, 0.72, 0.69).normalize();
const WORLD_UP = new THREE.Vector3(0, 1, 0);

function collectBoxCorners(box, target = []) {
  const { min, max } = box;
  const points = [
    [min.x, min.y, min.z],
    [min.x, min.y, max.z],
    [min.x, max.y, min.z],
    [min.x, max.y, max.z],
    [max.x, min.y, min.z],
    [max.x, min.y, max.z],
    [max.x, max.y, min.z],
    [max.x, max.y, max.z],
  ];
  for (let i = 0; i < 8; i += 1) {
    if (!target[i]) target[i] = new THREE.Vector3();
    target[i].set(points[i][0], points[i][1], points[i][2]);
  }
  return target;
}

const _corners = collectBoxCorners(new THREE.Box3());
const _offset = new THREE.Vector3();
const _xAxis = new THREE.Vector3();
const _yAxis = new THREE.Vector3();
const _zAxis = new THREE.Vector3();

/**
 * Distance so every AABB corner sits inside the frustum with margin.
 * Camera sits at centre + direction * distance and lookAt(centre).
 */
function distanceToFitCorners(center, corners, direction, vFov, hFov, margin) {
  _zAxis.copy(direction).normalize();
  _xAxis.crossVectors(WORLD_UP, _zAxis);
  if (_xAxis.lengthSq() < 1e-8) {
    _xAxis.set(1, 0, 0);
  } else {
    _xAxis.normalize();
  }
  _yAxis.crossVectors(_zAxis, _xAxis).normalize();

  const tanH = Math.tan(hFov * 0.5);
  const tanV = Math.tan(vFov * 0.5);
  let needed = 1;

  for (let i = 0; i < corners.length; i += 1) {
    _offset.copy(corners[i]).sub(center);
    const along = _offset.dot(_zAxis);
    const x = _offset.dot(_xAxis);
    const y = _offset.dot(_yAxis);
    needed = Math.max(needed, along + Math.abs(x) / tanH, along + Math.abs(y) / tanV);
  }

  return needed * margin;
}

function frameCameraToArc(root) {
  const box = new THREE.Box3().setFromObject(root);
  const center = box.getCenter(new THREE.Vector3());
  const corners = collectBoxCorners(box, _corners);

  const aspect = Math.max(camera.aspect, 0.01);
  const vFov = THREE.MathUtils.degToRad(camera.fov);
  const hFov = 2 * Math.atan(Math.tan(vFov * 0.5) * aspect);
  const distance = distanceToFitCorners(center, corners, HERO_DIRECTION, vFov, hFov, 1.14);

  const target = center.clone();
  target.y += SCREEN_HEIGHT * 0.28;

  camera.near = Math.max(0.1, distance / 80);
  camera.far = Math.max(200, distance * 8);
  camera.updateProjectionMatrix();
  camera.position.copy(target).addScaledVector(HERO_DIRECTION, distance);
  camera.lookAt(target);

  controls.target.copy(target);
  controls.minDistance = distance * 0.4;
  controls.maxDistance = distance * 2.6;
  controls.update();

  framedPose.position.copy(camera.position);
  framedPose.target.copy(target);

  if (scene.fog) {
    scene.fog.near = distance * 1.55;
    scene.fog.far = distance * 3.4;
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
  const hemi = new THREE.HemisphereLight(0xc8d4e8, 0x1a1a1e, 0.6);
  scene.add(hemi);

  const ambient = new THREE.AmbientLight(0xffffff, 0.24);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.25);
  keyLight.position.set(10, 24, 28);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 2048;
  keyLight.shadow.mapSize.height = 2048;
  keyLight.shadow.camera.left = -24;
  keyLight.shadow.camera.right = 24;
  keyLight.shadow.camera.top = 24;
  keyLight.shadow.camera.bottom = -24;
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x88aaff, 0.65);
  fillLight.position.set(-20, 16, 10);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xffffee, 0.8);
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
console.log('📷 Camera framed above-front to the 3D arc bounds');

animate();
