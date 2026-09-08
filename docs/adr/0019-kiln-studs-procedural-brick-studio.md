# ADR-0019: A Procedural Stud-Brick Studio, Invented Set

**Date**: 2026-09-08  
**Status**: Accepted  
**Context**: [vibes](../../) monorepo  
**Related**: [kiln-studs.md](../reverse-engineering/kiln-studs.md), [kiln-studs](../../experiments/kiln-studs/), [ADR-0004](./0004-procedural-geometry-over-assets.md), [ADR-0002](./0002-explode-r3f-and-real-glb.md)

## Context

@antonklingspor posted a GPT-6 Astra + Three.js product: an idea or image becomes a custom brick set, with studio renders, an interactive model, build instructions, and a link to buy the bricks. I wanted the *lesson* — authored parts + studio light + a stepper — without scraping SetCreator, cloning a catalog, or shipping commerce.

A pasted brick API or their bridge set would *read* as a fork. Hobby Vercel quota is still 0 until ~2026-09-08 20:39 UTC, so the experiment stays local. **No Vercel project.** Cinder Mere already took ADR-0018 on `main`.

## Decision

### 1. Procedural studs, not a catalog GLB

**Chosen**: Vite + React + R3F + drei + three `~0.170`, same stack as Cinder Mere / Foil Tilt Card. `catalog.ts` lists forty-two bricks. Bodies are rounded boxes or cylinders; studs are shaded cylinders. MeshPhysical + three vendored Poly Haven 1k HDRIs (CC0) behind a nested `Suspense`, so a slow env fetch cannot blank the canvas.

**Rejected**:
- Scraping SetCreator or a brick-link catalog
- A Kenney / marketplace brick kit
- Flat unstudded boxes
- A CC-BY display-stand GLB (optional; a procedural pedestal is enough)

**Why**: ADR-0004 already prefers primitives when the code *is* the lesson. Studs have to be denser than boxes or the set reads as mush.

### 2. An invented hare, not their demo sets

**Chosen**: Ember Hare · 8 / 烬兔. Sitting hare on a kiln plinth, cream chest, ember ear-tips, a small pot. Brand `vibes · kiln studs` / 窑钉.

**Rejected**: Their bridge / city / vehicle reads. LEGO nouns. A kiln-cart remake of Cinder Mere’s Soot Runner. Another fox (Foil Tilt Card / Moon Dumpling already have one). Another tower.

**Why**: Clean-room. The pattern is “a set of someone.” The someone has to be mine, and distinct from the dusk drive.

### 3. Idea → palette, not an AI call

**Chosen**: Three local prompts (Dusk hare, Clay slip, Pewter ash). They only swap five colour keys. No fetch, no provider.

**Rejected**: Calling an image or LLM API. An upload dropzone that pretends to generate a new mesh.

**Why**: The public pitch is “idea in.” The kitchen-sink lesson is that a remap is enough to *show* the hook without spending tokens or leaking a scrape.

### 4. Step / explode on the same list

**Chosen**: Eight named marks. Filter by `step`. Explode offsets from the set centroid (same family as explode-assembly, original numbers). Assemble puts every brick back.

**Rejected**: Their instruction chrome. A PDF. A 2,000-piece catalog.

**Why**: You can read why the ears arrive after the head.

### 5. No Vercel project this pass

**Chosen**: `vercel.json` with `framework: vite`, `outputDirectory: dist`, `ignoreCommand`. No `create_git_project`. README and this ADR say **local-only**. Post-quota name, if I add one: `vibes-kiln-studs`.

**Rejected**: Creating a project while quota is 0. Also still no new project for cinder-mere or the older local-only stack.

**Why**: Pending Roots already have an order. A new Hobby project would only add ignore-step noise.

## Consequences

### Positive

1. You can read the parts list and the stepper in one file
2. Bundle stays code-only — no catalog, no shop
3. Branding cannot be mistaken for SetCreator or LEGO

### Negative

1. Forty-two bricks are not an official 1,000-piece skyline
2. Canvas-rounded plastic is not injection-mould ABS
3. Local QA only until a project exists

## Alternatives considered

- **InstancedMesh for every stud** — fewer draw calls; harder to highlight a step. Forty-two parents are fine.
- **CC-BY stand GLB** — allowed if licensed in ATTRIBUTION. A torus + two cylinders already read as a pedestal.
- **Shipping a buy-link “for realism”** — out of scope, and it would *read* as their product.

## Validation

```bash
cd experiments/kiln-studs
npm install && npm run build
```

Do **not** create a Vercel project or deploy until quota resets (~2026-09-08 20:39 UTC). If I add one later: Root Directory = `experiments/kiln-studs`.

## References

- [Anton Klingspor](https://x.com/antonklingspor/status/2097062589268136439)
- [Public marketing URL](https://setcreator.com) — pitch only; I did not copy source

---

**Decision made by**: Johnny Huynh  
**Review status**: Self-approved (solo learning project)
