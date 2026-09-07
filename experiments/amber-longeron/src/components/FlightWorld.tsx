import { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import type { Group } from 'three';
import {
  BANK_GAIN,
  DESPAWN_BEHIND,
  FIRST_SPAWN,
  LANE_LERP,
  PLANE_Y,
  SPAWN_AHEAD,
  clampLane,
  collide,
  flightSpeed,
  laneX,
  nextGap,
  spawnBeat
} from '../flight';
import type { Hazard, Lane, PlayState } from '../types';
import Biplane from './Biplane';
import Hazards from './Hazards';
import SkyRig from './SkyRig';

interface Props {
  state: PlayState;
  resetToken: number;
  reducedMotion: boolean;
  consumeLane: () => number;
  consumeStart: () => boolean;
  onStart: () => void;
  onCrash: () => void;
  onHud: (distance: number, rings: number, travelZ: number) => void;
}

interface Craft {
  x: number;
  z: number;
  y: number;
  bank: number;
  pitch: number;
  lane: Lane;
}

function freshCraft(): Craft {
  return { x: 0, z: 0, y: PLANE_Y, bank: 0, pitch: 0, lane: 1 };
}

export default function FlightWorld({
  state,
  resetToken,
  reducedMotion,
  consumeLane,
  consumeStart,
  onStart,
  onCrash,
  onHud
}: Props) {
  const craft = useRef<Craft>(freshCraft());
  const plane = useRef<Group>(null);
  const bag = useRef<Hazard[]>([]);
  const nextId = useRef(1);
  const nextSpawn = useRef(FIRST_SPAWN);
  const seed = useRef(1);
  const rings = useRef(0);
  const hudClock = useRef(0);
  const [items, setItems] = useState<Hazard[]>([]);
  const [travelZ, setTravelZ] = useState(0);
  const { camera } = useThree();

  useEffect(() => {
    craft.current = freshCraft();
    bag.current = [];
    nextId.current = 1;
    nextSpawn.current = FIRST_SPAWN;
    seed.current = 1 + resetToken * 97;
    rings.current = 0;
    while (nextSpawn.current < SPAWN_AHEAD) {
      seed.current += 1;
      const spawned = spawnBeat(nextId.current, nextSpawn.current, seed.current, 0);
      nextId.current = spawned.nextId;
      bag.current.push(...spawned.hazards);
      nextSpawn.current += nextGap(seed.current, 0);
    }
    setItems(bag.current.map((item) => ({ ...item })));
    setTravelZ(0);
    camera.position.set(0, 2.15, -5.1);
    camera.lookAt(0, 0.85, 5);
    onHud(0, 0, 0);
  }, [camera, onHud, resetToken]);

  useFrame((_, delta) => {
    const dt = Math.min(0.033, delta);
    const ship = craft.current;
    const laneStep = consumeLane();
    if (laneStep !== 0) {
      ship.lane = clampLane(ship.lane + laneStep);
      if (state === 'ready') onStart();
    }
    if (state === 'ready' && consumeStart()) onStart();

    const flying = state === 'flying';
    const crashed = state === 'crashed';
    if (flying) ship.z += flightSpeed(ship.z) * dt;

    const targetX = laneX(ship.lane);
    const follow = reducedMotion ? 1 : 1 - Math.exp(-LANE_LERP * dt);
    const prevX = ship.x;
    ship.x += (targetX - ship.x) * follow;
    const vx = (ship.x - prevX) / Math.max(dt, 0.0001);
    ship.bank += (-vx * BANK_GAIN * 0.08 - ship.bank) * (reducedMotion ? 1 : 0.14);
    ship.y += ((crashed ? 0.18 : PLANE_Y) - ship.y) * (reducedMotion ? 1 : 0.08);
    ship.pitch += ((crashed ? 0.55 : 0) - ship.pitch) * 0.08;

    if (flying) {
      while (nextSpawn.current < ship.z + SPAWN_AHEAD) {
        seed.current += 1;
        const spawned = spawnBeat(nextId.current, nextSpawn.current, seed.current, ship.z);
        nextId.current = spawned.nextId;
        bag.current.push(...spawned.hazards);
        nextSpawn.current += nextGap(seed.current, ship.z);
      }
      bag.current = bag.current.filter((item) => item.z > ship.z - DESPAWN_BEHIND);

      for (const item of bag.current) {
        if (item.taken || item.lane !== ship.lane) continue;
        if (!collide(item.kind, ship.z, item.z)) continue;
        if (item.kind === 'ring') {
          item.taken = true;
          rings.current += 1;
        } else {
          onCrash();
        }
      }
    }

    if (plane.current) {
      plane.current.position.set(ship.x, ship.y, ship.z);
      plane.current.rotation.set(ship.pitch, ship.bank * 0.22, ship.bank);
    }

    const boom = reducedMotion ? 1 : 0.16;
    camera.position.x += (ship.x * 0.28 - camera.position.x) * boom;
    camera.position.y += (2.15 + ship.y * 0.08 - camera.position.y) * boom;
    camera.position.z += (ship.z - 5.15 - camera.position.z) * boom;
    camera.lookAt(ship.x * 0.12, 0.88, ship.z + 6);

    hudClock.current += dt;
    if (hudClock.current > 0.07) {
      hudClock.current = 0;
      setItems(bag.current.map((item) => ({ ...item })));
      setTravelZ(ship.z);
      onHud(ship.z, rings.current, ship.z);
    }
  });

  return (
    <>
      <SkyRig />
      <group ref={plane} position={[0, PLANE_Y, 0]}>
        <Biplane crashed={state === 'crashed'} reducedMotion={reducedMotion} />
      </group>
      <Hazards items={items} />
      <LaneGuides travelZ={travelZ} />
    </>
  );
}

function LaneGuides({ travelZ }: { travelZ: number }) {
  return (
    <group>
      {[-2.2, 0, 2.2].map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.01, travelZ + 14]}>
          <planeGeometry args={[0.045, 46]} />
          <meshBasicMaterial color="#8a6a48" transparent opacity={0.2} />
        </mesh>
      ))}
    </group>
  );
}
