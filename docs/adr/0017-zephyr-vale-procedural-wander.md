# ADR-0017: A Procedural Peaceful Wander Slice

**Date**: 2026-09-08  
**Status**: Accepted  
**Context**: [vibes](../../) monorepo  
**Related**: [zephyr-vale.md](../reverse-engineering/zephyr-vale.md), [zephyr-vale](../../experiments/zephyr-vale/), [ADR-0004](./0004-procedural-geometry-over-assets.md), [ADR-0010](./0010-procedural-audio-spin-mute-default.md), [ADR-0011](./0011-procedural-grass-instancing.md), [ADR-0014](./0014-heartwood-warden-procedural-showcase.md)

## Context

@TusharXo posted a live Crayon wander — GPT-6 Astra + Three.js + @usecrayon — titled in the hill-climb brief as “Where the Wind Wanders.” The public stills are a sunlit valley: knoll, tree, water, islands, a small walker, a floating companion. I wanted that *feeling* without copying their map, HUD, brand, or play bundle.

Heartwood Warden already covers a moonlit walk with casts. Wind Lea is an orbit meadow. Chinese Courtyard is a seasonal inspect. Moon Dumpling Relay (ADR-0015) is a party table. Foil Tilt Card took ADR-0016 on `main`. Cloning any of those folders would teach the wrong place. Hobby Vercel quota is still 0 until ~2026-09-08 20:39 UTC, so the experiment stays local.

## Decision

### 1. A daylight wander, not another glade or meadow inspect

**Chosen**: Vite + React + R3F + drei + three `~0.170`. Third-person WASD, click-to-look, eight breeze slips, a height-mapped vale, mute-default wind.

**Rejected**:
- Extending Heartwood Warden with a day palette
- Orbit-only like Wind Lea / North Court
- Scraping the Crayon play bundle
- A combat or timer loop

**Why**: ADR-0004 already prefers primitives when the code is the lesson. The viral object is a *quiet valley you walk*. A warden-with-casts or a conveyor would miss that.

### 2. Invented names and landmarks

**Chosen**: Zephyr Vale / 风笺谷. Reed Walker, Bellkite, breeze slips. Listening oak, log seat, ribbon cairn, reed bothy, waterwheel, coracle, ford stones.

**Rejected**: Their title, yellow-dress silhouette, purple companion, park bench, post-and-rail fence, moss cottage, windmill, sailboat.

**Why**: Clean-room. The pattern is “sunlit wander + notes on the wind.” The place has to be one I can stand behind.

### 3. Height function + cheap grass, no terrain GLB

**Chosen**: One `heightAt(x, z)` shared by the mesh, the walker, and the landmarks. A few thousand reed tufts with a short wind shader — not Wind Lea’s crossed-blade product.

**Rejected**: A heightmap texture from their still. A turf GLB. Cannon-es for walking.

**Why**: You can read why the knoll is high and the ford is shallow. Physics would fight the kitchen-sink budget.

### 4. Mute-default wind bed

**Chosen**: Same rule as Lumen Cuff (ADR-0010). Filtered noise + two sines. Toggle starts **Muted**. A short triangle cue when a slip is gathered.

**Rejected**: Autoplaying music. Sampling their (unknown) soundtrack.

**Why**: Browsers block autoplay; a vale should be allowed to stay quiet.

### 5. No Vercel project this pass

**Chosen**: `vercel.json` with `framework: vite`, `outputDirectory: dist`, `ignoreCommand`. No `create_git_project`. Post-quota project name, if I add one, follows `vibes-<experiment>` → `vibes-zephyr-vale`.

**Rejected**: Creating `vibes-zephyr-vale` while quota is 0. Also still no ballance / courtyard / amber / nacre / heartwood / dumpling / foil project on this PR.

**Why**: Pending Roots already have an order: semicircle, scroll-product, audio-gadget, grass, then the local-only stack.

## Consequences

### Positive

1. You can read the height function and the gather radius
2. Bundle stays code-only
3. Distinct from Heartwood Warden, Wind Lea, North Court, Moon Dumpling Relay, and Foil Tilt Card
4. Audio stays opt-in

### Negative

1. Primitives are not a painted Ghibli still
2. Tuft grass is flatter than Wind Lea
3. Bloom + a large terrain can still dip on a weak GPU
4. Local QA only until a project exists

## Alternatives considered

- **Orbit-only vale** — prettier first frame, no wander lesson.
- **Reuse Heartwood Warden controller in-place** — would keep the moonlit combat-adjacent read.
- **Play their Crayon URL inside an iframe** — not clean-room, and it teaches nothing.

## Validation

```bash
cd experiments/zephyr-vale
npm install && npm run build
```

Do **not** create a Vercel project or deploy until quota resets (~2026-09-08 20:39 UTC). If I add one later: name `vibes-zephyr-vale`, Root Directory = `experiments/zephyr-vale`.

## References

- [TusharXo](https://x.com/TusharXo/status/2096741535891251261)
- [Crayon play URL](https://app.usecrayon.ai/play/a9a3c165-74b3-4ff6-9588-ad97f829ddb5) — marketing / play host only
- [ADR-0004](./0004-procedural-geometry-over-assets.md)

---

**Decision made by**: Johnny Huynh  
**Review status**: Self-approved (solo learning project)
