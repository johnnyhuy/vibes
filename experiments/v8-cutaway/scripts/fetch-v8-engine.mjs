/**
 * Vendor meeww's CC-BY Animated Engine V8 (Objaverse / Sketchfab) and a
 * Poly Haven studio HDRI. Draco via gltf-transform; keep meshes unjoined.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const UA = 'Mozilla/5.0 (compatible; vibes-research/1.0; +https://github.com/johnnyhuy/vibes)';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const ENGINE_UID = 'b0dbf778b81e4afba4edf11336e2a099';
const ENGINE_URL = `https://huggingface.co/datasets/allenai/objaverse/resolve/main/glbs/000-158/${ENGINE_UID}.glb`;
const HDRI_UID = 'studio_small_09';

async function fetchBin(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

const rawDir = resolve(root, '../../.tmp/v8-cutaway');
mkdirSync(rawDir, { recursive: true });
const rawGlb = resolve(rawDir, 'meeww-v8-raw.glb');
console.log('Downloading engine GLB…');
writeFileSync(rawGlb, await fetchBin(ENGINE_URL));

const outGlb = resolve(root, 'public/models/v8-engine.glb');
mkdirSync(dirname(outGlb), { recursive: true });
console.log('Optimising (Draco, WebP, unjoined)…');
execFileSync(
  'npx',
  [
    '--yes',
    '@gltf-transform/cli',
    'optimize',
    rawGlb,
    outGlb,
    '--compress',
    'draco',
    '--texture-compress',
    'false',
    '--texture-size',
    '512',
    '--flatten',
    'false',
    '--join',
    'false',
    '--palette',
    'false',
    '--instance',
    'false',
    '--simplify',
    'false',
  ],
  { stdio: 'inherit' }
);

const hdriFiles = await fetchJson(`https://api.polyhaven.com/files/${HDRI_UID}`);
const hdriUrl = hdriFiles.hdri?.['1k']?.hdr?.url;
if (!hdriUrl) throw new Error(`No 1k HDR for ${HDRI_UID}`);
const hdriOut = resolve(root, 'public/hdri/studio.hdr');
mkdirSync(dirname(hdriOut), { recursive: true });
console.log('Downloading studio HDRI…');
writeFileSync(hdriOut, await fetchBin(hdriUrl));

console.log('Done');
console.log(`  ${outGlb}`);
console.log(`  ${hdriOut}`);
