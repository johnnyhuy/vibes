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
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { reedFragment, reedVertex } from '../grassShader';
import { heightAt, ISLES, WATER_LEVEL } from '../world';

const dummy = new Object3D();
const COUNT = 7600;

function hash(n: number): number {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

function tuftGeometry() {
  const blades = [0, 1, 2].map((index) => {
    const plane = new PlaneGeometry(0.11, 1, 1, 4);
    plane.translate(0, 0.5, 0);
    const pos = plane.attributes.position;
    for (let i = 0; i < pos.count; i += 1) {
      const y = pos.getY(i);
      pos.setX(i, pos.getX(i) * (1 - y * 0.8));
    }
    pos.needsUpdate = true;
    plane.rotateY((index / 3) * Math.PI);
    return plane;
  });
  const merged = mergeGeometries(blades, false);
  blades.forEach((blade) => blade.dispose());
  merged?.computeVertexNormals();
  return merged ?? blades[0];
}

export default function ReedGrass({ reducedMotion }: { reducedMotion: boolean }) {
  const mesh = useRef<InstancedMesh>(null);
  const material = useRef<ShaderMaterial>(null);
  const geometry = useMemo(() => tuftGeometry(), []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uReduced: { value: reducedMotion ? 1 : 0 },
      uWind: { value: [0.78, 0.42] },
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
    const moss = new Color('#5d8a36');
    const lime = new Color('#c6de62');
    const mix = new Color();

    for (let i = 0; i < COUNT; i += 1) {
      let x = 0;
      let z = 0;
      if (i < 6200) {
        const radius = Math.sqrt(hash(i + 3)) * 10.6;
        const angle = hash(i + 11) * Math.PI * 2;
        x = Math.cos(angle) * radius;
        z = Math.sin(angle) * radius * 0.78 + 1.1;
      } else {
        const isle = ISLES[(i - 6200) % ISLES.length];
        x = isle.x + (hash(i + 6) - 0.5) * 3.4;
        z = isle.z + (hash(i + 13) - 0.5) * 3.0;
      }
      const y = heightAt(x, z);
      if (y < WATER_LEVEL + 0.1) {
        dummy.position.set(0, -10, 0);
        dummy.scale.setScalar(0);
      } else {
        dummy.position.set(x, y, z);
        dummy.rotation.y = hash(i + 21) * Math.PI;
        dummy.scale.set(0.9 + hash(i + 5) * 0.55, 0.42 + hash(i + 9) * 0.55, 1);
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
    <instancedMesh ref={mesh} args={[geometry, shader, COUNT]} frustumCulled={false}>
      <primitive object={shader} attach="material" ref={material} />
    </instancedMesh>
  );
}
