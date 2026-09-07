import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending } from 'three';
import { castById } from '../casts';
import type { CastEvent, CastQueueRef, PlayerRef } from '../types';

interface Props {
  player: PlayerRef;
  casts: CastQueueRef;
  reducedMotion: boolean;
}

function ageOf(event: CastEvent): number {
  return (performance.now() - event.startedAt) / 1000;
}

function VineLash({ event, t }: { event: CastEvent; t: number }) {
  const fade = Math.max(0, 1 - t / 1.8);
  return (
    <group position={[event.x, 0.2, event.z]} rotation={[0, event.yaw, 0]}>
      {Array.from({ length: 8 }, (_, index) => {
        const angle = (index / 8) * Math.PI * 2;
        const length = 0.4 + t * 2.6;
        return (
          <mesh
            key={index}
            position={[Math.sin(angle) * length * 0.5, 0.08 + index * 0.02, Math.cos(angle) * length * 0.5]}
            rotation={[0.15, angle, 0.4]}
            scale={[1, 1, fade]}
          >
            <cylinderGeometry args={[0.02, 0.045, length, 5]} />
            <meshStandardMaterial color="#3f6a38" roughness={0.7} emissive="#1c3a18" emissiveIntensity={0.4} />
          </mesh>
        );
      })}
    </group>
  );
}

function SporeBloom({ event, t }: { event: CastEvent; t: number }) {
  const fade = Math.max(0, 1 - t / 2.1);
  return (
    <group position={[event.x, 0.9, event.z]}>
      {Array.from({ length: 22 }, (_, index) => {
        const angle = (index / 22) * Math.PI * 2;
        const lift = 0.2 + t * 1.15 + (index % 5) * 0.08;
        const radius = 0.3 + t * 1.7;
        return (
          <mesh
            key={index}
            position={[Math.cos(angle) * radius, lift, Math.sin(angle) * radius]}
          >
            <sphereGeometry args={[0.035, 6, 5]} />
            <meshBasicMaterial color="#d6e8a8" transparent opacity={0.55 * fade} />
          </mesh>
        );
      })}
    </group>
  );
}

function RootPulse({ event, t }: { event: CastEvent; t: number }) {
  const fade = Math.max(0, 1 - t / 1.6);
  const radius = 0.45 + t * 4.6;
  return (
    <mesh position={[event.x, 0.06, event.z]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[Math.max(0.05, radius - 0.18), radius, 36]} />
      <meshBasicMaterial color="#8f6a3a" transparent opacity={0.7 * fade} />
    </mesh>
  );
}

function AmberHeart({ event, t }: { event: CastEvent; t: number }) {
  const fade = Math.max(0, 1 - t / 1.5);
  return (
    <group position={[event.x, 1.08, event.z]}>
      <mesh scale={0.4 + t * 2.4}>
        <sphereGeometry args={[0.28, 12, 10]} />
        <meshBasicMaterial color="#ffb45a" transparent opacity={0.22 * fade} depthWrite={false} />
      </mesh>
      <pointLight color="#ff9a32" intensity={2.4 * fade} distance={7} />
    </group>
  );
}

function MossVeil({ event, t }: { event: CastEvent; t: number }) {
  const fade = Math.max(0, 1 - t / 2.4);
  return (
    <group position={[event.x, 1.1, event.z]}>
      {Array.from({ length: 16 }, (_, index) => {
        const angle = (index / 16) * Math.PI * 2 + t * 1.4;
        const radius = 0.55 + Math.sin(t * 3 + index) * 0.12;
        return (
          <mesh key={index} position={[Math.cos(angle) * radius, Math.sin(index + t) * 0.35, Math.sin(angle) * radius]}>
            <sphereGeometry args={[0.05, 6, 5]} />
            <meshBasicMaterial color="#6ea85a" transparent opacity={0.5 * fade} />
          </mesh>
        );
      })}
    </group>
  );
}

function CanopyBind({ event, t }: { event: CastEvent; t: number }) {
  const fade = Math.max(0, 1 - t / 2);
  const open = Math.min(1, t * 1.6);
  return (
    <group position={[event.x, 2.15, event.z]}>
      {Array.from({ length: 6 }, (_, index) => {
        const angle = (index / 6) * Math.PI * 2;
        return (
          <mesh key={index} rotation={[0.9, angle, 0]} scale={[open, open, open]}>
            <torusGeometry args={[0.95, 0.03, 5, 16, Math.PI]} />
            <meshStandardMaterial color="#3a2a1c" roughness={0.8} transparent opacity={fade} />
          </mesh>
        );
      })}
    </group>
  );
}

