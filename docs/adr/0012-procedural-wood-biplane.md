# ADR-0012: Procedural Wood Biplane Over a Reference GLB

**Date**: 2026-09-07  
**Status**: Amended 2026-09-08 — licensed vintage biplane GLB; linen + orbs unchanged  
**Context**: [vibes](../../) monorepo  
**Related**: [amber-longeron.md](../reverse-engineering/amber-longeron.md), [amber-longeron](../../experiments/amber-longeron/), [ADR-0004](./0004-procedural-geometry-over-assets.md)

## Context

@heymichu25 posted a vintage wooden biplane mini-game: Pure WebGL, procedural wooden textures, snappy lane-dodging, zero UI. I wanted that *lesson* — a shop-built spar you can read, grain you can paint, lanes you can miss — without ripping their mesh, domain chrome, or waitlist.

A biplane GLB (theirs or a marketplace “Jenny”) would look borrowed. Hobby Vercel quota is still 0 until ~2026-09-08 20:39 UTC, so the experiment stays local.

## Decision

### 1. Composite primitives + canvas wood

**Chosen**: Vite + React + R3F + drei. Fuselage is a cylinder + cone. Wings are boxes. Cabane struts are thin cylinders. Grain is two 512² canvases (albedo + roughness) with warped rings, pores, and one knot.

**Rejected**:
- Downloading or reconstructing their biplane
- A Sketchfab / Kenney wood crate
- Standing up Blender MCP to export someone else’s Jenny

**Why**: ADR-0004 already prefers primitives when the code *is* the lesson. Canvas grain is the wood-shaped version of the Lumen Cuff grille. You can read `wood.ts` and see why a ring darkens.

### 2. Procedural orbs as the lane beat

**Chosen**: `SphereGeometry` + `MeshPhysicalMaterial` in carnelian `#c43a2a`. Occasional bronze torus as a count I invented.

**Rejected**: Scraping their orb mesh. A physics engine. A GLB boulder pack. A dusk canyon of grey boxes (first local pass — it hid the wood).

**Why**: Headed visual QA of the public still confirmed the *read* is toy wood + tan studio + red lane orbs. I kept that mechanic with my own material so the lesson is still inspectable.

### 3. Thin frosted HUD, not zero chrome

**Chosen**: Auto-start. Faint distance chip in flight. A crash card so restart is obvious. No ready chrome.

**Rejected**: Literally zero DOM (their pitch) and a full marketing dock.

**Why**: This is an educational kitchen sink. Score and restart have to be findable. The original can afford a cinematic void; I still need `R` and a number.

### 4. No Vercel project this pass

**Chosen**: `vercel.json` with `framework: vite`, `outputDirectory: dist`, `ignoreCommand`. No `create_git_project`.

**Rejected**: `vibes-amber-longeron` while quota is 0. Also no new grass / ballance / courtyard project on this PR.

**Why**: Post-quota slots are already spoken for: semicircle framing, then scroll-product READY, then audio-gadget first production, then grass / ballance / courtyard. If `vibes-procedural-grass-field` already exists `deploy: false`, leave it.

## Consequences

### Positive

1. You can read how a biplane is cheap
2. Grain is code, not a JPEG
3. Bundle stays asset-free

### Negative

1. Cylinders are not a varnished museum piece
2. Canvas paint is a first-frame hitch on low GPUs
3. Local QA only until a project exists

## Alternatives considered

- **GLSL wood in the fragment shader** — prettier live grain, harder to inspect. Canvas is the teaching map.
- **cannon-es** — right for a marble (ADR-0008), overkill for lane overlap.
- **Endless world-scroll at the origin** — cheaper camera. Follow-cam matches the public *read* (behind the spar, looking forward) without cloning their boom.

## Validation

```bash
cd experiments/amber-longeron
npm install && npm run build
```

Do **not** create a Vercel project or deploy until quota resets (~2026-09-08 20:39 UTC). If I add one later: Root Directory = `experiments/amber-longeron`.

## Amendment 2026-09-08

The quality bar moved to explode-assembly’s real multi-mesh GLB. The composite toy biplane now loads bradacvojtech’s Sopwith Camel (CC-BY-4.0) from `public/models/vintage-biplane.glb`. A later pass added a local Poly Haven studio HDRI so the Camel is not a flat linen cutout. Canvas wood stays in `wood.ts` as the teaching map; the craft you fly is the licensed mesh. Linen void, carnelian orbs, and invented chrome are unchanged. See `experiments/amber-longeron/ATTRIBUTION.md`.

## References

- [heymichu25](https://x.com/heymichu25/status/2097062564299759855)
- [Public live](https://vintage-biplane-experience.ai.studio/)
- [Three.js ExtrudeGeometry](https://threejs.org/docs/#api/en/geometries/ExtrudeGeometry)

---

**Decision made by**: Johnny Huynh  
**Review status**: Self-approved (solo learning project)
