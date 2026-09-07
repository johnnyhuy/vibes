import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let scene, camera, renderer, controls;
let assemblyParts = [];
let raycaster, pointer;
let gltfLoader;

// Tesla Model 3 2021 Long Range system data
const systemData = {
  'body': { 
    name: 'Body & Structure', 
    color: 0x4a4a4a, 
    desc: 'Steel and aluminum unibody construction with front and rear crumple zones. Structural battery integration.',
    specs: { material: 'Steel/Aluminum', weight: '~280 kg' }
  },
  'glass': { 
    name: 'Glass Roof', 
    color: 0x87ceeb, 
    desc: 'Panoramic glass roof with UV and IR protection. Two-piece construction with rear fixed glass.',
    specs: { type: 'Laminated', UV: '99% blocked' }
  },
  'doors': { 
    name: 'Doors & Closures', 
    color: 0x3a3a3a, 
    desc: 'Four frameless doors, powered frunk and trunk. Integrated door handles.',
    specs: { count: '6 panels', type: 'Frameless' }
  },
  'cabin': { 
    name: 'Cabin Interior', 
    color: 0x2a2a2a, 
    desc: 'Five-seat configuration with vegan leather. 15" horizontal touchscreen. Minimalist dashboard.',
    specs: { seats: '5', screen: '15.4"' }
  },
  'battery': { 
    name: 'High-Voltage Battery', 
    color: 0xdc2626, 
    desc: 'Structural battery pack, ~82 kWh usable capacity. NCA/NMC cells, liquid thermal management.',
    specs: { capacity: '82 kWh', voltage: '350V nominal', cells: '4416' }
  },
  'motors': { 
    name: 'Dual Motor AWD', 
    color: 0x7c3aed, 
    desc: 'Permanent magnet synchronous motors. Front induction, rear permanent magnet. Combined 346 hp.',
    specs: { power: '258 kW', torque: '493 Nm', type: 'Dual Motor' }
  },
  'thermal': { 
    name: 'Thermal System', 
    color: 0x059669, 
    desc: 'Heat pump system (2021+ refresh). Octovalve thermal management. Battery/cabin/motor cooling.',
    specs: { type: 'Heat Pump', coolant: 'Glycol', efficiency: '+30%' }
  },
  'suspension': { 
    name: 'Suspension', 
    color: 0xf59e0b, 
    desc: 'Independent front and rear suspension. Coil springs with adaptive dampers. Low center of gravity.',
    specs: { front: 'Double wishbone', rear: 'Multi-link' }
  },
  'wheels': { 
    name: 'Wheels & Brakes', 
    color: 0x6b7280, 
    desc: '19" Gemini wheels standard. Disc brakes all around with regenerative braking integration.',
    specs: { size: '19"', brakes: 'Ventilated disc' }
  },
  'charging': { 
    name: 'Charging & HV', 
    color: 0xef4444, 
    desc: 'AC onboard charger (11.5 kW), DC fast charging up to 250 kW. CCS Combo port.',
    specs: { AC: '11.5 kW', DC: '250 kW peak' }
  },
  'electronics': { 
    name: 'Computers & 12V', 
    color: 0x3b82f6, 
    desc: 'AMD Ryzen infotainment, FSD Computer (HW3), Gateway, 12V Li-ion auxiliary battery.',
    specs: { MCU: 'AMD Ryzen', FSD: 'HW3.0' }
  },
  'lighting': { 
    name: 'Lighting', 
    color: 0xfbbf24, 
    desc: 'LED headlights, taillights, turn signals. Adaptive front lighting (regional).',
    specs: { type: 'LED', adaptive: 'Yes' }
  }
};

init();
animate();

function init() {
  const container = document.getElementById('canvas-container');
  
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  scene.fog = new THREE.Fog(0x000000, 30, 80);
  
  camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(15, 10, 25);
  
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);
  
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 12;
  controls.maxDistance = 50;
  controls.maxPolarAngle = Math.PI * 0.55;
  controls.target.set(0, 1, 0);
  
  raycaster = new THREE.Raycaster();
  pointer = new THREE.Vector2();
  gltfLoader = new GLTFLoader();
  
  setupLighting();
  createModel3Assembly();
  
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
  
  checkForCustomModel();
}

