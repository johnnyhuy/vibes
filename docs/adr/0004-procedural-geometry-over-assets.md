# ADR-0004: Procedural Geometry Over Asset Loading for Mechanical Demos

**Status**: Accepted  
**Date**: 2026-09-07  
**Context**: Building mechanical visualizations (locomotives, gear trains, assemblies) that are educational and parametric

## Decision

For mechanical educational demos like `procedural-steam-atlas`, I'm using **procedural runtime geometry** (Three.js primitives + code) instead of loading .glb/.obj assets.

## What Changed

### Before (Asset-Based Workflow)
```javascript
// Load pre-made model
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
const loader = new GLTFLoader();
const { scene } = await loader.loadAsync('/models/locomotive.glb');
```

**Result**: Professional detail, but geometry is opaque. Users can't see how it's constructed.

### After (Procedural Geometry)
```javascript
// Generate at runtime
function createLocomotive() {
  const boiler = new THREE.Mesh(
    new THREE.CylinderGeometry(0.8, 0.8, 8, 32),
    new THREE.MeshStandardMaterial({ color: 0x2a2a2a, metalness: 0.9 })
  );
  
  const wheel = createWheel(0.6, 0.15);
  wheel.position.set(2.5, -1.3, -0.8);
  
  // ... more parts
  
  const group = new THREE.Group();
  group.add(boiler, wheel);
  return group;
}
```

**Result**: Transparent construction. Users can inspect code to see exactly how each part is made.

## Why Procedural Geometry?

### 1. **Educational Transparency**
The primary goal of `procedural-steam-atlas` is **learning how to build mechanical objects from code**.

With a .glb:
- Geometry is binary mesh data
- You can't see how wheels/boilers/rivets are constructed
- Modifications require re-exporting from Blender

With procedural geometry:
- Every part is a readable function
- You can inspect parameters (radius, length, segment count)
- Modifications are code edits

**Example**:
```javascript
// Clear: "This wheel is a 0.6-radius cylinder with 8 spokes"
function createWheel(radius, width) {
  const rim = new THREE.CylinderGeometry(radius, radius, width, 32);
  // ...
  for (let i = 0; i < 8; i++) {
    const spoke = createSpoke(radius);
    // ...
  }
}
```

vs. opaque: `locomotive.glb` → binary mesh → no insight into construction.

### 2. **Parametric Flexibility**
Procedural functions accept parameters:
```javascript
createLocomotive({ wheelRadius: 0.6, boilerLength: 8 });
createLocomotive({ wheelRadius: 0.8, boilerLength: 10 }); // Larger version
```

You can expose sliders to **tune geometry at runtime** without re-exporting assets.

With a .glb, changing wheel radius requires:
1. Open Blender
2. Edit mesh
3. Re-export
4. Reload in app

With procedural geometry:
1. Change one number in code → done

### 3. **No Asset Pipeline**
Building `procedural-steam-atlas` required:
- Zero Blender time
- Zero texture baking
- Zero GLTF validation
- Zero file size optimization

Just TypeScript + Three.js.

This is ideal for:
- **Code-first developers** — No 3D modeling skills required
- **Rapid prototyping** — No Blender bottleneck
- **Educational content** — Code is the deliverable, not assets

### 4. **Tiny Bundle Size**
`procedural-steam-atlas` production build:
- **~500 KB total** (including Three.js)
- **Zero asset loading** (no network requests for models)
- **Instant startup** (no GLTF parsing)

A comparable .glb with 20+ parts might be:
- **5-10 MB** (mesh data + materials)
- **Network request overhead** (loading time)
- **Parse cost** (GLTF → Three.js scene graph)

For demos where the **code is the lesson**, procedural geometry is lighter and faster.

### 5. **Instancing Efficiency**
Repeated elements (rivets, spokes, bolts) are generated in loops:
```javascript
// 12 rivets along boiler seam
const rivetGeometry = new THREE.SphereGeometry(0.08);
const rivetMaterial = MATERIAL_BRASS;

for (let i = 0; i < 12; i++) {
  const rivet = new THREE.Mesh(rivetGeometry, rivetMaterial);
  rivet.position.set(-2 + i * 0.8, boilerRadius * 0.7, 0);
  group.add(rivet);
}
```

Geometry/material are **reused** across all 12 instances → memory efficient.

With a .glb, each rivet is a separate mesh → more memory overhead.

## The Trade-offs

### Advantages
- **Educational clarity** — Code shows construction, not binary mesh
- **Parametric flexibility** — Runtime configuration via function arguments
- **No asset pipeline** — Zero Blender dependency
- **Tiny bundle** — Code < mesh data
- **Instancing efficiency** — Reuse geometry/materials

### Disadvantages
- **Less detail** — Hard to match artist-sculpted organic shapes with primitives
- **Manual work** — Each part needs a custom function; no drag-and-drop GUI
- **Upfront cost** — Geometry generation happens at runtime (mitigated by caching groups)
- **Non-artist-friendly** — Requires coding; no visual modeling tools

## When To Use Procedural Geometry

### ✅ **Use Procedural Geometry When:**
- **Goal is education** — Code transparency matters more than visual fidelity
- **Object is mechanical** — Gears, pistons, chassis (primitives map naturally)
- **Parametric design needed** — Runtime configurability (sliders, API params)
- **Bundle size matters** — Mobile, embedded, hackathon demos
- **No 3D artists available** — Code-first team

