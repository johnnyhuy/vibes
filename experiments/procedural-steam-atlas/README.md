# procedural-steam-atlas

Mechanical assembly built entirely from runtime TypeScript geometry functions — no .glb, .obj, or image assets required.

I wanted to explore how to create detailed mechanical objects using only Three.js primitives and code. Inspired by [@Karthikvarmamkv's Steam Atlas demo](https://x.com/Karthikvarmamkv/status/2096904712511488420) (mechanical trains from pure geometry) and [@Craft3dApp's structured parts](https://x.com/Craft3dApp/status/2096892270851346904) (craft3d.app), I built a procedural locomotive that exists only as functions — no external assets.

## What I Built

A stylized steam locomotive generated at runtime:

- **Procedural geometry** — Wheels, boiler, chassis, smokebox, rivets all from cylinders, spheres, boxes
- **Explosion view** — Parts separate along logical vectors to reveal construction
- **Part isolation** — Toggle between full assembly, chassis only, or wheels only
- **Dark cinematic UI** — Studio lighting, three-point setup, orbital camera
- **Zero assets** — No models, textures, or images; everything is code

## Running It

```bash
npm install
npm run dev
```

Open http://localhost:5173 → drag to orbit, scroll to zoom, use controls to explode/isolate.

## Deploy

Vercel project: **`vibes-steam-atlas`** (`prj_7D08PT8sdUjhigCEuz83oltZrDMv`)  
Root Directory: **`experiments/procedural-steam-atlas`** — **set this in the dashboard before any post-quota deploy.** Do not use the repo root.

`vercel.json` here sets Vite + `ignoreCommand`. It cannot set Root Directory. `create_git_project` reuse (`deploy: false`) also **does not write Root**. Pause API returned **400** on hobby — I cannot pause this project to stop fan-out.

Production **READY** on `main` `a94b16e` / `dpl_98Yz1BpRLivVxs63SuV4UFb7Z9WS` after the ballance-roll merge touched this Root. Alias [vibes-steam-atlas.vercel.app](https://vibes-steam-atlas.vercel.app) returns the locomotive HTML (200). I have not screenshot the canvas on the courtyard hill-climb. Confirm dashboard Root before any extra deploy. Don’t spam retries from the agent. This README sentence keeps the Root in the next merge diff.

See [docs/incidents/2026-09-08-steam-atlas-wrong-root.md](../../docs/incidents/2026-09-08-steam-atlas-wrong-root.md).

## Why I Made This

I wanted to understand **procedural mechanical modeling** — the pattern where complex objects are built from geometric primitives at runtime instead of loading pre-made meshes.

This is my learning experiment for:
- **Runtime CSG** — Constructive solid geometry in TypeScript
- **Part hierarchies** — Logical grouping for explosion/isolation
- **Procedural instancing** — Wheels, rivets, spokes generated in loops
- **Cinematic presentation** — Studio lighting, shadows, damping controls

## The Approach

**Vanilla Three.js stack**: No React/R3F because the focus is pure geometry generation, not UI state complexity.

**Geometry functions**: Each part (wheel, boiler, cab, etc.) is a function that returns Three.js primitives:

```javascript
function createWheel(radius, width) {
  const group = new THREE.Group();
  
  // Rim
  const rimGeometry = new THREE.CylinderGeometry(radius, radius, width, 32);
  const rim = new THREE.Mesh(rimGeometry, MATERIAL_STEEL);
  group.add(rim);
  
  // Hub
  const hubGeometry = new THREE.CylinderGeometry(radius * 0.3, radius * 0.3, width * 1.2, 16);
  const hub = new THREE.Mesh(hubGeometry, MATERIAL_BRASS);
  group.add(hub);
  
  // Spokes (8 radial)
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const spoke = createBox(radius * 0.7, 0.05, 0.05);
    spoke.position.set(Math.cos(angle) * radius * 0.5, Math.sin(angle) * radius * 0.5, 0);
    spoke.rotation.z = angle;
    group.add(spoke);
  }
  
  return group;
}
```

**Explosion vectors**: Each part stores its original position and a hand-tuned explosion direction:

```javascript
wheel.userData.originalPosition = wheel.position.clone();
wheel.userData.explosionVector = new THREE.Vector3(pos.x * 0.3, -2, pos.z * 1.5);

// On slider change:
part.position.lerp(originalPosition, originalPosition + explosionVector * factor, 0.1);
```

**Part grouping**: Chassis parts (boiler, cab, smokebox, rivets) and wheel parts are tracked separately for isolation.

**Lighting**: Three-point setup — key light (white, top-front), fill light (blue, side), rim light (orange, back).

## Simplifications

This is an educational prototype, so I simplified:
- **Stylized locomotive** — Not historically accurate; inspired by Steam Atlas aesthetics
- **Hand-tuned explosion vectors** — Not algorithmic grid packing (see explode-assembly for that)
- **Fixed materials** — Steel, brass, metal; no textures or decals
- **No animation** — Wheels don't spin; this is about static geometry generation
- **~20 parts** — Enough to show explosion/isolation without overwhelming complexity

A production version would add:
- Parametric scaling (adjust locomotive size dynamically)
- Animated pistons and drive rods
- Steam particle effects
- Track/rails beneath
- More mechanical detail (valves, gauges, levers)

## Stack

- **Three.js** — 3D rendering engine
- **Vite** — Fast dev server + build tool
- **Vanilla JS** — No framework; pure DOM + Three.js

I chose vanilla over React + R3F because:
1. No complex UI state to manage
2. Smaller bundle size (500 KB vs 200 KB gzipped)
3. Focus on geometry functions, not component patterns

If I add a parts list sidebar or animation controls, I might migrate to React.

## What I Learnt

1. **Runtime geometry is viable** — You can build detailed objects without asset pipelines
2. **Procedural loops scale well** — Rivets, spokes, wheels from `for` loops instead of hand-placing
3. **Explosion vectors need tuning** — Unlike grid packing, radial/directional vectors require manual adjustment per part
4. **Materials matter** — Metalness + roughness PBR makes primitives look real; flat colors look toy-like
5. **Part grouping enables isolation** — Logical collections (chassis vs. wheels) unlock UI features

## Pattern: Procedural Runtime Geometry

**Key insight from Steam Atlas**: You don't need Blender exports if you can express shapes as parametric functions.

**Benefits**:
- **No asset loading** — Zero network requests, instant startup
- **Parametric flexibility** — Change wheel radius, boiler length, etc. dynamically
- **Tiny bundle** — Only code, not megabytes of mesh data
- **Educational clarity** — You can see exactly how each part is constructed

**Trade-offs**:
- **Less detail** — Hard to match artist-sculpted organic shapes
- **Manual work** — Each part needs a custom function; no drag-and-drop modeling
- **Performance** — Generating geometry at runtime has upfront cost (mitigated by caching)

**When to use**:
- Mechanical objects with clear primitives (gears, pistons, chassis)
- Educational demos where showing construction is the goal
- Parametric designs that need runtime configurability

**When not to use**:
- Organic shapes (cars, characters, terrain)
- High-detail assets where artist modeling is faster
- Scenarios where loading a .glb is simpler than writing 200 lines of geometry code

See `docs/reverse-engineering/procedural-runtime-geometry.md` for more on this pattern.

## Craft3D Influence

[@Craft3dApp's demo](https://x.com/Craft3dApp/status/2096892270851346904) shows **articulated parts** you can isolate and rotate. I replicated the isolation pattern (chassis/wheels toggle) but skipped articulation (hinged doors, rotating gears) to keep scope tight.

If I extend this, I'd add:
- Part rotation (spin wheels independently)
- Hierarchical transforms (piston arm connected to wheel)
- Animation timeline (playback of assembly sequence)

## What's Next

If I return to this, I'd add:
- **Parametric controls** — Sliders to adjust wheel size, boiler length, cab height
- **Animation** — Spinning wheels, reciprocating pistons
- **More mechanical detail** — Valve gear, drive rods, coupling rods
- **CSG operations** — Boolean subtract for cutaway views
- **Export to GLB** — Save runtime geometry to file for reuse

For now, this proves the pattern: **pure TypeScript geometry functions can create believable mechanical objects without asset pipelines**.

---

**Status**: Linked, production READY `dpl_98Yz1BpRLivVxs63SuV4UFb7Z9WS` on `a94b16e` (HTML confirmed; canvas not screenshot)  
**Last updated**: 2026-09-08  
**Built by**: Johnny Huynh · kitchen sink · research and education only — not production code
