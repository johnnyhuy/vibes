# Reverse Engineering: ashemag's Model X Explode Demo

**Source**: [github.com/ashemag/model-x-studio](https://github.com/ashemag/model-x-studio)  
**X Post**: [@ashebytes Model X explode](https://x.com/ashebytes/status/2096009146248122416) — Model X exploded into 334 pieces via GPT-6 Astra  
**Study Date**: 2026-09-07  
**Purpose**: Clean-room notes on the technical pattern, not code copying

**Visual reference**: Cinematic product presentation — dark background, studio lighting, frosted glass UI panels, smooth explosion animation, technical aesthetic. See attached `hill-climb/refs/ashe-modelx.jpg` for quality bar.

## What Made It Viral

ashemag's demo went viral because it looked like **official Tesla marketing material**:
- Real Model X geometry (not placeholder boxes)
- 334 separate pieces exploding in a grid
- Smooth cinematic animation
- Dark automotive product UI
- "Built by AI in 30 minutes" hook

I wanted to understand the underlying mechanics so I could build similar-quality demos with freely available assets.

## Core Pattern (Clean-Room Analysis)

### 1. Multi-Mesh GLB (The Key Insight)

**Not** a single merged car mesh. Instead:

```
model-x.glb contains:
  └─ Scene
     ├─ DoorLeftFront (mesh)
     ├─ DoorLeftRear (mesh)
     ├─ DoorRightFront (mesh)
     ├─ WindowFrontLeft (mesh)
     ├─ HeadlightLeft (mesh)
     ├─ BatteryModule_01 (mesh)
     ├─ BatteryModule_02 (mesh)
     ... (334 total meshes)
```

Each mesh is a **separate, named object** in the GLB hierarchy.

**Why this matters**:
- You can select each piece individually
- Each piece gets its own explosion translation
- The more pieces, the more impressive the effect

**How to create this**:
- Option A: Download models with pre-separated parts (e.g., WolfGames36 on Sketchfab)
- Option B: In Blender, select faces → `P` → "Separate by Loose Parts"
- Option C: Use BlendKit royalty-free models (what ashemag likely used)

### 2. Explosion Layout Algorithm

**Goal**: Spread 334 pieces into a readable grid without overlap.

**Approach** (from studying the code):

```
For each mesh in the GLB:
  1. Calculate 3D bounding box (width, height, depth)
  2. Project onto 2D viewing plane:
     - Get camera's right vector (horizontal)
     - Get camera's up vector (vertical)
     - Project bounding box onto these vectors
  3. Pack into 2D grid:
     - Sort pieces by size
     - Bin-pack into grid cells (like arranging photos in a gallery)
     - Calculate 2D grid position for each piece
  4. Convert grid position back to 3D:
     - gridX → translation along camera right vector
     - gridY → translation along camera up vector
  5. Store explosion vector:
     - targetPosition = originalPosition + (gridX * spacing, gridY * spacing, 0)

On slider change:
  - For each piece:
      piece.position.lerp(originalPosition, targetPosition, explosionLevel)
```

**Key details**:
- Projection is relative to **camera view** (not world axes)
- Grid spacing adjusts based on piece size (larger pieces get more space)
- Uses `lerp()` for smooth 0% → 100% animation
- Respects original relative positions (so front bumper stays in front zone)

### 3. Part Metadata & Grouping

Each mesh can have `userData` to organize into systems:

```javascript
// In the GLB (set in Blender):
mesh.userData = {
  system: "body",        // Group: body, wheels, battery, etc.
  component: "door-left", // Unique ID
  part: "panel"          // Sub-type
}
```

This enables:
- Sidebar parts list grouped by system
- "Isolate Body" button (hide everything except body parts)
- Color-coding by system
- Search/filter UI

### 4. React + R3F Architecture

**Stack**:
- **React** — UI state (explosion slider, selected part, isolated system)
- **@react-three/fiber (R3F)** — Declarative Three.js in React
- **@react-three/drei** — Helpers (OrbitControls, Environment, useGLTF)
- **Three.js** — Core 3D engine
- **shadcn/ui + Tailwind** — UI components (slider, sidebar, buttons)
- **Vinext + Vercel** — Deployment

**State management**:
```jsx
const [explosionLevel, setExplosionLevel] = useState(0);
const [selectedPart, setSelectedPart] = useState(null);
const [isolatedSystem, setIsolatedSystem] = useState(null);
```

**GLB loading**:
```jsx
const { scene } = useGLTF('/models/model-x.glb');

useEffect(() => {
  const pieces = [];
  scene.traverse((child) => {
    if (child.isMesh) {
      pieces.push({
        mesh: child,
        original: child.position.clone(),
        target: calculateExplosionTarget(child)
      });
    }
  });
  setPieces(pieces);
}, [scene]);
```

**Animation loop**:
```jsx
useFrame(() => {
  pieces.forEach(piece => {
    piece.mesh.position.lerpVectors(
      piece.original,
      piece.target,
      explosionLevel
    );
  });
});
```

### 5. Product UI Design

ashemag's UI looks like automotive marketing:

- **Dark theme** — Black background, white text
- **Studio lighting** — HDRI environment, soft shadows
- **Cinematic camera** — Low FOV, distant orbit
- **Monospace labels** — Technical aesthetic
- **Subtle animations** — Smooth transitions, no jarring cuts
- **Minimal chrome** — No busy UI, just explosion slider + parts list

**Lighting setup** (inferred):
```jsx
<Environment preset="city" /> // HDRI background
<ambientLight intensity={0.4} />
<directionalLight position={[10, 10, 5]} intensity={1.2} />
<spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} />
```

### 6. "AI-Generated" Angle

ashemag's hook: **"GPT-6 Astra built this in 30 minutes."**

What the AI likely did:
1. **Researched the pattern** — Found Three.js exploded view examples
2. **Generated explosion algorithm** — Wrote the grid packing logic
3. **Set up React + R3F** — Scaffolded the component structure
4. **Created UI** — shadcn slider + parts list
5. **Added attribution** — CC-BY/royalty-free model compliance

What the **human** did:
- Found/prepped the 334-piece Model X GLB
- Refined the UI aesthetic
- Tuned camera/lighting for cinematic look
- Chose color palette + typography

**Key takeaway**: The technical pattern is automatable, but the polish (asset quality, aesthetic choices) is still human curation.

## My Implementation (explode-assembly)

I've rebuilt this pattern with a **Tesla Model 3** (CC-BY-4.0) to prove it works with freely available assets:

- **Fewer pieces** — Model 3 GLB has ~12 system groups, not 334 individual pieces
- **Same algorithm** — Grid packing, lerp animation, React state
- **Same stack** — React + R3F + drei + Vite
- **Clean-room code** — Wrote my own implementation from understanding the pattern

See `experiments/explode-assembly/` for full source.

## Differences from ashemag's Version

| Feature | ashemag's Model X Studio | My explode-assembly |
|---------|-------------------------|---------------------|
| **Mesh count** | 334 pieces | ~12 system groups |
| **GLB source** | BlendKit royalty-free | David_Holiday CC-BY |
| **UI framework** | shadcn/ui + Tailwind | Plain React + CSS |
| **Deployment** | Vinext on Vercel | Vite on Vercel |
| **Code** | Private (not open) | MIT, fully visible |

## What I Learnt

1. **Real geometry matters** — Procedural boxes look like toys; multi-mesh GLBs look professional
2. **The GLB structure is the trick** — 334 pieces vs. 1 merged mesh changes everything
3. **React + R3F simplifies UI state** — Managing explosion/selection in vanilla Three.js would be painful
4. **2D packing is the explosion algorithm** — Project to viewing plane, bin-pack, translate back
5. **Cinematic lighting + dark UI = product marketing aesthetic**
6. **Attribution is non-negotiable** — Always credit CC-BY/royalty-free sources

## Public Patterns (Not Proprietary)

These are **general techniques** visible across many Three.js projects:
- Multi-mesh GLB loading (Three.js `GLTFLoader` traversal)
- 2D bin packing algorithms (public CS pattern)
- React Three Fiber component patterns (from R3F docs)
- Lerp animation (standard Three.js `Vector3.lerp()`)
- shadcn/ui components (open-source library)

I'm **not copying ashemag's code** — I'm learning the **pattern** and implementing it clean-room with free assets.

## References

- [ashemag/model-x-studio](https://github.com/ashemag/model-x-studio) — Original source for pattern study
- [@ashebytes Model X explode](https://x.com/ashebytes/status/2096009146248122416) — Viral demo (GPT-6 Astra, 334 pieces)
- [@DilumSanjaya V8 cutaway](https://x.com/DilumSanjaya/status/2096280244663775423) — Technical engine visualisation inspiration
- [@alwayspriyesh Earth timeline](https://x.com/alwayspriyesh/status/2096819464688005440) — Interactive timeline pattern (GPT-6 Astra)
- [React Three Fiber docs](https://docs.pmnd.rs/react-three-fiber) — R3F patterns
- [David_Holiday's Tesla Model 3](https://sketchfab.com/3d-models/tesla-model-3-123c10f376ec4f18b93c73afc382808b) — CC-BY-4.0 GLB I'm using

## Attribution & Ethics

- ashemag's demo inspired this study
- I'm **not redistributing their code or assets**
- I'm using **freely licensed GLBs** with proper attribution
- This is **educational research** on public patterns
- All code in `vibes` is MIT licensed and original

---

**Author**: Johnny Huynh  
**Purpose**: Learning and education — documenting public patterns for others to study  
**Last Updated**: 2026-09-07
