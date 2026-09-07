import type { DinerDef, StatusKind } from '../types';

interface Props {
  diner: DinerDef;
  status: StatusKind;
  lean: number;
  selected?: boolean;
  isPlayer?: boolean;
  onPick?: () => void;
}

export default function DinerMesh({ diner, status, lean, selected, isPlayer, onPick }: Props) {
  const panic = status === 'chili';
  const tea = status === 'tea';
  const body = panic ? '#c44a2a' : diner.hue;
  const dip = lean * 0.18;

  return (
    <group
      onClick={(event) => {
        event.stopPropagation();
        onPick?.();
      }}
      rotation={[dip, 0, 0]}
    >
      {isPlayer || selected ? (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <ringGeometry args={[0.42, 0.52, 28]} />
          <meshBasicMaterial color={isPlayer ? '#e8c27a' : '#9fd4d0'} transparent opacity={0.85} />
        </mesh>
      ) : null}

      {diner.species === 'fox' ? <Fox body={body} accent={diner.accent} /> : null}
      {diner.species === 'raccoon' ? <Raccoon body={body} accent={diner.accent} /> : null}
      {diner.species === 'owl' ? <Owl body={body} accent={diner.accent} /> : null}
      {diner.species === 'badger' ? <Badger body={body} accent={diner.accent} /> : null}
      {diner.species === 'hare' ? <Hare body={body} accent={diner.accent} /> : null}

      {tea ? (
        <>
          <mesh position={[0.28, 0.92, 0.1]}>
            <sphereGeometry args={[0.05, 10, 10]} />
            <meshStandardMaterial color="#9bd48a" emissive="#6fa85f" emissiveIntensity={0.8} />
          </mesh>
          <mesh position={[-0.22, 1.02, -0.08]}>
            <sphereGeometry args={[0.04, 10, 10]} />
            <meshStandardMaterial color="#c7e8b4" emissive="#8fbc78" emissiveIntensity={0.6} />
          </mesh>
        </>
      ) : null}
    </group>
  );
}

function Fox({ body, accent }: { body: string; accent: string }) {
  return (
    <group>
      <mesh position={[0, 0.38, 0.04]} castShadow>
        <sphereGeometry args={[0.28, 18, 16]} />
        <meshStandardMaterial color={body} roughness={0.62} />
      </mesh>
      <mesh position={[0, 0.68, 0.16]} castShadow>
        <sphereGeometry args={[0.2, 16, 14]} />
        <meshStandardMaterial color={body} roughness={0.58} />
      </mesh>
      <mesh position={[-0.1, 0.88, 0.16]} rotation={[0.2, 0, 0.35]} castShadow>
        <coneGeometry args={[0.07, 0.16, 8]} />
        <meshStandardMaterial color={body} />
      </mesh>
      <mesh position={[0.1, 0.88, 0.16]} rotation={[0.2, 0, -0.35]} castShadow>
        <coneGeometry args={[0.07, 0.16, 8]} />
        <meshStandardMaterial color={body} />
      </mesh>
      <mesh position={[0, 0.62, 0.32]}>
        <coneGeometry args={[0.05, 0.1, 8]} />
        <meshStandardMaterial color={accent} />
      </mesh>
      <mesh position={[0, 0.42, -0.32]} rotation={[0.9, 0, 0]} castShadow>
        <capsuleGeometry args={[0.08, 0.34, 6, 10]} />
        <meshStandardMaterial color={body} />
      </mesh>
    </group>
  );
}

function Raccoon({ body, accent }: { body: string; accent: string }) {
  return (
    <group>
      <mesh position={[0, 0.36, 0]} castShadow>
        <sphereGeometry args={[0.3, 16, 14]} />
        <meshStandardMaterial color={body} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.64, 0.16]} castShadow>
        <sphereGeometry args={[0.2, 14, 12]} />
        <meshStandardMaterial color={body} />
      </mesh>
      <mesh position={[0, 0.64, 0.28]} rotation={[Math.PI / 2, 0, 0]}>
        <capsuleGeometry args={[0.08, 0.18, 4, 8]} />
        <meshStandardMaterial color={accent} />
      </mesh>
      <mesh position={[0, 0.34, -0.34]} rotation={[1.1, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.05, 0.36, 10]} />
        <meshStandardMaterial color={body} />
      </mesh>
      <mesh position={[0, 0.2, -0.5]}>
        <torusGeometry args={[0.06, 0.02, 6, 10]} />
        <meshStandardMaterial color={accent} />
      </mesh>
    </group>
  );
}

