# 2026-09-07: Undefined `.name` Property Crash + Container Removal Pitfall

## Incident

PR #6 preview crashed with blank black canvas + ErrorBoundary showing:

```
Error: Could not load /models/model3.glb: Cannot read properties of undefined (reading 'name')
```

## Root Causes

### 1. Removing Structural Containers (PRIMARY)

The code was removing nodes identified by `isContainer()` (e.g., `sketchfab_model`, `tesla model 3.fbx`, `rootnode`) using `node.parent.remove(node)`. These are **structural parent nodes** that contain the entire car hierarchy as children.

**Result**: Removing these containers deleted the entire car subgraph, leaving either:
- Zero meshes collected (blank canvas)
- Dangling references to removed nodes (undefined `.name` crashes)
- Corrupted scene graph with half-removed nodes

**Critical lesson**: In Three.js scene graphs, container/root nodes are **structural parents**, not props. Removing them destroys everything underneath.

### 2. Insufficient `.name` Guards (SECONDARY)

Even with containers kept, some nodes in cloned GLB scene graphs can have `undefined` as their `name` property (not `''` or `null`), particularly after graph manipulations.

## Affected Code

**Before (BROKEN):**
```typescript
// PASS 1: Collect nodes to remove
model.traverse((node: any) => {
  if (!node) return;
  const name = node.name || '';  // ❌ Crashes if node.name is undefined
  if (isProp(name) || isContainer(name)) {  // ❌ Removes structural parents!
    nodesToRemove.push(node);
  }
});

// PASS 2: Remove collected nodes
for (const node of nodesToRemove) {
  node.parent.remove(node);  // ❌ Deletes entire car hierarchy when node is a container
}

// PASS 3: Collect meshes
model.traverse((obj: any) => {
  if (obj.isMesh) meshes.push(obj);  // ⚠️ Nothing left - containers were removed
});
```

**After (FIXED):**
```typescript
// Single pass: collect car meshes only (don't remove anything from graph)
model.traverse((obj: any) => {
  if (!obj?.isMesh) return;  // ✅ Safe guard
  
  const name = obj?.name ?? '';  // ✅ Null-safe
  
  if (isContainer(name)) return;  // ✅ SKIP containers (don't remove!)
  if (isProp(name)) return;       // ✅ SKIP props
  
  meshes.push(obj);  // ✅ Collect car meshes only
});
// Containers stay in graph as structural parents - we just don't render them
```

## Fix

1. **DON'T REMOVE CONTAINERS** - Changed from "collect & remove" to "skip during collection"
   - `isContainer()` now used to SKIP nodes, not remove them
   - Structural parents (`sketchfab_model`, `tesla model 3.fbx`, etc.) stay in graph
   - Only skip prop meshes and containers during mesh collection

2. **Use `?.` and `??` null-safe operators** for all `.name` accesses
   - `obj?.name ?? ''` instead of `obj.name || ''`
   - `if (!obj?.isMesh) return;` instead of separate checks

3. **Single-pass collection** instead of multi-pass remove-then-collect
   - Simpler logic, fewer chances for graph corruption
   - Matches ashemag pattern more closely

4. **Type signatures** updated to accept `string | undefined`

## Prevention

### DON'T Remove Structural Nodes
- In Three.js GLB/GLTF scenes, nodes like `sketchfab_model`, `RootNode`, `scene`, `*.fbx` are **structural parents**
- Removing them destroys the entire subgraph
- **Skip them during collection**, don't remove from graph

### Safe `.name` Access Pattern
```typescript
// ✅ GOOD: Null-safe
const name = obj?.name ?? '';
if (isContainer(name)) return;  // Skip, don't remove

// ❌ BAD: Can crash
const name = obj.name || '';
if (isContainer(name)) obj.parent.remove(obj);  // Deletes children!
```

### Container vs Prop Distinction
- **Containers**: Structural parents (keep in graph, skip during collection)
- **Props**: Renderable clutter (skip during collection, or remove if safe)

---

## Visual QA Status

**BLOCKED**: Vercel hobby exhausted `api-deployments-free-per-day` quota (10:40 AM UTC).

- Preview URL serves OLD build (10:19 UTC) with stripped 216KB GLB
- Current branch has VALID restored 289KB GLB (295,892 bytes)
- Build passes locally (3.11s, 340 KB gzipped)
- **Visual QA pending**: Quota resets ~24h, then preview will rebuild with fixes

**Verification in branch:**
```bash
$ git show HEAD:experiments/explode-assembly/public/models/model3.glb | wc -c
295892  # ✅ Valid 289KB original (not 216KB stripped)
```

PR #6 ready for merge after visual QA confirms assembled car at explode=0%.
