# Explode Assembly: attach() vs clone() Pattern

**Date**: 2026-09-07  
**Context**: Fixing fragmented hollow shell issue in vibes explode-assembly

---

## Problem

Initial implementation cloned individual meshes into orphaned `<primitive>` objects, which broke Three.js hierarchy and transform chains:

```typescript
// ❌ BROKEN APPROACH (v1-v4)
scene.traverse((node) => {
  if (node.isMesh) {
    const clone = node.clone();
    clone.position.copy(worldPosition);  // Even with world transforms...
    
    extracted.push({
      object: clone,  // Orphaned from hierarchy
      originalPosition: worldPosition,
    });
  }
});

return (
  <group>
    {pieces.map(piece => (
      <primitive object={piece.object} />  // Disconnected clones
    ))}
  </group>
);
```

**Result at explode=0%:**
- Fragmented hollow white shell
- Meshes positioned incorrectly
- Lost parent transforms despite `getWorldPosition()` attempts
- Production showed wheels floating inside skeleton

## Root Cause

1. **Cloning individual meshes** loses their relationship to the scene graph
2. **World position capture** doesn't preserve parent rotations/scales correctly
3. **Orphaned primitives** fight Three.js matrix updates
4. Each mesh has **local transforms relative to parents** — when detached, the full transform chain is lost

Example hierarchy:
```
Tesla Model 3.fbx (rotate Y: 90°, scale: 1.5)
  └─ Body_Group (position: [0, 1, 0])
       └─ Hood_Mesh (position: [2, 0, 0])
```

**Cloned Hood_Mesh** ends up at wrong position because parent rotation/scale not applied correctly.

## Solution: attach() Pattern

Learned from **[ashemag/model-x-studio](https://github.com/ashemag/model-x-studio/blob/main/app/vehicle-scene.tsx)** (CC0 / MIT pattern, clean-room implementation):

```typescript
// ✅ CORRECT APPROACH (v5 - ashemag pattern)
const { explodeRoot, pieces } = useMemo(() => {
  // 1. Clone entire scene once
  const model = scene.clone(true);
  model.updateMatrixWorld(true);  // Ensure all world matrices current
  
  // 2. Remove props from cloned graph
  model.traverse(node => {
    if (isProp(node.name)) {
      node.parent?.remove(node);
    }
  });
  
  // 3. Create explosion root
  const explodeRoot = new THREE.Group();
  
  // 4. Collect meshes and attach (CRITICAL)
  const meshes: THREE.Mesh[] = [];
  model.traverse(obj => {
    if (obj.isMesh) meshes.push(obj);
  });
  
  const pieces = [];
  for (const mesh of meshes) {
    // CRITICAL: attach() preserves world matrix while reparenting
    explodeRoot.attach(mesh);
    
    // Now mesh.position is local to explodeRoot, with world transform preserved
    const home = mesh.position.clone();
    
    pieces.push({
      node: mesh,           // Live reference, not clone
      home,                 // Position after attach
      bounds: new THREE.Box3().setFromObject(mesh),
      center: bounds.getCenter(new THREE.Vector3()),
    });
  }
  
  return { explodeRoot, pieces };
}, [scene]);

// 5. Animation: mutate live nodes (don't create new clones)
useFrame(() => {
  const amount = explode / 100;
  
  pieces.forEach((piece, i) => {
    const offset = layout[i] || new THREE.Vector3();
    
    // Mutate the live node's position (ashemag pattern)
    piece.node.position.copy(piece.home).addScaledVector(offset, amount * multiplier);
  });
});

// 6. Render: single primitive for explodeRoot (contains all meshes)
return <primitive object={explodeRoot} />;
```

## Why attach() Works

### Three.js `Object3D.attach(object)` Method

From Three.js docs:
> Adds object as a child of this, while **maintaining the object's world transform**.

**attach() internally:**
1. Gets object's world position/quaternion/scale
2. Removes object from current parent
3. Adds object as child to new parent
4. Updates object's local transform so world transform stays the same

**Result:** Reparenting without visual change. The car stays assembled.

### vs. clone() + worldPosition

**clone()** creates a disconnected copy. Even if you capture `getWorldPosition()`:
- Parent rotations/scales may not apply correctly to the clone
- Clone is orphaned — no longer part of scene graph
- Matrix updates don't propagate correctly
- Multiple nested transforms (grandparents, great-grandparents) get lost

## Comparison Table

| Aspect | clone() + worldPosition (BROKEN) | attach() (CORRECT) |
|--------|----------------------------------|-------------------|
| **Hierarchy** | Breaks parent-child relationships | Preserves live scene graph |
| **Transforms** | Captures snapshot, loses updates | Live matrix chain maintained |
| **At explode=0** | Fragmented shell | Assembled car |
| **Animation** | Mutate cloned primitives | Mutate live nodes |
| **Memory** | Duplicate geometry/materials | Single scene graph |
| **Ashemag pattern** | ❌ Not used | ✅ Used correctly |

## ashemag/model-x-studio Pattern

Their `vehicle-scene.tsx` approach (open-source reference):

```typescript
// 1. Load GLB
const { scene: model } = useGLTF('/model.glb');
model.updateMatrixWorld(true);

// 2. Group by component (they use userData.component from GLB)
const groups: Record<string, THREE.Group> = {};
for (const partId of partIds) {
  groups[partId] = new THREE.Group();
}

// 3. Attach nodes to component groups
model.traverse(node => {
  const partId = node.userData.component;
  if (partId && groups[partId]) {
    groups[partId].attach(node);  // CRITICAL LINE
  }
});

// 4. Store home positions AFTER attach
const homes: Record<string, THREE.Vector3> = {};
Object.entries(groups).forEach(([partId, group]) => {
  group.children.forEach(node => {
    homes[node.uuid] = node.position.clone();
  });
});

// 5. Explode: mutate live positions
useFrame(() => {
  Object.entries(groups).forEach(([partId, group]) => {
    group.children.forEach(node => {
      const spread = getSpreadVector(partId);
      node.position.copy(homes[node.uuid]).addScaledVector(spread, explosionAmount);
    });
  });
});
```

**We adapted this for our GLB** (no userData.component):
- Treat each `Mesh` as a piece
- `detectSystem(mesh.name)` categorizes instead of userData
- Same `attach()` → `home = position.clone()` → `position.copy(home).addScaledVector()` pattern

## Benefits

1. **Assembled at explode=0**: attach() maintains world transforms
2. **Simpler code**: No world position math, fewer bugs
3. **Better performance**: Single scene graph, no duplicate clones
4. **Correct visuals**: Car looks like a car, not a hollow shell
5. **ashemag-proven**: Pattern used in their viral 334-piece Model X demo

## Lessons

1. **Never clone individual meshes from a hierarchy** — use attach() to reparent while preserving transforms
2. **Trust Three.js matrix system** — attach() handles the math correctly
3. **Store "home" position AFTER attach()** — that's the assembled position in the new parent
4. **Mutate live nodes** during animation — don't create new clones each frame
5. **Clean-room implementation** — understand the pattern, don't copy their assets/code verbatim

## References

- **ashemag/model-x-studio**: https://github.com/ashemag/model-x-studio/blob/main/app/vehicle-scene.tsx
- **Three.js Object3D.attach()**: https://threejs.org/docs/#api/en/core/Object3D.attach
- **ashemag X posts**: https://x.com/ashebytes/status/1831768826242351397 (viral Model X explode)

---

**Result**: PR #6 v5 uses attach() pattern → assembled car at explode=0%, no hollow shell.
