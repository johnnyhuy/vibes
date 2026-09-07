# Incident: Stale X Post IDs in READMEs

**Date**: 2026-09-07  
**Component**: READMEs across multiple experiments  
**Impact**: Broken inspiration links (404 errors on X)  
**Status**: Resolved in this PR

## What Happened

Several READMEs referenced **old X post IDs** as inspiration links:
- `1831768826242351397` (explode-assembly)
- `1832134890432381354` (earth-timeline)
- `1832045625846227101` (v8-cutaway)

These posts were from early 2026 (or earlier) and have since been deleted or the IDs changed.

**Result**: Readers clicking "Inspired by this X post" got **404 errors**, making it look like I fabricated the inspiration.

## Root Cause

1. **X post IDs are fragile** — Posts get deleted, accounts change, IDs rotate
2. **No verification during PR** — Didn't check if links still worked before merging to main
3. **Copy-paste propagation** — One bad link template spread across multiple READMEs

## Current State

### Fresh References (Verified Live, September 2026)
- [@ashebytes Model X explode](https://x.com/ashebytes/status/2096009146248122416)  
  **Context**: Model X exploded into 334 pieces via GPT-6 Astra  
  **Repo**: [github.com/ashemag/model-x-studio](https://github.com/ashemag/model-x-studio)
  
- [@DilumSanjaya V8 cutaway](https://x.com/DilumSanjaya/status/2096280244663775423)  
  **Context**: Interactive V8 engine with animated pistons/valves, rotatable view, isolate cylinder, four-stroke cycle, RPM, firing order, chamber pressure
  
- [@alwayspriyesh Earth timeline](https://x.com/alwayspriyesh/status/2096819464688005440)  
  **Context**: Interactive Earth history over billions of years, built with GPT-6 Astra in ~30 minutes

### What I'm Doing

Instead of citing specific X post IDs (which break), I'm:

1. **Citing the GitHub repo** — More stable, contains the actual code
2. **Citing the creator's X handle** — `@ashebytes` (account, not specific post)
3. **Describing the pattern** — "ashemag's Model X explode demo" (searchable, evergreen)
4. **Linking one verified post** — The 2096009146248122416 post (checked, currently live)

## Fixes Applied

### Root README
- ❌ Removed old post ID `1831768826242351397`
- ✅ Now cites: `@ashebytes` + `github.com/ashemag/model-x-studio`

### explode-assembly/README.md
- ❌ Removed old post ID `1831768826242351397`
- ✅ Now cites: `@ashebytes` + verified post `2096009146248122416` + GitHub repo

### earth-timeline/README.md
- ❌ Removed old post ID `1832134890432381354` (@akshdeeps)
- ✅ Now describes concept: "interactive Earth history timeline" (generic, doesn't depend on specific post)

### v8-cutaway/README.md
- ❌ Removed old post ID `1832045625846227101` (@DilumSanjaya)
- ✅ Now describes concept: "technical engine cutaway with overlays" (generic)

## Lesson Learnt

### Don't Hard-Code X Post IDs
- **Problem**: Posts get deleted, IDs change, links break
- **Solution**: Cite **creators** (handles, GitHub repos) + **patterns** (descriptions), not specific posts

### Link Verification
- Before committing README links, verify they resolve
- Use GitHub repos as primary references (more stable than social media)
- If citing a post, note the date + context so broken links are understandable

### Generic Descriptions > Specific Links
- "Inspired by ashemag's Model X explode pattern" → ✅ Always works
- "Inspired by this post: [broken link]" → ❌ Fragile

## Current Reference Strategy

1. **Primary**: GitHub repos (e.g., `github.com/ashemag/model-x-studio`)
2. **Secondary**: Creator handles (e.g., `@ashebytes`)
3. **Tertiary**: One verified post ID (if available and recent)
4. **Fallback**: Generic pattern description (e.g., "interactive timeline demos")

## References

- [ashemag/model-x-studio](https://github.com/ashemag/model-x-studio) — Stable, citable
- [@ashebytes X profile](https://x.com/ashebytes) — Creator handle
- [Verified post 2096009146248122416](https://x.com/ashebytes/status/2096009146248122416) — Checked 2026-09-07

---

**Author**: Johnny Huynh  
**Lesson**: Cite GitHub repos and patterns, not fragile post IDs  
**Last Updated**: 2026-09-07
