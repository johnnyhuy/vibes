# ADR-0011: Procedural Grass via Instancing and Shaders

**Date**: 2026-09-07  
**Status**: Accepted  
**Context**: [vibes](../../) monorepo  
**Related**: [procedural-grass-field.md](../reverse-engineering/procedural-grass-field.md), [procedural-grass-field](../../experiments/procedural-grass-field/), [ADR-0004](./0004-procedural-geometry-over-assets.md)

## Context

Bilal Khan’s Grassworks post is a dense, interactive Three.js meadow. I wanted that *lesson* — thousands of blades, wind at the tip, species as state — without shipping a turf pack or cloning their product.

A grass GLB (one sculpted blade, instanced or not) would look “bought.” A unique mesh per blade would die on the CPU. Hobby Vercel quota is still 0 until ~2026-09-08 12:55 UTC, so the experiment stays local.

## Decision

### 1. Instanced crossed planes + a wind shader

**Chosen**: Vite + React + R3F. Each instance is two tapered `PlaneGeometry`s merged into a plus. A custom `ShaderMaterial` bends world XZ by height², two sine frequencies, and a pointer gust. Per-instance attributes carry phase, tint, and bend.

**Rejected**:
- Loading a commercial or Sketchfab grass blade GLB
- One `Mesh` per stem
- GPU compute / transform feedback (extra toolchain, harder to read)
- Cloning Grassworks’ blade-vs-billboard product split

**Why**: ADR-0004 already prefers primitives when the code *is* the lesson. Instancing is the grass-shaped version of the rivet loop. You can read the vertex shader and see why the tip moves more than the root.

### 2. Species as palettes, not botanic scans

**Chosen**: Four invented looks (Rye, Fescue, Reed, Ink) that retint, retaper, and change rest bend.

**Rejected**: Photogrammetry cards, atlas textures, or their species catalogue.

**Why**: Clean-room. I want “state → look,” not a grass library. Ink exists so a stylised preset is first-class, not an afterthought.

### 3. Orbit + gust, not a walker

**Chosen**: `OrbitControls` (auto-orbit, drag override) and a ground pointer that writes `uGust`.

**Rejected**: WASD + mouse-look + foot collision this pass.

**Why**: The brief for this kitchen sink is a meadow you inspect, same camera language as Ridge Pagoda and North Court. A first-person controller is a different experiment.

### 4. No Vercel project this pass

**Chosen**: `vercel.json` with `framework: vite`, `outputDirectory: dist`, `ignoreCommand`. No `create_git_project`.

**Rejected**: `vibes-procedural-grass-field` while quota is 0. Also still no ballance-roll or courtyard project.

**Why**: Pending Roots already need the next slots (semicircle, then scroll). Audio-gadget is already linked (`prj_N57mvThg4UcU9XxLK3F5wAICz9PA`) and must not be redeployed on this PR.

## Consequences

### Positive

1. You can read how a meadow is cheap
2. Bundle stays code-only
3. Density is a chip, not a re-export

### Negative

1. Crossed planes are not botanic
2. 64k instances still cost a first-frame hitch on low GPUs
3. No true self-shadowing of blade-on-blade
4. Local QA only until a project exists

## Alternatives considered

- **drei `Instances` + `MeshStandardMaterial` + `onBeforeCompile`** — works, but the wind math hides in a patch. A full shader is the teaching artifact.
- **Soft-body or cannon-es grass** — wrong scale. Contact makes sense for a marble (ADR-0008), not 36k stems.
- **Billboard cards** — cheaper, flatter, closer to their product toggle. I skipped it so this demo has one honest geometry.

## Validation

```bash
cd experiments/procedural-grass-field
npm install && npm run build
```

Do **not** create a Vercel project or deploy until quota resets (~2026-09-08 12:55 UTC). If I add one later: Root Directory = `experiments/procedural-grass-field`.

## References

- [Bilal Khan / Grassworks](https://x.com/Bk23544/status/2096928659785626028)
- [Public demo](https://grassworks.techredux.co/demo)
- [Three.js InstancedMesh](https://threejs.org/docs/#api/en/objects/InstancedMesh)

---

**Decision made by**: Johnny Huynh  
**Review status**: Self-approved (solo learning project)
