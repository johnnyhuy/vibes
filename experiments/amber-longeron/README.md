# Amber Longeron — wooden biplane lanes

I built this after reading [@heymichu25](https://x.com/heymichu25/status/2097062564299759855). The post is a cinematic vintage wooden biplane web mini-game — Pure WebGL, procedural wooden textures, snappy lane-dodging, almost no HUD. I studied the public post, the video thumb, and the live *read*. I did **not** copy their meshes, grain, waitlist, chrome, or branding. This is my educational demo — **vibes · amber longeron**. The ship is invented: **Amber Longeron / 桁**.

## What I built

- **A licensed vintage biplane** — bradacvojtech’s Sopwith Camel (CC-BY-4.0), Draco-compressed in `public/models/vintage-biplane.glb`. Local studio HDRI + stronger envMapIntensity so the linen run is not a flat hemisphere. Ground plane hidden. A small spinning prop stays on the nose so the Kiln Run still reads as flight. See [ATTRIBUTION.md](./ATTRIBUTION.md).
- **Linen Kiln Run** — three lanes on a linen-tan studio floor. Carnelian orbs are still solid (the public *lane-orb* mechanic, my material). Bronze rings are a count I invented.
- **Snappy steer** — A / D, arrows, or swipe. The run starts on its own. `R` resets.
- **Almost no HUD** — a faint distance chip in flight. Crash gets a small card. Instructions live in a screen-reader line only.

The camera sits close behind the spar. Stay in the empty lane.

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

Linked Vercel project `vibes-amber-longeron` / `prj_P8wkvn17aVx2YpjNwpSSY2njdJGA`. Dashboard **Root Directory** is `experiments/amber-longeron`. `vercel.json` carries the usual Vite fields plus `ignoreCommand` — it cannot set Root Directory. No new projects (Hobby 25-link cap).

## Related

- [docs/reverse-engineering/amber-longeron.md](../../docs/reverse-engineering/amber-longeron.md)
- [docs/adr/0012-procedural-wood-biplane.md](../../docs/adr/0012-procedural-wood-biplane.md)
- [ATTRIBUTION.md](./ATTRIBUTION.md)

---

**Status**: Production had never left a READY build for this Root; Vite ^6.4.3 + this Root-touch force `ignoreCommand` to rebuild `vibes-amber-longeron`  
**Last updated**: 2026-09-18 ~4:38am AEST (amber-longeron-only Vite security bump)  
**Deploy**: Linked `vibes-amber-longeron` / `prj_P8wkvn17aVx2YpjNwpSSY2njdJGA`. Root Directory `experiments/amber-longeron`. No new projects (Hobby 25-link cap).  
Built by Johnny Huynh • This is my kitchen sink • Research and education only — not production code
