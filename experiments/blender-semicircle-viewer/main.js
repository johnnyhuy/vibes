import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { collectMeshCorners, computeHorseshoePose } from './framing.js';
import { polishLaptopMaterials, prepareLaptopTemplate } from './laptopFit.js';

const LAPTOP_COUNT = 51;
const SEMICIRCLE_RADIUS = 14.0;
const ARC_ANGLE = 180.0;
const LAPTOP_WIDTH = 0.72;
const MODEL_URL = '/models/classic-laptop.glb';
const HDRI_URL = '/hdri/studio.hdr';

class MeshLoadError extends Error {
  constructor(cause) {
    super('Classic Laptop GLB or studio HDRI failed to load');
    this.name = 'MeshLoadError';
    this.cause = cause;
  }
}

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
scene.fog = new THREE.Fog(0x000000, 80, 160);

const CAMERA_FOV = 40;
const camera = new THREE.PerspectiveCamera(
  CAMERA_FOV,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.getElementById('canvas-container').appendChild(renderer.domElement);

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

let liftY = 0.14;

function frameCameraToArc(root) {
  const points = collectMeshCorners(root);
  const pose = computeHorseshoePose({
    points,
    vFov: THREE.MathUtils.degToRad(camera.fov),
    aspect: camera.aspect,
    liftY,
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

function setupLighting() {
  const hemi = new THREE.HemisphereLight(0xdce6f2, 0x111318, 0.28);
  scene.add(hemi);

  const ambient = new THREE.AmbientLight(0xffffff, 0.16);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xfff7ee, 1.55);
  keyLight.position.set(10, 24, 28);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 2048;
  keyLight.shadow.mapSize.height = 2048;
  keyLight.shadow.camera.left = -24;
  keyLight.shadow.camera.right = 24;
  keyLight.shadow.camera.top = 24;
  keyLight.shadow.camera.bottom = -24;
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x88aaff, 0.45);
  fillLight.position.set(-20, 16, 10);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xffffee, 0.7);
  rimLight.position.set(6, 14, -22);
  scene.add(rimLight);
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

function createSemicircleArray(template) {
  const root = new THREE.Group();
  root.name = 'SemicircleArc';
  const laptops = [];
  const angleStep = (ARC_ANGLE * Math.PI / 180) / (LAPTOP_COUNT - 1);
  const startAngle = -(ARC_ANGLE * Math.PI / 180) / 2;

  for (let i = 0; i < LAPTOP_COUNT; i += 1) {
    const laptop = template.clone(true);
    polishLaptopMaterials(laptop, i);
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

async function loadStudioRig() {
  try {
    const pmrem = new THREE.PMREMGenerator(renderer);
    const hdr = await new RGBELoader().loadAsync(HDRI_URL);
    scene.environment = pmrem.fromEquirectangular(hdr).texture;
    hdr.dispose();
    pmrem.dispose();

    const gltf = await new GLTFLoader().loadAsync(MODEL_URL);
    return gltf.scene;
  } catch (cause) {
    throw new MeshLoadError(cause);
  }
}

function setStatus(text) {
  const info = document.getElementById('info');
  if (info) info.textContent = text;
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
animate();
setStatus('Loading Classic Laptop…');

loadStudioRig()
  .then((sceneGraph) => {
    const { template, height } = prepareLaptopTemplate(sceneGraph, LAPTOP_WIDTH);
    liftY = height * 0.28;
    const { root, laptops } = createSemicircleArray(template);
    arcRoot = root;
    frameCameraToArc(arcRoot);
    setStatus('Drag to orbit · scroll to zoom · Classic Laptop · studio HDRI');
    console.log(`Loaded ${laptops.length} Classic Laptop clones in an XZ semicircle`);
  })
  .catch((error) => {
    console.error(error);
    setStatus('Mesh failed to load. Check the GLB path.');
  });
