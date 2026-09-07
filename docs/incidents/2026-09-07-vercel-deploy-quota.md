# Incident: Vercel Deployment Quota Exhausted

**Date**: 2026-09-07  
**Time**: quota hit earlier in the day; **0 remaining** as of 2026-09-07 ~13:20 UTC  
**Reset**: **~2026-09-08 12:55 UTC** (~10:55pm AEST)  
**Severity**: Medium (blocks production deploys, not runtime)  
**Status**: Waiting for quota reset — do not retry-spam deploys

---

## Summary

Vercel hobby team `johnnyhuy-dev` hit the free tier deployment quota (`api-deployments-free-per-day` = **0 remaining**). This blocks all new production and preview deployments until **~2026-09-08 12:55 UTC** (~10:55pm AEST).

**Impact**: Recent PR merges (#6, #8, #10, #12, #13) did not get fresh production deployments. Existing production URLs serve stale HTML.

---

## Timeline

### ~21:00 AEST (11:00 UTC)
- PR #6 (explode attach rewrite) merged to main
- PR #8 (procedural-steam-atlas) merged to main
- Multiple preview builds for active PRs consuming quota

### ~21:25 AEST (11:25 UTC)
- Deployment quota exhausted (100/100)
- Vercel API returns `402 Payment Required` for new deployments
- Error: `api-deployments-free-per-day` limit reached

### Current State (21:31 AEST / 11:31 UTC)
- Production deploys blocked
- Preview deploys blocked for PR #10 (scroll-product-showcase)
- Waiting for quota reset

---

## Affected Projects

### 1. `vibes-explode` (vibes-explode.vercel.app)

**Expected**: Ordered-gallery explode (#12) + attach rewrite (#6) live  
**Actual**: Production HTML last-modified **~2026-09-07 08:58 UTC** — grey studio UI, not the #12 black / frosted gallery  
**Root cause**: Main-branch deploys after that timestamp failed or never ran because the quota was already gone

**Impact**: 
- Users see the old grey-studio explode, not the ordered black/frosted gallery
- QA of attach() / gallery work is local-only until one redeploy after reset

### 2. `vibes-steam-atlas` (no live URL yet)

**Expected**: First production deploy after PR #8 merge  
**Actual**: Zero READY deployments (or stale empty project); production HTML if any is from the same ~08:58 UTC window  
**Root cause**: First deploy returned `402` (`api-deployments-free-per-day`)

**Impact**:
- No live URL exists yet
- Root Directory **must** stay `experiments/procedural-steam-atlas` (do not point the project at the repo root)
- Experiment merged but not publicly visible

### 3. `vibes-scroll-product` (`prj_XLBiIlbjweejp9himT53bolPEMUW`)

**Expected**: Production + preview deploys after PR #10 merge  
**Actual**: Project created with Root Directory `experiments/scroll-product-showcase`; first deploy quota-blocked  
**Root cause**: Preview/production builds blocked by quota

**Impact**:
- Can't preview or ship the live URL yet
- Local testing only (`npm run build` is green)
- Do **not** retry-spam deploys until the hobby quota resets

### 4. Other Projects (vibes, vibes-earth, vibes-v8, vibes-physics, vibes-blender-semicircle)

**Expected**: Preview builds for any PR changes  
**Actual**: Blocked by quota  
**Impact**: Preview deploys fail, but production URLs still serve existing commits (not affected if no main merge happened)

---

## Root Cause Analysis

### Why Did This Happen?

Vercel free tier limits:
- **100 deployments per day** (per team)
- Counts both production AND preview deployments
- Resets every 24 hours from first deployment of the day

**Contributing factors**:
1. **Multiple active experiments** — 8 Vercel projects linked to one repo
2. **Frequent PR iterations** — Each push triggers up to 8 preview builds (one per project)
3. **Merged PRs** — Each main merge triggers up to 8 production builds
4. **Cloud Agent workflow** — Iterative development with frequent commits

**Math**:
- 3 PRs merged today (each triggers ~8 production builds = 24 deploys)
- PR #10 active with multiple commits (~3 commits × 8 previews = 24 deploys)
- Previous PR iterations throughout the day
- **Total**: Easily exceeds 100 deployments

### Why Didn't We See This Earlier?

This is the first day with:
- Multiple PR merges (3 in quick succession)
- Large number of linked Vercel projects (8 total)
- Cloud Agent iterating on multiple experiments

---

## Immediate Workarounds

### For Development

✅ **Local testing works fine**:
```bash
cd experiments/scroll-product-showcase
npm install && npm run dev
# Works — no Vercel dependency
```

✅ **Builds pass**:
```bash
npm run build
# Local Vite build succeeds
```

### For QA

❌ **Cannot test on live URLs until quota resets**

**Options**:
1. **Wait ~24h** for quota to reset, then:
   - Trigger manual redeploy for `vibes-explode` (via Vercel dashboard "Redeploy")
   - Set Root Directory for `vibes-steam-atlas` → auto-deploys
   - One deploy of `vibes-scroll-product` (project already created; #10 is on `main`)

2. **Run `vercel dev` locally** to simulate production environment:
   ```bash
   cd experiments/explode-assembly
   vercel dev  # Simulates Vercel Edge Functions (if any)
   ```

3. **Deploy preview to personal Vercel account** (if needed urgently):
   ```bash
   vercel --prod
   # Uses personal quota, not team quota
   ```

---

## Recovery Steps

### When Quota Resets (~2026-09-08 12:55 UTC / ~10:55pm AEST)

Trigger **one** deploy per project. Do not retry-spam.

**Priority 1: Fix Production URLs**

1. **Redeploy `vibes-explode` once** — should pick up #6 + #12 (ordered gallery), replacing the ~08:58 UTC HTML
2. **`vibes-steam-atlas`**: confirm Root Directory is `experiments/procedural-steam-atlas`, then one deploy from `main`
3. **`vibes-scroll-product`** (`prj_XLBiIlbjweejp9himT53bolPEMUW`): project already exists with Root Directory `experiments/scroll-product-showcase` — one first production deploy (PR #10 is already on `main`)
4. **`vibes-blender-semicircle`**: one deploy after #15 merges so bbox framing is live

---

## Prevention (Future)

### Short-Term

**Option A: Reduce project count** (not ideal)
- Consolidate experiments into fewer Vercel projects
- Use monorepo preview URLs (single project, multiple routes)
- **Downside**: Loses per-experiment isolation

**Option B: Be more selective with Vercel linking**
- Only link "showcase" experiments to Vercel
- Keep development experiments local-only
- **Downside**: Less public visibility

**Option C: Use Vercel CLI for preview deploys** (if needed)
- `vercel --prod` uses personal quota (100/day separate from team)
- Only for urgent QA needs
- **Downside**: Not automated

### Long-Term

**Option D: Upgrade to Vercel Pro** ($20/month)
- **6,000 deployments per day** (60× more)
- Would easily handle this workflow
- **Cost**: $240/year for hobby project (decision pending)

**Option E: Alternative deployment for some experiments**
- Netlify, Cloudflare Pages, GitHub Pages for simple demos
- Keep Vercel for complex ones (Edge Functions, ISR, etc.)
- **Downside**: Mixed deployment platforms (more complexity)

---

## Lessons Learned

### What Went Well

1. ✅ **Local development unaffected** — Vite build works fine
2. ✅ **Existing production URLs stayed up** — No runtime impact
3. ✅ **Detected early** — Caught during PR #10 testing, not after merge
4. ✅ **Clear error messages** — Vercel API returned explicit `402` with quota limit

### What Could Be Better

1. ⚠️ **No quota monitoring** — Didn't know we were approaching limit
2. ⚠️ **Silent production deploy failures** — PR #6/#8 merges looked successful
3. ⚠️ **No deployment consolidation** — Each experiment = separate project

### Action Items

- [ ] **Monitor quota** — Check Vercel dashboard daily during active development
- [ ] **Document quota awareness** — Add note to README about free tier limits
- [ ] **Consider Pro tier** — Evaluate if $20/month worth it for this workflow
- [ ] **Test deploy strategies** — Try monorepo preview URLs to reduce project count

---

## Related Documentation

- [Vercel Free Tier Limits](https://vercel.com/docs/limits/overview) — Official limits
- [experiments/scroll-product-showcase](../../experiments/scroll-product-showcase/) — Blocked experiment (PR #10)
- [ADR-0005](../adr/0005-scroll-driven-product-hero.md) — Scroll product pattern (unaffected by incident)

---

## Status Updates

**2026-09-07 21:31 AEST** — Incident documented, recovery steps planned  
**2026-09-07 ~23:20 AEST** — PR #10 merged; `vibes-scroll-product` created; quota still **0 remaining**  
**2026-09-08 ~12:55 UTC / ~10:55pm AEST** (estimated reset) — One deploy each for explode, steam-atlas, scroll-product  
**TBD** — Post-recovery verification (production HTML newer than 08:58 UTC)

---

**Incident owner**: Johnny Huynh  
**Severity**: Medium (blocks deploys, not runtime)  
**Resolution**: Wait for quota reset + manual redeploys
