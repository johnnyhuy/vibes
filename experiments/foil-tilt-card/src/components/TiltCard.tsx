import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import {
  AdditiveBlending,
  Color,
  DoubleSide,
  Group,
  NormalBlending,
  ShaderMaterial,
  Vector2,
  type Texture,
} from 'three';
import { ART_INSET, CARD_H, CARD_R, CARD_W } from '../card';
import { foilFragment, foilVertex } from '../foilShader';
import { cardFaceGeometry, cardStockGeometry } from '../geometry';
import { buildCardAtlas, disposeAtlas } from '../layers';

interface Props {
  foil: number;
  tilt: number;
  spread: number;
  flipped: boolean;
  sway: boolean;
  reducedMotion: boolean;
  resetToken: number;
}

const MAX_TILT = 0.55;
const FACE_W = CARD_W - ART_INSET * 2;
const FACE_H = CARD_H - ART_INSET * 2;

function useAtlas() {
  const atlas = useMemo(() => buildCardAtlas(), []);
  useEffect(() => () => disposeAtlas(atlas), [atlas]);
  return atlas;
}

function makeFoilMaterial(map: Texture, mask: Texture, print: number) {
  return new ShaderMaterial({
    uniforms: {
      tMap: { value: map },
      tMask: { value: mask },
      uIntensity: { value: 0.68 },
      uTime: { value: 0 },
      uPrint: { value: print },
      uTilt: { value: new Vector2() },
      uTint: { value: new Color('#9fd4e6') },
    },
    vertexShader: foilVertex,
    fragmentShader: foilFragment,
    transparent: true,
    depthWrite: false,
    side: DoubleSide,
    blending: print > 0.5 ? NormalBlending : AdditiveBlending,
  });
}

function FoilMesh({
  map,
  mask,
  foil,
  print,
  z,
  geometry,
  pose,
}: {
  map: Texture;
  mask: Texture;
  foil: number;
  print: number;
  z: number;
  geometry: ReturnType<typeof cardFaceGeometry>;
  pose: MutableRefObject<{ x: number; y: number }>;
}) {
  const material = useMemo(() => makeFoilMaterial(map, mask, print), [map, mask, print]);
  useEffect(() => () => material.dispose(), [material]);

  useFrame((state) => {
    material.uniforms.uIntensity.value = foil;
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uTilt.value.set(pose.current.x, pose.current.y);
  });

  return (
    <mesh position={[0, 0, z]} geometry={geometry} material={material} />
  );
}

