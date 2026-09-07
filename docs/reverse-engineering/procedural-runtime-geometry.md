# Reverse Engineering: Procedural Runtime Geometry Pattern

**Source References**:
- [@Karthikvarmamkv's Steam Atlas](https://x.com/Karthikvarmamkv/status/2096904712511488420) — Mechanical assembly from pure TypeScript/Three.js geometry
- [@Craft3dApp's structured parts](https://x.com/Craft3dApp/status/2096892270851346904) — Articulated parts, isolation (craft3d.app)

**Study Date**: 2026-09-07  
**Purpose**: Clean-room notes on procedural geometry patterns, not asset or code copying

**Disclaimer**: Steam Atlas and Craft3D are proprietary. I studied the **public-facing pattern** (runtime geometry generation) and built my own clean-room implementation with original code and no copied assets.

## What Is This Pattern?

**Procedural runtime geometry** means building 3D objects from code at runtime instead of loading pre-made .glb/.obj meshes.

Instead of:
```javascript
// Load asset
const { scene } = await loader.loadAsync('/models/locomotive.glb');
```

You write:
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
  
  return group;
}
```

## Why This Pattern Exists

### 1. **Educational Clarity**
When you see a locomotive, you can inspect the code to understand exactly how it was constructed:
- Boiler is a cylinder (radius 0.8, length 8)
- Wheels are cylinders + spokes
- Rivets are instanced spheres

With a .glb, the geometry is opaque (binary mesh data). With code, it's transparent.

### 2. **Parametric Flexibility**
You can expose parameters:
```javascript
createLocomotive({ wheelRadius: 0.6, boilerLength: 8, cabHeight: 2 });
```

Change one number → entire model scales proportionally. With a .glb, you'd need to re-export from Blender.

### 3. **Zero Asset Pipeline**
No Blender, no exports, no GLTF validation, no texture packing. Just TypeScript + Three.js.

Perfect for:
- Code-first developers who don't want to learn 3D modeling
- Educational demos where the code **is** the lesson
- Hackathon/rapid prototypes where asset creation is bottleneck

### 4. **Tiny Bundle Size**
A 334-piece .glb might be 5-10 MB. Procedural code for the same complexity might be 50 KB.

Trade-off: Runtime generation cost (mitigated by caching groups).

## Steam Atlas Pattern (Reverse-Engineered)

From studying the viral X post and visual reference:

### 1. **Mechanical Primitives**
Steam Atlas appears to use:
- **Cylinders** — Boilers, pipes, pistons, axles
- **Toruses** — Flanges, gaskets
- **Boxes** — Chassis frames, panels
- **Spheres** — Rivets, knobs, joints
- **Lathe geometries** — Wheels, pulleys (revolve a profile curve)

### 2. **Instancing Patterns**
Repeated elements (rivets, spokes, bolts) are generated in loops:
```javascript
// 12 rivets along boiler seam
for (let i = 0; i < 12; i++) {
  const x = -2 + i * 0.8;
  const rivet = new THREE.Mesh(
    new THREE.SphereGeometry(0.08),
    MATERIAL_BRASS
  );
  rivet.position.set(x, boilerRadius * 0.7, 0);
  group.add(rivet);
}
```

### 3. **Grouped Hierarchies**
Parts are organized into logical groups:
```
Locomotive
├─ Chassis
│  ├─ Boiler
│  ├─ Smokebox
│  ├─ Cab
│  └─ Frame
└─ Wheels
   ├─ Wheel_FL
   ├─ Wheel_FR
   └─ ... (6 total)
```

This enables:
- **Isolation** — Show only chassis or only wheels
- **Explosion** — Each group explodes in a different direction
- **Animation** — Rotate wheels independently

### 4. **Material Palette**
Steam Atlas uses a limited material set for visual coherence:
- **Steel** — Dark gray, metalness 0.95, roughness 0.15 (polished)
- **Brass** — Gold, metalness 0.8, roughness 0.2 (slightly worn)
- **Cast iron** — Darker gray, metalness 0.9, roughness 0.3 (matte)
- **Paint** — Red/black, metalness 0.3, roughness 0.7 (non-metallic)

All materials use `MeshStandardMaterial` with PBR (physically based rendering). No custom shaders needed.

### 5. **Cinematic Presentation**
The Steam Atlas visuals look professional because of:

**Lighting**:
- Dark background (#0a0a0a or pure black)
- Three-point lighting:
  - **Key light** — Directional, white, top-front (1.2 intensity)
  - **Fill light** — Directional, blue-tinted, side (0.4 intensity)
  - **Rim light** — Directional, warm, back (0.6 intensity)
- Shadows enabled (`castShadow`, `receiveShadow`)
- Tone mapping: `ACESFilmicToneMapping` (cinematic look)

**Camera**:
- Low FOV (35-45°) for less distortion
- Distant orbit (10-15 units away)
- Slight downward angle (looking at object from above-front)

**UI**:
- Minimal chrome (no toolbars, just controls)
- Dark glass panels with blur (`backdrop-filter: blur(10px)`)
- Monospace or technical fonts
- Subtle animations (no jarring transitions)

### 6. **Explosion Mechanics**
Unlike explode-assembly (which uses 2D grid packing), Steam Atlas appears to use **radial/directional explosion vectors**:

```javascript
// Each part stores its explosion direction
wheel.userData.explosionVector = new THREE.Vector3(
  pos.x * 0.3,  // Outward from center
  -2,           // Downward (wheels drop)
  pos.z * 1.5   // Sideways spread
);

// On slider change:
part.position.lerp(
  originalPosition,
  originalPosition.clone().add(explosionVector.multiplyScalar(explosionFactor)),
  0.1
);
```

**Hand-tuned per part** (not algorithmic). Works well for mechanical objects where you know the logical separation (wheels drop, cab slides back, boiler lifts).

## Craft3D Influence

[@Craft3dApp's demo](https://x.com/Craft3dApp/status/2096892270851346904) shows:

1. **Articulated parts** — Doors hinge open, gears rotate
2. **Part metadata** — Each piece has name, category, material info
3. **Isolation mode** — Click a system (e.g., "suspension") → everything else fades
4. **Annotations** — Labels pointing to specific parts

I replicated **isolation** (toggle chassis/wheels) but skipped articulation to keep scope educational.

## My Implementation (procedural-steam-atlas)

I built a clean-room version using only the **pattern**, not Steam Atlas or Craft3D code/assets:

### What I Replicated
- **Procedural geometry** — All parts from Three.js primitives
- **Part grouping** — Chassis vs. wheels
- **Explosion** — Hand-tuned vectors
- **Isolation** — Toggle visibility per group
- **Cinematic UI** — Dark studio, three-point lights, OrbitControls

### What I Didn't Copy
- **Steam Atlas geometry** — My locomotive design is original (different proportions, fewer parts)
- **Craft3D articulation** — No hinges or animated transforms
- **Proprietary code** — All functions written from scratch

### Stack
- **Vanilla Three.js** — No React (simpler for pure geometry)
- **Vite** — Dev server + build tool
- **~300 lines of code** — Proof of concept scale

See `experiments/procedural-steam-atlas/` for full source.

## When To Use This Pattern

### ✅ **Good For**
- **Mechanical objects** — Gears, pistons, chassis (primitives map naturally)
- **Educational demos** — Code transparency is the goal
- **Parametric design** — Need runtime configurability
- **Rapid prototyping** — No Blender bottleneck
- **Small bundle size** — Code < mesh data

### ❌ **Bad For**
- **Organic shapes** — Characters, terrain, vehicles (sculpting is faster)
- **High detail** — Artist-modeled meshes look better than 200 cylinders
- **Non-technical users** — Requires coding; no GUI modeling
- **Performance-critical** — Runtime generation has upfront cost

## Comparison: Procedural vs. GLB

| Aspect | Procedural Geometry | GLB/OBJ Assets |
|--------|---------------------|----------------|
| **Creation tool** | TypeScript + Three.js | Blender, Maya, etc. |
| **Bundle size** | Small (50 KB code) | Large (5-10 MB mesh) |
| **Detail level** | Moderate (primitives) | High (sculpted) |
| **Parametric** | Yes (runtime params) | No (fixed geometry) |
| **Educational** | Transparent (code) | Opaque (binary) |
| **Artist-friendly** | No (code only) | Yes (GUI modeling) |
| **Performance** | Upfront generation cost | Load + parse cost |

## Public Patterns (Not Proprietary)

These are **general techniques** visible across many Three.js projects:
- Three.js primitive geometries (`CylinderGeometry`, `SphereGeometry`, etc.)
- Group hierarchies (`THREE.Group`, `traverse`)
- Material PBR setup (`MeshStandardMaterial` with metalness/roughness)
- Part isolation (visibility toggles)
- Explosion lerp animation (`Vector3.lerp`)
- Three-point lighting (standard cinematography)

I'm **not copying Steam Atlas or Craft3D code** — I'm learning the **pattern** and implementing it clean-room.

## What I Learnt

1. **Primitives can look professional** — With proper materials and lighting, cylinders/spheres feel real
2. **Loops unlock complexity** — Instancing rivets/spokes scales detail without code bloat
3. **Grouping is critical** — Logical hierarchies enable isolation/explosion/animation
4. **Hand-tuned explosion vectors work** — For mechanical objects, radial directions are intuitive
5. **Cinematic lighting = polish** — Three-point setup + tone mapping transforms toy to product
6. **Code transparency has value** — Educational demos where you can inspect geometry functions

## References

- [@Karthikvarmamkv's Steam Atlas](https://x.com/Karthikvarmamkv/status/2096904712511488420) — Inspiration for mechanical procedural geometry
- [@Craft3dApp demo](https://x.com/Craft3dApp/status/2096892270851346904) — Articulated parts, isolation patterns
- [Three.js Geometry docs](https://threejs.org/docs/#api/en/geometries/BoxGeometry) — Primitives reference
- [Three.js PBR materials](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial) — Metalness/roughness

## Attribution & Ethics

- Steam Atlas and Craft3D inspired this study
- I'm **not redistributing their code or assets**
- I'm using **original geometry and code** with no proprietary dependencies
- This is **educational research** on public patterns
- All code in `vibes` is MIT licensed

---

**Author**: Johnny Huynh  
**Purpose**: Learning and education — documenting public patterns for others to study  
**Last Updated**: 2026-09-07
