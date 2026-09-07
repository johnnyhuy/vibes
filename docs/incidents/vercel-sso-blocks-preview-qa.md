# Incident: Vercel Authentication Blocks Preview URL QA

**Date**: 2026-09-07  
**Component**: Vercel preview deployments (PR branch URLs)  
**Impact**: Cloud Agent cannot visually QA browser-based demos on PR preview hosts  
**Status**: Known limitation, documented workaround

---

## What Happened

During visual QA of PR #2's preview deployments, attempts to access preview URLs in the browser were blocked by **Vercel Authentication** (SSO).

**Observed behaviour**:
- Preview URLs like `vibes-explode-git-cursor-hill-climb-...-johnnyhuy-dev.vercel.app` redirect to login page
- Browser cannot access the deployed demo
- Agent MCP `web_fetch_vercel_url` can still retrieve HTML/bundle source for code verification
- Error: "This deployment is protected. Please authenticate to continue."

---

## Root Cause

The `johnnyhuy/vibes` repository has **Vercel Authentication** enabled at the project or team level. This protects all preview deployments (git branch deploys) behind SSO.

**Scope**:
- ✅ **Production aliases** (`vibes-explode.vercel.app`, `vibes-earth.vercel.app`, etc.) are publicly accessible
- ❌ **Preview URLs** (`...-git-<branch>-...-dev.vercel.app`) require authentication

---

## Why This Matters for Cloud Agents

Cloud Agents running visual QA need to:
1. Load the deployed demo in a browser
2. Interact with UI controls (sliders, buttons)
3. Verify visual appearance (no props in frame, correct colours, smooth animations)

When preview URLs redirect to login:
- Agent cannot complete visual QA
- Code-level verification (bundle inspection, source review) still works
- But cannot confirm **what the user sees** in the browser

---

## Workarounds

### 1. Post-Merge Visual QA
**Status**: Current approach

- Merge PR to `main` → Vercel deploys to production aliases
- Production URLs (`vibes-*.vercel.app`) are publicly accessible
- Agent can then perform full browser-based visual QA
- Trade-off: QA happens **after** merge, not before

**Process**:
1. Code review + build verification on PR branch
2. Merge to main
3. Visual QA on production aliases
4. If issues found, iterate in a follow-up PR

### 2. MCP `web_fetch_vercel_url` for Code Verification
**Status**: Used in PR #2

The Vercel MCP tool can still fetch:
- HTML source (verify bundle hash)
- JavaScript bundles (verify code changes landed)
- Build metadata

**What it confirms**:
- ✅ New code is in the deployed bundle
- ✅ Mesh filter changes present
- ✅ V8 geometry code present
- ❌ Cannot verify visual appearance
- ❌ Cannot interact with UI

### 3. Disable Vercel Authentication (Not Recommended)
**Status**: Not done

Johnny could disable authentication in Vercel dashboard for this repo, but:
- Exposes all preview branches publicly
- Security/privacy trade-off
- Not required if post-merge QA is acceptable

**Decision**: Keep authentication enabled, use post-merge QA.

---

## What We Did for PR #2

### Code Verification (Successful)
Using MCP `web_fetch_vercel_url`:
- ✅ Confirmed explode bundle contains `EXCLUDE_KEYWORDS` (traffic, speaker, etc.)
- ✅ Confirmed Scene.tsx has studio lighting changes (`#000000` background)
- ✅ Confirmed V8Engine.tsx has `vAngle = Math.PI / 2` and two banks
- ✅ Confirmed earth-timeline has React + R3F with frosted glass UI

### Visual Verification (Blocked → Deferred)
Browser-based QA:
- ❌ Preview URLs redirect to login
- ⏸️ Visual QA deferred to post-merge on production aliases

### Earth Visual QA (Successful via Description)
Johnny reviewed earth preview and confirmed:
- ✅ Dark space + stars
- ✅ Frosted glass timeline
- ✅ Procedural globe
- ✅ "Acceptable for this loop"

### V8 Visual QA (Code-Confirmed, Deploy Pending)
- ✅ Source code has proper V8 geometry (90° V-angle, two banks)
- ✅ Subtitle includes "90° V-ANGLE"
- ⏸️ Production (`vibes-v8.vercel.app`) still serves old inline-8 HTML until PR merges

### Explode Visual QA (Critical Fix Applied)
- ✅ Mesh filter hardened to whitelist-only
- ✅ Studio lighting enhanced (pure black bg, 3-point lighting)
- ⏸️ Visual confirmation deferred to post-merge

---

## Lessons Learnt

### For Cloud Agents
1. **Preview URLs with SSO cannot be browser-tested** — accept this limitation
2. **Code verification is still valuable** — bundle inspection confirms changes landed
3. **Post-merge QA is acceptable** — production aliases are publicly accessible
4. **User visual confirmation is helpful** — Johnny can review preview screenshots/descriptions

### For Repository Owners
1. **SSO protects preview branches** — good for security, blocks agent QA
2. **Production aliases remain public** — enables post-merge verification
3. **Trade-off is acceptable** — code review + post-merge QA catches issues

---

## Visual QA Strategy Going Forward

### Pre-Merge (On PR Branch)
- ✅ Code review (bundle inspection, source verification)
- ✅ Build verification (`npm run build` succeeds)
- ✅ User visual inspection (Johnny reviews preview screenshots)
- ❌ Agent browser QA (blocked by SSO)

### Post-Merge (On Production)
- ✅ Agent browser QA on production aliases
- ✅ Full interaction testing (sliders, buttons, orbit controls)
- ✅ Visual appearance verification (colours, props, lighting)
- ✅ Screenshot comparison vs reference quality bar

### Acceptable Risk
- Pre-merge code verification catches most issues
- Post-merge visual QA catches any remaining issues
- Follow-up PR if needed (iterate quickly)

---

## References

- **Vercel Authentication docs**: [vercel.com/docs/security/deployment-protection](https://vercel.com/docs/security/deployment-protection)
- **MCP `web_fetch_vercel_url`**: Can fetch HTML/bundles but cannot render browser UI
- **PR #2**: First hill-climb PR to encounter this limitation

---

**Author**: Johnny Huynh (via Cursor Cloud Agent)  
**Outcome**: Document known limitation, adopt post-merge visual QA strategy  
**Last Updated**: 2026-09-07
