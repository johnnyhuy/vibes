import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createLocomotive } from './geometry/locomotive.js';
import { explodeParts } from './utils/explosion.js';

let scene, camera, renderer, controls;
let locomotive;
let explosionLevel = 0;
let isolationMode = 'all';

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  camera = new THREE.PerspectiveCamera(
    36,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(15.5, 6.4, 15.5);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  document.getElementById('canvas-container').appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 8;
  controls.maxDistance = 42;
  controls.maxPolarAngle = Math.PI / 2.05;
  controls.target.set(0, 0.6, 0);

  setupLights();
  
  locomotive = createLocomotive();
  scene.add(locomotive.group);

  setupControls();
  
  window.addEventListener('resize', onWindowResize);
}

function setupLights() {
  const hemi = new THREE.HemisphereLight(0xd7e2ee, 0x000000, 0.22);
  scene.add(hemi);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.16);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xfff4e6, 1.45);
  keyLight.position.set(10, 15, 10);
  keyLight.castShadow = true;
  keyLight.shadow.camera.left = -20;
  keyLight.shadow.camera.right = 20;
  keyLight.shadow.camera.top = 20;
  keyLight.shadow.camera.bottom = -20;
  keyLight.shadow.mapSize.width = 2048;
  keyLight.shadow.mapSize.height = 2048;
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x6495ed, 0.42);
  fillLight.position.set(-8, 5, -5);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xffc27a, 0.85);
  rimLight.position.set(0, 4, -12);
  scene.add(rimLight);

  const ring = new THREE.Mesh(
    new THREE.RingGeometry(8.2, 8.38, 96),
    new THREE.MeshBasicMaterial({ color: 0x8aa4bb, transparent: true, opacity: 0.28, side: THREE.DoubleSide })
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = -1.98;
  scene.add(ring);

  const groundGeometry = new THREE.CircleGeometry(8.2, 64);
  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x07080a,
    roughness: 0.92,
    metalness: 0.08,
  });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -2;
  ground.receiveShadow = true;
  scene.add(ground);
}

function setupControls() {
  const btnAssembled = document.getElementById('btn-assembled');
  const btnExploded = document.getElementById('btn-exploded');
  const explosionSlider = document.getElementById('explosion-slider');
  const sliderValue = document.querySelector('.slider-value');
  
  const btnAll = document.getElementById('btn-all');
  const btnChassis = document.getElementById('btn-chassis');
  const btnWheels = document.getElementById('btn-wheels');

  btnAssembled.addEventListener('click', () => {
    explosionLevel = 0;
    explosionSlider.value = 0;
    sliderValue.textContent = '0%';
    btnAssembled.classList.add('active');
    btnExploded.classList.remove('active');
    updateExplosion();
  });

  btnExploded.addEventListener('click', () => {
    explosionLevel = 100;
    explosionSlider.value = 100;
    sliderValue.textContent = '100%';
    btnExploded.classList.add('active');
    btnAssembled.classList.remove('active');
    updateExplosion();
  });

  explosionSlider.addEventListener('input', (e) => {
    explosionLevel = parseFloat(e.target.value);
    sliderValue.textContent = `${Math.round(explosionLevel)}%`;
    
    if (explosionLevel === 0) {
      btnAssembled.classList.add('active');
      btnExploded.classList.remove('active');
    } else if (explosionLevel === 100) {
      btnExploded.classList.add('active');
      btnAssembled.classList.remove('active');
    } else {
      btnAssembled.classList.remove('active');
      btnExploded.classList.remove('active');
    }
    
    updateExplosion();
  });

  btnAll.addEventListener('click', () => {
    isolationMode = 'all';
    updateIsolationButtons();
    updateIsolation();
  });

  btnChassis.addEventListener('click', () => {
    isolationMode = 'chassis';
    updateIsolationButtons();
    updateIsolation();
  });

  btnWheels.addEventListener('click', () => {
    isolationMode = 'wheels';
    updateIsolationButtons();
    updateIsolation();
  });

  function updateIsolationButtons() {
    [btnAll, btnChassis, btnWheels].forEach(btn => btn.classList.remove('active'));
    if (isolationMode === 'all') btnAll.classList.add('active');
    if (isolationMode === 'chassis') btnChassis.classList.add('active');
    if (isolationMode === 'wheels') btnWheels.classList.add('active');
  }
}

function updateExplosion() {
  if (!locomotive) return;
  explodeParts(locomotive, explosionLevel / 100);
}

function updateIsolation() {
  if (!locomotive) return;
  
  locomotive.parts.chassis.forEach(part => {
    part.visible = isolationMode === 'all' || isolationMode === 'chassis';
  });
  
  locomotive.parts.wheels.forEach(part => {
    part.visible = isolationMode === 'all' || isolationMode === 'wheels';
  });
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  
  controls.update();
  
  renderer.render(scene, camera);
}

init();
animate();
