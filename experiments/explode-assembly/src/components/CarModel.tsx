import { useRef, useEffect, useMemo } from 'react';
import { useGLTF, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { calculateExplosionLayout } from '../utils/explosion';

interface CarModelProps {
  explode: number;
  selectedPart: string | null;
  isolated: boolean;
  onSelectPart: (part: string | null) => void;
}

// Kenney Car Kit - CC0 - Multiple GLB files assembled into car
const CAR_PARTS = [
  { file: '/models/sedan.glb', part: 'body', position: [0, 0, 0], scale: 1 },
  { file: '/models/wheel-default.glb', part: 'wheels', position: [-0.6, -0.3, 0.8], scale: 0.35 },
  { file: '/models/wheel-default.glb', part: 'wheels', position: [0.6, -0.3, 0.8], scale: 0.35 },
  { file: '/models/wheel-default.glb', part: 'wheels', position: [-0.6, -0.3, -0.8], scale: 0.35 },
  { file: '/models/wheel-default.glb', part: 'wheels', position: [0.6, -0.3, -0.8], scale: 0.35 },
];

export default function CarModel({ explode, selectedPart, isolated, onSelectPart }: CarModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const piecesRef = useRef<any[]>([]);
  
  // Load all car part GLBs
  const loadedParts = useMemo(() => {
    const parts: any[] = [];
    
    CAR_PARTS.forEach((partDef, i) => {
      try {
        const gltf = useGLTF(partDef.file);
        const clone = gltf.scene.clone();
        
        // Position and scale
        clone.position.set(...(partDef.position as [number, number, number]));
        clone.scale.setScalar(partDef.scale);
        
        // Calculate bounds
        const bounds = new THREE.Box3().setFromObject(clone);
        const center = bounds.getCenter(new THREE.Vector3());
        
        // Add metadata
        clone.userData.part = partDef.part;
        clone.userData.originalPosition = clone.position.clone();
        clone.userData.bounds = bounds;
        clone.userData.center = center;
        clone.userData.id = `${partDef.part}-${i}`;
        
        // Make all meshes selectable
        clone.traverse((node: any) => {
          if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
            node.userData.part = partDef.part;
            node.userData.pieceId = clone.userData.id;
            
            // Improve materials
            if (node.material) {
              const mat = node.material.clone();
              mat.metalness = 0.3;
              mat.roughness = 0.7;
              mat.envMapIntensity = 1.2;
              node.material = mat;
            }
          }
        });
        
        parts.push({
          object: clone,
          part: partDef.part,
          id: clone.userData.id,
          originalPosition: clone.position.clone(),
          bounds,
          center,
        });
      } catch (e) {
        console.warn(`Failed to load ${partDef.file}:`, e);
      }
    });
    
    return parts;
  }, []);
  
  // Calculate explosion layout
  const layout = useMemo(() => {
    if (!loadedParts.length) return [];
    return calculateExplosionLayout(loadedParts);
  }, [loadedParts]);
  
  // Store pieces ref
  useEffect(() => {
    piecesRef.current = loadedParts;
  }, [loadedParts]);
  
  // Animate explosion
  useFrame(() => {
    if (!groupRef.current || !piecesRef.current.length) return;
    
    const explosionAmount = explode / 100;
    const smoothAmount = THREE.MathUtils.lerp(
      piecesRef.current[0]?._lastAmount || 0,
      explosionAmount,
      0.1
    );
    
    piecesRef.current.forEach((piece, i) => {
      const offset = layout[i] || new THREE.Vector3();
      const targetPos = piece.originalPosition.clone().add(
        offset.clone().multiplyScalar(smoothAmount * 3)
      );
      
      piece.object.position.lerp(targetPos, 0.15);
      piece._lastAmount = smoothAmount;
      
      // Visibility based on selection/isolation
      if (isolated && selectedPart) {
        piece.object.visible = piece.part === selectedPart;
      } else {
        piece.object.visible = true;
      }
      
      // Highlight selected
      piece.object.traverse((node: any) => {
        if (node.isMesh && node.material) {
          if (piece.part === selectedPart) {
            node.material.emissive = new THREE.Color(0x3b82f6);
            node.material.emissiveIntensity = 0.3;
          } else if (selectedPart && piece.part !== selectedPart) {
            node.material.emissive = new THREE.Color(0x000000);
            node.material.emissiveIntensity = 0;
            node.material.opacity = 0.4;
            node.material.transparent = true;
          } else {
            node.material.emissive = new THREE.Color(0x000000);
            node.material.emissiveIntensity = 0;
            node.material.opacity = 1;
            node.material.transparent = false;
          }
        }
      });
    });
  });
  
  // Handle clicks
  const handleClick = (event: any) => {
    event.stopPropagation();
    const pieceId = event.object.userData.pieceId;
    const part = event.object.userData.part;
    if (part) {
      onSelectPart(part === selectedPart ? null : part);
    }
  };
  
  if (!loadedParts.length) {
    return (
      <group>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2, 1, 4]} />
          <meshStandardMaterial color="#ff0000" />
        </mesh>
        <Html center>
          <div style={{ background: 'rgba(0,0,0,0.8)', padding: '20px', borderRadius: '8px', color: 'white' }}>
            Loading car model...
          </div>
        </Html>
      </group>
    );
  }
  
  return (
    <group ref={groupRef} onClick={handleClick}>
      {loadedParts.map((piece, i) => (
        <primitive key={i} object={piece.object} />
      ))}
    </group>
  );
}

// Preload all models
CAR_PARTS.forEach(part => {
  useGLTF.preload(part.file);
});
