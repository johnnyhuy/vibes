# Visual QA

Hill-climb and production visual QA should keep the root README honest.

## Preview stills

When an app **ships** or **redeploys**, refresh:

```text
docs/previews/<app>.png
```

`<app>` is the experiment folder name (`explode-assembly`, `procedural-steam-atlas`, …).

- Prefer a **LIVE / production PASS** frame over a 404 page.
- Do **not** put stale or FAIL frames in the README Preview column. Record those in Status (and here) only.
- Extra angles (explode ordered gallery, etc.) can sit beside the hero as `docs/previews/<app>-gallery.png`.
- Local-only apps (no Vercel project) may use a local `npm run build` + `npm run preview` still, and Status must say **local-only**.

The apps table in the [root README](../../README.md) embeds these files.

## Logs

- [2026-09-07 hill-climb](../visual-qa-2026-09-07.md)
- [2026-09-08 production](../visual-qa-2026-09-08-prod.md)
- [Visual quality bar](../visual-quality-bar.md)
