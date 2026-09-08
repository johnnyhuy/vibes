import { useEffect, useMemo, useRef } from 'react';
import { useAnimations, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import type { Mesh, MeshStandardMaterial, Object3D } from 'three';
import { enableShadows, fitObject, hideStudioProps } from '../modelFit';

const MODEL = '/models/v8-engine.glb';
const CYCLES = ['INTAKE', 'COMPRESSION', 'POWER', 'EXHAUST'] as const;

interface V8EngineProps {
  engineSpeed: number;
  setRpm: (rpm: number) => void;
  setStrokeCycle: (cycle: string) => void;
  setPressure: (pressure: string) => void;
  setFiringIndex: (index: number) => void;
}

function polishMaterials(root: Object3D): void {
  root.traverse((object) => {
    const mesh = object as Mesh;
    if (!mesh.isMesh || !mesh.material) return;
    const sources = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    const next = sources.map((source) => {
      const mat = (source as MeshStandardMaterial).clone();
      if ('envMapIntensity' in mat) mat.envMapIntensity = 1.15;
      if ('metalness' in mat && (mat.metalness ?? 0) > 0.15) {
        mat.metalness = Math.min(0.92, (mat.metalness ?? 0.4) + 0.08);
        mat.roughness = Math.min(mat.roughness ?? 0.4, 0.42);
      }
      return mat;
    });
    mesh.material = next.length === 1 ? next[0] : next;
  });
}

export default function V8Engine({
  engineSpeed,
  setRpm,
  setStrokeCycle,
  setPressure,
  setFiringIndex,
}: V8EngineProps) {
  const { scene, animations } = useGLTF(MODEL);
  const crankTurns = useRef(0);

  const model = useMemo(() => {
    const clone = scene.clone(true);
    hideStudioProps(clone);
    fitObject(clone, 5.4, { ground: true });
    enableShadows(clone);
    polishMaterials(clone);
    return clone;
  }, [scene]);

  const { actions, mixer } = useAnimations(animations, model);

  useEffect(() => {
    const action = actions.Object_0 ?? Object.values(actions)[0];
    if (!action) return;
    action.reset().play();
    action.paused = false;
    return () => {
      action.stop();
    };
  }, [actions]);

  useFrame((_, delta) => {
    const running = engineSpeed > 0;
    if (mixer) mixer.timeScale = running ? engineSpeed * 0.85 : 0;
    crankTurns.current += running ? delta * engineSpeed * 2 : 0;

    setRpm(running ? Math.floor(engineSpeed * 200 + 300) : 0);
    setStrokeCycle(CYCLES[Math.floor((crankTurns.current / (Math.PI * 2)) % 4)]);
    setFiringIndex(Math.floor((crankTurns.current / (Math.PI / 4)) % 8));
    setPressure((1.5 + Math.sin(crankTurns.current) * 0.5).toFixed(1));
  });

  return <primitive object={model} />;
}

useGLTF.preload(MODEL);
