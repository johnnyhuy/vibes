# explode-assembly

Interactive car exploded view demo — inspired by [@ashebytes' viral X posts](https://x.com/ashebytes/status/1831768826242351397) showing a Tesla Model X pulled apart into 334 modeled pieces.

I rebuilt this after studying [ashemag/model-x-studio](https://github.com/ashemag/model-x-studio) to understand how they achieved that cinematic product explode effect.

## What I Built

An interactive exploded assembly viewer using **React + Three.js (R3F) + real GLB meshes** (or procedural fallback):

- **Explosion slider** — Smoothly transition from assembled to exploded view
- **Click to select** — Highlight and isolate individual parts or systems
- **Multi-mesh support** — Works with any GLB that has separated parts
- **Cinematic UI** — Dark, minimal interface matching automotive marketing sites
- **Explosion layout algorithm** — Based on ashemag's approach (2D grid packing, projection)

## Run It

```bash
cd experiments/explode-assembly
npm install
npm run dev
```

Open http://localhost:5173

**Model**: Uses **Kenney Car Kit** (CC0) — sedan body + individual wheels assembled programmatically. See [ATTRIBUTION.md](./ATTRIBUTION.md) for details.

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

## Current Model: Kenney Car Kit

This demo uses the **Kenney Car Kit** (CC0 Public Domain):
- **Sedan body** (`sedan.glb`) — Main car model
- **Wheels** (`wheel-default.glb` × 4) — Positioned programmatically
- **Source**: https://kenney.nl/assets/car-kit
- **License**: CC0 — free for any use, no attribution required (but appreciated!)

The Car Kit includes 40+ low-poly vehicles (sedans, trucks, ambulances, etc.) + separate wheels + debris parts. All optimized for real-time rendering.

### Why Kenney vs. ashemag's 334-piece Model X?

ashemag's [viral Model X demo](https://x.com/ashebytes/status/1831768826242351397) uses a custom multi-mesh GLB with 334 separate pieces — each door panel, headlight, bolt, etc. is a distinct mesh island. That level of granularity requires:
1. A pre-split model from BlendKit/Sketchfab (often paywalled or requires manual download)
2. OR manually splitting a car mesh in Blender (tedious for 100+ parts)

For an open-source demo with **no download barriers**, Kenney's CC0 kit is ideal:
- Direct download, no auth required
- Clean low-poly meshes
- Separate wheels that can be positioned/exploded independently
- 5 pieces (body + 4 wheels) → enough to demonstrate the explosion algorithm

### Getting a 334-piece style exploded view

If you want the full ashemag experience:
1. Download [WolfGames36's separated cars](https://sketchfab.com/3d-models/chrysler-c300-improved-bd1143b6e5f34f419c636c05fdaa6664) (CC-BY, Sketchfab account required)
2. OR get [BlendKit Model X](https://www.blendkit.com/asset-gallery-detail/983e8f94-5a56-44a4-94d9-eed5e4cdcd6c/) (Royalty Free, account required)
3. Replace `public/models/sedan.glb` with your multi-mesh car
4. Update `CarModel.tsx` to enumerate all mesh children instead of loading separate GLB files

See [ATTRIBUTION.md](./ATTRIBUTION.md) for full details on sourcing multi-part cars.

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
