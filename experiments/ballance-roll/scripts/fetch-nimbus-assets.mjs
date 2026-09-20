/**
 * Vendor Poly Haven CC0 meshes / maps for Nimbus Path.
 * Dual-mesh: pretty GLB + box colliders stay in CourseMesh.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const UA = 'Mozilla/5.0 (compatible; vibes-research/1.0; +https://github.com/johnnyhuy/vibes)';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

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

function packGlb(gltfPath, outGlb, { simplify = 1 } = {}) {
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
    'false',
    '--palette',
    'false',
    '--instance',
    'false'
  ];
  if (simplify < 1) {
    args.push('--simplify', 'true', '--simplify-ratio', String(simplify));
  } else {
    args.push('--simplify', 'false');
  }
  execFileSync('npx', args, { stdio: 'inherit' });
}

const models = [
  { uid: 'wooden_lantern_01', out: 'public/models/haze-lantern.glb', simplify: 0.75 },
  { uid: 'brass_diya_lantern', out: 'public/models/haze-diya.glb', simplify: 0.8 },
  { uid: 'marble_bust_01', out: 'public/models/haze-bust.glb', simplify: 0.7 }
];

for (const job of models) {
  const scratch = resolve(root, `../../.tmp/polyhaven/${job.uid}`);
  console.log(`\n== ${job.uid} → ${job.out}`);
  const gltfPath = await downloadPackage(job.uid, scratch);
  const outGlb = resolve(root, job.out);
  mkdirSync(dirname(outGlb), { recursive: true });
  packGlb(gltfPath, outGlb, { simplify: job.simplify });
}

const hdriFiles = await fetchJson('https://api.polyhaven.com/files/pink_sunrise');
const hdriUrl = hdriFiles.hdri?.['1k']?.hdr?.url;
if (!hdriUrl) throw new Error('No 1k HDR for pink_sunrise');
const hdriOut = resolve(root, 'public/hdri/pink-sunrise.hdr');
mkdirSync(dirname(hdriOut), { recursive: true });
console.log('\n== pink_sunrise HDRI');
writeFileSync(hdriOut, await fetchBin(hdriUrl));

const texFiles = await fetchJson('https://api.polyhaven.com/files/monastery_stone_floor');
const texDir = resolve(root, 'public/textures');
mkdirSync(texDir, { recursive: true });
const maps = [
  ['Diffuse', 'path-diff.jpg'],
  ['nor_gl', 'path-nor.jpg'],
  ['Rough', 'path-rough.jpg']
];
console.log('\n== monastery_stone_floor maps');
for (const [key, name] of maps) {
  const url = texFiles[key]?.['1k']?.jpg?.url;
  if (!url) throw new Error(`No 1k jpg for ${key}`);
  const dest = join(texDir, name);
  writeFileSync(dest, await fetchBin(url));
  console.log(`  ${name}`);
}

console.log('\nDone');
