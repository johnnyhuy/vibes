import { useRef, useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { calculateExplosionLayout } from '../utils/explosion';

interface CarModelProps {
  explode: number;
  selectedPart: string | null;
  isolated: boolean;
  onSelectPart: (part: string | null) => void;
}

export default function CarModel({ explode, selectedPart, isolated, onSelectPart }: CarModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Try to load a GLB - will fallback to demo cubes if no model exists
  let gltf: any = null;
  let loadError = false;
  
  try {
    gltf = useGLTF('/models/car.glb');
  } catch (e) {
    loadError = true;
  }
  
  // Extract pieces from GLB or create demo pieces
  const pieces = useMemo(() => {
    if (loadError || !gltf) {
      // Create demo car from primitives (like the original)
      return createDemoCar();
    }
    
    // Extract meshes from GLB
    const meshPieces: any[] = [];
    gltf.scene.traverse((node: any) => {
      if (node.isMesh) {
        const bounds = new THREE.Box3().setFromObject(node);
        const center = bounds.getCenter(new THREE.Vector3());
        meshPieces.push({
          mesh: node,
          bounds,
          center,
          id: node.name || `piece-${meshPieces.length}`,
          part: node.userData.part || 'body',
        });
      }
    });
    
    return meshPieces;
  }, [gltf, loadError]);
  
  // Calculate explosion layout
  const layout = useMemo(() => {
    return calculateExplosionLayout(pieces);
  }, [pieces]);
  
  // Animate pieces
  useFrame(() => {
    if (!groupRef.current) return;
    
    const explosionAmount = explode / 100;
    
    pieces.forEach((piece, i) => {
      if (!piece.mesh) return;
      
      const offset = layout[i];
      const targetPos = piece.center.clone().add(offset.clone().multiplyScalar(explosionAmount * 5));
      
      piece.mesh.position.lerp(targetPos, 0.15);
      
      // Visibility based on selection/isolation
      if (isolated && selectedPart) {
        piece.mesh.visible = piece.part === selectedPart;
      } else {
        piece.mesh.visible = true;
      }
      
      // Highlight selected
      if (piece.part === selectedPart) {
        piece.mesh.material.emissiveIntensity = 0.3;
      } else {
        piece.mesh.material.emissiveIntensity = 0;
      }
    });
  });
  
  if (loadError || !gltf) {
    return (
      <group ref={groupRef}>
        {pieces.map((piece, i) => (
          <mesh
            key={i}
            geometry={piece.geometry}
            position={piece.center}
            castShadow
            receiveShadow
            onClick={() => onSelectPart(piece.part)}
          >
            <meshStandardMaterial 
              color={piece.color} 
              metalness={0.7} 
              roughness={0.3}
              emissive={piece.color}
            />
          </mesh>
        ))}
      </group>
    );
  }
  
  return (
    <group ref={groupRef}>
      <primitive object={gltf.scene} />
    </group>
  );
}

// Demo car builder (fallback when no GLB is loaded)
function createDemoCar() {
  const scale = 0.3;
  const pieces: any[] = [];
  
  const parts = [
    { part: 'body', color: '#4a4a4a', size: [14*scale, 0.4*scale, 5.5*scale], pos: [0, 1*scale, 0] },
    { part: 'glass', color: '#87ceeb', size: [8*scale, 0.1*scale, 4.8*scale], pos: [0, 2.8*scale, 0] },
    { part: 'doors', color: '#3a3a3a', size: [3*scale, 1.2*scale, 0.15*scale], pos: [-5.8*scale, 1.5*scale, 1.5*scale] },
    { part: 'wheels', color: '#2a2a2a', size: [0.8*scale, 1.9*scale, 1.9*scale], pos: [-5.5*scale, 0.6*scale, 3*scale] },
  ];
  
  parts.forEach((part, i) => {
    const geometry = new THREE.BoxGeometry(...part.size);
    const bounds = new THREE.Box3().setFromBufferAttribute(
      geometry.attributes.position as THREE.BufferAttribute
    );
    const center = new THREE.Vector3(...part.pos);
    
    pieces.push({
      geometry,
      bounds,
      center,
      id: `${part.part}-${i}`,
      part: part.part,
      color: part.color,
    });
  });
  
  return pieces;
}
