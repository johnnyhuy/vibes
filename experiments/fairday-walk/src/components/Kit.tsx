import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  CanvasTexture,
  Color,
  DoubleSide,
  InstancedMesh,
  MeshStandardMaterial,
  Object3D,
  PlaneGeometry,
  SRGBColorSpace,
} from 'three';
import { lane } from '../palette';
import { cobbleMap, plasterMap, tileMap, woodMap } from '../textures';

const dummy = new Object3D();

export function hash(n: number) {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

export function Plaster({ color = lane.plaster, roughness = 0.88 }: { color?: string; roughness?: number }) {
  const map = useMemo(() => plasterMap(), []);
  return <meshStandardMaterial color={color} map={map} roughness={roughness} metalness={0.02} />;
}

export function Wood({ color = lane.wood, roughness = 0.72 }: { color?: string; roughness?: number }) {
  const map = useMemo(() => woodMap(), []);
  return <meshStandardMaterial color={color} map={map} roughness={roughness} metalness={0.04} />;
}

export function Tile({ color = lane.tile }: { color?: string }) {
  const map = useMemo(() => tileMap(), []);
  return <meshStandardMaterial color={color} map={map} roughness={0.62} metalness={0.08} />;
}

export function Cobble({
  color = lane.cobble,
  roughness = 0.94,
  metalness = 0.02,
}: {
  color?: string;
  roughness?: number;
  metalness?: number;
}) {
  const map = useMemo(() => cobbleMap(), []);
  return <meshStandardMaterial color={color} map={map} roughness={roughness} metalness={metalness} />;
}

export function TileRoof({
  width,
  depth,
  rise = 1.15,
  color = lane.tile,
}: {
  width: number;
  depth: number;
  rise?: number;
  color?: string;
}) {
  const mesh = useRef<InstancedMesh>(null);
  const count = useMemo(() => {
    const cols = Math.max(6, Math.round(width / 0.24));
    const rows = Math.max(4, Math.round(depth / 0.2));
    return cols * rows * 2;
  }, [depth, width]);

  useLayoutEffect(() => {
    const instanced = mesh.current;
    if (!instanced) return;
    const cols = Math.max(6, Math.round(width / 0.24));
    const rows = Math.max(4, Math.round(depth / 0.2));
    const pitch = Math.atan2(rise, depth / 2);
    let i = 0;
    for (const side of [-1, 1]) {
      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const u = (col + 0.5) / cols - 0.5;
          const v = (row + 0.5) / rows;
          const x = u * width;
          const along = (v - 0.5) * depth * side;
          const y = rise * (1 - v) + 0.04;
          dummy.position.set(x, y, along);
          dummy.rotation.set(side * pitch, 0, 0);
          dummy.scale.set(1, 1, 1);
          dummy.updateMatrix();
          instanced.setMatrixAt(i, dummy.matrix);
          instanced.setColorAt(
            i,
            new Color(hash(i * 1.7) > 0.72 ? lane.tileRidge : hash(i) > 0.86 ? lane.tileDeep : color)
          );
          i += 1;
        }
      }
    }
    instanced.instanceMatrix.needsUpdate = true;
    if (instanced.instanceColor) instanced.instanceColor.needsUpdate = true;
  }, [color, count, depth, rise, width]);

  return (
    <group>
      <mesh castShadow>
        <boxGeometry args={[width * 1.06, 0.08, depth * 1.06]} />
        <Wood color={lane.woodLight} />
      </mesh>
      <instancedMesh ref={mesh} args={[undefined, undefined, count]} castShadow receiveShadow>
        <boxGeometry args={[0.23, 0.045, 0.2]} />
        <meshStandardMaterial roughness={0.58} metalness={0.08} />
      </instancedMesh>
      <mesh position={[0, rise + 0.06, 0]} castShadow>
        <boxGeometry args={[width * 1.02, 0.07, 0.1]} />
        <Wood />
      </mesh>
    </group>
  );
}

