import { useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { enableShadows, faceAircraftForward, fitObject, hideNamedMeshes } from '../modelFit';

const MODEL = '/models/vintage-biplane.glb';

interface Props {
  crashed: boolean;
  reducedMotion: boolean;
}

export default function Biplane({ crashed, reducedMotion }: Props) {
  const { scene } = useGLTF(MODEL);
  const prop = useRef<Group>(null);
  const { model, propPos } = useMemo(() => {
    const clone = scene.clone(true);
    hideNamedMeshes(clone, ['ground']);
    faceAircraftForward(clone);
    const box = fitObject(clone, 2.55);
    enableShadows(clone);
    return {
      model: clone,
      propPos: [0, 0.05, box.max.z + 0.03] as [number, number, number],
    };
  }, [scene]);

  useFrame((_, delta) => {
    if (!prop.current || reducedMotion) return;
    prop.current.rotation.z += (crashed ? 3 : 22) * delta;
  });

  return (
    <group>
      <primitive object={model} />
      <group ref={prop} position={propPos}>
        <mesh>
          <cylinderGeometry args={[0.035, 0.035, 0.08, 10]} />
          <meshStandardMaterial color="#2a2118" roughness={0.45} />
        </mesh>
        <mesh rotation={[0, 0, 0.18]}>
          <boxGeometry args={[0.07, 0.72, 0.02]} />
          <meshStandardMaterial color="#3a2a1c" roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
}

useGLTF.preload(MODEL);
