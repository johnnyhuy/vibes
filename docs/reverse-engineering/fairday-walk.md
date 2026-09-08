# Reverse Engineering: photo→3D memory walk (pattern only)

**References**:
- [@anyumeng28](https://x.com/anyumeng28/status/2097175519825383852) — GPT-6 Astra modelling feel; Three.js photo→3D; ~50% Plus weekly quota; Blender refinement mentioned; old photos into a 3D webpage so a memory can be walked again. (verified 2026-09-08 via X API, post id `2097175519825383852`)
- Live they linked: [https://qingtian-memory-3d.anyumeng28.chatgpt.site](https://qingtian-memory-3d.anyumeng28.chatgpt.site) — public page title *晴天 · 风里的记忆*. Feel only.

**Study date**: 2026-09-08  
**Status**: **Built** — `experiments/fairday-walk/` (Fairday Walk / 晴巷 · 风里的册页). Clean-room only.

**Disclaimer**: I studied the public post text and the live *read* (soft outdoor memory diorama, walk / orbit / reset, lighting intensity). I did **not** download or decompile their JS, copy meshes, textures, CSS, HUD strings, routes, or branding. This demo is first-person Johnny Huynh / vibes — it is **not** 晴天 · 风里的记忆 / 风里的记忆 NO. 001.

---

## What The Post Is

@anyumeng28 wrote that people say GPT-6 modelling is strong, and you only feel it when you use it: Three.js turned pictures into a 3D version, about half a Plus weekly quota. After Blender — or if the quota is enough — old photos can become a 3D webpage, so a memory can be immersive again. The t.co unwinds to `qingtian-memory-3d.anyumeng28.chatgpt.site`. Public metrics at study time: 18 impressions, 1 like. Clear pattern, small post.

## What The Live Read Shows

Observed *read* (pattern only — I am not restating their HUD copy or domain chrome as a spec):

- Soft outdoor memory diorama on a floating plot
- Drag orbit, wheel zoom, a reset gesture
- A lighting / weather-intensity axis
- Bottom mode pills
- Photo→3D density rather than toy boxes

I will not reuse their title, NO. 001, lighting-ref nouns, or weather chrome.

The viral object is **an old-photo memory you can walk**, not a chalk landmark tour and not a harbour walker.

I will not reuse their title, place nouns, or logo.

## Why This Pattern Exists

A still photo is a postcard. A camera that walks an invented folio, then lets you orbit the current place, is a lesson:

```
scroll 0 → 1     →  pose lerp across authored stops
current stop     →  name + caption
Explore          →  orbit + zoom that place
Leave            →  return to the scroll pose
```

Alba Forum already teaches **scroll → many civic landmarks**. This experiment makes **residential memory + cloth / tile density** the lesson.

## Pattern Breakdown

### 1. Authored poses, not their path

Hypothesis: **eight Vector3 pairs + damp** is enough.

My ship:

- `itinerary.ts` lists eight invented stops
- Camera and look-at lerp with a smoothstep
- Native window scroll, fixed canvas

I did **not** lift a camera spline from their site.

### 2. Invented lane architecture

Instanced tiles, recessed windows, wind laundry, well, bicycles, pigeons, awning, ferns, fig, rain barrel. Soft shadows. Local sky HDRI. Neighbours sit on a cobble lane so travel reads; the HUD still names one stop.

Names: **Laundry Court**, **Bicycle Shed**, **Courtyard Well**, **Shop Awning**, **Window Fern**, **Rooftop Pigeon**, **Evening Laundry**, **Fig Alley**.

### 3. Orbit as a mode; Recast restores the pose

OrbitControls off until Orbit. Pointer-events on the canvas only then. Wheel zoom stays in the scene. Recast / double-click / Esc restore the authored framing.

### 4. Thin frosted HUD, fair-day paper

Brand `vibes · fairday walk`. Slip 7. Folio / Orbit / Sheetdrift / Recast pills. Invented lighting stances and a Line-haze slider (Sheet / Drift / Mist). Serif place chip. First-person caption. Inter for chrome. No chalk museum desk, no dusk harbour HUD, no copied Chinese pills.

## Clean-room checklist

| I did | I did not |
| --- | --- |
| Read the public X post + live *read* | Download or decompile their site / WebGL assets |
| Invent Fairday Walk and eight lane stops | Copy their 晴天 list, meshes, or HUD strings |
| Write original React / R3F / CSS | Copy their JS, fonts, or component tree |
| Brand as vibes · fairday walk / 晴巷 · 风里的册页 | Use their domain, logo, or 晴天 lockup |
| Cite the post as inspiration | Claim I created the original clip |

## When To Use This Pattern

### Good for

- Teaching scroll-driven camera on an outdoor street
- Explore / inspect as a second axis on the same scene
- A fair-day residential read next to chalk / kiln / harbour siblings

### Bad for

- A real family’s photogrammetry (you want their loft, which you cannot take)
- A city-scale tour (you want a researched itinerary and licensed surveys)

## What I Learnt

1. Tile instances plus hanging cloth already read as “memory lane”
2. Explore has to steal the wheel or the page keeps scrolling
3. A local HDRI under Suspense is cheaper than a blank canvas
4. Do not name the HUD after someone else’s 晴天
5. Keep it distinct from the chalk avenue and the siheyuan orbit

## Related

- Built: `experiments/fairday-walk/`
- Scroll sibling: `experiments/alba-forum/`
- Courtyard sibling: `experiments/chinese-courtyard/`

## Attribution & Ethics

- @anyumeng28 inspired this study
- I am **not** redistributing their site, video, or assets
- Geometry, materials, and UI are original
- Research and education only

---

**Author**: Johnny Huynh  
**Purpose**: Learning and education — documenting a public pattern  
**Last updated**: 2026-09-08
