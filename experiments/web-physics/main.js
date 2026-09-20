import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene, camera, renderer;
let world;
let bodies = [];
let meshes = [];
let controls;
let paused = false;
const clock = new THREE.Clock();
const MAX_BODIES = 80;

const colors = [
  0x3b82f6, 0x8b5cf6, 0xec4899, 0xf59e0b,
  0x10b981, 0x06b6d4, 0x6366f1, 0xf43f5e
];

init();
animate();

function init() {
  const container = document.getElementById('app');
  
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  scene.fog = new THREE.Fog(0x000000, 42, 90);
  
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 9.2, 23);
  camera.lookAt(0, 1.2, 0);
  
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.4;
  container.appendChild(renderer.domElement);
  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 1.2, 0);
  controls.enableDamping = true;
  controls.minDistance = 8;
  controls.maxDistance = 38;
  controls.maxPolarAngle = Math.PI * .48;
  
  const hemi = new THREE.HemisphereLight(0xe8eef6, 0x111318, 0.45);
  scene.add(hemi);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.36);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xfff4e6, 2.1);
  directionalLight.position.set(5, 10, 7);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.left = -15;
  directionalLight.shadow.camera.right = 15;
  directionalLight.shadow.camera.top = 15;
  directionalLight.shadow.camera.bottom = -15;
  scene.add(directionalLight);
  
  const fillLight = new THREE.DirectionalLight(0x8eb6ff, 0.65);
  fillLight.position.set(-5, 3, -5);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xffe0b8, 0.85);
  rimLight.position.set(2, 4, -8);
  scene.add(rimLight);
  
  world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.82, 0)
  });
  
  world.broadphase = new CANNON.SAPBroadphase(world);
  world.allowSleep = true;
  world.defaultContactMaterial.friction = 0.3;
  world.defaultContactMaterial.restitution = 0.4;
  
  createGround();
  createWalls();
  
  spawnBox(0, 5, 0);
  spawnSphere(-2, 8, 0);
  spawnBox(2, 10, 0);
  
  window.addEventListener('resize', onWindowResize);
  let down = null;
  renderer.domElement.addEventListener('pointerdown', event => { down = [event.clientX, event.clientY]; });
  renderer.domElement.addEventListener('pointerup', event => {
    if (down && Math.hypot(event.clientX-down[0], event.clientY-down[1]) < 5) onClick(event);
    down = null;
  });
  window.addEventListener('keydown', onKeyDown);
  document.querySelector('#add-box').onclick = () => spawnBox(0, 9, 0);
  document.querySelector('#add-sphere').onclick = () => spawnSphere(0, 9, 0);
  document.querySelector('#reset').onclick = resetScene;
  document.querySelector('#pause').onclick = event => {
    paused = !paused;
    event.currentTarget.textContent = paused ? 'Resume' : 'Pause';
    event.currentTarget.setAttribute('aria-pressed', String(paused));
  };
}

function createGround() {
  const groundShape = new CANNON.Box(new CANNON.Vec3(10, 0.5, 10));
  const groundBody = new CANNON.Body({ mass: 0, shape: groundShape });
  groundBody.position.set(0, -0.5, 0);
  world.addBody(groundBody);
  
  const groundGeometry = new THREE.BoxGeometry(20, 1, 20);
  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x1c2028,
    metalness: 0.08,
    roughness: 0.92
  });
  const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
  groundMesh.receiveShadow = true;
  groundMesh.position.copy(groundBody.position);
  scene.add(groundMesh);
}

function createWalls() {
  const wallMaterial = new THREE.MeshStandardMaterial({
    color: 0x0a0b0e,
    metalness: 0.15,
    roughness: 0.85,
    transparent: true,
    opacity: 0.06,
    depthWrite: false
  });
  
  const walls = [
    { pos: [0, 5, -10], size: [20, 10, 0.5] },
    { pos: [0, 5, 10], size: [20, 10, 0.5] },
    { pos: [-10, 5, 0], size: [0.5, 10, 20] },
    { pos: [10, 5, 0], size: [0.5, 10, 20] }
  ];
  
  walls.forEach(wall => {
    const shape = new CANNON.Box(new CANNON.Vec3(
      wall.size[0] / 2,
      wall.size[1] / 2,
      wall.size[2] / 2
    ));
    const body = new CANNON.Body({ mass: 0, shape });
    body.position.set(...wall.pos);
    world.addBody(body);
    
    const geometry = new THREE.BoxGeometry(...wall.size);
    const mesh = new THREE.Mesh(geometry, wallMaterial);
    mesh.position.copy(body.position);
    scene.add(mesh);
  });
}