function ArtPlane({
  map,
  z,
  geometry,
}: {
  map: Texture;
  z: number;
  geometry: ReturnType<typeof cardFaceGeometry>;
}) {
  return (
    <mesh position={[0, 0, z]} geometry={geometry}>
      <meshBasicMaterial map={map} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

export default function TiltCard({
  foil,
  tilt,
  spread,
  flipped,
  sway,
  reducedMotion,
  resetToken,
}: Props) {
  const root = useRef<Group>(null);
  const flip = useRef<Group>(null);
  const front = useRef<Group>(null);
  const back = useRef<Group>(null);
  const pointer = useRef({ active: false, nx: 0, ny: 0 });
  const pose = useRef({ x: 0, y: 0, flip: 0, zoom: 5.15 });
  const atlas = useAtlas();
  const { gl } = useThree();

  const stockGeo = useMemo(() => cardStockGeometry(CARD_W, CARD_H, CARD_R, 0.036), []);
  const rimGeo = useMemo(() => cardFaceGeometry(CARD_W, CARD_H, CARD_R), []);
  const faceGeo = useMemo(() => cardFaceGeometry(FACE_W, FACE_H, CARD_R - 0.02), []);

  useEffect(
    () => () => {
      stockGeo.dispose();
      rimGeo.dispose();
      faceGeo.dispose();
    },
    [stockGeo, rimGeo, faceGeo],
  );

  useEffect(() => {
    pose.current.x = 0;
    pose.current.y = 0;
    pointer.current.nx = 0;
    pointer.current.ny = 0;
    pose.current.zoom = 5.15;
  }, [resetToken]);

  useEffect(() => {
    const el = gl.domElement;
    const down = (event: PointerEvent) => {
      pointer.current.active = true;
      pointer.current.nx = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.ny = (event.clientY / window.innerHeight) * 2 - 1;
      el.setPointerCapture(event.pointerId);
    };
    const move = (event: PointerEvent) => {
      if (!pointer.current.active) return;
      pointer.current.nx = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.ny = (event.clientY / window.innerHeight) * 2 - 1;
    };
    const up = (event: PointerEvent) => {
      pointer.current.active = false;
      if (el.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId);
    };
    const wheel = (event: WheelEvent) => {
      event.preventDefault();
      pose.current.zoom = Math.min(6.8, Math.max(4.2, pose.current.zoom + event.deltaY * 0.002));
    };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointerleave', up);
    el.addEventListener('wheel', wheel, { passive: false });
    return () => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointerleave', up);
      el.removeEventListener('wheel', wheel);
    };
  }, [gl]);

  useFrame((state, delta) => {
    const group = root.current;
    if (!group) return;

    const aimX = pointer.current.active
      ? pointer.current.ny * MAX_TILT * tilt
      : sway && !reducedMotion
        ? Math.sin(state.clock.elapsedTime * 0.55) * 0.12
        : 0;
    const aimY = pointer.current.active
      ? pointer.current.nx * MAX_TILT * tilt
      : sway && !reducedMotion
        ? Math.cos(state.clock.elapsedTime * 0.4) * 0.16
        : 0;
    const ease = reducedMotion ? 1 : 1 - Math.pow(0.0008, delta);
    pose.current.x += (aimX - pose.current.x) * ease;
    pose.current.y += (aimY - pose.current.y) * ease;
    pose.current.flip += ((flipped ? Math.PI : 0) - pose.current.flip) * (reducedMotion ? 1 : ease);

    group.rotation.x = pose.current.x;
    group.rotation.y = pose.current.y;
    if (flip.current) flip.current.rotation.y = pose.current.flip;

    const slideX = pose.current.y * spread * 0.22;
    const slideY = -pose.current.x * spread * 0.18;
    if (front.current) {
      front.current.children.forEach((child, index) => {
        const depth = [-0.85, 0.95, 0.4, 0.18, 0.12][index] ?? 0;
        child.position.x = slideX * depth;
        child.position.y = slideY * depth;
      });
    }
    if (back.current) {
      back.current.children.forEach((child, index) => {
        const depth = [-0.7, 0.2][index] ?? 0;
        child.position.x = -slideX * depth;
        child.position.y = slideY * depth;
      });
    }

    state.camera.position.z += (pose.current.zoom - state.camera.position.z) * ease;
  });

  const bgZ = -0.012 - spread * 0.22;
  const subjectZ = 0.048 + spread * 0.32;
  const lineZ = 0.072 + spread * 0.12;
  const textZ = 0.09 + spread * 0.06;
  const foilZ = 0.108 + spread * 0.04;

  return (
    <group ref={root}>
      <group ref={flip}>
        <mesh position={[0, 0, -0.018]} geometry={stockGeo}>
          <meshPhysicalMaterial
            color="#12151c"
            roughness={0.42}
            metalness={0.28}
            clearcoat={0.35}
            clearcoatRoughness={0.4}
          />
        </mesh>
        <mesh position={[0, 0, -0.004]} geometry={rimGeo}>
          <meshPhysicalMaterial
            color="#c9b27a"
            roughness={0.28}
            metalness={0.72}
            emissive="#3a3018"
            emissiveIntensity={0.16}
          />
        </mesh>
        <group ref={front}>
          <FoilMesh
            map={atlas.background}
            mask={atlas.foilMask}
            foil={foil}
            print={1}
            z={bgZ}
            geometry={faceGeo}
            pose={pose}
          />
          <ArtPlane map={atlas.subject} z={subjectZ} geometry={faceGeo} />
          <ArtPlane map={atlas.lineart} z={lineZ} geometry={faceGeo} />
          <ArtPlane map={atlas.text} z={textZ} geometry={faceGeo} />
          <FoilMesh
            map={atlas.foilMask}
            mask={atlas.foilMask}
            foil={foil}
            print={0}
            z={foilZ}
            geometry={faceGeo}
            pose={pose}
          />
        </group>
        <group ref={back} rotation={[0, Math.PI, 0]}>
          <FoilMesh
            map={atlas.verso}
            mask={atlas.versoMask}
            foil={foil * 0.55}
            print={1}
            z={0.04}
            geometry={faceGeo}
            pose={pose}
          />
          <FoilMesh
            map={atlas.versoMask}
            mask={atlas.versoMask}
            foil={foil * 0.42}
            print={0}
            z={0.058}
            geometry={faceGeo}
            pose={pose}
          />
        </group>
      </group>
    </group>
  );
}
