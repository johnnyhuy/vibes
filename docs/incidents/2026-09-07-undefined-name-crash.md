# 2026-09-07: Undefined `.name` Property Crash

## Incident

PR #6 preview crashed with blank black canvas + ErrorBoundary showing:

```
Error: Could not load /models/model3.glb: Cannot read properties of undefined (reading 'name')
```

## Root Cause

The attach() pattern rewrite in `CarModel.tsx` was traversing the cloned GLB scene graph and accessing `node.name` without sufficient guards for nodes that might have `undefined` as their `name` property (rather than an empty string or null).

While most Three.js objects have a `name` property (defaulting to `''`), certain edge cases in the scene graph—particularly after cloning and during removal operations—can result in nodes where `typeof node.name === 'undefined'`.

## Affected Code

**Before:**
```typescript
model.traverse((node: any) => {
  if (!node) return;
  const name = node.name || '';  // ❌ Still crashes if node.name is undefined
  if (isProp(name) || isContainer(name)) {
    nodesToRemove.push(node);
  }
});
```

**After:**
```typescript
model.traverse((node: any) => {
  if (!node) return;
  if (typeof node.name === 'undefined') return;  // ✅ Guard
  const name = node.name || '';
  if (isProp(name) || isContainer(name)) {
    nodesToRemove.push(node);
  }
});
```

## Fix

1. Added explicit `typeof node.name === 'undefined'` guards in all traverse loops
2. Updated `isProp()`, `isContainer()`, and `detectSystem()` to accept `string | undefined` and return early for non-string values
3. Added guard to ensure `scene` is loaded before cloning in useMemo
4. Added `mesh.position` existence check before attaching meshes

## Prevention

- Always use `typeof obj.name === 'undefined'` checks before accessing `.name` on Three.js objects in traverse loops
- Type helper functions to accept `string | undefined` for names
- Add null/undefined guards at the top of processing loops, not just in string operations