function NightDew({ event, t }: { event: CastEvent; t: number }) {
  const fade = Math.max(0, 1 - t / 2.2);
  return (
    <group position={[event.x, 2.8, event.z]}>
      {Array.from({ length: 18 }, (_, index) => {
        const angle = (index / 18) * Math.PI * 2;
        const drop = t * 1.7 + (index % 4) * 0.12;
        return (
          <mesh key={index} position={[Math.cos(angle) * 0.7, -drop, Math.sin(angle) * 0.7]}>
            <sphereGeometry args={[0.028, 6, 5]} />
            <meshBasicMaterial color="#cfe6ff" transparent opacity={0.7 * fade} />
          </mesh>
        );
      })}
    </group>
  );
}

function HeartwoodChoir({ event, t }: { event: CastEvent; t: number }) {
  const fade = Math.max(0, 1 - t / 2);
  return (
    <group position={[event.x, 0.08, event.z]}>
      {[0, 1, 2, 3].map((index) => {
        const radius = 0.5 + t * 1.4 + index * 0.28;
        return (
          <mesh key={index} position={[0, 0.05 + index * 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[Math.max(0.04, radius - 0.08), radius, 28]} />
            <meshBasicMaterial color="#c4a06a" transparent opacity={(0.55 - index * 0.08) * fade} />
          </mesh>
        );
      })}
    </group>
  );
}

function MoonGraft({ event, t }: { event: CastEvent; t: number }) {
  const fade = Math.max(0, 1 - t / 2.3);
  return (
    <group position={[event.x, 4.2, event.z]}>
      <mesh>
        <cylinderGeometry args={[0.22 + t * 0.12, 0.55, 8.2, 12, 1, true]} />
        <meshBasicMaterial
          color="#d5e4f6"
          transparent
          opacity={0.16 * fade}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <pointLight color="#d5e4f6" intensity={1.8 * fade} distance={8} />
    </group>
  );
}

function CastFx({ event }: { event: CastEvent }) {
  switch (event.id) {
    case 'vine-lash':
      return <VineLash event={event} t={ageOf(event)} />;
    case 'spore-bloom':
      return <SporeBloom event={event} t={ageOf(event)} />;
    case 'root-pulse':
      return <RootPulse event={event} t={ageOf(event)} />;
    case 'amber-heart':
      return <AmberHeart event={event} t={ageOf(event)} />;
    case 'moss-veil':
      return <MossVeil event={event} t={ageOf(event)} />;
    case 'canopy-bind':
      return <CanopyBind event={event} t={ageOf(event)} />;
    case 'night-dew':
      return <NightDew event={event} t={ageOf(event)} />;
    case 'heartwood-choir':
      return <HeartwoodChoir event={event} t={ageOf(event)} />;
    case 'moon-graft':
      return <MoonGraft event={event} t={ageOf(event)} />;
    default:
      return null;
  }
}

function TickingCast({ event, onDone }: { event: CastEvent; onDone: (token: number) => void }) {
  const last = useRef(-1);
  const [, setTick] = useState(0);

  useFrame(() => {
    const age = ageOf(event);
    if (age > castById(event.id).duration) {
      onDone(event.token);
      return;
    }
    const step = Math.floor(age * 24);
    if (step === last.current) return;
    last.current = step;
    setTick(step);
  });

  if (event.id === 'lantern-call') return null;
  return <CastFx event={event} />;
}

export default function CastField({ player, casts, reducedMotion }: Props) {
  const [active, setActive] = useState<CastEvent[]>([]);

  useFrame(() => {
    if (!casts.current.length) return;
    const incoming = casts.current.splice(0);
    incoming.forEach((event) => {
      player.current.lastCast = event.id;
      if (event.id === 'lantern-call') player.current.lanternPull = 1;
    });
    setActive((current) => [...current, ...incoming].slice(-10));
  });

  const finish = (token: number) => {
    setActive((current) => current.filter((event) => event.token !== token));
  };

  useEffect(() => {
    if (!reducedMotion) return;
    setActive((current) => current.slice(-2));
  }, [reducedMotion]);

  return (
    <>
      {active.map((event) => (
        <TickingCast key={event.token} event={event} onDone={finish} />
      ))}
    </>
  );
}
