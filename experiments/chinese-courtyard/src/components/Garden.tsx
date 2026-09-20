import { useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import {
  COURT_ARMCHAIR,
  COURT_LANTERN,
  COURT_PLANT,
  COURT_ROCKS,
  COURT_STOOL,
  COURT_TEA_TABLE,
} from '../assets';
import type { ResolvedLook } from '../atmosphere';
import { dressPbr, enableShadows, fitObject } from '../modelFit';

interface Props {
  look: ResolvedLook;
  reducedMotion: boolean;
}

function FittedProp({ url, span, env }: { url: string; span: number; env: number }) {
  const { scene } = useGLTF(url);
  const model = useMemo(() => {
    const clone = scene.clone(true);
    fitObject(clone, span, { ground: true });
    enableShadows(clone);
    dressPbr(clone, env);
    return clone;
  }, [env, scene, span]);

  return <primitive object={model} />;
}

function Pine({
  x,
  z,
  scale,
  color,
}: {
  x: number;
  z: number;
  scale: number;
  color: string;
}) {
  return (
    <group position={[x, 0, z]} scale={scale}>
      <mesh position={[0, 0.38, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.1, 0.76, 6]} />
        <meshStandardMaterial color="#4a3828" roughness={0.86} envMapIntensity={0.45} />
      </mesh>
      {[0.78, 1.22, 1.58].map((y, i) => (
        <mesh key={y} position={[0, y, 0]} castShadow>
          <coneGeometry args={[0.52 - i * 0.12, 0.62, 7]} />
          <meshStandardMaterial color={color} roughness={0.8} envMapIntensity={0.55} />
        </mesh>
      ))}
    </group>
  );
}

function BambooClump({
  x,
  z,
  color,
}: {
  x: number;
  z: number;
  color: string;
}) {
  const stalks = useMemo(
    () =>
      [
        [0.0, 1.55, 0.035],
        [0.12, 1.28, 0.028],
        [-0.1, 1.72, 0.032],
        [0.2, 1.1, 0.024],
        [-0.18, 1.38, 0.026],
      ] as const,
    []
  );
  return (
    <group position={[x, 0, z]}>
      {stalks.map(([ox, h, r], i) => (
        <mesh key={i} position={[ox, h / 2, (i - 2) * 0.04]} castShadow>
          <cylinderGeometry args={[r, r, h, 6]} />
          <meshStandardMaterial color={color} roughness={0.55} envMapIntensity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function Pond({ look, reducedMotion }: { look: ResolvedLook; reducedMotion: boolean }) {
  const koi = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!koi.current || reducedMotion) return;
    const t = clock.elapsedTime * 0.35;
    koi.current.children.forEach((child, i) => {
      const a = t + i * 2.1;
      child.position.set(Math.cos(a) * 0.72, 0.04, Math.sin(a) * 0.42);
      child.rotation.y = a + Math.PI / 2;
    });
  });

  return (
    <group position={[0, 0.02, 0.35]}>
      <mesh receiveShadow>
        <boxGeometry args={[3.1, 0.08, 1.85]} />
        <meshStandardMaterial color={look.stoneColor} roughness={0.88} envMapIntensity={0.7} />
      </mesh>
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[2.72, 0.04, 1.48]} />
        <meshStandardMaterial color={look.waterColor} roughness={0.18} metalness={0.22} envMapIntensity={1.35} />
      </mesh>
      {[
        [-0.7, 0.08, 0.28],
        [0.55, -0.22, 0.22],
        [0.1, 0.35, 0.18],
      ].map(([x, z, r], i) => (
        <mesh key={i} position={[x, 0.08, z]} rotation={[-Math.PI / 2, 0, i * 0.4]}>
          <circleGeometry args={[r, 12]} />
          <meshStandardMaterial color={look.foliageColor} roughness={0.78} envMapIntensity={0.5} />
        </mesh>
      ))}
      <group ref={koi}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0.5 * i, 0.04, 0]} scale={[1, 0.35, 0.45]} castShadow>
            <sphereGeometry args={[0.12, 10, 8]} />
            <meshStandardMaterial color="#c45a28" roughness={0.4} metalness={0.15} envMapIntensity={1.1} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Lantern({
  x,
  z,
  look,
}: {
  x: number;
  z: number;
  look: ResolvedLook;
}) {
  const glow = look.lanternGain;
  return (
    <group position={[x, 0, z]}>
      <FittedProp url={COURT_LANTERN} span={0.72} env={1.15} />
      {glow > 0.6 && <pointLight color="#ffc070" intensity={glow * 0.55} distance={3.4} position={[0, 0.42, 0]} />}
    </group>
  );
}

export default function Garden({ look, reducedMotion }: Props) {
  return (
    <group>
      <Pond look={look} reducedMotion={reducedMotion} />
      <Pine x={-3.15} z={2.55} scale={0.95} color={look.pineColor} />
      <Pine x={3.05} z={2.35} scale={0.82} color={look.pineColor} />
      <Pine x={-3.35} z={-2.05} scale={0.7} color={look.pineColor} />
      <BambooClump x={3.35} z={-2.15} color={look.bambooColor} />
      <BambooClump x={-2.55} z={3.85} color={look.bambooColor} />
      {look.blossomColor && (
        <>
          <mesh position={[-3.15, 1.72, 2.55]}>
            <sphereGeometry args={[0.22, 8, 6]} />
            <meshStandardMaterial color={look.blossomColor} roughness={0.7} envMapIntensity={0.55} />
          </mesh>
          <mesh position={[3.05, 1.48, 2.35]}>
            <sphereGeometry args={[0.18, 8, 6]} />
            <meshStandardMaterial color={look.blossomColor} roughness={0.7} envMapIntensity={0.55} />
          </mesh>
        </>
      )}
      <Lantern x={-1.85} z={1.55} look={look} />
      <Lantern x={1.95} z={1.35} look={look} />
      <Lantern x={-1.15} z={4.35} look={look} />
      <group position={[0, 0, -2.35]}>
        <FittedProp url={COURT_TEA_TABLE} span={1.15} env={1.2} />
      </group>
      <group position={[-0.62, 0, -1.95]} rotation={[0, 0.35, 0]}>
        <FittedProp url={COURT_STOOL} span={0.42} env={1.15} />
      </group>
      <group position={[0.58, 0, -1.88]} rotation={[0, -0.4, 0]}>
        <FittedProp url={COURT_STOOL} span={0.4} env={1.15} />
      </group>
      <group position={[2.55, 0, 2.05]} rotation={[0, -0.85, 0]}>
        <FittedProp url={COURT_ARMCHAIR} span={0.95} env={1.2} />
      </group>
      <group position={[-3.85, 0, 1.05]}>
        <FittedProp url={COURT_PLANT} span={0.85} env={0.95} />
      </group>
      <group position={[3.7, 0, 0.95]}>
        <FittedProp url={COURT_PLANT} span={0.72} env={0.95} />
      </group>
      <group position={[-1.55, 0, 4.15]}>
        <FittedProp url={COURT_PLANT} span={0.64} env={0.95} />
      </group>
      {[
        [6.8, 5.4, 0.95, 0.4],
        [-6.6, 5.8, 0.82, 1.1],
        [7.1, -5.2, 0.88, 2.2],
        [-7.0, -4.8, 0.7, 0.7],
        [6.2, 0.4, 0.78, 1.6],
      ].map(([x, z, span, yaw], i) => (
        <group key={i} position={[x, 0, z]} rotation={[0, yaw, 0]}>
          <FittedProp url={COURT_ROCKS} span={span} env={0.85} />
        </group>
      ))}
    </group>
  );
}

useGLTF.preload(COURT_LANTERN);
useGLTF.preload(COURT_TEA_TABLE);
useGLTF.preload(COURT_STOOL);
useGLTF.preload(COURT_ARMCHAIR);
useGLTF.preload(COURT_PLANT);
useGLTF.preload(COURT_ROCKS);
