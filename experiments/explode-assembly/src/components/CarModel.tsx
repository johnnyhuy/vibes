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
// Includes French Sketchfab names: capot (hood), cal (caliper), phare (headlight), etc.
const SYSTEM_KEYWORDS: Record<string, string[]> = {
  body: ['body', 'chassis', 'frame', 'structure', 'hood', 'trunk', 'fender', 'bumper', 'panel', 'capot', 'paint'],
  glass: ['glass', 'window', 'windshield', 'roof', 'vitre'],
  doors: ['door', 'handle', 'porte'],
  interior: ['seat', 'dashboard', 'console', 'interior', 'steering', 'int', 'cabin'],
  battery: ['battery', 'pack', 'cell', 'batterie'],
  motors: ['motor', 'drive', 'powertrain', 'moteur'],
  thermal: ['radiator', 'cooler', 'hvac', 'condenser'],
  suspension: ['suspension', 'spring', 'shock', 'strut', 'arm'],
  wheels: ['wheel', 'tire', 'brake', 'rotor', 'caliper', 'cal', 'roue'],
  charging: ['charger', 'port', 'cable', 'connector'],
  electronics: ['computer', 'ecu', 'battery_12v', 'wiring', 'plastic'],
  lights: ['light', 'lamp', 'headlight', 'taillight', 'fog', 'phare', 'led'],
};

// Include-by-default after GLB strip: trust that cleaned GLB only contains car parts
// Only exclude known props (in case strip didn't run) and container nodes
function shouldIncludeMesh(name: string): boolean {
  if (!name || name.length === 0) {
    return false; // Skip unnamed meshes
  }
  
  const lowerName = name.toLowerCase();
  
  // Exclude container/root nodes that shouldn't be explodable pieces
  // These are organizational groups, not renderable parts
  const CONTAINER_NODES = [
    'rootnode',
    'tesla model 3.fbx',
    'sketchfab_model',
    'sketchfab_scene',
    'scene',
    'root',
  ];
  
  if (CONTAINER_NODES.some(container => lowerName === container)) {
    return false;
  }
  
  // Exclude known props (safety net in case GLB strip didn't run)
  const PROP_KEYWORDS = [
    'cylinder012',      // traffic light stand
    'debris_tires',     // piled wheels
    'debris_tire',
    'walldeskse',       // studio speakers
    'speaker',
    'traffic',
    'light_pole',
  ];
  
  if (PROP_KEYWORDS.some(kw => lowerName.includes(kw))) {
    return false;
  }
  
  // After GLB strip + container/prop exclusions: include everything else
  // This catches French names (Capot*, cal*, int) and generic Object_* car parts
  return true;
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
      // Only process actual Mesh nodes (not Groups or Object3D containers)
      // Groups can cause clone/reparent issues
      if (!node.isMesh) {
        return;
      }
      
      // Filter out non-car meshes (props, scene objects)
      if (!shouldIncludeMesh(node.name || '')) {
        if (node.name) excluded.push(node.name);
        return;
      }
      
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
      
      // Enhance materials (with error handling)
      try {
        clone.traverse((child: any) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.userData.system = system;
            child.userData.pieceId = clone.userData.id;
            
            if (child.material) {
              // Handle both single material and material arrays (multi-material meshes)
              if (Array.isArray(child.material)) {
                child.material = child.material.map((mat: any) => {
                  const cloned = mat.clone();
                  cloned.metalness = Math.min(cloned.metalness + 0.2, 0.8);
                  cloned.roughness = Math.max(cloned.roughness - 0.1, 0.3);
                  cloned.envMapIntensity = 1.5;
                  return cloned;
                });
              } else {
                const mat = child.material.clone();
                mat.metalness = Math.min(mat.metalness + 0.2, 0.8);
                mat.roughness = Math.max(mat.roughness - 0.1, 0.3);
                mat.envMapIntensity = 1.5;
                child.material = mat;
              }
            }
          }
        });
      } catch (err) {
        console.error(`Failed to enhance materials for ${node.name}:`, err);
        // Continue without material enhancement if it fails
      }
      
      extracted.push({
        object: clone,
        system,
        id: clone.userData.id,
        originalPosition: clone.position.clone(),
        bounds,
        center,
      });
    });  // end of scene.traverse
    
    console.log('=== MODEL 3 EXTRACTION SUMMARY ===');
    console.log(`Extracted: ${extracted.length} pieces`);
    console.log(`Excluded: ${excluded.length} meshes`);
    if (extracted.length > 0) {
      console.log('Sample extracted:', extracted.slice(0, 5).map(p => p.id));
    }
    if (excluded.length > 0) {
      console.log('Sample excluded:', excluded.slice(0, 10));
    }
    
    if (extracted.length === 0) {
      console.error('⚠️ WARNING: Zero pieces extracted! This will cause blank canvas.');
      console.error('Check that model3.glb contains meshes and filter logic is correct.');
    }
    
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
        offset.clone().multiplyScalar(smoothAmount * 2.5)
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
            node.material.opacity = 1;
            node.material.transparent = false;
          } else if (selectedPart && piece.system !== selectedPart && explosionAmount > 0.05) {
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
          background: 'rgba(40,0,0,0.95)', 
          padding: '30px', 
          borderRadius: '8px', 
          color: '#ffaaaa',
          fontFamily: 'monospace',
          fontSize: '14px',
          maxWidth: '500px',
          border: '2px solid #ff4444',
        }}>
          <div style={{ fontSize: '20px', marginBottom: '15px', color: '#ff6666' }}>
            ⚠️ Zero Pieces Extracted
          </div>
          <div style={{ marginBottom: '10px' }}>
            The filter excluded all meshes from model3.glb.
          </div>
          <div style={{ fontSize: '12px', color: '#aaa' }}>
            Check browser console for extraction details.
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '15px',
              padding: '10px 20px',
              background: '#ff4444',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontFamily: 'monospace',
            }}
          >
            Reload
          </button>
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
