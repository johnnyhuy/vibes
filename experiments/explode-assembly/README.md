# explode-assembly

**Tesla Model 3 2021 Long Range** — Interactive exploded view demo inspired by [@ashebytes' viral X posts](https://x.com/ashebytes/status/1831768826242351397) showing a Model X pulled apart into 334 pieces.

I rebuilt this after studying [ashemag/model-x-studio](https://github.com/ashemag/model-x-studio) to understand how they achieved that cinematic product explode effect.

## What I Built

An interactive Tesla Model 3 exploded assembly viewer using **React + Three.js (R3F)**:

- **Real Tesla Model 3 GLB** — David_Holiday's CC-BY-4.0 model from Sketchfab
- **12 system groups** — Body, glass, doors, cabin, battery (82 kWh), dual motors (AWD), thermal, suspension, wheels, charging, computers, lighting
- **Explosion slider** — Smoothly transition from assembled to exploded view (0-100%)
- **Click to select** — Highlight and isolate individual systems
- **Dark cinematic UI** — Automotive marketing aesthetic with studio lighting
- **Explosion layout algorithm** — Based on ashemag's approach (2D grid packing, projection)

## Run It

```bash
cd experiments/explode-assembly
npm install
npm run dev
```

Open http://localhost:5173

**Model**: Tesla Model 3 by David_Holiday (CC-BY-4.0). See [ATTRIBUTION.md](./ATTRIBUTION.md) for full details.

## How ashemag Did It

After studying their code, here's the pattern:

### 1. Multi-Mesh GLB (The Key Trick)

**NOT** a single merged car mesh. Instead:
- **100s of separate mesh islands in one GLB file**
- Each mesh is a selectable "piece" (door panel, headlight, wheel bolt, etc.)
- ashemag's Model X has **334 pieces** — that's why the explode looks so impressive

**This demo**: Uses 5 separate GLB files (sedan body + 4 wheels) loaded and positioned programmatically. Demonstrates the algorithm with a simpler asset.

**ashemag's approach**: One GLB with 334 meshes inside. More impressive visually, but requires custom asset prep.

You can create 334-piece style by:
- Finding a car with separated parts (WolfGames36 on Sketchfab)
- OR manually splitting in Blender (select faces → Separate → By Loose Parts)
- OR using BlendKit models (like cgi Moon's Model X used by ashemag)

### 2. Explosion Layout Algorithm

```
For each mesh piece:
  1. Calculate 3D bounding box
  2. Project onto 2D viewing plane (right/up vectors)
  3. Pack into grid layout (like bin packing)
  4. Calculate translation vector from center to grid slot

On slider change:
  - Lerp each piece from originalPosition to (originalPosition + translation * sliderValue)
```

See `src/utils/explosion.ts` for my implementation (based on ashemag's `explosion-layout.ts`).

### 3. Part Metadata & Organization

Optional but useful — add `userData` to meshes in Blender:

```python
# In Blender Python console
for obj in bpy.context.selected_objects:
    obj["part"] = "body"  # or "wheels", "doors", etc.
    obj["component"] = "front-left-door"  # unique ID
```

This lets you group pieces into systems (body, wheels, battery, etc.) for the sidebar.

### 4. React + R3F + Three.js

Stack:
- **React** — UI state (explode slider, selected part, isolated view)
- **@react-three/fiber** — Declarative Three.js in React
- **@react-three/drei** — Helpers (OrbitControls, Environment, etc.)
- **Three.js** — GLTFLoader, raycaster, mesh manipulation

ashemag uses this same stack + shadcn for UI components + Vinext/Vercel for deployment.

## Model Source: Tesla Model 3

This demo uses a **Tesla Model 3** GLB:
- **Model**: Tesla Model 3
- **Author**: David_Holiday
- **License**: CC Attribution 4.0 International (CC-BY-4.0)
- **Source**: https://sketchfab.com/3d-models/tesla-model-3-123c10f376ec4f18b93c73afc382808b
- **Downloaded via**: https://github.com/pakagronglb/tesla-3d-showcase
- **File**: `model3.glb` (289 KB)

**Attribution (required by CC-BY-4.0)**:
> "Tesla Model 3" by David_Holiday is licensed under CC Attribution 4.0 International

### How It Works

The code loads the single `model3.glb` file and:
1. **Traverses all meshes/groups** in the scene graph
2. **Detects systems** by mesh/node names (body, glass, doors, wheels, etc.)
3. **Creates explodable pieces** — each mesh becomes a selectable part
4. **Maps to 12 system groups** — Body, Glass, Doors, Cabin, Battery, Dual Motors, Thermal, Suspension, Wheels, Charging, Computers, Lighting

This approach works with any GLB — the denser the mesh separation, the better the explode effect.

### vs. ashemag's 334-piece Model X

ashemag's [viral demo](https://x.com/ashebytes/status/1831768826242351397) uses BlendKit's Model X with 334 pre-split mesh islands. This Model 3 has fewer separated parts but demonstrates the same algorithm with a freely available CC-BY model.

## Code Structure

```
src/
├── main.tsx              # React entry point
├── App.tsx               # Main app container
├── components/
│   ├── Scene.tsx         # R3F Canvas + lights + camera
│   ├── CarModel.tsx      # GLB loader + explosion animation
│   ├── Sidebar.tsx       # Parts list + isolation controls
│   └── Controls.tsx      # Explode slider
├── utils/
│   └── explosion.ts      # Grid packing algorithm (ashemag pattern)
└── styles.css            # Dark UI styling
```

## Why I Built This

After seeing those viral Tesla explode demos, I wanted to understand the underlying tech. This is my learning experiment for:

1. **Multi-mesh 3D asset workflows** — How to structure GLBs for interactive exploded views
2. **Spatial algorithms** — 2D packing, projection, translation vectors
3. **R3F architecture** — Integrating Three.js with React
4. **Product visualization UX** — Sliders, isolation, selection, cinematic cameras

An AI agent could generate this by:
1. Researching ashemag's approach (GitHub code, X threads, docs)
2. Finding/downloading CC-BY multi-part car GLB from Sketchfab
3. Implementing explosion layout algorithm
4. Creating React + R3F UI with proper controls
5. Adding proper attribution

I hand-coded this, but the structure shows what's automatable.

## Differences from ai-3d-lanes/web-3d

**explode-assembly**: 
- Real GLB loading (or procedural fallback)
- React + R3F architecture
- ashemag's explosion algorithm
- Product marketing aesthetic

**web-3d lane**: 
- Vanilla Three.js
- Generic motor assembly
- Educational cutaway scene
- Simpler approach

Both valid, different use cases.

## Sources & Attribution

- **Code inspiration**: [ashemag/model-x-studio](https://github.com/ashemag/model-x-studio) — explosion layout, React+R3F patterns
- **3D models**: See [ATTRIBUTION.md](./ATTRIBUTION.md) for CC-BY and Royalty Free sources
- **Stack**: React, @react-three/fiber, @react-three/drei, Three.js, Vite

Built by Johnny Huynh • This is my kitchen sink • Research and education only — not production code

---

**Disclaimer**: This is an independent educational project. Not affiliated with Tesla, ashemag, WolfGames36, or BlendKit. All 3D models are subject to their own licenses — always attribute creators.
