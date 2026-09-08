import type { ReactElement } from 'react';
import { chalk } from '../palette';
import type { Stop, StopId } from '../itinerary';
import { ActiveRing, BarrelRing, Column, Pediment, Pier, Steps, Stone } from './Primitives';

interface LandmarkProps {
  active: boolean;
}

function IvoryArch({ active }: LandmarkProps) {
  const pierH = 6.2;
  return (
    <group>
      <ActiveRing active={active} />
      <Steps count={3} width={8.4} />
      {[-2.15, 2.15].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <Pier width={1.7} height={pierH} depth={2.15} />
          {[-0.55, 0.55].map((z) => (
            <mesh key={z} position={[0, pierH * 0.55, z]} castShadow>
              <boxGeometry args={[1.86, pierH * 0.72, 0.12]} />
              <Stone color={chalk.lintel} roughness={0.8} />
            </mesh>
          ))}
        </group>
      ))}
      <mesh position={[0, pierH + 0.28, 0]} castShadow>
        <boxGeometry args={[6.3, 0.56, 2.35]} />
        <Stone color={chalk.stone} />
      </mesh>
      <group position={[0, pierH - 0.15, 0]}>
        <BarrelRing radius={1.85} tube={0.28} />
      </group>
      <mesh position={[0, pierH + 1.35, 0]} castShadow>
        <boxGeometry args={[6.8, 1.55, 2.55]} />
        <Stone color={chalk.ash} roughness={0.84} />
      </mesh>
      {[-2.4, -0.8, 0.8, 2.4].map((x) => (
        <mesh key={x} position={[x, pierH + 1.35, 1.22]} castShadow>
          <boxGeometry args={[0.55, 0.85, 0.12]} />
          <Stone color={chalk.shadow} />
        </mesh>
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <mesh key={`dentil-${i}`} position={[-3 + i * 0.75, pierH + 2.22, 1.2]}>
          <boxGeometry args={[0.18, 0.16, 0.18]} />
          <Stone color={chalk.lintel} />
        </mesh>
      ))}
    </group>
  );
}

function ChalkForum({ active }: LandmarkProps) {
  const posts = [-5.2, -2.6, 0, 2.6, 5.2];
  return (
    <group>
      <ActiveRing active={active} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[14, 12]} />
        <Stone color={chalk.avenue} roughness={0.95} />
      </mesh>
      {posts.map((x) =>
        [-4.6, 4.6].map((z) => (
          <group key={`${x}:${z}`} position={[x, 0, z]}>
            <Column height={3.4} radius={0.18} />
          </group>
        ))
      )}
      {[-4.6, 4.6].map((z) => (
        <mesh key={`beam-${z}`} position={[0, 3.55, z]} castShadow>
          <boxGeometry args={[11.2, 0.22, 0.55]} />
          <Stone color={chalk.lintel} />
        </mesh>
      ))}
      {[-5.2, 5.2].map((x) => (
        <group key={`end-${x}`} position={[x, 0, 0]}>
          <Column height={3.4} radius={0.18} />
          <mesh position={[0, 3.55, 0]} castShadow>
            <boxGeometry args={[0.55, 0.22, 9.4]} />
            <Stone color={chalk.lintel} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.55, 0.4]} castShadow receiveShadow>
        <boxGeometry args={[2.6, 1.1, 1.8]} />
        <Stone color={chalk.ash} />
      </mesh>
      <mesh position={[0, 1.25, 0.4]} castShadow>
        <boxGeometry args={[2.1, 0.18, 1.35]} />
        <Stone color={chalk.lintel} />
      </mesh>
    </group>
  );
}

function PaleObelisk({ active }: LandmarkProps) {
  return (
    <group>
      <ActiveRing active={active} />
      <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.4, 0.56, 3.4]} />
        <Stone color={chalk.ash} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.85, 0]} castShadow>
        <boxGeometry args={[2.35, 0.55, 2.35]} />
        <Stone color={chalk.stone} />
      </mesh>
      {[0, 1, 2, 3].map((i) => {
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
        return (
          <mesh key={i} position={[Math.cos(a) * 1.45, 0.55, Math.sin(a) * 1.45]} castShadow>
            <boxGeometry args={[0.42, 0.7, 0.7]} />
            <Stone color={chalk.shadow} />
          </mesh>
        );
      })}
      <mesh position={[0, 6.4, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.78, 10.2, 4]} />
        <Stone color={chalk.stone} roughness={0.78} />
      </mesh>
      <mesh position={[0, 11.85, 0]} castShadow>
        <coneGeometry args={[0.28, 0.7, 4]} />
        <Stone color={chalk.pewter} roughness={0.45} />
      </mesh>
    </group>
  );
}