function setupLighting() {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
  scene.add(ambientLight);
  
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
  keyLight.position.set(12, 18, 12);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 2048;
  keyLight.shadow.mapSize.height = 2048;
  keyLight.shadow.camera.left = -20;
  keyLight.shadow.camera.right = 20;
  keyLight.shadow.camera.top = 20;
  keyLight.shadow.camera.bottom = -20;
  scene.add(keyLight);
  
  const rimLight = new THREE.DirectionalLight(0x3b82f6, 0.9);
  rimLight.position.set(-12, 6, -12);
  scene.add(rimLight);
  
  const fillLight = new THREE.DirectionalLight(0x7c3aed, 0.5);
  fillLight.position.set(0, 4, -18);
  scene.add(fillLight);
  
  const groundGeometry = new THREE.PlaneGeometry(100, 100);
  const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.3 });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -2;
  ground.receiveShadow = true;
  scene.add(ground);
}

function createModel3Assembly() {
  // Model 3 proportions: ~4.7m long, ~1.85m wide, ~1.44m high, ~2.88m wheelbase
  const scale = 0.3; // Scale down for viewport
  
  // Body & Structure (multiple pieces for density)
  createSystemParts('body', [
    { size: [14*scale, 0.4*scale, 5.5*scale], pos: [0, 1*scale, 0], offset: [0, -3, 0] }, // Floor pan
    { size: [0.3*scale, 1.2*scale, 5.5*scale], pos: [-6.5*scale, 1.8*scale, 0], offset: [-2.5, 0, 0] }, // A-pillar left
    { size: [0.3*scale, 1.2*scale, 5.5*scale], pos: [6.5*scale, 1.8*scale, 0], offset: [2.5, 0, 0] }, // A-pillar right
    { size: [0.3*scale, 1*scale, 5.5*scale], pos: [-5*scale, 1.8*scale, 0], offset: [-2, 0, 0] }, // B-pillar left
    { size: [0.3*scale, 1*scale, 5.5*scale], pos: [5*scale, 1.8*scale, 0], offset: [2, 0, 0] }, // B-pillar right
    { size: [14*scale, 0.8*scale, 0.3*scale], pos: [0, 1.4*scale, -2.6*scale], offset: [0, 0, -3] }, // Front bulkhead
    { size: [14*scale, 0.6*scale, 0.3*scale], pos: [0, 1.2*scale, 2.6*scale], offset: [0, 0, 3] }, // Rear bulkhead
  ]);
  
  // Glass Roof & Windows
  createSystemParts('glass', [
    { size: [8*scale, 0.1*scale, 4.8*scale], pos: [0, 2.8*scale, 0], offset: [0, 3, 0] }, // Panoramic glass
    { size: [4*scale, 0.1*scale, 2.2*scale], pos: [2*scale, 2.8*scale, -1.5*scale], offset: [1.5, 2.5, -1] }, // Rear glass
    { size: [6*scale, 1*scale, 0.05*scale], pos: [0, 2*scale, 2.7*scale], offset: [0, 1.5, 2.5] }, // Windshield
  ]);
  
  // Doors & Closures
  createSystemParts('doors', [
    { size: [3*scale, 1.2*scale, 0.15*scale], pos: [-5.8*scale, 1.5*scale, 1.5*scale], offset: [-3, 0, 1.5] }, // Front left door
    { size: [3*scale, 1.2*scale, 0.15*scale], pos: [5.8*scale, 1.5*scale, 1.5*scale], offset: [3, 0, 1.5] }, // Front right door
    { size: [2.5*scale, 1*scale, 0.15*scale], pos: [-5.8*scale, 1.4*scale, -1*scale], offset: [-3, 0, -1] }, // Rear left door
    { size: [2.5*scale, 1*scale, 0.15*scale], pos: [5.8*scale, 1.4*scale, -1*scale], offset: [3, 0, -1] }, // Rear right door
    { size: [5*scale, 0.5*scale, 3*scale], pos: [0, 1.5*scale, 4*scale], offset: [0, 1, 4] }, // Frunk lid
    { size: [6*scale, 0.8*scale, 2*scale], pos: [0, 1.8*scale, -4.5*scale], offset: [0, 1.5, -4] }, // Trunk lid
  ]);
  
  // Cabin Interior
  createSystemParts('cabin', [
    { size: [1.5*scale, 0.8*scale, 1.2*scale], pos: [-3*scale, 1.2*scale, 1.5*scale], offset: [-1.5, 0.5, 0.8] }, // Front left seat
    { size: [1.5*scale, 0.8*scale, 1.2*scale], pos: [3*scale, 1.2*scale, 1.5*scale], offset: [1.5, 0.5, 0.8] }, // Front right seat
    { size: [1.2*scale, 0.7*scale, 1*scale], pos: [-3*scale, 1.1*scale, -0.8*scale], offset: [-1.2, 0.4, -0.5] }, // Rear left seat
    { size: [1.2*scale, 0.7*scale, 1*scale], pos: [0, 1.1*scale, -0.8*scale], offset: [0, 0.4, -0.5] }, // Rear center seat
    { size: [1.2*scale, 0.7*scale, 1*scale], pos: [3*scale, 1.1*scale, -0.8*scale], offset: [1.2, 0.4, -0.5] }, // Rear right seat
    { size: [4*scale, 0.5*scale, 0.8*scale], pos: [0, 1.8*scale, 3*scale], offset: [0, 1.2, 2] }, // Dashboard
    { size: [1.2*scale, 0.9*scale, 0.05*scale], pos: [0.5*scale, 1.9*scale, 2.5*scale], offset: [0.3, 1.5, 1.8] }, // 15" screen
    { size: [1.5*scale, 0.3*scale, 1*scale], pos: [0, 1.3*scale, 0.5*scale], offset: [0, 0.6, 0.3] }, // Center console
  ]);
  
  // High-Voltage Battery Pack
  createSystemParts('battery', [
    { size: [12*scale, 0.6*scale, 5*scale], pos: [0, 0.5*scale, 0], offset: [0, -2.5, 0] }, // Main pack
    { size: [11.5*scale, 0.4*scale, 4.8*scale], pos: [0, 0.9*scale, 0], offset: [0, -2, 0] }, // Module layer 1
    { size: [11*scale, 0.4*scale, 4.6*scale], pos: [0, 1.3*scale, 0], offset: [0, -1.5, 0] }, // Module layer 2
    { size: [0.8*scale, 0.4*scale, 4.5*scale], pos: [-5*scale, 0.7*scale, 0], offset: [-2, -1, 0] }, // Coolant manifold left
    { size: [0.8*scale, 0.4*scale, 4.5*scale], pos: [5*scale, 0.7*scale, 0], offset: [2, -1, 0] }, // Coolant manifold right
  ]);
  
  // Dual Motor AWD
  createSystemParts('motors', [
    { size: [1.2*scale, 1*scale, 1.5*scale], pos: [0, 1*scale, 3.5*scale], offset: [0, 0, 4] }, // Front motor
    { size: [0.8*scale, 0.8*scale, 1*scale], pos: [0, 1*scale, 3*scale], offset: [0, 0, 3.5] }, // Front inverter
    { size: [1.4*scale, 1.2*scale, 1.6*scale], pos: [0, 1*scale, -3.5*scale], offset: [0, 0, -4] }, // Rear motor
    { size: [0.9*scale, 0.9*scale, 1.1*scale], pos: [0, 1*scale, -3*scale], offset: [0, 0, -3.5] }, // Rear inverter
  ]);
  
  // Thermal System
  createSystemParts('thermal', [
    { size: [3*scale, 0.8*scale, 0.8*scale], pos: [0, 1.2*scale, 5*scale], offset: [0, 0.8, 4] }, // Front condenser
    { size: [2*scale, 1.2*scale, 1*scale], pos: [-4*scale, 1.5*scale, 4*scale], offset: [-2.5, 1, 3] }, // Heat pump
    { size: [0.4*scale, 0.4*scale, 8*scale], pos: [-3*scale, 0.8*scale, 0], offset: [-1.5, 0, 0] }, // Coolant line left
    { size: [0.4*scale, 0.4*scale, 8*scale], pos: [3*scale, 0.8*scale, 0], offset: [1.5, 0, 0] }, // Coolant line right
  ]);
  
  // Suspension
  createSystemParts('suspension', [
    { size: [1*scale, 0.4*scale, 0.4*scale], pos: [-3.5*scale, 0.6*scale, 3*scale], offset: [-1.8, -0.5, 2] }, // Front left control arm
    { size: [1*scale, 0.4*scale, 0.4*scale], pos: [3.5*scale, 0.6*scale, 3*scale], offset: [1.8, -0.5, 2] }, // Front right control arm
    { size: [0.3*scale, 1*scale, 0.3*scale], pos: [-3.5*scale, 1*scale, 3*scale], offset: [-1.5, 0, 1.8] }, // Front left spring
    { size: [0.3*scale, 1*scale, 0.3*scale], pos: [3.5*scale, 1*scale, 3*scale], offset: [1.5, 0, 1.8] }, // Front right spring
    { size: [1.2*scale, 0.4*scale, 0.4*scale], pos: [-3.5*scale, 0.6*scale, -3*scale], offset: [-1.8, -0.5, -2] }, // Rear left multi-link
    { size: [1.2*scale, 0.4*scale, 0.4*scale], pos: [3.5*scale, 0.6*scale, -3*scale], offset: [1.8, -0.5, -2] }, // Rear right multi-link
    { size: [0.3*scale, 0.9*scale, 0.3*scale], pos: [-3.5*scale, 0.9*scale, -3*scale], offset: [-1.5, 0, -1.8] }, // Rear left spring
    { size: [0.3*scale, 0.9*scale, 0.3*scale], pos: [3.5*scale, 0.9*scale, -3*scale], offset: [1.5, 0, -1.8] }, // Rear right spring
  ]);
  
  // Wheels & Brakes
  createSystemParts('wheels', [
    { size: [0.8*scale, 1.9*scale, 1.9*scale], pos: [-5.5*scale, 0.6*scale, 3*scale], offset: [-3, 0, 2] }, // Front left wheel
    { size: [0.8*scale, 1.9*scale, 1.9*scale], pos: [5.5*scale, 0.6*scale, 3*scale], offset: [3, 0, 2] }, // Front right wheel
    { size: [0.8*scale, 1.9*scale, 1.9*scale], pos: [-5.5*scale, 0.6*scale, -3*scale], offset: [-3, 0, -2] }, // Rear left wheel
    { size: [0.8*scale, 1.9*scale, 1.9*scale], pos: [5.5*scale, 0.6*scale, -3*scale], offset: [3, 0, -2] }, // Rear right wheel
    { size: [0.15*scale, 0.8*scale, 0.8*scale], pos: [-5*scale, 0.6*scale, 3*scale], offset: [-2.5, 0, 1.8] }, // Front left brake
    { size: [0.15*scale, 0.8*scale, 0.8*scale], pos: [5*scale, 0.6*scale, 3*scale], offset: [2.5, 0, 1.8] }, // Front right brake
    { size: [0.15*scale, 0.7*scale, 0.7*scale], pos: [-5*scale, 0.6*scale, -3*scale], offset: [-2.5, 0, -1.8] }, // Rear left brake
    { size: [0.15*scale, 0.7*scale, 0.7*scale], pos: [5*scale, 0.6*scale, -3*scale], offset: [2.5, 0, -1.8] }, // Rear right brake
  ]);
  
  // Charging & HV
  createSystemParts('charging', [
    { size: [0.5*scale, 0.6*scale, 0.3*scale], pos: [-5*scale, 1.2*scale, -3.5*scale], offset: [-2.5, 0.5, -2] }, // Charge port
    { size: [1.5*scale, 0.8*scale, 1*scale], pos: [-4*scale, 1.2*scale, 1*scale], offset: [-2, 0.5, 0.5] }, // Onboard charger
    { size: [0.3*scale, 0.3*scale, 6*scale], pos: [-2*scale, 1.2*scale, 1*scale], offset: [-1, 0.5, 0] }, // HV cable harness
    { size: [0.8*scale, 0.6*scale, 0.8*scale], pos: [3*scale, 1.1*scale, 2*scale], offset: [1.5, 0.4, 1] }, // DC-DC converter
  ]);
  
  // Electronics & Computers
  createSystemParts('electronics', [
    { size: [0.8*scale, 0.3*scale, 1*scale], pos: [0, 1.6*scale, 2*scale], offset: [0, 1, 1.5] }, // MCU (AMD Ryzen)
    { size: [0.7*scale, 0.3*scale, 0.9*scale], pos: [-1*scale, 1.6*scale, 2*scale], offset: [-0.5, 1, 1.4] }, // FSD Computer HW3
    { size: [0.5*scale, 0.2*scale, 0.6*scale], pos: [1*scale, 1.6*scale, 2*scale], offset: [0.5, 0.9, 1.3] }, // Gateway
    { size: [0.6*scale, 0.3*scale, 0.4*scale], pos: [4*scale, 1.3*scale, 2.5*scale], offset: [2, 0.6, 1.5] }, // 12V Li-ion battery
  ]);
  
  // Exterior Lighting
  createSystemParts('lighting', [
    { size: [1.2*scale, 0.4*scale, 0.3*scale], pos: [-2.5*scale, 1.4*scale, 5.5*scale], offset: [-1.5, 0.8, 4] }, // Front left LED
    { size: [1.2*scale, 0.4*scale, 0.3*scale], pos: [2.5*scale, 1.4*scale, 5.5*scale], offset: [1.5, 0.8, 4] }, // Front right LED
    { size: [1.5*scale, 0.5*scale, 0.2*scale], pos: [-3*scale, 1.4*scale, -5.2*scale], offset: [-1.8, 0.8, -4] }, // Rear left LED
    { size: [1.5*scale, 0.5*scale, 0.2*scale], pos: [3*scale, 1.4*scale, -5.2*scale], offset: [1.8, 0.8, -4] }, // Rear right LED
  ]);
}