function spawnBox(x, y, z) {
  makeRoom();
  const size = 0.8 + Math.random() * 0.8;
  const shape = new CANNON.Box(new CANNON.Vec3(size / 2, size / 2, size / 2));
  const body = new CANNON.Body({ mass: 5, shape });
  body.position.set(x, y, z);
  
  body.angularVelocity.set(
    (Math.random() - 0.5) * 2,
    (Math.random() - 0.5) * 2,
    (Math.random() - 0.5) * 2
  );
  
  world.addBody(body);
  bodies.push(body);
  
  const geometry = new THREE.BoxGeometry(size, size, size);
  const material = new THREE.MeshStandardMaterial({
    color: colors[Math.floor(Math.random() * colors.length)],
    metalness: 0.42,
    roughness: 0.22,
    emissive: colors[Math.floor(Math.random() * colors.length)],
    emissiveIntensity: 0.22
  });
  
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
  meshes.push({ mesh, body });
}

function spawnSphere(x, y, z) {
  makeRoom();
  const radius = 0.4 + Math.random() * 0.5;
  const shape = new CANNON.Sphere(radius);
  const body = new CANNON.Body({ mass: 3, shape });
  body.position.set(x, y, z);
  
  body.angularVelocity.set(
    (Math.random() - 0.5) * 3,
    (Math.random() - 0.5) * 3,
    (Math.random() - 0.5) * 3
  );
  
  world.addBody(body);
  bodies.push(body);
  
  const geometry = new THREE.SphereGeometry(radius, 16, 16);
  const material = new THREE.MeshStandardMaterial({
    color: colors[Math.floor(Math.random() * colors.length)],
    metalness: 0.55,
    roughness: 0.16,
    emissive: colors[Math.floor(Math.random() * colors.length)],
    emissiveIntensity: 0.28
  });
  
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
  meshes.push({ mesh, body });
}

function onClick(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  const ray = new THREE.Raycaster();
  ray.setFromCamera(new THREE.Vector2((event.clientX-rect.left)/rect.width*2-1, 1-(event.clientY-rect.top)/rect.height*2), camera);
  const hit = ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,1,0),0), new THREE.Vector3());
  if(hit) spawnBox(THREE.MathUtils.clamp(hit.x,-8,8), 9, THREE.MathUtils.clamp(hit.z,-8,8));
}

function onKeyDown(event) {
  if (event.target.closest('input,textarea,select,button,a,[contenteditable="true"]') || event.repeat) return;
  if (event.code === 'Space') {
    event.preventDefault();
    const x = (Math.random() - 0.5) * 4;
    const z = (Math.random() - 0.5) * 4;
    spawnSphere(x, 10 + Math.random() * 5, z);
  } else if (event.code === 'KeyR') {
    resetScene();
  }
}

function resetScene() {
  meshes.forEach(({ mesh, body }) => {
    scene.remove(mesh);
    world.removeBody(body);
    mesh.geometry.dispose();
    mesh.material.dispose();
  });
  
  bodies = [];
  meshes = [];
  
  spawnBox(0, 5, 0);
  spawnSphere(-2, 8, 0);
  spawnBox(2, 10, 0);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.zoom = .9 * Math.min(1, camera.aspect / 1.25);
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function makeRoom() {
  if (meshes.length < MAX_BODIES) return;
  const {mesh,body} = meshes.shift();
  bodies.shift();
  scene.remove(mesh);
  world.removeBody(body);
  mesh.geometry.dispose();
  mesh.material.dispose();
}

function animate() {
  requestAnimationFrame(animate);
  
  const delta = Math.min(clock.getDelta(), .1);
  if (!paused && !document.hidden) world.step(1 / 60, delta, 5);
  controls.update();
  document.querySelector('#body-count').textContent = `${meshes.length} / ${MAX_BODIES} bodies`;
  
  meshes.forEach(({ mesh, body }) => {
    mesh.position.copy(body.position);
    mesh.quaternion.copy(body.quaternion);
  });
  
  renderer.render(scene, camera);
}

import '../shared/exhibit.css';
