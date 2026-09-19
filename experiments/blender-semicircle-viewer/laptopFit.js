import * as THREE from 'three';

const _box = new THREE.Box3();
const _size = new THREE.Vector3();
const _center = new THREE.Vector3();

const PHOSPHORS = [0x3f6a38, 0x4a7840, 0x355c32];

function materialList(material) {
  if (!material) return [];
  return Array.isArray(material) ? material : [material];
}

export function isScreenMaterial(material) {
  return (material?.name ?? '').toLowerCase().includes('screen');
}

/** Scale to a target width, centre on XZ, and sit the feet on y = 0. */
export function sitLaptopOnGround(root, targetWidth) {
  root.updateMatrixWorld(true);
  _box.setFromObject(root);
  _box.getSize(_size);
  if (_size.x > 1e-6) root.scale.multiplyScalar(targetWidth / _size.x);

  root.updateMatrixWorld(true);
  _box.setFromObject(root);
  _box.getCenter(_center);
  root.position.x -= _center.x;
  root.position.z -= _center.z;

  root.updateMatrixWorld(true);
  _box.setFromObject(root);
  root.position.y -= _box.min.y;

  root.updateMatrixWorld(true);
  return _box.setFromObject(root);
}

export function enableShadows(root) {
  root.traverse((object) => {
    if (!object.isMesh) return;
    object.castShadow = true;
    object.receiveShadow = true;
  });
}

/** Shared PBR polish. Screen materials get a faint DOS phosphor so the lids read as on. */
export function polishLaptopMaterials(root, phosphorIndex = 0) {
  const phosphor = new THREE.Color(PHOSPHORS[phosphorIndex % PHOSPHORS.length]);

  root.traverse((object) => {
    if (!object.isMesh || !object.material) return;
    const next = materialList(object.material).map((source) => {
      const mat = source.clone();
      if ('envMapIntensity' in mat) mat.envMapIntensity = 1.28;
      if (isScreenMaterial(source) && mat.emissive) {
        mat.emissive.copy(phosphor);
        mat.emissiveIntensity = 0.62;
        mat.roughness = Math.min(mat.roughness ?? 0.6, 0.35);
        mat.metalness = 0;
      }
      return mat;
    });
    object.material = next.length === 1 ? next[0] : next;
  });
}

export function prepareLaptopTemplate(scene, targetWidth) {
  enableShadows(scene);
  sitLaptopOnGround(scene, targetWidth);
  const wrapper = new THREE.Group();
  wrapper.name = 'LaptopTemplate';
  wrapper.add(scene);
  wrapper.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(wrapper);
  return { template: wrapper, box, height: box.max.y - box.min.y };
}
