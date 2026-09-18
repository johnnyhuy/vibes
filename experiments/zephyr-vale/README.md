# Zephyr Vale — sunlit wind-letter wander

I built this after reading [@TusharXo](https://x.com/TusharXo/status/2096741535891251261). The public pitch: a game made with GPT-6 Astra, Three.js, and Crayon, now playable. The live route they posted is [app.usecrayon.ai/play/a9a3c165-74b3-4ff6-9588-ad97f829ddb5](https://app.usecrayon.ai/play/a9a3c165-74b3-4ff6-9588-ad97f829ddb5). I studied the X stills and the *feeling* — a peaceful sunlit valley, a quiet wander, notes on the wind. I did **not** scrape, clone, or paste their play bundle, HUD, map, or Crayon chrome. This is my educational demo — **vibes · zephyr vale**. The place is invented: **Zephyr Vale / 风笺谷**.

## What I built

- **A reed walker** — linen wrap, straw hat, staff, a rolled reed mat. Not their yellow-dress wanderer. Composite primitives. No character GLB.
- **Bellkite** — a cream paper kite with a bronze bell. Not a purple teardrop companion.
- **A sunlit vale** — knoll, dirt ribbon, reed markers, listening oak, log seat, ribbon cairn, reed bothy, mill race + waterwheel, coracle, stepping-stone ford, three islands. Soft daylight, haze, a little grass.
- **Eight breeze slips** — folded notes that drift. Walk near one to gather it. The verses are mine.
- **Wander** — WASD or arrows. Shift hurries. Click the vale to look around. Esc frees the pointer.
- **Mute-default wind** — filtered noise plus two quiet sines. The toggle starts **Muted**.

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

Linked Vercel project `vibes-zephyr-vale` / `prj_g5olvF0lrvLZ89UZp4uZaxU2bTa8` (link-only, 0 production, no production URL yet. Production has only been CANCELED lately via ignoreCommand). Dashboard **Root Directory** is `experiments/zephyr-vale`. `vercel.json` carries the usual Vite fields plus `ignoreCommand`. It cannot set Root Directory. No new projects (Hobby 25-link cap). See [the drift note](../../docs/incidents/2026-09-08-readme-vercel-link-only-drift.md).

## Local playtest (2026-09-08)

Headed preview on `127.0.0.1:4173` after `npm run build`:

- Canvas painted a high-angle knoll in a turquoise mere: reed tufts, listening oak, log seat, islands. Soft daylight, not a grey meadow.
- Elevated follow; reed walker (straw hat, staff, Bellkite) on the crest.
- HUD: `vibes · zephyr vale`, 风笺谷, gather pill, mute default.
- Still: `docs/previews/zephyr-vale.png` (after the hilltop/water pass).
- Feel-only refs: `hill-climb/refs/tushar-wind-wanders.jpg`, plus `crayon-wind-wanders-og.jpg` / `crayon-tide-remembers-thumb.jpg` when present. I did not build Tide Remembers.

Linked, no production URL.

## Related

- [docs/reverse-engineering/zephyr-vale.md](../../docs/reverse-engineering/zephyr-vale.md)
- [docs/adr/0017-zephyr-vale-procedural-wander.md](../../docs/adr/0017-zephyr-vale-procedural-wander.md)

---

**Status**: Still link-only, 0 production; Vite ^6.4.3 + this Root-touch force `ignoreCommand` to rebuild `vibes-zephyr-vale`  
**Last updated**: 2026-09-19 ~6:40am AEST (zephyr-vale-only Vite security bump)  
**Deploy**: Linked `vibes-zephyr-vale` / `prj_g5olvF0lrvLZ89UZp4uZaxU2bTa8`. Root Directory `experiments/zephyr-vale`. No production URL yet (production CANCELED via ignoreCommand until this Root rebuilds). No new projects (Hobby 25-link cap).  
Built by Johnny Huynh • This is my kitchen sink • Research and education only, not production code
