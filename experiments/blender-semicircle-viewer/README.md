# blender-semicircle-viewer

Interactive Three.js viewer displaying 51 procedural laptop-like objects arranged in a semicircular arc.

**Inspired by**: [Legendaryy's Blender MCP demo](https://x.com/Legendaryy/status/2096510965789422001) — GPT Astra installed Blender MCP, rendered 51 MacBook Airs in a semicircle, then built an interactive 3D website.

**What I built**: A clean-room implementation using procedural Three.js geometry (NOT Apple assets) to demonstrate the agent-driven 3D workflow pattern.

## Features

- **51 laptop-like objects** — Procedurally generated (not real MacBooks)
- **Semicircle layout** — Horizontal XZ 180° arc (Three.js Y-up), lids facing inward
- **Orbit-safe horseshoe camera** — Above-front pose from every mesh corner + a sphere floor so the full 180° bowl stays in frame on load, resize, Reset, and auto-rotate
- **Dark cinematic UI** — Matching the vibes quality bar
- **Studio lighting** — Three-point setup (key, fill, rim)
- **Interactive camera** — OrbitControls with auto-rotate
- **Responsive** — Re-frames on resize; works on desktop and mobile

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

Output in `dist/` — ready for static hosting.

Headed local loop: `docs/previews/blender-semicircle.gif`. Full XZ horseshoe with margin — I dragged a slow orbit so it is not the cropped mega-arc.

## Deploy to Vercel

Project `vibes-blender-semicircle` (`prj_PLhnoCVRKmpHc8SxyLRmcp3MFZMC`), Root `experiments/blender-semicircle-viewer`.

### Deploy status (2026-09-12)

Production alias was still stuck on #53 (`c1063df3` / `dpl_6ZTh2WE5`, asset `index-Cai8C-1x.js`) even after #58 Root-touched this README alongside glass + v8. Glass and v8 both went READY on `f98af6bf`; this Root never got a deployment for that commit (webhook miss / concurrent skip). Vite `^6.4.3` is already on `main` via #55 — this semicircle-only README bump is the minimal force so production can leave #53 and pick up the security line. Preview `dpl_24KQoAJh` (`index-B3pEjPew.js`) already proved the bump. No new Vercel projects (Hobby 25-link cap).

## Tech Stack

- **Three.js** `^0.160.0` — 3D rendering engine (unchanged; Vite 6 peers allow it)
- **Vite** `^6.4.3` — Fast dev server and build tool. I left Vite 5 (`5.4.21`) on 2026-09-09 after the [estate audit](https://github.com/johnnyhuy/vibes/pull/54) (`docs/incidents/2026-09-09-security-dep-audit.md` on that PR) because `npm audit fix` wanted Vite 8. This bump is the smallest real fix: Vite **6.4.x** is the current security-backport line. No `@vitejs/plugin-react` and no `vite.config` — vanilla JS, so the migrate was lockfile-only.
- **Vanilla JavaScript** — No framework overhead

## The Pattern (Blender MCP Workflow)

This viewer demonstrates the **end result** of an agent-driven 3D workflow:

### Workflow Steps

1. **Agent installs Blender MCP** (e.g., `ahujasid/blender-mcp`)
2. **Agent calls MCP tools**:
   - `create_primitive(type="laptop_like")`
   - `duplicate_in_semicircle(count=51, radius=12.0)`
   - `export_scene(format="glb", path="semicircle.glb")`
3. **Agent generates Three.js viewer** (this code)
4. **Agent deploys to Vercel**

**Current status**: This viewer uses **procedural Three.js geometry** (no GLB import yet). The Blender script (`experiments/ai-3d-lanes/blender/semicircle_array.py`) can generate the GLB, and future versions of this viewer could load it.

## Why Procedural Geometry?

**Advantages**:
- No external file dependencies
- Instant loading (no network requests)
- Fully parametric (change `LAPTOP_COUNT` in code)
- Educational (shows Three.js fundamentals)

**Trade-offs**:
- Less realistic than Blender-rendered GLB
- Limited geometric complexity
- No texture maps or advanced materials

**Future**: Add GLTFLoader to import `semicircle_laptops.glb` from the Blender script.

## Differences from Other Viewers

### vs. `ai-3d-lanes/web-3d`

**web-3d**: Generic motor assembly, dual scenes (explode + cutaway), educational focus.

**blender-semicircle-viewer**: Specific semicircle laptop demo, single scene, showcases Blender MCP workflow endpoint.

### vs. `explode-assembly`

**explode-assembly**: React + R3F, Tesla Model 3 GLB, explosion slider, ashemag-style product visualisation.

**blender-semicircle-viewer**: Vanilla Three.js, procedural geometry, static semicircle, Legendaryy-style agent demo.

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

**Inspiration**: [Legendaryy on X](https://x.com/Legendaryy/status/2096510965789422001) — Blender MCP workflow demonstration.

**Code**: Original implementation by Johnny Huynh (MIT License).

**Assets**: Procedural Three.js geometry (no external models).

## Related Files

- `experiments/ai-3d-lanes/blender/semicircle_array.py` — Blender script generating the GLB
- `docs/reverse-engineering/blender-mcp-macbook-semicircle.md` — Full workflow analysis
- `docs/visual-quality-bar.md` — Aesthetic standards for this project

## Future Improvements

- [ ] Load GLB from Blender script (GLTFLoader)
- [ ] Add click interactions (select individual laptops)
- [ ] Animate laptop screen content (fake display textures)
- [ ] Add particle effects (subtle dust/light rays)
- [x] Horizontal XZ semicircle + orbit-safe horseshoe framing (AABB-only / look-target mismatch still cropped)
- [ ] Post-processing (bloom, depth of field)

## Notes

This is a **learning experiment** demonstrating agent-driven 3D workflows. The focus is on the *process* (Blender MCP → Three.js viewer) rather than photorealistic laptop rendering.

If you want ultra-realistic MacBooks, use official Apple press assets (with proper licensing). This repo is research/educational only.

---

**Last updated**: 2026-09-12 (semicircle-only Root-touch — #58 skipped this Root; force Vite 6.4.3 onto production)  
**Author**: Johnny Huynh  
**License**: MIT