export function WindowBay({
  width = 0.72,
  height = 1.05,
  shutter = true,
}: {
  width?: number;
  height?: number;
  shutter?: boolean;
}) {
  return (
    <group>
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[width + 0.12, height + 0.12, 0.08]} />
        <Wood color={lane.woodLight} roughness={0.66} />
      </mesh>
      <mesh position={[0, 0, 0.06]}>
        <boxGeometry args={[width, height, 0.03]} />
        <meshStandardMaterial color={lane.glass} roughness={0.12} metalness={0.35} envMapIntensity={1.2} />
      </mesh>
      <mesh position={[0, 0, 0.04]}>
        <boxGeometry args={[0.03, height, 0.02]} />
        <Wood />
      </mesh>
      <mesh position={[0, 0.02, 0.04]}>
        <boxGeometry args={[width, 0.03, 0.02]} />
        <Wood />
      </mesh>
      <mesh position={[0, -height / 2 - 0.06, 0.1]} receiveShadow>
        <boxGeometry args={[width + 0.22, 0.06, 0.22]} />
        <Wood color={lane.woodLight} />
      </mesh>
      {shutter &&
        [-1, 1].map((side) => (
          <mesh key={side} position={[(width / 2 + 0.16) * side, 0, 0.08]} rotation={[0, side * 0.18, 0]} castShadow>
            <boxGeometry args={[0.22, height * 0.96, 0.04]} />
            <Wood color={hash(side + width) > 0.5 ? lane.wood : '#5a3d2c'} />
          </mesh>
        ))}
    </group>
  );
}

export function House({
  width,
  depth,
  height,
  plaster = lane.plaster,
  bays = 2,
  storeys = 2,
  door = true,
}: {
  width: number;
  depth: number;
  height: number;
  plaster?: string;
  bays?: number;
  storeys?: number;
  door?: boolean;
}) {
  const rise = Math.max(0.85, width * 0.22);
  const windows = useMemo(() => {
    const list: { x: number; y: number }[] = [];
    for (let storey = 0; storey < storeys; storey += 1) {
      for (let bay = 0; bay < bays; bay += 1) {
        if (storey === 0 && door && bay === Math.floor((bays - 1) / 2)) continue;
        list.push({
          x: ((bay + 0.5) / bays - 0.5) * (width - 0.9),
          y: 1.15 + storey * (height / storeys) * 0.78,
        });
      }
    }
    return list;
  }, [bays, door, height, storeys, width]);

  return (
    <group>
      <mesh position={[0, 0.14, 0]} castShadow receiveShadow>
        <boxGeometry args={[width + 0.16, 0.28, depth + 0.16]} />
        <meshStandardMaterial color={lane.earth} roughness={0.92} />
      </mesh>
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <Plaster color={plaster} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[(width / 2 - 0.07) * side, height / 2, 0]} castShadow>
          <boxGeometry args={[0.1, height, depth * 0.98]} />
          <Wood roughness={0.7} />
        </mesh>
      ))}
      <mesh position={[0, height + 0.05, 0]} castShadow>
        <boxGeometry args={[width + 0.18, 0.1, depth + 0.18]} />
        <Wood color={lane.woodLight} />
      </mesh>
      {windows.map((win, i) => (
        <group key={i} position={[win.x, win.y, depth / 2 + 0.01]}>
          <WindowBay width={0.62} height={0.92} shutter={i % 2 === 0} />
        </group>
      ))}
      {door && (
        <group position={[0, 1.05, depth / 2 + 0.02]}>
          <mesh castShadow>
            <boxGeometry args={[0.78, 1.85, 0.08]} />
            <Wood />
          </mesh>
          <mesh position={[0.22, 0.08, 0.05]}>
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshStandardMaterial color={lane.amber} roughness={0.35} metalness={0.55} />
          </mesh>
        </group>
      )}
      <group position={[0, height + 0.08, 0]}>
        <TileRoof width={width + 0.35} depth={depth + 0.4} rise={rise} />
      </group>
    </group>
  );
}

export function LaundrySheet({
  width = 0.95,
  height = 1.35,
  color = lane.clothCream,
  phase = 0,
  reducedMotion = false,
}: {
  width?: number;
  height?: number;
  color?: string;
  phase?: number;
  reducedMotion?: boolean;
}) {
  const material = useRef<MeshStandardMaterial>(null);
  const geometry = useMemo(() => {
    const plane = new PlaneGeometry(width, height, 10, 14);
    plane.translate(0, -height / 2, 0);
    return plane;
  }, [height, width]);

  useLayoutEffect(() => {
    const mat = material.current;
    if (!mat) return;
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0 };
      shader.uniforms.uPhase = { value: phase };
      shader.uniforms.uHang = { value: height };
      mat.userData.shader = shader;
      shader.vertexShader = `
        uniform float uTime;
        uniform float uPhase;
        uniform float uHang;
        ${shader.vertexShader}
      `.replace(
        '#include <begin_vertex>',
        `
        #include <begin_vertex>
        float hang = clamp(-position.y / max(uHang, 0.01), 0.0, 1.0);
        float wave = sin(uTime * 1.55 + position.y * 3.4 + uPhase) * hang;
        float sway = cos(uTime * 1.12 + uPhase * 0.7) * hang;
        transformed.x += wave * 0.14;
        transformed.z += sway * 0.09;
        `
      );
    };
    mat.needsUpdate = true;
  }, [height, phase]);

  useFrame((state) => {
    const shader = material.current?.userData.shader;
    if (!shader) return;
    shader.uniforms.uTime.value = reducedMotion ? 0 : state.clock.elapsedTime;
  });

  return (
    <mesh geometry={geometry} castShadow>
      <meshStandardMaterial
        ref={material}
        color={color}
        roughness={0.78}
        metalness={0.02}
        side={DoubleSide}
      />
    </mesh>
  );
}

