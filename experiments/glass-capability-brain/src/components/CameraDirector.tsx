import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CAPABILITIES, type CapabilityId } from '../capabilities';
import { SCENE_SHIFT, orbitPoint } from '../orbit';

const OVERVIEW_POS = new THREE.Vector3(2.55, 1.4, 7.7);
const OVERVIEW_TARGET = new THREE.Vector3(-0.55, 0.12, 0);
const nodeScratch = new THREE.Vector3();
const goalPos = new THREE.Vector3();
const goalTarget = new THREE.Vector3();
const away = new THREE.Vector3();

interface Props {
  selectedId: CapabilityId | null;
  reducedMotion: boolean;
}

export default function CameraDirector({ selectedId, reducedMotion }: Props) {
  const { camera, controls } = useThree();
  const overviewUntil = useRef(0);
  const lastId = useRef<CapabilityId | null | undefined>(undefined);

  useEffect(() => {
    if (selectedId === null && lastId.current !== undefined) {
      overviewUntil.current = performance.now() + 1400;
    }
    lastId.current = selectedId;
  }, [selectedId]);

  useFrame((state, delta) => {
    const orbit = controls as { target: THREE.Vector3; update: () => void } | null;
    if (!orbit?.target) return;

    const node = CAPABILITIES.find((item) => item.id === selectedId);
    const returning = selectedId === null && performance.now() < overviewUntil.current;
    if (!node && !returning && lastId.current !== undefined) return;

    if (node) {
      orbitPoint(node, state.clock.elapsedTime, reducedMotion, nodeScratch).add(SCENE_SHIFT);
      goalTarget.copy(nodeScratch);
      away.copy(nodeScratch).normalize();
      if (away.lengthSq() < 0.01) away.set(0.35, 0.2, 1);
      goalPos.copy(nodeScratch).addScaledVector(away, 2.65).add(new THREE.Vector3(0.85, 0.55, 1.55));
    } else {
      goalPos.copy(OVERVIEW_POS);
      goalTarget.copy(OVERVIEW_TARGET);
    }

    const alpha = reducedMotion ? 1 : 1 - Math.exp(-delta * 2.35);
    camera.position.lerp(goalPos, alpha);
    orbit.target.lerp(goalTarget, alpha);
    orbit.update();
  });

  return null;
}
