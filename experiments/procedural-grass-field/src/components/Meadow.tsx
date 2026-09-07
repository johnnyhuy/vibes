import { useMemo } from 'react';
import { Color, InstancedMesh, MeshStandardMaterial, Object3D, SphereGeometry } from 'three';
import type { Look } from '../presets';

interface Props {
  look: Look;
  onGust: (x: number, z: number, strength: number) => void;
}

const dummy = new Object3D();

function hash(n: number): number {
  const x = Math.sin(n * 91.7) * 23421.631;
  return x - Math.floor(x);
}

function Flowers({ look }: { look: Look }) {
  const mesh = useMemo(() => {
    const geometry = new SphereGeometry(0.07, 7, 6);
    const material = new MeshStandardMaterial({
      roughness: 0.55,
      metalness: 0.02,
    });
    const count = 220;
    const instanced = new InstancedMesh(geometry, material, count);
    const palette = ['#e8c45a', '#e07a6a', '#f4f0e4', '#7aa0d4'].map((hex) => new Color(hex));
    let placed = 0;
    for (let i = 0; placed < count && i < count * 4; i += 1) {
      const u = hash(i + 3.2);
      const v = hash(i + 8.1);
      const radius = Math.sqrt(u) * 16.5;
      const angle = v * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      if (Math.abs(z * Math.cos(0.18) - x * Math.sin(0.18)) < 0.7) continue;
      dummy.position.set(x, 0.16 + hash(i * 2.2) * 0.08, z);
      dummy.scale.setScalar(0.55 + hash(i * 4.4) * 0.7);
      dummy.updateMatrix();
      instanced.setMatrixAt(placed, dummy.matrix);
      instanced.setColorAt(placed, palette[i % palette.length]);
      placed += 1;
    }
    instanced.count = placed;
    instanced.instanceMatrix.needsUpdate = true;
    if (instanced.instanceColor) instanced.instanceColor.needsUpdate = true;
    instanced.frustumCulled = false;
    return instanced;
  }, []);

  mesh.material.color.set(look.ambientColor);
  return <primitive object={mesh} />;
}

function Hills() {
  const spots = [
    [16, -1.6, -10, 7.2],
    [-17, -1.8, 8, 8.1],
    [4, -2.4, -18, 9.4],
    [-8, -2.1, -16, 7.8],
    [18, -1.4, 12, 6.4],
  ] as const;

  return (
    <group>
      {spots.map(([x, y, z, s], index) => (
        <mesh key={index} position={[x, y, z]} scale={[s, 2.2, s * 0.82]} castShadow>
          <sphereGeometry args={[1, 18, 12]} />
          <meshStandardMaterial color="#6d7a52" roughness={0.92} />
        </mesh>
      ))}
    </group>
  );
}

function Rocks() {
  const spots = [
    [3.4, 0.18, -2.2, 0.42],
    [-4.8, 0.14, 1.6, 0.34],
    [1.1, 0.12, 4.6, 0.28],
    [-7.2, 0.16, -4.1, 0.38],
  ] as const;

  return (
    <group>
      {spots.map(([x, y, z, s], index) => (
        <mesh key={index} position={[x, y, z]} rotation={[0.2, index, 0.15]} scale={[s, s * 0.7, s * 1.1]} castShadow>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#8a8478" roughness={0.88} />
        </mesh>
      ))}
    </group>
  );
}

export default function Meadow({ look, onGust }: Props) {
  return (
    <group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        onPointerMove={(event) => {
          onGust(event.point.x, event.point.z, 1.15);
        }}
        onPointerOut={() => onGust(0, 0, 0)}
      >
        <circleGeometry args={[19.4, 64]} />
        <meshStandardMaterial color="#4a5a30" roughness={0.96} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0.18]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[22, 1.15]} />
        <meshStandardMaterial color="#6b5a3c" roughness={0.97} />
      </mesh>
      <Hills />
      <Rocks />
      <Flowers look={look} />
    </group>
  );
}
