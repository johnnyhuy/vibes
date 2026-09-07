import { useLayoutEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { ACESFilmicToneMapping, PCFSoftShadowMap, Vector3 } from 'three';
import type { LoomState, StageId } from '../recipes';
import Kiln from './Kiln';

interface Props {
  loom: LoomState;
  stage: StageId;
  orbiting: boolean;
  reducedMotion: boolean;
}

const WELL_POS = new Vector3(2.05, 0.42, 2.55);
const KILN_POS = new Vector3(3.9, 1.55, 4.55);
const WELL_TARGET = new Vector3(0, 0.08, 0);
const KILN_TARGET = new Vector3(0, -0.05, 0);

function StageRig({ stage }: { stage: StageId }) {
  const { camera } = useThree();
  const controls = useThree((state) => state.controls) as { target: Vector3 } | null;
  const goal = useRef(WELL_POS.clone());
  const look = useRef(WELL_TARGET.clone());
  const blending = useRef(0);

  useLayoutEffect(() => {
    goal.current.copy(stage === 'kiln' ? KILN_POS : WELL_POS);
    look.current.copy(stage === 'kiln' ? KILN_TARGET : WELL_TARGET);
    blending.current = 1;
  }, [stage]);

  useFrame((_, delta) => {
    if (blending.current <= 0.002) return;
    const ease = 1 - Math.pow(0.08, delta);
    camera.position.lerp(goal.current, ease);
    camera.fov += ((stage === 'kiln' ? 38 : 32) - camera.fov) * ease;
    camera.updateProjectionMatrix();
    if (controls) {
      controls.target.lerp(look.current, ease);
    }
    blending.current *= 1 - ease;
  });

  return null;
}

export default function Scene({ loom, stage, orbiting, reducedMotion }: Props) {
  return (
    <Canvas
      camera={{ position: [2.05, 0.42, 2.55], fov: 32, near: 0.1, far: 40 }}
      dpr={[1, 1.75]}
      shadows
      gl={{
        antialias: true,
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 1.06,
      }}
      onCreated={({ gl }) => {
        gl.shadowMap.type = PCFSoftShadowMap;
      }}
    >
      <Kiln loom={loom} stage={stage} reducedMotion={reducedMotion} />
      <StageRig stage={stage} />
      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.06}
        minDistance={1.8}
        maxDistance={8}
        minPolarAngle={0.45}
        maxPolarAngle={1.45}
        target={[0, 0.08, 0]}
        autoRotate={orbiting && !reducedMotion}
        autoRotateSpeed={0.38}
      />
    </Canvas>
  );
}