export function Clothesline({
  length = 4.6,
  sheets = 4,
  reducedMotion = false,
  warm = false,
}: {
  length?: number;
  sheets?: number;
  reducedMotion?: boolean;
  warm?: boolean;
}) {
  const palette = warm
    ? [lane.clothRose, lane.clothStripe, lane.clothCream, lane.clothSky]
    : [lane.clothCream, lane.clothSky, lane.clothRose, lane.clothStripe];

  return (
    <group>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[(length / 2) * side, 1.05, 0]} castShadow>
          <cylinderGeometry args={[0.045, 0.055, 2.15, 8]} />
          <Wood />
        </mesh>
      ))}
      <mesh position={[0, 2.08, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.012, length, 6]} />
        <meshStandardMaterial color={lane.iron} roughness={0.45} metalness={0.4} />
      </mesh>
      {Array.from({ length: sheets }, (_, i) => {
        const x = ((i + 0.5) / sheets - 0.5) * (length - 0.7);
        return (
          <group key={i} position={[x, 2.06, 0]}>
            <LaundrySheet
              width={0.78 + hash(i) * 0.18}
              height={1.15 + hash(i + 3) * 0.28}
              color={palette[i % palette.length]}
              phase={i * 1.4}
              reducedMotion={reducedMotion}
            />
          </group>
        );
      })}
    </group>
  );
}

export function Bicycle({ lean = 0.08 }: { lean?: number }) {
  return (
    <group rotation={[0, 0, lean]}>
      {[-0.55, 0.55].map((x) => (
        <group key={x} position={[x, 0.38, 0]}>
          <mesh>
            <torusGeometry args={[0.36, 0.028, 8, 22]} />
            <meshStandardMaterial color={lane.iron} roughness={0.4} metalness={0.55} />
          </mesh>
          {Array.from({ length: 8 }, (_, i) => (
            <mesh key={i} rotation={[0, 0, (i / 8) * Math.PI]}>
              <cylinderGeometry args={[0.006, 0.006, 0.7, 4]} />
              <meshStandardMaterial color="#6a6560" roughness={0.5} metalness={0.4} />
            </mesh>
          ))}
        </group>
      ))}
      <mesh position={[0, 0.62, 0]} rotation={[0, 0, 0.32]}>
        <cylinderGeometry args={[0.018, 0.018, 1.05, 6]} />
        <meshStandardMaterial color="#3d5c78" roughness={0.42} metalness={0.35} />
      </mesh>
      <mesh position={[-0.18, 0.78, 0]} rotation={[0, 0, -0.55]}>
        <cylinderGeometry args={[0.016, 0.016, 0.72, 6]} />
        <meshStandardMaterial color="#3d5c78" roughness={0.42} metalness={0.35} />
      </mesh>
      <mesh position={[0.42, 0.86, 0]}>
        <torusGeometry args={[0.14, 0.014, 6, 14]} />
        <meshStandardMaterial color={lane.iron} roughness={0.38} metalness={0.5} />
      </mesh>
      <mesh position={[-0.38, 0.86, 0]} rotation={[1.2, 0, 0]}>
        <boxGeometry args={[0.22, 0.06, 0.16]} />
        <meshStandardMaterial color="#2c2824" roughness={0.7} />
      </mesh>
    </group>
  );
}

