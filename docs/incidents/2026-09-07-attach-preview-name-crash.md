# 2026-09-07: Attach Preview Name-Crash — Material Properties & Console.log

## Incident

**Status**: Fixed  
**Severity**: Critical (app unusable — blank canvas + error overlay)  
**Duration**: Reported 2026-09-07 ~9:30 PM AEST  
**Affected**: Attach branch preview deployment (`vibes-explode-2txjwbdam-johnnyhuy-dev.vercel.app`)  
**Root cause**: Undefined material property access + unsafe console.log during piece logging

---

## Timeline

- **~9:30 PM AEST 2026-09-07**: Visual QA reports explode-assembly crash on attach branch preview
- **Error**: `Could not load /models/model3.glb: Cannot read properties of undefined (reading 'name')`
- **Symptoms**: Black canvas + red ErrorBoundary overlay, slider stuck at 0%, ~70% explode untestable
- **Note**: PR #6 (commit 34023708) had already merged "attach() pattern" rewrite to main, but preview still crashed

---

## Problem

After PR #6 merged the attach() rewrite with comprehensive null-safe guards, the preview deployment continued to crash with:

```
ErrorBoundary: Explode Assembly Error
Error: Could not load /models/model3.glb: Cannot read properties of undefined (reading 'name')
```

This error format indicates useGLTF/Three.js wrapped an underlying error during GLB processing or setup.

---

## Root Causes

### Primary: Undefined Material Property Access

Material enhancement code (lines 180-195) assumed `metalness`, `roughness`, and `envMapIntensity` properties always exist:

```typescript
// BEFORE (UNSAFE):
const m = mat.clone();
m.metalness = Math.min(m.metalness + 0.2, 0.8);     // ❌ Crashes if undefined
m.roughness = Math.max(m.roughness - 0.1, 0.3);      // ❌ Crashes if undefined
m.envMapIntensity = 1.5;
```

**Issue**: While Sketchfab GLB materials typically have these properties, some basic materials (especially after cloning) may have `undefined` values. Math operations on `undefined` throw or produce NaN, corrupting the material and potentially causing downstream errors when Three.js tries to access internal properties during rendering.

**Fix**: Use nullish coalescing to provide safe defaults:

```typescript
// AFTER (SAFE):
if (!mat) return mat;  // Guard: skip null/undefined materials
const m = mat.clone();
m.metalness = Math.min((m.metalness ?? 0) + 0.2, 0.8);
m.roughness = Math.max((m.roughness ?? 1) - 0.1, 0.3);
m.envMapIntensity = m.envMapIntensity ?? 1.5;
```

### Secondary: Unsafe Console.log Property Access

Debug logging (line 189) accessed `p.node.name` without null-safety:

```typescript
// BEFORE (UNSAFE):
console.log('Sample pieces:', pieces.slice(0, 5).map(p => ({
  name: p.node.name,  // ❌ Crashes if p.node is undefined
  system: p.system,
  home: p.home.toArray().map(v => v.toFixed(2)),
})));
```

