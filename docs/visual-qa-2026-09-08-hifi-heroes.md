# 2026-09-08 — Hi-fi hero meshes (local)

Quality bar: explode-assembly Model 3, not Kenney / box stand-ins.

## What changed

- **Heartwood Warden** — Kenney Nature Kit replaced with Poly Haven CC0 photogrammetry (quiver trees, fir sapling, moss rocks, stump, shrub, fallen trunk) plus a local Dikhololo Night HDRI. Invented casts / guardian unchanged.
- **Cinder Mere** — procedural box kiln cart replaced with Poly Haven portable welding cart. Heightmap basin stays. Venice Sunset HDRI on the cart.
- **Amber Longeron** — same Sopwith Camel mesh; local studio HDRI + envMapIntensity so it stops reading as a flat toy.
- **Lumen Cuff** — same Spacebar headphones; studio HDRI instead of Lightformer-only cubemap.

Headed Playwright stills refreshed `docs/previews/{heartwood-warden,cinder-mere,amber-longeron,audio-gadget-spin}.png` from `npm run preview` after `npm run build`. Dikhololo Night’s double `#?RADIANCE` header was normalised so three.js RGBELoader accepts it. No new Vercel project.

No new Vercel project. No redeploy.

## Local build

```bash
for app in heartwood-warden cinder-mere amber-longeron audio-gadget-spin; do
  (cd experiments/$app && npm install && npm run build)
done
```

Preview stills refreshed in `docs/previews/` when the headed capture ran.
