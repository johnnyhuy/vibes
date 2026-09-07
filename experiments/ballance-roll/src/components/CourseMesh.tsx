import { useLayoutEffect, useMemo } from 'react';
import { CanvasTexture, RepeatWrapping, type Texture } from 'three';
import { HAZE_WALK, type CourseSegment } from '../course';
import { createPathBody } from '../physics';
import { useCannonWorld } from './PhysicsWorld';

function makeTileTexture(): Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not paint the path tiles');
  }
  ctx.fillStyle = '#c8c2b6';
  ctx.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 8; y += 1) {
    for (let x = 0; x < 8; x += 1) {
      const shade = 0.08 + ((x * 17 + y * 11) % 7) * 0.03;
      ctx.fillStyle = `rgba(72, 68, 62, ${shade})`;
      ctx.fillRect(x * 32 + 1, y * 32 + 1, 30, 30);
      ctx.strokeStyle = 'rgba(255, 248, 236, 0.18)';
      ctx.strokeRect(x * 32 + 1.5, y * 32 + 1.5, 29, 29);
    }
  }
  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.anisotropy = 8;
  return texture;
}

function PathSlab({ segment, texture }: { segment: CourseSegment; texture: Texture }) {
  const world = useCannonWorld();
  const color =
    segment.kind === 'beam' ? '#b7c3c8' : segment.kind === 'finish' ? '#d5c4a4' : '#c4beb2';
  const map = useMemo(() => {
    const next = texture.clone();
    next.needsUpdate = true;
    next.repeat.set(segment.size[0] / 1.4, segment.size[2] / 1.4);
    return next;
  }, [segment.size, texture]);

  useLayoutEffect(() => {
    const body = createPathBody(segment);
    world.addBody(body);
    return () => {
      world.removeBody(body);
      map.dispose();
    };
  }, [map, segment, world]);

  return (
    <group position={segment.position} rotation={segment.rotation}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={segment.size} />
        <meshStandardMaterial color={color} map={map} roughness={0.86} metalness={0.04} />
      </mesh>
      {segment.rails && (
        <>
          <mesh position={[segment.size[0] / 2 + 0.06, 0.28, 0]} castShadow>
            <boxGeometry args={[0.08, 0.42, segment.size[2] * 0.98]} />
            <meshStandardMaterial color="#9ec4d4" roughness={0.35} metalness={0.2} />
          </mesh>
          <mesh position={[-segment.size[0] / 2 - 0.06, 0.28, 0]} castShadow>
            <boxGeometry args={[0.08, 0.42, segment.size[2] * 0.98]} />
            <meshStandardMaterial color="#9ec4d4" roughness={0.35} metalness={0.2} />
          </mesh>
        </>
      )}
      {(segment.kind === 'pad' || segment.kind === 'finish') && (
        <mesh position={[0, -11, 0]} receiveShadow>
          <cylinderGeometry args={[0.42, 0.55, 22, 8]} />
          <meshStandardMaterial color="#9c958a" roughness={0.92} />
        </mesh>
      )}
    </group>
  );
}

function PathMarker({
  position,
  yaw
}: {
  position: [number, number, number];
  yaw: number;
}) {
  return (
    <group position={position} rotation={[0, yaw, 0]}>
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.2, 1.1, 8]} />
        <meshStandardMaterial color="#8b8376" roughness={0.84} />
      </mesh>
      <mesh position={[0, 1.18, 0]} castShadow>
        <boxGeometry args={[0.42, 0.32, 0.42]} />
        <meshStandardMaterial color="#f0c56a" emissive="#d9a02a" emissiveIntensity={0.55} roughness={0.35} />
      </mesh>
      <mesh position={[0, 1.4, 0]} castShadow>
        <coneGeometry args={[0.26, 0.18, 4]} />
        <meshStandardMaterial color="#7d766b" roughness={0.8} />
      </mesh>
      <pointLight position={[0, 1.18, 0]} color="#ffb45a" intensity={1.1} distance={6} />
    </group>
  );
}

function FinishHoop({ segment }: { segment: CourseSegment }) {
  return (
    <group position={segment.position} rotation={segment.rotation}>
      <mesh position={[0, 1.35, -0.2]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <torusGeometry args={[1.15, 0.07, 10, 28]} />
        <meshStandardMaterial color="#c9a24a" metalness={0.7} roughness={0.28} />
      </mesh>
    </group>
  );
}

function HazeMote({ position, taken }: { position: [number, number, number]; taken: boolean }) {
  if (taken) return null;
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.22, 14, 12]} />
      <meshStandardMaterial
        color="#e7c4ff"
        emissive="#b070ff"
        emissiveIntensity={0.85}
        roughness={0.25}
        metalness={0.1}
      />
    </mesh>
  );
}

export default function CourseMesh({ takenMotes }: { takenMotes: string[] }) {
  const texture = useMemo(() => makeTileTexture(), []);
  const finish = HAZE_WALK.segments.find((segment) => segment.id === HAZE_WALK.finishId);

  useLayoutEffect(() => {
    return () => texture.dispose();
  }, [texture]);

  return (
    <group>
      {HAZE_WALK.segments.map((segment) => (
        <PathSlab key={segment.id} segment={segment} texture={texture} />
      ))}
      {HAZE_WALK.markers.map((marker, i) => (
        <PathMarker key={`mark-${i}`} position={marker.position} yaw={marker.yaw} />
      ))}
      {finish && <FinishHoop segment={finish} />}
      {HAZE_WALK.motes.map((mote) => (
        <HazeMote key={mote.id} position={mote.position} taken={takenMotes.includes(mote.id)} />
      ))}
    </group>
  );
}
