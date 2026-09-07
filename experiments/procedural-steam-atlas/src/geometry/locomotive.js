import * as THREE from 'three';

const MATERIAL_METAL = new THREE.MeshStandardMaterial({
  color: 0x4e555e,
  metalness: 0.82,
  roughness: 0.28,
});

const MATERIAL_BRASS = new THREE.MeshStandardMaterial({
  color: 0xd4a017,
  metalness: 0.78,
  roughness: 0.22,
});

const MATERIAL_STEEL = new THREE.MeshStandardMaterial({
  color: 0x7a828c,
  metalness: 0.9,
  roughness: 0.18,
});

const MATERIAL_RED = new THREE.MeshStandardMaterial({
  color: 0xc41e1e,
  metalness: 0.35,
  roughness: 0.45,
});

export function createLocomotive() {
  const group = new THREE.Group();
  const chassisParts = [];
  const wheelParts = [];

  const boilerLength = 8;
  const boilerRadius = 0.8;

  const boiler = createCylinder(boilerLength, boilerRadius, MATERIAL_METAL, true);
  boiler.rotation.z = Math.PI / 2;
  boiler.castShadow = true;
  boiler.userData.originalPosition = new THREE.Vector3(0, 0, 0);
  boiler.userData.explosionVector = new THREE.Vector3(0, 3, 0);
  group.add(boiler);
  chassisParts.push(boiler);

  const smokebox = createCylinder(1.5, boilerRadius * 0.9, MATERIAL_STEEL, true);
  smokebox.rotation.z = Math.PI / 2;
  smokebox.position.set(boilerLength / 2 + 0.75, 0, 0);
  smokebox.castShadow = true;
  smokebox.userData.originalPosition = smokebox.position.clone();
  smokebox.userData.explosionVector = new THREE.Vector3(2, 1, 0);
  group.add(smokebox);
  chassisParts.push(smokebox);

  const smokestack = createCylinder(1.8, 0.25, MATERIAL_BRASS, true);
  smokestack.position.set(1.5, 1.5, 0);
  smokestack.castShadow = true;
  smokestack.userData.originalPosition = smokestack.position.clone();
  smokestack.userData.explosionVector = new THREE.Vector3(0, 4, 0);
  group.add(smokestack);
  chassisParts.push(smokestack);

  const cabLength = 2;
  const cabHeight = 2;
  const cabWidth = 1.8;
  const cabGeometry = new THREE.BoxGeometry(cabLength, cabHeight, cabWidth);
  const cab = new THREE.Mesh(cabGeometry, MATERIAL_RED);
  cab.position.set(-boilerLength / 2 - cabLength / 2, cabHeight / 2 - 0.3, 0);
  cab.castShadow = true;
  cab.userData.originalPosition = cab.position.clone();
  cab.userData.explosionVector = new THREE.Vector3(-2, 1, 0);
  group.add(cab);
  chassisParts.push(cab);

  const roofGeometry = new THREE.BoxGeometry(cabLength + 0.2, 0.2, cabWidth + 0.2);
  const roof = new THREE.Mesh(roofGeometry, MATERIAL_METAL);
  roof.position.set(-boilerLength / 2 - cabLength / 2, cabHeight + 0.8, 0);
  roof.castShadow = true;
  roof.userData.originalPosition = roof.position.clone();
  roof.userData.explosionVector = new THREE.Vector3(-2, 2, 0);
  group.add(roof);
  chassisParts.push(roof);

  const frameGeometry = new THREE.BoxGeometry(boilerLength + 2, 0.15, 0.2);
  const frameLeft = new THREE.Mesh(frameGeometry, MATERIAL_STEEL);
  frameLeft.position.set(0, -boilerRadius - 0.5, -0.6);
  frameLeft.castShadow = true;
  frameLeft.userData.originalPosition = frameLeft.position.clone();
  frameLeft.userData.explosionVector = new THREE.Vector3(0, -1, -2);
  group.add(frameLeft);
  chassisParts.push(frameLeft);

  const frameRight = frameLeft.clone();
  frameRight.position.set(0, -boilerRadius - 0.5, 0.6);
  frameRight.userData.originalPosition = frameRight.position.clone();
  frameRight.userData.explosionVector = new THREE.Vector3(0, -1, 2);
  group.add(frameRight);
  chassisParts.push(frameRight);

  const wheelRadius = 0.6;
  const wheelWidth = 0.15;
  const wheelPositions = [
    { x: 2.5, z: -0.8 },
    { x: 2.5, z: 0.8 },
    { x: 0, z: -0.8 },
    { x: 0, z: 0.8 },
    { x: -2.5, z: -0.8 },
    { x: -2.5, z: 0.8 },
  ];

  wheelPositions.forEach((pos, index) => {
    const wheel = createWheel(wheelRadius, wheelWidth);
    wheel.position.set(pos.x, -boilerRadius - 0.5, pos.z);
    wheel.rotation.x = Math.PI / 2;
    wheel.userData.originalPosition = wheel.position.clone();
    wheel.userData.explosionVector = new THREE.Vector3(
      pos.x * 0.3,
      -2,
      pos.z * 1.5
    );
    group.add(wheel);
    wheelParts.push(wheel);
  });

  for (let i = 0; i < 12; i++) {
    const x = -2 + i * 0.8;
    const rivet = createSphere(0.08, MATERIAL_BRASS);
    rivet.position.set(x, boilerRadius * 0.7, 0);
    rivet.castShadow = true;
    rivet.userData.originalPosition = rivet.position.clone();
    rivet.userData.explosionVector = new THREE.Vector3(0, 1, 0);
    group.add(rivet);
    chassisParts.push(rivet);
  }

  const cowcatcherGeometry = new THREE.ConeGeometry(0.8, 1.5, 4);
  const cowcatcher = new THREE.Mesh(cowcatcherGeometry, MATERIAL_STEEL);
  cowcatcher.rotation.z = -Math.PI / 2;
  cowcatcher.rotation.y = Math.PI / 4;
  cowcatcher.position.set(boilerLength / 2 + 2, -0.8, 0);
  cowcatcher.castShadow = true;
  cowcatcher.userData.originalPosition = cowcatcher.position.clone();
  cowcatcher.userData.explosionVector = new THREE.Vector3(3, -1, 0);
  group.add(cowcatcher);
  chassisParts.push(cowcatcher);

  group.position.y = 1;

  return {
    group,
    parts: {
      chassis: chassisParts,
      wheels: wheelParts,
    },
  };
}

