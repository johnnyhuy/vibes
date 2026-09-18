# Nimbus Path — ballance-roll

I built this after reading [@fayazara](https://x.com/fayazara/status/2096997505397584041). Astra had rebuilt a childhood Atari *Ballance*-like marble for the web — three materials, three courses, an ocean of clouds. I studied the public post, the video thumb, and the live-demo *read*. I did **not** copy their course meshes, chrome, assets, or branding. This is my educational demo — **vibes · nimbus path**.

## What I built

- **One procedural course** — *Haze Walk*. Pads, a narrow beam, a descending ramp, a bronze hoop. Boxes and cylinders. No .glb.
- **A rolling marble** — WASD / arrows (or the on-screen pad). Camera follows. `R` puts you back on the start stone.
- **Three feels** — wood (grippy), stone (planted), metal (slides). Keys `1` / `2` / `3`. Same course, different contact materials. See [ADR-0008](../../docs/adr/0008-cannon-es-marble-controller.md).
- **Ocean of clouds** — pink / lavender dome, a soft sea plane, drifting puffs. Mood from the thumb, not a pixel clone.
- **Three haze motes** — optional pickups so the run has a count that is mine, not their `0/3` chip.

You start on the first pad looking down the path. Stay on the stone. Fall into the haze and reset.

## Stack

Vite + React 19 + R3F + drei + three `~0.170` + cannon-es `0.20`.

## Run

```bash
npm install
npm run dev
```

[http://localhost:5173](http://localhost:5173)

```bash
npm run build
```

## Deploy

Linked Vercel project `vibes-ballance-roll` / `prj_BSAzHRX6jgMZOx10fPYUUXXrKrmt`. Dashboard **Root Directory** is `experiments/ballance-roll`. `vercel.json` carries the usual Vite fields plus `ignoreCommand`. It cannot set Root Directory. No new projects (Hobby 25-link cap).

## Related

- [docs/reverse-engineering/ballance-roll-threejs.md](../../docs/reverse-engineering/ballance-roll-threejs.md)
- [docs/adr/0008-cannon-es-marble-controller.md](../../docs/adr/0008-cannon-es-marble-controller.md)
- Sibling physics playground: [web-physics](../web-physics/) (vanilla Three + cannon-es)

---

**Status**: Production had never left a READY build for this Root; Vite ^6.4.3 + this Root-touch force `ignoreCommand` to rebuild `vibes-ballance-roll`  
**Last updated**: 2026-09-18 ~10:33am AEST (ballance-roll-only Vite security bump)  
**Deploy**: Linked `vibes-ballance-roll` / `prj_BSAzHRX6jgMZOx10fPYUUXXrKrmt`. Root Directory `experiments/ballance-roll`. No new projects (Hobby 25-link cap).  
Built by Johnny Huynh • This is my kitchen sink • Research and education only, not production code
