# web-physics

Interactive browser-based physics simulation using Three.js and cannon-es.

## What's Here

A playful physics playground demonstrating real-time rigid body dynamics in the browser.

**Features**:
- Click to spawn boxes
- Press Space to spawn spheres
- Press R to reset the scene
- Gravity, collisions, angular momentum
- Dark aesthetic with dynamic lighting

## Running Locally

```bash
npm install
npm run dev
```

Open the localhost URL in your browser and start spawning objects.

The install graph is locked in `package-lock.json` so `npm audit` can see it.

## Build

```bash
npm run build
```

Output in `dist/`

## Tech Stack

- **Three.js** — 3D rendering
- **cannon-es** — Physics engine (rigid body dynamics)
- **Vite** — Fast dev server and build

## How This Relates to AI-Generated Simulations

This demo represents a **code-first approach** to interactive physics simulations that AI agents can generate programmatically:

### Why Code-First Physics?

1. **Deterministic**: Same code = same physics, every time
2. **Parametric**: Change gravity, friction, shapes via code
3. **Versionable**: Git-friendly simulation definitions
4. **Composable**: Agents can combine primitives (boxes, spheres, constraints)
5. **Fast iteration**: No GUI clicking, just edit and reload

### AI Agent Use Cases

**Generating Training Data**:
- Agent writes physics scenarios for robotics training
- Procedurally generates collision test cases
- Creates synthetic datasets with known ground truth

**Interactive Prototyping**:
- "Make a physics demo of a Newton's cradle"
- "Simulate a stack of blocks falling"
- Agent writes Three.js + cannon-es code from natural language

**Sim-to-Real Transfer**:
- Prototype robot behaviours in browser physics
- Export parameters to Unity/Gazebo/Isaac Sim
- Iterate faster than real-world testing

### Code Structure for Agent Generation

This demo is structured for LLM code generation:

```javascript
// 1. Clear primitive spawning functions
spawnBox(x, y, z)
spawnSphere(x, y, z)

// 2. Parametric bodies
const body = new CANNON.Body({ 
  mass: 5, 
  shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)) 
});

// 3. Physics properties as config
world.gravity = new CANNON.Vec3(0, -9.82, 0);
contactMaterial.friction = 0.3;
contactMaterial.restitution = 0.4;
```

An LLM can:
- Parse natural language physics descriptions
- Map to cannon-es API calls
- Generate Three.js meshes for visualisation
- Compose complex scenarios from primitives

### Comparison to Other Lanes

| Lane | Purpose | Agent Role |
|------|---------|------------|
| **web-physics** | Interactive simulation | Generates physics scenarios from prompts |
| **web-3d** | Static visualisation | Generates assembly views |
| **blender** | High-fidelity rendering | Automates scene creation via bpy |
| **cad** | Engineering precision | Generates manufacturable parts |

**Physics lane advantage**: Real-time, interactive, browser-deployable. No install required.

### Extending This Experiment

Ideas for LLM-generated physics scenarios:
- Rope/chain simulations (distance constraints)
- Vehicle suspension (spring-damper systems)
- Ragdoll physics (articulated bodies)
- Fluid/softbody approximations (particle systems)
- Destructible objects (convex decomposition)

### Resources

- [cannon-es docs](https://pmndrs.github.io/cannon-es/)
- [Three.js physics examples](https://threejs.org/examples/?q=physics)
- [react-three/rapier](https://github.com/pmndrs/react-three-rapier) — React alternative with Rapier physics
