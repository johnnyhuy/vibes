# Ridge Pagoda — japanese tower

I built this after reading [@bharatmodi2014's Japanese tower post](https://x.com/bharatmodi2014/status/2096974996455444494). The public clip is an interactive Three.js keep: seasons, day / night, weather, and atmosphere. I studied the post and the video thumb. I did **not** copy their geometry, UI chrome, or branding. This is my educational demo — **vibes · japanese tower**.

## What I built

- **Procedural pagoda** — five stacked timber-and-tile storeys, battered stone podium, bronze finial. All Three.js primitives. No .glb.
- **First-class atmosphere state** — season, day/night, weather, and haze resolve into one `ResolvedLook` (lights, fog, sky, materials, particles). See [ADR-0007](../../docs/adr/0007-scene-atmosphere-state.md).
- **Controls that actually change the valley** — spring blossom, summer green, autumn maple, winter frost; a sun that walks the sky; rain / snow / mist particles; haze that thickens exponential fog.
- **Dark cinematic chrome** — black stage, frosted glass panel, `vibes · japanese tower` header. Not their product names.

You drag to orbit. Then you push the sliders until the lighting and weather disagree with the default dusk.

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

No Vercel project yet. Hobby quota on `johnnyhuy-dev` is still exhausted until **~2026-09-08 12:55 UTC**. Do not create a project or force a deploy on this PR.

If I add one later: dashboard **Root Directory** must be `experiments/japanese-tower`. `vercel.json` only carries `ignoreCommand` — it cannot set Root Directory.

## Related

- [docs/reverse-engineering/japanese-tower-threejs.md](../../docs/reverse-engineering/japanese-tower-threejs.md)
- [docs/adr/0007-scene-atmosphere-state.md](../../docs/adr/0007-scene-atmosphere-state.md)
- Next candidate (not built): [audio gadget product spin](../../docs/reverse-engineering/audio-gadget-product-spin.md)

---

**Status**: Local build is the QA until a project exists  
**Last updated**: 2026-09-08  
**Built by**: Johnny Huynh
