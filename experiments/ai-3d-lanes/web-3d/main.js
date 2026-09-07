import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, controls;
let currentScene = 'assembly';
let assemblyParts = [];
let cutawayParts = [];
let raycaster, pointer;

const partInfo = {
  'Housing': 'Main protective enclosure housing the internal components.',
  'Rotor': 'Rotating component that converts electrical energy to mechanical motion.',
  'Stator': 'Stationary electromagnetic component surrounding the rotor.',
  'Shaft': 'Central rotating axle transmitting torque to external mechanisms.',
  'Bearing Front': 'Front bearing assembly reducing friction and supporting shaft rotation.',
  'Bearing Rear': 'Rear bearing assembly providing additional shaft support.',
  'End Cap Front': 'Front protective cover sealing the motor assembly.',
  'End Cap Rear': 'Rear protective cover with mounting interface.',
  'Cooling Fan': 'Ventilation component for thermal management.',
  'Terminal Box': 'Electrical connection interface for power supply.',
  'Mounting Flange': 'Mechanical interface for installation.',
  'Winding': 'Electromagnetic coils generating the magnetic field.'
};

init();
animate();

function init() {
  const container = document.getElementById('canvas-container');
  
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a0a);
  scene.fog = new THREE.Fog(0x0a0a0a, 10, 50);
  
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(8, 6, 12);
  
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);
  
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxDistance = 30;
  controls.minDistance = 5;
  
  raycaster = new THREE.Raycaster();
  pointer = new THREE.Vector2();
  
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
  directionalLight.position.set(5, 10, 7);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  scene.add(directionalLight);
  
  const fillLight = new THREE.DirectionalLight(0x4488ff, 0.4);
  fillLight.position.set(-5, 3, -5);
  scene.add(fillLight);
  
  const rimLight = new THREE.DirectionalLight(0xff8844, 0.3);
  rimLight.position.set(0, 3, -8);
  scene.add(rimLight);
  
  createAssemblyScene();
  createCutawayScene();
  
  showScene('assembly');
  
  const explodeSlider = document.getElementById('explode-slider');
  explodeSlider.addEventListener('input', (e) => {
    updateExplode(e.target.value / 100);
  });
  
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      tabs.forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      const sceneName = e.target.dataset.scene;
      showScene(sceneName);
    });
  });
  
  window.addEventListener('resize', onWindowResize);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('click', onPointerClick);
}

function createAssemblyScene() {
  const colors = [
    0x3b82f6, 0x8b5cf6, 0xec4899, 0xf59e0b,
    0x10b981, 0x06b6d4, 0x6366f1, 0xf43f5e,
    0x14b8a6, 0xa855f7, 0xeab308, 0x22c55e
  ];
  
  const partConfigs = [
    { name: 'Housing', geometry: [3, 4, 3], position: [0, 0, 0], offset: [0, 1, 0] },
    { name: 'Rotor', geometry: [1.5, 3, 1.5], position: [0, 0, 0], offset: [0, 0.5, 0] },
    { name: 'Stator', geometry: [2.2, 3.2, 2.2], position: [0, 0, 0], offset: [0, -0.5, 0] },
    { name: 'Shaft', geometry: [0.3, 5, 0.3], position: [0, 0, 0], offset: [0, 2, 0] },
    { name: 'Bearing Front', geometry: [0.6, 0.4, 0.6], position: [0, 2, 0], offset: [0, 0.8, 0] },
    { name: 'Bearing Rear', geometry: [0.6, 0.4, 0.6], position: [0, -2, 0], offset: [0, -0.8, 0] },
    { name: 'End Cap Front', geometry: [3.2, 0.5, 3.2], position: [0, 2.5, 0], offset: [0, 1.2, 0] },
    { name: 'End Cap Rear', geometry: [3.2, 0.5, 3.2], position: [0, -2.5, 0], offset: [0, -1.2, 0] },
    { name: 'Cooling Fan', geometry: [2.5, 0.3, 2.5], position: [0, 3, 0], offset: [0, 1.5, 0] },
    { name: 'Terminal Box', geometry: [1.5, 1, 1], position: [2, 0, 0], offset: [1.5, 0, 0] },
    { name: 'Mounting Flange', geometry: [4, 0.3, 4], position: [0, -3, 0], offset: [0, -1.5, 0] },
    { name: 'Winding', geometry: [1.8, 2.8, 1.8], position: [0, 0, 0], offset: [0, 0, -2] }
  ];
  
  partConfigs.forEach((config, i) => {
    const geometry = new THREE.BoxGeometry(...config.geometry);
    const material = new THREE.MeshStandardMaterial({
      color: colors[i % colors.length],
      metalness: 0.6,
      roughness: 0.3,
      emissive: colors[i % colors.length],
      emissiveIntensity: 0.1
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...config.position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = {
      name: config.name,
      originalPosition: new THREE.Vector3(...config.position),
      explodeOffset: new THREE.Vector3(...config.offset),
      originalColor: colors[i % colors.length]
    };
    
    const edges = new THREE.EdgesGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: 0x000000, 
      transparent: true, 
      opacity: 0.2 
    });
    const wireframe = new THREE.LineSegments(edges, lineMaterial);
    mesh.add(wireframe);
    
    assemblyParts.push(mesh);
    scene.add(mesh);
  });
}

