import type { ReactElement } from 'react';
import { lane } from '../palette';
import type { Stop, StopId } from '../itinerary';
import {
  ActiveGlow,
  Awning,
  Bicycle,
  Clothesline,
  Coop,
  Crate,
  Fern,
  FigTree,
  House,
  Pigeon,
  RainBarrel,
  Well,
  Wood,
} from './Kit';

interface LandmarkProps {
  active: boolean;
  reducedMotion: boolean;
}

function LaundryCourt({ active, reducedMotion }: LandmarkProps) {
  return (
    <group>
      <ActiveGlow active={active} />
      <House width={5.2} depth={3.4} height={4.2} plaster={lane.plasterWarm} bays={3} />
      <group position={[0, 0, 2.4]}>
        <Clothesline length={4.8} sheets={5} reducedMotion={reducedMotion} />
      </group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 1.8]} receiveShadow>
        <circleGeometry args={[2.4, 24]} />
        <meshStandardMaterial color={lane.earth} roughness={0.96} />
      </mesh>
    </group>
  );
}

function BicycleShedPlace({ active }: LandmarkProps) {
  return (
    <group>
      <ActiveGlow active={active} />
      <House width={4.4} depth={3.1} height={3.6} plaster={lane.plasterCool} bays={2} storeys={1} door={false} />
      <group position={[1.7, 0, 2.15]} rotation={[0, -0.2, 0]}>
        <mesh position={[0, 1.15, 0]} rotation={[0, 0, 0.18]} castShadow>
          <boxGeometry args={[2.6, 0.06, 1.5]} />
          <meshStandardMaterial color="#8a8f86" roughness={0.45} metalness={0.25} />
        </mesh>
        {[-1.15, 1.15].map((x) => (
          <mesh key={x} position={[x, 0.7, 0.55]} castShadow>
            <cylinderGeometry args={[0.04, 0.045, 1.4, 6]} />
            <Wood />
          </mesh>
        ))}
        <group position={[-0.45, 0, 0.2]} rotation={[0, 0.15, 0]}>
          <Bicycle lean={0.06} />
        </group>
        <group position={[0.55, 0, -0.15]} rotation={[0, -0.22, 0]}>
          <Bicycle lean={-0.04} />
        </group>
      </group>
    </group>
  );
}

function CourtyardWellPlace({ active }: LandmarkProps) {
  return (
    <group>
      <ActiveGlow active={active} />
      <House width={5.6} depth={3.2} height={3.9} plaster={lane.plaster} bays={3} />
      <group position={[0, 0, 2.35]}>
        <Well />
      </group>
      <group position={[-1.7, 0, 2.8]}>
        <Fern scale={1.15} />
      </group>
    </group>
  );
}

