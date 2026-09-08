# ADR-0020: An Educational Landmark Scroll, Invented Chalk City

**Date**: 2026-09-08  
**Status**: Accepted  
**Context**: [vibes](../../) monorepo  
**Related**: [alba-forum.md](../reverse-engineering/alba-forum.md), [alba-forum](../../experiments/alba-forum/), [ADR-0005](./0005-scroll-driven-product-hero.md), [ADR-0004](./0004-procedural-geometry-over-assets.md), [ADR-0019](./0019-kiln-studs-procedural-brick-studio.md)

## Context

@levinstanley posted an educational WebGL pitch: scroll through landmarks, Explore to orbit and zoom, white as the foundation. The live they linked is a Rome-in-white title. I wanted the *lesson* — scroll framing + a per-stop orbit — without scraping their site, cloning a Rome itinerary, or inventing another dusk drive.

Scroll-product-showcase (ADR-0005) already maps window scroll onto a single bottle. Japanese-tower already orbits one pagoda. Kiln Studs (ADR-0019) is a dark brick studio. Cinder Mere is a dusk basin. Hobby Vercel quota is still 0 until ~2026-09-08 20:39 UTC, so the experiment stays local. **No Vercel project.**

## Decision

### 1. Scroll-driven camera along an invented avenue

**Chosen**: Vite + React + R3F + drei + three `~0.170`. Native window scroll (0→1) lerps authored camera / look-at poses across ten stops. `useFrame` + `MathUtils.damp`. Fixed canvas, tall spacer page — same family as ADR-0005, not drei `ScrollControls`.

**Rejected**:
- Scraping the Rome-in-white source or assets
- A 1:1 Rome landmark list
- Extending scroll-product-showcase with a bottle-shaped building
- Another coast / kiln drive

**Why**: The public hook is “scroll to travel, then orbit the thing in front of you.” A bottle roll and a pagoda lift already exist. The hypothesis is that pose lerp + Explore is enough.

### 2. Procedural chalk architecture, not their meshes

**Chosen**: Composed boxes, cylinders, torus-arches, columns, a half-sphere dome. Soft directional shadows + contact shadow. Off-white / chalk materials. No GLB. No runtime CDN.

**Rejected**: Their GLBs. Kenney toy buildings. A Poly Haven city pack for this pass.

**Why**: ADR-0004 — the code *is* the lesson. Density comes from cornices, bays, and rows, not a downloaded loft.

### 3. Invented names and chrome

**Chosen**: Alba Forum / 白坛. Brand `vibes · alba forum`. Ten names I wrote (Ivory Arch … Cloud Rotunda). Frosted HUD: lockup, stop counter, Explore, serif landmark chip, first-person caption.

**Rejected**: Their title, landmark nouns, domain, logo, or Explore chrome as a spec.

**Why**: Clean-room. The pattern is “educational landmark scroll.” The city has to be one I can stand behind.

### 4. Explore is an orbit override, not a second app

**Chosen**: `OrbitControls` enabled only in Explore. Canvas `pointer-events` flip on. Wheel is captured so zoom does not steal the page. Leave / Esc damps back to the scroll pose.

**Rejected**: Always-on orbit (that is japanese-tower). A separate route per landmark.

**Why**: You should feel the difference between travelling and inspecting.

### 5. No Vercel project this pass

**Chosen**: `vercel.json` with `framework: vite`, `outputDirectory: dist`, `ignoreCommand`. No `create_git_project`. Post-quota name, if I add one: `vibes-alba-forum`. Root Directory = `experiments/alba-forum`.

**Rejected**: Creating a project while quota is 0.

**Why**: Pending Roots already have an order. A new Hobby project would only add ignore-step noise.

## Consequences

### Positive

1. Scroll mapping stays inspectable in one itinerary file
2. White-foundation read is distinct from kiln / cinder / bottle siblings
3. Explore is a mode, not a second camera stack

### Negative

1. Primitive masonry is not photogrammetry
2. Ten stops are not a city-scale tour
3. Local QA only until a project exists

## Alternatives considered

- **Per-stop group swap on a single plinth** — enough for the lesson, weaker “travel” read. I kept the avenue and still frame one stop at a time.
- **Vendored Poly Haven plaster textures** — allowed if attributed locally. Colour + roughness already read as chalk.
- **drei ScrollControls** — rejected in ADR-0005; the overlay still steals the wheel.

## Validation

```bash
cd experiments/alba-forum
npm install && npm run build
```

Do **not** create a Vercel project or deploy until quota resets (~2026-09-08 20:39 UTC). If I add one later: Root Directory = `experiments/alba-forum`.

## References

- [Levin Stanley](https://x.com/levinstanley/status/2097083437610074117)
- [Public live](https://rome.levinstanley.chatgpt.site/) — pitch / feel only

---

**Decision made by**: Johnny Huynh  
**Review status**: Self-approved (solo learning project)
