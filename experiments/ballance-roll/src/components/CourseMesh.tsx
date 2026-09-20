import { useLayoutEffect, useMemo } from 'react';
import { useGLTF, useTexture } from '@react-three/drei';
import { RepeatWrapping, SRGBColorSpace, type Texture } from 'three';
import {
  HAZE_BUST,
  HAZE_DIYA,
  HAZE_LANTERN,
  PATH_DIFF,
  PATH_NOR,
  PATH_ROUGH
} from '../assets';
import { HAZE_WALK, type CourseProp, type CourseSegment } from '../course';
import { dressPbr, enableShadows, fitObject } from '../modelFit';
import { createPathBody } from '../physics';
import { useCannonWorld } from './PhysicsWorld';

function cloneMaps(
  maps: { diff: Texture; nor: Texture; rough: Texture },
  repeatX: number,
  repeatY: number
) {
  const diff = maps.diff.clone();
  const nor = maps.nor.clone();
  const rough = maps.rough.clone();
  [diff, nor, rough].forEach((texture) => {
    texture.needsUpdate = true;
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(repeatX, repeatY);
    texture.anisotropy = 8;
  });
  diff.colorSpace = SRGBColorSpace;
  return { diff, nor, rough };
}

function PathSlab({
  segment,
  maps
}: {
  segment: CourseSegment;
  maps: { diff: Texture; nor: Texture; rough: Texture };
}) {
  const world = useCannonWorld();
  const tint =
    segment.kind === 'beam' ? '#d4dde4' : segment.kind === 'finish' ? '#ead9bc' : '#ddd3c4';
  const tiled = useMemo(
    () => cloneMaps(maps, segment.size[0] / 1.35, segment.size[2] / 1.35),
    [maps, segment.size]
  );

  useLayoutEffect(() => {
    const body = createPathBody(segment);
    world.addBody(body);
    return () => {
      world.removeBody(body);
      tiled.diff.dispose();
      tiled.nor.dispose();
      tiled.rough.dispose();
    };
  }, [segment, tiled, world]);

  return (
    <group position={segment.position} rotation={segment.rotation}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={segment.size} />
        <meshStandardMaterial
          color={tint}
          map={tiled.diff}
          normalMap={tiled.nor}
          roughnessMap={tiled.rough}
          roughness={0.82}
          metalness={0.04}
          envMapIntensity={1.05}
        />
      </mesh>
      {segment.rails && (
        <>
          <mesh position={[segment.size[0] / 2 + 0.06, 0.28, 0]} castShadow>
            <boxGeometry args={[0.08, 0.42, segment.size[2] * 0.98]} />
            <meshStandardMaterial
              color="#9eb8c6"
              roughness={0.28}
              metalness={0.55}
              envMapIntensity={1.45}
            />
          </mesh>
          <mesh position={[-segment.size[0] / 2 - 0.06, 0.28, 0]} castShadow>
            <boxGeometry args={[0.08, 0.42, segment.size[2] * 0.98]} />
            <meshStandardMaterial
              color="#9eb8c6"
              roughness={0.28}
              metalness={0.55}
              envMapIntensity={1.45}
            />
          </mesh>
        </>
      )}
      {(segment.kind === 'pad' || segment.kind === 'finish') && (
        <mesh position={[0, -11, 0]} receiveShadow>
          <cylinderGeometry args={[0.4, 0.54, 22, 20]} />
          <meshStandardMaterial
            color="#b7aea2"
            map={tiled.diff}
            roughnessMap={tiled.rough}
            roughness={0.9}
            metalness={0.03}
            envMapIntensity={0.7}
          />
        </mesh>
      )}
    </group>
  );
}

function FittedProp({ url, span, env }: { url: string; span: number; env: number }) {
  const { scene } = useGLTF(url);
  const model = useMemo(() => {
    const clone = scene.clone(true);
    fitObject(clone, span, { ground: true });
    enableShadows(clone);
    dressPbr(clone, env);
    return clone;
  }, [env, scene, span]);

  return <primitive object={model} />;
}

function CoursePropMesh({ prop }: { prop: CourseProp }) {
  const url = prop.kind === 'bust' ? HAZE_BUST : prop.kind === 'diya' ? HAZE_DIYA : HAZE_LANTERN;
  const lamp = prop.kind !== 'bust';

  return (
    <group position={prop.position} rotation={[0, prop.yaw, 0]}>
      <FittedProp url={url} span={prop.span} env={prop.kind === 'bust' ? 1.35 : 1.2} />
      {lamp && (
        <pointLight
          position={[0, prop.kind === 'diya' ? 0.72 : 0.62, 0]}
          color={prop.kind === 'diya' ? '#ffb45a' : '#ffc27a'}
          intensity={prop.kind === 'diya' ? 1.35 : 1.05}
          distance={6.5}
        />
      )}
    </group>
  );
}

function FinishHoop({ segment }: { segment: CourseSegment }) {
  return (
    <group position={segment.position} rotation={segment.rotation}>
      <mesh position={[0, 1.35, -0.2]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <torusGeometry args={[1.15, 0.07, 12, 36]} />
        <meshStandardMaterial color="#c9a24a" metalness={0.78} roughness={0.22} envMapIntensity={1.55} />
      </mesh>
    </group>
  );
}

function HazeMote({ position, taken }: { position: [number, number, number]; taken: boolean }) {
  if (taken) return null;
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.22, 16, 14]} />
      <meshStandardMaterial
        color="#e7c4ff"
        emissive="#b070ff"
        emissiveIntensity={0.85}
        roughness={0.22}
        metalness={0.12}
        envMapIntensity={1.15}
      />
    </mesh>
  );
}

export default function CourseMesh({ takenMotes }: { takenMotes: string[] }) {
  const [diff, nor, rough] = useTexture([PATH_DIFF, PATH_NOR, PATH_ROUGH]);
  const maps = useMemo(() => {
    diff.colorSpace = SRGBColorSpace;
    [diff, nor, rough].forEach((texture) => {
      texture.wrapS = RepeatWrapping;
      texture.wrapT = RepeatWrapping;
      texture.anisotropy = 8;
    });
    return { diff, nor, rough };
  }, [diff, nor, rough]);
  const finish = HAZE_WALK.segments.find((segment) => segment.id === HAZE_WALK.finishId);

  return (
    <group>
      {HAZE_WALK.segments.map((segment) => (
        <PathSlab key={segment.id} segment={segment} maps={maps} />
      ))}
      {HAZE_WALK.props.map((prop) => (
        <CoursePropMesh key={prop.id} prop={prop} />
      ))}
      {finish && <FinishHoop segment={finish} />}
      {HAZE_WALK.motes.map((mote) => (
        <HazeMote key={mote.id} position={mote.position} taken={takenMotes.includes(mote.id)} />
      ))}
    </group>
  );
}

useGLTF.preload(HAZE_LANTERN);
useGLTF.preload(HAZE_DIYA);
useGLTF.preload(HAZE_BUST);
