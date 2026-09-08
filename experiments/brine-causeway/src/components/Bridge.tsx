import { bridgeAnchor } from '../road';
import type { ResolvedLook } from '../look';

interface Props {
  look: ResolvedLook;
}

const PAINT = '#8a2e2a';
const STEEL = '#4a4040';

function Tower({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[-1.15, 9.2, 0]} castShadow>
        <boxGeometry args={[0.7, 18.4, 0.7]} />
        <meshStandardMaterial color={PAINT} roughness={0.48} metalness={0.28} />
      </mesh>
      <mesh position={[1.15, 9.2, 0]} castShadow>
        <boxGeometry args={[0.7, 18.4, 0.7]} />
        <meshStandardMaterial color={PAINT} roughness={0.48} metalness={0.28} />
      </mesh>
      <mesh position={[0, 12.4, 0]} castShadow>
        <boxGeometry args={[3.1, 0.55, 0.55]} />
        <meshStandardMaterial color={PAINT} roughness={0.45} metalness={0.3} />
      </mesh>
      <mesh position={[0, 17.6, 0]} castShadow>
        <boxGeometry args={[3.1, 0.7, 0.7]} />
        <meshStandardMaterial color={PAINT} roughness={0.42} metalness={0.32} />
      </mesh>
      <mesh position={[0, 18.6, 0]}>
        <boxGeometry args={[0.35, 1.4, 0.35]} />
        <meshStandardMaterial color={STEEL} metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}

function Cable({ from, to }: { from: [number, number, number]; to: [number, number, number] }) {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const dz = to[2] - from[2];
  const len = Math.hypot(dx, dy, dz);
  const mid: [number, number, number] = [from[0] + dx / 2, from[1] + dy / 2, from[2] + dz / 2];
  const yaw = Math.atan2(dx, dz);
  const pitch = Math.atan2(dy, Math.hypot(dx, dz)) * -1;
  return (
    <mesh position={mid} rotation={[pitch, yaw, 0]}>
      <cylinderGeometry args={[0.07, 0.07, len, 5]} />
      <meshStandardMaterial color={STEEL} metalness={0.7} roughness={0.28} />
    </mesh>
  );
}

export default function Bridge({ look }: Props) {
  const { westX, eastX, deckZ, cz } = bridgeAnchor();
  const deckY = 0.7;
  const towerY = 17.6;
  const hangers = 7;

  return (
    <group>
      <Tower x={westX} z={deckZ} />
      <Tower x={eastX} z={deckZ} />
      <mesh position={[(westX + eastX) / 2, deckY, deckZ]} receiveShadow castShadow>
        <boxGeometry args={[eastX - westX + 6, 0.28, 11]} />
        <meshStandardMaterial color="#2c2e32" roughness={0.7} />
      </mesh>
      <mesh position={[(westX + eastX) / 2, -1.8, deckZ + 0.2]}>
        <boxGeometry args={[eastX - westX - 2, 3.4, 9]} />
        <meshStandardMaterial color={look.waterColor} transparent opacity={0.35} />
      </mesh>
      <Cable from={[westX, towerY, deckZ]} to={[eastX, towerY, deckZ]} />
      <Cable from={[westX - 18, 1.2, cz - 6]} to={[westX, towerY, deckZ]} />
      <Cable from={[eastX + 18, 1.2, cz - 6]} to={[eastX, towerY, deckZ]} />
      <Cable from={[westX - 10, 1.2, cz + 16]} to={[westX, towerY, deckZ]} />
      <Cable from={[eastX + 10, 1.2, cz + 16]} to={[eastX, towerY, deckZ]} />
      {Array.from({ length: hangers }, (_, i) => {
        const u = (i + 1) / (hangers + 1);
        const x = westX + (eastX - westX) * u;
        const sag = Math.sin(u * Math.PI) * 2.4;
        return (
          <mesh key={i} position={[x, (towerY + deckY - sag) / 2, deckZ]}>
            <cylinderGeometry args={[0.04, 0.04, towerY - deckY - sag, 4]} />
            <meshStandardMaterial color={STEEL} metalness={0.65} roughness={0.3} />
          </mesh>
        );
      })}
      {[-4.8, 4.8].map((side) => (
        <mesh key={side} position={[(westX + eastX) / 2, 1.35, deckZ + side]}>
          <boxGeometry args={[eastX - westX + 5.2, 0.08, 0.08]} />
          <meshStandardMaterial color={PAINT} metalness={0.25} roughness={0.5} />
        </mesh>
      ))}
      <pointLight color="#ffb070" intensity={3.2 * look.lampGain} distance={22} position={[westX, 8, deckZ]} />
      <pointLight color="#ffb070" intensity={3.2 * look.lampGain} distance={22} position={[eastX, 8, deckZ]} />
    </group>
  );
}
