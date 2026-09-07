# ADR-0013: Lobed Glass Vessel and an Invented Nacre Film

**Date**: 2026-09-07  
**Status**: Accepted  
**Context**: [vibes](../../) monorepo  
**Related**: [nacre-loom.md](../reverse-engineering/nacre-loom.md), [nacre-loom](../../experiments/nacre-loom/), [ADR-0004](./0004-procedural-geometry-over-assets.md)

## Context

@onix_react posted an Interactive WebGL Orb Generator: animated 3D orbs, knobs for colour / motion / shape / glass, copy-the-code. The public Pages URL 404s. I wanted that *lesson* — a glass shell whose interior is state, plus an export — without cloning their catalogue, chrome, or (unavailable) shaders.

A sphere GLB or a scraped preset pack would look borrowed. Hobby Vercel quota is still 0 until ~2026-09-08 20:39 UTC, so the experiment stays local.

## Decision

### 1. Icosahedron + lobe attractors, not a perfect sphere

**Chosen**: Vite + React + R3F + drei. The shell is `IcosahedronGeometry` with three GPU attractors (`lobeDisplace` in `nacreShader.ts`). `MeshPhysicalMaterial` gets the same displace via `onBeforeCompile`. Morph / speed / amplitude are uniforms.

**Rejected**:
- Cloning their sphere + named presets
- A metaball CSG library
- A custom raymarched SDF (harder to read next to the rest of vibes)

**Why**: ADR-0004 already prefers primitives when the code *is* the lesson. A lobe you can pull is the glass-shaped version of the grass tip-bend. The still was a perfect sphere; making the vessel *lobed* keeps the feel without tracing their silhouette.

### 2. Recipes as palettes, film as weaves

**Chosen**: Six invented looks. Each one is a dye pack plus a weave id (`belt | coil | bloom | wake | veil | seed`). The interior is a smaller icosahedron with `ShaderMaterial` + additive blending.

**Rejected**: Their thumbnail catalogue. One shader variant per marketing name from the still.

**Why**: Clean-room. I want “state → look,” not an orb library. Tide Film is a horizontal nacre belt because that is the *pattern* the still teaches, named and mixed by me.

### 3. Snippet export is generated, not theirs

**Chosen**: `buildLoomSnippet()` writes a JSON loom config and a short `nacreFilm()` GLSL helper from the live dyes.

**Rejected**: Fetching or reconstructing their Copy Code payload.

**Why**: The brief asked for a copy affordance. The payload has to be something I can stand behind.

### 4. No Vercel project this pass

**Chosen**: `vercel.json` with `framework: vite`, `outputDirectory: dist`, `ignoreCommand`. No `create_git_project`.

**Rejected**: `vibes-nacre-loom` while quota is 0. Also still no ballance-roll, courtyard, or amber-longeron project. Do not create or redeploy `vibes-procedural-grass-field` / `vibes-audio-gadget-spin` here.

**Why**: Pending Roots already have an order: semicircle production from the framing-fix preview, then scroll-product READY, then audio-gadget first production, then grass, and only then ballance / courtyard / amber-longeron / this orb.

## Consequences

### Positive

1. You can read why the shell swells and why the film changes hue
2. Bundle stays code-only
3. Copy is honest (my JSON, my GLSL)

### Negative

1. Additive film is not a true volume
2. `onBeforeCompile` is brittle across three minors
3. Local QA only until a project exists

## Alternatives considered

- **drei `MeshTransmissionMaterial`** — prettier out of the box, more magic, worse as a teaching artifact next to the capability-brain physical shell.
- **Full-screen raymarch** — closer to some public orb toys, further from the rest of this monorepo.
- **Left thumbnail rail** — would *read* as their generator. I kept chips + sliders on the right like Wind Lea / Lumen Cuff.

## Validation

```bash
cd experiments/nacre-loom
npm install && npm run build
```

Do **not** create a Vercel project or deploy until quota resets (~2026-09-08 20:39 UTC). If I add one later: Root Directory = `experiments/nacre-loom`.

## References

- [onix_react](https://x.com/onix_react/status/2096978661802975464)
- [Three.js MeshPhysicalMaterial](https://threejs.org/docs/#api/en/materials/MeshPhysicalMaterial)

---

**Decision made by**: Johnny Huynh  
**Review status**: Self-approved (solo learning project)
