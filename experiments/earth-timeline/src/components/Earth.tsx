import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { TimelineData } from '../types';

export default function Earth({ currentEra, night }: { currentEra: TimelineData; night: boolean }) {
  const surface = useRef<THREE.Mesh>(null);
  const [maps, setMaps] = useState<THREE.Texture[]>([]);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  useEffect(() => {
    let active = true;
    const loader = new THREE.TextureLoader();
    const textures = ['/textures/earth-day.jpg', '/textures/earth-night.jpg'].map(url => loader.load(url, () => {
      if (active) setMaps([...textures]);
    }));
    textures.forEach(t => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; });
    return () => { active = false; textures.forEach(t => t.dispose()); };
  }, []);
  useFrame((_, delta) => {
    if (surface.current && !reduced) surface.current.rotation.y += Math.min(delta, .05) * .035;
  });
  // Modern geography is only shown for the final era. Earlier surfaces are illustrative.
  const modern = currentEra.time === 100;
  return <group rotation={[0,0,THREE.MathUtils.degToRad(23.4)]}>
    <mesh ref={surface}>
      <sphereGeometry args={[1,96,64]} />
      <meshStandardMaterial map={modern ? maps[night ? 1 : 0] ?? null : null}
        color={modern ? '#ffffff' : currentEra.color} roughness={.8}
        emissive={modern && night ? '#ffffff' : currentEra.time < 35 ? '#9c3510' : '#000000'}
        emissiveMap={modern && night ? maps[1] ?? null : null}
        emissiveIntensity={modern && night ? .9 : .3} />
    </mesh>
    <mesh>
      <sphereGeometry args={[1.035,64,48]} />
      <shaderMaterial transparent depthWrite={false} side={THREE.BackSide}
        uniforms={{ tint: {value: new THREE.Color('#75bded')}, strength: {value: currentEra.atmosphereOpacity * 4} }}
        vertexShader={'varying vec3 normalView; varying vec3 positionView; void main(){vec4 p=modelViewMatrix*vec4(position,1.);normalView=normalize(normalMatrix*normal);positionView=p.xyz;gl_Position=projectionMatrix*p;}'}
        fragmentShader={'varying vec3 normalView; varying vec3 positionView; uniform vec3 tint; uniform float strength; void main(){float rim=pow(1.-abs(dot(normalize(normalView),normalize(-positionView))),3.);gl_FragColor=vec4(tint,rim*strength);}'} />
    </mesh>
  </group>;
}
