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
4. **Part metadata** — Use `userData.component` and `userData.part` in GLB to organize pieces into systems
5. **Raycasting for selection** — Three.js raycaster for click-to-select pieces

This implementation follows those patterns while using different models and styling.

## 3D Model Sources

### Current Demo
- **Procedural geometry** — Fallback demo car built from code (no external assets)
- Used when `/models/car.glb` is not present

### Recommended CC-BY Sources

1. **WolfGames36 on Sketchfab** (CC-BY, separated parts)
   - [CHRYSLER C300 IMPROVED](https://sketchfab.com/3d-models/chrysler-c300-improved-bd1143b6e5f34f419c636c05fdaa6664)
   - [FORD MUSTANG IMPROVED](https://sketchfab.com/3d-models/ford-mustang--improved-88775b874f094f9eb946d198cf851786)
   - [CHALLENGER SRT](https://sketchfab.com/3d-models/challenger-srt-36e48dc32e6442f3bd2885801070557d)
   - These models have separated meshes (windows, doors, hood, wheels, lights, etc.)
   
2. **BlendKit Royalty Free** (Commercial use allowed, attribution required)
   - [Model X by cgi Moon](https://www.blendkit.com/asset-gallery-detail/983e8f94-5a56-44a4-94d9-eed5e4cdcd6c/) (used by ashemag)
   - Requires BlendKit account and manual download

### How to Add Your Own Model

1. Download a multi-part car GLB from Sketchfab (CC-BY) or BlendKit (Royalty Free)
2. Place it at `public/models/car.glb`
3. Optionally add `userData.part` metadata to meshes in Blender:
   ```python
   # In Blender Python console
   obj = bpy.context.object
   obj["part"] = "body"  # or "wheels", "doors", etc.
   ```
4. The app will automatically load and explode it

## License Notes

- **This code**: MIT License (see LICENSE in repo root)
- **ashemag's code patterns**: Referenced for educational purposes, not copied verbatim
- **3D models**: Subject to their own licenses (CC-BY, Royalty Free, etc.) — always attribute the original creator
- **BlendKit Royalty Free**: Allows use in apps; do NOT resell models as asset packs
- **Sketchfab CC-BY**: Requires attribution; check individual model licenses

## Attribution Requirements

If you use WolfGames36's models, include:
> 3D model "[Model Name]" by WolfGames36, improved version of original by [Original Creator], licensed under CC-BY 4.0

If you use BlendKit models, include:
> 3D model by [Artist Name] on BlendKit, used under BlendKit Royalty Free license

---

Built by Johnny Huynh • Inspired by @ashebytes' viral exploded car demos • Educational/research only — not production code
