# Attribution — North Court

## Inspiration (pattern only)

- [@MrLarus](https://x.com/MrLarus/status/2096971051334857181) — public post: an interactive 3D Chinese courtyard. Workflow named as GPT-6 Astra → Blender Python → GLB → Three.js. Verified via X API, post id `2096971051334857181`.

I studied that *pattern*. I did **not** copy their mesh, chrome, L-plan, or branding. North Court / 北庭 / `vibes · siheyuan` are mine.

## 3D models (CC0)

All from [Poly Haven](https://polyhaven.com/), [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/). 1k PBR glTF packed to Draco + WebP in `public/models/`. Credit is not required under CC0. I still name the source so the swap is inspectable.

| File | Asset | Author |
| --- | --- | --- |
| `court-lantern.glb` | [Wooden Lantern 01](https://polyhaven.com/a/wooden_lantern_01) | James Ray Cock |
| `court-tea-table.glb` | [Chinese Tea Table](https://polyhaven.com/a/chinese_tea_table) | Kirill Sannikov |
| `court-stool.glb` | [Chinese Stool](https://polyhaven.com/a/chinese_stool) | Kirill Sannikov |
| `court-armchair.glb` | [Chinese Armchair](https://polyhaven.com/a/chinese_armchair) | Kirill Sannikov |
| `court-plant.glb` | [Potted Plant 02](https://polyhaven.com/a/potted_plant_02) | Rico Cilliers |
| `court-rocks.glb` | [Rock Moss Set 01](https://polyhaven.com/a/rock_moss_set_01) | Kless Gyzen |

The lantern, tea set, and armchair are the multi-mesh hero props. Halls, the moon gate, the pond, and the season pines stay my TypeScript primitives. I did not use Kenney, Meshy, or Tripo. I did not download MrLarus’s courtyard mesh.

## Roof and paving maps (CC0)

- **Roof**: [Grey Roof Tiles](https://polyhaven.com/a/grey_roof_tiles) by Rob Tuytel. Files `public/textures/roof-diff.jpg`, `roof-nor.jpg`, `roof-rough.jpg` (1k).
- **Paving**: [Rectangular Paving](https://polyhaven.com/a/rectangular_paving) by Dimitrios Savva. Files `public/textures/stone-diff.jpg`, `stone-nor.jpg`, `stone-rough.jpg` (1k).

These dress the *visual* hip roofs and the court plinth. Season still multiplies `look.roofColor` and `look.pavingColor` on top of the maps.

## HDRI (CC0)

- **Asset**: [Chinese Garden](https://polyhaven.com/a/chinese_garden)
- **Author**: Andreas Mischok
- **Licence**: [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)
- **File**: `public/hdri/chinese-garden.hdr` (1k)

Lighting only. Loaded as a local drei `<Environment>` with `background={false}` so the season sky dome still owns the horizon. `look.envGain` follows the sun. Distinct from Nimbus Path’s Pink Sunrise, Ochre Gallop’s Qwantani dusk, and Fairday Walk’s Kloofendal sky.

## Code

MIT — see the repo [LICENSE](../../LICENSE). Layout, atmosphere, and HUD stay original work.
