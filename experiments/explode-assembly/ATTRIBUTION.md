# Attribution

This exploded view demo is inspired by ashemag's viral X/Twitter posts and open-source work.

## Inspiration & Code Patterns

- **[ashemag/model-x-studio](https://github.com/ashemag/model-x-studio)** — Interactive Tesla Model X with 334 mesh pieces
  - Explosion layout algorithm (2D grid packing, projection-based positioning)
  - Part highlighting and isolation UX
  - React + Three.js + R3F architecture
- **[ashemag/human-atlas](https://github.com/ashemag/human-atlas)** — Similar pattern with BodyParts3D CC-BY meshes

### What We Learned from ashemag

1. **Multi-mesh GLB structure** — The trick is having a 3D model split into many separate mesh islands (100s of pieces), not a single merged mesh
2. **Explosion layout** — Project each mesh's bounding box onto a 2D plane, pack into a grid, calculate translation vectors
3. **Smooth transitions** — Lerp between assembled (original position) and exploded (grid position) based on slider value
4. **Part metadata** — Use `userData` properties to organize pieces into systems
5. **Raycasting for selection** — Three.js raycaster for click-to-select pieces

This implementation follows those patterns while using different models and styling.

## 3D Model Source

### Tesla Model 3

- **Model**: Tesla Model 3
- **Author**: David_Holiday
- **License**: CC Attribution 4.0 International (CC-BY-4.0)
- **Source**: https://sketchfab.com/3d-models/tesla-model-3-123c10f376ec4f18b93c73afc382808b
- **Downloaded via**: https://github.com/pakagronglb/tesla-3d-showcase (MIT licensed repo with proper attribution)
- **File**: `model3_scene.glb` (289 KB)

**Attribution Required (CC-BY-4.0)**:
> "Tesla Model 3" by David_Holiday is licensed under CC Attribution 4.0 International
> https://sketchfab.com/3d-models/tesla-model-3-123c10f376ec4f18b93c73afc382808b

**Also Used By**:
- pakagronglb/tesla-3d-showcase — Interactive Model 3 showcase (MIT repo)
- This demo — Exploded view educational recreation

### Disclaimer

This is an **unofficial educational recreation** of Tesla Model 3 architecture. Not affiliated with, endorsed by, or connected to Tesla, Inc.

All mesh organization and system mapping (body, glass, doors, battery, motors, etc.) is inferred from the 3D model structure and publicly available Tesla specifications. This is a learning tool to demonstrate explosion layout algorithms, not an official Tesla parts catalog.

## License Notes

- **This code**: MIT License (see LICENSE in repo root)
- **ashemag's code patterns**: Referenced for educational purposes, explosion algorithm implementation
- **Tesla Model 3 3D model**: CC-BY-4.0 by David_Holiday — attribution required, modifications allowed
- **pakagronglb/tesla-3d-showcase**: MIT license (repo that hosts the GLB with proper attribution)

## Required Attribution

When using this demo or the Model 3 GLB:

```
"Tesla Model 3" 3D model by David_Holiday
Licensed under CC Attribution 4.0 International (CC-BY-4.0)
Source: https://sketchfab.com/3d-models/tesla-model-3-123c10f376ec4f18b93c73afc382808b

Explosion layout patterns inspired by ashemag/model-x-studio
Code: MIT License
```

---

Built by Johnny Huynh • Inspired by @ashebytes' viral exploded car demos • Educational/research only — not production code • Not affiliated with Tesla, Inc.
