# Attribution — Ochre Gallop

## Inspiration (pattern only)

- [@BrenBuilds](https://x.com/BrenBuilds/status/2097221820743139824) — public post: a chase game that grew from a flat slice into three environments, built with Astra, Three.js, and Blender. Verified 2026-09-08 via X API, post id `2097221820743139824`.
- Live they advertised: `bison-breakaway.brenhq.com` — public page title / t.co card only (*A Yellowstone Chase*; “One bison. Three ways to run.”). Feel / “three biomes + a chase loop” only.
- Feel-only menu still: `hill-climb/refs/bison-breakaway-20260908-1824.png` when attached. Interaction pattern only (tabs + poster + play). I did not copy the illustration, park nouns, or CTA.

I did **not** fetch that live site into this repo, decompile their bundle, or copy meshes, textures, HUD chrome, mode names, poster art, or park branding. Ochre Gallop / 赭奔, Ashmane / 灰鬃, Sulfur Terrace, Spout Basin, Rim Overlook, Ribbon Cut, Plume Break, and Shelf Drift are mine.

## 3D model (CC0)

- **Asset**: [Horse Statue 01](https://polyhaven.com/a/horse_statue_01)
- **Author**: Rico Cilliers
- **Licence**: [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)
- **File**: `public/models/ashmane.glb` (2k PBR, Blender-cleaned)

Photogrammetry figurine. I dropped the wooden puck and the ceramic disc, kept the loose body islands as separate meshes, put the origin on the hind hooves, and pointed the nose +Z. Runtime lerp tints the porcelain toward umber so Ashmane still reads as the invented runner, not a mantelpiece. Rico posed it collected on the hind legs. The stride is a bound, not four sine boxes.

Sketchfab had better standing CC-BY horses (GentryHS / kenchoo rebuilds). Their download API needs an account token I do not have in this environment. Meshy / Tripo were not available. Poly Haven is the clean-room download I can stand behind.

Credit is not required under CC0. I still name the source so the hero mesh is inspectable.

## HDRI (CC0)

- **Asset**: [Qwantani Dusk 2](https://polyhaven.com/a/qwantani_dusk_2)
- **Author**: Greg Zaal
- **Licence**: [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)
- **File**: `public/hdri/qwantani-dusk.hdr` (1k)

Lighting only. Distinct from the sunset / harbour / studio HDRIs in sibling experiments.

Terrain, loops, and HUD copy stay original work under the repo MIT licence.

## Code

MIT — see the repo [LICENSE](../../LICENSE).
