# Reverse Engineering: img2threejs monster-tree showcase

**References**:
- [NickDevFE](https://x.com/NickDevFE/status/2096946586781692297) — “img2threejs × GPT-6 Astra × Hyper3D / Image → Hyper3D → img2threejs → GPT-6 Astra → Interactive Three.js experience” (verified 2026-09-07 via X API, post id `2096946586781692297`)
- Live marketing URL from the post: [https://img2threejs.io/#/x/monster-tree](https://img2threejs.io/#/x/monster-tree) — exhibit title there is “Groot — Heart of the Forest”
- Video thumb attached to the post: `https://pbs.twimg.com/amplify_video_thumb/2096943840838193152/img/LOlXKpGYZbPCG-yU.jpg` (1920×1080)
- Thread clarifications (same conversation, verified via X API):
  - Skins via Hyper3D, then handed to img2threejs (`2096950738555634001`)
  - Showcase performance is intentionally unoptimised (`2096961252413317274`)
  - Next focus is environments / construction, not a game (`2096960714938446055`)
  - VFX prompt from their repo seeded a forest; later iterates were short asks (`2096970295131488475`)

**Study date**: 2026-09-07  
**Status**: **Built** — `experiments/heartwood-warden/` (Heartwood Warden / 心木守). Clean-room only.

**Disclaimer**: I studied the public post text, the public thread, and the marketing title on the live hash route. I did **not** download their JS bundles, clone img2threejs showcase source, paste a generated factory, or reuse their skins / wordmarks / chrome. This demo is first-person Johnny Huynh / vibes — it is **not** their monster-tree exhibit, and it is **not** Marvel Groot.

---

## What The Post Is

@NickDevFE pitched a workflow, not a finished game engine: one image becomes a Hyper3D skin, img2threejs rebuilds editable procedural Three.js, GPT-6 Astra wraps that into an interactive experience. The t.co live link is the monster-tree hash route. Public author bio is “Creator of img2threejs.”

The *pattern* I wanted is “a playable woodland character whose body and VFX are code, plus a reminder that the pipeline emits editable Three.js — not a GLB dump.”

`experiments/image-to-3d/` already maps mesh providers. I left it alone. This pass is a showcase you can walk, not another client.

## What The Public Pitch Shows

Observed *read* (pattern only — I am not restating their chrome as a spec to clone):

- Moonlit forest stage, not a black car studio
- A living-wood hero you can walk (WASD) and sprint (Shift)
- Number keys `1`–`0` layer cast VFX
- Soft lantern spirits that follow and light a path
- Marketing title on their route: “Groot — Heart of the Forest”
- A surrounding product frame (gallery / viewer chrome) that I will not copy

I treated those as a *playable woodland pattern*, not a character to redraw.

## What I Inferred

| Their pattern | Inference | Confidence |
| --- | --- | --- |
| Image → Hyper3D → img2threejs | Skins / mesh look come from Hyper3D; img2threejs emits a TypeScript `Group` factory | High (Nick said so) |
| Editable Three.js, not a GLB dump | The lesson is reconstruct-by-code, then wrap controls | High (public README + post) |
| WASD + Shift + 1–0 | Third-person or orbit-follow controller + a cast table | Medium |
| Lantern spirits | Cheap emissive orbs + a few point lights, attracted to the hero | Medium |
| Unoptimised on purpose | Many lights / effects at once; not a production budget | High (Nick said so) |
| Next: environments | The character is a demo of the pipeline; world-building is the next product push | High (Nick said so) |

I did **not** confirm any of that against their bundle.

## What I Invented

| Their pattern | What I shipped |
| --- | --- |
| Groot / Heart of the Forest | **Heartwood Warden / 心木守** — shrine guardian, carved mask, amber resin well, crescent of bare twigs. No leafy toddler, no borrowed name |
| Hyper3D skins | No skins. One procedural composite. Bark plates + moss seams only |
| img2threejs factory | Hand-authored R3F groups. `Warden.tsx`, `Glade.tsx`, `CastField.tsx` |
| Their cast list / VFX names | Vine lash, spore bloom, root pulse, amber heart, moss veil, canopy bind, lantern call, night dew, heartwood choir, moon graft |
| Product gallery chrome / “Open full viewer” | Frosted 2026-09-08 HUD: topbar, left editorial, right cast desk, optional snippet. Brand `vibes · heartwood warden` |
| Their generated source pane | `buildWardSnippet()` — my JSON shape + a short `rootPulse()` helper |
| Unoptimised kitchen sink | Modest budget: 20 trees, 7 spirits, 3 spirit lights, one moon shadow map, throttled VFX ticks |

## What I did NOT copy

- No Groot likeness, name, or wordmark
- No img2threejs source, factory, skins, or thumbnail rail
- No “Open full viewer” marketing frame
- No Hyper3D asset URLs as runtime meshes
- No new Vercel project

## Why this experiment

The provider notebook teaches APIs. Nacre Loom teaches a retunable glass core. This pass teaches the missing **playable procedural character**: gait from sines, a glade from primitives, casts as layered code, and a snippet that admits it is generated *here*.

See [ADR-0014](../adr/0014-heartwood-warden-procedural-showcase.md).

---

**Author**: Johnny Huynh  
**Last updated**: 2026-09-07
