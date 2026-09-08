import { STUD } from '../catalog';

export default function Pedestal() {
  const radius = 8 * STUD * 0.72;
  return (
    <group position={[0, -0.02, 0]}>
      <mesh castShadow receiveShadow position={[0, -0.08, 0]}>
        <cylinderGeometry args={[radius, radius * 1.06, 0.16, 48]} />
        <meshPhysicalMaterial
          color="#2a221c"
          roughness={0.42}
          metalness={0.22}
          clearcoat={0.2}
          envMapIntensity={0.9}
        />
      </mesh>
      <mesh receiveShadow position={[0, 0.01, 0]}>
        <cylinderGeometry args={[radius * 0.82, radius * 0.82, 0.03, 48]} />
        <meshPhysicalMaterial
          color="#3a2c24"
          roughness={0.28}
          metalness={0.35}
          clearcoat={0.45}
          envMapIntensity={1.1}
        />
      </mesh>
      <mesh position={[0, 0.03, 0]}>
        <torusGeometry args={[radius * 0.8, 0.012, 12, 48]} />
        <meshPhysicalMaterial
          color="#8a6a48"
          roughness={0.22}
          metalness={0.55}
          clearcoat={0.4}
        />
      </mesh>
    </group>
  );
}
