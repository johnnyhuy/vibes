# ADR-0015: A Procedural Party-Game Slice, Invented Theme

**Date**: 2026-09-08  
**Status**: Accepted  
**Context**: [vibes](../../) monorepo  
**Related**: [moon-dumpling-relay.md](../reverse-engineering/moon-dumpling-relay.md), [moon-dumpling-relay](../../experiments/moon-dumpling-relay/), [ADR-0004](./0004-procedural-geometry-over-assets.md), [ADR-0010](./0010-procedural-audio-spin-mute-default.md)

## Context

@clydejuniordev posted a conveyor party game built with GPT Astra + Three.js: pick a diner, spin a ring of plates, out-eat AI guests, hazard + boost pickups, everything procedural. The MIT README spells out a much larger product (eight characters, cosmetics, Windows zip, Pages workflow). I wanted the *lesson* — a readable loop around a moving table — without forking their source, cats, sushi brand, or Pokémon Stadium framing.

A GLB restaurant or a pasted `Game.js` would look borrowed. Hobby Vercel quota is still 0 until ~2026-09-08 20:39 UTC, so the experiment stays local. **No Vercel project.** Heartwood Warden already took ADR-0014 on `main`.

## Decision

### 1. Invented moon-gate table, not their restaurant

**Chosen**: Vite + React + R3F + drei + three `~0.170`, same stack as Nacre Loom / Amber Longeron / Heartwood Warden. The table is a moon-gate torus on a dark wood disc. Plates live on a spinning rail. Diners walk an outer ring. All primitives.

**Rejected**:
- Cloning their pastel sushi restaurant, noren, or raised 3D lettering
- Loading a dining-room GLB
- A full 8-character select with unlock cosmetics

**Why**: ADR-0004 already prefers primitives when the code *is* the lesson. A moon ring you can read in `RelayWorld.tsx` teaches the conveyor pattern without tracing their silhouette.

### 2. Smaller educational slice

**Chosen**: Five invented diners (fox / raccoon / owl / badger / hare). One 55-second round. Two AI styles (`orbit` nearest, `savour` prefers moon coins). Eat + dash only.

**Rejected**: Their eight cats, three AI personalities, house-specials timer, cosmetics economy, portable Windows zip, GitHub Pages workflow, and their test list copied verbatim.

**Why**: The brief asked for a playable slice, not a product clone. Two rivals still prove the loop.

### 3. Invented hazard / boost names

**Chosen**: Chili slick flips steering for four seconds. Tea-leaf sprig multiplies walk speed. Fold-chain is same-kind dumplings within 3.6s for a small bonus I invented.

**Rejected**: Wasabi / catnip strings, their exact spawn percentages, their 1.1s paw animation, their ×2.5 cap.

**Why**: Clean-room. The *pattern* is hazard-vs-boost on a shared conveyor. The names and numbers have to be mine.

### 4. Mute-default Web Audio, frosted HUD

**Chosen**: Same 2026-09-08 glass topbar / desk as Nacre Loom. Brand `vibes · moon dumpling relay`. Audio starts muted (ADR-0010). Optional pentatonic bed plus five cues.

**Rejected**: Their pastel HUD, touch joystick, performance panel, and unmuted music bed.

**Why**: The kitchen-sink already has a HUD language. I am not inventing a second chrome family for a one-off party game.

### 5. No Vercel project this pass

**Chosen**: `vercel.json` with `framework: vite`, `outputDirectory: dist`, `ignoreCommand`. No `create_git_project`. README and this ADR say **local-only**.

**Rejected**: `vibes-moon-dumpling-relay` while quota is 0. Also still no new project for ballance-roll, courtyard, amber-longeron, nacre-loom, or heartwood-warden.

**Why**: Pending Roots already have an order. A new Hobby project would only add ignore-step noise.

## Consequences

### Positive

1. You can read why the ring spins and why a bite scores
2. Bundle stays code-only
3. Branding cannot be mistaken for the upstream cats / sushi lockup

### Negative

1. Two AI guests are dumber than a full utility scorer
2. No gamepad / virtual stick
3. Local QA only until a project exists

## Alternatives considered

- **Vanilla Three.js `Game.js`** — closer to the public README’s file tree, further from the recent React experiments I want this to sit next to.
- **cannon-es plates** — overkill for a kinematic rail. Amber Longeron already taught feel without a physics wrapper.
- **Shipping their cosmetics / zip / Pages** — out of scope, and it would *read* as a fork.

## Validation

```bash
cd experiments/moon-dumpling-relay
npm install && npm run build
```

Do **not** create a Vercel project or deploy until quota resets (~2026-09-08 20:39 UTC). If I add one later: Root Directory = `experiments/moon-dumpling-relay`.

## References

- [clydejuniordev](https://x.com/clydejuniordev/status/2097086770576011601)
- [sushi-paws-conveyor-clash README](https://github.com/clydejuniorscripts/sushi-paws-conveyor-clash) — claims only; I did not copy source

---

**Decision made by**: Johnny Huynh  
**Review status**: Self-approved (solo learning project)
