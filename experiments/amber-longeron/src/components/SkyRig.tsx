import { useLayoutEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { Color, Fog } from 'three';

const LINEN = '#e4d2b4';

export default function SkyRig() {
  const { scene } = useThree();

  useLayoutEffect(() => {
    const fog = scene.fog instanceof Fog ? scene.fog : new Fog(LINEN, 10, 38);
    fog.color.set(LINEN);
    fog.near = 10;
    fog.far = 38;
    scene.fog = fog;
    scene.background = new Color(LINEN);
  }, [scene]);

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.8, 8]}>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color={LINEN} roughness={1} />
      </mesh>
      <hemisphereLight args={['#fff6ea', '#d2bea0', 0.95]} />
      <ambientLight color="#f3e6d2" intensity={0.55} />
      <directionalLight color="#fff4e4" intensity={0.55} position={[-6, 10, 3]} />
    </>
  );
}
