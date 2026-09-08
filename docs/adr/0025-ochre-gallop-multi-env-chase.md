# ADR-0025: A Multi-Environment Chase Slice

**Date**: 2026-09-08  
**Status**: Accepted  
**Context**: [vibes](../../) monorepo  
**Related**: [ochre-gallop.md](../reverse-engineering/ochre-gallop.md), [ochre-gallop](../../experiments/ochre-gallop/), [ADR-0004](./0004-procedural-geometry-over-assets.md), [ADR-0010](./0010-procedural-audio-spin-mute-default.md), [ADR-0018](./0018-cinder-mere-drive-slice.md)  
**Note**: ADR-0024 is reserved for Fairday Walk in a parallel PR.

## Context

@BrenBuilds posted a chase game that grew from a flat slice into three environments, built with Astra, Three.js, and Blender. The advertised live markets a park-named chase with three run modes. I wanted the *read* — three selectable biomes, one short chase loop each, a runner in front of a follow cam — without cloning their world, animal, HUD, or bundle.

Cinder Mere already covers a **dusk basin + cart**. Brine Causeway is a **coast coupe**. Amber Longeron is a **lane-dodge biplane**. Zephyr Vale is a **sunlit walk**. A park-accurate clone would miss the kitchen-sink lesson and step on someone else’s nouns. Hobby Vercel is at the **25 Git repo-link cap** (`repo_links_exceeded_limit` on Keel Hex). **No Vercel project.**

## Decision

### 1. Three authored highlands, not their itinerary

**Chosen**: Vite + React + TypeScript + R3F + drei + three `~0.170`. Three invented biomes — Sulfur Terrace, Spout Basin, Rim Overlook — each with its own height field, look, and short loop. Soft chase cam behind Ashmane.

**Rejected**:
- Fetching or decompiling the advertised live
- Their park place-names, mode names, or bison brand
- Extending Cinder Mere with a runner
- cannon-es ragdoll or a streamed open world

**Why**: The hypothesis is that three readable height fields + one kinematic stride is enough to teach the *multi-environment chase* pattern. Scale and park accuracy are production problems, not the lesson.

### 2. A procedural ungulate, not their animal

**Chosen**: Ashmane / 灰鬃. Boxes, a shoulder hump, ash mane tufts, sinusoidal gait. MeshPhysicalMaterial. No GLB.

**Rejected**: A photo-real bison mesh. Their runner silhouette. A Kenney toy pack.

**Why**: ADR-0004 — the code *is* the lesson. A licensed animal GLB would still read as “their bison.” Boxes stay inspectable and legally mine.

### 3. Invented loops and chrome

**Chosen**: Ribbon Cut (weave), Plume Break (escape), Shelf Drift (endless). Brand `vibes · ochre gallop` / 赭奔. Thin frosted HUD (Cinder Mere tokens, ochre accent). Mute-default sinter bed.

**Rejected**: Their mode titles, park lockup, NPS marks, or “Make one like this” chrome as a spec.

**Why**: Clean-room. The pattern is “three biomes, one chase each.” The place has to be one I can stand behind.

### 4. An invented lobby, not their menu chrome

**Chosen**: DOM lobby first. Two columns: geometric highland poster + invented tabs / copy / rust **Open** CTA. Enter opens the chase. Esc returns. Poster art is CSS/SVG rings, vents, and a shelf — no tossed figure, no park print.

**Rejected**: Their yellow pills, silk-screen poster, park tab nouns, “Play … →” label, jump/slide legend, or NPS vibe strings.

**Why**: The 2026-09-08 menu still is a *select-and-play* pattern. The lesson is “pick a highland, then stride.” The card has to be one I can stand behind.

### 5. Local dusk HDRI, no new Vercel link

**Chosen**: Qwantani Dusk 2 1k HDRI vendored locally (CC0). `vercel.json` with `framework: vite`, `outputDirectory: dist`, `ignoreCommand`. No `create_git_project`. Future name only: `vibes-ochre-gallop`. Root Directory = `experiments/ochre-gallop`.

**Rejected**: Creating a 26th git-linked Hobby project. A hot HDRI CDN. Reusing Venice Sunset / The Sky Is On Fire / Small Harbour Sunset.

**Why**: Keel Hex already proved the 25-link cap. A new project would fail the same way. Local HDRI keeps the canvas from blanking on a blocked CDN.

## Consequences

### Positive

1. You can read why each highland is a different height function
2. Stride feel lives in one function
3. Distinct from the drive / walk / orbit / dodge siblings
4. Honest local-only Deploy copy — no fake `prj_…`

### Negative

1. A box ungulate is not a filmed animal
2. Arcade kinematics are not hoof contact
3. Local QA only until a repo-link slot exists

## Alternatives considered

- **CC0 animal GLB** — licence can be fine; the silhouette still reads as “borrowed bison.” I kept boxes.
- **One shared heightmap, three skyboxes** — cheaper, but the public hook is *three environments*, not three filters.
- **cannon-es** — right for a later contact lesson; overkill next to ADR-0008’s marble and ADR-0018’s cart.

## Validation

```bash
cd experiments/ochre-gallop
npm install && npm run build
```

Do **not** create a Vercel project. If a slot is freed later: Root Directory = `experiments/ochre-gallop`.

## References

- [Bren](https://x.com/BrenBuilds/status/2097221820743139824)
- Advertised live — pitch / feel only; not fetched into the repo
- [Poly Haven — Qwantani Dusk 2](https://polyhaven.com/a/qwantani_dusk_2)
- [25-link incident](../incidents/2026-09-08-vercel-repo-link-limit-25.md)

---

**Decision made by**: Johnny Huynh  
**Review status**: Self-approved (solo learning project)
