import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, BufferAttribute, Points } from 'three';
import type { ResolvedLook } from '../atmosphere';

const MAX = 1600;

interface Props {
  look: ResolvedLook;
}

export default function WeatherField({ look }: Props) {
  const points = useRef<Points>(null);
  const positions = useMemo(() => {
    const data = new Float32Array(MAX * 3);
    for (let i = 0; i < MAX; i++) {
      data[i * 3] = (Math.random() - 0.5) * 36;
      data[i * 3 + 1] = Math.random() * 18;
      data[i * 3 + 2] = (Math.random() - 0.5) * 36;
    }
    return data;
  }, []);

  useFrame((_, dt) => {
    const attr = points.current?.geometry.getAttribute('position') as BufferAttribute | undefined;
    if (!attr) return;
    const kind = look.particle;
    const array = attr.array as Float32Array;
    const fall =
      kind === 'rain' ? 14 : kind === 'snow' ? 1.6 : kind === 'blossom' ? 0.7 : 0.35;
    const sway = kind === 'rain' ? 0.4 : 1.3;

    for (let i = 0; i < look.particleCount; i++) {
      const ix = i * 3;
      array[ix] += Math.sin(array[ix + 1] * 0.4 + i) * sway * dt;
      array[ix + 1] -= fall * dt;
      if (kind === 'mist') {
        array[ix + 1] += Math.sin(i + array[ix]) * 0.15 * dt;
      }
      if (array[ix + 1] < 0) {
        array[ix] = (Math.random() - 0.5) * 36;
        array[ix + 1] = 14 + Math.random() * 6;
        array[ix + 2] = (Math.random() - 0.5) * 36;
      }
    }
    attr.needsUpdate = true;
    points.current.geometry.setDrawRange(0, look.particleCount);
  });

  if (look.particle === 'none' || look.particleCount === 0) return null;

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={look.particleColor}
        size={look.particle === 'rain' ? 0.045 : look.particle === 'mist' ? 0.22 : 0.07}
        transparent
        opacity={look.particle === 'mist' ? 0.18 : 0.72}
        depthWrite={false}
        blending={look.particle === 'mist' ? AdditiveBlending : undefined}
        sizeAttenuation
      />
    </points>
  );
}
