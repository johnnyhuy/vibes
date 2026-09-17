# Alba Forum — chalk-city landmark scroll

I built this after reading [@levinstanley](https://x.com/levinstanley/status/2097083437610074117). The public pitch: educational scroll through landmarks, click Explore to orbit and zoom details, design directed around “White as the foundation.” The live they linked is [rome.levinstanley.chatgpt.site](https://rome.levinstanley.chatgpt.site/). I studied the **post text**, the **title-card feel** (`hill-climb/refs/explore-rome-thumb.jpg` when present), and the live *read* only — drag orbit, scroll/pinch zoom, an Explore control, a landmark name. I did **not** scrape, fork, clone, or copy their source, assets, CSS, UI chrome, domain, logo, or copy. This is my educational demo — **vibes · alba forum**. The place is invented: **Alba Forum / 白坛**.

## What I built

- **A chalk avenue** — soft off-white foundation, pale stone, sage cypress. Not a dark kiln studio and not another rainy coast drive (Cinder Mere / APEX already cover that lane).
- **Ten invented stops** — Ivory Arch, Chalk Forum, Pale Obelisk, Alabaster Gate, Milk Colonnade, Pumice Bridge, Bone Theatre, Quartz Spire, Linen Basilica, Cloud Rotunda. Not a 1:1 Rome list.
- **Scroll-driven camera** — native window scroll, damped in `useFrame`, same family as scroll-product-showcase. Bidirectional. Prev / next chips and arrow keys step the itinerary.
- **Explore** — orbit + zoom the current landmark mesh. Leave (or Esc) returns to the scroll framing.
- **Procedural architecture** — boxes, cylinders, arches, columns, a half-dome. No scraped GLBs. No runtime CDN.

## Stack

Vite + React 19 + R3F + drei + three `~0.170`.

## Run

```bash
npm install
npm run dev
```

[http://localhost:5173](http://localhost:5173)

```bash
npm install && npm run build
```

## Deploy

Linked Vercel project `vibes-alba-forum` / `prj_q9pJAos2JhRzr1M3uBAalAnAST17` (link-only, 0 production, no production URL yet). Dashboard **Root Directory** is `experiments/alba-forum`. `vercel.json` carries the usual Vite fields plus `ignoreCommand`. It cannot set Root Directory. No new projects (Hobby 25-link cap). See [the drift note](../../docs/incidents/2026-09-08-readme-vercel-link-only-drift.md).

## Local playtest (2026-09-08)

Headed preview on `127.0.0.1:4173` after `npm run build`:

- Chalk canvas: off-white ground, Ivory Arch framed, brand `vibes · alba forum`. Soft fog, sage cypress — not a dark kiln desk and not a coast drive.
- Thin frosted HUD: lockup, `01 / 10`, Prev / Next / Explore, serif landmark chip + first-person caption.
- Next walks the invented itinerary (Chalk Forum, Pale Obelisk, … Cloud Rotunda). No Rome nouns.
- Explore orbits the current mesh and zooms; Leave / Esc returns to scroll framing.
- Console: no fatals. Benign WebGL `ReadPixels` / software-GL notes only. Build green.
- Still: `docs/previews/alba-forum.png`.

Linked, no production URL.

## Distinct from siblings

Scroll-product-showcase is a **glass bottle hero**. Japanese-tower is a **pagoda lift**. Kiln Studs is a **dark brick studio**. Cinder Mere is a **dusk drive**. This pass is a **white-foundation educational landmark scroll**.

## Related

- [docs/reverse-engineering/alba-forum.md](../../docs/reverse-engineering/alba-forum.md)
- [docs/adr/0020-alba-forum-educational-landmark-scroll.md](../../docs/adr/0020-alba-forum-educational-landmark-scroll.md)
- [ATTRIBUTION.md](./ATTRIBUTION.md)

---

**Status**: Still link-only, 0 production; Vite ^6.4.3 + this Root-touch force `ignoreCommand` to rebuild `vibes-alba-forum`  
**Last updated**: 2026-09-18 ~8:30am AEST (alba-forum-only Vite security bump)  
**Deploy**: Linked `vibes-alba-forum` / `prj_q9pJAos2JhRzr1M3uBAalAnAST17`. Root Directory `experiments/alba-forum`. No production URL yet. No new projects (Hobby 25-link cap).  
Built by Johnny Huynh • This is my kitchen sink • Research and education only, not production code
