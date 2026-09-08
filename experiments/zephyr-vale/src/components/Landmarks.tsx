import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { heightAt, LANDMARKS, PATH } from '../world';

function ListeningOak() {
  const { x, z } = LANDMARKS.oak;
  const y = heightAt(x, z);
  return (
    <group position={[x, y, z]}>
      <mesh position={[0, 1.35, 0]} castShadow>
        <cylinderGeometry args={[0.34, 0.52, 2.7, 8]} />
        <meshStandardMaterial color="#6b4a30" roughness={0.94} />
      </mesh>
      <mesh position={[0.55, 2.35, 0.1]} rotation={[0.2, 0.4, 0.55]} castShadow>
        <cylinderGeometry args={[0.08, 0.16, 1.4, 6]} />
        <meshStandardMaterial color="#5a3c26" roughness={0.92} />
      </mesh>
      <mesh position={[-0.48, 2.55, -0.18]} rotation={[0.15, -0.5, -0.6]} castShadow>
        <cylinderGeometry args={[0.07, 0.14, 1.2, 6]} />
        <meshStandardMaterial color="#5a3c26" roughness={0.92} />
      </mesh>
      {[
        [0.1, 3.55, 0.05, 1.15, '#7eaa4e'],
        [0.85, 3.2, 0.25, 0.78, '#8ab85a'],
        [-0.7, 3.35, -0.2, 0.7, '#628a3c'],
        [0.35, 3.9, -0.45, 0.62, '#93b85c'],
        [-0.2, 3.75, 0.55, 0.58, '#6f9844'],
      ].map(([ox, oy, oz, r, color], index) => (
        <mesh key={index} position={[ox, oy, oz]} castShadow>
          <icosahedronGeometry args={[Number(r), 0]} />
          <meshStandardMaterial color={String(color)} roughness={0.82} />
        </mesh>
      ))}
    </group>
  );
}

function LogSeat() {
  const { x, z } = LANDMARKS.seat;
  const y = heightAt(x, z);
  return (
    <group position={[x, y, z]} rotation={[0, 0.55, 0]}>
      <mesh position={[-0.55, 0.18, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.14, 0.34, 8]} />
        <meshStandardMaterial color="#6a4e32" roughness={0.9} />
      </mesh>
      <mesh position={[0.55, 0.18, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.14, 0.34, 8]} />
        <meshStandardMaterial color="#6a4e32" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.38, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.16, 0.18, 1.45, 10]} />
        <meshStandardMaterial color="#8a6844" roughness={0.86} />
      </mesh>
    </group>
  );
}

