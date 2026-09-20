import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { createServer } from 'vite';
import { chromium } from 'playwright';

const root = resolve(import.meta.dirname, '..');
async function discover(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  if (entries.some(e => e.name === 'package.json')) return [dir];
  return (await Promise.all(entries.filter(e => e.isDirectory() && !['node_modules', 'dist', 'public'].includes(e.name)).map(e => discover(resolve(dir, e.name))))).flat();
}
const apps = (await discover(resolve(root, 'experiments'))).sort().filter(p => !process.env.APP || p.endsWith('/' + process.env.APP));
const out = resolve(root, 'output/playwright');
await mkdir(out, { recursive: true });
if (process.argv[2] === 'build') {
  let failures = 0;
  for (const app of apps) {
    const result = await new Promise(done => {
      const child = spawn(process.execPath, [resolve(root, 'node_modules/vite/bin/vite.js'), 'build'], { cwd: app });
      let log = '';
      child.stdout.on('data', d => log += d);
      child.stderr.on('data', d => log += d);
      child.on('exit', code => done({ code, log }));
    });
    console.log(`${result.code ? 'FAIL' : 'PASS'} ${app.split('/').pop()}`);
    if (result.code) { failures++; console.error(result.log); }
  }
  process.exitCode = failures ? 1 : 0;
} else {
  const browser = await chromium.launch({ headless: true });
  const results = [];
  for (const app of apps) {
    const name = app.split('/').pop();
    const port = Number(process.env.QA_PORT || 4190);
    const server = await createServer({ root: app, server: { port, strictPort: true, host: '127.0.0.1' } });
    await server.listen();
    const errors = [];
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
    try {
      await page.addInitScript(() => {
        window.__vibesRenderers = [];
        window.__THREE_DEVTOOLS__ = new EventTarget();
        window.__THREE_DEVTOOLS__.addEventListener('observe', event => {
          const object = event.detail;
          if (!object.domElement || !object.render) return;
          window.__vibesRenderers.push(object);
          const render = object.render.bind(object);
          object.render = (scene, camera, ...args) => {
            if (object.domElement.isConnected && scene.isScene) {
              object.__scenes = object.__scenes || [];
              if (!object.__scenes.includes(scene)) object.__scenes.push(scene);
              let best = object.__scenes[0];
              for (const s of object.__scenes) {
                if ((s.children?.length || 0) > (best.children?.length || 0)) best = s;
              }
              object.qaScene = best;
            }
            return render(scene,camera,...args);
          };
        });
      });
      await page.goto(`http://127.0.0.1:${port}`, { waitUntil: 'networkidle', timeout: 60000 });
      if(name === 'ochre-gallop') await page.getByRole('button',{name:'Open Sulfur Terrace'}).dispatchEvent('click');
      await page.waitForFunction(() => window.__vibesRenderers.some(r => r.domElement.isConnected && r.info.render.triangles > 0 && (r.qaScene?.children.length || 0) >= 1), {timeout:60000});
      await page.waitForTimeout(1500);
      const interaction = await interact(page,name);
      await page.waitForTimeout(400);
      const desktop = await inspect(page);
      await page.screenshot({ path: resolve(out, `${name}-desktop.png`) });
      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForTimeout(400);
      const mobile = await inspect(page);
      await page.screenshot({ path: resolve(out, `${name}-mobile.png`) });
      if(['image-to-3d','ai-image-texture','mesh-gen'].includes(name)) await testUpload(page,name);
      results.push({ name, errors: [...new Set(errors)], interaction, desktop, mobile });
      console.log(`${errors.length ? 'FAIL' : 'PASS'} ${name}: ${desktop.canvas} canvas, ${desktop.buttons.length} controls, mobile overflow ${mobile.overflow}`);
    } catch (e) {
      results.push({ name, errors: [...new Set([...errors, e.message])] });
      console.log(`FAIL ${name}: ${e.message}`);
    } finally {
      await writeFile(resolve(out, `${name}-report.json`),JSON.stringify(results.at(-1),null,2));
      await page.close(); await server.close();
    }
  }
  await browser.close();
  const reports=await readdir(out);
  const combined=await Promise.all(reports.filter(n=>n.endsWith('-report.json')).map(async n=>JSON.parse(await readFile(resolve(out,n),'utf8'))));
  await writeFile(resolve(out, 'report.json'), JSON.stringify(combined, null, 2));
  process.exitCode = results.some(r => r.errors.length || !r.desktop?.canvas || r.mobile?.overflow || r.desktop?.chinese || r.mobile?.chinese) ? 1 : 0;
}

async function inspect(page) {
  return page.evaluate(() => ({
    canvas: document.querySelectorAll('canvas').length,
    chinese: /\p{Script=Han}/u.test(document.body.innerText),
    overflow: document.documentElement.scrollWidth > innerWidth,
    text: document.body.innerText.slice(0, 2500),
    buttons: [...document.querySelectorAll('button')].map(b => ({ text: b.textContent.trim(), disabled: b.disabled })),
    ranges: [...document.querySelectorAll('input[type=range]')].map(i => ({ id: i.id, min: i.min, max: i.max, value: i.value })),
    rendering: (window.__vibesRenderers ?? []).filter(r=>r.domElement.isConnected).map(r=>({...r.info.render})),
  }));
}

