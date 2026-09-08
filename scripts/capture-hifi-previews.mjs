import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const shots = '/opt/cursor/artifacts/screenshots';
mkdirSync(shots, { recursive: true });
mkdirSync('/workspace/docs/previews', { recursive: true });

const jobs = [
  {
    name: 'heartwood-warden',
    url: 'http://127.0.0.1:4174/',
    wait: 3500,
    interact: async (page) => {
      await page.keyboard.down('KeyW');
      await page.waitForTimeout(900);
      await page.keyboard.up('KeyW');
      await page.keyboard.press('Digit1');
      await page.waitForTimeout(600);
    },
  },
  {
    name: 'cinder-mere',
    url: 'http://127.0.0.1:4175/',
    wait: 3500,
    interact: async (page) => {
      await page.keyboard.down('KeyW');
      await page.waitForTimeout(1200);
      await page.keyboard.up('KeyW');
      await page.waitForTimeout(400);
    },
  },
  {
    name: 'amber-longeron',
    url: 'http://127.0.0.1:4176/',
    wait: 2800,
    interact: async (page) => {
      await page.keyboard.press('KeyD');
      await page.waitForTimeout(800);
    },
  },
  {
    name: 'audio-gadget-spin',
    url: 'http://127.0.0.1:4177/',
    wait: 2800,
    interact: async (page) => {
      const box = page.locator('canvas');
      const bounds = await box.boundingBox();
      if (bounds) {
        await page.mouse.move(bounds.x + bounds.width * 0.55, bounds.y + bounds.height * 0.45);
        await page.mouse.down();
        await page.mouse.move(bounds.x + bounds.width * 0.3, bounds.y + bounds.height * 0.42, { steps: 12 });
        await page.mouse.up();
      }
      await page.waitForTimeout(400);
    },
  },
];

const browser = await chromium.launch({
  executablePath: '/usr/local/bin/google-chrome',
  args: [
    '--use-gl=angle',
    '--enable-webgl',
    '--ignore-gpu-blocklist',
    '--disable-dev-shm-usage',
  ],
});

for (const job of jobs) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  page.on('pageerror', (error) => console.error(job.name, 'pageerror', error.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') console.error(job.name, 'console', msg.text());
  });
  await page.goto(job.url, { waitUntil: 'networkidle' });
  await page.waitForSelector('canvas', { timeout: 15000 });
  await page.waitForTimeout(job.wait);
  await job.interact(page);
  const dest = `${shots}/${job.name}.png`;
  const docs = `/workspace/docs/previews/${job.name}.png`;
  await page.screenshot({ path: dest, type: 'png' });
  await page.screenshot({ path: docs, type: 'png' });
  console.log('captured', job.name);
  await page.close();
}

await browser.close();
