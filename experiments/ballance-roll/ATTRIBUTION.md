# Attribution — Nimbus Path

## Inspiration (pattern only)

- [@fayazara](https://x.com/fayazara/status/2096997505397584041) — public post: Astra rebuilt an Atari *Ballance*-like marble for the web. Verified 2026-09-07 via X API, post id `2096997505397584041`.
- Live they linked: `https://ballance.fayaz.workers.dev/` — page title / description only (*Ballance*; “three materials, three courses, and an ocean of clouds”). Feel only.
- Video thumb: `https://pbs.twimg.com/amplify_video_thumb/2096997028723404800/img/hfBKcWx5NYYByPyh.jpg`

I studied the public post, the video thumb, and the live-demo *read*. I did **not** scrape their Workers bundle, clone their course GLBs, or copy chrome, fonts, or branding. Nimbus Path / 霞 / Haze Walk are mine.

## 3D models (CC0)

All from [Poly Haven](https://polyhaven.com/), [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/). 1k PBR glTF packed with Draco geometry and **JPEG / PNG** maps in `public/models/` — I dropped `EXT_texture_webp` after production still read as yellow/brown stands. Credit is not required under CC0. I still name the source so the swap is inspectable.

| File | Asset | Author |
| --- | --- | --- |
| `haze-lantern.glb` | [Wooden Lantern 01](https://polyhaven.com/a/wooden_lantern_01) | James Ray Cock |
| `haze-diya.glb` | [Brass Diya Lantern](https://polyhaven.com/a/brass_diya_lantern) | Bhargav Kubal |
| `haze-bust.glb` | [Marble Bust 01](https://polyhaven.com/a/marble_bust_01) | Rico Cilliers |

The lanterns are the multi-mesh hero props (wood + glass; brass + glass + flame). The bust is photogrammetry marble on the plaza corners. I did not use Kenney, Meshy, or Tripo. I did not download Fayaz’s course meshes.

Re-pack notes: `scripts/fetch-nimbus-assets.mjs` uses glTF-Transform `optimize --compress draco --texture-compress false`. `scripts/repack-haze-textures.mjs` converts an already-vendored WebP pack to JPEG (baseColor / emissive) and PNG (normal / ORM).

## Draco decoder

`public/draco/` is the glTF decoder from `three/examples/jsm/libs/draco/gltf` (Google Draco, Apache-2.0). drei `useGLTF` points at `/draco/` so a gstatic miss cannot leave the props as untextured blocks.

## Path maps (CC0)

- **Asset**: [Monastery Stone Floor](https://polyhaven.com/a/monastery_stone_floor)
- **Author**: Amal Kumar
- **Licence**: [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)
- **Files**: `public/textures/path-diff.jpg`, `path-nor.jpg`, `path-rough.jpg` (1k)

These dress the *visual* slabs. Collision stays simple cannon-es boxes — dual-mesh, not a trimesh of the GLB.

## HDRI (CC0)

- **Asset**: [Pink Sunrise](https://polyhaven.com/a/pink_sunrise)
- **Authors**: Greg Zaal (HDRI), Rico Cilliers (backplates)
- **Licence**: [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)
- **File**: `public/hdri/pink-sunrise.hdr` (1k)

Lighting *and* sky. Loaded as a local drei `<Environment background>` so the stone, brass, and marble pick up a real sunrise instead of a lilac viewport. A thin horizon veil keeps the haze. Distinct from Ochre Gallop’s Qwantani dusk and Fairday Walk’s Kloofendal sky.

## Code

MIT — see the repo [LICENSE](../../LICENSE). Layout, HUD, and the wood / stone / metal controller stay original work.