export function Well() {
  return (
    <group>
      <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.82, 0.9, 0.84, 16]} />
        <meshStandardMaterial color={lane.plasterShade} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.86, 0]} castShadow>
        <torusGeometry args={[0.78, 0.1, 8, 20]} />
        <meshStandardMaterial color={lane.cobble} roughness={0.86} />
      </mesh>
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.62, 0.62, 0.08, 12]} />
        <meshStandardMaterial color="#243038" roughness={0.95} />
      </mesh>
      {[-0.7, 0.7].map((x) => (
        <mesh key={x} position={[x, 1.45, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.045, 1.2, 6]} />
          <Wood />
        </mesh>
      ))}
      <mesh position={[0, 2.08, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 1.55, 6]} />
        <Wood color={lane.woodLight} />
      </mesh>
      <mesh position={[0.18, 1.55, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 1.1, 5]} />
        <meshStandardMaterial color="#8a7a68" roughness={0.55} />
      </mesh>
      <mesh position={[0.18, 0.95, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.12, 0.22, 10]} />
        <Wood color={lane.barrel} />
      </mesh>
      {Array.from({ length: 7 }, (_, i) => (
        <mesh key={i} position={[Math.cos((i / 7) * Math.PI * 2) * 0.92, 0.04, Math.sin((i / 7) * Math.PI * 2) * 0.92]}>
          <sphereGeometry args={[0.07 + hash(i) * 0.04, 6, 6]} />
          <meshStandardMaterial color={lane.moss} roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
}

export function Pigeon({ hue = '#c8c2b8' }: { hue?: string }) {
  return (
    <group>
      <mesh position={[0, 0.08, 0]} castShadow>
        <sphereGeometry args={[0.09, 10, 8]} />
        <meshStandardMaterial color={hue} roughness={0.62} />
      </mesh>
      <mesh position={[0.1, 0.14, 0]} scale={[0.7, 0.7, 0.7]}>
        <sphereGeometry args={[0.055, 8, 8]} />
        <meshStandardMaterial color={hue} roughness={0.58} />
      </mesh>
      <mesh position={[0.15, 0.13, 0]} rotation={[0, 0, -0.4]}>
        <coneGeometry args={[0.012, 0.05, 5]} />
        <meshStandardMaterial color="#c48a4a" roughness={0.45} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[-0.02, 0.08, 0.07 * side]} rotation={[0.15 * side, 0, 0.2]} castShadow>
          <boxGeometry args={[0.14, 0.03, 0.08]} />
          <meshStandardMaterial color={hue} roughness={0.6} />
        </mesh>
      ))}
      <mesh position={[-0.1, 0.07, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.08, 0.02, 0.05]} />
        <meshStandardMaterial color={hue} roughness={0.64} />
      </mesh>
    </group>
  );
}

export function Coop() {
  return (
    <group>
      <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.15, 0.55, 0.72]} />
        <Wood color={lane.woodLight} />
      </mesh>
      {[-0.28, 0.28].map((x) => (
        <mesh key={x} position={[x, 0.28, 0.37]}>
          <boxGeometry args={[0.22, 0.22, 0.02]} />
          <meshStandardMaterial color="#1c1a18" roughness={0.8} />
        </mesh>
      ))}
      <group position={[0, 0.58, 0]}>
        <TileRoof width={1.28} depth={0.86} rise={0.32} />
      </group>
    </group>
  );
}

export function Awning({ width = 3.4, depth = 1.35 }: { width?: number; depth?: number }) {
  const geometry = useMemo(() => {
    const plane = new PlaneGeometry(width, depth, 12, 6);
    const pos = plane.attributes.position;
    for (let i = 0; i < pos.count; i += 1) {
      const y = pos.getY(i);
      pos.setZ(i, Math.sin(((y + depth / 2) / depth) * Math.PI) * 0.16);
    }
    plane.computeVertexNormals();
    plane.rotateX(-Math.PI / 2.35);
    return plane;
  }, [depth, width]);

  const stripes = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Fairday Walk could not paint awning stripes');
    const band = 32;
    for (let x = 0; x < 256; x += band) {
      ctx.fillStyle = (x / band) % 2 === 0 ? '#f4efe4' : '#9bb7c9';
      ctx.fillRect(x, 0, band, 64);
    }
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = 8;
    return texture;
  }, []);

  return (
    <group>
      <mesh geometry={geometry} castShadow>
        <meshStandardMaterial map={stripes} roughness={0.68} side={DoubleSide} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[(width / 2 - 0.12) * side, -0.35, 0.35]} rotation={[0.55, 0, 0]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 1.05, 6]} />
          <Wood />
        </mesh>
      ))}
    </group>
  );
}

