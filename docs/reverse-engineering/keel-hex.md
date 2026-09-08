# Reverse Engineering: Drone / FC assembly explorer (pattern only)

**References**:
- [Peter05704721](https://x.com/Peter05704721/status/2097144569989300371) — public pitch: GPT-6 Astra knocked out a Three.js assembly view for a drone / flight-controller build — step scrubber, parts coming together, explore the completed aircraft, Replay. (2026-09-08; post id `2097144569989300371`)
- Public live advertised in the task / post: [https://s3-px4-assembly.pages.dev](https://s3-px4-assembly.pages.dev). I read the *pitch* and a feel-only still, not the running app’s source.
- Video thumb: local copy `hill-climb/refs/px4-assembly-x-thumb-20260908.jpg` when present. Mood only.
- Later feel-only still (attached 2026-09-08): `hill-climb/refs/px4-assembly-live-20260908-1515.png` when present — white studio, left hero + Play CTA, right Assembled / Inside / Exploded tabs, explode slider, toggles, floating labels. I took the **interaction model**. I did not copy S3 / PX4 chrome, their part strings, or their quad.

**Study date**: 2026-09-08  
**Status**: **Built** — `experiments/keel-hex/` (Keel Hex / 龙骨盘, KH-55 / Spool Plate / 卷盘板). Clean-room only.

**Disclaimer**: I studied the public post text, the X video thumb, and a headed still of the live *read*. I did **not** scrape s3-px4-assembly.pages.dev, fork a repo, copy a part catalog, restyle their chrome, or reuse PX4 / S3 / OEM flight-controller names. This demo is first-person Johnny Huynh / vibes — it is **not** that live site.

---

## What The Post Is

@Peter05704721 wrote that GPT-6 Astra produced a Three.js assembly view. The clip promises parts arriving in order, a finished aircraft you can explore, and Replay. The Pages URL advertises the live product. I did not unwind it into their bundle.

## What The Live Still Teaches

Observed *read* (pattern only — I am not restating their chrome as a spec):

- A white / off-white studio, soft ground shadow
- Left hero copy + a dark Play assembly CTA
- Right numbered modes: Assembled / Inside / Exploded
- An explode-distance slider
- Toggles (labels, auto rotate, rotors, wiring, optional modules)
- Floating part labels with thin leaders
- The viral object is **walk it together, then inspect / explode it**

**Strings and frames I will not reuse:**

S3, PX4, OEM flight-controller nouns, “See it come together.”, “Concept aircraft · Real FC geometry”, their language chip, 4-in-1 ESC / 4S battery / brushless-motor-concept labels, their quad silhouette as a spec.

## What I Inferred

| Their pattern | Inference | Confidence |
| --- | --- | --- |
| Assembled / Inside / Exploded | Three view modes on one trainer | High (live still) |
| Explode distance | A 0–1 lerp on authored offsets | High (still + kitchen-sink explode) |
| Labels + leaders | Html or CSS2D callouts | High (still) |
| Play assembly | Walk discrete marks, then seal | High (CTA + earlier post) |
| Optional modules | Toggles hide/show extras | High (still) |

I did **not** confirm any of that against their source.

## What I Invented

| Their pattern | What I shipped |
| --- | --- |
| Their quad / FC catalog | **KH-55 / Spool Plate** — hex deck, six keel spars, Nest Board, Spool Cell |
| Their 12/12 / Play chrome | **Play assembly** walks twelve marks I named |
| Their modes | Same three verbs; copy and optional modules are mine (Tide vane, Sight bead) |
| Their HUD / brand | Frosted 2026-09-08 glass, brand `vibes · keel hex` / 龙骨盘 |
| GPT-6 Astra pipeline | Vite + R3F only. No API |
| Their live Pages app | Nothing fetched from that host |

## What I did NOT copy

- No files, network calls, or assets from s3-px4-assembly.pages.dev
- No PX4 / S3 / OEM names, colours, or part numbers
- No language selector
- No new Vercel project

## Why this experiment

Explode-assembly already taught a **Tesla isolate**. Kiln Studs taught a **brick stepper**. The missing kitchen-sink lesson is **step-sequenced trainer assembly plus inspect / explode**, on a white bench.

See [ADR-0023](../adr/0023-keel-hex-assembly.md).

---

**Author**: Johnny Huynh  
**Last updated**: 2026-09-08
