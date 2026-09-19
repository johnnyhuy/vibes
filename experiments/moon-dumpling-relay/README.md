# Moon Dumpling Relay — 月饺接力

I built this after reading [@clydejuniordev](https://x.com/clydejuniordev/status/2097086770576011601). The post is a cozy 3D conveyor party game: pick a diner, out-eat AI guests on a spinning ring, procedural everything. The public GitHub README claims eat / dash, a timed round, wasabi panic, catnip speed, and eight cats. I studied the **post text**, the **README claims**, and the **video thumb** only. I did **not** clone the repo, copy source files, or reuse their cat names, sushi brand, Pokémon Stadium framing, packaging, or assets. This is my educational demo — **vibes · moon dumpling relay**. The table is invented: **Moon Dumpling Relay / 月饺接力**.

## What I built

- **A moon-gate table** — indigo night studio, lantern posts, a standing moon ring. Diners walk the outer path. Plates ride a spinning inner rail. No `.glb`.
- **Five invented diners** — Ember Fox, Ink Raccoon, Paper Owl, Moss Badger, River Hare. Fox / raccoon / owl first, not cats.
- **One 55-second relay** — seat a diner, countdown, eat, dash, then a ranked card. Two simple AI guests (orbit vs savour). Not a full eight-character clone.
- **Procedural plates** — pleat dumpling, soup dumpling, moon coin, **chili slick** (steering flips), **tea-leaf sprig** (speed). Same *hazard / boost* lesson, my names.
- **Frosted 2026-09-08 HUD** — brand lockup, Inter, glass desk. Mute-default Web Audio bed + eat / dash / chili / tea / bell cues.

A / D or arrows walk. Space eats when you line up with a plate. Shift dashes. M toggles sound (off until you ask). R from the results card runs the same diner again.

## Stack

Vite + React 19 + R3F + drei + three `~0.170`.

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

Linked Vercel project `vibes-moon-dumpling-relay` / `prj_oIOqxeUp7QkAOPYBoEyzR0rvegwP` (link-only, 0 production, no production URL yet. Production has only been CANCELED lately via ignoreCommand). Dashboard **Root Directory** is `experiments/moon-dumpling-relay`. `vercel.json` carries the usual Vite fields plus `ignoreCommand`. It cannot set Root Directory. No new projects (Hobby 25-link cap). See [the drift note](../../docs/incidents/2026-09-08-readme-vercel-link-only-drift.md).

## Related

- [docs/reverse-engineering/moon-dumpling-relay.md](../../docs/reverse-engineering/moon-dumpling-relay.md)
- [docs/adr/0015-procedural-party-game-slice.md](../../docs/adr/0015-procedural-party-game-slice.md)

---

**Status**: Still link-only, 0 production; Vite ^6.4.3 + this Root-touch force `ignoreCommand` to rebuild `vibes-moon-dumpling-relay`  
**Last updated**: 2026-09-19 ~10:30am AEST (moon-dumpling-relay-only Vite security bump)  
**Deploy**: Linked `vibes-moon-dumpling-relay` / `prj_oIOqxeUp7QkAOPYBoEyzR0rvegwP`. Root Directory `experiments/moon-dumpling-relay`. No production URL yet (production CANCELED via ignoreCommand until this Root rebuilds). No new projects (Hobby 25-link cap).  
Built by Johnny Huynh • This is my kitchen sink • Research and education only, not production code