function createCutawayScene() {
  const cylinderRadius = 2.5;
  const cylinderHeight = 6;
  
  const outerGeometry = new THREE.CylinderGeometry(cylinderRadius, cylinderRadius, cylinderHeight, 32);
  const outerMaterial = new THREE.MeshStandardMaterial({
    color: 0x444444,
    metalness: 0.8,
    roughness: 0.2,
    side: THREE.DoubleSide,
    clippingPlanes: [new THREE.Plane(new THREE.Vector3(1, 0, 0), 0)]
  });
  
  const outerCylinder = new THREE.Mesh(outerGeometry, outerMaterial);
  outerCylinder.visible = false;
  outerCylinder.castShadow = true;
  outerCylinder.userData = { name: 'Outer Shell' };
  cutawayParts.push(outerCylinder);
  scene.add(outerCylinder);
  
  const innerGeometry = new THREE.CylinderGeometry(cylinderRadius * 0.4, cylinderRadius * 0.4, cylinderHeight * 0.9, 32);
  const innerMaterial = new THREE.MeshStandardMaterial({
    color: 0xff6b35,
    metalness: 0.5,
    roughness: 0.4,
    side: THREE.DoubleSide
  });
  
  const innerCylinder = new THREE.Mesh(innerGeometry, innerMaterial);
  innerCylinder.visible = false;
  innerCylinder.userData = { name: 'Rotor Core' };
  cutawayParts.push(innerCylinder);
  scene.add(innerCylinder);
  
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const coilGeometry = new THREE.BoxGeometry(0.3, cylinderHeight * 0.8, 0.5);
    const coilMaterial = new THREE.MeshStandardMaterial({
      color: 0x00d9ff,
      metalness: 0.3,
      roughness: 0.7,
      emissive: 0x00d9ff,
      emissiveIntensity: 0.2
    });
    
    const coil = new THREE.Mesh(coilGeometry, coilMaterial);
    const radius = cylinderRadius * 0.7;
    coil.position.set(
      Math.cos(angle) * radius,
      0,
      Math.sin(angle) * radius
    );
    coil.rotation.y = angle;
    coil.visible = false;
    coil.userData = { name: `Coil ${i + 1}` };
    cutawayParts.push(coil);
    scene.add(coil);
  }
  
  const shaftGeometry = new THREE.CylinderGeometry(0.3, 0.3, cylinderHeight * 1.2, 16);
  const shaftMaterial = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    metalness: 0.9,
    roughness: 0.1
  });
  
  const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial);
  shaft.visible = false;
  shaft.castShadow = true;
  shaft.userData = { name: 'Drive Shaft' };
  cutawayParts.push(shaft);
  scene.add(shaft);
  
  renderer.localClippingEnabled = true;
}

function showScene(sceneName) {
  currentScene = sceneName;
  
  if (sceneName === 'assembly') {
    assemblyParts.forEach(part => part.visible = true);
    cutawayParts.forEach(part => part.visible = false);
  } else if (sceneName === 'cutaway') {
    assemblyParts.forEach(part => part.visible = false);
    cutawayParts.forEach(part => part.visible = true);
  }
  
  hideInfoPanel();
}

function updateExplode(factor) {
  assemblyParts.forEach(part => {
    const offset = part.userData.explodeOffset.clone().multiplyScalar(factor * 3);
    part.position.copy(part.userData.originalPosition).add(offset);
  });
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onPointerMove(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onPointerClick() {
  raycaster.setFromCamera(pointer, camera);
  const visibleParts = currentScene === 'assembly' ? assemblyParts : cutawayParts;
  const intersects = raycaster.intersectObjects(visibleParts);
  
  if (intersects.length > 0) {
    const part = intersects[0].object;
    showInfoPanel(part.userData.name);
    highlightPart(part);
  } else {
    hideInfoPanel();
    clearHighlight();
  }
}

function showInfoPanel(partName) {
  const panel = document.getElementById('info-panel');
  const nameEl = document.getElementById('part-name');
  const descEl = document.getElementById('part-description');
  
  nameEl.textContent = partName;
  descEl.textContent = partInfo[partName] || 'Component information not available.';
  
  panel.classList.remove('hidden');
}

function hideInfoPanel() {
  const panel = document.getElementById('info-panel');
  panel.classList.add('hidden');
}

function highlightPart(part) {
  clearHighlight();
  
  if (part.material.emissive) {
    part.material.emissiveIntensity = 0.4;
    part.userData.highlighted = true;
  }
}

function clearHighlight() {
  const allParts = [...assemblyParts, ...cutawayParts];
  allParts.forEach(part => {
    if (part.userData.highlighted) {
      part.material.emissiveIntensity = 0.1;
      part.userData.highlighted = false;
    }
  });
}

function animate() {
  requestAnimationFrame(animate);
  
  controls.update();
  
  if (currentScene === 'cutaway') {
    cutawayParts.forEach((part, i) => {
      if (part.userData.name && part.userData.name.startsWith('Coil')) {
        part.rotation.y += 0.005;
      }
    });
  }
  
  raycaster.setFromCamera(pointer, camera);
  const visibleParts = currentScene === 'assembly' ? assemblyParts : cutawayParts;
  const intersects = raycaster.intersectObjects(visibleParts);
  
  visibleParts.forEach(part => {
    if (!part.userData.highlighted) {
      part.material.emissiveIntensity = 0.1;
    }
  });
  
  if (intersects.length > 0 && !intersects[0].object.userData.highlighted) {
    intersects[0].object.material.emissiveIntensity = 0.25;
  }
  
  renderer.render(scene, camera);
}
