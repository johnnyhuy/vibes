import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { DoubleSide, InstancedMesh, Object3D } from 'three';
import { STOPS } from '../itinerary';
import { lane } from '../palette';
import { hash } from './Kit';

const dummy = new Object3D();
const FIRST = STOPS[0].position[2];
const LAST = STOPS[STOPS.length - 1].position[2];
const LENGTH = FIRST - LAST + 28;
const MID = (FIRST + LAST) / 2;
const GRASS = 220;
const LEAVES = 70;

export default function Drift({ reducedMotion }: { reducedMotion: boolean }) {
  const grass = useRef<InstancedMesh>(null);
  const leaves = useRef<InstancedMesh>(null);
  const seeds = useMemo(
    () =>
      Array.from({ length: LEAVES }, (_, i) => ({
        x: (hash(i) - 0.5) * 10,
        y: 1.2 + hash(i + 3) * 3.4,
        z: MID + (hash(i + 9) - 0.5) * LENGTH,
        s: 0.08 + hash(i + 5) * 0.1,
        p: hash(i + 11) * Math.PI * 2,
      })),
    []
  );

  useLayoutEffect(() => {
    const mesh = grass.current;
    if (!mesh) return;
    for (let i = 0; i < GRASS; i += 1) {
      const side = i % 2 === 0 ? -1 : 1;
      const z = FIRST - (i / GRASS) * (FIRST - LAST + 8);
      dummy.position.set(side * (3.55 + hash(i) * 0.55), 0.12, z + hash(i + 2) * 1.4);
      dummy.rotation.set(0, hash(i + 4) * Math.PI, hash(i) * 0.2);
      dummy.scale.set(1, 0.7 + hash(i + 6) * 0.8, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame((state) => {
    const mesh = leaves.current;
    if (!mesh) return;
    const t = reducedMotion ? 0 : state.clock.elapsedTime;
    seeds.forEach((seed, i) => {
      dummy.position.set(
        seed.x + Math.sin(t * 0.35 + seed.p) * 1.6,
        seed.y + Math.sin(t * 0.55 + seed.p) * 0.35,
        seed.z + ((t * 1.1 + seed.p * 4) % LENGTH) - LENGTH / 2
      );
      dummy.rotation.set(t * 0.7 + seed.p, t * 0.4, seed.p);
      dummy.scale.setScalar(seed.s);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <instancedMesh ref={grass} args={[undefined, undefined, GRASS]} castShadow>
        <coneGeometry args={[0.06, 0.32, 4]} />
        <meshStandardMaterial color={lane.leaf} roughness={0.86} />
      </instancedMesh>
      <instancedMesh ref={leaves} args={[undefined, undefined, LEAVES]}>
        <planeGeometry args={[1, 0.55]} />
        <meshStandardMaterial color={lane.tile} roughness={0.7} side={DoubleSide} />
      </instancedMesh>
    </group>
  );
}
