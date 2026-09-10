# Scroll Product Showcase

A clean-room scroll-driven glass bottle — my take on the viral WebGL product hero, not a copy of anyone's mesh.

Inspired by [himanshubuildss' photoreal bottle](https://x.com/himanshubuildss/status/2096243989439713677) (thumb: `hill-climb/refs/himanshu-glass-bottle-thumb.jpg`): dark green glass, refractive liquid, **horizontal** apothecary, “scroll — it rolls.” I studied the pattern and rebuilt it with procedural geometry.

## What I Built

Pass 1 was a torus knot. Pass 2 was an upright amber carafe with a brass stopper — still the wrong silhouette next to the thumb. This pass is the Caldera-class **read**, not the brand:

- **Horizontal lathe** — wide cylinder, short neck, flat punt, **black cap**. Group is rolled onto its side (`rotation.z = π/2`).
- **Dark green glass** — `transmission: 1`, `ior: 1.48`, short green attenuation. Liquid is a second lathe, darker, `ior: 1.39`.
- **Type in the scene** — lime `AETHER` is drei `Text` *behind* the bottle so transmission has something to bend. DOM headlines cannot do that.
- **Strip Lightformers** — long thin studio lights for the horizontal speculars. No city HDRI.
- **Scroll rolls the long axis** — `rotation.x` tracks window scroll, damped in `useFrame`. Bidirectional.
- **Interlocking copy** — frosted cards, chartreuse kickers. Canvas `pointer-events: none`.

No GLB. No TEPHRA/CALDERA assets. Aether is a fictional batch.

## Why I Dropped ScrollControls

drei `ScrollControls` paints its own overlay. Native `window` scroll + lerp is the marketing-page version.

## The Mapping

```
scroll offset 0 → 1
  bottle roll (X)   0 → 360°
  camera            slight dolly in
```

`prefers-reduced-motion` parks the roll.

## Stack

- Vite + React 19
- React Three Fiber + drei (`Environment`, `Lightformer`, `Text`, `ContactShadows`)
- Three.js `LatheGeometry` + `MeshPhysicalMaterial`

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

Vercel project: **`vibes-scroll-product`** (`prj_XLBiIlbjweejp9himT53bolPEMUW`)  
Dashboard **Root Directory** (required): **`experiments/scroll-product-showcase`**

Production: [https://vibes-scroll-product.vercel.app](https://vibes-scroll-product.vercel.app)

`vercel.json` cannot set Root Directory. Earlier `main` hooks CANCELED with `ignored-build-step` because this folder did not change. The 2026-09-09 Root touch poisoned schema with an illegal `"//"` key (PR #53 removes it). This 2026-09-10 post-quota README bump is the real Root touch so `ignoreCommand` builds a clean preview. I am not creating a new project. Do not retry-spam.

## What I Learnt

1. **Silhouette first.** Upright gold-stopper ≠ the thumb. Horizontal dark cylinder does.
2. **Refraction needs a subject.** Put the hero word in the 3D scene.
3. **Lightformers beat a generic city HDRI** for those long product-shot highlights.
4. **“It rolls” is a long-axis spin**, not a turntable yaw.

## Related

- [docs/reverse-engineering/webgl-scroll-product.md](../../docs/reverse-engineering/webgl-scroll-product.md)
- [docs/adr/0005-scroll-driven-product-hero.md](../../docs/adr/0005-scroll-driven-product-hero.md)
- [docs/incidents/2026-09-07-vercel-deploy-quota.md](../../docs/incidents/2026-09-07-vercel-deploy-quota.md)
- [docs/incidents/2026-09-09-vercel-json-comment-key.md](../../docs/incidents/2026-09-09-vercel-json-comment-key.md)

---

**Status**: Production alias [vibes-scroll-product.vercel.app](https://vibes-scroll-product.vercel.app) — waiting on PR #53 merge after post-quota preview
**Last updated**: 2026-09-10  
**Built by**: Johnny Huynh
