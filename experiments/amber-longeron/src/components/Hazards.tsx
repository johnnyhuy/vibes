import { hash, laneX } from '../flight';
import type { Hazard } from '../types';

function Orb({ seed }: { seed: number }) {
  const scale = 0.78 + hash(seed, 2) * 0.18;
  return (
    <mesh castShadow receiveShadow scale={scale}>
      <sphereGeometry args={[0.62, 24, 18]} />
      <meshPhysicalMaterial
        color="#c43a2a"
        roughness={0.28}
        metalness={0.08}
        clearcoat={0.55}
        clearcoatRoughness={0.22}
      />
    </mesh>
  );
}

function Ring() {
  return (
    <mesh rotation={[0, Math.PI / 2, 0]}>
      <torusGeometry args={[0.7, 0.04, 10, 28]} />
      <meshStandardMaterial
        color="#c48a3a"
        emissive="#8a5a18"
        emissiveIntensity={0.22}
        metalness={0.45}
        roughness={0.32}
      />
    </mesh>
  );
}

export default function Hazards({ items }: { items: Hazard[] }) {
  return (
    <group>
      {items.map((item) => {
        if (item.taken) return null;
        return (
          <group key={item.id} position={[laneX(item.lane), 0.92, item.z]}>
            {item.kind === 'orb' && <Orb seed={item.seed} />}
            {item.kind === 'ring' && <Ring />}
          </group>
        );
      })}
    </group>
  );
}
