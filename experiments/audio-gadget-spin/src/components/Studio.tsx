import { ContactShadows, Environment } from '@react-three/drei';

export default function Studio() {
  return (
    <>
      <color attach="background" args={['#050507']} />
      <fog attach="fog" args={['#050507', 8, 18]} />
      <ambientLight intensity={0.12} />
      <spotLight
        position={[2.4, 4.2, 2.8]}
        angle={0.42}
        penumbra={0.7}
        intensity={46}
        color="#fff4e8"
        castShadow
        shadow-mapSize={1024}
      />
      <spotLight position={[-3.2, 2.4, -1.6]} angle={0.5} penumbra={0.8} intensity={14} color="#8ea4c6" />
      <spotLight position={[0.4, 2.8, -3.2]} angle={0.55} penumbra={0.85} intensity={8} color="#ffd8a8" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.12, 0]} receiveShadow>
        <circleGeometry args={[3.4, 64]} />
        <meshStandardMaterial color="#0b0c10" roughness={0.92} metalness={0.08} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.108, 0]} receiveShadow>
        <ringGeometry args={[0.72, 1.18, 64]} />
        <meshPhysicalMaterial
          color="#1a1d24"
          roughness={0.2}
          metalness={0.55}
          clearcoat={0.6}
        />
      </mesh>

      <ContactShadows position={[0, -1.1, 0]} opacity={0.55} scale={8} blur={2.6} far={4} />

      <Environment files="/hdri/studio.hdr" resolution={512} environmentIntensity={1.08} />
    </>
  );
}
