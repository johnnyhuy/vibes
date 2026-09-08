import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { Color, MeshStandardMaterial, type Mesh } from 'three';
import { enableShadows, fitObject } from '../modelFit';
import {
  FOREST_MODELS,
  LOGS,
  TREES,
  UNDERGROWTH,
  type PropSpot,
} from '../world';

const MOON_TINT = new Color('#d4ddd6');

function keepPbr(mesh: Mesh): void {
  const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  const next = materials.map((source) => {
    const base =
      source instanceof MeshStandardMaterial ? source.clone() : new MeshStandardMaterial({ color: '#2a2118' });
    if (base.map) base.color.multiply(MOON_TINT);
    else base.color = new Color('#1c3326');
    base.envMapIntensity = 0.72;
    if (base.transparent || base.alphaTest > 0) {
      base.alphaTest = Math.max(base.alphaTest, 0.32);
      base.depthWrite = true;
    }
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
      if (mesh.isMesh) keepPbr(mesh);
    });
    return clone;
  }, [ground, scene, targetSpan]);

  return <primitive object={model} />;
}

function ForestProp({ x, z, scale, twist, lean, model, span }: PropSpot) {
  return (
    <group position={[x, 0, z]} rotation={[lean, twist, -lean * 0.35]} scale={scale}>
      <FittedAsset url={model} targetSpan={span} />
    </group>
  );
}

export default function Forest() {
  return (
    <group>
      {TREES.map((tree, index) => (
        <ForestProp key={`canopy-${index}`} {...tree} />
      ))}
      {UNDERGROWTH.map((prop, index) => (
        <ForestProp key={`under-${index}`} {...prop} />
      ))}
      {LOGS.map((log, index) => (
        <ForestProp key={`log-${index}`} {...log} />
      ))}
    </group>
  );
}

for (const url of FOREST_MODELS) {
  useGLTF.preload(url);
}
