# Attribution

v8-cutaway keeps invented chrome (gauges, firing-order dots, glass dock). The hero mesh is a licensed V8, not procedural boxes.

## 3D model

- **Model**: Animated Engine V8
- **Author**: [meeww](https://sketchfab.com/meeww)
- **Licence**: [CC Attribution 4.0](http://creativecommons.org/licenses/by/4.0/)
- **Source**: https://sketchfab.com/3d-models/animated-engine-v8-b0dbf778b81e4afba4edf11336e2a099
- **Vendored via**: [allenai/objaverse](https://huggingface.co/datasets/allenai/objaverse) (`glbs/000-158/b0dbf778b81e4afba4edf11336e2a099.glb`) — per-asset licence remains CC-BY-4.0
- **File**: `public/models/v8-engine.glb` (Draco; meshes left unjoined)

**Required credit (CC-BY-4.0)**:
> "Animated Engine V8" by meeww is licensed under CC Attribution 4.0 International
> https://sketchfab.com/3d-models/animated-engine-v8-b0dbf778b81e4afba4edf11336e2a099

The author also wrote on the Sketchfab page that the mesh may be used freely; credit is still required by CC-BY and is kept here.

No Meshy / Tripo / Rodin key was available on this agent, so this is the Sketchfab CC-BY lane from [high-fidelity-mesh-pipeline.md](../../docs/reverse-engineering/high-fidelity-mesh-pipeline.md). Kenney was not used as the hero.

Also considered (CC-BY, not vendored):

- [Disassembled V8 Engine Block](https://sketchfab.com/3d-models/disassembled-v8-engine-block-3026bd87ca3945d6829d24c86ce695f0) by Tomaso — 2.2M triangles, too heavy for the live demo
- [V8 Engine Block](https://sketchfab.com/3d-models/v8-engine-block-b4fc8594f93644209554ed2e0ef7117e) by wahyu_wibowo — five meshes, block-only

## HDRI (CC0)

- **Asset**: [Studio Small 09](https://polyhaven.com/a/studio_small_09)
- **Author**: Sergej Majboroda
- **Licence**: [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)
- **File**: `public/hdri/studio.hdr` (1k)

Used as a drei `<Environment>` so the PBR maps read as studio metal instead of a grey viewport.

## Code

MIT — see the repo [LICENSE](../../LICENSE).
