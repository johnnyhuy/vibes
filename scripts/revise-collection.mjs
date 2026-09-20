// One-time, mechanical migration of duplicated labels and collection styling.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { relative, dirname, resolve } from 'node:path';
const root = resolve(import.meta.dirname, '..');
function walk(dir) { return readdirSync(dir, {withFileTypes:true}).flatMap(e => ['node_modules','dist','public'].includes(e.name) ? [] : e.isDirectory() ? walk(resolve(dir,e.name)) : [resolve(dir,e.name)]); }
const files = walk(resolve(root,'experiments'));
const labels = {
  '環':'Studio / 01', '霞':'Cloud course', '北庭':'Architecture / 02', '珠络':'Material study',
  '尾根':'Architecture / 01', '青原':'Field study', '风笺谷':'Open landscape', '烬泽':'Driving study',
  '心木守':'Woodland study', '月饺接力':'Table game', '盐桥':'Coastal drive',
  '白坛':'Architecture journal', '晴巷 · 风里的册页':'A neighbourhood journal',
  '防波':'Harbour study', '桩架':'Harbour walker', '丁坝头':'Groyne Head', '潮闸':'Tide Gate',
  '龙骨盘':'Assembly study', '卷盘板':'Spool Plate', '卷湾':'Spool Bay', '龙骨梁':'Keel spars',
  '旋杯':'Rotor cups','巢板':'Nest Board','络线':'Loom traces','卷芯':'Spool Cell','束带':'Bind straps',
  '瓣桨':'Petal rotors','滑足':'Skid feet','缚针':'Bind pin','脊罩':'Canopy spine','落台':'Bench complete',
  '赭奔':'Highland runs','灰鬃':'Ashmane','硫阶':'Sulfur Terrace','缎切':'Ribbon Cut','喷盆':'Spout Basin',
  '羽突':'Plume Break','檐望':'Rim Overlook','檐漂':'Shelf Drift','焰狐':'Ember Fox','墨浣':'Ink Raccoon',
  '纸鸮':'Paper Owl','苔獾':'Moss Badger','川兔':'River Rabbit','盐岸':'Salt Reach','朱跨':'Vermilion Span',
  '藻口':'Kelp Cut','芯标':'Wick Spire','锡栈':'Pewter Jetty','矮窑':'Low Kiln','燧津':'Flint Ford',
  '流光狐':'Foil edition / 042','窑钉':'Brick study','烬兔':'Ember Hare','窑座':'Kiln plinth',
  '后腿':'Haunches','躯':'Torso','陶浆胸':'Chest slip','头':'Head','耳':'Ears','尾':'Tail','火记':'Marks',
  '昏兔':'Dusk hare','陶浆':'Clay slip','锡灰':'Pewter ash',
};
const categories = {
 'alba-forum':'architecture','japanese-tower':'architecture','chinese-courtyard':'architecture','fairday-walk':'architecture',
 'earth-timeline':'science','v8-cutaway':'engineering','explode-assembly':'engineering','keel-hex':'engineering',
 'web-3d':'engineering','blender-semicircle-viewer':'engineering','procedural-steam-atlas':'engineering',
 'nacre-loom':'material','foil-tilt-card':'material','glass-capability-brain':'material','audio-gadget-spin':'material',
 'scroll-product-showcase':'material','kiln-studs':'material',
};
for (const path of files) {
 let s = readFileSync(path,'utf8'), next=s;
 if (/\.(tsx?|js|html|css)$/.test(path)) {
   for (const [a,b] of Object.entries(labels).sort((a,b)=>b[0].length-a[0].length)) next=next.replaceAll(a,b);
   // English descriptors are useful for section headings; the old locale suffix isn't.
   next=next.replace(/\b(name|place|chassis|bench|setName|loop)Zh\b/g,'$1Label');
   next=next.replaceAll('Nacre Loom / Material study','Nacre Loom').replaceAll('Heartwood Warden / Woodland study','Heartwood Warden');
 }
 if (path.endsWith('/package.json')) {
   const p=JSON.parse(s);
   for(const key of ['react','react-dom']) if(p.dependencies?.[key]) p.dependencies[key]='19.2.8';
   next=JSON.stringify(p,null,2)+'\n';
 }
 if(path.endsWith('/index.html')) {
   const app=dirname(path).split('/').pop();
   next=next.replace('<html lang="en">',`<html lang="en" data-study="${categories[app]??'landscape'}" data-app="${app}">`);
   next=next.replace(/  <link rel="stylesheet" href="[^"]*shared\/exhibit.css">\n/g,'');
 }
 if (/\/src\/styles.css$|\/style.css$/.test(path)) {
   next=next.replace(/font-family: Inter,[^;]+;/g,"font-family: 'Trebuchet MS', 'Avenir Next', sans-serif;");
 }
 if (/\/main\.(tsx|js)$/.test(path)) {
   const css=relative(dirname(path),resolve(root,'experiments/shared/exhibit.css'));
   if(!next.includes('shared/exhibit.css')) next+=`\nimport '${css}';\n`;
 }
 if (next!==s) writeFileSync(path,next);
}
