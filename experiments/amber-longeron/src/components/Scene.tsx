import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { ACESFilmicToneMapping, PCFSoftShadowMap } from 'three';
import type { PlayState } from '../types';
import FlightWorld from './FlightWorld';

interface Props {
  state: PlayState;
  resetToken: number;
  reducedMotion: boolean;
  consumeLane: () => number;
  consumeStart: () => boolean;
  nudgeLane: (delta: number) => void;
  onStart: () => void;
  onCrash: () => void;
  onHud: (distance: number, rings: number, travelZ: number) => void;
}

export default function Scene({
  state,
  resetToken,
  reducedMotion,
  consumeLane,
  consumeStart,
  nudgeLane,
  onStart,
  onCrash,
  onHud
}: Props) {
  const pointer = useRef<{ id: number; x: number; acc: number } | null>(null);

  return (
    <Canvas
      camera={{ position: [0, 3.1, -7.4], fov: 42, near: 0.1, far: 140 }}
      dpr={[1, 1.75]}
      shadows
      gl={{
        antialias: true,
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 1.08
      }}
      onCreated={({ gl }) => {
        gl.shadowMap.type = PCFSoftShadowMap;
      }}
      onPointerDown={(event) => {
        pointer.current = { id: event.pointerId, x: event.clientX, acc: 0 };
        if (state === 'ready') onStart();
      }}
      onPointerMove={(event) => {
        if (!pointer.current || pointer.current.id !== event.pointerId) return;
        const dx = event.clientX - pointer.current.x;
        pointer.current.x = event.clientX;
        pointer.current.acc += dx;
        if (pointer.current.acc > 36) {
          nudgeLane(1);
          pointer.current.acc = 0;
        } else if (pointer.current.acc < -36) {
          nudgeLane(-1);
          pointer.current.acc = 0;
        }
      }}
      onPointerUp={() => {
        pointer.current = null;
      }}
      onPointerCancel={() => {
        pointer.current = null;
      }}
    >
      <FlightWorld
        state={state}
        resetToken={resetToken}
        reducedMotion={reducedMotion}
        consumeLane={consumeLane}
        consumeStart={consumeStart}
        onStart={onStart}
        onCrash={onCrash}
        onHud={onHud}
      />
    </Canvas>
  );
}
