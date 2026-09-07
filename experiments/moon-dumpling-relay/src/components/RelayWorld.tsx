import { ContactShadows, Environment, Lightformer } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import { Group } from 'three';
import { playCue } from '../audio';
import { DINERS, dinerById } from '../diners';
import {
  actorStatus,
  angularNear,
  applyBite,
  chooseAiTarget,
  CONVEYOR_RADIUS,
  CONVEYOR_SPEED,
  COUNTDOWN_SECONDS,
  EAT_ARC,
  ROUND_SECONDS,
  seatActors,
  seedPlates,
  shortestDelta,
  slotAngle,
  stepActor,
  TABLE_Y,
  tryDash,
  WALK_RADIUS,
} from '../sim';
import type { ActorState, HudSnapshot, InputState, Phase, PlateState } from '../types';
import DinerMesh from './DinerMesh';
import PlateMesh from './PlateMesh';

interface Props {
  phase: Phase;
  selectedId: string;
  reducedMotion: boolean;
  input: MutableRefObject<InputState>;
  onHud: (snapshot: HudSnapshot) => void;
  onPhase: (phase: Phase) => void;
  onSelect: (id: string) => void;
  resetToken: number;
}

interface Sim {
  phase: Phase;
  selectedId: string;
  clock: number;
  spin: number;
  actors: ActorState[];
  plates: PlateState[];
  lastBite: string;
  seed: number;
  seated: boolean;
}

