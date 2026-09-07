import * as THREE from 'three';
import type { Capability } from './capabilities';

/** Matches the scene group shift so the camera and moons share one origin. */
export const SCENE_SHIFT = new THREE.Vector3(-0.35, 0.05, 0);

const scratch = new THREE.Vector3();
const euler = new THREE.Euler();

export function orbitPoint(
  node: Capability,
  time: number,
  reducedMotion: boolean,
  target: THREE.Vector3 = scratch
): THREE.Vector3 {
  const t = reducedMotion ? node.phase : time * node.speed + node.phase;
  scratch.set(Math.cos(t) * node.radiusX, 0, Math.sin(t) * node.radiusZ);
  euler.set(node.tiltX, 0, node.tiltZ);
  scratch.applyEuler(euler);
  return target.copy(scratch);
}

export function buildOrbitCurve(node: Capability, segments = 160): THREE.CatmullRomCurve3 {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i += 1) {
    const t = (i / segments) * Math.PI * 2;
    const p = new THREE.Vector3(Math.cos(t) * node.radiusX, 0, Math.sin(t) * node.radiusZ);
    p.applyEuler(new THREE.Euler(node.tiltX, 0, node.tiltZ));
    pts.push(p);
  }
  return new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.05);
}
