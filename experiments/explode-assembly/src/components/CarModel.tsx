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

// System mapping for Tesla Model 3 2021 Long Range
const SYSTEM_KEYWORDS: Record<string, string[]> = {
  body: ['body', 'chassis', 'frame', 'structure', 'hood', 'trunk', 'fender', 'bumper', 'panel'],
  glass: ['glass', 'window', 'windshield', 'roof'],
  doors: ['door', 'handle'],
  interior: ['seat', 'dashboard', 'console', 'interior', 'steering'],
  battery: ['battery', 'pack', 'cell'],
  motors: ['motor', 'drive', 'powertrain'],
  thermal: ['radiator', 'cooler', 'hvac', 'condenser'],
  suspension: ['suspension', 'spring', 'shock', 'strut', 'arm'],
  wheels: ['wheel', 'tire', 'brake', 'rotor', 'caliper'],
  charging: ['charger', 'port', 'cable', 'connector'],
  electronics: ['computer', 'ecu', 'battery_12v', 'wiring'],
  lights: ['light', 'lamp', 'headlight', 'taillight', 'fog'],
};

// Whitelist-only approach: include ONLY meshes that match car system keywords
// or are named car roots. Everything else is excluded by default (props, unnamed Object_*, etc.)
function shouldIncludeMesh(name: string): boolean {
  if (!name || name.length === 0) {
    return false; // Skip unnamed meshes
  }
  
  const lowerName = name.toLowerCase();
  
  // Explicitly exclude known props/scene objects first
  // (catches "traffic_light" before "light" keyword matches it to lights system)
  const EXCLUDE_KEYWORDS = [
    'traffic', 'light_pole', 'pole', 'sign', 'cone', 'barrier',
    'speaker', 'table', 'chair', 'cactus', 'kayak', 'train',
    'floor', 'wall', 'ceiling', 'room', 'ground_plane', 'plane',
    'picnic', 'bench', 'prop', 'decoration', 'fence', 
    'tire_stack', 'tire_prop', 'background', 'environment',
    'light_001', 'light_002', 'light_003', // scene lights
    'object_', // Generic Blender export names for props
  ];
  
  if (EXCLUDE_KEYWORDS.some(kw => lowerName.includes(kw))) {
    return false;
  }
  
  // Whitelist: ONLY include if matches car system keywords
  for (const keywords of Object.values(SYSTEM_KEYWORDS)) {
    if (keywords.some(kw => lowerName.includes(kw))) {
      return true;
    }
  }
  
  // Whitelist: Known car root names
  const CAR_ROOT_KEYWORDS = ['model3', 'tesla', 'car', 'vehicle'];
  if (CAR_ROOT_KEYWORDS.some(kw => lowerName.includes(kw))) {
    return true;
  }
  
  // Default: EXCLUDE everything else (props, unnamed objects, scene nodes)
  return false;
}

function detectSystem(name: string): string {
  const lowerName = name.toLowerCase();
  for (const [system, keywords] of Object.entries(SYSTEM_KEYWORDS)) {
    if (keywords.some(kw => lowerName.includes(kw))) {
      return system;
    }
  }
  return 'body';
}

export default function CarModel({ explode, selectedPart, isolated, onSelectPart }: CarModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const piecesRef = useRef<any[]>([]);
  
  // Load Model 3 GLB
  const { scene } = useGLTF('/models/model3.glb');
  
  // Extract and organize all meshes/groups into explodable pieces
  const pieces = useMemo(() => {
    const extracted: any[] = [];
    const excluded: string[] = [];
    
    scene.traverse((node: any) => {
      // Filter out non-car meshes (props, scene objects)
      if (!shouldIncludeMesh(node.name || '')) {
        if (node.name) excluded.push(node.name);
        return;
      }
      
      // Split by individual meshes or groups with meshes
      if (node.isMesh || (node.isGroup && node.children.some((c: any) => c.isMesh))) {
        const bounds = new THREE.Box3().setFromObject(node);
        if (bounds.isEmpty()) return; // Skip empty bounds
        
        const center = bounds.getCenter(new THREE.Vector3());
        const system = detectSystem(node.name || 'unknown');
        
        // Clone the node to avoid modifying the original
        const clone = node.clone();
        clone.userData.originalPosition = clone.position.clone();
        clone.userData.originalParent = node.parent;
        clone.userData.system = system;
        clone.userData.id = `${system}-${extracted.length}`;
        clone.userData.bounds = bounds;
        clone.userData.center = center;
        
        // Enhance materials
        clone.traverse((child: any) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.userData.system = system;
            child.userData.pieceId = clone.userData.id;
            
            if (child.material) {
              const mat = child.material.clone();
              mat.metalness = Math.min(mat.metalness + 0.2, 0.8);
              mat.roughness = Math.max(mat.roughness - 0.1, 0.3);
              mat.envMapIntensity = 1.5;
              child.material = mat;
            }
          }
        });
        
        extracted.push({
          object: clone,
          system,
          id: clone.userData.id,
          originalPosition: clone.position.clone(),
          bounds,
          center,
        });
      }
    });
    
    console.log(`Extracted ${extracted.length} explodable pieces from Model 3`);
    console.log(`Excluded ${excluded.length} non-car meshes:`, excluded.slice(0, 10));
    return extracted;
  }, [scene]);
  
  // Calculate explosion layout
  const layout = useMemo(() => {
    if (!pieces.length) return [];
    return calculateExplosionLayout(pieces);
  }, [pieces]);
  
  // Store pieces ref
  useEffect(() => {
    piecesRef.current = pieces;
  }, [pieces]);
  
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
        offset.clone().multiplyScalar(smoothAmount * 4)
      );
      
      piece.object.position.lerp(targetPos, 0.15);
      piece._lastAmount = smoothAmount;
      
      // Visibility based on selection/isolation
      if (isolated && selectedPart) {
        piece.object.visible = piece.system === selectedPart;
      } else {
        piece.object.visible = true;
      }
      
      // Highlight selected
      piece.object.traverse((node: any) => {
        if (node.isMesh && node.material) {
          if (piece.system === selectedPart) {
            node.material.emissive = new THREE.Color(0x3b82f6);
            node.material.emissiveIntensity = 0.4;
          } else if (selectedPart && piece.system !== selectedPart) {
            node.material.emissive = new THREE.Color(0x000000);
            node.material.emissiveIntensity = 0;
            node.material.opacity = 0.3;
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
    const system = event.object.userData.system;
    if (system) {
      onSelectPart(system === selectedPart ? null : system);
    }
  };
  
  if (!pieces.length) {
    return (
      <Html center>
        <div style={{ 
          background: 'rgba(0,0,0,0.9)', 
          padding: '20px', 
          borderRadius: '8px', 
          color: 'white',
          fontFamily: 'system-ui'
        }}>
          Loading Tesla Model 3...
        </div>
      </Html>
    );
  }
  
  return (
    <group ref={groupRef} onClick={handleClick}>
      {pieces.map((piece, i) => (
        <primitive key={i} object={piece.object} />
      ))}
    </group>
  );
}

// Preload Model 3
useGLTF.preload('/models/model3.glb');
