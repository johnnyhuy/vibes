import * as THREE from 'three';

/** Extra space around the horseshoe after the frustum fit. */
export const FRAME_MARGIN = 1.36;

/** Elevation from the XZ plane. High enough that the bowl reads, not a foreshortened wire. */
export const HERO_ELEVATION = THREE.MathUtils.degToRad(52);

/** Azimuth 0 looks from +Z toward −Z — open diameter facing the camera. */
export const HERO_AZIMUTH = 0;

/** Sample a full orbit so auto-rotate cannot clip a side of the arc. */
export const ORBIT_AZIMUTH_SAMPLES = 12;

/**
 * Fraction of a bounding-sphere fit used as a floor.
 * Stops an empty/tiny AABB seating the camera inside the bowl.
 */
export const SPHERE_FLOOR = 0.64;

const WORLD_UP = new THREE.Vector3(0, 1, 0);
const _offset = new THREE.Vector3();
const _xAxis = new THREE.Vector3();
const _yAxis = new THREE.Vector3();
const _zAxis = new THREE.Vector3();
const _boxScratch = [];

export function collectBoxCorners(box, target = []) {
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

export function collectMeshCorners(root) {
  const corners = [];
  root.updateWorldMatrix(true, true);
  root.traverse((obj) => {
    if (!obj.isMesh || !obj.geometry) return;
    const box = new THREE.Box3().setFromObject(obj);
    if (box.isEmpty()) return;
    collectBoxCorners(box, _boxScratch);
    for (let i = 0; i < 8; i += 1) {
      corners.push(_boxScratch[i].clone());
    }
  });
  return corners;
}

/** Camera sits at target + direction. Elevation 0 is the horizon; azimuth 0 is +Z. */
export function directionFromOrbit(azimuth, elevation) {
  const ce = Math.cos(elevation);
  return new THREE.Vector3(
    Math.sin(azimuth) * ce,
    Math.sin(elevation),
    Math.cos(azimuth) * ce
  ).normalize();
}

/**
 * Distance so every point sits inside the frustum when the camera
 * looks at `center` along `direction` (target → camera).
 */
export function distanceToFitPoints(center, points, direction, vFov, hFov, margin = 1) {
  _zAxis.copy(direction).normalize();
  _xAxis.crossVectors(WORLD_UP, _zAxis);
  if (_xAxis.lengthSq() < 1e-8) {
    _xAxis.set(1, 0, 0);
  } else {
    _xAxis.normalize();
  }
  _yAxis.crossVectors(_zAxis, _xAxis).normalize();

  const tanH = Math.max(Math.tan(hFov * 0.5), 1e-4);
  const tanV = Math.max(Math.tan(vFov * 0.5), 1e-4);
  let needed = 1;

  for (let i = 0; i < points.length; i += 1) {
    _offset.copy(points[i]).sub(center);
    const along = _offset.dot(_zAxis);
    const x = _offset.dot(_xAxis);
    const y = _offset.dot(_yAxis);
    needed = Math.max(needed, along + Math.abs(x) / tanH, along + Math.abs(y) / tanV);
  }

  return needed * margin;
}

function horizontalFov(vFov, aspect) {
  return 2 * Math.atan(Math.tan(vFov * 0.5) * aspect);
}

/**
 * Above-front pose that keeps the full XZ horseshoe in view at every
 * auto-rotate azimuth, with margin. Fits from the look target (not a
 * different AABB centre), then floors against a sphere so a wide/flat
 * AABB cannot under-distance the camera into the bowl.
 */
export function computeHorseshoePose({
  points,
  vFov,
  aspect,
  liftY = 0,
  fallbackRadius = 14,
  margin = FRAME_MARGIN,
  elevation = HERO_ELEVATION,
  azimuth = HERO_AZIMUTH,
  samples = ORBIT_AZIMUTH_SAMPLES,
}) {
  const safeAspect = Math.max(aspect, 0.01);
  const hFov = horizontalFov(vFov, safeAspect);
  const box = new THREE.Box3();
  if (points.length) box.setFromPoints(points);

  const target = box.isEmpty()
    ? new THREE.Vector3(0, liftY, -fallbackRadius * 0.5)
    : box.getCenter(new THREE.Vector3());
  target.y += liftY;

  let cornerFit = 0;
  for (let i = 0; i < samples; i += 1) {
    const az = (i / samples) * Math.PI * 2;
    const dir = directionFromOrbit(az, elevation);
    cornerFit = Math.max(
      cornerFit,
      distanceToFitPoints(target, points, dir, vFov, hFov, 1)
    );
  }

  const sphere = new THREE.Sphere();
  if (!box.isEmpty()) box.getBoundingSphere(sphere);
  const half = Math.min(vFov, hFov) * 0.5;
  const sinHalf = Math.max(Math.sin(half), 1e-4);
  const sphereFloor = ((sphere.radius || fallbackRadius) / sinHalf) * SPHERE_FLOOR;
  const radiusFloor = points.length
    ? 0
    : (fallbackRadius * 1.6) / sinHalf;

  const distance = Math.max(cornerFit, sphereFloor, radiusFloor) * margin;
  const hero = directionFromOrbit(azimuth, elevation);
  const position = target.clone().addScaledVector(hero, distance);

  return { position, target, distance, hero, hFov };
}

export function projectPointNdc(point, camera, target) {
  const ndc = target || new THREE.Vector3();
  ndc.copy(point).project(camera);
  return ndc;
}
