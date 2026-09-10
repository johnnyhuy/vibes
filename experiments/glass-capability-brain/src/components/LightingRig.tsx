import { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import { lightingById, type LightingPreset } from '../lighting';

interface Props {
  preset: LightingPreset;
  reducedMotion: boolean;
}

const start = lightingById('pale-lift');
const skyGoal = new THREE.Color();
const groundGoal = new THREE.Color();
const keyGoal = new THREE.Color();
const fillGoal = new THREE.Color();
const bgGoal = new THREE.Color();
const formerAGoal = new THREE.Color();
const formerBGoal = new THREE.Color();
const formerCGoal = new THREE.Color();

function formerColor(mesh: THREE.Mesh | null, goal: THREE.Color, alpha: number) {
  const material = mesh?.material;
  if (material && !Array.isArray(material) && 'color' in material) {
    (material.color as THREE.Color).lerp(goal, alpha);
  }
}

export default function LightingRig({ preset, reducedMotion }: Props) {
  const { scene } = useThree();
  const bg = useRef<THREE.Color>(null);
  const hemi = useRef<THREE.HemisphereLight>(null);
  const ambient = useRef<THREE.AmbientLight>(null);
  const key = useRef<THREE.DirectionalLight>(null);
  const fill = useRef<THREE.DirectionalLight>(null);
  const formerA = useRef<THREE.Mesh>(null);
  const formerB = useRef<THREE.Mesh>(null);
  const formerC = useRef<THREE.Mesh>(null);
  const [envFrames, setEnvFrames] = useState(1);

  useEffect(() => {
    if (reducedMotion) {
      setEnvFrames(1);
      return undefined;
    }
    setEnvFrames(Infinity);
    const id = window.setTimeout(() => setEnvFrames(1), 1300);
    return () => window.clearTimeout(id);
  }, [preset.id, reducedMotion]);

  useFrame((_, delta) => {
    const alpha = reducedMotion ? 1 : 1 - Math.exp(-delta * 2.35);
    bgGoal.set(preset.background);
    skyGoal.set(preset.hemiSky);
    groundGoal.set(preset.hemiGround);
    keyGoal.set(preset.keyColor);
    fillGoal.set(preset.fillColor);
    formerAGoal.set(preset.formerA);
    formerBGoal.set(preset.formerB);
    formerCGoal.set(preset.formerC);

    bg.current?.lerp(bgGoal, alpha);
    formerColor(formerA.current, formerAGoal, alpha);
    formerColor(formerB.current, formerBGoal, alpha);
    formerColor(formerC.current, formerCGoal, alpha);

    if (typeof scene.environmentIntensity === 'number') {
      scene.environmentIntensity = THREE.MathUtils.lerp(
        scene.environmentIntensity,
        preset.envIntensity,
        alpha,
      );
    }

    if (hemi.current) {
      hemi.current.color.lerp(skyGoal, alpha);
      hemi.current.groundColor.lerp(groundGoal, alpha);
      hemi.current.intensity = THREE.MathUtils.lerp(
        hemi.current.intensity,
        preset.hemiIntensity,
        alpha,
      );
    }
    if (ambient.current) {
      ambient.current.intensity = THREE.MathUtils.lerp(
        ambient.current.intensity,
        preset.ambient,
        alpha,
      );
    }
    if (key.current) {
      key.current.color.lerp(keyGoal, alpha);
      key.current.intensity = THREE.MathUtils.lerp(
        key.current.intensity,
        preset.keyIntensity,
        alpha,
      );
    }
    if (fill.current) {
      fill.current.color.lerp(fillGoal, alpha);
      fill.current.intensity = THREE.MathUtils.lerp(
        fill.current.intensity,
        preset.fillIntensity,
        alpha,
      );
    }
  });

  return (
    <>
      <color ref={bg} attach="background" args={[start.background]} />
      <hemisphereLight ref={hemi} args={[start.hemiSky, start.hemiGround, start.hemiIntensity]} />
      <ambientLight ref={ambient} intensity={start.ambient} />
      <directionalLight
        ref={key}
        position={[6, 8, 4]}
        intensity={start.keyIntensity}
        color={start.keyColor}
      />
      <directionalLight
        ref={fill}
        position={[-5, 2, -4]}
        intensity={start.fillIntensity}
        color={start.fillColor}
      />

      <ContactShadows
        position={[0, -2.35, 0]}
        opacity={0.18}
        scale={18}
        blur={3.2}
        far={6}
        color="#8aa0b5"
      />

      <Environment frames={envFrames} resolution={256} environmentIntensity={start.envIntensity}>
        <Lightformer
          ref={formerA}
          intensity={1.6}
          position={[0, 5, 2]}
          scale={[8, 1.2, 1]}
          color={start.formerA}
        />
        <Lightformer
          ref={formerB}
          intensity={0.7}
          position={[-4, 2, -2]}
          scale={4}
          color={start.formerB}
        />
        <Lightformer
          ref={formerC}
          intensity={0.55}
          position={[4, 1, 3]}
          scale={3}
          color={start.formerC}
        />
      </Environment>
    </>
  );
}
