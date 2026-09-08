import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as THREE from 'three';
import {
  collectMeshCorners,
  computeHorseshoePose,
  directionFromOrbit,
  HERO_ELEVATION,
  projectPointNdc,
} from './framing.js';

const RADIUS = 14;
const COUNT = 51;
const ARC = Math.PI;
const NDC_LIMIT = 0.88;

function buildHorseshoe() {
  const root = new THREE.Group();
  const step = ARC / (COUNT - 1);
  const start = -ARC / 2;
  for (let i = 0; i < COUNT; i += 1) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.83, 0.58));
    const angle = start + i * step;
    mesh.position.set(RADIUS * Math.sin(angle), 0.4, -RADIUS * Math.cos(angle));
    mesh.rotation.y = -angle;
    root.add(mesh);
  }
  return root;
}

function cameraFromPose(pose, aspect, fovDeg = 40) {
  const camera = new THREE.PerspectiveCamera(fovDeg, aspect, 0.1, 2000);
  camera.position.copy(pose.position);
  camera.lookAt(pose.target);
  camera.updateMatrixWorld(true);
  camera.updateProjectionMatrix();
  return camera;
}

function ndcExtents(points, camera) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  const ndc = new THREE.Vector3();
  for (const point of points) {
    projectPointNdc(point, camera, ndc);
    minX = Math.min(minX, ndc.x);
    maxX = Math.max(maxX, ndc.x);
    minY = Math.min(minY, ndc.y);
    maxY = Math.max(maxY, ndc.y);
  }
  return { minX, maxX, minY, maxY };
}

function poseFor(points, aspect) {
  return computeHorseshoePose({
    points,
    vFov: THREE.MathUtils.degToRad(40),
    aspect,
    liftY: 0.22,
    fallbackRadius: RADIUS,
  });
}

test('default 16:9 load keeps the full horseshoe inside the viewport with margin', () => {
  const root = buildHorseshoe();
  const points = collectMeshCorners(root);
  const pose = poseFor(points, 16 / 9);
  const camera = cameraFromPose(pose, 16 / 9);
  const ext = ndcExtents(points, camera);

  assert.ok(points.length >= COUNT * 8, 'every laptop contributes corners');
  assert.ok(pose.distance > 34, `camera too close: ${pose.distance}`);
  assert.ok(ext.minX > -NDC_LIMIT && ext.maxX < NDC_LIMIT, `x ${ext.minX}..${ext.maxX}`);
  assert.ok(ext.minY > -NDC_LIMIT && ext.maxY < NDC_LIMIT, `y ${ext.minY}..${ext.maxY}`);
  assert.ok(ext.maxX - ext.minX > 0.55, 'horseshoe should still read as wide');
});

test('camera sits outside the bowl, not on the open diameter', () => {
  const root = buildHorseshoe();
  const points = collectMeshCorners(root);
  const pose = poseFor(points, 16 / 9);
  const radial = Math.hypot(pose.position.x, pose.position.z);
  assert.ok(radial > RADIUS * 0.85, `camera xz ${radial} is inside the arc`);
  assert.ok(pose.position.z > 0, 'hero view must come from the open +Z side');
  assert.ok(pose.position.y > 12, 'needs an elevated front seat');
});

test('portrait resize still frames every laptop', () => {
  const root = buildHorseshoe();
  const points = collectMeshCorners(root);
  const pose = poseFor(points, 9 / 16);
  const ext = ndcExtents(points, cameraFromPose(pose, 9 / 16));
  assert.ok(ext.minX > -NDC_LIMIT && ext.maxX < NDC_LIMIT, `x ${ext.minX}..${ext.maxX}`);
  assert.ok(ext.minY > -NDC_LIMIT && ext.maxY < NDC_LIMIT, `y ${ext.minY}..${ext.maxY}`);
});

test('the default distance still covers a full auto-rotate orbit', () => {
  const root = buildHorseshoe();
  const points = collectMeshCorners(root);
  const pose = poseFor(points, 16 / 9);

  for (let i = 0; i < 8; i += 1) {
    const az = (i / 8) * Math.PI * 2;
    const dir = directionFromOrbit(az, HERO_ELEVATION);
    const camera = new THREE.PerspectiveCamera(40, 16 / 9, 0.1, 2000);
    camera.position.copy(pose.target).addScaledVector(dir, pose.distance);
    camera.lookAt(pose.target);
    camera.updateMatrixWorld(true);
    camera.updateProjectionMatrix();
    const ext = ndcExtents(points, camera);
    assert.ok(
      ext.minX > -NDC_LIMIT && ext.maxX < NDC_LIMIT && ext.minY > -NDC_LIMIT && ext.maxY < NDC_LIMIT,
      `azimuth ${az.toFixed(2)} clipped ${JSON.stringify(ext)}`
    );
  }
});

test('empty points still back the camera out of the bowl', () => {
  const pose = computeHorseshoePose({
    points: [],
    vFov: THREE.MathUtils.degToRad(40),
    aspect: 16 / 9,
    liftY: 0.22,
    fallbackRadius: RADIUS,
  });
  assert.ok(pose.distance > 30);
  assert.ok(pose.position.z > 0);
});
