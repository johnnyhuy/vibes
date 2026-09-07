# Scroll Product Showcase

A clean-room implementation of the scroll-driven 3D product visualisation pattern — inspired by viral WebGL product heroes like [himanshubuildss' glass bottle](https://x.com/himanshubuildss/status/2096243989439713677).

## What This Is

I built this to understand how scroll position drives 3D scene parameters. Instead of timed animation, the user's scroll becomes the controller — rotating the product, moving the camera, and revealing content sections.

The product itself is procedural geometry (a torus knot + cylinder + sphere composition) with glass-like materials. No CAD model, no GLB import — just Three.js primitives and MeshPhysicalMaterial with transmission properties.

## The Pattern

```
User scrolls down
  ↓
Scroll progress (0.0 → 1.0)
  ↓
Product rotates (0° → 360°)
Camera dollies in (z: 8 → 5)
Camera rises (y: 0 → 1.5)
```

Direct 1:1 mapping. No easing in the scroll handler — that's handled by `ScrollControls` damping and the render loop.

## Stack

- **Vite** — Fast dev server and build
- **React** — Component structure
- **React Three Fiber** — React renderer for Three.js
- **@react-three/drei** — `ScrollControls`, `useScroll`, `Environment`
- **Three.js** — 3D engine

## Key Techniques

### 1. Fixed Canvas + Scroll Container

The canvas is `position: fixed` so it doesn't scroll. Content sections are in a tall `div` that creates the scroll area. As the user scrolls the content, the canvas reacts.

### 2. Scroll Progress Mapping

```tsx
const scroll = useScroll();

useFrame((state) => {
  const offset = scroll.offset; // 0.0 to 1.0
  
  // Rotate product
  productRef.current.rotation.y = offset * Math.PI * 2;
  
  // Move camera
  state.camera.position.z = 8 - offset * 3;
});
```

`scroll.offset` gives us a normalised progress value (0 at top, 1 at bottom). We map that to rotation angles, camera positions, etc.

### 3. Glass Materials

```tsx
<meshPhysicalMaterial
  transmission={0.95}      // High transparency
  thickness={0.8}          // Glass thickness for refraction
  ior={1.5}                // Index of refraction (glass)
  roughness={0.05}         // Near-mirror finish
  clearcoat={1.0}          // Glossy outer layer
  envMapIntensity={1.2}    // Boost environment reflections
/>
```

`transmission` makes the material transparent with proper refraction. `ior` (index of refraction) controls how light bends — 1.5 is glass, 1.33 is water.

### 4. Inner Liquid

The product has two meshes:
- **Outer shell**: High transmission, low roughness (clear glass)
- **Inner liquid**: Lower transmission, coloured, different IOR (water-like)

This creates a realistic refraction effect where light bends differently through the liquid than through the glass.

### 5. Environment Lighting

```tsx
<Environment preset="studio" />
```

This adds an HDRI environment map that provides realistic reflections and refractions. Without this, glass materials look flat.

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Building for Production

```bash
npm run build
```

Output goes to `dist/`. Ready for Vercel deployment (set Root Directory to `experiments/scroll-product-showcase`).

## Design Decisions

I chose a torus knot + sphere composition instead of a realistic product because:
1. **Educational focus** — This is about the *scroll pattern*, not the asset
2. **Clean-room** — Avoids "me too" clones of existing demos
3. **Procedural** — No external models, everything is code
4. **Interesting geometry** — Torus knots show refraction well (lots of surface angles)

The marketing copy is first-person because this is my learning project. I'm not pretending to be a brand — I'm showing how the pattern works in a realistic context.

## Performance Notes

- Fixed canvas prevents re-rendering on scroll
- `useFrame` syncs updates to 60fps render loop (not scroll events)
- `ScrollControls` damping (0.1) adds smoothness without performance cost

## Related Documentation

- [docs/reverse-engineering/webgl-scroll-product.md](../../docs/reverse-engineering/webgl-scroll-product.md) — Full pattern breakdown
- [docs/adr/0005-scroll-driven-product-hero.md](../../docs/adr/0005-scroll-driven-product-hero.md) — Why scroll-as-controller

## Inspiration & Attribution

This is a clean-room implementation inspired by:
- [himanshubuildss' glass bottle](https://x.com/himanshubuildss/status/2096243989439713677) — The viral scroll-driven glass product hero that sparked my interest
- Apple product pages — The original scroll-driven 3D pattern
- Stripe marketing pages — Scroll-driven visual storytelling

I didn't copy code or assets — I studied the pattern and built my own version to learn how it works.

## What I Learned

1. **Scroll is powerful UI** — Direct manipulation feels more engaging than timed animation
2. **Materials matter** — Transmission + HDRI = instant realism
3. **Procedural can be interesting** — Don't need CAD models to showcase the pattern
4. **Performance is easy** — React Three Fiber handles the optimisation

## Next Steps

If I expand this:
- Add more complex scroll choreography (multi-stage camera paths)
- Implement section-based fade-in animations for text
- Add touch/drag to manually rotate product
- Experiment with different procedural geometries

---

**Status**: Complete and deployed  
**Last updated**: 2026-09-07  
**Built by**: Johnny Huynh
