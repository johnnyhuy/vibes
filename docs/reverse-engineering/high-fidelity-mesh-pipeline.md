# High-Fidelity Mesh Pipeline (Why Viral WebGL Is Not Blocky)

**Study date**: 2026-09-08  
**Purpose**: Educational, clean-room notes on how the viral X / GitHub WebGL demos get *non-blocky* models — and why my Blender MCP lane alone cannot.  
**Status**: Research log only. No demo rewrite in this pass.

This is first-person Johnny Huynh / vibes. I am documenting a public pattern so future-me stops asking a chat agent to “model a character in Blender” and then wondering why it looks like grey Lego.

---

## The short version

The viral clips are not “the LLM got better at cubes.” They are a **mesh pipeline**:

1. Get a real mesh (licensed library, or image → 3D).
2. Clean it in Blender (scale, origin, loose parts, materials, remesh).
3. Export **GLB**.
4. Load it in React Three Fiber with studio `Environment` lighting.
5. Screenshot. Iterate the *asset*, not the shader.

Blender MCP is the **operator**. It is not the **sculptor**. Meshy’s own docs say this out loud. I verified the cited X posts on 2026-09-08 via the X API (ids below).

---

## 1. Why Blender MCP alone stays blocky

I already proved the scripts-first Blender lane in [ADR-0003](../adr/0003-blender-mcp-lane.md) and [blender-mcp-macbook-semicircle.md](./blender-mcp-macbook-semicircle.md). Those scripts call `bpy.ops.mesh.primitive_*_add()`. That is the whole trick and the whole trap.

An MCP server (community or official) gives the agent `bpy`. `bpy` is excellent at:

- placing objects that already exist
- arraying 51 laptops
- renaming data-blocks
- exporting GLB
- lighting a scene that has content

It is *not* a neural mesh generator. When the agent “models” a car or a person through Blender MCP, it stacks cubes, cylinders, UV spheres, and a bevel modifier. Hard-surface blockouts can look intentional. Organic heroes look like toys.

