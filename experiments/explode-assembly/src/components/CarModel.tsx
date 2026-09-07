import { useRef, useMemo } from 'react';
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

// System mapping with French Sketchfab names
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

function detectSystem(name: string | undefined): string {
  if (!name || typeof name !== 'string') return 'body';
  const lowerName = name.toLowerCase();
  for (const [system, keywords] of Object.entries(SYSTEM_KEYWORDS)) {
    if (keywords.some(kw => lowerName.includes(kw))) {
      return system;
    }
  }
  return 'body';
}

// Check if mesh is a known prop (not car part)
function isProp(name: string | undefined): boolean {
  if (!name || typeof name !== 'string') return false;
  const lower = name.toLowerCase();
  
  const PROP_KEYWORDS = [
    'cylinder012', 'debris_tires', 'debris_tire',
    'walldeskse', 'speaker', 'traffic', 'light_pole',
    'plane', 'floor', 'wall', 'room', 'ground',
    'background', 'environment', 'scene',
  ];
  
  return PROP_KEYWORDS.some(kw => lower.includes(kw));
}

// Check if node is a container (not renderable)
function isContainer(name: string | undefined): boolean {
  if (!name || typeof name !== 'string') return false;
  const lower = name.toLowerCase();
  
  const CONTAINERS = [
    'rootnode', 'tesla model 3.fbx', 'sketchfab_model',
    'sketchfab_scene', 'scene', 'root',
  ];
  
  return CONTAINERS.some(c => lower === c);
}

interface Piece {
  node: THREE.Mesh;
  home: THREE.Vector3;
  bounds: THREE.Box3;
  center: THREE.Vector3;
  system: string;
  id: string;
}

