import { useLayoutEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { Color, Fog } from 'three';

const LINEN = '#e6d4b8';
const SAND = '#d7c3a4';

export default function SkyRig() {
  const { scene } = useThree();

  useLayoutEffect(() => {
    const fog = scene.fog instanceof Fog ? scene.fog : new Fog(LINEN, 18, 62);
    fog.color.set(LINEN);
    fog.near = 18;
    fog.far = 62;
    scene.fog = fog;
    scene.background = new Color(LINEN);
  }, [scene]);

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 12]} receiveShadow>
        <planeGeometry args={[48, 90]} />
        <meshStandardMaterial color={SAND} roughness={1} />
      </mesh>
      <hemisphereLight args={['#fff4e4', '#c4a888', 0.82]} />
      <ambientLight color="#f0e2cc" intensity={0.42} />
      <directionalLight
        color="#fff1dc"
        intensity={1.35}
        position={[-7, 12, 4]}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={2}
        shadow-camera-far={40}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
      />
    </>
  );
}