function RibbonCairn({ reducedMotion }: { reducedMotion: boolean }) {
  const strips = useRef<Group>(null);
  const { x, z } = LANDMARKS.cairn;
  const y = heightAt(x, z);

  useFrame((state) => {
    if (!strips.current || reducedMotion) return;
    const t = state.clock.elapsedTime;
    strips.current.children.forEach((child, index) => {
      child.rotation.z = Math.sin(t * 1.4 + index) * 0.28;
    });
  });

  return (
    <group position={[x, y, z]}>
      {[0.16, 0.28, 0.42].map((h, index) => (
        <mesh key={index} position={[index * 0.04, h, -index * 0.03]} castShadow>
          <dodecahedronGeometry args={[0.22 - index * 0.03, 0]} />
          <meshStandardMaterial color="#9a9182" roughness={0.88} />
        </mesh>
      ))}
      <group ref={strips} position={[0, 0.72, 0]}>
        {['#d9c48a', '#c46a4a', '#e8e2d2'].map((color, index) => (
          <mesh key={color} position={[(index - 1) * 0.08, 0.28, 0]} rotation={[0.2, index, 0.1]}>
            <boxGeometry args={[0.04, 0.55, 0.01]} />
            <meshStandardMaterial color={color} roughness={0.7} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function ReedBothy() {
  const { x, z } = LANDMARKS.bothy;
  const y = heightAt(x, z);
  return (
    <group position={[x, y, z]} rotation={[0, -0.4, 0]}>
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[2.2, 1.1, 1.6]} />
        <meshStandardMaterial color="#8d8678" roughness={0.94} />
      </mesh>
      <mesh position={[0, 1.35, 0]} rotation={[0, 0, 0]} castShadow>
        <coneGeometry args={[1.55, 1.05, 4]} />
        <meshStandardMaterial color="#9a7a48" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.52, 0.82]}>
        <boxGeometry args={[0.55, 0.72, 0.08]} />
        <meshStandardMaterial color="#3a3026" roughness={0.8} />
      </mesh>
    </group>
  );
}

function Waterwheel({ reducedMotion }: { reducedMotion: boolean }) {
  const wheel = useRef<Group>(null);
  const { x, z } = LANDMARKS.wheel;
  const y = heightAt(x, z);

  useFrame((_, delta) => {
    if (!wheel.current || reducedMotion) return;
    wheel.current.rotation.z -= delta * 0.35;
  });

  return (
    <group position={[x, y, z]} rotation={[0, 0.9, 0]}>
      <mesh position={[-0.7, 0.55, 0]} castShadow>
        <boxGeometry args={[1.1, 1.1, 0.9]} />
        <meshStandardMaterial color="#7a6a52" roughness={0.9} />
      </mesh>
      <group ref={wheel} position={[0.35, 0.85, 0]}>
        <mesh rotation={[0, 0, 0]} castShadow>
          <torusGeometry args={[0.62, 0.05, 8, 18]} />
          <meshStandardMaterial color="#5a4030" roughness={0.8} />
        </mesh>
        {Array.from({ length: 8 }, (_, index) => (
          <mesh key={index} rotation={[0, 0, (index / 8) * Math.PI * 2]} castShadow>
            <boxGeometry args={[0.08, 1.22, 0.22]} />
            <meshStandardMaterial color="#6a4e34" roughness={0.84} />
          </mesh>
        ))}
      </group>
      <mesh position={[0.9, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.6, 0.7]} />
        <meshStandardMaterial color="#6aa8a4" roughness={0.3} transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

function Coracle() {
  const { x, z } = LANDMARKS.shore;
  const y = heightAt(x, z);
  return (
    <group position={[x, y + 0.08, z]} rotation={[0.05, 0.4, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <sphereGeometry args={[0.55, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshStandardMaterial color="#6b4a30" roughness={0.86} />
      </mesh>
      <mesh position={[0, 0.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.52, 0.04, 8, 16]} />
        <meshStandardMaterial color="#8a6844" roughness={0.8} />
      </mesh>
      <mesh position={[0.18, 0.22, 0.08]} rotation={[0.3, 0.2, 0.4]} castShadow>
        <cylinderGeometry args={[0.02, 0.03, 0.85, 5]} />
        <meshStandardMaterial color="#4a3424" roughness={0.86} />
      </mesh>
    </group>
  );
}

function FordStones() {
  const stones = useMemo(
    () =>
      Array.from({ length: 6 }, (_, index) => {
        const t = index / 5;
        const x = 4.15 + Math.sin(t * 3) * 0.25;
        const z = -9.2 - t * 7.2;
        return { x, z, y: heightAt(x, z), s: 0.38 + (index % 2) * 0.08 };
      }),
    []
  );

  return (
    <group>
      {stones.map((stone, index) => (
        <mesh
          key={index}
          position={[stone.x, stone.y + 0.06, stone.z]}
          rotation={[-Math.PI / 2, 0, index * 0.3]}
          castShadow
          receiveShadow
        >
          <cylinderGeometry args={[stone.s, stone.s * 1.05, 0.12, 8]} />
          <meshStandardMaterial color="#8e8878" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function PathRibbon() {
  return (
    <group>
      {PATH.slice(0, -1).map(([x, z], index) => {
        const [nx, nz] = PATH[index + 1];
        const midX = (x + nx) / 2;
        const midZ = (z + nz) / 2;
        const y = heightAt(midX, midZ) + 0.03;
        const length = Math.hypot(nx - x, nz - z);
        const yaw = Math.atan2(nx - x, nz - z);
        return (
          <mesh key={index} position={[midX, y, midZ]} rotation={[-Math.PI / 2, 0, -yaw]} receiveShadow>
            <planeGeometry args={[0.95, length + 0.15]} />
            <meshStandardMaterial color="#b79a6a" roughness={0.98} />
          </mesh>
        );
      })}
      {PATH.map(([x, z], index) => (
        <mesh key={`reed-${index}`} position={[x + 0.55, heightAt(x + 0.55, z) + 0.28, z]}>
          <cylinderGeometry args={[0.025, 0.04, 0.56, 5]} />
          <meshStandardMaterial color="#7a8a3c" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function Wildflowers() {
  const spots = useMemo(
    () =>
      Array.from({ length: 70 }, (_, index) => {
        const angle = index * 2.399;
        const radius = 1.6 + (index % 9) * 0.85;
        const x = Math.cos(angle) * radius + (index % 3) * 0.2;
        const z = Math.sin(angle) * radius * 0.7 + 2.4;
        return {
          x,
          z,
          y: heightAt(x, z) + 0.04,
          color: index % 3 === 0 ? '#f4efe2' : '#e6c86a',
        };
      }),
    []
  );

  return (
    <group>
      {spots.map((spot, index) => (
        <mesh key={index} position={[spot.x, spot.y, spot.z]}>
          <sphereGeometry args={[0.035, 5, 4]} />
          <meshStandardMaterial color={spot.color} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

export default function Landmarks({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <group>
      <ListeningOak />
      <LogSeat />
      <RibbonCairn reducedMotion={reducedMotion} />
      <ReedBothy />
      <Waterwheel reducedMotion={reducedMotion} />
      <Coracle />
      <FordStones />
      <PathRibbon />
      <Wildflowers />
    </group>
  );
}
