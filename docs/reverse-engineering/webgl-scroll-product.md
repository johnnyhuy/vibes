# WebGL Scroll Product Visualisation

**References**:
- [himanshubuildss' glass bottle](https://x.com/himanshubuildss/status/2096243989439713677) — Photoreal glass bottle with refraction, liquid, scroll-driven rotation (verified 2026-09-07)
- [viktoroddy's one-shot site](https://x.com/viktoroddy/status/2096556452999741555) — Live at https://hand-touch-omega.vercel.app/ (verified 2026-09-07)

This is my clean-room reverse-engineering of the scroll-driven 3D product visualisation pattern popularised by Apple, Stripe, and recent viral Three.js demos.

## The Pattern

### Core Concept

**Scroll position controls 3D scene parameters** — Not passive animation, but direct 1:1 mapping:

```
User scrolls down 100px 
  ↓
Product rotates 15° on Y-axis
  ↓
Camera dollies in 2 units
  ↓
Material roughness decreases 0.1
```

**Why it works**:
- Natural interaction (scrolling is familiar)
- User control (not forced animation)
- Cinematic (feels like a directed product film)

---

## Technical Breakdown

### 1. Scroll Tracking

**Simple approach** (vanilla JS):

```javascript
let scrollProgress = 0;

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress = scrollTop / scrollHeight; // 0.0 to 1.0
});
```

**React Three Fiber approach** (with `@react-three/drei`):

```javascript
import { useScroll } from '@react-three/drei';

function Scene() {
  const scroll = useScroll();
  
  useFrame(() => {
    const progress = scroll.offset; // 0.0 to 1.0
    // Use progress to drive animations
  });
}
```

---

### 2. Rotation Animation

**Linear rotation** (simplest):

```javascript
mesh.rotation.y = scrollProgress * Math.PI * 2; // Full 360° rotation
```

**Eased rotation** (more cinematic):

```javascript
import { lerp } from 'three/src/math/MathUtils';

const targetRotation = scrollProgress * Math.PI * 2;
mesh.rotation.y = lerp(mesh.rotation.y, targetRotation, 0.1); // Smooth damping
```

**Multi-axis rotation** (product showcase style):

```javascript
mesh.rotation.x = scrollProgress * Math.PI * 0.2; // Slight tilt
mesh.rotation.y = scrollProgress * Math.PI * 2;   // Full spin
mesh.rotation.z = Math.sin(scrollProgress * Math.PI) * 0.1; // Wobble
```

---

### 3. Glass/Refraction Materials

**Glass bottle key techniques**:

#### A. Physical Material

```javascript
import * as THREE from 'three';

const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 0.0,
  roughness: 0.05,
  transmission: 0.9,        // Glass transparency
  thickness: 0.5,           // Glass thickness for refraction
  ior: 1.5,                 // Index of refraction (glass = 1.5)
  envMapIntensity: 1.0,
  clearcoat: 1.0,           // Glossy outer coat
  clearcoatRoughness: 0.1
});
```

#### B. Environment Map (Critical for Realism)

```javascript
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

const rgbeLoader = new RGBELoader();
rgbeLoader.load('/studio_lighting.hdr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
  glassMaterial.envMap = texture;
});
```

**Free HDRI sources**:
- [Poly Haven](https://polyhaven.com/hdris) (CC0)
- [HDRI Haven](https://hdrihaven.com/) (CC0, now Poly Haven)

#### C. Liquid Inside Bottle

```javascript
const liquidGeometry = new THREE.CylinderGeometry(0.45, 0.45, 0.8, 32);
const liquidMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x88ccff,      // Light blue for water
  metalness: 0.0,
  roughness: 0.2,
  transmission: 0.8,    // Semi-transparent
  thickness: 0.2,
  ior: 1.33             // Water IOR
});
const liquid = new THREE.Mesh(liquidGeometry, liquidMaterial);
liquid.position.y = -0.2; // Below bottle top
bottle.add(liquid);
```

---

### 4. Camera Movement

**Dolly in/out**:

```javascript
camera.position.z = 5 - (scrollProgress * 2); // Move from z=5 to z=3
```

**Orbit around product**:

```javascript
const angle = scrollProgress * Math.PI * 2;
const radius = 5;
camera.position.x = Math.cos(angle) * radius;
camera.position.z = Math.sin(angle) * radius;
camera.lookAt(0, 0, 0); // Always look at product center
```

**Cinematic arc** (Apple style):

```javascript
// Start: Low angle, far away
// Middle: Eye level, medium distance
// End: High angle, close up

const startPos = { x: -3, y: 1, z: 8 };
const endPos = { x: 2, y: 3, z: 4 };

camera.position.x = lerp(startPos.x, endPos.x, scrollProgress);
camera.position.y = lerp(startPos.y, endPos.y, scrollProgress);
camera.position.z = lerp(startPos.z, endPos.z, scrollProgress);
camera.lookAt(0, 1, 0); // Look at product center (slightly elevated)
```

---

### 5. Lighting Evolution

**Dynamic lighting as user scrolls**:

```javascript
// Start: Warm, high contrast
// End: Cool, soft lighting

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);

// In animation loop:
const warmColor = new THREE.Color(0xffaa77);
const coolColor = new THREE.Color(0x77aaff);
light.color.lerpColors(warmColor, coolColor, scrollProgress);

light.intensity = 1.0 + (scrollProgress * 0.5); // Brighten toward end
```

---

## React Three Fiber Implementation

**Full pattern** (using `@react-three/fiber` and `@react-three/drei`):

```jsx
import { Canvas, useFrame } from '@react-three/fiber';
import { useScroll, Environment, OrbitControls } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function BottleScene() {
  const bottleRef = useRef();
  const scroll = useScroll();

  useFrame(() => {
    if (!bottleRef.current) return;
    
    const progress = scroll.offset;
    
    // Rotation
    bottleRef.current.rotation.y = progress * Math.PI * 2;
    
    // Scale (subtle size increase)
    const scale = 1 + progress * 0.2;
    bottleRef.current.scale.set(scale, scale, scale);
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      
      <mesh ref={bottleRef}>
        <cylinderGeometry args={[0.5, 0.5, 1.5, 32]} />
        <meshPhysicalMaterial
          color={0xffffff}
          transmission={0.9}
          thickness={0.5}
          roughness={0.05}
          ior={1.5}
          envMapIntensity={1.0}
        />
      </mesh>
      
      <Environment preset="studio" />
    </>
  );
}

export default function App() {
  return (
    <div style={{ height: '300vh' }}> {/* Tall page for scrolling */}
      <Canvas style={{ position: 'fixed', top: 0, left: 0 }}>
        <BottleScene />
      </Canvas>
      
      <div style={{ position: 'relative', zIndex: 10, padding: '50vh 2rem' }}>
        <h1>Scroll to rotate</h1>
        <p>Your product copy here...</p>
      </div>
    </div>
  );
}
```

---

## Performance Optimisations

### 1. Fixed Canvas + Scroll Container

```css
canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}

.content {
  position: relative;
  z-index: 10;
  height: 300vh; /* Tall to enable scrolling */
}
```

**Why**: Canvas doesn't re-render on scroll (just transforms update)

### 2. Throttle Scroll Events

```javascript
let ticking = false;

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateScrollProgress();
      ticking = false;
    });
    ticking = true;
  }
});
```

**Why**: Avoid expensive calculations on every scroll event

### 3. Use `useFrame` not `useEffect`

```javascript
// ❌ Bad (runs on every scroll event)
useEffect(() => {
  mesh.rotation.y = scrollProgress;
}, [scrollProgress]);

// ✅ Good (synced to 60fps render loop)
useFrame(() => {
  mesh.rotation.y = scrollProgress;
});
```

---

## Lighting Setups

### A. Studio Lighting (Product Photography)

```javascript
<Environment preset="studio" />
```

Or manual:

```javascript
const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
keyLight.position.set(5, 5, 5);

const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
fillLight.position.set(-5, 0, -5);

const rimLight = new THREE.DirectionalLight(0xffffff, 0.8);
rimLight.position.set(0, 5, -5);
```

### B. HDRI Environment (Realism)

```javascript
import { Environment } from '@react-three/drei';

<Environment files="/studio_lighting.hdr" />
```

---

## UI Overlays

**Text that fades in/out with scroll**:

```javascript
const textOpacity = Math.max(0, 1 - scrollProgress * 2); // Fade out first half

<div style={{ opacity: textOpacity }}>
  <h1>Premium Glass Design</h1>
</div>
```

**Section-based content**:

```javascript
// Show different text at 0-33%, 33-66%, 66-100%
const section = Math.floor(scrollProgress * 3);

const content = [
  { title: "Crafted Glass", text: "Hand-blown borosilicate..." },
  { title: "Sustainable", text: "100% recycled materials..." },
  { title: "Timeless", text: "Design that lasts..." }
];

<div>{content[section].title}</div>
```

---

## Common Patterns Observed

### Glass Bottle Demo (himanshubuildss)

**Setup**:
- Tall scroll page (400vh+)
- Glass bottle with liquid inside
- HDRI environment for realism
- Rotation + subtle camera movement
- Text sections with fade in/out

**Materials**:
- Outer glass: transmission=0.95, roughness=0.02
- Inner liquid: transmission=0.7, color=tint
- High clearcoat for glossy finish

### One-Shot Site (viktoroddy)

**Setup** (inferred from live site):
- Minimal page height (200vh)
- Single object or composition
- Fast implementation (likely from template/AI generation)
- Basic scroll-to-rotate

**Characteristics**:
- Simple geometry (not complex CAD)
- Quick turnaround (shows AI code generation capability)
- Deployed to Vercel (standard stack)

---

## What I'd Build (This Repo)

### Goals

1. ✅ **Document the pattern** (this file)
2. 🚧 **Minimal scroll product demo** (extend `web-3d` or new experiment)
   - Generic product (not glass bottle — avoid "me too" replication)
   - Procedural geometry (box, cylinder, torus — interesting enough to showcase)
   - Dark cinematic UI
   - Scroll-driven rotation + camera
3. 🚧 **Reusable component library** (optional)
   - `<ScrollScene>` wrapper
   - `<ScrollObject>` with rotation/scale/position props
   - `<ScrollCamera>` with keyframe system

### What I'm NOT Doing

- ❌ Exact glass bottle recreation (that's himanshubuildss' demo, not mine)
- ❌ Complex product CAD (focus on the *scroll pattern*, not the asset)
- ❌ Text-heavy marketing page (just the 3D interaction showcase)

---

## Free Resources

### 3D Models
- [Poly Haven Models](https://polyhaven.com/models) (CC0)
- [Sketchfab CC0](https://sketchfab.com/3d-models?licenses=322a749bcfa841b29dff1e8a1bb74b0b)
- Procedural modeling (Three.js geometry)

### HDRI Lighting
- [Poly Haven HDRIs](https://polyhaven.com/hdris) (CC0)
- [HDRI Haven](https://hdrihaven.com/) (CC0)

### Scroll Libraries
- [@react-three/drei useScroll](https://github.com/pmndrs/drei#usescroll)
- [Lenis](https://lenis.studiofreight.com/) (smooth scrolling)
- [Locomotive Scroll](https://locomotivemtl.github.io/locomotive-scroll/)

---

## Implementation Checklist

- [x] Document scroll-driven 3D pattern
- [ ] Add scroll product demo to `experiments/`
- [ ] Test with procedural geometry (torus, abstract shape)
- [ ] Dark cinematic UI with scroll hints
- [ ] Vercel deployment ready

---

## Key Learnings

1. **Scroll is the controller** — Direct mapping, not timed animation
2. **Materials make it photoreal** — Transmission + HDRI = magic
3. **Camera movement > object rotation** — Apple/Stripe use camera dolly/orbit more than object spin
4. **Performance matters** — Fixed canvas + rAF syncing
5. **AI can generate these fast** — viktoroddy's one-shot proves it's automatable

---

## Related Files

- `experiments/ai-3d-lanes/web-3d/` — Could extend with scroll controls
- `docs/visual-quality-bar.md` (to be created) — Reference for UI aesthetic
- `docs/adrs/ADR-0002-scroll-driven-3d.md` (optional) — Pattern decision doc

---

**Last updated**: 2026-09-07  
**Status**: Documentation complete, implementation pending  
**Next**: Build minimal scroll product showcase with procedural geometry
