import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  AdditiveBlending,
  CanvasTexture,
  Color,
  Quaternion,
  Vector3,
  type Group,
  type Mesh,
  type MeshStandardMaterial,
  type Object3D,
  type PointLight,
  type Points,
} from 'three';
import type { Finish } from '../finishes';

const COUNT = 52;
const SCREW_LIVE = Math.PI * 0.78;
const ROCKER_MUTED = -0.36;
const ROCKER_LIVE = 0.36;
const LOCAL_Z = new Vector3(0, 0, 1);

interface Props {
  origin: Vector3;
  radius: number;
  screw: Object3D | null;
  finish: Finish;
  muted: boolean;
  reducedMotion: boolean;
  onMute: () => void;
}

function emberMap(): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new CanvasTexture(canvas);
  const glow = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  glow.addColorStop(0, 'rgba(255,240,210,1)');
  glow.addColorStop(0.22, 'rgba(255,176,78,0.9)');
  glow.addColorStop(0.55, 'rgba(220,78,22,0.35)');
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 64, 64);
  const map = new CanvasTexture(canvas);
  map.needsUpdate = true;
  return map;
}

export default function MutePivot({
  origin,
  radius,
  screw,
  finish,
  muted,
  reducedMotion,
  onMute,
}: Props) {
  const paddle = useRef<Group>(null);
  const sparks = useRef<Points>(null);
  const lamp = useRef<PointLight>(null);
  const flash = useRef(0);
  const armed = useRef(false);
  const hover = useRef(false);
  const screwAngle = useRef(muted ? 0 : SCREW_LIVE);
  const screwVel = useRef(0);
  const rockerAngle = useRef(muted ? ROCKER_MUTED : ROCKER_LIVE);
  const rockerVel = useRef(0);
  const restScrew = useMemo(
    () => (screw?.userData.restQuat as Quaternion | undefined)?.clone() ?? screw?.quaternion.clone() ?? new Quaternion(),
    [screw]
  );
  const qSpin = useMemo(() => new Quaternion(), []);
  const ember = useMemo(() => new Color(finish.accent).lerp(new Color('#ff7a2a'), 0.4), [finish.accent]);
  const map = useMemo(emberMap, []);
  const positions = useMemo(() => {
    const data = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) data[i * 3 + 1] = -40;
    return data;
  }, []);
  const lives = useRef(new Float32Array(COUNT));
  const velocities = useRef(new Float32Array(COUNT * 3));
  const materials = useRef<MeshStandardMaterial[]>([]);

  useEffect(() => {
    if (!screw) return;
    return () => {
      screw.quaternion.copy(restScrew);
    };
  }, [restScrew, screw]);

  useLayoutEffect(() => {
    const next: MeshStandardMaterial[] = [];
    screw?.traverse((object) => {
      const mesh = object as Mesh;
      if (!mesh.isMesh || !mesh.material) return;
      const list = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const item of list) {
        const mat = item as MeshStandardMaterial;
        if (mat.emissive) next.push(mat);
      }
    });
    materials.current = next;
  }, [screw, finish]);

  useEffect(() => {
    if (!armed.current) {
      armed.current = true;
      return;
    }
    flash.current = 1;
    if (reducedMotion) return;
    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3;
      positions[ix] = (Math.random() - 0.5) * radius;
      positions[ix + 1] = (Math.random() - 0.5) * radius;
      positions[ix + 2] = (Math.random() - 0.5) * radius;
      velocities.current[ix] = (Math.random() - 0.5) * 2.8;
      velocities.current[ix + 1] = 1.8 + Math.random() * 3.4;
      velocities.current[ix + 2] = 1.2 + Math.random() * 2.4;
      lives.current[i] = 0.75 + Math.random() * 0.4;
    }
    const attr = sparks.current?.geometry.getAttribute('position');
    if (attr) attr.needsUpdate = true;
  }, [muted, origin, positions, radius, reducedMotion]);

  useFrame((_, dt) => {
    const step = Math.min(dt, 0.032);
    const stiffness = reducedMotion ? 80 : 260;
    const damp = reducedMotion ? 28 : 15;

    if (screw) {
      const screwTarget = muted ? 0 : SCREW_LIVE;
      screwVel.current += (screwTarget - screwAngle.current) * stiffness * step;
      screwVel.current *= Math.exp(-damp * step);
      screwAngle.current += screwVel.current * step;
      qSpin.setFromAxisAngle(LOCAL_Z, screwAngle.current);
      screw.quaternion.copy(restScrew).multiply(qSpin);
    }

    const rockerTarget = muted ? ROCKER_MUTED : ROCKER_LIVE;
    rockerVel.current += (rockerTarget - rockerAngle.current) * stiffness * step;
    rockerVel.current *= Math.exp(-damp * step);
    rockerAngle.current += rockerVel.current * step;
    if (paddle.current) paddle.current.rotation.z = rockerAngle.current;

    flash.current = Math.max(0, flash.current - step * (reducedMotion ? 6 : 1.7));
    const heat = flash.current + (hover.current ? 0.16 : 0);
    for (const mat of materials.current) {
      mat.emissive.set(heat > 0.02 ? finish.accent : '#000000');
      mat.emissiveIntensity = heat * 3.8;
    }
    if (lamp.current) lamp.current.intensity = flash.current * 48;

    if (reducedMotion || !sparks.current) return;
    const attr = sparks.current.geometry.getAttribute('position');
    const array = attr.array as Float32Array;
    for (let i = 0; i < COUNT; i++) {
      if (lives.current[i] <= 0) {
        array[i * 3 + 1] = -40;
        continue;
      }
      lives.current[i] -= step;
      const ix = i * 3;
      velocities.current[ix] *= Math.exp(-1.5 * step);
      velocities.current[ix + 1] -= 7.4 * step;
      velocities.current[ix + 2] *= Math.exp(-1.5 * step);
      array[ix] += velocities.current[ix] * step;
      array[ix + 1] += velocities.current[ix + 1] * step;
      array[ix + 2] += velocities.current[ix + 2] * step;
    }
    attr.needsUpdate = true;
  });

  return (
    <group position={origin} rotation={[0.05, -0.15, 0]}>
      <pointLight color="#fff4e4" intensity={2.8} distance={0.55} decay={2} />
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[radius * 1.4, radius * 1.5, radius * 0.32, 32]} />
        <meshPhysicalMaterial
          color="#2a2d33"
          metalness={0.82}
          roughness={0.3}
          clearcoat={0.4}
          envMapIntensity={1.2}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius * 1.42, radius * 0.09, 12, 36]} />
        <meshPhysicalMaterial
          color="#e6e9ee"
          metalness={0.96}
          roughness={0.08}
          clearcoat={0.85}
          clearcoatRoughness={0.08}
          envMapIntensity={1.7}
        />
      </mesh>
      <group ref={paddle}>
        <mesh castShadow position={[0, radius * 0.24, 0]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[radius * 0.24, radius * 1.75, 8, 20]} />
          <meshPhysicalMaterial
            color="#f2f4f7"
            metalness={0.97}
            roughness={0.08}
            clearcoat={0.88}
            clearcoatRoughness={0.08}
            anisotropy={0.75}
            envMapIntensity={1.75}
          />
        </mesh>
        <mesh position={[radius * 0.82, radius * 0.38, 0]}>
          <sphereGeometry args={[radius * 0.18, 16, 16]} />
          <meshPhysicalMaterial
            color={muted ? '#14161a' : finish.accent}
            emissive={muted ? '#000000' : finish.accent}
            emissiveIntensity={muted ? 0 : 1.25}
            metalness={0.28}
            roughness={0.18}
            clearcoat={0.55}
          />
        </mesh>
      </group>
      <mesh
        onPointerOver={(event) => {
          event.stopPropagation();
          hover.current = true;
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          hover.current = false;
          document.body.style.cursor = '';
        }}
        onPointerDown={(event) => {
          event.stopPropagation();
          onMute();
        }}
      >
        <sphereGeometry args={[Math.max(radius * 3.4, 0.09), 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <pointLight ref={lamp} color={ember} intensity={0} distance={1.7} decay={2} />
      <points ref={sparks} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={map}
          color={ember}
          size={0.08}
          transparent
          opacity={0.95}
          depthWrite={false}
          blending={AdditiveBlending}
          sizeAttenuation
        />
      </points>
    </group>
  );
}
