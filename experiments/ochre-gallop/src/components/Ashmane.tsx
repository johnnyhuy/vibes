import { useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Color, MeshStandardMaterial, type Group, type Mesh } from 'three';
import type { RunnerRef } from '../types';
import { enableShadows, faceHorseForward, fitObject } from '../modelFit';

const MODEL = '/models/ashmane.glb';
const HIDE = new Color('#8a5330');

interface Props {
  runner: RunnerRef;
  reducedMotion: boolean;
}

export default function Ashmane({ runner, reducedMotion }: Props) {
  const root = useRef<Group>(null);
  const body = useRef<Group>(null);
  const { scene } = useGLTF(MODEL);
  const model = useMemo(() => {
    const clone = scene.clone(true);
    faceHorseForward(clone);
    fitObject(clone, 1.86, { ground: true });
    enableShadows(clone);
    clone.traverse((object) => {
      const mesh = object as Mesh;
      if (!mesh.isMesh || !mesh.material) return;
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      const next = materials.map((source) => {
        const mat =
          source instanceof MeshStandardMaterial
            ? source.clone()
            : new MeshStandardMaterial({ color: '#8a5330' });
        if (mat.color) mat.color.lerp(HIDE, 0.42);
        mat.roughness = Math.max(0.48, mat.roughness ?? 0.55);
        mat.metalness = Math.min(0.08, mat.metalness ?? 0);
        mat.envMapIntensity = 1.25;
        return mat;
      });
      mesh.material = next.length === 1 ? next[0] : next;
    });
    return clone;
  }, [scene]);

  useFrame(() => {
    const state = runner.current;
    const group = root.current;
    if (!group) return;
    group.position.set(state.x, state.y, state.z);
    group.rotation.set(state.pitch, state.yaw, state.roll);

    const gait = reducedMotion ? 0 : state.gait;
    if (body.current) {
      body.current.position.y = Math.sin(gait * 2) * 0.045;
      body.current.rotation.x = Math.sin(gait) * 0.035;
      body.current.rotation.z = Math.sin(gait) * 0.03;
    }
  });

  return (
    <group ref={root}>
      <group ref={body}>
        <primitive object={model} />
      </group>
    </group>
  );
}

useGLTF.preload(MODEL);
