import { useLayoutEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { Color, MeshPhysicalMaterial, Vector3, type Mesh, type MeshStandardMaterial } from 'three';
import type { Finish, HotspotId } from '../finishes';
import { enableShadows, fitObject, meshLabel } from '../modelFit';
import Hotspots from './Hotspots';

const MODEL = '/models/headphones.glb';

interface Props {
  finish: Finish;
  highlight: HotspotId | null;
  onHotspot: (id: HotspotId) => void;
}

function roleFor(label: string): HotspotId | 'housing' | 'metal' {
  if (label.includes('net')) return 'driver';
  if (label.includes('foam')) return 'cushion';
  if (label.includes('support') || label.includes('head')) return 'yoke';
  if (label.includes('screw')) return 'metal';
  if (label.includes('cover') || label.includes('rail')) return 'controls';
  return 'housing';
}

function finishColor(role: ReturnType<typeof roleFor>, finish: Finish): string {
  if (role === 'driver') return finish.driver;
  if (role === 'cushion') return finish.pad;
  if (role === 'metal') return finish.metal;
  return finish.housing;
}

export default function Headphones({ finish, highlight, onHotspot }: Props) {
  const { scene } = useGLTF(MODEL);
  const { model, anchors } = useMemo(() => {
    const clone = scene.clone(true);
    const box = fitObject(clone, 2.28);
    enableShadows(clone);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    return {
      model: clone,
      anchors: {
        driver: [center.x + size.x * 0.42, center.y, center.z + size.z * 0.28],
        cushion: [center.x - size.x * 0.42, center.y - size.y * 0.06, center.z],
        yoke: [center.x, center.y + size.y * 0.46, center.z],
        controls: [center.x + size.x * 0.36, center.y + size.y * 0.16, center.z + size.z * 0.08],
      } as Record<HotspotId, [number, number, number]>,
    };
  }, [scene]);

  useLayoutEffect(() => {
    model.traverse((object) => {
      const mesh = object as Mesh;
      if (!mesh.isMesh || !mesh.material) return;
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      const next = materials.map((source) => {
        const std = (source as MeshStandardMaterial).clone() as MeshStandardMaterial;
        const mat = new MeshPhysicalMaterial();
        mat.copy(std);
        const role = roleFor(meshLabel(mesh));
        const hex = finishColor(role, finish);
        if (mat.color) mat.color.lerp(new Color(hex), 0.72);
        const lit = highlight !== null && (role === highlight || (highlight === 'controls' && role === 'housing'));
        mat.emissive.set(lit ? finish.accent : '#000000');
        mat.emissiveIntensity = lit ? 0.28 : 0;
        mat.envMapIntensity = 1.25;
        if (role === 'metal') {
          mat.metalness = 0.88;
          mat.roughness = 0.18;
          mat.clearcoat = 0.65;
          mat.clearcoatRoughness = 0.2;
        } else if (role === 'housing' || role === 'controls') {
          mat.clearcoat = 0.42;
          mat.clearcoatRoughness = 0.32;
          mat.roughness = Math.min(mat.roughness, 0.48);
        } else if (role === 'cushion') {
          mat.roughness = 0.78;
          mat.clearcoat = 0.05;
        }
        return mat;
      });
      mesh.material = next.length === 1 ? next[0] : next;
    });
  }, [finish, highlight, model]);

  return (
    <group>
      <primitive object={model} />
      <Hotspots active={highlight} onPick={onHotspot} anchors={anchors} />
    </group>
  );
}

useGLTF.preload(MODEL);
