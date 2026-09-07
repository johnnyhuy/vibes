# Reverse Engineering: Audio Gadget Product Spin

**References**:
- [Xr0ud](https://x.com/Xr0ud/status/2096982574132297791) — Claude + Three.js product-spin marketing sites (verified 2026-09-07 via X API, post id `2096982574132297791`)
- [mrblackstudio](https://x.com/mrblackstudio/status/2096893411395600782) — stylised over-ear headphones (Blender MCP; glass cup, orange grille)
- [Gilbert93533589](https://x.com/Gilbert93533589/status/2096920288319435154) — Work Louder × Figma macro pad with synced click sounds
- Video thumb (treat cautiously): `https://pbs.twimg.com/amplify_video_thumb/2095956042580733952/img/KV9CA6IUTR5W73wG.jpg` (576×1024)

**Study date**: 2026-09-08  
**Status**: **Built** — `experiments/audio-gadget-spin/` (Lumen Cuff). Clean-room only. This is the same file that started as a parking stub.

**Disclaimer**: I have not copied their code, product shots, meshes, or branding.

---

## What The Posts Show

### 1. Xr0ud — marketing spin

@Xr0ud argues that Claude Opus + Three.js + Claude Code can now produce most of an **audio-gadget marketing site**: the old “product spin” (orbit a headphone / speaker, studio lighting, scroll-tied copy) used to mean a studio model plus a WebGL engineer.

The public copy is about **input data → a spin experience**, not about a Japanese tower. Different pattern.

The 576×1024 amplify thumb I pulled earlier is a **loft / architecture scroll** (“SCROLL TO EXPLORE”, misty house). I still do not treat that frame as a headphone spec. The *tweet text* is the brief: dark studio, product on a turntable, frosted marketing chrome.

**Stack guess**: Vite or Next, Three / R3F, OrbitControls auto-rotate, HDRI or strip lights, HTML overlay. I did not inspect their source.

### 2. mrblackstudio — stylised over-ear

A composed headphone: thick matte headband, silver sliders, squircle cups, sage pads, one cup with a **clear shell over a perforated orange driver**. Soft studio lighting. This is a *geometry language* (primitives + materials), not a brand silhouette I should clone.

**Stack guess**: Blender MCP → mesh or render. I skipped Blender this pass (same call as ADR-0009).

### 3. Gilbert — product hero + sound-on

A compact macro pad still: frosted shell, black keys, a knob, a knurled wheel, and the post talks about **synced click sounds**. The lesson I took is “the object makes a sound when you poke it”, not their keycap CAD or Work Louder marks.

**Stack guess**: Blender still + a web page, or a real-time viewer with sampled clicks. I used oscillators instead of samples.

## Clean-room mapping

| Their pattern | What I shipped |
| --- | --- |
| Dark product-spin marketing site | Black stage, Lightformers, frosted overlay, `vibes · audio spin` |
| Stylised over-ear with a glass driver window | Invented **Lumen Cuff / 環** — tube + RoundedBox + canvas grille |
| Click sounds on interaction | Web Audio oscillators, **mute ON by default** |
| Brand mesh / GLB / stills | None. Primitives only |

## What I did NOT copy

- No Sony / Apple / Bose / Work Louder / Figma silhouette or wordmark
- No Xr0ud client names, loft poster, or “LOFT THIRTY ONE” type
- No mrblackstudio mesh, orange-driver photograph, or Blender file
- No Gilbert keycap icons, “Little Big Shortcuts” lockup, or sampled clicks
- No proprietary GLB
- No new Vercel project

## Why procedural (not a GLB)

Educational repo. ADR-0004 already prefers primitives when the lesson is construction. A headphone is mechanical enough: tubes, squircles, a painted grille. See [ADR-0010](../adr/0010-procedural-audio-spin-mute-default.md).

---

**Author**: Johnny Huynh  
**Last updated**: 2026-09-08
