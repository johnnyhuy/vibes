import { useMemo } from 'react';
import * as THREE from 'three';

function profile(points: Array<[number, number]>) {
  return points.map(([x, y]) => new THREE.Vector2(x, y));
}

function lathe(points: Array<[number, number]>, segments = 64) {
  return new THREE.LatheGeometry(profile(points), segments);
}

/**
 * Procedural perfume bottle — LatheGeometry silhouette + inner liquid.
 * Clean-room. No scanned assets, no copied meshes.
 */
export default function GlassBottle() {
  const { glass, liquid, stopper, collar } = useMemo(() => {
    const glass = lathe([
      [0.00, -1.55],
      [0.16, -1.53],
      [0.38, -1.48],
      [0.56, -1.38],
      [0.66, -1.22],
      [0.70, -0.88],
      [0.715, -0.22],
      [0.70, 0.28],
      [0.64, 0.68],
      [0.42, 0.96],
      [0.21, 1.12],
      [0.168, 1.36],
      [0.175, 1.46],
      [0.22, 1.51],
      [0.20, 1.555],
      [0.13, 1.555],
    ]);

    const liquid = lathe([
      [0.00, -1.36],
      [0.32, -1.34],
      [0.50, -1.26],
      [0.60, -1.14],
      [0.635, -0.82],
      [0.645, -0.18],
      [0.63, 0.22],
      [0.58, 0.38],
      [0.00, 0.40],
    ], 48);

    const stopper = lathe([
      [0.00, 1.56],
      [0.11, 1.56],
      [0.13, 1.62],
      [0.145, 1.78],
      [0.16, 1.92],
      [0.12, 2.02],
      [0.00, 2.06],
    ], 32);

    const collar = new THREE.TorusGeometry(0.195, 0.028, 16, 48);

    return { glass, liquid, stopper, collar };
  }, []);

  return (
    <group>
      <mesh geometry={glass} castShadow>
        <meshPhysicalMaterial
          color="#f4fbff"
          metalness={0}
          roughness={0.028}
          transmission={1}
          thickness={0.55}
          ior={1.5}
          attenuationColor="#9ec8e8"
          attenuationDistance={1.15}
          clearcoat={1}
          clearcoatRoughness={0.04}
          envMapIntensity={1.35}
        />
      </mesh>

      <mesh geometry={liquid}>
        <meshPhysicalMaterial
          color="#c9a45b"
          metalness={0}
          roughness={0.18}
          transmission={0.62}
          thickness={0.85}
          ior={1.4}
          attenuationColor="#8a5a14"
          attenuationDistance={0.42}
          envMapIntensity={0.7}
        />
      </mesh>

      <mesh position={[0, 0.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.575, 48]} />
        <meshPhysicalMaterial
          color="#d4b36a"
          roughness={0.08}
          metalness={0.05}
          transmission={0.35}
          ior={1.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh geometry={stopper} castShadow>
        <meshPhysicalMaterial
          color="#d8c089"
          metalness={0.85}
          roughness={0.22}
          clearcoat={0.6}
          clearcoatRoughness={0.25}
          envMapIntensity={1.1}
        />
      </mesh>

      <mesh geometry={collar} position={[0, 1.48, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial
          color="#c4a15a"
          metalness={0.95}
          roughness={0.18}
        />
      </mesh>

      <mesh position={[0, -0.05, 0.702]} rotation={[0, 0, 0]}>
        <planeGeometry args={[0.42, 0.72]} />
        <meshPhysicalMaterial
          color="#1a1610"
          roughness={0.55}
          metalness={0.05}
          transparent
          opacity={0.22}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
