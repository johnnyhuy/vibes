import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as THREE from 'three';
import {
  isScreenMaterial,
  polishLaptopMaterials,
  prepareLaptopTemplate,
  sitLaptopOnGround,
} from './laptopFit.js';

function laptopLike() {
  const root = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.08, 0.48));
  body.position.y = 0.24;
  const screen = new THREE.Mesh(
    new THREE.BoxGeometry(0.62, 0.4, 0.03),
    new THREE.MeshStandardMaterial({ name: 'classic_laptop_screen', color: 0x111111 })
  );
  screen.name = 'classic_laptop_screen';
  screen.position.set(0, 0.48, -0.2);
  root.add(body, screen);
  return root;
}

test('sitLaptopOnGround scales to the target width and plants the feet on y = 0', () => {
  const root = laptopLike();
  const box = sitLaptopOnGround(root, 0.72);
  const size = box.getSize(new THREE.Vector3());

  assert.ok(Math.abs(size.x - 0.72) < 1e-4, `width ${size.x}`);
  assert.ok(Math.abs(box.min.y) < 1e-4, `min.y ${box.min.y}`);
  assert.ok(Math.abs((box.min.x + box.max.x) / 2) < 1e-4, 'centred on X');
  assert.ok(Math.abs((box.min.z + box.max.z) / 2) < 1e-4, 'centred on Z');
});

test('isScreenMaterial matches the display material, not the lid mesh name', () => {
  const screen = new THREE.MeshStandardMaterial({ name: 'classic_laptop_screen' });
  const lid = new THREE.MeshStandardMaterial({ name: 'classic_laptop' });
  assert.equal(isScreenMaterial(screen), true);
  assert.equal(isScreenMaterial(lid), false);
});

test('polishLaptopMaterials lights only the screen and leaves the chassis dark', () => {
  const root = laptopLike();
  polishLaptopMaterials(root, 0);
  const screen = root.getObjectByName('classic_laptop_screen');
  assert.ok(screen.material.emissiveIntensity > 0.4);
  assert.ok(screen.material.emissive.getHex() !== 0);
});

test('polishLaptopMaterials only tints the screen slot on a multi-material lid', () => {
  const lid = new THREE.MeshStandardMaterial({ name: 'classic_laptop' });
  const screen = new THREE.MeshStandardMaterial({ name: 'classic_laptop_screen' });
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(), [lid, screen]);
  mesh.name = 'classic_laptop_screen';
  const root = new THREE.Group();
  root.add(mesh);
  polishLaptopMaterials(root, 0);
  assert.equal(mesh.material[0].emissive.getHex(), 0);
  assert.ok(mesh.material[1].emissiveIntensity > 0.4);
});

test('prepareLaptopTemplate keeps the sit offset when the wrapper is placed on the arc', () => {
  const { template } = prepareLaptopTemplate(laptopLike(), 0.72);
  const clone = template.clone(true);
  clone.position.set(4, 0, -6);
  clone.rotation.y = -0.4;
  clone.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(clone);
  assert.ok(Math.abs(box.min.y) < 1e-4, `min.y ${box.min.y}`);
  assert.ok(box.max.y > 0.3, `height ${box.max.y}`);
});