function AlabasterGate({ active }: LandmarkProps) {
  return (
    <group>
      <ActiveRing active={active} />
      {[-3.15, 3.15].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <Pier width={2.35} height={7.4} depth={2.5} color={chalk.ash} />
          <mesh position={[0, 5.2, 1.3]} castShadow>
            <boxGeometry args={[1.1, 1.35, 0.12]} />
            <Stone color={chalk.shadow} />
          </mesh>
          {[-0.7, 0, 0.7].map((mx) => (
            <mesh key={mx} position={[mx, 7.65, 0]} castShadow>
              <boxGeometry args={[0.55, 0.55, 0.55]} />
              <Stone color={chalk.lintel} />
            </mesh>
          ))}
        </group>
      ))}
      <mesh position={[0, 6.55, 0]} castShadow>
        <boxGeometry args={[4.2, 1.15, 2.2]} />
        <Stone color={chalk.stone} />
      </mesh>
      <group position={[0, 4.15, 0]}>
        <BarrelRing radius={1.55} tube={0.26} />
      </group>
      <mesh position={[0, 2.05, 0.08]} castShadow>
        <boxGeometry args={[2.55, 4.1, 0.16]} />
        <Stone color={chalk.shadow} roughness={0.92} />
      </mesh>
    </group>
  );
}

function MilkColonnade({ active }: LandmarkProps) {
  const bays = Array.from({ length: 8 }, (_, i) => (i - 3.5) * 1.55);
  return (
    <group>
      <ActiveRing active={active} />
      {bays.map((x) =>
        [-1.15, 1.15].map((z) => (
          <group key={`${x}:${z}`} position={[x, 0, z]}>
            <Column height={4.15} radius={0.17} />
          </group>
        ))
      )}
      <mesh position={[0, 4.28, 0]} castShadow>
        <boxGeometry args={[12.4, 0.28, 2.85]} />
        <Stone color={chalk.lintel} />
      </mesh>
      <mesh position={[0, 4.62, 0]} castShadow>
        <boxGeometry args={[12.7, 0.22, 3.1]} />
        <Stone color={chalk.ash} />
      </mesh>
      {bays.map((x) => (
        <mesh key={`coff-${x}`} position={[x, 4.12, 0]}>
          <boxGeometry args={[1.05, 0.08, 1.7]} />
          <Stone color={chalk.shadow} />
        </mesh>
      ))}
    </group>
  );
}

function PumiceBridge({ active }: LandmarkProps) {
  return (
    <group>
      <ActiveRing active={active} />
      <mesh position={[0, -0.55, 0]} receiveShadow>
        <boxGeometry args={[3.2, 0.7, 14]} />
        <Stone color={chalk.shadow} roughness={0.95} />
      </mesh>
      {[-4.2, 0, 4.2].map((z) => (
        <group key={z} position={[0, 1.35, z]}>
          <BarrelRing radius={1.45} tube={0.32} color={chalk.ash} />
          {[-1.7, 1.7].map((x) => (
            <Pier key={x} width={0.7} height={2.4} depth={0.85} />
          ))}
        </group>
      ))}
      <mesh position={[0, 2.85, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.8, 0.32, 13.4]} />
        <Stone color={chalk.stone} />
      </mesh>
      {[-1.7, 1.7].map((x) => (
        <mesh key={`rail-${x}`} position={[x, 3.25, 0]} castShadow>
          <boxGeometry args={[0.16, 0.42, 13.2]} />
          <Stone color={chalk.lintel} />
        </mesh>
      ))}
    </group>
  );
}

