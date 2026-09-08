/**
 * Download a Poly Haven 1k glTF package and pack it to a Draco GLB.
 * Assets are CC0. See each experiment ATTRIBUTION.md.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const UA = 'Mozilla/5.0 (compatible; vibes-research/1.0; +https://github.com/johnnyhuy/vibes)';

async function fetchJson(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

async function fetchBin(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function downloadPackage(uid, destDir) {
  const files = await fetchJson(`https://api.polyhaven.com/files/${uid}`);
  const pack = files.gltf?.['1k']?.gltf;
  if (!pack?.url || !pack.include) throw new Error(`No 1k glTF for ${uid}`);

  mkdirSync(join(destDir, 'textures'), { recursive: true });
  const gltfPath = join(destDir, `${uid}_1k.gltf`);
  writeFileSync(gltfPath, await fetchBin(pack.url));
  for (const [rel, info] of Object.entries(pack.include)) {
    const target = join(destDir, rel);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, await fetchBin(info.url));
    console.log(`  ${rel}  ${info.size}`);
  }
  return gltfPath;
}

function packGlb(gltfPath, outGlb, { simplify = 1, join = false } = {}) {
  const args = [
    '--yes',
    '@gltf-transform/cli',
    'optimize',
    gltfPath,
    outGlb,
    '--compress',
    'draco',
    '--texture-compress',
    'webp',
    '--texture-size',
    '1024',
    '--flatten',
    'false',
    '--join',
    join ? 'true' : 'false',
    '--palette',
    'false',
    '--instance',
    'false',
  ];
  if (simplify < 1) {
    args.push('--simplify', 'true', '--simplify-ratio', String(simplify));
  } else {
    args.push('--simplify', 'false');
  }
  execFileSync('npx', args, { stdio: 'inherit' });
}

const jobs = [
  {
    uid: 'quiver_tree_01',
    out: 'experiments/heartwood-warden/public/models/quiver-hero.glb',
    simplify: 0.35,
  },
  {
    uid: 'quiver_tree_02',
    out: 'experiments/heartwood-warden/public/models/quiver-spare.glb',
    simplify: 0.45,
  },
  {
    uid: 'fir_sapling',
    out: 'experiments/heartwood-warden/public/models/fir-canopy.glb',
    simplify: 0.12,
  },
  {
    uid: 'tree_stump_01',
    out: 'experiments/heartwood-warden/public/models/stump.glb',
    simplify: 0.55,
  },
  {
    uid: 'rock_moss_set_01',
    out: 'experiments/heartwood-warden/public/models/moss-rocks.glb',
    simplify: 0.5,
  },
  {
    uid: 'shrub_02',
    out: 'experiments/heartwood-warden/public/models/undergrowth.glb',
    simplify: 0.55,
  },
  {
    uid: 'dead_tree_trunk',
    out: 'experiments/heartwood-warden/public/models/fallen-trunk.glb',
    simplify: 0.45,
  },
  {
    uid: 'portable_welding_cart',
    out: 'experiments/cinder-mere/public/models/kiln-cart.glb',
    simplify: 0.85,
  },
];

const target = process.argv[2];
const selected = target ? jobs.filter((job) => job.uid === target || job.out.includes(target)) : jobs;

for (const job of selected) {
  const scratch = resolve(`.tmp/polyhaven/${job.uid}`);
  console.log(`\n== ${job.uid} → ${job.out}`);
  const gltfPath = await downloadPackage(job.uid, scratch);
  mkdirSync(dirname(job.out), { recursive: true });
  packGlb(gltfPath, resolve(job.out), { simplify: job.simplify });
}

console.log('\nDone');
