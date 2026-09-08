import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { memo, type MutableRefObject } from 'react';
import { ACESFilmicToneMapping } from 'three';
import type { HudSnapshot, InputState, Phase } from '../types';
import RelayWorld from './RelayWorld';

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

function Scene({
  phase,
  selectedId,
  reducedMotion,
  input,
  onHud,
  onPhase,
  onSelect,
  resetToken,
}: Props) {
  return (
    <Canvas
      camera={{ position: [5.4, 6.2, 5.8], fov: 36, near: 0.1, far: 48 }}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 1.08,
      }}
    >
      <RelayWorld
        phase={phase}
        selectedId={selectedId}
        reducedMotion={reducedMotion}
        input={input}
        onHud={onHud}
        onPhase={onPhase}
        onSelect={onSelect}
        resetToken={resetToken}
      />
      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.06}
        minDistance={6}
        maxDistance={13}
        minPolarAngle={0.55}
        maxPolarAngle={1.2}
        target={[0, 0.45, 0]}
        autoRotate={false}
      />
    </Canvas>
  );
}

export default memo(Scene);
