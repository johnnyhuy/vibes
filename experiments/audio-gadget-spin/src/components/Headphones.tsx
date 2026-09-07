import { useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import { CanvasTexture, CatmullRomCurve3, SRGBColorSpace, TubeGeometry, Vector3 } from 'three';
import type { Finish, HotspotId } from '../finishes';

interface Props {
  finish: Finish;
  highlight: HotspotId | null;
}

function headbandCurve() {
  const points: Vector3[] = [];
  for (let i = 0; i <= 40; i += 1) {
    const t = i / 40;
    const a = Math.PI * t;
    points.push(new Vector3(Math.cos(a) * 1.12, Math.sin(a) * 0.86 + 0.22, 0));
  }
  return new CatmullRomCurve3(points);
}

function grilleTexture(hex: string) {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not paint the driver grille');
  ctx.fillStyle = hex;
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = 'rgba(20, 12, 8, 0.38)';
  const step = 11;
  for (let y = 8; y < size - 6; y += step) {
    for (let x = 8; x < size - 6; x += step) {
      ctx.beginPath();
      ctx.arc(x + ((y / step) % 2) * 3, y, 2.05, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function glow(active: boolean, accent: string) {
  return {
    emissive: active ? accent : '#000000',
    emissiveIntensity: active ? 0.28 : 0,
  };
}

function Cup({
  side,
  finish,
  highlight,
  grille,
}: {
  side: 1 | -1;
  finish: Finish;
  highlight: HotspotId | null;
  grille: CanvasTexture;
}) {
  const open = side === 1;

  return (
    <group position={[side * 1.02, -0.38, 0]} rotation={[0.08, side * (Math.PI / 2), side * 0.05]}>
      <RoundedBox
        args={[0.78, 0.9, 0.4]}
        radius={0.14}
        smoothness={7}
        position={[0, 0, 0]}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          color={finish.housing}
          roughness={0.26}
          metalness={0.08}
          clearcoat={1}
          clearcoatRoughness={0.18}
          {...glow(highlight === 'controls', finish.accent)}
        />
      </RoundedBox>

      <RoundedBox
        args={[0.66, 0.78, 0.2]}
        radius={0.16}
        smoothness={7}
        position={[0, 0, -0.24]}
        castShadow
      >
        <meshPhysicalMaterial
          color={finish.pad}
          roughness={0.82}
          metalness={0}
          sheen={1}
          sheenRoughness={0.55}
          sheenColor={finish.pad}
          {...glow(highlight === 'cushion', finish.accent)}
        />
      </RoundedBox>

      {open ? (
        <group position={[0, 0, 0.205]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.02]}>
            <cylinderGeometry args={[0.29, 0.29, 0.05, 48]} />
            <meshPhysicalMaterial color="#14161a" roughness={0.7} metalness={0.2} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.27, 0.27, 0.03, 48]} />
            <meshPhysicalMaterial
              color={finish.metal}
              metalness={1}
              roughness={0.16}
              {...glow(highlight === 'driver', finish.accent)}
            />
          </mesh>
          <mesh position={[0, 0, 0.018]}>
            <circleGeometry args={[0.235, 48]} />
            <meshPhysicalMaterial
              color={finish.driver}
              map={grille}
              roughness={0.38}
              metalness={0.18}
              emissive={finish.driver}
              emissiveIntensity={highlight === 'driver' ? 0.45 : 0.16}
            />
          </mesh>
          <mesh position={[0, 0, 0.046]}>
            <meshPhysicalMaterial
              color={finish.glass}
              transmission={1}
              thickness={0.08}
              roughness={0.02}
              ior={1.48}
              metalness={0}
              clearcoat={1}
              clearcoatRoughness={0.04}
              transparent
              opacity={0.55}
              attenuationColor="#fff7ee"
              attenuationDistance={2.4}
              envMapIntensity={1.15}
            />
          </mesh>
        </group>
      ) : (
        <group position={[0, 0, 0.21]}>
          <mesh>
            <torusGeometry args={[0.11, 0.016, 16, 40]} />
            <meshPhysicalMaterial color={finish.metal} metalness={1} roughness={0.2} />
          </mesh>
          <mesh>
            <boxGeometry args={[0.16, 0.018, 0.018]} />
            <meshPhysicalMaterial color={finish.metal} metalness={1} roughness={0.2} />
          </mesh>
        </group>
      )}

      <group position={[0, 0.42, 0.06]}>
        {[-0.1, 0, 0.1].map((x) => (
          <RoundedBox key={x} args={[0.08, 0.035, 0.055]} radius={0.01} smoothness={3} position={[x, 0, 0]}>
            <meshPhysicalMaterial
              color="#2a2d32"
              roughness={0.35}
              metalness={0.4}
              {...glow(highlight === 'controls', finish.accent)}
            />
          </RoundedBox>
        ))}
      </group>
    </group>
  );
}

export default function Headphones({ finish, highlight }: Props) {
  const { outer, inner } = useMemo(() => {
    const curve = headbandCurve();
    return {
      outer: new TubeGeometry(curve, 64, 0.075, 20, false),
      inner: new TubeGeometry(curve, 64, 0.048, 16, false),
    };
  }, []);
  const grille = useMemo(() => grilleTexture(finish.driver), [finish.driver]);

  return (
    <group>
      <mesh geometry={outer} castShadow>
        <meshPhysicalMaterial
          color={finish.housing}
          roughness={0.28}
          metalness={0.06}
          clearcoat={0.8}
          clearcoatRoughness={0.22}
          {...glow(highlight === 'yoke', finish.accent)}
        />
      </mesh>
      <mesh geometry={inner}>
        <meshPhysicalMaterial
          color={finish.pad}
          roughness={0.78}
          metalness={0}
          sheen={0.8}
          sheenColor={finish.pad}
        />
      </mesh>

      {([-1, 1] as const).map((side) => (
        <group key={side} position={[side * 1.05, 0.08, 0]}>
          {[-0.045, 0.045].map((z) => (
            <mesh key={z} position={[0, -0.18, z]} castShadow>
              <cylinderGeometry args={[0.016, 0.016, 0.38, 16]} />
              <meshPhysicalMaterial
                color={finish.metal}
                metalness={1}
                roughness={0.14}
                {...glow(highlight === 'yoke', finish.accent)}
              />
            </mesh>
          ))}
          <RoundedBox args={[0.2, 0.12, 0.18]} radius={0.04} smoothness={4} position={[0, -0.36, 0]} castShadow>
            <meshPhysicalMaterial
              color={finish.housing}
              roughness={0.24}
              metalness={0.12}
              clearcoat={0.7}
              {...glow(highlight === 'yoke', finish.accent)}
            />
          </RoundedBox>
        </group>
      ))}

      <Cup side={-1} finish={finish} highlight={highlight} grille={grille} />
      <Cup side={1} finish={finish} highlight={highlight} grille={grille} />
    </group>
  );
}
