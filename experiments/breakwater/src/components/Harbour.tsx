import { useMemo } from 'react';
import type { ResolvedLook } from '../look';

interface Props {
  look: ResolvedLook;
}

function Tetrapod({ x, z, scale, yaw }: { x: number; z: number; scale: number; yaw: number }) {
  const arms: [number, number, number][] = [
    [0.55, 0.55, 0.55],
    [-0.55, 0.55, -0.55],
    [0.55, -0.55, -0.55],
    [-0.55, -0.55, 0.55],
  ];

  return (
    <group position={[x, 0.55 * scale, z]} rotation={[0.18, yaw, 0.12]} scale={scale}>
      <mesh castShadow receiveShadow>
        <dodecahedronGeometry args={[0.42, 0]} />
        <meshStandardMaterial color="#8a8680" roughness={0.92} />
      </mesh>
      {arms.map((dir, index) => (
        <mesh key={index} position={dir.map((n) => n * 0.72) as [number, number, number]} rotation={[dir[1], 0, dir[0]]} castShadow>
          <cylinderGeometry args={[0.16, 0.22, 1.15, 6]} />
          <meshStandardMaterial color={index % 2 ? '#7a7670' : '#948e84'} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function Lamp({ x, z, gain }: { x: number; z: number; gain: number }) {
  return (
    <group position={[x, 1.42, z]}>
      <mesh position={[0, 1.15, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.06, 2.3, 6]} />
        <meshStandardMaterial color="#3a3632" metalness={0.4} roughness={0.45} />
      </mesh>
      <mesh position={[0, 2.38, 0.18]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[0.22, 0.1, 0.28]} />
        <meshStandardMaterial color="#2a2622" roughness={0.4} metalness={0.5} />
      </mesh>
      <mesh position={[0, 2.3, 0.28]}>
        <boxGeometry args={[0.16, 0.06, 0.1]} />
        <meshStandardMaterial color="#ffb070" emissive="#ff8a3a" emissiveIntensity={1.4 * gain} />
      </mesh>
      <pointLight position={[0, 2.2, 0.4]} color="#ffb070" intensity={1.15 * gain} distance={9} />
    </group>
  );
}

export default function Harbour({ look }: Props) {
  const tetrapods = useMemo(
    () =>
      [
        [-6.2, -2.2, 1.05, 0.4],
        [-8.4, -4.6, 1.2, 1.1],
        [-10.8, -6.8, 1.35, 2.2],
        [-13.6, -8.2, 1.15, 0.7],
        [-12.2, -3.4, 0.95, 2.8],
        [-15.4, -5.8, 1.05, 1.6],
        [-9.6, -8.8, 0.88, 0.2],
        [-17.2, -8.6, 1.28, 2.4],
        [-14.8, -11.2, 1.1, 1.9],
        [-7.4, -6.4, 0.78, 3.1],
        [-18.6, -6.4, 0.92, 0.9],
        [-11.4, -11.8, 0.84, 2.6],
      ] as const,
    []
  );

  const lamps = useMemo(
    () =>
      [
        [-3.15, 6],
        [3.15, 6],
        [-3.15, 14],
        [3.15, 14],
        [-3.15, 22],
        [3.15, 22],
        [-3.15, 30],
        [3.15, 30],
      ] as const,
    []
  );

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[18, -0.35, 18]} receiveShadow>
        <planeGeometry args={[48, 70]} />
        <meshStandardMaterial color="#3a4234" roughness={0.96} />
      </mesh>
      <mesh position={[16, 1.1, 10]} rotation={[0, 0.18, -0.12]} receiveShadow>
        <boxGeometry args={[22, 3.4, 36]} />
        <meshStandardMaterial color="#4a5340" roughness={0.94} />
      </mesh>

      <mesh position={[0, 1.28, 16]} receiveShadow castShadow>
        <boxGeometry args={[7.6, 0.42, 36]} />
        <meshStandardMaterial color={look.pierTint} roughness={0.86} />
      </mesh>
      {[-1.7, 0, 1.7].map((x) => (
        <mesh key={`joint-${x}`} position={[x, 1.5, 16]}>
          <boxGeometry args={[0.06, 0.02, 35]} />
          <meshStandardMaterial color="#5a564e" roughness={0.7} />
        </mesh>
      ))}
      {Array.from({ length: 9 }, (_, index) => {
        const z = 2 + index * 4;
        return (
          <mesh key={`seam-${z}`} position={[0, 1.5, z]}>
            <boxGeometry args={[7.4, 0.02, 0.06]} />
            <meshStandardMaterial color="#6a645c" roughness={0.68} />
          </mesh>
        );
      })}

      {[-3.2, 3.2].flatMap((x) =>
        Array.from({ length: 8 }, (_, index) => {
          const z = 4 + index * 4;
          return (
            <mesh key={`pile-${x}-${z}`} position={[x, 0.2, z]} castShadow>
              <cylinderGeometry args={[0.22, 0.26, 2.4, 8]} />
              <meshStandardMaterial color="#6a665e" roughness={0.88} />
            </mesh>
          );
        })
      )}

      {[-3.55, 3.55].map((x) => (
        <mesh key={`rail-${x}`} position={[x, 2.15, 16]} castShadow>
          <boxGeometry args={[0.06, 0.08, 35]} />
          <meshStandardMaterial color="#c8ccd0" metalness={0.62} roughness={0.28} />
        </mesh>
      ))}
      {[-3.55, 3.55].flatMap((x) =>
        Array.from({ length: 10 }, (_, index) => (
          <mesh key={`post-${x}-${index}`} position={[x, 1.82, 2 + index * 3.4]} castShadow>
            <boxGeometry args={[0.05, 0.72, 0.05]} />
            <meshStandardMaterial color="#b8bcc0" metalness={0.55} roughness={0.32} />
          </mesh>
        ))
      )}

      {[
        [-2.4, 4.2],
        [2.4, 4.8],
        [-2.2, 10.4],
      ].map(([x, z], index) => (
        <group key={`bollard-${index}`} position={[x, 1.62, z]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.14, 0.16, 0.42, 8]} />
            <meshStandardMaterial color="#3a3834" metalness={0.45} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.26, 0]}>
            <torusGeometry args={[0.12, 0.03, 6, 10]} />
            <meshStandardMaterial color="#c45a32" metalness={0.4} roughness={0.35} />
          </mesh>
        </group>
      ))}

      {[
        [-1.8, 8.6, 0.9],
        [-1.1, 9.4, 0.7],
        [2.1, 20.8, 1.05],
      ].map(([x, z, s], index) => (
        <mesh key={`crate-${index}`} position={[x, 1.72 + s * 0.28, z]} castShadow>
          <boxGeometry args={[s, s * 0.62, s * 0.8]} />
          <meshStandardMaterial color={index === 2 ? '#5a4030' : '#6a4a28'} roughness={0.82} />
        </mesh>
      ))}

      {lamps.map(([x, z], index) => (
        <Lamp key={`lamp-${index}`} x={x} z={z} gain={look.lampGain} />
      ))}

      {tetrapods.map(([x, z, scale, yaw], index) => (
        <Tetrapod key={`tetra-${index}`} x={x} z={z} scale={scale} yaw={yaw} />
      ))}

      <group position={[7.8, 0, 16.4]}>
        {[-2.4, 2.4].map((x) => (
          <group key={`tower-${x}`} position={[x, 0, 0]}>
            <mesh position={[0, 2.4, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.6, 4.8, 1.6]} />
              <meshStandardMaterial color="#7a746c" roughness={0.88} />
            </mesh>
            <mesh position={[0, 5.05, 0]} castShadow>
              <boxGeometry args={[1.85, 0.28, 1.85]} />
              <meshStandardMaterial color="#5a564e" roughness={0.7} />
            </mesh>
            <mesh position={[0, 4.2, 0.82]}>
              <boxGeometry args={[0.7, 0.9, 0.08]} />
              <meshStandardMaterial color="#1a3040" roughness={0.3} metalness={0.2} />
            </mesh>
            <mesh position={[0, 5.4, 0]}>
              <boxGeometry args={[0.18, 0.7, 0.18]} />
              <meshStandardMaterial color="#ffb070" emissive="#ff8a3a" emissiveIntensity={0.9 * look.lampGain} />
            </mesh>
          </group>
        ))}
        <mesh position={[0, 1.55, 0]} castShadow>
          <boxGeometry args={[3.4, 0.22, 0.16]} />
          <meshStandardMaterial color="#4a6a72" metalness={0.35} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.7, 0]}>
          <boxGeometry args={[3.2, 1.4, 0.08]} />
          <meshStandardMaterial color="#2a3a42" roughness={0.35} metalness={0.25} />
        </mesh>
      </group>

      {[-9.4, -12.6, -15.2].map((x, index) => (
        <mesh key={`kelp-${index}`} position={[x, 0.35, -1.8 - index]} rotation={[0.2, index, 0.15]}>
          <boxGeometry args={[0.08, 1.4, 0.28]} />
          <meshStandardMaterial color="#2a4a38" roughness={0.78} transparent opacity={0.72} />
        </mesh>
      ))}
    </group>
  );
}