export default function CarModel({ explode, selectedPart, isolated, onSelectPart }: CarModelProps) {
  const explodeRootRef = useRef<THREE.Group>(null);
  
  // Load Model 3 GLB
  const { scene } = useGLTF('/models/model3.glb');
  
  // Setup explosion structure using attach() pattern (ashemag approach)
  const { explodeRoot, pieces } = useMemo(() => {
    console.log('=== SETTING UP EXPLODE STRUCTURE (ATTACH PATTERN) ===');
    
    try {
      // Guard: ensure scene is loaded
      if (!scene) {
        console.error('Scene not loaded yet');
        return {
          explodeRoot: new THREE.Group(),
          pieces: [],
        };
      }
      
      // Clone the entire scene once
      const model = scene.clone(true);
      model.updateMatrixWorld(true);
      
      // Create explode root group
      const explodeRoot = new THREE.Group();
      explodeRoot.name = 'ExplodeRoot';
      
      // PASS 1: Collect nodes to remove (don't mutate during traverse)
      const nodesToRemove: THREE.Object3D[] = [];
      model.traverse((node: any) => {
        if (!node) return;
        // Guard: ensure node has name property before accessing
        if (typeof node.name === 'undefined') return;
        const name = node.name || '';
        if (isProp(name) || isContainer(name)) {
          nodesToRemove.push(node);
        }
      });
      
      // PASS 2: Remove collected prop nodes
      for (const node of nodesToRemove) {
        if (node && node.parent) {
          node.parent.remove(node);
        }
      }
      
      console.log(`Removed ${nodesToRemove.length} prop nodes`);
      
      // PASS 3: Collect all mesh nodes (after removal)
      const meshes: THREE.Mesh[] = [];
      model.traverse((obj: any) => {
        if (!obj) return;
        // Guard: check both isMesh and name existence
        if (obj.isMesh && typeof obj.name !== 'undefined') {
          meshes.push(obj as THREE.Mesh);
        }
      });
      
      console.log(`Found ${meshes.length} meshes for explosion`);
      
      // PASS 4: Attach meshes to explode root (preserves world transform)
      const pieces: Piece[] = [];
      for (const mesh of meshes) {
        // Guard: ensure mesh and its required properties exist
        if (!mesh) continue;
        if (typeof mesh.name === 'undefined') continue;
        if (!mesh.position) continue;
        
        // Skip if somehow a prop survived
        const meshName = mesh.name || '';
        if (isProp(meshName)) continue;
        
        // CRITICAL: attach() preserves world matrix while reparenting
        explodeRoot.attach(mesh);
        
        // Now mesh.position is local to explodeRoot, with world transform preserved
        const home = mesh.position.clone();
        
        const bounds = new THREE.Box3().setFromObject(mesh);
        const center = bounds.getCenter(new THREE.Vector3());
        const system = detectSystem(meshName || 'unknown');
        
        // Force materials opaque and enhance
        try {
          mesh.traverse((child: any) => {
            if (!child) return;
            if (child.isMesh && child.material) {
              if (Array.isArray(child.material)) {
                child.material = child.material.map((mat: any) => {
                  const m = mat.clone();
                  m.transparent = false;
                  m.opacity = 1;
                  m.metalness = Math.min(m.metalness + 0.2, 0.8);
                  m.roughness = Math.max(m.roughness - 0.1, 0.3);
                  m.envMapIntensity = 1.5;
                  return m;
                });
              } else {
                const mat = child.material.clone();
                mat.transparent = false;
                mat.opacity = 1;
                mat.metalness = Math.min(mat.metalness + 0.2, 0.8);
                mat.roughness = Math.max(mat.roughness - 0.1, 0.3);
                mat.envMapIntensity = 1.5;
                child.material = mat;
              }
            }
            
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
        } catch (err) {
          console.error(`Material processing error for ${meshName}:`, err);
        }
        
        pieces.push({
          node: mesh,
          home,
          bounds,
          center,
          system,
          id: `${system}-${pieces.length}`,
        });
      }
      
      console.log(`Extracted ${pieces.length} pieces for explosion`);
      console.log('Sample pieces:', pieces.slice(0, 5).map(p => ({
        name: p.node.name,
        system: p.system,
        home: p.home.toArray().map(v => v.toFixed(2)),
      })));
      
      if (pieces.length === 0) {
        console.error('⚠️ WARNING: Zero pieces extracted!');
      }
      
      return { explodeRoot, pieces };
    } catch (err) {
      console.error('SETUP ERROR:', err);
      return {
        explodeRoot: new THREE.Group(),
        pieces: [],
      };
    }
  }, [scene]);
  
  // Calculate explosion layout
  const layout = useMemo(() => {
    if (!pieces.length) return [];
    return calculateExplosionLayout(pieces);
  }, [pieces]);
  
  // Animate explosion (mutate live nodes, don't clone)
  useFrame(() => {
    if (!explodeRootRef.current || !pieces.length) return;
    
    const explosionAmount = explode / 100;
    
    pieces.forEach((piece, i) => {
      const offset = layout[i] || new THREE.Vector3();
      
      // Mutate the live node's position (ashemag pattern)
      // position = home + (offset * explosionAmount * multiplier)
      piece.node.position.copy(piece.home).addScaledVector(offset, explosionAmount * 2.5);
      
      // Visibility based on selection/isolation
      if (isolated && selectedPart) {
        piece.node.visible = piece.system === selectedPart;
      } else {
        piece.node.visible = true;
      }
      
      // Highlight selected (only when exploding to avoid ghost at 0%)
      piece.node.traverse((child: any) => {
        if (child.isMesh && child.material) {
          const isSelected = piece.system === selectedPart;
          const isOther = selectedPart && piece.system !== selectedPart;
          
          if (Array.isArray(child.material)) {
            child.material.forEach((mat: any) => {
              if (isSelected) {
                mat.emissive = new THREE.Color(0x3b82f6);
                mat.emissiveIntensity = 0.4;
              } else if (isOther && explosionAmount > 0.05) {
                mat.emissive = new THREE.Color(0x000000);
                mat.emissiveIntensity = 0;
                mat.opacity = 0.3;
                mat.transparent = true;
              } else {
                mat.emissive = new THREE.Color(0x000000);
                mat.emissiveIntensity = 0;
                mat.opacity = 1;
                mat.transparent = false;
              }
            });
          } else {
            if (isSelected) {
              child.material.emissive = new THREE.Color(0x3b82f6);
              child.material.emissiveIntensity = 0.4;
            } else if (isOther && explosionAmount > 0.05) {
              child.material.emissive = new THREE.Color(0x000000);
              child.material.emissiveIntensity = 0;
              child.material.opacity = 0.3;
              child.material.transparent = true;
            } else {
              child.material.emissive = new THREE.Color(0x000000);
              child.material.emissiveIntensity = 0;
              child.material.opacity = 1;
              child.material.transparent = false;
            }
          }
        }
      });
    });
  });
  
  // Handle clicks
  const handleClick = (event: any) => {
    event.stopPropagation();
    
    // Find which piece was clicked
    let clickedSystem: string | null = null;
    for (const piece of pieces) {
      if (event.object === piece.node || piece.node.children.includes(event.object)) {
        clickedSystem = piece.system;
        break;
      }
    }
    
    if (clickedSystem) {
      onSelectPart(clickedSystem === selectedPart ? null : clickedSystem);
    }
  };
  
  if (!pieces.length) {
    return (
      <group>
        <mesh position={[0, 2, 0]}>
          <boxGeometry args={[2, 0.5, 0.1]} />
          <meshBasicMaterial color="#ff4444" />
        </mesh>
      </group>
    );
  }
  
  return (
    <primitive
      ref={explodeRootRef}
      object={explodeRoot}
      onClick={handleClick}
    />
  );
}

// Preload Model 3
useGLTF.preload('/models/model3.glb');