function createSystemParts(systemId, parts) {
  const data = systemData[systemId];
  
  parts.forEach((part, i) => {
    const geometry = new THREE.BoxGeometry(...part.size);
    const material = new THREE.MeshStandardMaterial({
      color: data.color,
      metalness: 0.7,
      roughness: 0.3,
      emissive: data.color,
      emissiveIntensity: 0.1
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...part.pos);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = {
      system: systemId,
      originalPosition: new THREE.Vector3(...part.pos),
      explodeOffset: new THREE.Vector3(...part.offset),
      data: data,
      partIndex: i
    };
    
    const edges = new THREE.EdgesGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: 0x000000, 
      transparent: true, 
      opacity: 0.25 
    });
    const wireframe = new THREE.LineSegments(edges, lineMaterial);
    mesh.add(wireframe);
    
    assemblyParts.push(mesh);
    scene.add(mesh);
  });
}

function checkForCustomModel() {
  const params = new URLSearchParams(window.location.search);
  const modelUrl = params.get('model');
  
  if (modelUrl) {
    loadCustomGLB(modelUrl);
  }
}

function loadCustomGLB(url) {
  gltfLoader.load(
    url,
    (gltf) => {
      console.log('Custom Model 3 GLB loaded');
      // Clear procedural parts
      assemblyParts.forEach(part => scene.remove(part));
      assemblyParts = [];
      
      // Add custom model
      const model = gltf.scene;
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          // Try to map mesh names to systems
          const systemId = detectSystemFromName(child.name);
          if (systemId) {
            child.userData = {
              system: systemId,
              originalPosition: child.position.clone(),
              explodeOffset: child.position.clone().multiplyScalar(0.3),
              data: systemData[systemId]
            };
            assemblyParts.push(child);
          }
        }
      });
      scene.add(model);
    },
    undefined,
    (error) => {
      console.error('Error loading custom GLB:', error);
    }
  );
}

