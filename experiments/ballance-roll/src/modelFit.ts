import {
  Box3,
  MeshStandardMaterial,
  SRGBColorSpace,
  Vector3,
  type Mesh,
  type Object3D
} from 'three';

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

export function dressPbr(root: Object3D, envMapIntensity = 1.2): void {
  root.traverse((object) => {
    const mesh = object as Mesh;
    if (!mesh.isMesh || !mesh.material) return;
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    const next = materials.map((source) => {
      if (!(source instanceof MeshStandardMaterial)) return source;
      const mat = source.clone();
      mat.envMapIntensity = envMapIntensity;
      if (mat.map) mat.map.colorSpace = SRGBColorSpace;
      if (mat.emissiveMap) mat.emissiveMap.colorSpace = SRGBColorSpace;
      return mat;
    });
    mesh.material = next.length === 1 ? next[0] : next;
  });
}
