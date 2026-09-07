import { useMemo } from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

function profile(points: Array<[number, number]>) {
  return points.map(([x, y]) => new THREE.Vector2(x, y));
}

function lathe(points: Array<[number, number]>, segments = 80) {
  return new THREE.LatheGeometry(profile(points), segments);
}

/**
 * Horizontal apothecary bottle — clean-room lathe, not a scanned mesh.
 * Silhouette aims at the himanshubuildss / Caldera-class product hero:
 * wide cylinder, short neck, opaque cap, dark green glass + liquid.
 */
export default function GlassBottle() {
  const { glass, liquid, cap } = useMemo(() => {
    const glass = lathe([
      [0.00, -1.72],
      [0.58, -1.72],
      [0.66, -1.64],
      [0.70, -1.42],
      [0.715, -0.55],
      [0.715, 0.48],
      [0.70, 0.92],
      [0.58, 1.12],
      [0.28, 1.22],
      [0.22, 1.30],
      [0.205, 1.48],
      [0.24, 1.54],
      [0.16, 1.54],
    ]);

    const liquid = lathe([
      [0.00, -1.58],
      [0.52, -1.58],
      [0.61, -1.50],
      [0.655, -1.32],
      [0.665, -0.50],
      [0.665, 0.42],
      [0.64, 0.82],
      [0.48, 1.02],
      [0.00, 1.04],
    ], 64);

    const cap = new THREE.CylinderGeometry(0.235, 0.235, 0.32, 48);

    return { glass, liquid, cap };
  }, []);

  return (
    <group>
      <mesh geometry={glass}>
        <meshPhysicalMaterial
          color="#08140c"
          metalness={0}
          roughness={0.018}
          transmission={1}
          thickness={0.42}
          ior={1.48}
          attenuationColor="#163d22"
          attenuationDistance={0.55}
          clearcoat={1}
          clearcoatRoughness={0.03}
          envMapIntensity={1.6}
        />
      </mesh>

      <mesh geometry={liquid}>
        <meshPhysicalMaterial
          color="#0a1f12"
          metalness={0}
          roughness={0.22}
          transmission={0.35}
          thickness={1.1}
          ior={1.39}
          attenuationColor="#05140a"
          attenuationDistance={0.28}
          envMapIntensity={0.45}
        />
      </mesh>

      <mesh geometry={cap} position={[0, 1.70, 0]}>
        <meshStandardMaterial color="#070707" metalness={0.35} roughness={0.45} />
      </mesh>

      <Text
        position={[0, 0.02, 0.722]}
        fontSize={0.16}
        letterSpacing={0.18}
        color="#c8ff3a"
        anchorX="center"
        anchorY="middle"
      >
        AETHER
      </Text>
      <Text
        position={[0, -0.22, 0.722]}
        fontSize={0.045}
        letterSpacing={0.22}
        color="#c8ff3a"
        anchorX="center"
        anchorY="middle"
      >
        BATCH 04  ·  GLASS
      </Text>
    </group>
  );
}