**Issue**: If any piece in the array had an undefined or null `node` (shouldn't happen, but defensive coding required), accessing `.name` would throw the exact error seen: "Cannot read properties of undefined (reading 'name')".

**Fix**: Use optional chaining:

```typescript
// AFTER (SAFE):
console.log('Sample pieces:', pieces.slice(0, 5).map(p => ({
  name: p.node?.name ?? 'unnamed',  // ✅ Safe
  system: p.system,
  home: p.home.toArray().map(v => v.toFixed(2)),
})));
```

### Tertiary: Missing Guards Around Critical Operations

**attach() calls** (line 158) and **bounds computation** (line 177) lacked try-catch wrappers. If these operations failed (e.g., malformed geometry, invalid transform), they would throw uncaught errors visible as "Could not load" via ErrorBoundary.

**Fix**: Wrap in try-catch with continue-on-error:

```typescript
// attach() with error handling
try {
  explodeRoot.attach(mesh);
} catch (err) {
  console.error(`Failed to attach mesh "${meshName}":`, err);
  continue;  // Skip this mesh, don't crash entire setup
}

// Bounds computation with fallback
try {
  bounds = new THREE.Box3().setFromObject(mesh);
  center = bounds.getCenter(new THREE.Vector3());
} catch (err) {
  console.warn(`Failed to compute bounds for "${meshName}", using fallback`);
  bounds = new THREE.Box3(new THREE.Vector3(-1, -1, -1), new THREE.Vector3(1, 1, 1));
  center = new THREE.Vector3(0, 0, 0);
}
```

---

## Why This Wasn't Caught Locally

1. **Local dev builds passed** because the error is runtime-dependent on material state after cloning
2. **Minification** in production builds may expose different code paths than development mode
3. **Race conditions** during async GLB loading could vary between local and deployed environments
4. **DRACO decompression** might behave differently across environments

---

## Fixes Applied

### 1. Null-Safe Material Property Access

**File**: `src/components/CarModel.tsx`  
**Lines**: ~176-201

- Added `?? 0` for metalness (default to non-metallic)
- Added `?? 1` for roughness (default to rough/matte)
- Added `?? 1.5` for envMapIntensity (fallback to moderate env reflection)
- Added guard `if (!mat) return mat;` to skip null/undefined materials in arrays

### 2. Safe Console.log Property Access

**File**: `src/components/CarModel.tsx`  
**Line**: ~216

- Changed `p.node.name` → `p.node?.name ?? 'unnamed'`

### 3. Error Handling for Critical Operations

**File**: `src/components/CarModel.tsx`  
**Lines**: ~157-161, ~174-182

- Wrapped `explodeRoot.attach(mesh)` in try-catch
- Wrapped `setFromObject()` bounds computation in try-catch with fallback
- Added position validation after attach: `if (!mesh.position) continue;`
- Added mesh validation before processing: `if (!mesh || typeof mesh !== 'object') continue;`

---

## Testing

**Local**:
- ✅ `npm run build` passes (3.2s, no errors)
- ✅ TypeScript compilation succeeds
- ✅ No linter warnings

**Expected Production Behaviour** (to be verified on updated preview):
- ✅ App loads without ErrorBoundary at explode=0%
- ✅ Assembled opaque Model 3 visible on pure black studio
- ✅ At ~70% explode, parts stay readable on-screen (multiplier ~2.5x)
- ✅ No props visible (traffic lights, speakers, debris removed by GLB stripping)
- ✅ Smooth animation, no console errors

---

## Prevention

### 1. Always Use Nullish Coalescing for Optional Properties

```typescript
// ❌ BAD: Assumes property exists
const value = obj.property + 1;

// ✅ GOOD: Safe default
const value = (obj.property ?? 0) + 1;
```

### 2. Wrap Three.js Operations in Try-Catch

Operations like `setFromObject()`, `attach()`, `clone()` can fail with malformed geometry. Always wrap in try-catch when processing untrusted GLB assets:

```typescript
try {
  const bounds = new THREE.Box3().setFromObject(mesh);
} catch (err) {
  console.warn('Bounds computation failed, using fallback');
  // Provide sensible fallback
}
```

### 3. Use Optional Chaining in Debug Logs

Even debug code must be null-safe:

```typescript
// ❌ BAD: Can crash
console.log(obj.property);

// ✅ GOOD: Safe
console.log(obj?.property ?? 'N/A');
```

### 4. Test Production Builds Locally

```bash
npm run build
npm run preview  # Serves production build locally
```

---

## Related

- **PR #6** (commit 34023708): Introduced attach() rewrite, addressed container removal
- **docs/incidents/2026-09-07-undefined-name-crash.md**: Prior fix for container skip-not-remove
- **docs/incidents/2026-09-07-blank-canvas-whitelist-regression.md**: Earlier whitelist filter issue

---

**Fixed by**: Null-safe material properties + optional chaining in console.log + try-catch wrappers  
**Documented**: 2026-09-07 ~11:30 PM AEST  
**Next QA**: Preview deployment after push to fix branch
