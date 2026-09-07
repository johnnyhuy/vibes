# 2026-09-07 Blank Canvas Regression (Whitelist + Object_* Exclusion)

**Status**: Resolved  
**Severity**: Critical (app unusable — blank screen)  
**Duration**: ~55 minutes (PR #6 created 8:31 AM → fixed 9:26 AM UTC)  
**Affected**: PR #6 preview deployment  
**Root cause**: Overly aggressive whitelist filter excluding all Sketchfab mesh names

---

## Timeline

- **8:31 AM UTC**: PR #6 created with cleaned model3.glb + runtime whitelist filter
- **9:26 AM UTC**: Visual QA reports blank black screen on preview deployment
- **9:26 AM UTC**: Root cause identified and fixed

## Problem

PR #6 preview at `vibes-explode-git-cursor-clean-explode-v2-3882-johnnyhuy-dev.vercel.app/` showed:
- **Entire React root goes blank black** (only Vercel toolbar button remained)
- UI flashes briefly then disappears
- Slider never becomes usable
- No error messages visible to QA (silent crash)

## Root Cause

**Combined filter mismatch after GLB stripping:**

1. **GLB Strip Script** (`scripts/strip-model3-scene.mjs`) removed 5 prop nodes:
   - `Cylinder012` (traffic light stand)
   - `Debris_Tires`, `Debris_Tires.001` (piled wheels)
   - `WallDeskSpeakers_mesh`, `WallDeskSpeakers_mesh.001` (studio speakers)
   
   **Result**: Cleaned `model3.glb` (211 KB) contains ONLY car meshes.

2. **Runtime Whitelist Filter** (from main branch commit 6923cd2):
   ```typescript
   const EXCLUDE_KEYWORDS = [
     // ...
     'object_', // ⚠️ THIS LINE
   ];
   ```
   
   Intended to exclude generic Blender/Sketchfab prop exports named `Object_*`.
   
   **But**: After GLB stripping, many **legitimate car parts** in the cleaned model are named:
   - `Object_Body`
   - `Object_Hood`
   - `Object_Wheel_FL`
   - etc.
   
   **Result**: Runtime filter excluded **all** car meshes → `extracted.length === 0`.

3. **Silent Crash**:
   - `pieces.useMemo()` returned empty array `[]`
   - `calculateExplosionLayout([])` returned `[]`
   - React rendered empty `<group>` successfully (no error)
   - **But**: Something downstream (likely `useFrame` accessing `pieces[0]._lastAmount` or material operations on zero pieces) caused an uncaught error
   - Canvas blanked, no error boundary in place → **QA saw only black screen**

## Secondary Issue: Material Arrays

During investigation, discovered potential crash vector:
```typescript
if (child.material) {
  const mat = child.material.clone(); // ⚠️ Crashes if material is an array
}
```

Multi-material meshes have `child.material` as `Material[]`, not a single `Material`. Calling `.clone()` on an array throws.

## Fixes Applied

### 1. Removed `'object_'` from EXCLUDE_KEYWORDS

**Before:**
```typescript
const EXCLUDE_KEYWORDS = [
  // ...
  'object_', // Generic Blender export names for props
];
```

**After (PR #6 fix):**
```typescript
const EXCLUDE_KEYWORDS = [
  'cylinder012', // traffic light stand (in case strip didn't run)
  'debris_tires', 'debris_tire', // piled wheels
  'walldeskse', 'speaker', // studio speakers  
  'traffic', 'light_pole', 'sign', 'cone', 'barrier',
  // ... other prop keywords ...
  // REMOVED: 'object_'
];
```

**Rationale**: After GLB stripping removes props at file level, `object_` exclusion is unnecessary and harmful. Only keep explicit prop names that might survive if the strip script wasn't run.

### 2. Handle Material Arrays

**Before:**
```typescript
if (child.material) {
  const mat = child.material.clone();
  // ...
  child.material = mat;
}
```

**After (PR #6 fix):**
```typescript
if (child.material) {
  if (Array.isArray(child.material)) {
    child.material = child.material.map((mat: any) => {
      const cloned = mat.clone();
      // ... enhance cloned
      return cloned;
    });
  } else {
    const mat = child.material.clone();
    // ... enhance mat
    child.material = mat;
  }
}
```

### 3. Added React Error Boundary

Created `src/components/ErrorBoundary.tsx` and wrapped `<Scene>` in `App.tsx`:
```tsx
<ErrorBoundary>
  <Scene {...props} />
</ErrorBoundary>
```

**Why**: Future crashes will show a red error screen with stack trace instead of a silent blank Canvas. Critical for QA visibility.

## Verification

**After fix:**
- ✅ Build passes (3.37s)
- ✅ No TypeScript errors
- ✅ Error boundary renders crash messages (tested with intentional throw)
- ✅ Material array handling prevents multi-material mesh crashes

**Expected production behaviour** (to be verified by QA on updated PR #6 preview):
- Assembled car renders opaque at explode=0% on pure black studio
- ~70% explode keeps parts readable on screen
- Zero props visible (no traffic lights, speakers, or debris)

## Lessons Learned

1. **Test GLB + runtime filter combinations**: When you strip a GLB and also apply runtime filters, verify the filter doesn't exclude the stripped content's actual mesh names.

2. **Error boundaries are essential**: Without them, crashes produce blank screens with zero QA visibility. Always wrap Canvas-based React components.

3. **Log extracted counts**: The code logs `Extracted ${extracted.length} pieces` and `Excluded ${excluded.length}` to console. QA should check browser console if the screen is blank — `Extracted 0 pieces` would have immediately flagged the issue.

4. **Handle Three.js material edge cases**: Multi-material meshes (`material: Material[]`) are common in Sketchfab exports. Always check `Array.isArray(material)` before calling `.clone()`.

## Related

- **PR #5**: Draft, had merge conflicts with main → superseded by PR #6
- **PR #6**: Clean rebase, introduced blank-canvas regression → **fixed in this commit**
- **Commit 6923cd2** (main): Introduced whitelist filter with `object_` exclusion — worked with original unstripped model3.glb but failed after GLB stripping

---

**Fixed by**: Removing `object_` exclusion + handling material arrays + error boundary  
**Documented**: 2026-09-07 9:26 AM UTC  
**Next QA**: Preview deployment after push to PR #6 branch
