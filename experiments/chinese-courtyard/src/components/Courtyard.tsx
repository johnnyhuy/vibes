import { useMemo } from 'react';
import { ExtrudeGeometry, Path, Shape } from 'three';
import type { ResolvedLook } from '../atmosphere';

interface Props {
  look: ResolvedLook;
}

function Lattice({
  width,
  height,
  color,
}: {
  width: number;
  height: number;
  color: string;
}) {
  const cols = 5;
  const rows = 4;
  return (
    <group>
      <mesh>
        <boxGeometry args={[width, height, 0.04]} />
        <meshStandardMaterial color={color} roughness={0.62} metalness={0.04} />
      </mesh>
      {Array.from({ length: cols }, (_, i) => (
        <mesh key={`v-${i}`} position={[((i + 0.5) / cols - 0.5) * width * 0.86, 0, 0.03]}>
          <boxGeometry args={[0.03, height * 0.86, 0.02]} />
          <meshStandardMaterial color={color} roughness={0.55} />
        </mesh>
      ))}
      {Array.from({ length: rows }, (_, i) => (
        <mesh key={`h-${i}`} position={[0, ((i + 0.5) / rows - 0.5) * height * 0.86, 0.03]}>
          <boxGeometry args={[width * 0.86, 0.03, 0.02]} />
          <meshStandardMaterial color={color} roughness={0.55} />
        </mesh>
      ))}
    </group>
  );
}

function HipRoof({
  width,
  depth,
  height,
  tile,
  wood,
  snow,
}: {
  width: number;
  depth: number;
  height: number;
  tile: string;
  wood: string;
  snow: number;
}) {
  return (
    <group>
      <mesh rotation={[0, Math.PI / 4, 0]} scale={[width / Math.max(depth, 0.01), 1, 1]} castShadow>
        <coneGeometry args={[depth * 0.72, height, 4]} />
        <meshStandardMaterial color={tile} roughness={0.62} metalness={0.06} />
      </mesh>
      <mesh position={[0, 0.04, 0]} castShadow>
        <boxGeometry args={[width * 1.08, 0.07, depth * 1.08]} />
        <meshStandardMaterial color={wood} roughness={0.7} />
      </mesh>
      <mesh position={[0, height * 0.08, 0]} castShadow>
        <boxGeometry args={[width * 0.18, 0.08, depth * 1.02]} />
        <meshStandardMaterial color={wood} roughness={0.55} metalness={0.08} />
      </mesh>
      {snow > 0.4 && (
        <mesh position={[0, height * 0.42, 0]} rotation={[0, Math.PI / 4, 0]} scale={[width / Math.max(depth, 0.01), 1, 1]}>
          <coneGeometry args={[depth * 0.5, height * 0.28, 4]} />
          <meshStandardMaterial color="#f4f7fb" roughness={0.92} />
        </mesh>
      )}
    </group>
  );
}

function Hall({
  width,
  depth,
  height,
  look,
  bays,
  facing,
}: {
  width: number;
  depth: number;
  height: number;
  look: ResolvedLook;
  bays: number;
  facing: number;
}) {
  const posts = useMemo(
    () => Array.from({ length: bays + 1 }, (_, i) => ((i / bays) - 0.5) * (width - 0.28)),
    [bays, width]
  );

  return (
    <group rotation={[0, facing, 0]}>
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={look.plasterColor} roughness={0.86} metalness={0.02} />
      </mesh>
      <mesh position={[0, 0.08, depth / 2 + 0.22]} receiveShadow>
        <boxGeometry args={[width * 0.96, 0.12, 0.55]} />
        <meshStandardMaterial color={look.woodColor} roughness={0.72} />
      </mesh>
      {posts.map((x) => (
        <mesh key={x} position={[x, height * 0.48, depth / 2 + 0.04]} castShadow>
          <boxGeometry args={[0.11, height * 0.92, 0.11]} />
          <meshStandardMaterial color={look.woodColor} roughness={0.64} />
        </mesh>
      ))}
      {posts.slice(0, -1).map((x, i) => (
        <group key={`lat-${i}`} position={[(x + posts[i + 1]) / 2, height * 0.42, depth / 2 + 0.06]}>
          <Lattice width={(width / bays) * 0.72} height={height * 0.58} color={look.woodColor} />
        </group>
      ))}
      <group position={[0, height + 0.02, 0]}>
        <HipRoof
          width={width + 0.7}
          depth={depth + 0.85}
          height={1.05}
          tile={look.roofColor}
          wood={look.woodColor}
          snow={look.snowAmount}
        />
      </group>
    </group>
  );
}

function MoonGate({ look }: { look: ResolvedLook }) {
  const geometry = useMemo(() => {
    const shape = new Shape();
    const half = 5.35;
    const tall = 2.15;
    shape.moveTo(-half, 0);
    shape.lineTo(half, 0);
    shape.lineTo(half, tall);
    shape.lineTo(-half, tall);
    shape.closePath();
    const hole = new Path();
    hole.absellipse(-0.55, 0.98, 0.92, 0.92, 0, Math.PI * 2, false, 0);
    shape.holes.push(hole);
    return new ExtrudeGeometry(shape, { depth: 0.3, bevelEnabled: false, curveSegments: 28 });
  }, []);

  return (
    <group position={[0, 0, 5.05]} rotation={[0, 0, 0]}>
      <mesh geometry={geometry} position={[0, 0, -0.15]} castShadow receiveShadow>
        <meshStandardMaterial color={look.plasterColor} roughness={0.88} metalness={0.02} />
      </mesh>
      <mesh position={[-0.55, 0.98, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.96, 0.07, 10, 36]} />
        <meshStandardMaterial color={look.woodColor} roughness={0.55} metalness={0.06} />
      </mesh>
      <mesh position={[0, 2.22, 0]} castShadow>
        <boxGeometry args={[10.9, 0.12, 0.38]} />
        <meshStandardMaterial color={look.ridgeColor} roughness={0.7} />
      </mesh>
    </group>
  );
}

export default function Courtyard({ look }: Props) {
  return (
    <group>
      <mesh position={[0, -0.22, 0]} receiveShadow>
        <boxGeometry args={[16.4, 0.44, 16.4]} />
        <meshStandardMaterial color={look.stoneColor} roughness={0.92} />
      </mesh>
      <mesh position={[0, 0.01, 0]} receiveShadow>
        <boxGeometry args={[11.6, 0.04, 11.6]} />
        <meshStandardMaterial color={look.pavingColor} roughness={0.9} />
      </mesh>
      <group position={[0, 0, -4.55]}>
        <Hall width={8.4} depth={2.55} height={2.35} look={look} bays={3} facing={0} />
      </group>
      <group position={[4.25, 0, 0.55]}>
        <Hall width={5.2} depth={2.05} height={1.82} look={look} bays={2} facing={-Math.PI / 2} />
      </group>
      <group position={[-4.25, 0, 0.55]}>
        <Hall width={5.2} depth={2.05} height={1.82} look={look} bays={2} facing={Math.PI / 2} />
      </group>
      <MoonGate look={look} />
    </group>
  );
}
