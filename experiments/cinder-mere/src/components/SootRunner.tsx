import { useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Color, MeshStandardMaterial, type Group, type Mesh } from 'three';
import type { VehicleRef } from '../types';
import type { ResolvedLook } from '../look';
import { enableShadows, faceCartForward, fitObject } from '../modelFit';

const MODEL = '/models/kiln-cart.glb';
const SOOT = new Color('#c98458');

interface Props {
  vehicle: VehicleRef;
  look: ResolvedLook;
}

export default function SootRunner({ vehicle, look }: Props) {
  const group = useRef<Group>(null);
  const { scene } = useGLTF(MODEL);
  const model = useMemo(() => {
    const clone = scene.clone(true);
    faceCartForward(clone);
    fitObject(clone, 2.15, { ground: true });
    enableShadows(clone);
    clone.traverse((object) => {
      const mesh = object as Mesh;
      if (!mesh.isMesh || !mesh.material) return;
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      const next = materials.map((source) => {
        const mat =
          source instanceof MeshStandardMaterial
            ? source.clone()
            : new MeshStandardMaterial({ color: '#6a4030' });
        if (mat.color) mat.color.lerp(SOOT, 0.16);
        mat.envMapIntensity = 1.15;
        return mat;
      });
      mesh.material = next.length === 1 ? next[0] : next;
    });
    return clone;
  }, [scene]);

  useFrame(() => {
    const body = vehicle.current;
    const root = group.current;
    if (!root) return;
    root.position.set(body.x, body.y, body.z);
    root.rotation.set(body.pitch, body.yaw, body.roll);
  });

  return (
    <group ref={group}>
      <primitive object={model} />
      <mesh position={[-0.28, 1.18, 0.42]}>
        <sphereGeometry args={[0.055, 10, 8]} />
        <meshStandardMaterial
          color="#ffd080"
          emissive="#ff9a40"
          emissiveIntensity={1.15 * look.lampGain}
        />
      </mesh>
      <mesh position={[0.28, 1.18, 0.42]}>
        <sphereGeometry args={[0.055, 10, 8]} />
        <meshStandardMaterial
          color="#ffd080"
          emissive="#ff9a40"
          emissiveIntensity={1.15 * look.lampGain}
        />
      </mesh>
      <pointLight
        color="#ffb060"
        intensity={2.6 * look.lampGain}
        distance={10}
        position={[0, 1.22, 0.55]}
      />
    </group>
  );
}

useGLTF.preload(MODEL);
