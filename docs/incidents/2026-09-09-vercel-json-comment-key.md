# Incident: `vercel.json` `"//"` comment key fails schema

**Date**: 2026-09-09  
**Severity**: Medium (blocks production/preview, not runtime)  
**Status**: Fixed in-repo — three Roots no longer ship an illegal key

---

I used a JSON key literally named `"//"` as a pseudo-comment when I Root-touched scroll, audio, and grass on `607106de`. That was meant to bump `ignoreCommand` so the post-quota wave would actually build. Vercel does **not** allow extra properties. All three deploys died immediately:

> The `vercel.json` schema validation failed with the following message: should NOT have additional property `//`

| Project | Id | Failed deploy |
| --- | --- | --- |
| `vibes-scroll-product` | `prj_XLBiIlbjweejp9himT53bolPEMUW` | `dpl_13ufsK68G7wDxTwQdRuGC8Af8MZ4` |
| `vibes-audio-gadget-spin` | `prj_N57mvThg4UcU9XxLK3F5wAICz9PA` | `dpl_4Ws69HFjxR1Uj88u4G8KvFSN7xwM` |
| `vibes-procedural-grass-field` | `prj_iJND14XT4LtOHI2gnUR0UM8RFk9F` | `dpl_Bws8pyiHc8dvfwFAmNVN3YtBydTG` |

Semicircle rebuilt READY on the same commit because I never put `"//"` in its `vercel.json`.

JSON has no comments. `$schema` does not make `"//"` legal. A real touch is a real field change (or a README / `package.json` bump). Do **not** invent comment keys.

I removed the key from those three files only. Framework / install / build / `outputDirectory` / `ignoreCommand` stay.

Do not create new Vercel projects. Do not dashboard-Redeploy just to retry the same poison.

## Related

- [Vercel Root Directory hints](../deployment/vercel-root-directories.md)
- [Quota incident](./2026-09-07-vercel-deploy-quota.md)
- [steam-atlas Root / ignoreCommand](./2026-09-08-steam-atlas-wrong-root.md)

---

**Incident owner**: Johnny Huynh  
**Resolution**: Delete `"//"` from the three `vercel.json` files and let the PR push rebuild
