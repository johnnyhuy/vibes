# Amber Longeron — wooden biplane lanes

I built this after reading [@heymichu25](https://x.com/heymichu25/status/2097062564299759855). The post is a cinematic vintage wooden biplane web mini-game — Pure WebGL, procedural wooden textures, snappy lane-dodging, almost no HUD. I studied the public post, the video thumb, and the live *read*. I did **not** copy their meshes, grain, waitlist, chrome, or branding. This is my educational demo — **vibes · amber longeron**. The ship is invented: **Amber Longeron / 桁**.

## What I built

- **A composite biplane** — cylinder fuselage, plank wings, two cabane struts, a dark hub, a spinning prop. No .glb. A longeron is a fuselage spar; you can read every part in `Biplane.tsx`.
- **Toy canvas wood** — low-contrast amber / walnut maps. Soft upper-left key so the grain reads as varnish, not zebra stripes. See [ADR-0012](../../docs/adr/0012-procedural-wood-biplane.md).
- **Kiln Run** — three lanes on a linen-tan studio floor. Carnelian orbs are solid (the public *lane-orb* mechanic, my material). Bronze rings are a count I invented.
- **Snappy steer** — A / D, arrows, swipe, or the pad. Space / click / ↑ takes off. `R` resets. Follow-cam sits close behind the spar.
- **Immersive chrome** — in flight I keep a distance chip only. Ready / crash still have a small frosted card so restart is findable.

You start on the centre line. Take off. Stay in the empty lane.

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

`vercel.json` only carries the usual Vite fields plus `ignoreCommand`. It cannot set Root Directory. If I add a project later: dashboard **Root Directory** must be `experiments/amber-longeron`.

Post-quota order stays: (1) promote `vibes-blender-semicircle` from the git-main framing fix (2) `vibes-scroll-product` first READY (3) `vibes-audio-gadget-spin` first production (4) then grass / ballance / courtyard. If `vibes-procedural-grass-field` already exists `deploy: false`, leave it idle. Do not create a project for this folder.

## Related

- [docs/reverse-engineering/amber-longeron.md](../../docs/reverse-engineering/amber-longeron.md)
- [docs/adr/0012-procedural-wood-biplane.md](../../docs/adr/0012-procedural-wood-biplane.md)

---

**Status**: Local build is the QA until a project exists  
**Last updated**: 2026-09-07  
**Built by**: Johnny Huynh