[Meshy’s 2026 Blender MCP guide](https://www.meshy.ai/tutorials/blender-mcp-guide) is explicit:

> Blender MCP is great at driving Blender, but it does not make Blender good at modeling from scratch. Ask it for a detailed character and you get sad gray blobs.

And in their FAQ, word for word:

> Through Blender MCP, Claude can script primitives and modifiers, which works for blockouts and simple shapes but falls apart on detailed organic models. For production-quality assets, generate with Meshy MCP and use Blender MCP to place and refine them in the scene.

They also name the split I keep relearning: **modelling is a generation problem, not a scripting problem.** Claude scripting primitives “gets you boxes and blobs.” Spend five minutes on any Blender MCP thread and you see the same screenshot.

That matches my kitchen sink:

| Lane | What I actually shipped | How it reads |
| --- | --- | --- |
| `blender-semicircle-viewer` | Primitive laptop-like boxes | Educational array. Toy hardware. |
| `procedural-steam-atlas` | Runtime CSG primitives | Charming machine. Not a CAD scan. |
| `explode-assembly` | David_Holiday Sketchfab Model 3 (CC-BY) | Product. The one that looks “real.” |
| `heartwood-warden` | Procedural guardian + Kenney CC0 trees | Hero still invented; forest kitbash is *prop* tier |

If the X thumbnail is a Tesla, a character, or a product, primitives will lose. I should not “prompt harder.” I should change the source of the mesh.

---

## 2. Where the non-blocky meshes actually come from

Five sources I would reach for before I write another `primitive_cube_add`.

### Sketchfab (Creative Commons / downloadable)

This is how explode-assembly stopped looking like Kenney cars. Search CC-BY / CC0, download GLB, keep the author credit in `ATTRIBUTION.md`. Prefer **multi-mesh** files if I need explode / isolate (see [ashe-model-x-explode.md](./ashe-model-x-explode.md)). Always read the licence on *that* model — Sketchfab is a shopfront, not a licence.

### Poly Haven (CC0)

HDRIs, PBR texture sets, and a smaller model library. All CC0. I already used their maps on the Spacebar headphones texture stack (`experiments/audio-gadget-spin/ATTRIBUTION.md`). Community `ahujasid/blender-mcp` can pull Poly Haven assets into a live scene. Official Blender Lab MCP does scene ops; it does not replace this library.

### Objaverse

Research-scale object dataset (Allen AI / LAION lineage). Useful when I need *many* categories or a training-style corpus. Not a “drop this in a Vercel demo” shop. Check per-asset licence before I vendor anything into `public/models/`. Treat it as a research index, not a default hero source.

### Kenney (toy tier)

Kenney kits are generous (often CC0) and perfect for **props**: trees, crates, nature kitbash. They are the wrong hero for a cinematic product shot. I learnt this the expensive way in [2026-09-07 Kenney → Model 3](../incidents/2026-09-07-kenney-to-model3-and-missing-glb.md). Heartwood Warden’s forest is Kenney on purpose. A Kenney “car kit” next to ashebytes’ Model X is a category error.

### Meshy / Tripo / Rodin (image → 3D)

Neural mesh generators. Input a clean reference image (or a few views). Output a textured GLB. This is the path the character / creature / hero-prop posts are on.

I already stubbed the APIs — I am not rewriting those clients here:

- [`experiments/image-to-3d/`](../../experiments/image-to-3d/README.md) — Meshy / Tripo / Rodin comparison
- [`experiments/ai-3d-lanes/mesh-gen/`](../../experiments/ai-3d-lanes/mesh-gen/README.md) — dry-run Meshy client

Rough split I already wrote down: **Tripo** for drafts, **Meshy** for a balanced API, **Rodin / Hyper3D** when the hero has to survive a close-up. Text-to-3D is two-stage on Meshy (preview mesh, then refine + texture). Image-to-3D is the one that matches the viral “one photo in” posts.

---

## 3. Tooling (what I would actually plug into Cursor)

Four pieces. They are not interchangeable.

### `ahujasid/blender-mcp` (community)

The server that popularised the pattern Legendaryy showed. Lives on GitHub. Extra integrations people actually use: Poly Haven downloads, Hyper3D / Sketchfab hooks depending on version. Fine on Blender 4.x. This is what ADR-0003 Phase 3 pointed at.

### Official Blender Lab MCP (Blender 5.1+)

Shipped by the Blender developers through [blender.org/lab/mcp-server](https://www.blender.org/lab/mcp-server/). Requires **Blender 5.1 or newer**. Drag-and-drop the Lab install link *twice* (repository, then add-on). Executes LLM Python **without guards** — Blender’s own page says use a VM or a machine without sensitive files.

Official MCP is brilliant at *scene hygiene*: poly outliers, typo renames, “which objects use this material?”, Geometry Nodes explainers. It is still `bpy`. It will not grow a face from a cube.

If both community and official add-ons are installed they fight over the same port. Pick one.

### Meshy MCP

Official server: [`meshy-dev/meshy-mcp-server`](https://github.com/meshy-dev/meshy-mcp-server). Tools I care about for this note: `meshy_image_to_3d`, `meshy_multi_image_to_3d`, `meshy_text_to_3d` + `meshy_text_to_3d_refine`, remesh / retexture / download. Same credit pool as the Meshy web app. Meshy’s guide is the one that tells you to **generate on Meshy, place on Blender MCP**.

### Cursor

This is the client I already work in. Cursor speaks MCP. The combined setup Meshy documents is: Blender MCP + Meshy MCP in the same agent session, then I still own the Vite / R3F app. Codex / Astra in the cited posts are the same *role* — an agent that can call both servers — not a different geometry algorithm.

I have not stood up the live MCP pair in this repo. Scripts-first still stands. This note is the missing *asset* chapter, not a new server.

---

## 4. The refinement loop I would run

Copied from the posts, Meshy’s own pairing guide, and the NickDevFE notes I already filed. Educational sequence only — I am not pasting anyone’s factory.

```
refs (X still / product photo / t-pose sheet)
  → image gen (clean orthos; Flux / Midjourney / Meshy image tools)
  → image → 3D (Meshy / Tripo / Rodin / Hyper3D)
  → Blender clean (scale to metres, apply transforms, origin,
      separate loose parts, decimate or remesh, material roughness)
  → export GLB (embedded PBR)
  → R3F + drei <Environment> (studio / city / custom lightformers)
  → screenshot QA (same framing as the X ref)
  → iterate the *mesh or the light*, not the React chrome
```

Notes I would tape to the monitor:

- **t-pose, nothing else** — 0xRishi’s visible start for characters. No props, no environment in the ref image.
- **Scaffold Three first** — filiksyos: environment + actions in Three.js, *then* drop the hero GLB. Do not ask the mesh model to invent a game.
- **3D generation is the beginning** — NickDevFE: Image → Hyper3D → img2threejs → agent → interactive Three.js. I already wrote that out in [heartwood-warden.md](./heartwood-warden.md). I rebuilt the *playable wrap*, not their skins.
- **Blender after the generator** — remesh / UV / origin / units. A decimate modifier crushes count; Remesh rebuilds topology. If the silhouette is wrong, regenerate. Do not bevel a blob until it looks like a person.
- **`Environment` is not optional** on product heroes. dreis `Environment` + `ContactShadows` is why explode / glass / Lumen Cuff read as studio shots. A perfect GLB on a grey `MeshStandardMaterial` + one directional light still looks like a viewport.
- **Screenshot QA** — same camera, same crop as the viral still. If it is blocky, the mesh is wrong. If it is muddy, the light is wrong. See [visual-quality-bar.md](../visual-quality-bar.md) and [docs/visual-qa/](../visual-qa/README.md).

I would *not* run this loop on a demo whose ADR already chose procedural geometry on purpose (steam atlas, Wind Lea, Nacre Loom). Those are a different lesson.

---

## 5. Cited X posts (verified 2026-09-08)

I pulled these by id. I am quoting the public text / pattern, not their repos or binaries.

| Who | Post id | What I took from it |
| --- | --- | --- |
| [@ashebytes](https://x.com/ashebytes/status/2096009146248122416) | `2096009146248122416` | “I used GPT-6 Astra to create a 3D website that pulls apart a Tesla Model X into 334 modeled pieces.” Real multi-mesh car, not primitives. Pattern notes: [ashe-model-x-explode.md](./ashe-model-x-explode.md). |
| [@Legendaryy](https://x.com/Legendaryy/status/2096510965789422001) | `2096510965789422001` | GPT Astra installed **Blender MCP**, rendered 51 MacBook Airs in a semicircle, then built an interactive 3D site. This is the *operator* half. My clean-room rebuild used procedural laptops on purpose — and they read as blocky hardware. |
| [@0xRishi](https://x.com/0xRishi/status/2096672779856957719) | `2096672779856957719` | “Using @MeshyAI alongside Blender with Codex/Astra … is such an unlock for higher-fidelity characters (the models aren't great at procedurally creating characters in my experience). My workflow starts by generating high-res image refs (in t-pose and nothing else …” — image refs → Meshy → Blender. Same split Meshy wrote in their FAQ. |
| [@filiksyos](https://x.com/filiksyos/status/2089297181026951425) | `2089297181026951425` | “You first scaffold a project in @threejs … then use AI to generate a 3d .glb file of a hero object like a person, a car, etc. you mix them together.” Scaffold + generated hero GLB. Not “ask Blender MCP to invent the hero.” |
| [@NickDevFE](https://x.com/NickDevFE/status/2096946586781692297) | `2096946586781692297` | Image → Hyper3D → img2threejs → GPT-6 Astra → interactive Three.js. Thread notes already in [heartwood-warden.md](./heartwood-warden.md) (`2096950738555634001`, `2096961252413317274`, `2096960714938446055`, `2096970295131488475`). I studied the public pitch. I did not clone img2threejs or Groot. |

X ids rot. See [stale-x-post-ids](../incidents/2026-09-07-stale-x-post-ids.md). If a link 404s, trust the pattern in this file, not the URL.

---

## 6. Recommended vibes checklist

Before I open a new experiment that is supposed to sit next to the viral stills:

- [ ] I can name the **mesh source**: Sketchfab CC, Poly Haven, Objaverse (licence checked), Meshy/Tripo/Rodin/Hyper3D, or “procedural on purpose.”
- [ ] I am **not** asking Blender MCP / official Lab MCP to sculpt the hero from primitives.
- [ ] Kenney is **props only**, unless the aesthetic is explicitly toy/kit.
- [ ] Image → 3D starts from a **clean ref** (product shot or t-pose). No cluttered concept collage.
- [ ] Blender pass exists: units, origin, loose parts, remesh/decimate, roughness. Then **GLB**.
- [ ] R3F load uses `useGLTF` / `GLTFLoader` plus `<Environment>` (or an equivalent studio rig). No grey void for product heroes.
- [ ] Screenshot QA against the X crop. If it is blocky, I iterate the **asset**, not the HUD.
- [ ] `ATTRIBUTION.md` names author, licence, URL. Meshy/Tripo/Rodin outputs stay under *their* ToS — I do not pretend they are CC0.
- [ ] Clean-room: I did not download a proprietary `.glb` from a viral demo, scrape their webpack, or paste their factory.
- [ ] If I cite X, I keep the **numeric status id** and verify it still resolves.

That is the bar I want on the next “this should look like the tweet” brief. Procedural demos can skip the generator — they should say so in the ADR.

---

## Clean-room and licence notes

- **Patterns, not files.** I studied public posts, Meshy’s published tutorial, Blender Lab’s MCP page, and my own lanes. I did not copy ashemag’s Model X mesh, Legendaryy’s MacBook CAD, 0xRishi’s characters, filiksyos’ game, or Nick’s Hyper3D skins.
- **Licences do not commute.** Sketchfab CC-BY needs the author line. Poly Haven / many Kenney kits are CC0 (credit still polite). Objaverse is per-asset. Meshy / Tripo / Rodin / Hyper3D are commercial generators — check whether the plan allows redistribution in a public GitHub + Vercel demo before I commit a GLB.
- **MCP executes code.** Official Blender Lab warns the server runs LLM Python with no sandbox. I would not point it at a machine that holds keys or client files.
- **Research and education only.** This note does not ship a new experiment and does not rewrite an existing one.

---

## Related notes in this repo

- [ADR-0002](../adr/0002-explode-r3f-and-real-glb.md) — why explode-assembly picked a real GLB
- [ADR-0003](../adr/0003-blender-mcp-lane.md) — scripts-first Blender MCP
- [ADR-0004](../adr/0004-procedural-geometry-over-assets.md) — when primitives *are* the point
- [Visual quality bar](../visual-quality-bar.md)
- [image-to-3d providers](../../experiments/image-to-3d/providers.md)
- [mesh-gen providers](../../experiments/ai-3d-lanes/mesh-gen/providers.md)

---

**Author**: Johnny Huynh  
**Purpose**: Learning and education — documenting a public pipeline so I stop confusing `bpy` with a mesh model  
**Last updated**: 2026-09-08
