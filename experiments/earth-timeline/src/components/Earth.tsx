import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TimelineData } from '../types';

interface EarthProps {
  currentEra: TimelineData;
}

export default function Earth({ currentEra }: EarthProps) {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);

  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0a4a7a');
    gradient.addColorStop(0.5, '#1e5a8a');
    gradient.addColorStop(1, '#0a4a7a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 400; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const w = 30 + Math.random() * 150;
      const h = 30 + Math.random() * 100;
      
      ctx.fillStyle = Math.random() > 0.6 
        ? `rgba(34, 89, 45, ${0.8 + Math.random() * 0.2})`
        : `rgba(101, 85, 55, ${0.7 + Math.random() * 0.3})`;
      
      ctx.beginPath();
      ctx.ellipse(x, y, w / 2, h / 2, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }

    return new THREE.CanvasTexture(canvas);
  }, []);

  const cloudTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = 'transparent';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 300; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const r = 20 + Math.random() * 60;
      
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
      gradient.addColorStop(0, `rgba(255, 255, 255, ${0.6 + Math.random() * 0.4})`);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    return new THREE.CanvasTexture(canvas);
  }, []);

  useEffect(() => {
    if (earthRef.current) {
      earthRef.current.material.color.set(currentEra.color);
    }
    if (cloudsRef.current) {
      (cloudsRef.current.material as THREE.MeshPhongMaterial).opacity = currentEra.cloudOpacity;
    }
    if (atmosphereRef.current) {
      (atmosphereRef.current.material as THREE.MeshBasicMaterial).opacity = currentEra.atmosphereOpacity;
    }
  }, [currentEra]);

  useFrame((state, delta) => {
    if (earthRef.current) earthRef.current.rotation.y += delta * 0.1;
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.12;
  });

  return (
    <group>
      <mesh ref={earthRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhongMaterial
          map={earthTexture}
          bumpScale={0.05}
          shininess={10}
          color={currentEra.color}
        />
      </mesh>

      <mesh ref={cloudsRef}>
        <sphereGeometry args={[1.01, 32, 32]} />
        <meshPhongMaterial
          map={cloudTexture}
          transparent
          opacity={currentEra.cloudOpacity}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[1.15, 32, 32]} />
        <meshBasicMaterial
          color="#3b82f6"
          transparent
          opacity={currentEra.atmosphereOpacity}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}