function detectSystemFromName(name) {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('battery') || lowerName.includes('pack')) return 'battery';
  if (lowerName.includes('motor') || lowerName.includes('drive')) return 'motors';
  if (lowerName.includes('wheel') || lowerName.includes('brake')) return 'wheels';
  if (lowerName.includes('door')) return 'doors';
  if (lowerName.includes('glass') || lowerName.includes('roof')) return 'glass';
  if (lowerName.includes('seat') || lowerName.includes('cabin')) return 'cabin';
  if (lowerName.includes('body') || lowerName.includes('chassis')) return 'body';
  if (lowerName.includes('suspension') || lowerName.includes('spring')) return 'suspension';
  if (lowerName.includes('light') || lowerName.includes('lamp')) return 'lighting';
  if (lowerName.includes('charge') || lowerName.includes('hv')) return 'charging';
  if (lowerName.includes('computer') || lowerName.includes('mcu')) return 'electronics';
  if (lowerName.includes('thermal') || lowerName.includes('cooling')) return 'thermal';
  return 'body'; // Default
}

function updateExplode(factor) {
  assemblyParts.forEach(part => {
    const offset = part.userData.explodeOffset.clone().multiplyScalar(factor * 2.5);
    part.position.copy(part.userData.originalPosition).add(offset);
  });
}

function highlightSystem(systemId) {
  assemblyParts.forEach(part => {
    if (part.userData.system === systemId) {
      part.material.emissiveIntensity = 0.45;
      part.visible = true;
    } else {
      part.material.emissiveIntensity = 0.05;
      part.visible = true; // Show all for now, or set to false to isolate
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
