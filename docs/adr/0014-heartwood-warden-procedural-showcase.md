# ADR-0014: Playable Procedural Showcase over a Mesh-Provider Client

**Date**: 2026-09-07  
**Status**: Accepted  
**Context**: [vibes](../../) monorepo  
**Related**: [heartwood-warden.md](../reverse-engineering/heartwood-warden.md), [heartwood-warden](../../experiments/heartwood-warden/), [ADR-0004](./0004-procedural-geometry-over-assets.md), [image-to-3d](../../experiments/image-to-3d/)

## Context

@NickDevFE posted a monster-tree showcase. Full workflow quote: **Image → Hyper3D → img2threejs → GPT-6 Astra → Interactive Three.js**. The live route markets “Groot — Heart of the Forest.” The public lesson is larger than a mesh dump: 3D generation is the **beginning**, not the end. You still build a game / product / experience around the asset, and you keep the Three.js editable.

I already have `experiments/image-to-3d/` as a mesh-provider notebook (Meshy / Tripo / Rodin). Cloning that folder into another client would teach the wrong thing. Cloning Groot or pasting their factory would fail the clean-room rule. Hobby Vercel quota is still 0 until ~2026-09-08 20:39 UTC, so the experiment stays local.

## Decision

### 1. A playable glade, not another provider client

**Chosen**: Vite + React + R3F + drei + three `~0.170`. Third-person walk, sprint, ten invented casts, lantern spirits, moonlit woodland. The code *is* the reconstruction.

**Rejected**:
- Extending `experiments/image-to-3d/`
- Loading a Hyper3D / marketplace Groot GLB
- Scraping the img2threejs showcase bundle
- A static orbit-only bust

**Why**: ADR-0004 already prefers primitives when the code is the lesson. The viral object is a *walkable woodland character*, not an API table. A notebook cannot teach gait, follow-cam, or layered VFX.

### 2. An invented guardian, not their hero

**Chosen**: Heartwood Warden / 心木守. Carved mask, bark plates, amber resin well, crescent of bare twigs, moss only in the seams.

**Rejected**: Groot silhouette, their exhibit title, leafy-crown humanoid, their cast names.

**Why**: Clean-room. The pattern is “living wood that walks and casts.” The character has to be one I can stand behind.

### 3. Procedural animation and VFX, no imported rig

**Chosen**: Sine gait on limb groups. Casts are short-lived meshes (rings, spores, vines, a moon shaft). Spirits are seven orbs; three may light. Snippet export is generated from stance + last cast.

**Rejected**: A Mixamo / Hyper3D clip pack. Their VFX prompt output. A physics engine.

**Why**: The post’s pipeline does rigging and VFX for you. My lesson is the opposite: show the cheap version in the repo. Nick also said the showcase is unoptimised on purpose; I still keep a laptop budget.

### 4. Frosted HUD, not their gallery chrome

**Chosen**: 2026-09-08 sweep — dark woodland, pale glass, brand `vibes · heartwood warden`, chips for casts, optional snippet.

**Rejected**: Thumbnail rail, “Open full viewer”, their wordmark.

**Why**: Same reason Nacre Loom kept chips instead of a preset grid.

### 5. No Vercel project this pass

**Chosen**: `vercel.json` with `framework: vite`, `outputDirectory: dist`, `ignoreCommand`. No `create_git_project`.

**Rejected**: `vibes-heartwood-warden` while quota is 0. Also still no ballance-roll, courtyard, amber-longeron, or nacre-loom project. Do not create or redeploy `vibes-procedural-grass-field` / `vibes-audio-gadget-spin` here.

**Why**: Pending Roots already have an order: semicircle production from the framing-fix preview, then scroll-product READY, then audio-gadget first production, then grass, and only then ballance / courtyard / amber-longeron / nacre-loom / this glade.

## Consequences

### Positive

1. You can read why a limb swings and why a pulse ring grows
2. Bundle stays code-only
3. The provider notebook stays a notebook
4. Copy is honest (my JSON, my helper)

### Negative

1. Primitives are not a Hyper3D skin
2. Sine gait is not a authored clip
3. Bloom + several lights can still dip on a weak GPU
4. Local QA only until a project exists

## Alternatives considered

- **GLB character + Mixamo** — prettier walk, opaque lesson, easy to look stolen.
- **Another image-to-3d client** — duplicates the notebook; does not teach playable reconstruction.
- **Full img2threejs install in-repo** — would not be clean-room, and I do not need their pipeline to ship a glade.

## Validation

```bash
cd experiments/heartwood-warden
npm install && npm run build
```

Do **not** create a Vercel project or deploy until quota resets (~2026-09-08 20:39 UTC). If I add one later: Root Directory = `experiments/heartwood-warden`.

## References

- [NickDevFE](https://x.com/NickDevFE/status/2096946586781692297)
- [img2threejs monster-tree](https://img2threejs.io/#/x/monster-tree) — marketing URL only
- [ADR-0004](./0004-procedural-geometry-over-assets.md)

---

**Decision made by**: Johnny Huynh  
**Review status**: Self-approved (solo learning project)