function BoneTheatre({ active }: LandmarkProps) {
  return (
    <group>
      <ActiveRing active={active} />
      {Array.from({ length: 5 }, (_, row) => (
        <mesh
          key={row}
          position={[0, 0.22 + row * 0.38, 0.4]}
          rotation={[0, -Math.PI / 2, 0]}
          castShadow
          receiveShadow
        >
          <cylinderGeometry args={[3.1 + row * 0.85, 3.35 + row * 0.85, 0.34, 18, 1, false, 0, Math.PI]} />
          <Stone color={row % 2 === 0 ? chalk.stone : chalk.ash} roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[0, 1.7, -3.35]} castShadow>
        <boxGeometry args={[9.2, 3.4, 0.55]} />
        <Stone color={chalk.ash} />
      </mesh>
      {[-2.4, 0, 2.4].map((x) => (
        <mesh key={x} position={[x, 2.05, -3.05]} castShadow>
          <boxGeometry args={[1.35, 1.55, 0.12]} />
          <Stone color={chalk.shadow} />
        </mesh>
      ))}
      {[-3.6, 3.6].map((x) => (
        <mesh key={`vom-${x}`} position={[x, 0.85, 0.2]} castShadow>
          <boxGeometry args={[1.15, 1.7, 1.4]} />
          <Stone color={chalk.lintel} />
        </mesh>
      ))}
    </group>
  );
}

function QuartzSpire({ active }: LandmarkProps) {
  const storeys = [
    { y: 1.35, s: 4.2, h: 2.7 },
    { y: 3.85, s: 3.25, h: 2.3 },
    { y: 5.95, s: 2.35, h: 1.95 },
    { y: 7.75, s: 1.55, h: 1.65 },
  ];
  return (
    <group>
      <ActiveRing active={active} />
      <Steps count={4} width={5.4} />
      {storeys.map((storey, i) => (
        <group key={i} position={[0, storey.y, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[storey.s, storey.h, storey.s]} />
            <Stone color={i % 2 === 0 ? chalk.stone : chalk.ash} />
          </mesh>
          {[-1, 1].map((side) => (
            <mesh key={side} position={[0, 0.05, (storey.s / 2 + 0.04) * side]} castShadow>
              <boxGeometry args={[storey.s * 0.28, storey.h * 0.42, 0.08]} />
              <Stone color={chalk.shadow} />
            </mesh>
          ))}
        </group>
      ))}
      <mesh position={[0, 9.15, 0]} castShadow>
        <cylinderGeometry args={[0.55, 0.7, 0.7, 10]} />
        <Stone color={chalk.lintel} />
      </mesh>
      <mesh position={[0, 9.85, 0]} castShadow>
        <sphereGeometry args={[0.62, 14, 10]} />
        <Stone color={chalk.stone} roughness={0.7} />
      </mesh>
    </group>
  );
}

function LinenBasilica({ active }: LandmarkProps) {
  return (
    <group>
      <ActiveRing active={active} />
      <Steps count={4} width={7.2} />
      <mesh position={[0, 2.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[5.4, 4.3, 11.2]} />
        <Stone color={chalk.stone} />
      </mesh>
      {[-3.45, 3.45].map((x) => (
        <mesh key={x} position={[x, 1.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.35, 2.9, 10.6]} />
          <Stone color={chalk.ash} />
        </mesh>
      ))}
      {[-2.4, -0.8, 0.8, 2.4].map((x) => (
        <group key={x} position={[x, 0, 5.55]}>
          <Column height={3.6} radius={0.16} />
        </group>
      ))}
      <mesh position={[0, 3.85, 5.55]} castShadow>
        <boxGeometry args={[6.4, 0.24, 0.7]} />
        <Stone color={chalk.lintel} />
      </mesh>
      <group position={[0, 4.85, 5.7]}>
        <Pediment width={6.8} depth={1.55} height={1.35} />
      </group>
      {[-3.6, -1.2, 1.2, 3.6].map((z) => (
        <mesh key={`cler-${z}`} position={[0, 3.55, z]} castShadow>
          <boxGeometry args={[2.4, 0.7, 0.12]} />
          <Stone color={chalk.shadow} />
        </mesh>
      ))}
    </group>
  );
}

function CloudRotunda({ active }: LandmarkProps) {
  const cols = Array.from({ length: 12 }, (_, i) => (i / 12) * Math.PI * 2);
  return (
    <group>
      <ActiveRing active={active} />
      <Steps count={4} width={8.2} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]} receiveShadow>
        <circleGeometry args={[4.6, 28]} />
        <Stone color={chalk.avenue} roughness={0.94} />
      </mesh>
      {cols.map((a) => (
        <group key={a} position={[Math.cos(a) * 3.35, 0, Math.sin(a) * 3.35]}>
          <Column height={4.35} radius={0.18} />
        </group>
      ))}
      <mesh position={[0, 4.55, 0]} castShadow>
        <cylinderGeometry args={[3.7, 3.7, 0.55, 24]} />
        <Stone color={chalk.lintel} />
      </mesh>
      <mesh position={[0, 5.15, 0]} castShadow>
        <cylinderGeometry args={[3.15, 3.35, 0.85, 22]} />
        <Stone color={chalk.ash} />
      </mesh>
      <mesh position={[0, 7.05, 0]} scale={[1, 0.72, 1]} castShadow>
        <sphereGeometry args={[3.25, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <Stone color={chalk.stone} roughness={0.72} />
      </mesh>
      <mesh position={[0, 9.25, 0]}>
        <cylinderGeometry args={[0.55, 0.7, 0.22, 14]} />
        <meshStandardMaterial color={chalk.fill} roughness={0.4} emissive={chalk.fill} emissiveIntensity={0.18} />
      </mesh>
    </group>
  );
}

const MESH: Record<StopId, (props: LandmarkProps) => ReactElement> = {
  'ivory-arch': IvoryArch,
  'chalk-forum': ChalkForum,
  'pale-obelisk': PaleObelisk,
  'alabaster-gate': AlabasterGate,
  'milk-colonnade': MilkColonnade,
  'pumice-bridge': PumiceBridge,
  'bone-theatre': BoneTheatre,
  'quartz-spire': QuartzSpire,
  'linen-basilica': LinenBasilica,
  'cloud-rotunda': CloudRotunda,
};

export default function Landmarks({
  stops,
  activeId,
}: {
  stops: Stop[];
  activeId: StopId;
}) {
  return (
    <group>
      {stops.map((stop) => {
        const Mesh = MESH[stop.id];
        return (
          <group key={stop.id} position={stop.position} rotation={[0, stop.yaw * 0.15, 0]}>
            <Mesh active={stop.id === activeId} />
          </group>
        );
      })}
    </group>
  );
}
