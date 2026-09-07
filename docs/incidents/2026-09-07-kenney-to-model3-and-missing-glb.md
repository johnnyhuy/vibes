# Incident: Kenney Assets Rejected, Model 3 GLB Required, File Briefly Missing

**Date**: 2026-09-07  
**Component**: `explode-assembly` demo  
**Impact**: Initial PR closed after squash-merge; GLB file missing from commit history  
**Status**: Resolved

## What Happened

While building the `explode-assembly` demo, I went through several asset iterations that caused confusion:

1. **Started with Kenney.nl placeholder assets** — Simple 3D car model for prototyping
2. **Discovered Kenney's license incompatible** — Can't use for this demo's goals
3. **Switched to David_Holiday's Tesla Model 3** (CC-BY-4.0 from Sketchfab)
4. **GLB file briefly missing** — `model3.glb` wasn't tracked in Git during transition
5. **PR #1 closed after content landed on main** — Squash-merge meant individual commits disappeared

## Timeline

### Initial Iteration (Kenney Assets)
- Used Kenney.nl's "Car Kit" for quick prototyping
- Built explosion algorithm with simple car shapes
- READMEs mentioned Kenney as the asset source

**Problem**: Kenney's license requires payment for commercial use. While `vibes` is educational/non-commercial, I wanted assets with clear "always-free" licenses (CC-BY, CC0) to avoid ambiguity.

### Pivot to Tesla Model 3
- Found David_Holiday's Tesla Model 3 on Sketchfab (CC-BY-4.0)
- Downloaded via [pakagronglb/tesla-3d-showcase](https://github.com/pakagronglb/tesla-3d-showcase)
- Replaced Kenney assets with `model3.glb`
- Updated READMEs to reference Model 3 + proper attribution

**Problem**: During the transition, `model3.glb` was added to `.gitignore` temporarily (large binary file concerns), then restored. This created a gap where the file was referenced in code but not present in Git.

### PR #1 Closed, Content on Main
- Opened PR with explode-assembly work
- PR was squash-merged to main
- Individual commits (including GLB transitions) collapsed into one commit on main
- PR branch deleted, so "missing GLB" history disappeared

**Result**: Main branch has working code with `model3.glb` properly tracked, but the messy transition is invisible.

## Root Causes

1. **License confusion** — Didn't verify Kenney's license terms upfront
2. **Binary file handling** — Wasn't sure if 289 KB GLB should be in Git or not
3. **Squash-merge workflow** — Lost intermediate commit history showing the problem/fix

## What I Learnt

### License Verification
- **Always check licenses before committing to an asset** — Don't prototype with "probably OK" assets
- **Prefer CC-BY or CC0 for educational repos** — Clear, permissive, no payment ambiguity
- **Document attribution immediately** — Create `ATTRIBUTION.md` when adding third-party assets

### Binary Files in Git
- **289 KB is fine in Git** — Not large enough to worry about LFS
- **Use `.gitattributes` for GLBs** — Mark as binary to avoid diff issues
- **Don't gitignore assets the code depends on** — If code references it, commit it

### PR Workflow
- **Squash-merge is OK for clean history** — But document messy transitions in incidents
- **Update docs before closing PR** — READMEs should match the final state

## Fixes Applied

1. ✅ **`model3.glb` tracked in Git** — File is in `experiments/explode-assembly/public/models/`
2. ✅ **Attribution in place** — `experiments/explode-assembly/ATTRIBUTION.md` credits David_Holiday + CC-BY-4.0
3. ✅ **READMEs updated** — No more Kenney references, Model 3 is current
4. ✅ **This incident documented** — So the transition isn't lost to history

## Current State

- **Asset**: Tesla Model 3 by David_Holiday (CC-BY-4.0)
- **Location**: `experiments/explode-assembly/public/models/model3.glb`
- **Size**: 289 KB
- **License**: CC Attribution 4.0 International
- **Attribution**: See [ATTRIBUTION.md](../../experiments/explode-assembly/ATTRIBUTION.md)

## Remaining Cleanup

- ✅ Root README still mentions Kenney → **Needs update** (addressed in this PR)
- ✅ Old X post IDs referenced → **Separate incident** (see [2026-09-07-stale-x-post-ids.md](./2026-09-07-stale-x-post-ids.md))

## References

- [Kenney.nl](https://kenney.nl/) — Great assets, but check license terms
- [David_Holiday's Tesla Model 3](https://sketchfab.com/3d-models/tesla-model-3-123c10f376ec4f18b93c73afc382808b) — CC-BY-4.0, free to use with attribution
- [pakagronglb/tesla-3d-showcase](https://github.com/pakagronglb/tesla-3d-showcase) — Convenient download source for Sketchfab models

---

**Author**: Johnny Huynh  
**Lesson**: Verify licenses upfront, commit dependencies, document messy transitions  
**Last Updated**: 2026-09-07
