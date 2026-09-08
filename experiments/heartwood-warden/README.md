# Heartwood Warden — living-wood glade

I built this after reading [@NickDevFE](https://x.com/NickDevFE/status/2096946586781692297). The full workflow quote: **Image → Hyper3D → img2threejs → GPT-6 Astra → Interactive Three.js**. The lesson I kept: 3D generation is the beginning, not the end — you still build a game / product / experience around the asset, with editable code.

The live marketing URL is [img2threejs.io/#/x/monster-tree](https://img2threejs.io/#/x/monster-tree). Their exhibit is titled “Groot — Heart of the Forest.” I studied the public post, the thread, the site OG lockup, and the X video thumb. I did **not** scrape, clone, or paste their factory, skins, or chrome. This is my educational demo — **vibes · heartwood warden**. The character is invented: **Heartwood Warden / 心木守**.

## What I built

- **A moss-bound shrine guardian** — bark plates, a hollow chest with an amber resin heart, a carved mask, a crescent of bare twigs. Not a Marvel tree-person. Composite primitives. No character GLB.
- **A moonlit woodland glade** — Poly Haven CC0 photogrammetry (quiver trees, fir sapling, moss rocks, stump, shrub, fallen trunk) plus a local night HDRI. Stone ring, thick night fog, a moon-dew rill I invented, faint shafts. Dark woodland, not Kenney boxes. Rear-three-quarter follow. See [ATTRIBUTION.md](./ATTRIBUTION.md).
- **Lantern spirits** — seven drifting orbs. Three carry lights. They keep the path and hurry in on lantern call.
- **Walk and sprint** — WASD or arrows. Shift runs. Simple gait: idle sway, walk plant, run lean.
- **Ten casts I named** — vine lash, spore bloom, root pulse, amber heart, moss veil, canopy bind, lantern call, night dew, heartwood choir, moon graft. Keys `1`–`0`.
- **Ward snippet** — generated JSON plus a short `rootPulse()` helper that is mine. Optional panel. It echoes the “editable Three.js code” lesson without claiming their pipeline.

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

`vercel.json` only carries the usual Vite fields plus `ignoreCommand`. It cannot set Root Directory. If I add a project later: dashboard **Root Directory** must be `experiments/heartwood-warden`.

Post-quota order stays: (1) promote `vibes-blender-semicircle` production from the framing-fix git-main preview (2) `vibes-scroll-product` first READY (3) `vibes-audio-gadget-spin` first production (4) `vibes-procedural-grass-field` (5) only then ballance / courtyard / amber-longeron / nacre-loom / this glade. Do not create those pending projects here.

## Local playtest (2026-09-08)

Headed preview on `127.0.0.1:4175` after `npm run build`:

- Canvas painted a dark woodland night: fog, Poly Haven PBR canopy / undergrowth, moon-dew rill. Not a grey void.
- Rear-three-quarter follow; guardian (mask, amber well, crescent twigs) readable in the lower third.
- WASD walked; vine lash (`1`) changed the desk title and the bottom strip.
- Console: no fatal errors.

No Vercel project. No production URL.

## Related

- [docs/reverse-engineering/heartwood-warden.md](../../docs/reverse-engineering/heartwood-warden.md)
- [docs/adr/0014-heartwood-warden-procedural-showcase.md](../../docs/adr/0014-heartwood-warden-procedural-showcase.md)
- [ATTRIBUTION.md](./ATTRIBUTION.md)

---

**Status**: Local build is the QA until a project exists  
**Last updated**: 2026-09-08  
**Built by**: Johnny Huynh
