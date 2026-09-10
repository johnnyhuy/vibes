/**
 * Headed README showcase loops. Start previews first:
 *   experiments/scroll-product-showcase      → :4173
 *   experiments/procedural-grass-field       → :4174
 *   experiments/blender-semicircle-viewer    → :4175
 *   experiments/v8-cutaway                   → :4176
 *   experiments/audio-gadget-spin            → :4177
 *
 * Then: node scripts/capture-showcase-gifs.mjs  (needs playwright + ffmpeg + gifsicle)
 */
import { chromium } from 'playwright';
import { mkdirSync, rmSync, copyFileSync, existsSync, readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const ROOT = '/workspace';
const DOCS = join(ROOT, 'docs/previews');
const WORK = '/tmp/showcase-gif-frames';
const VIEWPORT = { width: 1280, height: 720 };
const GIF_W = 640;
const GIF_H = 360;
const FPS = 12;
const FRAMES = 48; // 4.0s

const jobs = [
  {
    name: 'scroll-product-showcase',
    url: 'http://127.0.0.1:4173/',
    wait: 4500,
    async prepare(page) {
      await page.evaluate(() => window.scrollTo(0, 0));
    },
    async tick(page, i) {
      const t = i / (FRAMES - 1);
      const eased = 0.5 - 0.5 * Math.cos(Math.PI * t);
      await page.evaluate((p) => {
        const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        window.scrollTo(0, max * 0.58 * p);
      }, eased);
    },
  },
  {
    name: 'procedural-grass-field',
    url: 'http://127.0.0.1:4174/',
    wait: 3500,
    encode: { fps: 8, width: 480, height: 270, colors: 64, frameStep: 2, lossy: 160 },
    async prepare(page) {
      const box = await page.locator('canvas').boundingBox();
      page._gustBox = box;
    },
    async tick(page, i) {
      const box = page._gustBox;
      if (!box) return;
      const t = (i / FRAMES) * Math.PI * 2;
      const x = box.x + box.width * (0.42 + 0.18 * Math.sin(t));
      const y = box.y + box.height * (0.55 + 0.12 * Math.cos(t * 0.85));
      await page.mouse.move(x, y);
    },
  },
  {
    name: 'blender-semicircle',
    url: 'http://127.0.0.1:4175/',
    wait: 2500,
    async prepare(page) {
      const reset = page.locator('#btn-reset');
      if (await reset.count()) await reset.click();
      await page.waitForTimeout(400);
      const box = await page.locator('canvas').boundingBox();
      if (!box) return;
      await page.mouse.move(box.x + box.width * 0.62, box.y + box.height * 0.48);
      await page.mouse.down();
      page._orbitBox = box;
    },
    async tick(page, i) {
      const box = page._orbitBox;
      if (!box) return;
      const t = i / (FRAMES - 1);
      const x = box.x + box.width * (0.62 - 0.28 * t);
      const y = box.y + box.height * (0.48 + 0.04 * Math.sin(t * Math.PI));
      await page.mouse.move(x, y, { steps: 2 });
    },
    async finish(page) {
      await page.mouse.up();
    },
  },
  {
    name: 'v8-cutaway',
    url: 'http://127.0.0.1:4176/',
    wait: 2200,
    async prepare(page) {
      const slider = page.locator('#speed-slider');
      if (await slider.count()) {
        await slider.evaluate((el) => {
          el.value = '6';
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        });
      }
      const box = await page.locator('canvas').boundingBox();
      if (!box) return;
      await page.mouse.move(box.x + box.width * 0.58, box.y + box.height * 0.42);
      await page.mouse.down();
      page._orbitBox = box;
    },
    async tick(page, i) {
      const box = page._orbitBox;
      if (!box) return;
      const t = i / (FRAMES - 1);
      const x = box.x + box.width * (0.58 - 0.22 * t);
      const y = box.y + box.height * (0.42 + 0.03 * Math.sin(t * Math.PI));
      await page.mouse.move(x, y, { steps: 2 });
    },
    async finish(page) {
      await page.mouse.up();
    },
  },
  {
    name: 'audio-gadget-spin',
    url: 'http://127.0.0.1:4177/',
    wait: 5000,
    async prepare() {
      // Auto-spin is the hero; give the GLB a beat to settle.
    },
    async tick() {},
  },
];

function encodeGif(frameDir, dest, encode = {}) {
  const fps = encode.fps ?? FPS;
  const width = encode.width ?? GIF_W;
  const height = encode.height ?? GIF_H;
  const colors = encode.colors ?? 160;
  const frameStep = encode.frameStep ?? 1;
  let pattern = join(frameDir, 'frame-%03d.png');
  let inputFps = FPS;

  if (frameStep > 1) {
    const thin = join(frameDir, 'thin');
    mkdirSync(thin, { recursive: true });
    const frames = readdirSync(frameDir).filter((name) => /^frame-\d+\.png$/.test(name)).sort();
    let written = 0;
    frames.forEach((name, index) => {
      if (index % frameStep !== 0) return;
      copyFileSync(join(frameDir, name), join(thin, `frame-${String(written).padStart(3, '0')}.png`));
      written += 1;
    });
    pattern = join(thin, 'frame-%03d.png');
    inputFps = fps;
  }

  const palette = join(frameDir, 'palette.png');
  const raw = join(frameDir, 'raw.gif');
  const vf = `fps=${fps},scale=${width}:${height}:flags=lanczos:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2:color=black`;

  let r = spawnSync(
    'ffmpeg',
    ['-y', '-framerate', String(inputFps), '-i', pattern, '-vf', `${vf},palettegen=max_colors=${colors}:stats_mode=diff`, palette],
    { encoding: 'utf8' },
  );
  if (r.status !== 0) throw new Error(r.stderr || 'palettegen failed');

  r = spawnSync(
    'ffmpeg',
    [
      '-y',
      '-framerate',
      String(inputFps),
      '-i',
      pattern,
      '-i',
      palette,
      '-lavfi',
      `${vf}[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=5`,
      '-loop',
      '0',
      raw,
    ],
    { encoding: 'utf8' },
  );
  if (r.status !== 0) throw new Error(r.stderr || 'paletteuse failed');

  const gifsicleArgs = ['-O3', '--colors', String(colors), '-o', dest, raw];
  if (encode.lossy) gifsicleArgs.splice(1, 0, `--lossy=${encode.lossy}`);
  r = spawnSync('gifsicle', gifsicleArgs, { encoding: 'utf8' });
  if (r.status !== 0) throw new Error(r.stderr || 'gifsicle failed');
}

const browser = await chromium.launch({
  executablePath: '/usr/local/bin/google-chrome',
  headless: false,
  args: [
    '--use-gl=angle',
    '--enable-webgl',
    '--ignore-gpu-blocklist',
    '--disable-dev-shm-usage',
    '--autoplay-policy=no-user-gesture-required',
  ],
});

mkdirSync(DOCS, { recursive: true });

for (const job of jobs) {
  const frameDir = join(WORK, job.name);
  rmSync(frameDir, { recursive: true, force: true });
  mkdirSync(frameDir, { recursive: true });

  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
    reducedMotion: 'no-preference',
    colorScheme: 'dark',
  });
  const page = await context.newPage();
  page.on('pageerror', (error) => console.error(job.name, 'pageerror', error.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') console.error(job.name, 'console', msg.text());
  });

  await page.goto(job.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForSelector('canvas', { timeout: 20000 });
  await page.waitForFunction(() => {
    const canvas = document.querySelector('canvas');
    return Boolean(canvas && canvas.width > 8 && canvas.height > 8);
  }, { timeout: 20000 });
  await page.waitForTimeout(job.wait);
  if (job.prepare) await job.prepare(page);

  for (let i = 0; i < FRAMES; i += 1) {
    if (job.tick) await job.tick(page, i);
    await page.waitForTimeout(Math.round(1000 / FPS));
    await page.screenshot({ path: join(frameDir, `frame-${String(i).padStart(3, '0')}.png`), type: 'png' });
  }

  if (job.finish) await job.finish(page);

  const stillSrc = join(frameDir, 'frame-012.png');
  const stillDest = join(DOCS, `${job.name}.png`);
  if (existsSync(stillSrc)) copyFileSync(stillSrc, stillDest);
  else copyFileSync(join(frameDir, 'frame-000.png'), stillDest);

  const gifDest = join(DOCS, `${job.name}.gif`);
  encodeGif(frameDir, gifDest, job.encode);
  console.log('captured', job.name, gifDest);
  await context.close();
}

await browser.close();
console.log('done');
