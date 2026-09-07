import NeuralGraph from './NeuralGraph';

export default function GlassSphere() {
  return (
    <group>
      <NeuralGraph />
      <mesh>
        <sphereGeometry args={[2.18, 64, 64]} />
        <meshPhysicalMaterial
          color="#f7fbff"
          metalness={0}
          roughness={0.18}
          transmission={1}
          thickness={1.35}
          ior={1.45}
          attenuationColor="#d7e4f2"
          attenuationDistance={3.2}
          clearcoat={0.35}
          clearcoatRoughness={0.45}
          envMapIntensity={0.55}
          transparent
        />
      </mesh>
    </group>
  );
}