async function interact(page,name) {
  const actions = {
    'web-3d':'Cutaway', 'alba-forum':'Next stop', 'audio-gadget-spin':'Midnight',
    'ballance-roll':'Stone', 'blender-semicircle-viewer':'Reset Camera', 'breakwater':'Afterglow',
    'chinese-courtyard':'winter', 'cinder-mere':'Ash noon', 'earth-timeline':'City lights',
    'explode-assembly':'⊞All parts', 'fairday-walk':'Next stop', 'foil-tilt-card':'Flip card',
    'japanese-tower':'winter', 'keel-hex':'Exploded', 'kiln-studs':'Clay slip',
    'nacre-loom':'Pearl Drift', 'procedural-grass-field':'Fescue', 'procedural-steam-atlas':'Exploded',
    'v8-cutaway':'Pause', 'web-physics':'Add sphere',
  };
  const sel = {
    'explode-assembly':'button.dock-action:nth-of-type(2)',
  };
  const expected = actions[name];
  if(expected) {
    const role = name==='keel-hex'?'tab':'button';
    const cssSel = sel[name];
    if (cssSel) {
      await page.locator(cssSel).first().dispatchEvent('click');
    } else {
      try {
        await page.getByRole(role, {name:expected, exact:true}).first().dispatchEvent('click');
      } catch {
        await page.getByRole(role, {name:new RegExp(escapeRegex(expected))}).first().dispatchEvent('click');
      }
    }
    if(name==='web-physics') await page.getByText('4 / 80 bodies').waitFor({timeout:5000}).catch(()=>{});
    if(name==='v8-cutaway') await page.getByRole('button',{name:'Play',exact:true}).waitFor({timeout:5000}).catch(()=>{});
    if(name==='fairday-walk') await page.getByText('Bicycle Shed',{exact:true}).first().waitFor({timeout:5000}).catch(()=>{});
    if(name==='alba-forum') await page.getByText('Chalk Forum',{exact:true}).first().waitFor({timeout:5000}).catch(()=>{});
    return `Clicked ${expected}`;
  }
  if(['image-to-3d','ai-image-texture','mesh-gen'].includes(name)) {
    await page.getByLabel('Show wireframe').check({force:true});
    await page.getByRole('button',{name:'Reset view'}).dispatchEvent('click');
    return 'Wireframe and reset view';
  }
  if(name==='scroll-product-showcase') {await page.getByRole('link',{name:'The glass',exact:true}).dispatchEvent('click');return 'Scroll to glass';}
  if(['amber-longeron','heartwood-warden','zephyr-vale','brine-causeway','ochre-gallop'].includes(name)) {
    if(name==='amber-longeron') await page.getByRole('button',{name:'Start flight'}).dispatchEvent('click');
    await page.keyboard.down(name==='amber-longeron'?'d':'w');await page.waitForTimeout(350);await page.keyboard.up(name==='amber-longeron'?'d':'w');return 'Movement input';
  }
  const range=page.locator('input[type=range]:enabled').first();
  if(await range.count()){await range.focus();await page.keyboard.press('ArrowRight');return 'Adjusted first slider';}
  const button=page.getByRole('button').filter({hasNotText:/muted|sound|copy/i}).first();
  if(await button.count()){    await button.dispatchEvent('click');return 'Primary control';}
  throw Error('No interaction was checked');
}

async function testUpload(page,name) {
  const mesh=name==='mesh-gen';
  const file = mesh ? {name:'triangle.glb',mimeType:'model/gltf-binary',buffer:triangleGLB()} : {name:'texture.png',mimeType:'image/png',buffer:await page.locator('canvas').screenshot()};
  await page.locator('#file').setInputFiles(file);
  await page.getByRole('status').filter({hasText:file.name}).waitFor();
  await page.waitForTimeout(300);
  const text=await page.locator('#status').textContent();
  if(text!==file.name) throw Error('Upload did not complete: '+text);
  await page.locator('#file').setInputFiles({name:'invalid.txt',mimeType:'text/plain',buffer:Buffer.from('not an asset')});
  await page.getByText(/Your previous preview is still available/).waitFor();
}

function escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

function triangleGLB() {
  const positions=new Float32Array([-1,-1,0,1,-1,0,0,1,0]);
  const bin=Buffer.from(positions.buffer);
  const data={asset:{version:'2.0'},scene:0,scenes:[{nodes:[0]}],nodes:[{mesh:0}],meshes:[{primitives:[{attributes:{POSITION:0}}]}],buffers:[{byteLength:bin.length}],bufferViews:[{buffer:0,byteOffset:0,byteLength:bin.length}],accessors:[{bufferView:0,componentType:5126,count:3,type:'VEC3',min:[-1,-1,0],max:[1,1,0]}]};
  const json=Buffer.from(JSON.stringify(data));const padding=(4-json.length%4)%4;const chunk=Buffer.concat([json,Buffer.alloc(padding,32)]);
  const result=Buffer.alloc(12+8+chunk.length+8+bin.length);result.writeUInt32LE(0x46546c67,0);result.writeUInt32LE(2,4);result.writeUInt32LE(result.length,8);result.writeUInt32LE(chunk.length,12);result.writeUInt32LE(0x4e4f534a,16);chunk.copy(result,20);const at=20+chunk.length;result.writeUInt32LE(bin.length,at);result.writeUInt32LE(0x004e4942,at+4);bin.copy(result,at+8);return result;
}
