# Reverse Engineering: ashemag's Anatomy Explode Demo

**Source**: [@ashebytes anatomy explode](https://x.com/ashebytes/status/2096221988763173186)  
**Context**: Human anatomy exploded into 2,234 pieces — same architecture as Model X explode  
**Study Date**: 2026-09-07  
**Purpose**: Clean-room notes for potential next kitchen-sink experiment

---

## What Makes It Interesting

After the viral Tesla Model X explode (334 pieces), ashemag applied the **same technical pattern** to a completely different domain: **human anatomy**.

**Key observation**: The explosion algorithm is **domain-agnostic**. It works on:
- Cars (Model X: 334 pieces)
- Human body (2,234 pieces)
- Any multi-mesh GLB with separated components

This suggests a **general-purpose exploded view framework** that could be applied to:
- Machinery (engines, watches, appliances)
- Architecture (buildings, rooms, furniture)
- Biology (organs, cells, molecular structures)
- Electronics (circuit boards, devices)

---

## Technical Pattern (Same as Model X)

### 1. Multi-Mesh Anatomical GLB

**Same approach**: One GLB file with thousands of separated mesh islands.

**Anatomy-specific**:
- 2,234 pieces = individual bones, muscles, organs, vessels, nerves
- Each mesh is a selectable anatomical structure
- Likely sourced from medical 3D atlas or Blender anatomy add-on

**Piece granularity**:
- **Skeleton**: Individual bones (femur, tibia, vertebrae, phalanges, etc.)
- **Muscles**: Major muscle groups (biceps, triceps, quadriceps, etc.)
- **Organs**: Heart, lungs, liver, stomach, brain, etc.
- **Vascular**: Arteries, veins (possibly major vessels only)
- **Nervous**: Brain, spinal cord, major nerves

### 2. System Grouping

**Same pattern as car systems**, but for anatomy:

```typescript
const ANATOMY_SYSTEMS = {
  skeletal: ['bone', 'vertebra', 'skull', 'rib', 'femur', 'tibia', ...],
  muscular: ['muscle', 'biceps', 'triceps', 'deltoid', ...],
  circulatory: ['heart', 'artery', 'vein', 'aorta', 'vessel', ...],
  respiratory: ['lung', 'trachea', 'bronchi', 'diaphragm', ...],
  digestive: ['stomach', 'liver', 'intestine', 'esophagus', ...],
  nervous: ['brain', 'spinal_cord', 'nerve', 'cerebellum', ...],
  // ... etc
};
```

**Sidebar UI**: Instead of "Body, Glass, Doors", show "Skeletal, Muscular, Circulatory".

### 3. Explosion Layout

**Identical algorithm**:
- Project 3D bounding boxes onto 2D viewing plane
- Bin-pack into grid
- Calculate translation vectors
- Lerp from original position to exploded position

**Anatomy-specific considerations**:
- 2,234 pieces → much larger grid than 334-piece car
- Smaller individual pieces (finger bones vs car door)
- Possibly multiple "layers" of explosion (skin → muscle → bone)

### 4. React + R3F Architecture

**Same stack**:
- React for state management
- @react-three/fiber for 3D rendering
- @react-three/drei for OrbitControls, Environment
- shadcn/ui for sidebar and controls

**Reusable components** from Model X:
- `<ExplodableModel>` — Generic component, swap GLB
- `<SystemSidebar>` — Pass different system list
- `<ExplosionSlider>` — Same UI, different piece count
- `explosion-layout.ts` — Algorithm unchanged

---

## Why This Is a Good Next Experiment

### 1. Proves the Pattern Is General-Purpose
- Same code, different domain
- Shows vibes could become an **exploded view framework**
- Learning: "How to build reusable 3D visualization tools"

### 2. Educational Value
- Anatomy models are widely available (CC-BY, educational licenses)
- Medical visualization is a real-world use case
- Could be used for teaching/reference

### 3. Technical Challenge: Scale
- 2,234 pieces vs 334 → 6.7x more meshes
- Performance optimization needed?
- Spatial indexing, LOD, culling strategies
- Learning: "How to handle high-piece-count explosions"

### 4. Different Aesthetic
- Medical illustration style vs automotive product marketing
- Opportunity to explore different UI themes
- Color-coding by system (bones=white, muscles=red, organs=pink)

---

## Implementation Approach (Clean-Room)

### Asset Sourcing
**Do NOT use ashemag's GLB** (proprietary or licensed asset).

**Free alternatives**:
- **Sketchfab**: Search "human anatomy" filtered by CC-BY
- **Blender Add-ons**: MB-Lab, ManuelbastioniLAB (free anatomical models)
- **NIH 3D Print Exchange**: Public domain medical models
- **Visible Human Project**: CT/MRI data (requires processing)

**Attribution required**: Always credit source + license.

### Code Strategy
**Reuse explode-assembly structure**:
1. Copy `experiments/explode-assembly` → `experiments/anatomy-explode`
2. Replace `model3.glb` with anatomy GLB
3. Update `SYSTEM_KEYWORDS` for anatomical systems
4. Adjust colors/materials for medical aesthetic
5. Update README with anatomy context

**Minimal changes needed** — proves the pattern is reusable.

### UI Adjustments
- **Sidebar**: "Skeletal System (312 bones)", "Muscular System (640 muscles)", etc.
- **Color scheme**: Medical illustration palette (bone white, muscle red, organ pink)
- **Background**: Keep dark or shift to medical blue-grey
- **Labels**: Anatomical terms (Latin names optional, common names primary)

### Performance
- 2,234 pieces → test FPS, optimize if needed
- Consider LOD (distant pieces simplified)
- Spatial culling (only render pieces in view)
- Instancing for repeated structures (vertebrae, ribs)

---

## Open Questions

1. **How did ashemag get to 2,234 pieces?**
   - Did they manually separate in Blender?
   - Pre-separated medical atlas?
   - Automated segmentation from CT data?

2. **How granular should bones be?**
   - Individual phalanges (finger bones) → 56 pieces just for hands
   - Or group as "left hand" → 1 piece?

3. **Performance at 2,234 pieces?**
   - Does it run at 60 FPS on average hardware?
   - Do they use LOD or culling?

4. **Texture detail?**
   - Solid colors or PBR materials?
   - Bone texture, muscle fibers, organ surfaces?

---

## Related Inspiration: Busan Summer Atlas

**Reference**: [big.mo.ai.jp](https://big.mo.ai.jp) (Busan city travel map)

**Context**: Interactive 3D city exploration with POI markers, smooth camera transitions, narrative pacing.

**Potential kitchen-sink lane**:
- Load city GLB (buildings, streets, landmarks)
- Mark points of interest (restaurants, museums, parks)
- Camera tours between locations
- Storytelling layer (itinerary, history, recommendations)

**Different from explode pattern** — camera animation + narrative, not mesh separation.

**Could be a separate experiment**: `experiments/city-tour` or `experiments/travel-map`.

---

## Next Steps (After PR #2 Merges)

1. **Find CC-BY anatomy GLB** — Sketchfab search, verify license
2. **Prototype anatomy-explode** — Copy explode-assembly structure, swap asset
3. **Test performance** — 2,234 pieces vs 334, measure FPS
4. **Document in vibes** — Add to experiments/README, ADR if architectural changes
5. **Optional**: Extract shared code into `packages/explode-framework`

**Timing**: After PR #2 visual QA passes and merges. Not urgent, just documented for roadmap.

---

## References

- [@ashebytes anatomy explode](https://x.com/ashebytes/status/2096221988763173186) — 2,234 pieces
- [@ashebytes Model X explode](https://x.com/ashebytes/status/2096009146248122416) — 334 pieces (original)
- [github.com/ashemag/model-x-studio](https://github.com/ashemag/model-x-studio) — Reference architecture
- Busan Summer Atlas: [big.mo.ai.jp](https://big.mo.ai.jp) — City travel map inspiration

---

**Author**: Johnny Huynh  
**Purpose**: Clean-room notes for potential next experiment  
**Status**: Documented for future roadmap, not implemented yet  
**Last Updated**: 2026-09-07
