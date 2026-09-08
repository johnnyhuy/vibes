# Reverse Engineering: Drone / FC assembly scrubber (pattern only)

**References**:
- [Peter05704721](https://x.com/Peter05704721/status/2097144569989300371) — public pitch: GPT-6 Astra knocked out a Three.js assembly view for a drone / flight-controller build — step scrubber, parts coming together, explore the completed aircraft, Replay. (2026-09-08; post id `2097144569989300371`)
- Public live advertised in the task / post: [https://s3-px4-assembly.pages.dev](https://s3-px4-assembly.pages.dev). I read the *pitch*, not the running app’s source.
- Video thumb: local copy `hill-climb/refs/px4-assembly-x-thumb-20260908.jpg` when present. Mood only — white studio, a completed trainer, a bottom scrubber reading as “done.” I did not rebuild their quad or copy their 12/12 strings.

**Study date**: 2026-09-08  
**Status**: **Built** — `experiments/keel-hex/` (Keel Hex / 龙骨盘, KH-55 / Spool Plate / 卷盘板). Clean-room only.

**Disclaimer**: I studied the public post text and the X video thumb. I did **not** scrape s3-px4-assembly.pages.dev, fork a repo, copy a part catalog, restyle their chrome, or reuse PX4 / S3 / OEM flight-controller names. This demo is first-person Johnny Huynh / vibes — it is **not** that live site.

---

## What The Post Is

@Peter05704721 wrote that GPT-6 Astra produced a Three.js assembly view. The clip promises a scrubber, parts arriving in order, a finished aircraft you can explore, and Replay. The t.co / Pages URL advertises the live product. I did not unwind it into their bundle.

## What The Thumb Teaches

Observed *read* (pattern only — I am not restating their chrome as a spec):

- A white / off-white studio, not a dusk basin
- One completed trainer, three-quarter, soft ground shadow
- A frosted bottom dock with a scrubber and a “done” mark
- The viral object is **walk the aircraft together, then orbit it**

**Strings and frames I will not reuse:**

S3, PX4, OEM flight-controller nouns, their “from board to aircraft” line, their language chip, their Exit-guide chrome, their part catalog, their quad silhouette as a spec.

So the lesson is **authored marks + a white bench + a scrubber**, not a clone of that Pages app.

## What I Inferred

| Their pattern | Inference | Confidence |
| --- | --- | --- |
| Step scrubber | Discrete marks + a range control | High (post text + thumb) |
| Parts coming together | Per-step visibility / arrive | High (post text) |
| Explore completed aircraft | Orbit on the sealed trainer | High (post text) |
| Replay | Reset to mark 1 and walk | High (post text) |
| White studio | Soft key + contact shadow | High (thumb) |

I did **not** confirm any of that against their source.

## What I Invented

| Their pattern | What I shipped |
| --- | --- |
| Their quad / FC catalog | **KH-55 / Spool Plate** — hex deck, six keel spars, Nest Board, Spool Cell |
| Their 12/12 copy | Twelve marks I named (Bench complete, not their heading) |
| Their HUD / brand | Frosted 2026-09-08 glass, brand `vibes · keel hex` / 龙骨盘 |
| GPT-6 Astra pipeline | Vite + R3F only. No API |
| Their live Pages app | Nothing fetched from that host |

## What I did NOT copy

- No files, network calls, or assets from s3-px4-assembly.pages.dev
- No PX4 / S3 / OEM names, colours, or part numbers
- No language selector, no Exit-guide string
- No new Vercel project

## Why this experiment

Explode-assembly already taught a **parts explode**. Kiln Studs taught a **brick stepper**. Japanese-tower taught a **lift**. The missing kitchen-sink lesson is **step-sequenced aircraft assembly** on a white bench, distinct from a Tesla isolate.

See [ADR-0023](../adr/0023-keel-hex-assembly.md).

---

**Author**: Johnny Huynh  
**Last updated**: 2026-09-08
