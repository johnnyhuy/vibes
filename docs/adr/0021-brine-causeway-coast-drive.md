# ADR-0021: A Compact Coast-Highway Drive Slice

**Date**: 2026-09-08  
**Status**: Accepted  
**Context**: [vibes](../../) monorepo  
**Related**: [brine-causeway.md](../reverse-engineering/brine-causeway.md), [brine-causeway](../../experiments/brine-causeway/), [ADR-0004](./0004-procedural-geometry-over-assets.md), [ADR-0010](./0010-procedural-audio-spin-mute-default.md), [ADR-0018](./0018-cinder-mere-drive-slice.md)

## Context

@arianlooterking posted a browser NFS-ish coast run built overnight with Three.js + Astra on Mindblown. The live they linked markets a bay-coast golden-hour drive. I wanted the *read* — a coast highway, a coupe, a red suspension bridge, a start gate — without cloning their world, vehicle, HUD, or bundle.

Cinder Mere (ADR-0018) already covers a **dusk basin + kiln cart**. Zephyr Vale is a sunlit walker. Amber Longeron is a lane-dodge biplane. A full open-world coast clone would miss the kitchen-sink lesson and blow the budget. Hobby Vercel quota is still 0 until ~2026-09-08 20:39 UTC, so the experiment stays local. **No Vercel project.**

## Decision

### 1. A compact causeway loop, not an open-world clone

**Chosen**: Vite + React + R3F + drei + three `~0.170`. One authored two-lane loop (out-and-back + hairpins) ~140 units long. Ocean west, pine bench east, one invented bridge north. Soft chase cam after a start gate.

**Rejected**:
- Scraping the APEX Coast Run / Mindblown bundle
- A streamed open world or their road spline
- Extending Cinder Mere with a sports car
- cannon-es four-wheel suspension

**Why**: The hypothesis is that a readable strip + arcade coupe + one landmark is enough to teach the *coast drive* pattern. Scale is a production problem, not the lesson.

### 2. An invented coupe, not their GT

**Chosen**: Iodine Wedge / 碘楔. Procedural mid-engine coupe, salt-black clearcoat, copper stripe. Poly Haven had no sports-coupe GLB at study time.

**Rejected**: Their vehicle name / silhouette. A marketplace Ferrari-class GLB. Extending the Cinder Mere welding cart.

**Why**: A real PBR GT would read as their car. Boxes with physical materials stay inspectable (ADR-0004) and legally mine.

### 3. Invented names and chrome

**Chosen**: Brine Causeway / 盐桥. Salt Reach, Vermilion Span, Kelp Cut. Thin editorial HUD (brand, one atmosphere chip, Cut the brine). Brand `vibes · brine causeway`. No likes rail, no “Make one like this”, no third-party lockup.

**Rejected**: Their club title, coast chip labels, CTA copy, or Ferrari nouns as a spec.

**Why**: Clean-room. The pattern is “drive a coast highway.” The place has to be one I can stand behind.

### 4. Two (plus dusk) looks, mute-default surf

**Chosen**: Late sun (default), after rain, dusk tide. Band-passed wind + low surf, mute on first load (ADR-0010). Optional pretty / performance toggle.

**Rejected**: Their weather clock as a clone. Autoplaying music. A hot HDRI CDN.

**Why**: Rainy / golden visuals are the public pitch. Two authored looks plus dusk teach the same idea. Audio stays opt-in. The Sky Is On Fire 1k HDRI is vendored locally (CC0, distinct from Cinder Mere’s Venice Sunset).

### 5. No Vercel project this pass

**Chosen**: `vercel.json` with `framework: vite`, `outputDirectory: dist`, `ignoreCommand`. No `create_git_project`. Post-quota name, if I add one: `vibes-brine-causeway`. Root Directory = `experiments/brine-causeway`.

**Rejected**: Creating a project while quota is 0. Also still no new project for the older local-only stack.

**Why**: Pending Roots already have an order: semicircle, scroll-product, audio-gadget, grass, then the local-only stack.

## Consequences

### Positive

1. You can read why the strip is two-lane and the bridge is one landmark
2. Vehicle feel lives in one function
3. Distinct from Cinder Mere: coast + coupe, not basin + cart
4. HDRI is local; the canvas does not blank on a blocked CDN

### Negative

1. A box coupe is not a photographed GT
2. Arcade path samples are not tyre contact
3. Local QA only until a project exists

## Alternatives considered

- **Kenney / itch CC0 toy car** — licence is fine; the silhouette is a toy, not a coast-run read.
- **cannon-es raycast vehicle** — right for a later physics lesson; overkill next to ADR-0008’s marble and ADR-0018’s cart.
- **Always-on drive** — their live *read* has a start CTA. I kept the gate so the first frame is the wedge and the span.

## Validation

```bash
cd experiments/brine-causeway
npm install && npm run build
```

Do **not** create a Vercel project or deploy until quota resets (~2026-09-08 20:39 UTC). If I add one later: Root Directory = `experiments/brine-causeway`.

## References

- [Arian](https://x.com/arianlooterking/status/2097080866526704056)
- [Public live](https://apex-coast-run.mindblown.ai/) — pitch / feel only
- [Poly Haven — The Sky Is On Fire](https://polyhaven.com/a/the_sky_is_on_fire)

---

**Decision made by**: Johnny Huynh  
**Review status**: Self-approved (solo learning project)