export function Fern({ scale = 1 }: { scale?: number }) {
  return (
    <group scale={scale}>
      <mesh position={[0, 0.12, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.12, 0.24, 10]} />
        <meshStandardMaterial color="#8a4a3a" roughness={0.78} />
      </mesh>
      {Array.from({ length: 7 }, (_, i) => {
        const a = (i / 7) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.08, 0.38, Math.sin(a) * 0.08]}
            rotation={[0.55, a, 0.15]}
            castShadow
          >
            <planeGeometry args={[0.16, 0.55]} />
            <meshStandardMaterial color={i % 2 ? lane.leaf : lane.leafLite} roughness={0.7} side={DoubleSide} />
          </mesh>
        );
      })}
    </group>
  );
}

export function CourtTree() {
  return (
    <group>
      <mesh position={[0, 1.35, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.3, 2.7, 10]} />
        <Wood />
      </mesh>
      {[
        [0, 3.05, 0, 1.35],
        [0.72, 2.72, 0.28, 0.82],
        [-0.62, 2.8, -0.22, 0.78],
        [0.28, 3.38, -0.38, 0.68],
        [-0.32, 3.22, 0.52, 0.62],
        [0.48, 3.15, 0.55, 0.5],
        [-0.55, 3.05, 0.18, 0.48],
        [0.08, 3.55, 0.12, 0.42],
      ].map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <sphereGeometry args={[r, 12, 10]} />
          <meshStandardMaterial color={i % 2 ? lane.leaf : '#3f5c30'} roughness={0.84} />
        </mesh>
      ))}
      {Array.from({ length: 10 }, (_, i) => (
        <mesh
          key={`bloom-${i}`}
          position={[
            Math.cos(i * 1.8) * 0.85,
            2.85 + hash(i + 8) * 0.7,
            Math.sin(i * 1.4) * 0.75,
          ]}
        >
          <sphereGeometry args={[0.045 + hash(i) * 0.02, 6, 6]} />
          <meshStandardMaterial color={hash(i) > 0.5 ? '#e8d27a' : lane.clothCream} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

export function BloomTuft({ count = 7 }: { count?: number }) {
  return (
    <group>
      {Array.from({ length: count }, (_, i) => (
        <mesh
          key={i}
          position={[(hash(i) - 0.5) * 0.55, 0.06, (hash(i + 4) - 0.5) * 0.55]}
        >
          <sphereGeometry args={[0.045 + hash(i + 2) * 0.025, 6, 6]} />
          <meshStandardMaterial color={hash(i) > 0.45 ? '#e8d27a' : lane.clothCream} roughness={0.55} />
        </mesh>
      ))}
    </group>
  );
}

export function FigTree() {
  return (
    <group>
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 1.4, 8]} />
        <Wood />
      </mesh>
      {[
        [0.35, 1.45, 0.1, 0.55],
        [-0.28, 1.55, -0.18, 0.48],
        [0.08, 1.75, 0.22, 0.42],
        [-0.12, 1.35, 0.28, 0.38],
      ].map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <sphereGeometry args={[r, 10, 8]} />
          <meshStandardMaterial color={i % 2 ? lane.leaf : '#4f6a38'} roughness={0.86} />
        </mesh>
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh
          key={`fig-${i}`}
          position={[
            Math.cos(i * 1.7) * 0.32,
            1.35 + hash(i) * 0.4,
            Math.sin(i * 1.4) * 0.28,
          ]}
        >
          <sphereGeometry args={[0.035, 6, 6]} />
          <meshStandardMaterial color="#6b3a48" roughness={0.55} />
        </mesh>
      ))}
    </group>
  );
}

export function RainBarrel() {
  return (
    <group>
      <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.38, 0.42, 1.02, 14]} />
        <Wood color={lane.barrel} />
      </mesh>
      {[0.22, 0.52, 0.82].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <torusGeometry args={[0.4, 0.02, 6, 16]} />
          <meshStandardMaterial color={lane.iron} roughness={0.4} metalness={0.5} />
        </mesh>
      ))}
      <mesh position={[0, 1.04, 0]}>
        <cylinderGeometry args={[0.36, 0.36, 0.04, 12]} />
        <meshStandardMaterial color="#3a4a52" roughness={0.35} metalness={0.2} />
      </mesh>
      <mesh position={[0.42, 1.55, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 1.2, 6]} />
        <meshStandardMaterial color={lane.iron} roughness={0.48} metalness={0.4} />
      </mesh>
    </group>
  );
}

export function Crate() {
  return (
    <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
      <boxGeometry args={[0.42, 0.36, 0.38]} />
      <Wood color={lane.woodLight} />
    </mesh>
  );
}

export function ActiveGlow({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
      <ringGeometry args={[1.55, 1.78, 32]} />
      <meshBasicMaterial color={lane.amber} transparent opacity={0.35} />
    </mesh>
  );
}
