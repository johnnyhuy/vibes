# 2026-09-07: Semicircle Viewer Cropped Mega-Arc

**Status**: Code fix is this PR (XZ layout + corner-fit framing). **Do not treat bbox-only `03bbe0c` as fixed.** Production is still FAIL on stale `25587f54`. Do not force a production redeploy until quota resets (~2026-09-08 12:55 UTC).  
**Affected**: `experiments/blender-semicircle-viewer` / `vibes-blender-semicircle`  
**Root cause (revised 2026-09-08)**: The arc was a **vertical XY standing arch** of Z-thin meshes. Bounds-fit framing correctly framed that silhouette — a 24-unit-tall D with a ~0.6-unit stroke — so it still read as a cropped hairline.

---

## Visual QA 2026-09-08 ~5:45am AEST — bbox framing still FAIL

The cropped mega-arc is **not** just stale production.

| Shot | URL | Commit / deploy | Verdict |
| --- | --- | --- | --- |
| Image A | Preview `vibes-blender-semicircle-b390a46fp-johnnyhuy-dev.vercel.app` (`dpl_Euk45N7…`) | Already includes `frameCameraToArc` from `03bbe0c` | **FAIL** — thin cropped vertical hairline. Individual laptops unreadable. |
| Image B | Production `vibes-blender-semicircle.vercel.app` | Still `25587f54` | **FAIL** — same hairline. |

Merging or redeploying the existing AABB framing alone will not fix it.

---

## What I saw (first incident)

The live semicircle viewer stacked ~51 procedural laptops on a 12-unit radius, then parked the camera at `(0, -1.5R, 0.8R)` with FOV 50° looking at `(0, 0, 0)`.

That origin sits on the **diameter**, not the visual centre of the arc. An earlier stale branch (`cursor/fix-semicircle-framing-60d6`) only bumped FOV 50° → 60° and walked the camera back a little. That still looks at the origin.

`03bbe0c` (PR #15) replaced the hardcoded seat with `Box3.setFromObject` + AABB/sphere distance and a below-front hero vector. Projection math was internally consistent. The **subject** was still wrong.

---

## Why bbox framing still produced a hairline

The viewer copied Blender’s Z-up / XY-ground coordinates into Three.js (Y-up / XZ-ground) without converting:

1. **Layout** — `position.set(R·cos θ, R·sin θ, 0)` is a vertical arch in the XY plane.
2. **Meshes** — `BoxGeometry(width, depth, thickness)` is paper-thin in Z. From +Z you see 0.8×0.6 faces arranged on a 24-unit-tall D. Stroke width ≈ one laptop, so the “array” is a hairline.
3. **Ground** — XZ at y = 0, so half the vertical arch sat below the floor.
4. **`frameCameraToArc`** — fitted `size.x` / `size.y` only, sat the camera on `(0.12, -0.42, 0.9)`, and looked at the bbox centre. That *successfully* framed the D-silhouette. It cannot invent depth the layout does not have.
5. **Auto-rotate** — OrbitControls spins around +Y. A vertical XY arch goes edge-on within a quarter turn, which matches the cropped crescent on the right of the viewport.

So the 5:45am preview FAIL is the expected render of that geometry, not a stale bundle.

---

## What actually fixed it

1. **Horizontal XZ semicircle** — `x = R·sin θ`, `z = −R·cos θ`, θ ∈ [−90°, +90°]. Diameter on X, bulge at −Z, open side toward +Z / the camera. Radius 14 so 51 lids have a visible gap instead of melting into one ribbon.
2. **Y-up laptops** — base on XZ, screen standing in Y, hinge at −Z. Each instance yaws `−θ` so lids face inward (readable product array).
3. **Above-front camera** — hero vector `(0, 0.72, 0.69)` (~46° elevation) so the bowl reads as a horseshoe. A shallow angle foreshortens the same XZ array back into a wire. Polar clamp stays above the ground so auto-rotate cannot graze the arc.
4. **Corner-fit distance** — project all eight AABB corners into the hero camera basis; `d` is the max of `along + |x|/tan(hFov/2)` and `along + |y|/tan(vFov/2)`, then ×1.08 margin. Look target is a little above the decks. Reset Camera restores that pose; resize re-frames.

Local headed/headless QA after this change: 51 separate screen+base blobs, arc ~84% of viewport width — not a right-edge hairline.

Procedural geometry only. No Apple assets.

---

## Why this matters

Legendaryy’s public demo ([2096510965789422001](https://x.com/Legendaryy/status/2096510965789422001)) is the reference *pattern*: a full semicircle of laptops you can read at a glance. A vertical paper-thin arch framed from the side is not that pattern, even when every vertex is “in view”.

---

## Related

- `docs/reverse-engineering/blender-mcp-macbook-semicircle.md`
- PR #11 (stale explode + FOV bump — superseded)
- PR #15 / `03bbe0c` (bbox framing — necessary, not sufficient)
- `docs/incidents/2026-09-07-vercel-deploy-quota.md` — don’t spam redeploys; local `npm run build` + headed preview first. Preview deploys from this PR branch are fine if Vercel fires them.

---

**First pass**: 2026-09-07 (bbox framing)  
**Revised**: 2026-09-08 (XZ layout + corner-fit; preview QA still FAIL on bbox-only)  
**Author**: Johnny Huynh
