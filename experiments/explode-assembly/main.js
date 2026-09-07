import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, controls;
let assemblyParts = [];
let raycaster, pointer;

const partData = {
  'chassis': { name: 'Chassis Frame', color: 0x2563eb, desc: 'Structural backbone providing rigidity and mounting points', specs: { material: 'Aluminum Alloy', weight: '45 kg' } },
  'drive': { name: 'Drive Unit', color: 0x7c3aed, desc: 'Integrated motor and transmission assembly', specs: { power: '350 kW', torque: '500 Nm' } },
  'power': { name: 'Battery Pack', color: 0xdc2626, desc: 'High-capacity lithium-ion battery module', specs: { capacity: '75 kWh', voltage: '400V' } },
  'cooling': { name: 'Thermal System', color: 0x059669, desc: 'Active liquid cooling with heat exchanger', specs: { capacity: '12 kW', coolant: 'Glycol' } },
  'electronics': { name: 'Control Unit', color: 0xf59e0b, desc: 'Central processing and power distribution', specs: { processor: 'Custom SoC', memory: '16 GB' } },
  'exterior': { name: 'Body Panels', color: 0x06b6d4, desc: 'Aerodynamic composite exterior shell', specs: { material: 'Carbon Fiber', Cd: '0.24' } }
};

init();
animate();

function init() {
  const container = document.getElementById('canvas-container');
  
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  scene.fog = new THREE.Fog(0x000000, 20, 50);
  
  camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(12, 8, 20);
  
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);
  
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 10;
  controls.maxDistance = 40;
  controls.maxPolarAngle = Math.PI * 0.55;
  
  raycaster = new THREE.Raycaster();
  pointer = new THREE.Vector2();
  
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);
  
  const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
  mainLight.position.set(10, 15, 10);
  mainLight.castShadow = true;
  scene.add(mainLight);
  
  const rimLight = new THREE.DirectionalLight(0x3b82f6, 0.8);
  rimLight.position.set(-10, 5, -10);
  scene.add(rimLight);
  
  const fillLight = new THREE.DirectionalLight(0x7c3aed, 0.4);
  fillLight.position.set(0, 3, -15);
  scene.add(fillLight);
  
  createAssembly();
  
  const explodeSlider = document.getElementById('explode-slider');
  explodeSlider.addEventListener('input', (e) => {
    updateExplode(e.target.value / 100);
  });
  
  const systemItems = document.querySelectorAll('.system-item');
  systemItems.forEach(item => {
    item.addEventListener('click', () => {
      systemItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      const system = item.dataset.system;
      highlightSystem(system);
    });
  });
  
  window.addEventListener('resize', onWindowResize);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('click', onPointerClick);
}

function createAssembly() {
  const systems = [
    { id: 'chassis', size: [8, 0.4, 4], pos: [0, 0, 0], offset: [0, -3, 0] },
    { id: 'chassis', size: [0.4, 2, 4], pos: [-3, 1, 0], offset: [-2, 0, 0] },
    { id: 'chassis', size: [0.4, 2, 4], pos: [3, 1, 0], offset: [2, 0, 0] },
    
    { id: 'drive', size: [2, 1.5, 2.5], pos: [0, 1, -0.5], offset: [0, 0, -4] },
    { id: 'drive', size: [1.5, 0.8, 1.5], pos: [0, 0.5, 2], offset: [0, 0, 3] },
    
    { id: 'power', size: [6, 1, 3], pos: [0, 0.8, 0], offset: [0, 3, 0] },
    { id: 'power', size: [5.5, 0.3, 2.8], pos: [0, 1.5, 0], offset: [0, 2.5, 0] },
    
    { id: 'cooling', size: [4, 0.8, 0.8], pos: [0, 2, 2.5], offset: [0, 2, 2] },
    { id: 'cooling', size: [0.5, 0.5, 3], pos: [-2, 1.5, 0], offset: [-1.5, 1, 0] },
    { id: 'cooling', size: [0.5, 0.5, 3], pos: [2, 1.5, 0], offset: [1.5, 1, 0] },
    
    { id: 'electronics', size: [2, 0.6, 1.5], pos: [0, 2.5, -1], offset: [0, 2, -2] },
    { id: 'electronics', size: [1.5, 0.4, 1], pos: [-2.5, 2, 0], offset: [-2, 1.5, 0] },
    
    { id: 'exterior', size: [8.5, 0.2, 4.5], pos: [0, 3, 0], offset: [0, 4, 0] },
    { id: 'exterior', size: [8.5, 2, 0.2], pos: [0, 2, 2.5], offset: [0, 0, 3] },
    { id: 'exterior', size: [8.5, 2, 0.2], pos: [0, 2, -2.5], offset: [0, 0, -3] }
  ];
  
  systems.forEach(sys => {
    const data = partData[sys.id];
    const geometry = new THREE.BoxGeometry(...sys.size);
    const material = new THREE.MeshStandardMaterial({
      color: data.color,
      metalness: 0.7,
      roughness: 0.3,
      emissive: data.color,
      emissiveIntensity: 0.1
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...sys.pos);
    mesh.castShadow = true;
    mesh.userData = {
      system: sys.id,
      originalPosition: new THREE.Vector3(...sys.pos),
      explodeOffset: new THREE.Vector3(...sys.offset),
      data: data
    };
    
    const edges = new THREE.EdgesGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: 0x000000, 
      transparent: true, 
      opacity: 0.3 
    });
    const wireframe = new THREE.LineSegments(edges, lineMaterial);
    mesh.add(wireframe);
    
    assemblyParts.push(mesh);
    scene.add(mesh);
  });
}

function updateExplode(factor) {
  assemblyParts.forEach(part => {
    const offset = part.userData.explodeOffset.clone().multiplyScalar(factor);
    part.position.copy(part.userData.originalPosition).add(offset);
  });
}

function highlightSystem(systemId) {
  assemblyParts.forEach(part => {
    if (part.userData.system === systemId) {
      part.material.emissiveIntensity = 0.4;
    } else {
      part.material.emissiveIntensity = 0.1;
    }
  });
}

function onPointerMove(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onPointerClick() {
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(assemblyParts);
  
  if (intersects.length > 0) {
    const part = intersects[0].object;
    showDetailCard(part.userData.data, part.userData.system);
  } else {
    hideDetailCard();
  }
}

function showDetailCard(data, systemId) {
  const card = document.getElementById('detail-card');
  const title = document.getElementById('card-title');
  const desc = document.getElementById('card-description');
  const specs = document.getElementById('card-specs');
  
  title.textContent = data.name;
  desc.textContent = data.desc;
  
  specs.innerHTML = Object.entries(data.specs)
    .map(([key, value]) => `
      <div class="spec-item">
        <span class="spec-label">${key}</span>
        <span class="spec-value">${value}</span>
      </div>
    `).join('');
  
  card.classList.remove('hidden');
}

function hideDetailCard() {
  document.getElementById('detail-card').classList.add('hidden');
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