### ❌ **Use GLB/OBJ Assets When:**
- **High visual fidelity required** — Product marketing, cinematics
- **Organic shapes** — Characters, terrain, vehicles (sculpting is faster)
- **Artist-modeled detail** — Curves, ornaments, asymmetry that's hard to code
- **Non-technical users** — Need GUI modeling tools (Blender, Maya)
- **Performance-critical** — Loading a cached .glb is faster than generating 200 meshes

## Examples in This Repo

| Experiment | Approach | Why |
|------------|----------|-----|
| **procedural-steam-atlas** | Procedural geometry | Educational demo, mechanical object, parametric |
| **explode-assembly** | GLB loading | Need real Tesla Model 3 detail (334 pieces) |
| **earth-timeline** | Procedural sphere + textures | Parametric planet, but uses canvas textures |
| **v8-cutaway** | Procedural geometry | Mechanical engine, parametric configuration |
| **japanese-tower** | Procedural geometry | Architectural keep; season/weather retints materials (ADR-0007) |
| **chinese-courtyard** | Procedural geometry | Four-sided siheyuan; season/sun retints materials (ADR-0009). No Blender GLB this pass. |
| **ballance-roll** | Procedural geometry | Sky-path + marble; contact materials, no course GLB (ADR-0008) |
| **procedural-grass-field** | Instanced shader blades | Meadow density; no turf GLB (ADR-0011) |
| **amber-longeron** | Licensed GLB + procedural orbs | Sopwith Camel CC-BY; linen / orbs still code (ADR-0012 amendment) |
| **nacre-loom** | Procedural geometry | Lobed icosahedron + film weaves; no orb GLB (ADR-0013) |
| **heartwood-warden** | Procedural guardian + CC0 forest kitbash | Kenney trees; no character GLB (ADR-0014 amendment) |
| **chinese-courtyard** | Procedural geometry | Siheyuan halls + moon gate; no courtyard GLB (ADR-0009) |
| **audio-gadget-spin** | Licensed GLB + finish tints | Spacebar Headphones CC-BY; mute-default audio (ADR-0010 amendment) |

## Pattern: Procedural Geometry Functions

**Core pattern** (from Steam Atlas reverse-engineering):

1. **Primitives as building blocks**
   - Cylinders → boilers, pipes, axles
   - Spheres → rivets, knobs, joints
   - Boxes → frames, panels
   - Toruses → flanges, gaskets

2. **Functions return groups**
   ```javascript
   function createWheel(radius, width) {
     const group = new THREE.Group();
     group.add(rim, hub, ...spokes);
     return group;
   }
   ```

3. **Instancing in loops**
   ```javascript
   for (let i = 0; i < spokeCount; i++) {
     const spoke = createSpoke();
     spoke.rotation.z = (i / spokeCount) * Math.PI * 2;
     group.add(spoke);
   }
   ```

4. **Material palette**
   - Define once, reuse across all meshes
   - Steel, brass, paint → visual coherence

5. **Metadata for interaction**
   ```javascript
   part.userData.originalPosition = part.position.clone();
   part.userData.explosionVector = new THREE.Vector3(x, y, z);
   ```

## Hybrid Approach (Future)

For some demos, I might combine both:
- **Procedural base** — Parametric mechanical structure
- **GLB details** — Artist-modeled ornaments, decals

Example: Procedural locomotive chassis + GLB brass nameplates.

This gets parametric flexibility + artist polish.

## Comparison with explode-assembly (ADR-0002)

**explode-assembly** uses GLB because:
- Goal is **visual fidelity** (realistic Tesla Model 3)
- Needs **334 pre-separated meshes** (complex explosion algorithm)
- Prioritizes **product marketing aesthetic** over code transparency

**procedural-steam-atlas** uses procedural geometry because:
- Goal is **educational transparency** (show construction in code)
- Mechanical object with **~20 simple parts** (hand-tuned explosion)
- Prioritizes **parametric flexibility** over visual perfection

Both approaches are valid; **context determines choice**.

## Implementation Example

See `experiments/procedural-steam-atlas/src/` for full code:
- `geometry/locomotive.js` — Procedural functions for all parts
- `utils/explosion.js` — Hand-tuned explosion vectors
- `main.js` — Scene setup + lighting

## References

- [@Karthikvarmamkv's Steam Atlas](https://x.com/Karthikvarmamkv/status/2096904712511488420) — Inspiration for procedural mechanical geometry
- [@Craft3dApp demo](https://x.com/Craft3dApp/status/2096892270851346904) — Articulated parts pattern
- [Three.js Geometry docs](https://threejs.org/docs/#api/en/geometries/BoxGeometry) — Primitives reference
- `docs/reverse-engineering/procedural-runtime-geometry.md` — Clean-room pattern analysis

## Future Considerations

- Add **parametric controls** — Sliders to adjust wheel size, boiler length at runtime
- Extract **geometry utilities** into `packages/geometry-primitives` if reused across experiments
- Explore **CSG operations** (boolean subtract) for cutaway views
- Document **performance implications** of runtime generation vs. asset loading

---

**Author**: Johnny Huynh  
**Last Updated**: 2026-09-07
