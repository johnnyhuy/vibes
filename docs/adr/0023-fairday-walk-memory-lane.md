# ADR-0023: A Soft Outdoor Memory Walk, Invented Residential Lane

**Date**: 2026-09-08  
**Status**: Accepted  
**Context**: [vibes](../../) monorepo  
**Related**: [fairday-walk.md](../reverse-engineering/fairday-walk.md), [fairday-walk](../../experiments/fairday-walk/), [ADR-0005](./0005-scroll-driven-product-hero.md), [ADR-0020](./0020-alba-forum-educational-landmark-scroll.md), [ADR-0004](./0004-procedural-geometry-over-assets.md)

## Context

@anyumeng28 posted that GPT-6 Astra’s modelling only feels real in use: Three.js turned pictures into a 3D version, about half a Plus weekly quota, Blender refinement mentioned, old photos into a 3D webpage you can walk again. The live they linked is a 晴天 · 风里的记忆 title. I wanted the *lesson* — photo→3D feel, a breezy outdoor memory you scroll then orbit — without scraping their site, cloning their title, or inventing another chalk forum.

Alba Forum (ADR-0020) already maps window scroll onto landmark poses. Chinese-courtyard already orbits a siheyuan. Zephyr Vale already wanders reeds. Hobby Vercel quota is still 0 until ~2026-09-08 20:39 UTC, so the experiment stays local. **No Vercel project.**

## Decision

### 1. Scroll-driven camera along an invented lane

**Chosen**: Vite + React + R3F + drei + three `~0.170`. Native window scroll (0→1) lerps authored camera / look-at poses across eight stops. `useFrame` + `MathUtils.damp`. Fixed canvas, tall spacer page — same family as ADR-0005 / ADR-0020, not drei `ScrollControls`.

**Rejected**:
- Scraping the 晴天 live source or assets
- Reusing 晴天 / Qing Tian / anyumeng nouns
- Extending Alba Forum with a white laundry arch
- Another dusk harbour / coast drive

**Why**: The public hook is “walk a memory, then orbit the place in front of you.” A chalk avenue and a pagoda lift already exist. The hypothesis is that pose lerp + Explore is enough, on a *residential* folio.

### 2. Mid-fi procedural PBR, local HDRI

**Chosen**: Instanced roof tiles, recessed windows, wind-hung laundry (`onBeforeCompile` on `MeshStandardMaterial`), lathed well, tube bicycles, pigeons, striped awning. Canvas plaster / cobble / tile / wood maps. Vendored Poly Haven Kloofendal 48d partly-cloudy sky HDRI under Suspense. Soft directional shadows + contact shadow.

**Rejected**: Their photo-derived meshes. Kenney toy houses as the hero. Runtime CDN Environment files.

**Why**: ADR-0004 plus the hi-fi mesh note — density and lighting, not a downloaded loft. A CDN miss must not blank the canvas.

### 3. Invented names and chrome

**Chosen**: Fairday Walk / 晴巷 · 风里的册页. Brand `vibes · fairday walk`. Eight names I wrote (Laundry Court … Fig Alley). Frosted light HUD: lockup, stop counter, Explore, serif place chip, first-person caption.

**Rejected**: Their title, place nouns, domain, logo, or chrome as a spec.

**Why**: Clean-room. The pattern is “soft outdoor memory walk.” The lane has to be one I can stand behind.

### 4. Explore is an orbit override, not a second app

**Chosen**: `OrbitControls` enabled only in Explore. Canvas `pointer-events` flip on. Wheel is captured so zoom does not steal the page. Leave / Esc damps back to the scroll pose.

**Rejected**: Always-on orbit (that is japanese-tower). A separate route per place.

**Why**: You should feel the difference between walking the folio and inspecting a stop.

### 5. No Vercel project this pass

**Chosen**: `vercel.json` with `framework: vite`, `outputDirectory: dist`, `ignoreCommand`. No `create_git_project`. Post-quota name, if I add one: `vibes-fairday-walk`. Root Directory = `experiments/fairday-walk`.

**Rejected**: Creating a project while quota is 0.

**Why**: Pending Roots already have an order. A new Hobby project would only add ignore-step noise.

## Consequences

### Positive

1. Scroll mapping stays inspectable in one itinerary file
2. Fair-day residential read is distinct from chalk / kiln / harbour siblings
3. Explore is a mode, not a second camera stack
4. Local HDRI keeps the canvas honest offline

### Negative

1. Procedural plaster is not photogrammetry from someone’s old photo
2. Eight stops are not a whole neighbourhood
3. Local QA only until a project exists

## Alternatives considered

- **Per-stop group swap on a single courtyard** — enough for the lesson, weaker “walk the lane” read. I kept the street and still frame one stop at a time.
- **Licensed house GLB** — allowed if attributed locally. I wanted the tile / cloth / well lesson in code.
- **drei ScrollControls** — rejected in ADR-0005; the overlay still steals the wheel.

## Validation

```bash
cd experiments/fairday-walk
npm install && npm run build
```

Do **not** create a Vercel project or deploy until quota resets (~2026-09-08 20:39 UTC). If I add one later: Root Directory = `experiments/fairday-walk`.

## References

- [安与梦AIGC / @anyumeng28](https://x.com/anyumeng28/status/2097175519825383852)
- [Public live](https://qingtian-memory-3d.anyumeng28.chatgpt.site) — pitch / feel only

---

**Decision made by**: Johnny Huynh  
**Review status**: Self-approved (solo learning project)
