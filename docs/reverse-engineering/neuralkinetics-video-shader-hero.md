# Reverse Engineering: NeuralKinetics Video-Shader Hero Pattern

**Source**: [hand-touch-omega.vercel.app](https://hand-touch-omega.vercel.app/)  
**Study Date**: 2026-09-07  
**Purpose**: Clean-room notes on poster-first video/shader pipeline for organic motion heroes, not code copying

**Visual reference**: Light editorial hero with human hand reaching toward robot hand. Clean, minimal UI. See attached `hill-climb/refs/neuralkinetics-live.png` for reference.

## What This Pattern Is

**Video-shader hero** — An autoplaying looping video composited through a custom WebGL shader, not an interactive 3D scene or scroll-driven animation.

Key characteristics:
- **Photoreal organic motion** (human hand + robot hand)
- **Looping background video** (~12 seconds)
- **Custom shader decoding** RGB+matte from RGBA video halves
- **Poster-first fallback** for instant visual
- **Minimal interaction** — pointer mainly unlocks playback
- **Reduced-motion/visibility/context-loss handling**

## Why This Pattern Exists

### 1. **Organic Motion Without Rigging**
Human hand movement is **notoriously hard to replicate** with 3D skeletal rigs:
- Skin deformation (wrinkles, stretching)
- Finger articulation (20+ bones)
- Natural motion timing
- Photoreal lighting/materials

**Filming real hands** + compositing in WebGL is faster and more convincing than:
- Hand-rigging in Blender
- Motion capture cleanup
- Procedural animation tuning

### 2. **Shader Compositing Flexibility**
Custom shaders unlock:
- **Alpha matte control** — Clean edges, no green screen artifacts
- **Colour grading** — Match video to UI palette in real-time
- **Blend modes** — Overlay text/graphics on video
- **Performance** — GPU-accelerated, 60fps on mobile

### 3. **Poster-First Performance**
The pattern prioritizes **instant visual feedback**:
1. Show poster frame immediately (static image)
2. Start video load in background
3. Swap to video when ready

No blank canvas, no loading spinner. User sees **something meaningful** in <100ms.

### 4. **Reduced-Motion Respect**
Modern accessibility pattern:
```javascript
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // Show poster only, skip autoplay
}
```

Users who request reduced motion see the static hero, not looping animation.

## NeuralKinetics Implementation (Reverse-Engineered)

From inspecting the live site:

### 1. **Video Asset Structure**
The hero video appears to be:
- **RGBA format** with two halves:
  - **Top half**: RGB colour channels
  - **Bottom half**: Alpha matte (black = transparent, white = opaque)
- **~12 seconds long**, seamless loop
- **Encoded for web** (H.264 or VP9, optimized for streaming)

**Why dual-channel encoding?**  
Video codecs don't natively support alpha transparency well. Packing RGB+matte into one RGBA video lets you:
- Use standard video formats
- Control transparency in shader
- Avoid green screen keying artifacts

### 2. **Three.js Setup**
```javascript
// Full-screen quad (two triangles covering viewport)
const geometry = new THREE.PlaneGeometry(2, 2);

// Video texture
const video = document.createElement('video');
video.src = '/hero-hand-touch.mp4';
video.loop = true;
video.muted = true;
video.playsInline = true;

const texture = new THREE.VideoTexture(video);
texture.minFilter = THREE.LinearFilter;
texture.magFilter = THREE.LinearFilter;

// Custom shader material
const material = new THREE.ShaderMaterial({
  uniforms: {
    uVideoTexture: { value: texture },
    uTime: { value: 0 }
  },
  vertexShader: vertexShaderCode,
  fragmentShader: fragmentShaderCode,
  transparent: true
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
```

**Three.js r185** detected (from network inspection). Vanilla setup, no R3F.

### 3. **Custom Shader Decoding**
Fragment shader likely does:
```glsl
varying vec2 vUv;
uniform sampler2D uVideoTexture;

void main() {
  // Sample top half for RGB
  vec2 rgbUv = vec2(vUv.x, vUv.y * 0.5);
  vec3 rgb = texture2D(uVideoTexture, rgbUv).rgb;
  
  // Sample bottom half for alpha
  vec2 alphaUv = vec2(vUv.x, vUv.y * 0.5 + 0.5);
  float alpha = texture2D(uVideoTexture, alphaUv).r;
  
  gl_FragColor = vec4(rgb, alpha);
}
```

**Result**: Clean alpha compositing without green screen. Robot hand edges look sharp, no keying halos.

### 4. **Autoplay + Interaction Logic**
```javascript
// Poster-first
video.poster = '/hero-poster.jpg';

// Attempt autoplay when ready
video.addEventListener('canplay', () => {
  video.play().catch(() => {
    // Browser blocked autoplay; wait for user interaction
  });
});

// Unlock on pointer/touch
document.addEventListener('pointerdown', () => {
  if (video.paused) {
    video.play();
  }
}, { once: true });
```

**Browsers block autoplay without user gesture** on some mobile devices. Poster frame ensures visual until interaction unlocks playback.

### 5. **Reduced-Motion Handling**
```javascript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  // Don't autoplay; show poster only
  video.pause();
  video.currentTime = 0;
}
```

Respects OS-level accessibility setting.

### 6. **Visibility API Optimization**
```javascript
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    video.pause(); // Stop decoding when tab is hidden
  } else {
    video.play();
  }
});
```

Saves battery/CPU when user switches tabs.

### 7. **WebGL Context Loss Recovery**
```javascript
renderer.domElement.addEventListener('webglcontextlost', (event) => {
  event.preventDefault();
  cancelAnimationFrame(animationId);
});

renderer.domElement.addEventListener('webglcontextrestored', () => {
  // Reinitialize textures, restart loop
  texture.needsUpdate = true;
  animate();
});
```

Mobile browsers **suspend WebGL contexts** to save memory. Context restoration ensures the hero doesn't stay blank after resume.

## UI Design Pattern

### 1. **Light Editorial Aesthetic**
- **Soft gray background** (#f5f5f5 or similar, not pure white)
- **Large serif headline** — "NeuralKinetics made organic" (editorial weight)
- **Minimal chrome** — No toolbars, just logo + menu button
- **High contrast text** on light background (WCAG AAA)

Contrast with common dark product UIs (Steam Atlas, explode-assembly). NeuralKinetics chooses **approachable, human-first** over **technical/cinematic**.

### 2. **Fixed Minimal Navigation**
- **Logo top-left** (black, small)
- **Menu button top-right** (pill shape, icon + label)
- **Adaptive Systems badge** (top-right, subtle)

No sidebar, no hero controls, no visual noise. Content is the focus.

### 3. **Tagline + Subheading Structure**
- **Hero headline** — Large, bold, editorial serif
- **Subheading** — Small sans-serif, muted gray
- **Pill navigation** — Bottom of hero (Neuromorphic, AGI, Cybernetics)

Clear information hierarchy. User immediately understands:
1. Brand (NeuralKinetics)
2. Thesis (bionetics made organic)
3. Domains (neuromorphic, AGI, cybernetics)

### 4. **One Strong Visual Thesis**
The hero shows **one moment**: human hand and robot hand nearly touching.

Not:
- Scroll-triggered scenes
- Mouse-follow pointers
- Multi-scene carousel

**One loop, one thesis, no distraction.** Cinematic restraint.

## Performance Characteristics

### Bundle Size
- **Three.js r185**: ~600 KB (full library, not tree-shaken)
- **Custom shader code**: ~2 KB
- **Video poster**: ~50 KB JPEG
- **Hero video**: ~5-10 MB MP4 (H.264, web-optimized)

**Trade-off**: Video is larger than procedural 3D, but visual quality is photorealistic without artist modeling or rigging.

### Loading Strategy
1. **Poster loads first** (inline or high-priority fetch)
2. **Video streams in background** (not blocking render)
3. **Shader activates when video ready**

User sees meaningful content in <100ms, full experience in <2s on fast connection.

### Mobile Performance
- **GPU compositing** offloads to hardware
- **Video decode** is hardware-accelerated (H.264/HEVC)
- **60fps playback** on iPhone 12+, Pixel 6+

WebGL video textures are **mobile-optimized** by browsers. Minimal CPU overhead.

## Comparison: Video-Shader vs. Interactive 3D

| Aspect | Video-Shader Hero | Interactive 3D (explode-assembly) |
|--------|-------------------|----------------------------------|
| **Motion quality** | Photoreal (filmed) | Depends on artist rigging |
| **Interaction** | Minimal (autoplay) | Rich (orbit, explode, isolate) |
| **Bundle size** | Large (5-10 MB video) | Moderate (500 KB + GLB) |
| **Loading** | Poster-first, stream video | Load mesh, parse, render |
| **Accessibility** | Reduced-motion support | Keyboard/pointer controls |
| **Use case** | Hero/marketing/brand | Product demo/education |

## When To Use This Pattern

### ✅ **Use Video-Shader Hero When:**
- **Goal is brand storytelling** — Emotional impact over interaction
- **Motion needs to be photoreal** — Human hands, faces, organic subjects
- **Simplicity matters** — One strong visual thesis, no UI complexity
- **Performance budget allows** — 5-10 MB video is acceptable
- **Accessibility is priority** — Reduced-motion, poster fallback built-in

### ❌ **Use Interactive 3D When:**
- **User needs control** — Orbit, zoom, isolate, explode
- **Educational transparency** — Show construction, not just result
- **Bundle size matters** — Mobile-first, <1 MB target
- **Content is parametric** — Need runtime configuration
- **Subject is mechanical** — Gears, chassis, architectural (not organic)

## Lessons for vibes Experiments

### 1. **Poster-First Pipeline**
All video/animation demos should show **something meaningful immediately**:
```javascript
video.poster = '/poster.jpg'; // Always provide
```

No blank canvas, no loading spinner. Poster is the fallback for:
- Slow networks
- Reduced-motion users
- Autoplay-blocked contexts

### 2. **Reduced-Motion Respect**
```javascript
const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) {
  // Show static version, skip animation
}
```

Accessibility is **not optional**. Static fallback should be visually complete.

### 3. **One Strong Visual Thesis**
NeuralKinetics hero is **one moment, looping**. Not:
- Carousel of multiple scenes
- Scroll-triggered progression
- Mouse-follow effects

**Restraint is polish.** One perfect loop > five mediocre interactions.

### 4. **Light UI as Differentiation**
Most technical demos use dark backgrounds. NeuralKinetics chooses **light, editorial, approachable**.

When appropriate (brand-first, not technical), consider:
- Soft gray backgrounds (#f5f5f5)
- High-contrast black text
- Editorial serif headlines
- Minimal fixed chrome

### 5. **Context-Loss Recovery**
Mobile browsers **suspend WebGL** to save memory. Always handle:
```javascript
canvas.addEventListener('webglcontextlost', preventAndPause);
canvas.addEventListener('webglcontextrestored', reinitAndResume);
```

Otherwise hero stays blank after tab switch.

## Public Patterns (Not Proprietary)

These are **general techniques** visible across many WebGL projects:
- Three.js `VideoTexture` (from Three.js docs)
- Full-screen quad rendering (standard WebGL primitive)
- RGBA dual-channel encoding (common video alpha workaround)
- `prefers-reduced-motion` media query (web standard)
- Visibility API optimization (MDN best practice)
- WebGL context loss handling (standard event)

I'm **not copying NeuralKinetics code** — I'm documenting the **pattern** for educational reference.

## What I Learnt

1. **Video can outperform 3D for organic motion** — Filming hands is faster than rigging
2. **Poster-first is non-negotiable** — Instant visual > blank canvas
3. **Reduced-motion is a feature, not an edge case** — Static version should be complete
4. **Restraint = polish** — One perfect loop > complex multi-scene interaction
5. **Light UI differentiates** — Editorial aesthetic vs. dark technical
6. **Context-loss recovery is critical** — Mobile browsers suspend WebGL aggressively

## References

- [hand-touch-omega.vercel.app](https://hand-touch-omega.vercel.app/) — Original source for pattern study
- [Three.js VideoTexture docs](https://threejs.org/docs/#api/en/textures/VideoTexture) — Official API reference
- [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) — Accessibility standard
- [MDN: Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API) — Battery optimization
- [WebGL context loss](https://www.khronos.org/webgl/wiki/HandlingContextLost) — Recovery handling

## Attribution & Ethics

- NeuralKinetics demo inspired this study
- I'm **not redistributing their code or video assets**
- I'm using **public pattern documentation** (Three.js VideoTexture, standard web APIs)
- This is **educational research** on video-shader compositing patterns
- All code examples are original/illustrative, not copied

---

**Author**: Johnny Huynh  
**Purpose**: Learning and education — documenting public patterns for others to study  
**Last Updated**: 2026-09-07
