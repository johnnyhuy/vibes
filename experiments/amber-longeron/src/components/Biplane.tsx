import { useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { MeshStandardMaterial, type Group, type Mesh } from 'three';
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
    clone.traverse((object) => {
      const mesh = object as Mesh;
      if (!mesh.isMesh || !mesh.material) return;
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      const next = materials.map((source) => {
        const mat =
          source instanceof MeshStandardMaterial
            ? source.clone()
            : new MeshStandardMaterial({ color: '#6a4a2c' });
        mat.envMapIntensity = 1.2;
        mat.roughness = Math.min(0.82, mat.roughness ?? 0.55);
        if ((mat.metalness ?? 0) > 0.25) mat.metalness = Math.min(0.85, mat.metalness + 0.15);
        return mat;
      });
      mesh.material = next.length === 1 ? next[0] : next;
    });
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
