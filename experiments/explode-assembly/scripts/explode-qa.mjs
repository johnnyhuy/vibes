import { chromium } from 'playwright';
import { mkdirSync, copyFileSync } from 'fs';

const outDir = '/tmp/cursor/artifacts/screenshots';
mkdirSync(outDir, { recursive: true });
mkdirSync('/workspace/hill-climb', { recursive: true });

const browser = await chromium.launch({
  headless: true,
  args: [
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-webgl',
    '--ignore-gpu-blocklist',
  ],
});

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

async function shot(explode, name) {
  await page.goto(`http://127.0.0.1:4173/?explode=${explode}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);
  const path = `${outDir}/${name}`;
  await page.screenshot({ path, type: 'png' });
  copyFileSync(path, `/workspace/hill-climb/${name}`);
  console.log('wrote', path);
}

await shot(0, 'loop-0.png');
await shot(80, 'loop-80.png');
await browser.close();
