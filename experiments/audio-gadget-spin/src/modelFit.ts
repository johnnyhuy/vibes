import { Box3, Vector3, type Mesh, type Object3D } from 'three';

const _box = new Box3();
const _size = new Vector3();
const _center = new Vector3();

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

export function meshLabel(mesh: Mesh): string {
  const material = mesh.material;
  const materialName = Array.isArray(material)
    ? material.map((item) => item.name ?? '').join(' ')
    : (material?.name ?? '');
  const lineage: string[] = [];
  let current: Object3D | null = mesh;
  while (current) {
    if (current.name) lineage.push(current.name);
    current = current.parent;
  }
  return `${lineage.join(' ')} ${materialName}`.toLowerCase();
}
