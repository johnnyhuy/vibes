import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, controls;
let engineParts = [];
let crankRotation = 0;
let engineSpeed = 3;

init();
animate();

function init() {
  const container = document.getElementById('canvas-container');
  
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(8, 5, 12);
  
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);
  
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);
  
  const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
  mainLight.position.set(10, 10, 10);
  scene.add(mainLight);
  
  const redLight = new THREE.PointLight(0xef4444, 0.8, 20);
  redLight.position.set(-5, 3, 5);
  scene.add(redLight);
  
  createEngine();
  
  document.getElementById('speed-slider').addEventListener('input', (e) => {
    engineSpeed = parseInt(e.target.value);
  });
  
  window.addEventListener('resize', onWindowResize);
}

function createEngine() {
  const blockGeometry = new THREE.BoxGeometry(10, 4, 3);
  const blockMaterial = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    metalness: 0.6,
    roughness: 0.4
  });
  
  const block = new THREE.Mesh(blockGeometry, blockMaterial);
  block.position.y = 0;
  scene.add(block);
  
  const crankGeometry = new THREE.CylinderGeometry(0.3, 0.3, 9, 16);
  const crankMaterial = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    metalness: 0.9,
    roughness: 0.2
  });
  
  const crankshaft = new THREE.Mesh(crankGeometry, crankMaterial);
  crankshaft.rotation.z = Math.PI / 2;
  crankshaft.position.y = -1;
  scene.add(crankshaft);
  engineParts.push({ mesh: crankshaft, type: 'crankshaft' });
  
  for (let i = 0; i < 8; i++) {
    const x = -4.5 + i * 1.3;
    const phase = i * (Math.PI / 4);
    
    const pistonGeometry = new THREE.CylinderGeometry(0.4, 0.4, 1.5, 16);
    const pistonMaterial = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      metalness: 0.7,
      roughness: 0.3
    });
    
    const piston = new THREE.Mesh(pistonGeometry, pistonMaterial);
    piston.position.set(x, 0, 0);
    scene.add(piston);
    
    engineParts.push({ 
      mesh: piston, 
      type: 'piston', 
      baseY: 0, 
      phase: phase 
    });
    
    const valveGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.8, 8);
    const valveMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      metalness: 0.8,
      roughness: 0.3
    });
    
    const valve1 = new THREE.Mesh(valveGeometry, valveMaterial);
    valve1.position.set(x - 0.3, 2.5, 0);
    scene.add(valve1);
    
    const valve2 = new THREE.Mesh(valveGeometry, valveMaterial);
    valve2.position.set(x + 0.3, 2.5, 0);
    scene.add(valve2);
    
    engineParts.push({ mesh: valve1, type: 'valve', phase: phase });
    engineParts.push({ mesh: valve2, type: 'valve', phase: phase + Math.PI });
  }
}

function updateEngine() {
  crankRotation += 0.02 * engineSpeed;
  
  const rpm = Math.floor(engineSpeed * 200 + 300);
  document.getElementById('rpm-value').textContent = rpm;
  
  const cycle = Math.floor((crankRotation / (Math.PI * 2)) % 4);
  const cycles = ['INTAKE', 'COMPRESSION', 'POWER', 'EXHAUST'];
  document.getElementById('stroke-indicator').textContent = cycles[cycle];
  
  const pressure = (1.5 + Math.sin(crankRotation) * 0.5).toFixed(1);
  document.getElementById('cylinder-pressure').textContent = pressure;
  
  engineParts.forEach(part => {
    if (part.type === 'crankshaft') {
      part.mesh.rotation.x = crankRotation;
    } else if (part.type === 'piston') {
      const offset = Math.sin(crankRotation + part.phase) * 0.8;
      part.mesh.position.y = part.baseY + offset;
    } else if (part.type === 'valve') {
      const valveOffset = Math.max(0, Math.sin(crankRotation + part.phase)) * 0.3;
      part.mesh.position.y = 2.5 + valveOffset;
    }
  });
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  
  updateEngine();
  controls.update();
  renderer.render(scene, camera);
}
