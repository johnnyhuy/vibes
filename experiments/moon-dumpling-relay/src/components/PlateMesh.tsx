import type { PlateKind } from '../types';

interface Props {
  kind: PlateKind;
  hidden: boolean;
}

export default function PlateMesh({ kind, hidden }: Props) {
  if (hidden) return null;

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <cylinderGeometry args={[0.22, 0.2, 0.04, 20]} />
        <meshStandardMaterial color="#efe6d6" roughness={0.35} metalness={0.08} />
      </mesh>
      {kind === 'pleat' ? <Pleat /> : null}
      {kind === 'soup' ? <Soup /> : null}
      {kind === 'moon' ? <MoonCoin /> : null}
      {kind === 'chili' ? <Chili /> : null}
      {kind === 'tea' ? <Tea /> : null}
    </group>
  );
}

function Pleat() {
  return (
    <mesh position={[0, 0.08, 0]} castShadow>
      <sphereGeometry args={[0.11, 12, 10]} />
      <meshStandardMaterial color="#f0d8a8" roughness={0.55} />
    </mesh>
  );
}

function Soup() {
  return (
    <mesh position={[0, 0.1, 0]} castShadow>
      <sphereGeometry args={[0.12, 14, 12]} />
      <meshStandardMaterial color="#f3e2b8" roughness={0.28} metalness={0.12} />
    </mesh>
  );
}

function MoonCoin() {
  return (
    <mesh position={[0, 0.07, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
      <cylinderGeometry args={[0.1, 0.1, 0.04, 20]} />
      <meshStandardMaterial color="#e8c27a" emissive="#c9a056" emissiveIntensity={0.35} metalness={0.55} roughness={0.28} />
    </mesh>
  );
}

function Chili() {
  return (
    <mesh position={[0, 0.07, 0]} castShadow>
      <sphereGeometry args={[0.09, 12, 10]} />
      <meshStandardMaterial color="#c43a24" emissive="#8d1e12" emissiveIntensity={0.45} roughness={0.4} />
    </mesh>
  );
}

function Tea() {
  return (
    <group position={[0, 0.08, 0]}>
      <mesh rotation={[0.4, 0.2, 0.3]} castShadow>
        <capsuleGeometry args={[0.025, 0.16, 4, 8]} />
        <meshStandardMaterial color="#6f9a4a" roughness={0.7} />
      </mesh>
      <mesh position={[0.04, 0.02, 0]} rotation={[-0.3, 0.4, -0.2]}>
        <capsuleGeometry args={[0.02, 0.12, 4, 8]} />
        <meshStandardMaterial color="#8fbc68" />
      </mesh>
    </group>
  );
}
