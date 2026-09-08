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

**No Vercel project.** Do not create one on this PR. Hobby quota on `johnnyhuy-dev` stays exhausted until **~2026-09-08 20:39 UTC**. I am not burning a slot on a new app.

`vercel.json` only carries the usual Vite fields plus `ignoreCommand`. It cannot set Root Directory. If I add a project later, the name pattern is `vibes-<experiment>` — here **`vibes-zephyr-vale`**. Dashboard **Root Directory** must be `experiments/zephyr-vale`.

Post-quota order stays: (1) promote `vibes-blender-semicircle` production from the framing-fix git-main preview (2) `vibes-scroll-product` first READY (3) `vibes-audio-gadget-spin` first production (4) `vibes-procedural-grass-field` (5) only then ballance / courtyard / amber-longeron / nacre-loom / heartwood-warden / moon-dumpling-relay / this vale. Do not create those pending projects here.

## Local playtest (2026-09-08)

Headed preview on `127.0.0.1:4173` after `npm run build`:

- Canvas painted a sunlit knoll: reed grass, listening oak, log seat, drifting slips. Soft haze, not a grey void.
- Elevated three-quarter follow; reed walker (straw hat, staff, Bellkite) readable in the lower third.
- HUD: `vibes · zephyr vale`, 风笺谷, gather pill `0 / 8`, mute default.
- Still: `docs/previews/zephyr-vale.png`.

No Vercel project. No production URL.

## Related

- [docs/reverse-engineering/zephyr-vale.md](../../docs/reverse-engineering/zephyr-vale.md)
- [docs/adr/0017-zephyr-vale-procedural-wander.md](../../docs/adr/0017-zephyr-vale-procedural-wander.md)

---

**Status**: Local build is the QA until a project exists  
**Last updated**: 2026-09-08  
**Built by**: Johnny Huynh