export default function RelayWorld({
  phase,
  selectedId,
  reducedMotion,
  input,
  onHud,
  onPhase,
  onSelect,
  resetToken,
}: Props) {
  const ring = useRef<Group>(null);
  const dinerRefs = useRef<Record<string, Group | null>>({});
  const plateRefs = useRef<Record<number, Group | null>>({});
  const hudBeat = useRef(0);
  const sim = useRef<Sim>(makeSim(selectedId, resetToken));
  const phaseRef = useRef(phase);
  const selectedRef = useRef(selectedId);
  phaseRef.current = phase;
  selectedRef.current = selectedId;

  useEffect(() => {
    sim.current = makeSim(selectedId, resetToken);
  }, [resetToken]);

  const lanterns = useMemo(
    () =>
      [0, 1, 2, 3].map((index) => {
        const angle = (index / 4) * Math.PI * 2 + 0.4;
        return { x: Math.cos(angle) * 4.6, z: Math.sin(angle) * 4.6 };
      }),
    []
  );

  useFrame((_, delta) => {
    const state = sim.current;
    const dt = Math.min(0.05, delta);
    const livePhase = phaseRef.current;
    state.phase = livePhase;
    state.selectedId = selectedRef.current;
    const now = state.clock;
    const spinRate = reducedMotion ? CONVEYOR_SPEED * 0.35 : CONVEYOR_SPEED;

    if (livePhase === 'select') {
      state.seated = false;
      state.spin += spinRate * 0.45 * dt;
      state.actors = DINERS.map((diner, index) => ({
        ...seatActors(diner.id)[0],
        dinerId: diner.id,
        angle: (index / DINERS.length) * Math.PI * 2 - Math.PI / 2,
        isPlayer: diner.id === selectedRef.current,
        ai: null,
      }));
    } else {
      if (!state.seated) {
        state.actors = seatActors(selectedRef.current);
        state.seated = true;
        state.clock = 0;
      }

      if (livePhase === 'countdown') {
        state.clock += dt;
        state.spin += spinRate * 0.6 * dt;
        if (state.clock >= COUNTDOWN_SECONDS) {
          state.clock = 0;
          onPhase('play');
          playCue('bell');
        }
      } else if (livePhase === 'play') {
        state.clock += dt;
        state.spin += spinRate * dt;

        const player = state.actors.find((actor) => actor.isPlayer);
        if (player) {
          const steer = (input.current.right ? 1 : 0) - (input.current.left ? 1 : 0);
          stepActor(player, steer, now, dt);
          if (input.current.dash && tryDash(player, now)) playCue('dash');
          if (input.current.eat && now >= player.eatUntil) {
            const bite = eatNearest(player, state.plates, state.spin, now, state.seed);
            if (bite) {
              state.lastBite = bite;
              state.seed += 3;
            }
          }
        }

        for (const actor of state.actors) {
          if (actor.isPlayer) continue;
          const target = chooseAiTarget(actor, state.plates, state.spin, now);
          if (target == null) continue;
          const deltaAngle = shortestDelta(actor.angle, target);
          const steer = Math.abs(deltaAngle) < 0.04 ? 0 : Math.sign(deltaAngle);
          stepActor(actor, steer, now, dt);
          if (Math.abs(deltaAngle) < 0.16 && now >= actor.eatUntil) {
            const bite = eatNearest(actor, state.plates, state.spin, now, state.seed + 5);
            if (bite) state.seed += 1;
          }
        }

        if (state.clock >= ROUND_SECONDS) {
          playCue('bell');
          onPhase('results');
        }
      } else {
        state.spin += spinRate * 0.2 * dt;
      }
    }

    if (ring.current) ring.current.rotation.y = state.spin;

    for (const actor of state.actors) {
      const node = dinerRefs.current[actor.dinerId];
      if (!node) continue;
      node.position.set(Math.cos(actor.angle) * WALK_RADIUS, 0, Math.sin(actor.angle) * WALK_RADIUS);
      node.rotation.y = -actor.angle - Math.PI / 2;
      node.visible = true;
    }

    for (const diner of DINERS) {
      const node = dinerRefs.current[diner.id];
      if (!node) continue;
      if (!state.actors.some((actor) => actor.dinerId === diner.id)) node.visible = false;
    }

    for (const plate of state.plates) {
      const node = plateRefs.current[plate.id];
      if (!node) continue;
      node.visible = now >= plate.hiddenUntil || livePhase === 'select';
    }

    hudBeat.current += dt;
    if (hudBeat.current > 0.09) {
      hudBeat.current = 0;
      const player = state.actors.find((actor) => actor.isPlayer) ?? null;
      onHud({
        phase: livePhase,
        selectedId: selectedRef.current,
        countdown: livePhase === 'countdown' ? Math.max(0, COUNTDOWN_SECONDS - state.clock) : 0,
        remaining: livePhase === 'play' ? Math.max(0, ROUND_SECONDS - state.clock) : ROUND_SECONDS,
        muted: false,
        player,
        rivals: state.actors.filter((actor) => !actor.isPlayer),
        roster: state.actors,
        status: player ? actorStatus(player, now) : 'clear',
        lastBite: state.lastBite,
      });
    }
  });

  return (
    <>
      <color attach="background" args={['#070910']} />
      <fog attach="fog" args={['#070910', 9, 22]} />
      <ambientLight intensity={0.16} />
      <spotLight
        position={[3.2, 7.2, 4.1]}
        angle={0.48}
        penumbra={0.7}
        intensity={42}
        color="#fff1d6"
        castShadow
        shadow-mapSize={1024}
      />
      <spotLight position={[-4.2, 3.4, -2.6]} angle={0.6} penumbra={0.8} intensity={10} color="#7f93c8" />
      <pointLight position={[0, 1.8, 0]} intensity={6} color="#e8c27a" distance={6} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <circleGeometry args={[8.4, 72]} />
        <meshStandardMaterial color="#0b0e14" roughness={0.96} />
      </mesh>

      <mesh position={[0, TABLE_Y, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[1.62, 1.68, 0.16, 48]} />
        <meshStandardMaterial color="#2a2118" roughness={0.55} metalness={0.12} />
      </mesh>

      <mesh position={[0, 1.35, 0]}>
        <torusGeometry args={[0.82, 0.055, 16, 48]} />
        <meshStandardMaterial
          color="#efe6d2"
          emissive="#c9b48a"
          emissiveIntensity={0.28}
          metalness={0.4}
          roughness={0.22}
        />
      </mesh>
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.07, 0.09, 1.05, 12]} />
        <meshStandardMaterial color="#3a2e22" roughness={0.7} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, TABLE_Y + 0.02, 0]}>
        <ringGeometry args={[CONVEYOR_RADIUS - 0.42, CONVEYOR_RADIUS + 0.42, 64]} />
        <meshStandardMaterial color="#1a1612" roughness={0.48} metalness={0.22} />
      </mesh>

      <group ref={ring}>
        {seedPlates().map((plate) => {
          const angle = slotAngle(plate.slot, 0);
          return (
            <group
              key={plate.id}
              ref={(node) => {
                plateRefs.current[plate.id] = node;
              }}
              position={[Math.cos(angle) * CONVEYOR_RADIUS, TABLE_Y + 0.08, Math.sin(angle) * CONVEYOR_RADIUS]}
            >
              <LivePlate id={plate.id} sim={sim} />
            </group>
          );
        })}
      </group>

      {DINERS.map((diner, index) => {
        const angle = (index / DINERS.length) * Math.PI * 2 - Math.PI / 2;
        return (
          <group
            key={diner.id}
            ref={(node) => {
              dinerRefs.current[diner.id] = node;
            }}
            position={[Math.cos(angle) * WALK_RADIUS, 0, Math.sin(angle) * WALK_RADIUS]}
            rotation={[0, -angle - Math.PI / 2, 0]}
          >
            <LiveDiner
              dinerId={diner.id}
              phase={phase}
              selectedId={selectedId}
              sim={sim}
              onSelect={onSelect}
            />
          </group>
        );
      })}

      {lanterns.map((lantern, index) => (
        <group key={index} position={[lantern.x, 0, lantern.z]}>
          <mesh position={[0, 0.7, 0]} castShadow>
            <cylinderGeometry args={[0.045, 0.055, 1.4, 8]} />
            <meshStandardMaterial color="#2c241c" />
          </mesh>
          <mesh position={[0, 1.42, 0]}>
            <sphereGeometry args={[0.12, 12, 10]} />
            <meshStandardMaterial color="#e8c27a" emissive="#d7a44a" emissiveIntensity={1.1} />
          </mesh>
        </group>
      ))}

      <ContactShadows position={[0, 0, 0]} opacity={0.45} scale={14} blur={2.4} far={5} />
      <Environment resolution={128} frames={1} environmentIntensity={0.45}>
        <Lightformer intensity={8} position={[0, 4.8, 1.4]} scale={[10, 0.28, 1]} />
        <Lightformer intensity={3.2} position={[-3.4, 1.6, -2]} scale={[2, 2, 1]} color="#8ea4d4" />
      </Environment>
    </>
  );
}

