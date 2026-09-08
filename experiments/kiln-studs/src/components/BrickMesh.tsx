import { useMemo } from 'react';
import { Color } from 'three';
import { RoundedBox } from '@react-three/drei';
import { BRICK_H, PLATE_H, STUD, STUD_H, STUD_R } from '../catalog';
import { brickSize, hashShade } from '../bricks';
import type { BrickSpec, Palette } from '../types';

interface Props {
  brick: BrickSpec;
  palette: Palette;
  highlight: boolean;
}

function studRows(count: number): number[] {
  if (count <= 1) return [0];
  const origin = -((count - 1) * STUD) / 2;
  return Array.from({ length: count }, (_, i) => origin + i * STUD);
}

function Plastic({
  color,
  roughness,
  clearcoat,
  emissive,
  emissiveIntensity,
}: {
  color: Color;
  roughness: number;
  clearcoat: number;
  emissive: Color | string;
  emissiveIntensity: number;
}) {
  return (
    <meshPhysicalMaterial
      color={color}
      roughness={roughness}
      metalness={0.04}
      clearcoat={clearcoat}
      clearcoatRoughness={0.18}
      sheen={0.22}
      sheenRoughness={0.4}
      sheenColor={color}
      emissive={emissive}
      emissiveIntensity={emissiveIntensity}
      envMapIntensity={1.15}
    />
  );
}

export default function BrickMesh({ brick, palette, highlight }: Props) {
  const [width, height, depth] = brickSize(brick);
  const radius = Math.min(0.035, Math.min(width, depth, height) * 0.22);
  const hex = palette[brick.color];
  const color = useMemo(() => {
    const next = new Color(hex);
    next.offsetHSL(0, 0, hashShade(brick.id));
    return next;
  }, [hex, brick.id]);

  const emissive = highlight || brick.color === 'ember' ? color : '#000000';
  const emissiveIntensity = highlight ? 0.22 : brick.color === 'ember' ? 0.18 : 0;
  const showStuds = brick.kind !== 'tile';
  const xs = studRows(brick.w);
  const zs = studRows(brick.d);
  const top = height / 2;
  const roughness = brick.color === 'soot' ? 0.48 : 0.28;
  const clearcoat = brick.color === 'slip' ? 0.55 : 0.38;
  const finish = { color, roughness, clearcoat, emissive, emissiveIntensity };

  if (brick.kind === 'round') {
    const radiusBody = Math.min(width, depth) * 0.48;
    const studOffsets =
      brick.w === 1
        ? [[0, 0]]
        : [
            [-STUD / 2, -STUD / 2],
            [STUD / 2, -STUD / 2],
            [-STUD / 2, STUD / 2],
            [STUD / 2, STUD / 2],
          ];
    return (
      <group>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[radiusBody, radiusBody, height, 28]} />
          <Plastic {...finish} />
        </mesh>
        {showStuds &&
          studOffsets.map(([sx, sz], index) => (
            <group key={index} position={[sx, top, sz]}>
              <mesh position={[0, STUD_H / 2, 0]} castShadow>
                <cylinderGeometry args={[STUD_R, STUD_R, STUD_H, 20]} />
                <Plastic {...finish} />
              </mesh>
              <mesh position={[0, STUD_H * 0.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[STUD_R * 0.92, STUD_R * 0.12, 8, 20]} />
                <Plastic {...finish} />
              </mesh>
            </group>
          ))}
      </group>
    );
  }

  return (
    <group>
      <RoundedBox args={[width, height, depth]} radius={radius} smoothness={3} castShadow receiveShadow>
        <Plastic {...finish} />
      </RoundedBox>
      {showStuds &&
        xs.flatMap((sx) =>
          zs.map((sz) => (
            <group key={`${sx}:${sz}`} position={[sx, top, sz]}>
              <mesh position={[0, STUD_H / 2, 0]} castShadow>
                <cylinderGeometry args={[STUD_R, STUD_R, STUD_H, 20]} />
                <Plastic {...finish} />
              </mesh>
              <mesh position={[0, STUD_H * 0.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[STUD_R * 0.92, STUD_R * 0.12, 8, 20]} />
                <Plastic {...finish} />
              </mesh>
            </group>
          ))
        )}
      {brick.kind === 'brick' && brick.w * brick.d >= 2 && (
        <mesh position={[0, -height / 2 + PLATE_H * 0.12, 0]} receiveShadow>
          <boxGeometry args={[width * 0.86, PLATE_H * 0.16, depth * 0.86]} />
          <Plastic {...finish} />
        </mesh>
      )}
      {brick.kind === 'brick' && height >= BRICK_H * 0.9 && (
        <mesh position={[0, 0, 0]} receiveShadow>
          <boxGeometry args={[width * 0.92, height * 0.08, depth * 0.92]} />
          <Plastic {...finish} />
        </mesh>
      )}
    </group>
  );
}
