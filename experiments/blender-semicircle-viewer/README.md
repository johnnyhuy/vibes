# blender-semicircle-viewer

Interactive Three.js viewer displaying 51 licensed Classic Laptop meshes arranged in a semicircular arc.

**Inspired by**: [Legendaryy's Blender MCP demo](https://x.com/Legendaryy/status/2096510965789422001). GPT Astra installed Blender MCP, rendered 51 MacBook Airs in a semicircle, then built an interactive 3D website.

**What I built**: A clean-room implementation of the *array + web viewer* pattern. The boxes are gone. Each seat is Arrangemonk's Poly Haven Classic Laptop (CC0) under a studio HDRI. No Apple CAD.

## Features

- **51 Classic Laptop meshes**. 1k PBR GLB, three parts (stand, keyboard, screen). Shared geometry, cloned seats.
- **Semicircle layout**. Horizontal XZ 180° arc (Three.js Y-up), lids facing inward
- **Orbit-safe horseshoe camera**. Above-front pose from every mesh corner + a sphere floor so the full 180° bowl stays in frame on load, resize, Reset, and auto-rotate
- **Studio lighting**. Poly Haven Studio Small 09 + a dim three-point rig so the beige plastic reads as product, not a grey viewport
- **Dark cinematic UI**. Matching the vibes quality bar
- **Interactive camera**. OrbitControls with auto-rotate
- **Responsive**. Re-frames on resize; works on desktop and mobile

## Run Locally

```bash
cd experiments/blender-semicircle-viewer
npm install
npm run dev
```

Open the displayed localhost URL.

## Build

```bash
npm run build
npm run preview
```

Output in `dist/`. Ready for static hosting.

Headed local loop: `docs/previews/blender-semicircle.gif`. Full XZ horseshoe with margin. The GIF is still the old box array until I recapture it.

## Deploy to Vercel

Project `vibes-blender-semicircle` (`prj_PLhnoCVRKmpHc8SxyLRmcp3MFZMC`), Root `experiments/blender-semicircle-viewer`.

#98 (`eb4a049e`) landed Classic Laptop GLB seats on main, but Vercel never produced a production deploy for this Root (Hobby rate limit / webhook miss). Production alias is still on #74 (`6bcd57bc` / `dpl_5N99g6F7EjvGhcHjQDMXFfN19wy9`). Preview READY exists only for the PR-branch commit (`dpl_GLexDxzacrRxaeaDv8Gqqjx9Vsjr`). This 2026-09-20 README bump is the Root-touch so `ignoreCommand` rebuilds `vibes-blender-semicircle` off current main. I am not creating a new project.

## Tech Stack

- **Three.js** `^0.160.0`. GLTFLoader + RGBELoader (vanilla, no R3F)
- **Vite** `^6.4.3`. Fast dev server and build tool. Vanilla JS, no `@vitejs/plugin-react`.

## The Pattern (Blender MCP Workflow)

This viewer is the **web end** of an agent-driven 3D workflow:

1. Get a real mesh (licensed library, not `primitive_cube_add`)
2. Clean / export **GLB**
3. Load it in the viewer with studio `Environment` lighting
4. Array 51 instances. Screenshot. Iterate the *asset*, not the shader

I am still not using Apple press assets. The lesson from [high-fidelity-mesh-pipeline.md](../../docs/reverse-engineering/high-fidelity-mesh-pipeline.md) is that Blender MCP is the operator, not the sculptor.

## Why a real GLB now?

The first pass stacked boxes so the *array math* was inspectable. That was the right lesson for ADR-0003. It also read as toy hardware next to explode-assembly's Model 3 and Lumen Cuff. The horseshoe stays parametric (`LAPTOP_COUNT`, radius). The seat is no longer a `BoxGeometry`.

## Differences from Other Viewers

### vs. `ai-3d-lanes/web-3d`

**web-3d**: Generic motor assembly, dual scenes (explode + cutaway), educational focus.

**blender-semicircle-viewer**: Specific semicircle laptop demo, single scene, Legendaryy-style agent demo with a licensed seat.

### vs. `explode-assembly`

**explode-assembly**: React + R3F, Tesla Model 3 GLB, explosion slider, ashemag-style product visualisation.

**blender-semicircle-viewer**: Vanilla Three.js, one laptop cloned 51 times, static semicircle.

## Clean-Room Approach

**What I studied**:
- Legendaryy's X post showing the concept
- Public knowledge of Blender MCP servers
- Standard semicircle array math (polar coordinates)

**What I did NOT copy**:
- Apple MacBook Air CAD files (proprietary)
- Private MCP server implementation details
- Exact visual styling (I built my own dark cinematic UI)

**Result**: A legal, educational implementation of the same *pattern*, not a clone of the original *assets*.

## Attribution

**Inspiration**: [Legendaryy on X](https://x.com/Legendaryy/status/2096510965789422001). Blender MCP workflow demonstration.

**Code**: Original implementation by Johnny Huynh (MIT License).

**Assets**: Arrangemonk Classic Laptop + Sergej Majboroda Studio Small 09, both Poly Haven CC0. See [ATTRIBUTION.md](./ATTRIBUTION.md).

## Related Files

- `experiments/ai-3d-lanes/blender/semicircle_array.py`. Blender script generating a procedural GLB (still useful as a box-array lesson)
- `docs/reverse-engineering/blender-mcp-macbook-semicircle.md`. Full workflow analysis
- `docs/reverse-engineering/high-fidelity-mesh-pipeline.md`. Why the boxes lost
- `docs/visual-quality-bar.md`. Aesthetic standards for this project

## Future Improvements

- [x] Load a licensed laptop GLB (GLTFLoader) instead of stacked boxes
- [ ] Add click interactions (select individual laptops)
- [ ] Recapture `docs/previews/blender-semicircle.gif` against the Classic Laptop array
- [x] Horizontal XZ semicircle + orbit-safe horseshoe framing (AABB-only / look-target mismatch still cropped)
- [ ] Post-processing (bloom, depth of field)

---

**Last updated**: 2026-09-20 ~2:25am AEST (blender-semicircle-viewer-only Root-touch after #98 miss)  
**Author**: Johnny Huynh  
**License**: MIT
