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
const offset = window.scrollY / (scrollHeight - innerHeight); // 0 → 1
product.rotation.x = damp(product.rotation.x, offset * Math.PI * 2, 3.6, dt); // long-axis roll
camera.position.z = damp(camera.position.z, 6.6 - offset * 1.35, 3, dt);
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

**Chosen (2026-09-08, later the same day)**: A **horizontal** dark-green apothecary lathe + liquid + black cap. Lime 3D type sits behind the glass.

```tsx
<group rotation={[0, 0, Math.PI / 2]}>  // lie on the long axis
  <latheGeometry args={[outerProfile, 80]} />
  <latheGeometry args={[liquidProfile, 64]} />
</group>
```

**Earlier that day**: Upright amber carafe + brass stopper — still the wrong silhouette vs the himanshubuildss thumb.
**2026-09-07**: Torus knot. Shaderball.

**Rejected**: Importing a realistic product GLB (bottle, phone, etc).

**Why**:
- **Educational focus** — The scroll pattern still matters more than an asset pipeline
- **Clean-room** — Avoids cloning himanshubuildss' mesh; I drew my own 2D lathe profile
- **Self-contained** — No external files or licensing
- **Product silhouette** — A carafe sells the viral pattern. A torus knot sells a shaderball.

### 4. React Three Fiber + Native Window Scroll

**Chosen (2026-09-08)**: R3F + drei for the scene (`Environment`, `ContactShadows`). Scroll progress comes from `window` + `useFrame` damping — not drei `ScrollControls`.

**Earlier (2026-09-07)**: `ScrollControls` + `useScroll` *and* a tall HTML page. Two scrollers. The overlay stole the wheel; marketing sections and the 3D rotation drifted.

**Rejected**: Vanilla Three.js with a raw scroll listener driving React state.

**Why**:
- Native document scroll is the Apple/Stripe marketing-page version of this pattern
- Cards need real pointer-events; canvas is `pointer-events: none`
- `useFrame` + `MathUtils.damp` still syncs to the render loop
- `ScrollControls` remains correct **if** HTML lives inside `<Scroll html>`

## Amendment (2026-09-08)

I kept every decision above except the torus knot and the drei overlay scroller.

The viral reference is still [himanshubuildss](https://x.com/himanshubuildss/status/2096243989439713677) (thumb: `hill-climb/refs/himanshu-glass-bottle-thumb.jpg`) — horizontal dark glass, refractive liquid, **scroll rolls the long axis**, interlocking UI, type *through* the bottle. I am not copying TEPHRA/CALDERA. I am matching the pattern with a lathe I wrote.

`ignoreCommand` in this experiment's `vercel.json` skips Vite when `experiments/scroll-product-showcase/` did not change. It does **not** set Root Directory. That stays a dashboard field (`experiments/scroll-product-showcase`).

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

1. **Procedural geometry** — A lathe bottle is still not a scanned carafe. Close enough to teach the pattern.
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
- `src/components/GlassBottle.tsx` — Lathe profiles + glass/liquid materials
- `src/components/ProductScene.tsx` — Damped scroll → rotation/camera
- `src/hooks/useWindowScroll.ts` — Native 0→1 offset
- `src/App.tsx` — Fixed canvas + interlocking sections
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
