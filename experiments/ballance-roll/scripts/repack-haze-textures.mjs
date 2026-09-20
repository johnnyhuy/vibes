/**
 * Re-pack Haze Walk GLBs so textures are JPEG/PNG, not EXT_texture_webp.
 * Draco stays. drei loads the decoder from /draco/.
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const models = ['haze-lantern.glb', 'haze-diya.glb', 'haze-bust.glb'];

function gltf(args) {
  execFileSync('npx', ['--yes', '@gltf-transform/cli', ...args], { stdio: 'inherit' });
}

for (const name of models) {
  const src = join(root, 'public/models', name);
  const scratch = mkdtempSync(join(tmpdir(), 'haze-repack-'));
  const jpegPass = join(scratch, 'color.glb');
  const out = src;
  console.log(`\n== ${name}`);
  gltf([
    'jpeg',
    src,
    jpegPass,
    '--formats',
    'webp',
    '--slots',
    '{baseColorTexture,emissiveTexture}',
    '--quality',
    '90'
  ]);
  const pngPass = join(scratch, 'maps.glb');
  gltf([
    'png',
    jpegPass,
    pngPass,
    '--formats',
    'webp',
    '--quality',
    '90'
  ]);
  gltf(['draco', pngPass, out]);
  rmSync(scratch, { recursive: true, force: true });
}

console.log('\nDone — JPEG/PNG maps, Draco kept');
