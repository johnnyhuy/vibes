# Visual Quality Bar — Cinematic Product Demos

This document captures the visual quality bar I'm aiming for in the vibes experiments, based on the viral demos that inspired this work.

## Reference Demos (September 2026)

### 1. [@ashebytes Model X Explode](https://x.com/ashebytes/status/2096009146248122416)
**What it is**: Tesla Model X exploded into 334 pieces via GPT-6 Astra

**Visual qualities**:
- **Dark background** — Pure black, not grey (#000000)
- **Studio lighting** — Bright, even illumination on the car
- **Cinematic camera** — Low FOV, distant orbit, smooth movement
- **Frosted glass UI** — Semi-transparent panels with backdrop blur
- **Component labels** — Clean typography on dark panels
- **Smooth animation** — Lerp-based explosion, no jarring cuts
- **Product marketing aesthetic** — Looks like official Tesla materials

**Thumbnail**: `hill-climb/refs/ashe-modelx.jpg`

---

### 2. [@DilumSanjaya V8 Cutaway](https://x.com/DilumSanjaya/status/2096280244663775423)
**What it is**: Interactive V8 engine with animated pistons, valves, live gauges

**Visual qualities**:
- **Technical aesthetic** — Monospace fonts, precise indicators, engineering diagrams
- **Detailed geometry** — Camshafts, connecting rods, valve springs visible
- **Live gauges** — RPM, compression bar, valve timing chart, indicator diagram
- **Color-coded systems** — Red crankshaft, blue pistons, purple valves, black block
- **Rotatable view** — Orbit controls to inspect from any angle
- **Firing order visualization** — Numbered cylinders, stroke cycle indicators
- **Cutaway sections** — Progressive reveal showing internal components

**Thumbnail**: `hill-climb/refs/v8-dilum.jpg`

---

### 3. [@alwayspriyesh Earth Timeline](https://x.com/alwayspriyesh/status/2096819464688005440)
**What it is**: Interactive Earth history over 4.5 billion years (GPT-6 Astra in ~30 minutes)

**Visual qualities**:
- **Dark space background** — Black with starfield
- **Photorealistic Earth** — High-quality textures, atmosphere glow, cloud layer
- **Clean typography** — Large, minimal, high contrast
- **Timeline scrubber** — Horizontal bar with era markers, smooth drag interaction
- **Era descriptions** — Text panels with context for each period
- **Smooth transitions** — Planet appearance evolves as timeline moves
- **Play animation** — Auto-advance through billions of years

**Thumbnail**: `hill-climb/refs/earth-astra.jpg`

---

### 4. [@Legendaryy Blender MCP Semicircle](https://x.com/Legendaryy/status/2096510965789422001)
**What it is**: GPT Astra installed Blender MCP, rendered 51 MacBook Airs in a semicircle, then built an interactive 3D website

**Visual qualities**:
- **Agent-driven workflow** — MCP installation → scene construction → GLB export → web viewer
- **Procedural array layout** — 51 instances in 180° semicircular arc
- **Parametric generation** — Clean code-driven approach, not manual placement
- **Dark cinematic framing** — Camera positioned to showcase the full semicircle
- **End-to-end automation** — From Blender script to deployed website

**Reference doc**: `docs/reverse-engineering/blender-mcp-macbook-semicircle.md`

---

###5. [@himanshubuildss Glass Bottle Scroll](https://x.com/himanshubuildss/status/2096243989439713677)
**What it is**: Photoreal glass bottle with refraction, liquid, scroll-driven rotation

**Visual qualities** (from `hill-climb/refs/himanshu-glass-bottle-thumb.jpg`):
- **Horizontal apothecary** — wide cylinder, short neck, black cap, lying on its side
- **Dark green / black glass** — transmission so lime type behind the bottle distorts
- **Strip studio highlights** — long speculars along the length
- **Scroll — it rolls** — long-axis spin, not a turntable
- **Chartreuse + black** marketing chrome (I used Aether, not their brand)

**Reference doc**: `docs/reverse-engineering/webgl-scroll-product.md`

---

### 6. [@viktoroddy One-Shot Three.js Site](https://x.com/viktoroddy/status/2096556452999741555)
**What it is**: AI-generated 3D website from prompt, live at https://hand-touch-omega.vercel.app/

**Visual qualities**:
- **Fast iteration** — Prompt to deployed site in hours
- **Simple geometry** — Clean, not overcomplex
- **Good lighting** — Proves lighting matters more than model complexity
- **Immediate deployment** — Vercel integration, live URL

**Reference doc**: `docs/reverse-engineering/webgl-scroll-product.md`

---

### 7. [@bharatmodi2014 Japanese Tower](https://x.com/bharatmodi2014/status/2096974996455444494)
**What it is**: Interactive Three.js Japanese keep — seasons, day/night, weather, atmosphere

**Visual qualities** (from the public post + video thumb; I did not copy their chrome):
- **Outdoor cinematic valley** — not a studio turntable
- **Controls retint the world** — lighting, fog, particles, materials
- **Glass overlay** — season / weather / time as first-class state; thumb also shows a keep *being raised*
- **Architectural hero** — stacked roofs + scaffold read as a tenshu even at low poly

**Reference doc**: `docs/reverse-engineering/japanese-tower-threejs.md`

---

## Common Patterns

Across these demos, the quality bar is:

1. **Dark UI** — Black backgrounds, not grey (#000 or #0a0a0a)
2. **Frosted glass panels** — `backdrop-filter: blur(20px)`, rgba backgrounds
3. **Studio lighting** — Multiple light sources, soft shadows, even illumination
4. **Smooth animations** — Lerp-based, 60fps, no jarring cuts
5. **Clean typography** — Sans-serif for body, monospace for technical data
6. **High-contrast UI** — White/bright text on dark panels
7. **Orbital camera** — Three.js OrbitControls, smooth damping
8. **Cinematic framing** — Low FOV (40-50°), distant camera
9. **Product aesthetic** — Looks like official marketing, not a prototype

---

## My Implementation Status

### fairday-walk ✅ (local)
- ✅ Fair-day residential lane + frosted light HUD (serif place chip, Inter chrome)
- ✅ Eight invented stops, scroll-driven camera, Explore orbit on the current place
- ✅ Mid-fi procedural PBR (tiles, laundry, well, bikes). Vendored Poly Haven sky HDRI under Suspense
- ⚠️ No Vercel project — do not create one until quota is healthy
- Inspired by [anyumeng28](https://x.com/anyumeng28/status/2097175519825383852) (post + live *read* only)

### keel-hex ✅ (local)
- ✅ White studio bench + light frosted HUD (Alba Forum family, teal accent, invented nouns)
- ✅ Procedural KH-55 / Spool Plate hex trainer, Assembled / Inside / Exploded, Play assembly walk
- ✅ Vendored Poly Haven CC0 Studio Small 03. No PX4 / S3 catalog. Distinct from explode-assembly
- ⚠️ No Vercel project — do not create one until quota is healthy
- Inspired by [Peter05704721](https://x.com/Peter05704721/status/2097144569989300371) (post + X video thumb; no site scrape)

### breakwater ✅ (local)
- ✅ Dusk pier + frosted dusk HUD (Cinder Mere / kiln tokens, invented nouns)
- ✅ Procedural Spile Frame, tetrapod groyne, sine water, orbit + three marks
- ✅ Vendored Poly Haven CC0 Small Harbour Sunset. Mute-default surf. No chassis picker
- ⚠️ No Vercel project — do not create one until quota is healthy
- Inspired by a public Crayon Arcade mecha / breakwater pitch (feel-only still; no bundle scrape)

### brine-causeway ✅ (local)
- ✅ Late-sun coast strip + thin editorial HUD (atmosphere chip, Cut the brine)
- ✅ Procedural Iodine Wedge, Vermilion Span, Salt Reach loop. No Ferrari nouns
- ✅ Vendored Poly Haven CC0 coast HDRI. Mute-default surf. No third-party rail
- ⚠️ No Vercel project — do not create one until quota is healthy
- Inspired by [arianlooterking](https://x.com/arianlooterking/status/2097080866526704056) (post + live *read* only)

### alba-forum ✅ (local)
- ✅ Soft off-white / chalk avenue + frosted museum HUD (serif landmark chip, Inter chrome)
- ✅ Ten invented stops, scroll-driven camera, Explore orbit on the current mesh
- ✅ Procedural masonry only. No Rome itinerary. No coast drive
- ⚠️ No Vercel project — do not create one until quota is healthy
- Inspired by [levinstanley](https://x.com/levinstanley/status/2097083437610074117) (post + title-card feel; no site scrape)

### kiln-studs ✅ (local)
- ✅ Dark brick studio + frosted dusk HUD (Cinder Mere tokens, invented nouns)
- ✅ Procedural Ember Hare (42 stud bricks), eight-step instructions, explode
- ✅ Idea → palette mock only (three hardcoded prompts). No SetCreator / no catalog
- ⚠️ No Vercel project — do not create one until quota is healthy
- Inspired by [antonklingspor](https://x.com/antonklingspor/status/2097062589268136439) (post + X video thumb; no site scrape)

### heartwood-warden ✅ (local)
- ✅ Dark moonlit woodland (teal-navy, not grey) + frosted pale-glass HUD
- ✅ Procedural shrine guardian, sine gait, ten invented casts, lantern spirits
- ✅ Poly Haven CC0 photogrammetry canopy + undergrowth + night HDRI (not Kenney boxes)
- ✅ Optional generated ward snippet (our code shape)
- ⚠️ No Vercel project — do not create one until quota is healthy
- Inspired by [NickDevFE](https://x.com/NickDevFE/status/2096946586781692297) (OG lockup + X woodland thumb studied; no source scraped)

### nacre-loom ✅ (local)
- ✅ Dark kiln studio + frosted loom desk (not their preset thumbnail rail)
- ✅ Lobed icosahedron + transmission glass + invented nacre weaves
- ✅ Dyes / motion / lobe / IOR knobs and a generated snippet
- ⚠️ No Vercel project — do not create one until quota is healthy
- Inspired by [onix_react](https://x.com/onix_react/status/2096978661802975464) (live URL 404; still + copy only)

### amber-longeron ✅ (local)
- ✅ Linen-tan studio + soft upper-left key (not a black canyon)
- ✅ Licensed vintage biplane GLB (bradacvojtech Sopwith Camel, CC-BY) + studio HDRI + carnelian lane orbs
- ✅ Auto-starts; flight HUD is a faint distance chip; crash keeps a small card
- ⚠️ No Vercel project — do not create one until quota is healthy
- Inspired by [heymichu25](https://x.com/heymichu25/status/2097062564299759855)

### procedural-grass-field ✅ (local)
- ✅ Outdoor meadow (not a black car studio)
- ✅ Instanced crossed blades + tip-weighted wind + pointer gust
- ✅ Species / look / density chips, pale glass HUD
- ⚠️ No Vercel project — do not create one until quota is healthy
- Inspired by [Bilal Khan / Grassworks](https://x.com/Bk23544/status/2096928659785626028)

### audio-gadget-spin ✅ (local)
- ✅ Dark studio + frosted marketing chrome
- ✅ Licensed over-ear GLB (Spacebar Headphones, CC-BY) + studio HDRI + finish tints / hotspots
- ✅ Slow auto-orbit, drag override, three finishes, mute-default Web Audio
- ⚠️ Project `vibes-audio-gadget-spin` (`prj_N57mvThg4UcU9XxLK3F5wAICz9PA`) exists `deploy: false`, SSO off — **no production**. Do not redeploy until after quota (~2026-09-08 20:39 UTC)
- Inspired by [Xr0ud](https://x.com/Xr0ud/status/2096982574132297791), [mrblackstudio](https://x.com/mrblackstudio/status/2096893411395600782), [Gilbert93533589](https://x.com/Gilbert93533589/status/2096920288319435154)

### cinder-mere ✅ (local)
- ✅ Dusk basin heightmap + invented marks (Wick Spire / Pewter Jetty / Low Kiln / Flint Ford)
- ✅ Poly Haven CC0 portable welding cart as Soot Runner + Venice Sunset HDRI
- ⚠️ No Vercel project — do not create one until quota is healthy
- Inspired by [ShifroAnimation](https://x.com/ShifroAnimation/status/2097116905068966284) (public post + live *read* only)

### japanese-tower ✅
- ✅ Pale glass chrome (not their product frame)
- ✅ Procedural keep + lift (scaffold → storeys → tiles)
- ✅ Season / day-night / weather / haze actually change the look
- ✅ LIVE at [vibes-japanese-tower.vercel.app](https://vibes-japanese-tower.vercel.app) (Ridge Pagoda, `dpl_Gap9BAXosU4jMEsQsR8c2nKyEPjg`). Skip after quota unless visual QA fails
- Inspired by [bharatmodi2014](https://x.com/bharatmodi2014/status/2096974996455444494)

### scroll-product-showcase ✅ (local)
- ✅ Black stage (`#030303`) + chartreuse type (Caldera-class read, not the brand)
- ✅ Horizontal apothecary lathe, black cap, dark green glass + liquid
- ✅ 3D `Text` behind the bottle (refraction subject)
- ✅ Strip Lightformers (long speculars)
- ✅ Scroll rolls the long axis (“it rolls”)
- ⚠️ No live URL until quota reset + **#4** first production
- Thumb: `hill-climb/refs/himanshu-glass-bottle-thumb.jpg`

### explode-assembly ✅
- ✅ Dark background
- ✅ React + R3F + drei
- ✅ Orbital camera
- ✅ Explosion slider
- ✅ Frosted MODEL 3 UI on production `de25d60` (PASS 2026-09-08 ~2:22am AEST)
- ✅ 2026-09-08 sweep: clearer glass + selected-part overview card
- ⚠️ Lighting could be more studio-like

### earth-timeline ✅
- ✅ Dark background with starfield
- ✅ React + R3F + drei
- ✅ Orbital camera
- ✅ Timeline scrubber with era markers
- ✅ 2026-09-08 sweep: Astra-class editorial + thin timeline (not a bulky card)
- ⚠️ Earth textures are procedural (could use NASA Blue Marble)
- ⚠️ Atmosphere is simple glow (could use Rayleigh scattering)

### v8-cutaway ✅
- ✅ Dark background
- ✅ React + R3F + drei
- ✅ Orbital camera
- ✅ Live gauges (RPM, stroke cycle, pressure)
- ✅ 2026-09-08 sweep: firing-order dots, glass dock, ring platform
- ⚠️ Geometry is simplified (no camshafts, connecting rods)
- ⚠️ Could add cutaway shader for progressive reveal

---

## Next Level Upgrades

To match the reference demos exactly, I'd need:

### earth-timeline
- NASA Blue Marble textures (real Earth map)
- Proper atmosphere shader (Rayleigh scattering)
- Tectonic plate animation
- Event markers (asteroid impacts, ice ages)
- More detailed era UI (charts, graphs)

### v8-cutaway
- Connecting rods (proper piston-crankshaft linkage)
- Camshafts and rocker arms
- Valve springs and pushrods
- Cutaway shader (slice plane reveal)
- Numbered cylinders with firing order
- Combustion particle effects
- More detailed gauges (torque curve, power output)

### explode-assembly
- shadcn/ui components (instead of plain CSS)
- Better lighting (HDRI environment)
- System isolation mode (hide everything except selected)
- Search/filter in parts list
- Smooth camera transitions when selecting parts

---

## Clean-Room Principles

I'm **not copying** these demos' code or assets. I'm learning the **visual patterns**:
- What makes a demo look "cinematic" vs "prototype"
- How frosted glass, dark UI, and studio lighting create the aesthetic
- What level of geometry detail is needed for realism
- How smooth animations and orbital cameras enhance the experience

Then implementing those patterns with:
- Freely licensed assets (CC-BY, CC0)
- My own React + R3F code
- Procedural geometry or public 3D models
- Proper attribution for all sources

---

**Author**: Johnny Huynh  
**Purpose**: Visual quality reference for vibes experiments  
**Last Updated**: 2026-09-08 (Fairday Walk memory lane; still no new Vercel project; quota wait ~2026-09-08 20:39 UTC)
