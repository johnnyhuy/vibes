import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { WebGLProgramParametersWithUniforms } from 'three';
import * as THREE from 'three';
import {
  injectGlassRipple,
  rippleSheenFragment,
  rippleSheenVertex,
  type RippleUniforms,
} from '../glassRipple';
import { lightingById, type LightingPreset } from '../lighting';
import NeuralGraph from './NeuralGraph';

const start = lightingById('pale-lift');

const RIPPLE_SECONDS = 1.15;
const glassGoal = new THREE.Color();
const attenGoal = new THREE.Color();
const sheenGoal = new THREE.Color();

interface Props {
  preset: LightingPreset;
  rippleNonce: number;
  reducedMotion: boolean;
}

export default function GlassSphere({ preset, rippleNonce, reducedMotion }: Props) {
  const material = useRef<THREE.MeshPhysicalMaterial>(null);
  const uniforms = useMemo<RippleUniforms>(
    () => ({
      uRipple: { value: 0 },
      uRippleOrigin: { value: new THREE.Vector3(0.18, 0.52, 0.84) },
    }),
    [],
  );
  const sheenUniforms = useMemo(
    () => ({
      uRipple: uniforms.uRipple,
      uRippleOrigin: uniforms.uRippleOrigin,
      uColor: { value: new THREE.Color('#f4f8ff') },
    }),
    [uniforms],
  );

  useEffect(() => {
    if (rippleNonce === 0) return;
    if (reducedMotion) {
      uniforms.uRipple.value = 0;
      return;
    }
    const theta = (rippleNonce * 1.7) % (Math.PI * 2);
    uniforms.uRippleOrigin.value.set(Math.sin(theta) * 0.46, 0.42 + (rippleNonce % 5) * 0.04, 0.78);
    uniforms.uRippleOrigin.value.normalize();
    uniforms.uRipple.value = 0.0001;
  }, [rippleNonce, reducedMotion, uniforms]);

  const onBeforeCompile = useCallback(
    (shader: WebGLProgramParametersWithUniforms) => {
      injectGlassRipple(shader, uniforms);
    },
    [uniforms],
  );

  useFrame((_, delta) => {
    const alpha = reducedMotion ? 1 : 1 - Math.exp(-delta * 2.35);
    if (material.current) {
      glassGoal.set(preset.glassColor);
      attenGoal.set(preset.attenuation);
      material.current.color.lerp(glassGoal, alpha);
      material.current.attenuationColor.lerp(attenGoal, alpha);
      material.current.attenuationDistance = THREE.MathUtils.lerp(
        material.current.attenuationDistance,
        preset.attenuationDistance,
        alpha,
      );
      material.current.roughness = THREE.MathUtils.lerp(
        material.current.roughness,
        preset.roughness,
        alpha,
      );
      material.current.envMapIntensity = THREE.MathUtils.lerp(
        material.current.envMapIntensity,
        preset.envMapIntensity,
        alpha,
      );
    }
    sheenGoal.set(preset.glassColor).offsetHSL(0, 0.08, 0.22);
    sheenUniforms.uColor.value.lerp(sheenGoal, alpha);

    if (reducedMotion) {
      uniforms.uRipple.value = 0;
      return;
    }
    if (uniforms.uRipple.value <= 0) return;
    uniforms.uRipple.value += delta / RIPPLE_SECONDS;
    if (uniforms.uRipple.value >= 1) uniforms.uRipple.value = 0;
  });

  return (
    <group>
      <NeuralGraph lineColor={preset.graphLine} pointColor={preset.graphPoint} reducedMotion={reducedMotion} />
      <mesh>
        <sphereGeometry args={[2.18, 80, 80]} />
        <meshPhysicalMaterial
          ref={material}
          color={start.glassColor}
          metalness={0}
          roughness={start.roughness}
          transmission={1}
          thickness={1.35}
          ior={1.45}
          attenuationColor={start.attenuation}
          attenuationDistance={start.attenuationDistance}
          clearcoat={0.35}
          clearcoatRoughness={0.45}
          envMapIntensity={start.envMapIntensity}
          transparent
          onBeforeCompile={onBeforeCompile}
          customProgramCacheKey={() => 'glass-ripple-v1'}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.205, 64, 64]} />
        <shaderMaterial
          uniforms={sheenUniforms}
          vertexShader={rippleSheenVertex}
          fragmentShader={rippleSheenFragment}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
