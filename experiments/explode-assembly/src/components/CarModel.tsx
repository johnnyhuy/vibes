import { useRef, useMemo, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  calculateExplosionLayout,
  EMPTY_LAYOUT,
  type ExplosionLayout,
} from '../utils/explosion';

interface CarModelProps {
  explode: number;
  selectedPart: string | null;
  isolated: boolean;
  onSelectPart: (part: string | null) => void;
  onLayoutReady?: (layout: ExplosionLayout) => void;
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

const ZERO = new THREE.Vector3();

function polishMaterial(source: THREE.Material): THREE.Material {
  const mat = source.clone() as THREE.MeshStandardMaterial;
  mat.transparent = false;
  mat.opacity = 1;
  // No HDRI sky — keep paint readable instead of chrome-hollow.
  if ('metalness' in mat) {
    mat.metalness = THREE.MathUtils.clamp((mat.metalness ?? 0.25), 0.08, 0.4);
  }
  if ('roughness' in mat) {
    mat.roughness = THREE.MathUtils.clamp((mat.roughness ?? 0.55), 0.35, 0.75);
  }
  if ('envMapIntensity' in mat) {
    mat.envMapIntensity = 0.15;
  }
  if ('emissive' in mat && 'emissiveIntensity' in mat) {
    const color = mat.color ? mat.color.clone() : new THREE.Color(0x888888);
    mat.emissive = color.multiplyScalar(0.12);
    mat.emissiveIntensity = 0.18;
  }
  return mat;
}

export default function CarModel({ explode, selectedPart, isolated, onSelectPart, onLayoutReady }: CarModelProps) {
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
      
      // Collect car meshes only (don't remove containers - they're structural parents!)
      // Skip prop meshes during collection instead of removing from graph
      const meshes: THREE.Mesh[] = [];
      model.traverse((obj: any) => {
        // Guard: ensure object exists and is a mesh
        if (!obj?.isMesh) return;
        
        const name = obj?.name ?? '';
        
        // Skip structural containers (not renderable, just parents)
        if (isContainer(name)) return;
        
        // Skip known prop meshes
        if (isProp(name)) return;

        // Skip huge flat studio floors that sneak in as unnamed planes
        const worldBox = new THREE.Box3().setFromObject(obj);
        const worldSize = worldBox.getSize(new THREE.Vector3());
        const worldCenter = worldBox.getCenter(new THREE.Vector3());
        if (
          (worldBox.max.y < 0.22 && worldSize.x > 2.4 && worldSize.z > 2.4) ||
          (worldCenter.y < 0.2 && worldSize.y < 0.55 && worldSize.x > 2.8 && worldSize.z > 2.8)
        ) {
          return;
        }
        if (obj.geometry) {
          obj.geometry.computeBoundingBox();
          const bb = obj.geometry.boundingBox;
          if (bb) {
            const size = bb.getSize(new THREE.Vector3());
            if (size.y < 0.12 && size.x * size.z > 40) return;
          }
        }
        
        meshes.push(obj as THREE.Mesh);
      });
      
      console.log(`Collected ${meshes.length} car meshes (skipped props & containers during traversal)`);
      
      // Attach car meshes to explode root (preserves world transform)
      const pieces: Piece[] = [];
      for (const mesh of meshes) {
        // Guard: ensure mesh and its required properties exist
        if (!mesh?.position) continue;
        
        const meshName = mesh?.name ?? '';
        
        // CRITICAL: attach() preserves world matrix while reparenting
        explodeRoot.attach(mesh);
        
        // Now mesh.position is local to explodeRoot, with world transform preserved
        const home = mesh.position.clone();
        
        const bounds = new THREE.Box3().setFromObject(mesh);
        const center = bounds.getCenter(new THREE.Vector3());
        const system = detectSystem(meshName);
        
        // Force materials opaque and enhance
        try {
          mesh.traverse((child: any) => {
            if (!child?.isMesh || !child?.material) return;
            
            if (Array.isArray(child.material)) {
              child.material = child.material.map((mat: any) => polishMaterial(mat));
            } else {
              child.material = polishMaterial(child.material);
            }
            
            child.castShadow = true;
            child.receiveShadow = true;
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

      explodeRoot.updateMatrixWorld(true);
      for (const piece of pieces) {
        piece.bounds = new THREE.Box3().setFromObject(piece.node);
        piece.center = piece.bounds.getCenter(new THREE.Vector3());
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
  
  const layout = useMemo(() => {
    if (!pieces.length) return EMPTY_LAYOUT;
    explodeRoot.updateMatrixWorld(true);
    return calculateExplosionLayout(pieces);
  }, [pieces, explodeRoot]);

  useEffect(() => {
    onLayoutReady?.(layout);
  }, [layout, onLayoutReady]);
  
  // Animate explosion (mutate live nodes, don't clone)
  useFrame(() => {
    if (!explodeRootRef.current || !pieces.length || !layout.pieces.size) return;
    
    const explosionAmount = explode / 100;
    // Full gallery slots by ~70% so 80% reads as an ordered wall of parts.
    const individual = THREE.MathUtils.smoothstep(explosionAmount, 0.08, 0.7);
    
    pieces.forEach((piece) => {
      const slot = layout.pieces.get(piece.id);
      const fullSpread = slot?.translation ?? ZERO;
      
      piece.node.position.copy(piece.home).addScaledVector(fullSpread, individual);
      
      // Visibility based on selection/isolation
      if (isolated && selectedPart) {
        piece.node.visible = piece.system === selectedPart;
      } else {
        piece.node.visible = true;
      }
      
      // Highlight selected (only when exploding to avoid ghost at 0%)
      piece.node.traverse((child: any) => {
        if (!child?.isMesh || !child?.material) return;
        
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
              mat.emissive = new THREE.Color(0x1c1c1c);
              mat.emissiveIntensity = 0.22;
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
            child.material.emissive = new THREE.Color(0x1c1c1c);
            child.material.emissiveIntensity = 0.22;
            child.material.opacity = 1;
            child.material.transparent = false;
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
