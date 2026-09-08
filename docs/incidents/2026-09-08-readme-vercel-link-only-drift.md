# Incident: README said no Vercel project after link-only creates

**Date**: 2026-09-08  
**Severity**: Low (docs / ops, not runtime)  
**Status**: Docs corrected — projects stay idle until quota recovers

---

## Summary

Experiment READMEs still said **No Vercel project** / local-only after I already created link-only apps (`deploy: false`) on `johnnyhuy-dev` (`team_qBCPdqU9J1cQDL4rkrFsjNoa`). First pass: kiln-studs / cinder-mere / alba-forum. Same lie again on brine-causeway and breakwater after those `deploy: false` creates.

| Project | Id | Root Directory |
| --- | --- | --- |
| `vibes-kiln-studs` | `prj_qI0BHjZbM8vNYHuhPtpmN91ZOLT8` | `experiments/kiln-studs` |
| `vibes-cinder-mere` | `prj_pXdvd08peYAlt8s9QrW3yRB6nNvv` | `experiments/cinder-mere` |
| `vibes-alba-forum` | `prj_q9pJAos2JhRzr1M3uBAalAnAST17` | `experiments/alba-forum` |
| `vibes-brine-causeway` | `prj_UmVE510DKswQAtJf6NVYzOzQvqQf` | `experiments/brine-causeway` |
| `vibes-breakwater` | `prj_ZR9kwHuMM2cBrQPvtuoXkdwunyho` | `experiments/breakwater` |

Read-only API check 2026-09-08: `live: false`, `latestDeployment: null`, SSO off. I did **not** create projects, change Root Directory, or trigger deploys.

## What I did

- Rewrote the Deploy sections: project **exists** as link-only; name + Root; do not promote production / do not burn deploys until Hobby quota recovers **~2026-09-08 20:39 UTC**
- Left production alone
- 2026-09-08 follow-up: same rewrite for brine-causeway and breakwater after they drifted the same way

## Related

- [Quota incident](./2026-09-07-vercel-deploy-quota.md)
- [Audio-gadget linked before quota](./2026-09-07-audio-gadget-linked-before-quota.md)
- [Root Directory hints](../deployment/vercel-root-directories.md)

---

**Incident owner**: Johnny Huynh  
**Resolution**: Docs match the link-only projects. Wait for quota. Do not promote.
