# ADR-0005: Scroll-Driven Product Hero Pattern

**Date**: 2026-09-07  
**Status**: Accepted  
**Context**: [vibes](../../) monorepo  
**Related**: [webgl-scroll-product.md](../reverse-engineering/webgl-scroll-product.md), [scroll-product-showcase](../../experiments/scroll-product-showcase/)

## Context

I've seen the scroll-driven 3D product pattern everywhere lately — Apple product pages, Stripe marketing, and viral WebGL demos like [himanshubuildss' glass bottle](https://x.com/himanshubuildss/status/2096243989439713677). I wanted to understand how it works and build my own clean-room version.

The core question: **How should scroll position control 3D scene parameters?**

## Decision

I'm implementing scroll-as-controller: **direct 1:1 mapping from scroll progress to scene state**, not timed animation.

Key architectural choices:

### 1. Scroll Progress → Scene State (Not Time-Based Animation)

**Chosen**: `scrollProgress = scrollTop / scrollHeight` maps directly to rotation, camera position, etc.

```tsx
const offset = scroll.offset; // 0.0 to 1.0
product.rotation.y = offset * Math.PI * 2; // 0° to 360°
camera.position.z = 8 - offset * 3;        // z: 8 → 5
```

**Rejected**: `requestAnimationFrame` loop with easing toward target state.

**Why**: User control feels more engaging. Scroll is bidirectional (you can scroll up to reverse), whereas timed animation forces a single direction.

### 2. Fixed Canvas + Scroll Container (Not Canvas That Scrolls)

**Chosen**: Canvas is `position: fixed`. Content sections are in a tall scrollable div.

```tsx
<Canvas style={{ position: 'fixed', top: 0, left: 0 }} />
<div className="content" style={{ height: '300vh' }}>
  {/* Scrollable sections */}
</div>
```

**Rejected**: Canvas inside scrollable container that moves with scroll.

**Why**: Fixed canvas doesn't repaint on scroll events. Only transforms update in the render loop. Massive performance win.

### 3. Procedural Geometry (Not GLB Import)

**Chosen**: Torus knot + cylinder + sphere composition using Three.js primitives.

```tsx
<torusKnotGeometry args={[1, 0.3, 128, 32, 2, 3]} />
<cylinderGeometry args={[0.4, 0.4, 2.5, 32]} />
<sphereGeometry args={[0.5, 32, 32]} />
```

**Rejected**: Importing realistic product GLB (bottle, phone, etc).

**Why**:
- **Educational focus** — This is about the *scroll pattern*, not asset creation
- **Clean-room** — Avoids cloning existing viral demos
- **Self-contained** — No external files or licensing concerns
- **Demonstrates material complexity** — Torus knots show refraction well (lots of surface angles)

### 4. React Three Fiber (Not Vanilla Three.js)

**Chosen**: `@react-three/fiber` + `@react-three/drei` for `ScrollControls` and `useScroll`.

**Rejected**: Vanilla Three.js with manual scroll event listeners.

**Why**:
- `ScrollControls` provides built-in damping and normalised progress
- `useScroll` hook integrates cleanly with React render loop
- `useFrame` syncs updates to 60fps (not scroll event frequency)
- Consistent with other experiments in this repo

## Consequences

### Positive

1. **User control** — Scroll is familiar and bidirectional
2. **Performance** — Fixed canvas + rAF syncing avoids scroll event overhead
3. **Educational** — Pattern is clearly demonstrated without distraction from complex assets
4. **Reusable** — Scroll mapping logic can apply to any 3D scene

### Negative

1. **Mobile scroll differences** — Touch scrolling has different momentum than mouse wheel (mitigated by `ScrollControls` damping)
2. **Accessibility** — Users who navigate via keyboard or assistive tech may miss scroll-driven effects (but content is still accessible)
3. **Content coupling** — Scroll height must match desired animation duration (300vh for smooth pacing in this case)

### Neutral

1. **Procedural geometry** — Not as visually striking as photorealistic products, but serves educational purpose
2. **No analytics** — Can't track how far users scroll through the experience (not a concern for this learning project)

## Alternatives Considered

### Time-Based Animation (Rejected)

```tsx
const [time, setTime] = useState(0);

useFrame((state, delta) => {
  setTime(t => t + delta * 0.5);
  product.rotation.y = time;
});
```

**Why rejected**: User has no control. Can't scroll back to review earlier states.

### Canvas In Scroll Flow (Rejected)

```tsx
<div style={{ height: '300vh' }}>
  <div style={{ position: 'sticky', top: 0 }}>
    <Canvas />
  </div>
</div>
```

**Why rejected**: Canvas still repaints on scroll events. `position: fixed` is cleaner.

### Realistic Product GLB (Rejected)

Import a CAD model or photogrammetry scan of a real product.

**Why rejected**: 
- Licensing complexity (can't use branded products)
- Distracts from the pattern itself
- Requires asset pipeline (Blender export, etc)

## Implementation Notes

See [experiments/scroll-product-showcase](../../experiments/scroll-product-showcase/) for the full implementation.

Key files:
- `src/components/ProductScene.tsx` — Scroll mapping logic
- `src/App.tsx` — Fixed canvas + scrollable content
- `src/styles.css` — Dark cinematic UI

## Validation

Build passes:
```bash
cd experiments/scroll-product-showcase
npm install && npm run build
```

Vercel deployment ready (Root Directory: `experiments/scroll-product-showcase`).

## Related Patterns

- **Scroll storytelling** — Similar to [earth-timeline](../../experiments/earth-timeline/), but with product focus
- **Material showcase** — Glass/transmission materials same approach as explode-assembly transparency

## Future Considerations

If expanding this pattern:
- Multi-stage scroll choreography (keyframe-based camera paths)
- Section-based text fade-in/out tied to scroll ranges
- Touch/drag to override scroll (manual product rotation)
- Analytics integration (scroll depth tracking)

## References

- [himanshubuildss glass bottle](https://x.com/himanshubuildss/status/2096243989439713677) — Viral inspiration
- [Apple product pages](https://www.apple.com/mac-pro/) — Original scroll-driven 3D pattern
- [React Three Fiber ScrollControls](https://github.com/pmndrs/drei#scrollcontrols) — Implementation library

---

**Decision made by**: Johnny Huynh  
**Review status**: Self-approved (solo learning project)