function Owl({ body, accent }: { body: string; accent: string }) {
  return (
    <group>
      <mesh position={[0, 0.48, 0]} castShadow>
        <sphereGeometry args={[0.32, 18, 16]} />
        <meshStandardMaterial color={body} roughness={0.55} />
      </mesh>
      <mesh position={[-0.1, 0.58, 0.26]}>
        <circleGeometry args={[0.1, 16]} />
        <meshStandardMaterial color="#f6f1e6" />
      </mesh>
      <mesh position={[0.1, 0.58, 0.26]}>
        <circleGeometry args={[0.1, 16]} />
        <meshStandardMaterial color="#f6f1e6" />
      </mesh>
      <mesh position={[-0.1, 0.58, 0.27]}>
        <circleGeometry args={[0.04, 12]} />
        <meshStandardMaterial color={accent} />
      </mesh>
      <mesh position={[0.1, 0.58, 0.27]}>
        <circleGeometry args={[0.04, 12]} />
        <meshStandardMaterial color={accent} />
      </mesh>
      <mesh position={[0, 0.48, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.04, 0.08, 6]} />
        <meshStandardMaterial color="#c9843a" />
      </mesh>
      <mesh position={[-0.12, 0.84, 0.04]} rotation={[0, 0, 0.4]}>
        <coneGeometry args={[0.05, 0.12, 6]} />
        <meshStandardMaterial color={body} />
      </mesh>
      <mesh position={[0.12, 0.84, 0.04]} rotation={[0, 0, -0.4]}>
        <coneGeometry args={[0.05, 0.12, 6]} />
        <meshStandardMaterial color={body} />
      </mesh>
    </group>
  );
}

function Badger({ body, accent }: { body: string; accent: string }) {
  return (
    <group>
      <mesh position={[0, 0.3, 0.02]} scale={[1.15, 0.78, 1.25]} castShadow>
        <sphereGeometry args={[0.28, 16, 14]} />
        <meshStandardMaterial color={body} roughness={0.74} />
      </mesh>
      <mesh position={[0, 0.42, 0.22]} castShadow>
        <sphereGeometry args={[0.18, 14, 12]} />
        <meshStandardMaterial color={body} />
      </mesh>
      <mesh position={[0, 0.5, 0.08]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.12, 0.22, 0.28]} />
        <meshStandardMaterial color={accent} />
      </mesh>
    </group>
  );
}

function Hare({ body, accent }: { body: string; accent: string }) {
  return (
    <group>
      <mesh position={[0, 0.36, 0]} castShadow>
        <sphereGeometry args={[0.24, 16, 14]} />
        <meshStandardMaterial color={body} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.62, 0.12]} castShadow>
        <sphereGeometry args={[0.16, 14, 12]} />
        <meshStandardMaterial color={body} />
      </mesh>
      <mesh position={[-0.06, 0.88, 0.08]} rotation={[0.15, 0, 0.12]} castShadow>
        <capsuleGeometry args={[0.035, 0.28, 4, 8]} />
        <meshStandardMaterial color={body} />
      </mesh>
      <mesh position={[0.06, 0.88, 0.08]} rotation={[0.15, 0, -0.12]} castShadow>
        <capsuleGeometry args={[0.035, 0.28, 4, 8]} />
        <meshStandardMaterial color={accent} />
      </mesh>
      <mesh position={[0, 0.28, -0.22]}>
        <sphereGeometry args={[0.07, 10, 8]} />
        <meshStandardMaterial color={accent} />
      </mesh>
    </group>
  );
}
