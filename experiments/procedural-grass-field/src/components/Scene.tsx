import { useCallback, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { ACESFilmicToneMapping, PCFSoftShadowMap, Vector3 } from 'three';
import type { DensityId, Look, Species } from '../presets';
import GrassField from './GrassField';
import Meadow from './Meadow';
import SkyRig from './SkyRig';

interface Props {
  species: Species;
  look: Look;
  densityId: DensityId;
  wind: number;
  height: number;
  orbiting: boolean;
  reducedMotion: boolean;
}

function GustDecay({ gust }: { gust: Vector3 }) {
  useFrame((_, delta) => {
    gust.y *= Math.max(0, 1 - delta * 2.4);
  });
  return null;
}

export default function Scene({
  species,
  look,
  densityId,
  wind,
  height,
  orbiting,
  reducedMotion,
}: Props) {
  const gust = useRef(new Vector3());

  const handleGust = useCallback((x: number, z: number, strength: number) => {
    gust.current.set(x, strength, z);
  }, []);

  return (
    <Canvas
      camera={{ position: [7.4, 4.6, 10.8], fov: 38, near: 0.1, far: 140 }}
      dpr={[1, 1.6]}
      shadows
      gl={{
        antialias: true,
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: look.exposure,
      }}
      onCreated={({ gl }) => {
        gl.shadowMap.type = PCFSoftShadowMap;
      }}
    >
      <SkyRig look={look} />
      <Meadow look={look} onGust={handleGust} />
      <GrassField
        species={species}
        look={look}
        densityId={densityId}
        wind={wind}
        height={height}
        reducedMotion={reducedMotion}
        gust={gust.current}
      />
      <GustDecay gust={gust.current} />
      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.055}
        minDistance={6}
        maxDistance={28}
        minPolarAngle={0.28}
        maxPolarAngle={Math.PI / 2.18}
        target={[0, 0.55, 0]}
        autoRotate={orbiting && !reducedMotion}
        autoRotateSpeed={0.22}
      />
    </Canvas>
  );
}
