# Scroll Product Showcase

A clean-room scroll-driven glass bottle — my take on the viral WebGL product hero, not a copy of anyone's mesh.

Inspired by [himanshubuildss' photoreal bottle](https://x.com/himanshubuildss/status/2096243989439713677) (verified 2026-09-07): refractive liquid, dynamic scroll rotation, interlocking marketing UI. I studied the pattern and rebuilt it with procedural geometry.

## What I Built

The first pass used a torus knot. It proved transmission works and looked like homework. This iteration is a **lathed perfume carafe** I called Aether:

- **Outer glass** — `LatheGeometry` profile (punt, body, shoulder, neck, lip). `MeshPhysicalMaterial` with `transmission: 1`, `ior: 1.5`, thickness + teal attenuation.
- **Inner liquid** — A second lathe, filled to a meniscus disk. Amber, `ior: 1.4`, shorter attenuation path.
- **Brass collar + stopper** — The only opaque metal, so the glass has something to refract against.
- **Scroll is the controller** — Native window scroll (0→1) damps yaw, pitch, and a camera arc in `useFrame`. Bidirectional.
- **Interlocking copy** — Frosted cards fade in left/right as you pass them. Canvas is `position: fixed` with `pointer-events: none`.

No GLB. No HDRI file. drei `Environment` preset `city` plus three-point lights.

## Why I Dropped ScrollControls

drei `ScrollControls` paints its own overlay on the canvas. I also had a tall HTML page. Two scrollers, one wheel — the marketing sections and the 3D rotation drifted apart.

Native `window` scroll + lerp is the Apple/Stripe version of this pattern. `ScrollControls` is still the right tool when the HTML lives inside `<Scroll html>`. I wanted real document flow and pointer-events on the cards.

## The Mapping

```
scroll offset 0 → 1
  bottle yaw     0 → ~370°
  bottle pitch   sin-wave tilt
  camera         3/4 view → closer, higher, a little orbit
```

`prefers-reduced-motion` parks the spin and keeps a readable 3/4 seat.

## Stack

- Vite + React 19
- React Three Fiber + drei (`Environment`, `ContactShadows`)
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

`vercel.json` here sets Vite build output. It cannot set Root Directory — that is a dashboard field. If Root is empty, this project will try to build the monorepo root and fail.

First production deploy is still queued behind the 2026-09-07 hobby quota (reset **~2026-09-08 12:55 UTC**). After reset, one deploy from `main`. Do not retry-spam.

## What I Learnt

1. **A bottle reads as a product. A torus knot reads as a shaderball.** Same materials, different silhouette.
2. **Two IORs beat one glass mesh.** Liquid is a volume, not a tint on the shell.
3. **Fixed canvas + document scroll** is the marketing-page version. Don't fight it with an overlay scroller.
4. **City HDRI > studio** for glass. You need high-contrast highlights or transmission looks like plastic.

## Related

- [docs/reverse-engineering/webgl-scroll-product.md](../../docs/reverse-engineering/webgl-scroll-product.md)
- [docs/adr/0005-scroll-driven-product-hero.md](../../docs/adr/0005-scroll-driven-product-hero.md)
- [docs/incidents/2026-09-07-vercel-deploy-quota.md](../../docs/incidents/2026-09-07-vercel-deploy-quota.md)

---

**Status**: Local build is the QA until quota resets  
**Last updated**: 2026-09-08  
**Built by**: Johnny Huynh
