import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import {
  Color,
  MeshBasicMaterial,
  MeshStandardMaterial,
  type Mesh,
  type Material,
} from 'three';
import { enableShadows, fitObject } from '../modelFit';
import { LOG_MODEL, ROCK_MODELS, TREES, TREE_MODELS } from '../world';

function moonlight(mesh: Mesh): void {
  const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  const next = materials.map((source: Material) => {
    const base =
      source instanceof MeshStandardMaterial
        ? source.clone()
        : new MeshStandardMaterial({
            color: source instanceof MeshBasicMaterial ? source.color.clone() : '#2a2118',
            map: 'map' in source ? source.map : null,
          });
    const foliage = base.color.g > base.color.r * 1.04 && base.color.g > base.color.b;
    base.color = new Color(foliage ? '#1c3326' : '#2a2118');
    base.roughness = 0.94;
    base.metalness = 0.02;
    return base;
  });
  mesh.material = next.length === 1 ? next[0] : next;
}

function FittedAsset({
  url,
  targetSpan,
  ground = true,
}: {
  url: string;
  targetSpan: number;
  ground?: boolean;
}) {
  const { scene } = useGLTF(url);
  const model = useMemo(() => {
    const clone = scene.clone(true);
    fitObject(clone, targetSpan, { ground });
    enableShadows(clone);
    clone.traverse((object) => {
      const mesh = object as Mesh;
      if (mesh.isMesh) moonlight(mesh);
    });
    return clone;
  }, [ground, scene, targetSpan]);

  return <primitive object={model} />;
}

function ForestTree({
  x,
  z,
  scale,
  twist,
  lean,
  model,
}: (typeof TREES)[number]) {
  return (
    <group position={[x, 0, z]} rotation={[lean, twist, -lean * 0.4]} scale={scale * 1.55}>
      <FittedAsset url={model} targetSpan={4.2} />
    </group>
  );
}

export default function Forest() {
  return (
    <group>
      {TREES.map((tree, index) => (
        <ForestTree key={index} {...tree} />
      ))}
      {[0, 1, 2, 3, 4, 5].map((index) => {
        const angle = (index / 6) * Math.PI * 2;
        return (
          <group key={`rock-${index}`} position={[Math.cos(angle) * 5.6, 0, Math.sin(angle) * 5.6]}>
            <FittedAsset url={ROCK_MODELS[index % ROCK_MODELS.length]} targetSpan={0.95} />
          </group>
        );
      })}
      {[
        [-3.8, -4.2, 1.1],
        [4.6, 3.2, 0.7],
      ].map(([x, z, yaw], index) => (
        <group key={`log-${index}`} position={[x, 0, z]} rotation={[0, yaw, 0]}>
          <FittedAsset url={LOG_MODEL} targetSpan={1.8} />
        </group>
      ))}
    </group>
  );
}

for (const url of [...TREE_MODELS, ...ROCK_MODELS, LOG_MODEL]) {
  useGLTF.preload(url);
}
