# ADR-0002: React + R3F with Real GLB over Procedural Geometry

**Status**: Accepted  
**Date**: 2026-09-07  
**Context**: Building exploded assembly demos that look like polished product marketing, not toy prototypes

## Decision

For high-quality exploded assembly demos (like `explode-assembly`), I'm using **React + React Three Fiber (R3F) + real multi-mesh GLB files** instead of vanilla Three.js with procedural boxes.

## What Changed

### Before (vanilla Three.js procedural)
```javascript
// Create colored boxes in a loop
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
```

**Result**: Works, but looks like a toy prototype. Green boxes don't convey "this is a Tesla Model 3."

### After (React + R3F + GLB)
```jsx
// Load real GLB with 334 mesh pieces
const { scene } = useGLTF('/models/model3.glb');
scene.traverse((child) => {
  if (child.isMesh) {
    // Each mesh becomes an explodable piece
    pieces.push(child);
  }
});
```

**Result**: Looks like a professional product demo. Real car geometry, proper materials, cinematic lighting.

## Why React + R3F?

### 1. **Declarative UI State**
Exploded views need complex state:
- Which piece is selected?
- What's the explosion percentage?
- Which system is isolated?

React makes this trivial:
```jsx
const [explosionLevel, setExplosionLevel] = useState(0);
const [selectedPart, setSelectedPart] = useState(null);
```

With vanilla Three.js, I'd be manually managing state in global vars and DOM event handlers — messy fast.

### 2. **Component Composition**
```jsx
<Canvas>
  <Scene>
    <CarModel explosionLevel={explosionLevel} />
    <Lights />
    <OrbitControls />
  </Scene>
</Canvas>
```

vs. vanilla Three.js setup boilerplate (200+ lines of `init()` functions). R3F hides the plumbing.

### 3. **Drei Helpers**
`@react-three/drei` provides production-ready utilities:
- `<OrbitControls />` — camera controls in one line
- `<Environment preset="city" />` — HDR lighting instantly
- `useGLTF` hook — GLB loading with automatic caching

I'd have to implement or import these separately with vanilla.

### 4. **Easier Integration with UI Libraries**
The explode demo needs:
- Sidebar with parts list
- Explosion slider
- System isolation buttons

React lets me use shadcn/ui, Tailwind, or any component library. Vanilla Three.js means hand-coding UI or awkward bridging.

## Why Real GLB Files?

### 1. **Believability**
ashemag's Model X explode went viral because it looked **real**. You could see:
- Door handles
- Headlight assemblies
- Battery cell modules
- Suspension components

Procedural boxes don't tell that story. Real GLB geometry does.

### 2. **The 334-Piece Effect**
ashemag's demo had **334 separate mesh pieces** in one GLB. When it exploded, it looked like a factory CAD breakdown.

Key insight: **The GLB must have separated meshes**, not one merged mesh. Each mesh becomes a piece you can:
- Select individually
- Explode to a different position
- Color/highlight
- Hide/show

### 3. **Free CC-BY Models Exist**
- Sketchfab has thousands of CC-BY car models
- BlendKit has royalty-free assets
- No need to scrape proprietary CAD

I'm using David_Holiday's Tesla Model 3 (CC-BY-4.0) — clean attribution, no legal risk.

## The Trade-off

### Advantages
- **Looks professional** — Real geometry, proper materials
- **Easier state management** — React handles UI/3D sync
- **Faster prototyping** — R3F + drei = less boilerplate
- **Component reuse** — Lights, controls, UI as reusable pieces

### Disadvantages
- **Larger bundle size** — React + R3F + drei ≈ 200 KB gzipped
- **More dependencies** — Vanilla only needs Three.js
- **Learning curve** — R3F has its own patterns (hooks, context)

## When Vanilla Three.js Makes Sense

I'm still using vanilla Three.js for:
- **earth-timeline** — Procedural planet, simple animation
- **v8-cutaway** — Mechanical parts, parametric geometry

Because:
- No complex UI state
- Geometry is programmatically generated
- Smaller bundle matters more

But as these demos mature and need better visuals, I might migrate them to R3F too.

## ashemag's Pattern (Reverse-Engineered)

From studying [github.com/ashemag/model-x-studio](https://github.com/ashemag/model-x-studio):

1. **Multi-mesh GLB** — One file, 334 meshes inside
2. **React + R3F** — State-driven explosion/selection
3. **2D Grid Packing Algorithm** — Projects 3D bounding boxes onto 2D plane, packs into grid, calculates translation vectors
4. **Lerp Animation** — `piece.position.lerp(targetPosition, explosionLevel)`
5. **shadcn/ui + Tailwind** — Dark, cinematic product UI

I've replicated this pattern in `explode-assembly/` with a simpler GLB (fewer meshes) to prove the approach works with freely available assets.

## Implementation Example

See `experiments/explode-assembly/src/` for full code:
- `components/CarModel.tsx` — GLB loader + explosion logic
- `utils/explosion.ts` — Grid packing algorithm
- `App.tsx` — React state + UI controls

## References

- [ashemag/model-x-studio](https://github.com/ashemag/model-x-studio) — Original viral demo
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) — R3F docs
- [@react-three/drei](https://github.com/pmndrs/drei) — Helper library
- [David_Holiday's Tesla Model 3](https://sketchfab.com/3d-models/tesla-model-3-123c10f376ec4f18b93c73afc382808b) — CC-BY-4.0 GLB used in demo

## Future Considerations

- Extract shared R3F components into `packages/3d-components` if multiple experiments converge on the same patterns
- Consider adding a "GLB mesh splitter" tool to help prep models for explosion
- Document how to find/prep multi-mesh GLBs for others learning this pattern

---

**Author**: Johnny Huynh  
**Last Updated**: 2026-09-07
