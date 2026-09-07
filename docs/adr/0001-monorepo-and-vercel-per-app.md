# ADR-0001: Monorepo Structure and Vercel Per-App Deployment

**Status**: Accepted  
**Date**: 2026-09-07  
**Context**: Structuring multiple interactive 3D experiments in one repository

## Decision

I'm using a **monorepo with separate Vite apps** under `experiments/`, where each browser-based demo gets its own Vercel project pointing to its Root Directory.

## Structure

```
vibes/
├── experiments/
│   ├── explode-assembly/     → Vercel project: vibes-explode
│   ├── earth-timeline/        → Vercel project: vibes-earth
│   ├── v8-cutaway/            → Vercel project: vibes-v8
│   ├── web-physics/           → Vercel project: vibes-physics
│   └── ai-3d-lanes/
│       └── web-3d/            → Vercel project: vibes
├── docs/                      → This documentation
└── README.md
```

Each experiment is **self-contained**:
- Own `package.json`, dependencies, and build config
- Own `README.md` explaining what it is and how to run it
- No shared libraries or hoisting (yet)

## Rationale

### Why Monorepo?

1. **Single place to experiment** — I'm building multiple 3D demos, and keeping them in one repo makes it easier to track patterns and reuse learnings
2. **Easy cross-referencing** — ADRs and docs in one place apply to all experiments
3. **Simpler git history** — One commit log shows the full journey across demos

### Why Separate Vite Apps (No Turborepo/Lerna)?

1. **Simplicity over premature optimisation** — I'm not sharing code between apps yet, so workspace tooling would be overkill
2. **Fast prototyping** — Each experiment can use different deps/versions without conflicts
3. **Vercel compatibility** — Vercel Root Directory works great with this structure

### Why One Vercel Project Per Demo?

1. **Independent deployments** — Pushing changes to `earth-timeline` doesn't redeploy `explode-assembly`
2. **Separate preview URLs** — Each experiment gets its own production URL (e.g., `vibes-explode.vercel.app`)
3. **Isolated builds** — If one demo's build breaks, others still deploy
4. **Clear Vercel bot comments** — PR previews show exactly which demos changed

## Trade-offs

### Advantages
- **Clear boundaries** — Each experiment is isolated
- **Simple CI/CD** — Vercel handles per-directory builds automatically
- **Easy to delete experiments** — Remove a folder without touching others

### Disadvantages
- **Duplicate dependencies** — Multiple copies of Three.js across apps
- **No shared components** — Can't easily extract common patterns (yet)
- **Multiple Vercel projects** — Dashboard has 5 projects instead of 1

## When This Might Change

If I start building shared libraries (e.g., `packages/3d-utils`), I'll migrate to Turborepo or pnpm workspaces. For now, duplication is fine — I'm learning patterns, not shipping production.

## Decision Drivers

1. **Vercel's Root Directory feature** makes per-app deploys trivial
2. **No shared code yet** means workspace tooling would be premature
3. **Fast iteration** matters more than build optimisation right now

## Implementation Notes

Each experiment must:
- Work standalone with `npm install && npm run dev`
- Build successfully with `npm run build`
- Have a README explaining what it is

Vercel projects are manually created in the dashboard with Root Directory set.

## References

- [Vercel Monorepo Setup Guide](https://vercel.com/docs/monorepos)
- Inspired by ashemag's approach: one repo, multiple demos

---

**Author**: Johnny Huynh  
**Last Updated**: 2026-09-07
