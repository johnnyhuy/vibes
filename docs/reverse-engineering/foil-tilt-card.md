# Reverse Engineering: Layered Holo Tilt Card

**References**:
- [EverettFish](https://x.com/everettfish0408/status/2096765359282061544) — “开源一个新Skill：3D镭射卡片生成 … 真人照片能做，动漫立绘也能做，卡牌转起来闪出全息光很像小时候攒的干脆面卡。” (verified 2026-09-08 via X API, post id `2096765359282061544`)
- Public repo README claims: [EverettFish/holo-card-studio](https://github.com/EverettFish/holo-card-studio). I read the **README only**. I did not clone the tree, open `SKILL.md`, `scripts/`, or `assets/web-template/`, or paste their files.
- GitHub OG still: `https://opengraph.githubassets.com/…/EverettFish/holo-card-studio`. Local copy: `hill-climb/refs/holo-card-github-og-20260908.png`. Mood only — glow-on-dark silhouette, not a subject I will redraw.

**Study date**: 2026-09-08  
**Status**: **Built** — `experiments/foil-tilt-card/` (Lumen Fox · No.042 / 流光狐). Clean-room only.

**Disclaimer**: I studied the public post text, the attached / public OG still, and the GitHub README *claims*. I did **not** copy their source, Blender pipeline, web-template, Chinese tutorial body, Pokémon / IP subjects, or packaging. This demo is first-person Johnny Huynh / vibes — it is **not** Holo Card Studio.

---

## What The Post Is

@everettfish0408 pitched a Codex skill: GPT-class image generation plus Blender automation, so a laser / holo trading card becomes “one sentence.” Live photos and illustrations both work. When the card turns, the holographic flash reminded them of snack-box chase cards.

The t.co unwind is the public GitHub repo. The README markets a four-layer art stack, a Blender scene with parallax + laser material, and a Three.js page you can drag, flip, and slider-tune.

The *pattern* is “layered print + view-dependent foil + tilt / flip,” not a Codex skill I am allowed to ship, and not their demo characters.

## What The Thumb / README Claims Teach

Observed *read* (pattern only — I am not restating their chrome as a spec to clone):

- A vertical trading-card proportion, slightly tilted so layers separate
- Four named art layers: subject forward, background back, lineart, text on the surface
- A rainbow / laser sheen that walks with the view
- Drag to tilt, flip to a reverse, sliders for the flash
- A dark studio, thin gold rules, editorial copy beside the card

**Strings and frames I will not reuse:**

Holo Card Studio, their Xiaohongshu tutorial credit, `SKILL.md`, `card.blend`, `card-config.json`, `web-template`, their Chinese control labels, their factory defaults (subject scale 1.25 / depth 0.4 / background −0.25), Pokémon or other IP, their demo subjects, “MAKE IT YOURS.”

So the viral object is **a layered card you can tilt until it rainbows**.

## What I Inferred

| Their pattern | Inference | Confidence |
| --- | --- | --- |
| Four PNG planes | Same UVs, different Z | High (README diagram) |
| Subject / background depths | Parallax from Z offset + a little XY slip | High (public claim) |
| Laser follows the view | Fresnel / view-vector phase, not a baked GIF | High (they say phase follows the view) |
| Flip | Parent Y rotation; a second print on the back | Medium |
| Blender + Three.js | Same layer recipe in two runtimes | High (README) |
| Sliders | Uniforms for foil and parallax | Medium |

I did **not** confirm any of that against their source.

## What I Invented

| Their pattern | What I shipped |
| --- | --- |
| Photo / illustration → Blender skill | **Runtime canvases** — I draw the four layers in `layers.ts` |
| Their demo subjects / IP | **Lumen Fox · No.042 / 流光狐** — geometric moon-fox, three light plumes, crescent chest |
| Blender laser nodes + Voronoi stars | A **fresnel foil shader** I wrote (`foilShader.ts`) + a hash sparkle |
| Their depth / scale factory numbers | **Foil / tilt feel / spread** with my defaults (0.68 / 0.92 / 0.30) |
| Their reverse + QR | Invented **hex seal + deco lattice** and motto *light that remembers* |
| Their HUD / brand / 正面 | Frosted 2026-09-08 glass, brand `vibes · foil tilt card`, **recto / verso** |
| Codex skill + `card.blend` | Vite + R3F only. No Blender, no skill pack |

## What I did NOT copy

- No files from `EverettFish/holo-card-studio`
- No `SKILL.md`, Blender scripts, web-template, or `card-config.json`
- No Pokémon / their demo subjects / Chinese tutorial prose
- No their slider nouns or factory depths
- No new Vercel project

## Why this experiment

Nacre Loom already taught a retunable film. Heartwood Warden taught a playable reconstruction. This pass is the missing **handheld print**: four planes, a view-tied rainbow, and a flip — enough to learn the holo-card *pattern* without shipping their pipeline.

See [ADR-0016](../adr/0016-runtime-foil-card-without-blender.md).

---

**Author**: Johnny Huynh  
**Last updated**: 2026-09-08
