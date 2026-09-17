# Incident: One-Root Steam Merge Rebuilt Earth and V8

**Date**: 2026-09-17  
**Component**: Vercel projects on `johnnyhuy-dev` (`team_qBCPdqU9J1cQDL4rkrFsjNoa`)  
**Severity**: Medium (Hobby quota burn, not a runtime bug)  
**Status**: Documented. In-repo `ignoreCommand` added for the six leaky Roots. Do not create projects. Do not redeploy.

I verified this read-only against the Vercel API on 2026-09-17. I did **not** create a project or force a redeploy.

---

## What Happened

PR #73 was a steam-atlas-only README Root-touch. Squash tip `78639f2c` (`docs(procedural-steam-atlas): Root-touch so production leaves #72 miss`). Expected: only `vibes-steam-atlas` production READY. Siblings should CANCELED via `ignored-build-step`.

Actual leak: linked Roots **without** `ignoreCommand` also cut production READY on that same steam commit.

| Project | Id | Deploy | State on `78639f2c` |
| --- | --- | --- | --- |
| `vibes-steam-atlas` | `prj_7D08PT8sdUjhigCEuz83oltZrDMv` | `dpl_2mbjudDXbLyX51ZpodtFHspoCinz` | READY (intended) |
| `vibes-earth` | `prj_SiIJCJMag4TvYUYp8qjzuZ5EIRLe` | `dpl_9bqUtJcDFH8FSopEv8HYf9qFHcSR` | READY (leak) |
| `vibes-v8` | `prj_7Em98GNdH9nceT1LonpntoCgNgRY` | `dpl_NdfXkL3MZk5EBoaW8M5NdqBPXxaQ` | READY (leak) |
| `vibes-explode` | `prj_bkyEqYqsAhAk0ZrVnhXi9Him98Fb` | `dpl_Ft3DX6wAWP4dD49Lqxn8K69EdSbV` | READY (same leak class) |
| `vibes-physics` | `prj_Ilh5mBV0g7m7btvnxnhZuFY5ZjiH` | `dpl_J36gZ6vuKYbemNyohoFsEWWQ6QPL` | READY (same leak class) |
| `vibes-blender-semicircle` | `prj_PLhnoCVRKmpHc8SxyLRmcp3MFZMC` | `dpl_4S8U9bsEDZzA1opYCB8QedU46DGS` | READY (same leak class) |
| `vibes` (web-3d) | `prj_4b6cXKJVxCYNTn6WuofofmkBZPX6` | `dpl_AsHq2JSSEXq7XG7qrSXZWs2KU4nY` | READY (same leak class) |
| `vibes-japanese-tower` | `prj_T1KL4cJSMuY0Z6oKGnNtv8zVP0Js` | `dpl_3fXwZ6fV19p3tAXBLsJF7BFbnV7v` | CANCELED (control) |

Git meta on every row is the steam-atlas Root-touch message. Vercel commit messages are the git hook, not the app.

## Why The Hunch Holds

`experiments/earth-timeline/` and `experiments/v8-cutaway/` had **no** `vercel.json`. Linked Roots with a dashboard Root Directory still build on every `main` push when `ignoreCommand` is missing. That is why earth and v8 went READY on a steam-only commit.

`experiments/explode-assembly/` and `experiments/web-physics/` were the same gap (no `vercel.json`). `experiments/blender-semicircle-viewer/vercel.json` and `experiments/ai-3d-lanes/web-3d/vercel.json` existed but had no `ignoreCommand`, so they rebuilt too.

`experiments/japanese-tower/vercel.json` already had:

```
ignoreCommand: git diff --quiet HEAD^ HEAD ./
```

Tower's folder did not change, so Vercel skipped. CANCELED with `ignored-build-step`. Same skip on glass, scroll, audio, grass, courtyard, and the other Roots that already shipped ignore.

## Missing Ignore (fixed in-repo)

I added or updated `vercel.json` in exactly these six folders so each matches steam-atlas / tower (no `"//"` comment key):

1. `experiments/earth-timeline/` (new file; Root for `vibes-earth`)
2. `experiments/v8-cutaway/` (new file; Root for `vibes-v8`)
3. `experiments/explode-assembly/` (new file; Root for `vibes-explode`)
4. `experiments/web-physics/` (new file; Root for `vibes-physics`)
5. `experiments/blender-semicircle-viewer/vercel.json` (add `$schema` + `ignoreCommand`)
6. `experiments/ai-3d-lanes/web-3d/vercel.json` (add `ignoreCommand`; Root for project `vibes`)

Already had ignore before this pass: procedural-steam-atlas, japanese-tower, glass-capability-brain, scroll-product-showcase, audio-gadget-spin, procedural-grass-field, cinder-mere, kiln-studs, alba-forum, brine-causeway, breakwater, chinese-courtyard, ballance-roll, foil-tilt-card, zephyr-vale, nacre-loom, heartwood-warden, moon-dumpling-relay, amber-longeron.

## Rule

**One-Root merges must not fan out.** A README Root-touch in one experiment is meant to rebuild that one project. Every sibling with a linked Root and no `ignoreCommand` burns a Hobby slot and can rewrite production.

`ignored-build-step` is the success signal for untouched Roots. READY on a sibling after a one-folder commit is a leak.

I am **not** retrying deploys. I am **not** creating projects. The next `main` push that does not touch those six folders should CANCELED-skip them.

## Related

- [Glass auto-deploy on the tower merge](./2026-09-08-glass-auto-deploy-on-tower-merge.md)
- [Vercel Root Directory hints](../deployment/vercel-root-directories.md)
- [steam-atlas Root / ignoreCommand](./2026-09-08-steam-atlas-wrong-root.md)
- [Quota burn](./2026-09-07-vercel-deploy-quota.md)
- [`vercel.json` `"//"` comment key](./2026-09-09-vercel-json-comment-key.md)

---

**Author**: Johnny Huynh  
**Last updated**: 2026-09-17
