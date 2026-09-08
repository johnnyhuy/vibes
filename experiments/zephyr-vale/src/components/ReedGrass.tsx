import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  Color,
  DoubleSide,
  InstancedBufferAttribute,
  InstancedMesh,
  Object3D,
  PlaneGeometry,
  ShaderMaterial,
} from 'three';
import { reedFragment, reedVertex } from '../grassShader';
import { heightAt, WATER_LEVEL } from '../world';

const dummy = new Object3D();
const COUNT = 2800;

function hash(n: number): number {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

export default function ReedGrass({ reducedMotion }: { reducedMotion: boolean }) {
  const mesh = useRef<InstancedMesh>(null);
  const material = useRef<ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const plane = new PlaneGeometry(0.07, 1, 1, 4);
    plane.translate(0, 0.5, 0);
    const pos = plane.attributes.position;
    for (let i = 0; i < pos.count; i += 1) {
      const y = pos.getY(i);
      pos.setX(i, pos.getX(i) * (1 - y * 0.78));
    }
    pos.needsUpdate = true;
    plane.computeVertexNormals();
    return plane;
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uReduced: { value: reducedMotion ? 1 : 0 },
      uWind: { value: [0.82, 0.48] },
    }),
    [reducedMotion]
  );

  const shader = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: reedVertex,
        fragmentShader: reedFragment,
        uniforms,
        side: DoubleSide,
      }),
    [uniforms]
  );

  useLayoutEffect(() => {
    const instanced = mesh.current;
    if (!instanced) return;

    const phases = new Float32Array(COUNT);
    const tints = new Float32Array(COUNT * 3);
    const moss = new Color('#5f7d38');
    const lime = new Color('#8aaa4c');
    const mix = new Color();

    for (let i = 0; i < COUNT; i += 1) {
      const clump = i % 5;
      const ox = [-1.2, 3.4, -6.5, 8.2, 1.1][clump];
      const oz = [2.6, 0.4, 1.8, -2.2, 4.1][clump];
      const x = ox + (hash(i + 3) - 0.5) * 10.5;
      const z = oz + (hash(i + 11) - 0.5) * 8.4;
      const y = heightAt(x, z);
      if (y < WATER_LEVEL + 0.08) {
        dummy.position.set(0, -8, 0);
        dummy.scale.setScalar(0);
      } else {
        dummy.position.set(x, y, z);
        dummy.rotation.y = hash(i + 21) * Math.PI;
        dummy.scale.set(0.85 + hash(i + 5) * 0.5, 0.55 + hash(i + 9) * 0.7, 1);
      }
      dummy.updateMatrix();
      instanced.setMatrixAt(i, dummy.matrix);
      phases[i] = hash(i + 41) * Math.PI * 2;
      mix.copy(moss).lerp(lime, hash(i + 17));
      tints[i * 3] = mix.r;
      tints[i * 3 + 1] = mix.g;
      tints[i * 3 + 2] = mix.b;
    }

    instanced.instanceMatrix.needsUpdate = true;
    instanced.geometry.setAttribute('aPhase', new InstancedBufferAttribute(phases, 1));
    instanced.geometry.setAttribute('aTint', new InstancedBufferAttribute(tints, 3));
  }, []);

  useFrame((state) => {
    if (material.current) {
      material.current.uniforms.uTime.value = state.clock.elapsedTime;
      material.current.uniforms.uReduced.value = reducedMotion ? 1 : 0;
    }
  });

  return (
    <instancedMesh
      ref={mesh}
      args={[geometry, shader, COUNT]}
      frustumCulled={false}
    >
      <primitive object={shader} attach="material" ref={material} />
    </instancedMesh>
  );
}
