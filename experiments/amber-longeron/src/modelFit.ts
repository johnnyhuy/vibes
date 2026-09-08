import { Box3, Vector3, type Material, type Mesh, type Object3D } from 'three';

const _box = new Box3();
const _size = new Vector3();
const _center = new Vector3();

function materialName(material: Material | Material[] | undefined): string {
  if (!material) return '';
  if (Array.isArray(material)) return material.map((item) => item.name ?? '').join(' ');
  return material.name ?? '';
}

export function hideNamedMeshes(root: Object3D, needles: string[]): void {
  const match = needles.map((item) => item.toLowerCase());
  root.traverse((object) => {
    const mesh = object as Mesh;
    if (!mesh.isMesh) return;
    const haystack = `${mesh.name} ${mesh.parent?.name ?? ''} ${materialName(mesh.material)}`.toLowerCase();
    if (match.some((needle) => haystack.includes(needle))) {
      mesh.visible = false;
    }
  });
}

export function fitObject(
  root: Object3D,
  targetSpan: number,
  options: { ground?: boolean } = {}
): Box3 {
  root.updateMatrixWorld(true);
  _box.setFromObject(root);
  _box.getSize(_size);
  const span = Math.max(_size.x, _size.y, _size.z);
  if (span > 1e-6) root.scale.multiplyScalar(targetSpan / span);
  root.updateMatrixWorld(true);
  _box.setFromObject(root);
  _box.getCenter(_center);
  root.position.sub(_center);
  if (options.ground) {
    root.updateMatrixWorld(true);
    _box.setFromObject(root);
    root.position.y -= _box.min.y;
  }
  root.updateMatrixWorld(true);
  return _box.setFromObject(root);
}

export function enableShadows(root: Object3D): void {
  root.traverse((object) => {
    const mesh = object as Mesh;
    if (!mesh.isMesh) return;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
  });
}

function findNamed(root: Object3D, needle: string): Object3D | null {
  let found: Object3D | null = null;
  const match = needle.toLowerCase();
  root.traverse((object) => {
    if (!found && object.name.toLowerCase() === match) found = object;
  });
  return found;
}

/** Wings along X, nose toward +Z so the follow-cam sits behind the spar. */
export function faceAircraftForward(root: Object3D): void {
  root.updateMatrixWorld(true);
  _box.setFromObject(root);
  _box.getSize(_size);
  if (_size.z > _size.x) root.rotation.y += Math.PI / 2;
  root.updateMatrixWorld(true);
  const engine = findNamed(root, 'engine');
  if (engine) {
    engine.getWorldPosition(_center);
    if (_center.z < 0) root.rotation.y += Math.PI;
  }
  root.updateMatrixWorld(true);
}
