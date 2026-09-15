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
npm run preview
```

Headed local loop: `docs/previews/procedural-grass-field.gif`. Wind + a pointer gust. Dense blades make a fat GIF, so I kept it short and ~480px wide.

## Deploy

Project name: **`vibes-procedural-grass-field`**. Dashboard **Root Directory** must be `experiments/procedural-grass-field`.

Production: [https://vibes-procedural-grass-field.vercel.app](https://vibes-procedural-grass-field.vercel.app)

Hobby is at the 25 Git repo-link cap — I am **not** calling `create_git_project`. `vercel.json` cannot set Root Directory.

### Deploy status (2026-09-15 ~6:50am AEST)

Production alias [https://vibes-procedural-grass-field.vercel.app](https://vibes-procedural-grass-field.vercel.app) is **still** on #53 (`c1063df3` / `dpl_HgYFbhVkcZc7djd`, asset `index-C0EC0qFj.js`) even after #66. That PR produced a READY *preview* on `hill-climb/grass-prod-root-touch-2026-09-15` (`dpl_EGKRFmr6NeSKsj9rNVchtjZne5cD`) but production never left #53 — `ignoreCommand` canceled sibling-main deploys for this Root (same pattern as explode #60→#61). This grass-only README Root-touch is the minimal force so `vibes-procedural-grass-field` can leave #53. One-Root-per-pass to limit Hobby fan-out.

## Related

- [docs/reverse-engineering/procedural-grass-field.md](../../docs/reverse-engineering/procedural-grass-field.md)
- [docs/adr/0011-procedural-grass-instancing.md](../../docs/adr/0011-procedural-grass-instancing.md)
- [docs/incidents/2026-09-09-vercel-json-comment-key.md](../../docs/incidents/2026-09-09-vercel-json-comment-key.md)

---

**Status**: Production alias [vibes-procedural-grass-field.vercel.app](https://vibes-procedural-grass-field.vercel.app) — still on #53 after #66 missed a READY production build (preview-only `dpl_EGKRFmr6NeSKsj9rNVchtjZne5cD`); this Root-touch forces `ignoreCommand` to rebuild
**Last updated**: 2026-09-15 ~6:50am AEST (grass-only Root-touch — #66 skipped a READY production deploy; force leave #53)  
**Built by**: Johnny Huynh
