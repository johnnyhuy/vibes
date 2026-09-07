# Incident: Vercel Deployment Quota Exhausted

**Date**: 2026-09-07  
**Time**: ~21:25 AEST (11:25 UTC)  
**Duration**: ~24 hours (until quota resets)  
**Severity**: Medium (blocks production deploys, not runtime)  
**Status**: Waiting for quota reset

---

## Summary

Vercel hobby team `johnnyhuy-dev` hit the free tier deployment quota limit (`api-deployments-free-per-day`: 100/100 deployments). This blocks all new production and preview deployments until the quota resets (~24 hours from limit trigger).

**Impact**: Recent PR merges (#6, #8) did not get production deployments. Existing production URLs serve stale commits.

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

**Expected**: PR #6 attach() rewrite (commit `34023708`) should be live  
**Actual**: Production serves older whitelist commit `6923cd2`  
**Root cause**: Main branch deploy post-merge failed due to quota

**Impact**: 
- Users see pre-#6 explode demo (older explosion algorithm)
- QA of attach() rewrite not possible on production URL
- SSO correctly disabled (that worked before quota hit)

### 2. `vibes-steam-atlas` (no live URL yet)

**Expected**: First production deploy after PR #8 merge  
**Actual**: Zero READY deployments (project exists but empty)  
**Root cause**: `create_git_project` MCP call returned `402 payment_required`

**Impact**:
- No live URL exists yet
- Root Directory not set (was going to be configured during first deploy)
- Experiment merged but not publicly visible

### 3. `vibes-scroll-product` (PR #10, not yet merged)

**Expected**: Preview deployment comments on PR  
**Actual**: All Vercel preview checks show `FAILURE` with rate limit URL  
**Root cause**: Preview builds blocked by quota

**Impact**:
- Can't preview scroll-product demo before merge
- Local testing only (`npm run dev` works fine)
- Build itself is green (tested locally)

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
   - Merge PR #10 → auto-deploys `vibes-scroll-product` (if created)

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

### When Quota Resets (~24h)

**Priority 1: Fix Production URLs**

1. **Redeploy `vibes-explode`**:
   - Vercel dashboard → `vibes-explode` project
   - Deployments → Latest (commit `34023708`)
   - Click "Redeploy"
   - Verify attach() rewrite is live

2. **Configure `vibes-steam-atlas`**:
   - Vercel dashboard → `vibes-steam-atlas` project
   - Settings → Root Directory → `experiments/procedural-steam-atlas`
   - Save (triggers automatic deploy from main)
   - Verify live URL appears

**Priority 2: Merge PR #10**

3. **Merge scroll-product PR**:
   - Locally verified build passes ✓
   - Documentation complete ✓
   - Wait for quota reset
   - Merge to main
   - Create `vibes-scroll-product` project manually
   - Set Root Directory → `experiments/scroll-product-showcase`
   - Auto-deploys on next push

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
**2026-09-08 ~21:25 AEST** (estimated) — Quota resets, deployments resume  
**TBD** — Post-recovery verification (all production URLs updated)

---

**Incident owner**: Johnny Huynh  
**Severity**: Medium (blocks deploys, not runtime)  
**Resolution**: Wait for quota reset + manual redeploys