function makeSim(selectedId: string, resetToken: number): Sim {
  return {
    phase: 'select',
    selectedId,
    clock: 0,
    spin: 0,
    actors: seatActors(selectedId),
    plates: seedPlates(resetToken + 4),
    lastBite: 'Seat a diner.',
    seed: resetToken + 11,
    seated: false,
  };
}

function LivePlate({
  id,
  sim,
}: {
  id: number;
  sim: MutableRefObject<Sim>;
}) {
  const [kind, setKind] = useState(() => sim.current.plates.find((plate) => plate.id === id)?.kind ?? 'pleat');

  useFrame(() => {
    const plate = sim.current.plates.find((item) => item.id === id);
    if (plate && plate.kind !== kind) setKind(plate.kind);
  });

  return <PlateMesh kind={kind} hidden={false} />;
}

function LiveDiner({
  dinerId,
  phase,
  selectedId,
  sim,
  onSelect,
}: {
  dinerId: string;
  phase: Phase;
  selectedId: string;
  sim: MutableRefObject<Sim>;
  onSelect: (id: string) => void;
}) {
  const diner = dinerById(dinerId);
  const actor = sim.current.actors.find((item) => item.dinerId === dinerId);
  const [status, setStatus] = useState(() => (actor ? actorStatus(actor, sim.current.clock) : 'clear'));
  const [lean, setLean] = useState(actor?.lean ?? 0);
  const [mine, setMine] = useState(Boolean(actor?.isPlayer));

  useFrame(() => {
    const live = sim.current.actors.find((item) => item.dinerId === dinerId);
    const next = live ? actorStatus(live, sim.current.clock) : 'clear';
    const nextLean = live?.lean ?? 0;
    if (next !== status) setStatus(next);
    if (Math.abs(nextLean - lean) > 0.08) setLean(nextLean);
    if (Boolean(live?.isPlayer) !== mine) setMine(Boolean(live?.isPlayer));
  });

  return (
    <DinerMesh
      diner={diner}
      status={status}
      lean={lean}
      selected={phase === 'select' && dinerId === selectedId}
      isPlayer={phase !== 'select' && mine}
      onPick={phase === 'select' ? () => onSelect(dinerId) : undefined}
    />
  );
}