function createCylinder(length, radius, material, caps = true) {
  const geometry = new THREE.CylinderGeometry(radius, radius, length, 32, 1, !caps);
  return new THREE.Mesh(geometry, material);
}

function createWheel(radius, width) {
  const group = new THREE.Group();

  const rimGeometry = new THREE.CylinderGeometry(radius, radius, width, 32);
  const rim = new THREE.Mesh(rimGeometry, MATERIAL_STEEL);
  rim.castShadow = true;
  group.add(rim);

  const hubGeometry = new THREE.CylinderGeometry(radius * 0.3, radius * 0.3, width * 1.2, 16);
  const hub = new THREE.Mesh(hubGeometry, MATERIAL_BRASS);
  hub.castShadow = true;
  group.add(hub);

  const spokeCount = 8;
  for (let i = 0; i < spokeCount; i++) {
    const angle = (i / spokeCount) * Math.PI * 2;
    const spokeGeometry = new THREE.BoxGeometry(radius * 0.7, 0.05, 0.05);
    const spoke = new THREE.Mesh(spokeGeometry, MATERIAL_STEEL);
    spoke.position.set(
      Math.cos(angle) * radius * 0.5,
      Math.sin(angle) * radius * 0.5,
      0
    );
    spoke.rotation.z = angle;
    spoke.castShadow = true;
    group.add(spoke);
  }

  return group;
}

function createSphere(radius, material) {
  const geometry = new THREE.SphereGeometry(radius, 16, 16);
  return new THREE.Mesh(geometry, material);
}
