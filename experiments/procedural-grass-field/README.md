# Wind Lea — procedural grass field

I built this after reading [Bilal Khan / Grassworks](https://x.com/Bk23544/status/2096928659785626028) and trying the public demo at [grassworks.techredux.co/demo](https://grassworks.techredux.co/demo). The post is a dense, interactive Three.js meadow with species-inspired presets and stylised looks. I studied that *feel*. I did **not** copy their shaders, meshes, chrome, or branding. This is my educational demo — **vibes · grass field**. The meadow is invented: **Wind Lea / 青原**.

## What I built

- **Instanced blades** — two crossed, tapered planes per instance. No turf GLB, no commercial grass pack.
- **Wind shader** — tip-weighted sway plus a pointer gust that parts the lea. Reduced motion freezes it.
- **Species I invented** — Rye, Fescue, Reed, and a thick stylised Ink. Not their catalogue.
- **Looks** — Noon, Amber, Overcast, Night. Sky, fog, sun, and grass shift together.
- **Frosted HUD** — pale glass chrome from the 2026-09-08 design sweep, tuned for a meadow instead of a black car studio.

Drag to orbit. Poke the field. Swap species and sky.

## Stack

Vite + React 19 + R3F + drei + three `~0.170`. Custom `ShaderMaterial` on `InstancedMesh`.

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

**No Vercel project.** Do not create one on this PR. Hobby quota on `johnnyhuy-dev` stays exhausted until **~2026-09-08 12:55 UTC**. I am not burning a slot on a new app.

`vercel.json` only carries the usual Vite fields plus `ignoreCommand`. It cannot set Root Directory. If I add a project later: dashboard **Root Directory** must be `experiments/procedural-grass-field`.

`vibes-audio-gadget-spin` (`prj_N57mvThg4UcU9XxLK3F5wAICz9PA`) already exists with Root `experiments/audio-gadget-spin`. I documented it. I am not redeploying it here. Still no projects for ballance-roll or chinese-courtyard.

## Related

- [docs/reverse-engineering/procedural-grass-field.md](../../docs/reverse-engineering/procedural-grass-field.md)
- [docs/adr/0011-procedural-grass-instancing.md](../../docs/adr/0011-procedural-grass-instancing.md)

---

**Status**: Local build is the QA until a project exists  
**Last updated**: 2026-09-07  
**Built by**: Johnny Huynh
