import { useLayoutEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, Color } from 'three';
import { injectLobe, nacreFragment, nacreVertex, type LobeUniforms } from '../nacreShader';
import { weaveIndex, type LoomState } from '../recipes';

interface Props {
  loom: LoomState;
  reducedMotion: boolean;
  scale?: number;
  position?: [number, number, number];
}

function hexColor(hex: string) {
  return new Color(hex);
}

export default function NacreVessel({
  loom,
  reducedMotion,
  scale = 1,
  position = [0, 0, 0],
}: Props) {
  const lobe = useMemo<LobeUniforms>(
    () => ({
      uTime: { value: 0 },
      uMorph: { value: loom.morph },
      uSpeed: { value: reducedMotion ? 0 : loom.speed },
      uAmp: { value: loom.amplitude },
    }),
    [],
  );

  const filmUniforms = useMemo(
    () => ({
      uTime: lobe.uTime,
      uMorph: lobe.uMorph,
      uSpeed: lobe.uSpeed,
      uAmp: lobe.uAmp,
      uFilmA: { value: hexColor(loom.filmA) },
      uFilmB: { value: hexColor(loom.filmB) },
      uFilmC: { value: hexColor(loom.filmC) },
      uWeave: { value: weaveIndex(loom.weave) },
      uReduced: { value: reducedMotion ? 1 : 0 },
    }),
    [lobe],
  );

  useLayoutEffect(() => {
    filmUniforms.uFilmA.value.set(loom.filmA);
    filmUniforms.uFilmB.value.set(loom.filmB);
    filmUniforms.uFilmC.value.set(loom.filmC);
    filmUniforms.uWeave.value = weaveIndex(loom.weave);
    filmUniforms.uReduced.value = reducedMotion ? 1 : 0;
    lobe.uMorph.value = loom.morph;
    lobe.uSpeed.value = reducedMotion ? 0 : loom.speed;
    lobe.uAmp.value = loom.amplitude;
  }, [filmUniforms, lobe, loom, reducedMotion]);

  useFrame((state) => {
    if (reducedMotion) return;
    lobe.uTime.value = state.clock.elapsedTime;
  });

  return (
    <group position={position} scale={scale}>
      <mesh>
        <icosahedronGeometry args={[1.02, 5]} />
        <meshPhysicalMaterial
          color={loom.shell}
          metalness={0.02}
          roughness={loom.roughness}
          transmission={loom.transmission}
          thickness={loom.thickness}
          ior={loom.ior}
          attenuationColor={loom.attenuation}
          attenuationDistance={2.4}
          clearcoat={loom.clearcoat}
          clearcoatRoughness={0.18}
          transparent
          envMapIntensity={1.1}
          onBeforeCompile={(shader) => injectLobe(shader, lobe)}
          customProgramCacheKey={() => 'nacre-glass-lobe'}
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.74, 4]} />
        <shaderMaterial
          uniforms={filmUniforms}
          vertexShader={nacreVertex}
          fragmentShader={nacreFragment}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