function ShopAwningPlace({ active }: LandmarkProps) {
  return (
    <group>
      <ActiveGlow active={active} />
      <House width={5.4} depth={3.3} height={4.4} plaster={lane.plasterWarm} bays={3} storeys={2} door={false} />
      <mesh position={[0, 1.15, 1.72]} castShadow>
        <boxGeometry args={[2.1, 2.1, 0.12]} />
        <Wood />
      </mesh>
      <mesh position={[0, 1.15, 1.78]}>
        <boxGeometry args={[1.7, 1.7, 0.04]} />
        <meshStandardMaterial color="#1f2a28" roughness={0.35} metalness={0.08} />
      </mesh>
      <group position={[0, 2.35, 2.15]}>
        <Awning width={3.6} depth={1.4} />
      </group>
      <group position={[-0.7, 0, 2.15]}>
        <Crate />
      </group>
      <group position={[-0.22, 0, 2.35]}>
        <Crate />
      </group>
      <group position={[0.85, 0, 2.2]}>
        <Crate />
      </group>
      <mesh position={[0.85, 0.42, 2.2]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color="#d25a3a" roughness={0.55} />
      </mesh>
      <mesh position={[0.72, 0.4, 2.32]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#e0c04a" roughness={0.5} />
      </mesh>
    </group>
  );
}

function WindowFernPlace({ active }: LandmarkProps) {
  return (
    <group>
      <ActiveGlow active={active} />
      <House width={4.8} depth={3.2} height={4.6} plaster={lane.plasterCool} bays={2} storeys={2} />
      <mesh position={[0, 2.55, 1.85]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.1, 0.7]} />
        <Wood color={lane.woodLight} />
      </mesh>
      {[-0.7, 0, 0.7].map((x) => (
        <group key={x} position={[x, 2.58, 1.85]}>
          <Fern scale={0.85} />
        </group>
      ))}
      <mesh position={[0, 3.15, 1.72]} castShadow>
        <boxGeometry args={[2.35, 1.15, 0.08]} />
        <Wood />
      </mesh>
    </group>
  );
}

function RooftopPigeonPlace({ active }: LandmarkProps) {
  return (
    <group>
      <ActiveGlow active={active} />
      <House width={5.1} depth={3.6} height={4.8} plaster={lane.plaster} bays={3} storeys={2} />
      <group position={[0.15, 5.95, 0.15]} scale={1.15}>
        <Coop />
        <group position={[-0.55, 0.62, 0.28]} scale={1.35}>
          <Pigeon hue="#cfc8bc" />
        </group>
        <group position={[0.15, 0.64, -0.1]} rotation={[0, 0.8, 0]} scale={1.3}>
          <Pigeon hue="#b8b4ae" />
        </group>
        <group position={[0.55, 0.58, 0.46]} rotation={[0, -0.4, 0]} scale={1.4}>
          <Pigeon hue="#d4cfc4" />
        </group>
      </group>
    </group>
  );
}

function EveningLaundryPlace({ active, reducedMotion }: LandmarkProps) {
  return (
    <group>
      <ActiveGlow active={active} />
      <House width={4.6} depth={3.1} height={4.1} plaster={lane.plasterShade} bays={2} />
      <group position={[2.6, 0, 0.4]} rotation={[0, -0.4, 0]}>
        <House width={3.6} depth={2.6} height={3.5} plaster={lane.plasterWarm} bays={2} storeys={1} door={false} />
      </group>
      <group position={[1.35, 0, 0.85]} rotation={[0, 0.55, 0]}>
        <Clothesline length={3.8} sheets={4} reducedMotion={reducedMotion} warm />
      </group>
      <pointLight position={[0.6, 2.2, 2.1]} color={lane.amber} intensity={2.4} distance={8} />
    </group>
  );
}

function FigAlleyPlace({ active }: LandmarkProps) {
  return (
    <group>
      <ActiveGlow active={active} />
      <House width={4.4} depth={3.2} height={4.0} plaster={lane.plasterCool} bays={2} />
      <group position={[0.85, 0, 2.55]} scale={1.28}>
        <FigTree />
      </group>
      <group position={[-0.85, 0, 2.35]}>
        <RainBarrel />
      </group>
      <group position={[2.05, 0, 1.7]}>
        <Fern scale={1.05} />
      </group>
    </group>
  );
}

const PLACES: Record<StopId, (props: LandmarkProps) => ReactElement> = {
  'laundry-court': LaundryCourt,
  'bicycle-shed': BicycleShedPlace,
  'courtyard-well': CourtyardWellPlace,
  'shop-awning': ShopAwningPlace,
  'window-fern': WindowFernPlace,
  'rooftop-pigeon': RooftopPigeonPlace,
  'evening-laundry': EveningLaundryPlace,
  'fig-alley': FigAlleyPlace,
};

export default function Places({
  stops,
  activeId,
  reducedMotion,
}: {
  stops: Stop[];
  activeId: StopId;
  reducedMotion: boolean;
}) {
  return (
    <group>
      {stops.map((stop) => {
        const Place = PLACES[stop.id];
        return (
          <group key={stop.id} position={stop.position} rotation={[0, stop.yaw * 0.12, 0]}>
            <Place active={stop.id === activeId} reducedMotion={reducedMotion} />
          </group>
        );
      })}
    </group>
  );
}
