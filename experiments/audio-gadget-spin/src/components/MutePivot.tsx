import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  AdditiveBlending,
  Box3,
  CanvasTexture,
  Color,
  Quaternion,
  Vector3,
  type Mesh,
  type MeshStandardMaterial,
  type Object3D,
  type PointLight,
  type Points,
} from 'three';
import type { Finish } from '../finishes';

const COUNT = 36;
const SCREW_LIVE = Math.PI * 0.78;
const CUP_LIVE = 0.1;
const LOCAL_Z = new Vector3(0, 0, 1);

interface Props {
  origin: Vector3;
  axis: Vector3;
  radius: number;
  screw: Object3D;
  cup: Object3D | null;
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
  glow.addColorStop(0, 'rgba(255,236,196,1)');
  glow.addColorStop(0.28, 'rgba(255,168,72,0.85)');
  glow.addColorStop(0.62, 'rgba(210,72,24,0.28)');
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 64, 64);
  const map = new CanvasTexture(canvas);
  map.needsUpdate = true;
  return map;
}

export default function MutePivot({
  origin,
  axis,
  radius,
  screw,
  cup,
  finish,
  muted,
  reducedMotion,
  onMute,
}: Props) {
  const sparks = useRef<Points>(null);
  const lamp = useRef<PointLight>(null);
  const flash = useRef(0);
  const armed = useRef(false);
  const hover = useRef(false);
  const screwAngle = useRef(muted ? 0 : SCREW_LIVE);
  const screwVel = useRef(0);
  const cupAngle = useRef(muted ? 0 : CUP_LIVE);
  const cupVel = useRef(0);
  const restScrew = useMemo(() => screw.quaternion.clone(), [screw]);
  const restCup = useMemo(() => (cup ? cup.quaternion.clone() : new Quaternion()), [cup]);
  const qSpin = useMemo(() => new Quaternion(), []);
  const washerQuat = useMemo(
    () => new Quaternion().setFromUnitVectors(new Vector3(0, 0, 1), axis.clone().normalize()),
    [axis]
  );
  const ember = useMemo(() => new Color(finish.accent).lerp(new Color('#ff7a2a'), 0.45), [finish.accent]);
  const map = useMemo(emberMap, []);
  const positions = useMemo(() => {
    const data = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) data[i * 3 + 1] = -40;
    return data;
  }, []);
  const lives = useRef(new Float32Array(COUNT));
  const velocities = useRef(new Float32Array(COUNT * 3));
  const materials = useRef<MeshStandardMaterial[]>([]);

  useLayoutEffect(() => {
    const next: MeshStandardMaterial[] = [];
    screw.traverse((object) => {
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
      positions[ix] = origin.x + (Math.random() - 0.5) * radius * 0.4;
      positions[ix + 1] = origin.y + (Math.random() - 0.5) * radius * 0.4;
      positions[ix + 2] = origin.z + (Math.random() - 0.5) * radius * 0.4;
      const spray = 1.8 + Math.random() * 3.6;
      velocities.current[ix] = axis.x * spray + (Math.random() - 0.5) * 1.9;
      velocities.current[ix + 1] = axis.y * spray + 1.2 + Math.random() * 2.4;
      velocities.current[ix + 2] = axis.z * spray + (Math.random() - 0.5) * 1.9;
      lives.current[i] = 0.55 + Math.random() * 0.35;
    }
    const attr = sparks.current?.geometry.getAttribute('position');
    if (attr) attr.needsUpdate = true;
  }, [axis, muted, origin, positions, radius, reducedMotion]);

  useFrame((_, dt) => {
    const step = Math.min(dt, 0.032);
    const screwTarget = muted ? 0 : SCREW_LIVE;
    const cupTarget = muted ? 0 : CUP_LIVE;
    const stiffness = reducedMotion ? 80 : 220;
    const damp = reducedMotion ? 28 : 16;

    screwVel.current += (screwTarget - screwAngle.current) * stiffness * step;
    screwVel.current *= Math.exp(-damp * step);
    screwAngle.current += screwVel.current * step;
    qSpin.setFromAxisAngle(LOCAL_Z, screwAngle.current);
    screw.quaternion.copy(restScrew).multiply(qSpin);

    if (cup) {
      cupVel.current += (cupTarget - cupAngle.current) * (stiffness * 0.55) * step;
      cupVel.current *= Math.exp(-damp * step);
      cupAngle.current += cupVel.current * step;
      qSpin.setFromAxisAngle(LOCAL_Z, cupAngle.current);
      cup.quaternion.copy(restCup).multiply(qSpin);
    }

    flash.current = Math.max(0, flash.current - step * (reducedMotion ? 6 : 2.4));
    const heat = flash.current + (hover.current ? 0.12 : 0);
    for (const mat of materials.current) {
      mat.emissive.set(heat > 0.02 ? finish.accent : '#000000');
      mat.emissiveIntensity = heat * 3.4;
    }
    if (lamp.current) lamp.current.intensity = flash.current * 18;

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
      velocities.current[ix] *= Math.exp(-1.8 * step);
      velocities.current[ix + 1] -= 6.4 * step;
      velocities.current[ix + 2] *= Math.exp(-1.8 * step);
      array[ix] += velocities.current[ix] * step;
      array[ix + 1] += velocities.current[ix + 1] * step;
      array[ix + 2] += velocities.current[ix + 2] * step;
    }
    attr.needsUpdate = true;
  });

  const hit = Math.max(radius * 2.4, 0.07);

  return (
    <group>
      <mesh position={origin} quaternion={washerQuat}>
        <torusGeometry args={[radius * 0.92, radius * 0.16, 14, 36]} />
        <meshPhysicalMaterial
          color={finish.metal}
          metalness={0.94}
          roughness={0.14}
          clearcoat={0.72}
          clearcoatRoughness={0.16}
          anisotropy={0.55}
          envMapIntensity={1.45}
        />
      </mesh>
      <mesh position={origin}>
        <sphereGeometry args={[radius * 0.22, 16, 16]} />
        <meshPhysicalMaterial
          color={muted ? '#1b1c20' : finish.accent}
          emissive={muted ? '#000000' : finish.accent}
          emissiveIntensity={muted ? 0 : 0.85}
          metalness={0.35}
          roughness={0.22}
          clearcoat={0.4}
        />
      </mesh>
      <mesh
        position={origin}
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
        <sphereGeometry args={[hit, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <pointLight ref={lamp} position={origin} color={ember} intensity={0} distance={1.35} decay={2} />
      <points ref={sparks} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={map}
          color={ember}
          size={0.045}
          transparent
          opacity={0.92}
          depthWrite={false}
          blending={AdditiveBlending}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

export function pivotMetrics(screw: Object3D): { origin: Vector3; axis: Vector3; radius: number } {
  const origin = new Vector3();
  screw.updateWorldMatrix(true, false);
  screw.getWorldPosition(origin);
  const box = new Box3().setFromObject(screw);
  const size = box.getSize(new Vector3());
  const radius = Math.max(size.x, size.y, size.z) * 0.42;
  const axis = new Vector3(0, 0, 1).applyQuaternion(screw.getWorldQuaternion(new Quaternion()));
  if (axis.lengthSq() < 1e-6) axis.set(0, 0, 1);
  axis.normalize();
  return { origin, axis, radius: Math.max(radius, 0.018) };
}
