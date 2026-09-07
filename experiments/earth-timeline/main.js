import * as THREE from 'three';

let scene, camera, renderer;
let earth, clouds, atmosphere;
let isPlaying = false;
let animationId;

const timeline = [
  { time: 0, era: 'Formation', date: '4.5 Ga', desc: 'Violent accretion of planetesimals forms proto-Earth. Molten surface, no atmosphere.', color: 0x8b4513 },
  { time: 20, era: 'Hadean Eon', date: '4.0 Ga', desc: 'Heavy bombardment continues. Moon forms from giant impact. Primitive crust begins to solidify.', color: 0xa0522d },
  { time: 35, era: 'First Oceans', date: '3.8 Ga', desc: 'Surface cools enough for liquid water. First oceans form. Primitive atmosphere of CO₂ and nitrogen.', color: 0x4169e1 },
  { time: 50, era: 'Life Emerges', date: '3.5 Ga', desc: 'First single-celled organisms appear. Stromatolites form in shallow seas. Photosynthesis begins.', color: 0x228b22 },
  { time: 65, era: 'Great Oxidation', date: '2.4 Ga', desc: 'Cyanobacteria produce oxygen. Atmosphere transforms. Snowball Earth glaciations.', color: 0x87ceeb },
  { time: 80, era: 'Complex Life', date: '600 Ma', desc: 'Ediacaran fauna evolve. Cambrian explosion brings diversity. Plants colonize land.', color: 0x32cd32 },
  { time: 90, era: 'Age of Dinosaurs', date: '200 Ma', desc: 'Mesozoic Era. Pangaea breaks apart. Dinosaurs dominate. Flowering plants appear.', color: 0x90ee90 },
  { time: 98, era: 'Human Evolution', date: '2 Ma', desc: 'Quaternary Period. Ice ages cycle. Homo genus evolves. Agriculture and civilization.', color: 0x00ff00 },
  { time: 100, era: 'Present Day', date: 'Now', desc: 'Modern Earth. Complex ecosystems. Human technological civilization. Anthropocene epoch.', color: 0x3b82f6 }
];

init();
animate();

function init() {
  const container = document.getElementById('canvas-container');
  
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 3;
  
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);
  
  createEarth();
  createStars();
  
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);
  
  const sunLight = new THREE.DirectionalLight(0xffffff, 2);
  sunLight.position.set(5, 3, 5);
  scene.add(sunLight);
  
  const slider = document.getElementById('timeline-slider');
  slider.addEventListener('input', (e) => {
    updateTimeline(parseInt(e.target.value));
  });
  
  const playBtn = document.getElementById('play-btn');
  playBtn.addEventListener('click', togglePlay);
  
  window.addEventListener('resize', onWindowResize);
  
  updateTimeline(100);
}

function createEarth() {
  const geometry = new THREE.SphereGeometry(1, 64, 64);
  
  const earthMaterial = new THREE.MeshPhongMaterial({
    map: generateEarthTexture(),
    bumpScale: 0.05,
    shininess: 10
  });
  
  earth = new THREE.Mesh(geometry, earthMaterial);
  scene.add(earth);
  
  const cloudGeometry = new THREE.SphereGeometry(1.01, 32, 32);
  const cloudMaterial = new THREE.MeshPhongMaterial({
    map: generateCloudTexture(),
    transparent: true,
    opacity: 0.4
  });
  
  clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
  scene.add(clouds);
  
  const atmosGeometry = new THREE.SphereGeometry(1.15, 32, 32);
  const atmosMaterial = new THREE.MeshBasicMaterial({
    color: 0x3b82f6,
    transparent: true,
    opacity: 0.1,
    side: THREE.BackSide
  });
  
  atmosphere = new THREE.Mesh(atmosGeometry, atmosMaterial);
  scene.add(atmosphere);
}

function generateEarthTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#1a5490';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  for (let i = 0; i < 200; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? '#2d5a2d' : '#8b7355';
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const w = 20 + Math.random() * 100;
    const h = 20 + Math.random() * 60;
    ctx.fillRect(x, y, w, h);
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

function generateCloudTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = 'transparent';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  for (let i = 0; i < 150; i++) {
    ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.random() * 0.3})`;
    ctx.beginPath();
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const r = 10 + Math.random() * 30;
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

function createStars() {
  const starsGeometry = new THREE.BufferGeometry();
  const starPositions = [];
  
  for (let i = 0; i < 2000; i++) {
    const x = (Math.random() - 0.5) * 100;
    const y = (Math.random() - 0.5) * 100;
    const z = (Math.random() - 0.5) * 100;
    starPositions.push(x, y, z);
  }
  
  starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
  
  const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.1,
    transparent: true,
    opacity: 0.8
  });
  
  const stars = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(stars);
}

function updateTimeline(value) {
  const eraIndex = timeline.findIndex((e, i) => {
    const next = timeline[i + 1];
    return value >= e.time && (!next || value < next.time);
  }) || 0;
  
  const era = timeline[eraIndex];
  
  document.getElementById('era-title').textContent = era.era;
  document.getElementById('era-time').textContent = era.date;
  document.getElementById('info-text').textContent = era.desc;
  
  earth.material.color.setHex(era.color);
  clouds.material.opacity = value > 35 ? 0.4 : 0;
  atmosphere.material.opacity = value > 50 ? 0.1 : 0;
}

function togglePlay() {
  isPlaying = !isPlaying;
  const btn = document.getElementById('play-btn');
  const slider = document.getElementById('timeline-slider');
  
  if (isPlaying) {
    btn.textContent = '⏸ Pause';
    playTimeline(slider);
  } else {
    btn.textContent = '▶ Play the story';
    if (animationId) clearInterval(animationId);
  }
}

function playTimeline(slider) {
  let value = parseInt(slider.value);
  
  animationId = setInterval(() => {
    value += 1;
    if (value > 100) {
      value = 0;
    }
    slider.value = value;
    updateTimeline(value);
  }, 100);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  
  earth.rotation.y += 0.001;
  clouds.rotation.y += 0.0012;
  
  renderer.render(scene, camera);
}
