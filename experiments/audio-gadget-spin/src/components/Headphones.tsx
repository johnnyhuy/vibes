import { useEffect, useLayoutEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { Color, Vector3, type Mesh, type MeshStandardMaterial } from 'three';
import type { Finish, HotspotId } from '../finishes';
import { enableShadows, findByName, fitObject, meshLabel } from '../modelFit';
import Hotspots from './Hotspots';
import MutePivot from './MutePivot';

const MODEL = '/models/headphones.glb';

interface Props {
  finish: Finish;
  highlight: HotspotId | null;
  muted: boolean;
  reducedMotion: boolean;
  onHotspot: (id: HotspotId) => void;
  onMute: () => void;
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

export default function Headphones({
  finish,
  highlight,
  muted,
  reducedMotion,
  onHotspot,
  onMute,
}: Props) {
  const { scene } = useGLTF(MODEL);
  const { model, anchors, screw, rocker } = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse(object => {
      const mesh = object as Mesh;
      if (!mesh.isMesh) return;
      const materials = (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).map(source => {
        const material = source.clone() as MeshStandardMaterial;
        material.userData.baseColor = material.color?.clone();
        return material;
      });
      mesh.material = Array.isArray(mesh.material) ? materials : materials[0];
    });
    const box = fitObject(clone, 2.28);
    enableShadows(clone);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    const screwNode = findByName(clone, 'Screw_9');
    if (screwNode) screwNode.userData.restQuat = screwNode.quaternion.clone();
    const origin = new Vector3(
      center.x + size.x * 0.31,
      center.y + size.y * 0.05,
      center.z + size.z * 0.48
    );
    return {
      model: clone,
      screw: screwNode,
      rocker: { origin, radius: 0.034 },
      anchors: {
        driver: [center.x + size.x * 0.42, center.y, center.z + size.z * 0.28],
        cushion: [center.x - size.x * 0.42, center.y - size.y * 0.06, center.z],
        yoke: [center.x, center.y + size.y * 0.46, center.z],
        controls: [origin.x, origin.y + 0.2, origin.z],
      } as Record<HotspotId, [number, number, number]>,
    };
  }, [scene]);

  useEffect(() => () => {
    model.traverse(object => {
      const mesh = object as Mesh;
      if(mesh.isMesh) (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach(m => m.dispose());
    });
  }, [model]);

  useLayoutEffect(() => {
    model.traverse((object) => {
      const mesh = object as Mesh;
      if (!mesh.isMesh || !mesh.material) return;
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      const next = materials.map((source) => {
        const mat = source as MeshStandardMaterial;
        const role = roleFor(meshLabel(mesh));
        const hex = finishColor(role, finish);
        if (mat.color) mat.color.copy(mat.userData.baseColor).lerp(new Color(hex), 0.72);
        const lit =
          highlight !== null &&
          (role === highlight || (highlight === 'controls' && (role === 'housing' || role === 'metal')));
        if (mat.emissive) {
          mat.emissive.set(lit ? finish.accent : '#000000');
          mat.emissiveIntensity = lit ? 0.28 : 0;
        }
        mat.envMapIntensity = 1.35;
        if (role === 'metal') {
          mat.metalness = 0.88;
          mat.roughness = 0.18;
        } else if (role === 'housing' || role === 'controls') {
          mat.roughness = Math.min(mat.roughness ?? 0.5, 0.42);
          mat.metalness = Math.max(mat.metalness ?? 0, 0.22);
        } else if (role === 'cushion') {
          mat.roughness = 0.78;
          mat.metalness = 0.04;
        }
        return mat;
      });
      mesh.material = next.length === 1 ? next[0] : next;
    });
  }, [finish, highlight, model]);

  return (
    <group>
      <primitive object={model} />
      <MutePivot
        origin={rocker.origin}
        radius={rocker.radius}
        screw={screw}
        finish={finish}
        muted={muted}
        reducedMotion={reducedMotion}
        onMute={onMute}
      />
      <Hotspots active={highlight} onPick={onHotspot} anchors={anchors} />
    </group>
  );
}

useGLTF.preload(MODEL);
