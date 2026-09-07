# 2026-09-07: Semicircle Viewer Cropped Mega-Arc

**Status**: Fixed  
**Severity**: Medium (demo readable but the hero composition was wrong)  
**Affected**: `experiments/blender-semicircle-viewer` / `vibes-blender-semicircle`  
**Root cause**: Hardcoded camera looked at the origin with a tight FOV, so a radius-12, 51-laptop 180° arc read as a cropped mega-arc

---

## What I Saw

The live semicircle viewer stacked ~51 procedural laptops on a 12-unit radius, then parked the camera at `(0, -1.5R, 0.8R)` with FOV 50° looking at `(0, 0, 0)`.

That origin sits on the **diameter**, not the visual centre of the arc. The array spans ~24 units in Y. From that seat you get:

- The near tip filling the frame
- The far tip and bulge clipped or fogged
- A “huge incomplete ring” instead of a readable 180° product array

An earlier stale branch (`cursor/fix-semicircle-framing-60d6`) only bumped FOV 50° → 60° and walked the camera back a little. That still looks at the origin, so the crop remains as soon as the radius or laptop count changes.

---

## Fix

Frame from the **world bounds of the laptop group**, not from magic multipliers:

1. Parent the 51 laptops in one `THREE.Group`
2. `Box3.setFromObject(root)` → size + centre
3. Distance = max(fit-height, fit-width) × 1.22 padding
4. Sit the camera on a slight below-front hero vector and `lookAt(centre)`
5. Stretch fog and OrbitControls min/max to that distance
6. Reset button restores the framed pose; resize re-frames

FOV stays moderate (42°) so the arc doesn’t fish-eye. Distance does the work.

---

## Why This Matters

Legendaryy’s public demo ([2096510965789422001](https://x.com/Legendaryy/status/2096510965789422001)) is the reference *pattern*: a full semicircle of laptops you can read at a glance. My rebuild is clean-room procedural geometry — the composition still has to sell that pattern.

Hardcoded camera seats rot the moment `LAPTOP_COUNT` or `SEMICIRCLE_RADIUS` changes. Bounds-fit framing keeps the educational demo honest.

---

## Related

- `docs/reverse-engineering/blender-mcp-macbook-semicircle.md`
- PR #11 (stale explode + FOV bump — superseded)
- `docs/incidents/2026-09-07-vercel-deploy-quota.md` — don’t spam redeploys to QA this; local `npm run build` + `npm run preview` first

---

**Fixed**: 2026-09-07  
**Author**: Johnny Huynh
