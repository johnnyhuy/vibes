import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
const root=resolve(import.meta.dirname,'../experiments');
const ledes={
 'alba-forum':'Ten landmarks along a chalk avenue. Move between stops, then explore each building from every angle.',
 'audio-gadget-spin':'Turn the headphones in the light. Compare three finishes and select a detail to inspect it.',
 'ballance-roll':'A narrow path above the clouds. Roll, balance, and collect three lights. Each material handles differently.',
 'brine-causeway':'Follow the coast through Salt Reach. Accelerate, steer, and brake through the bends.',
 'chinese-courtyard':'A quiet courtyard through four seasons. Move the sun to watch light travel across the halls and moon gate.',
 'cinder-mere':'Take the cart across a dusk basin. Follow the four landmarks or find your own route.',
 'fairday-walk':'Eight small places on a breezy lane. Follow the tour, orbit a scene, or set the laundry in motion.',
 'foil-tilt-card':'Tilt the card to catch its iridescent finish. Adjust the foil, separate the print layers, or turn it over.',
 'glass-capability-brain':'An interactive collection of material and motion studies. Select a node to explore its experiment.',
 'heartwood-warden':'Walk a guardian through the moonlit glade. Try a spell and watch its light move through the trees.',
 'japanese-tower':'Raise the tower from stone to crown. Then explore how season, weather, and daylight change its silhouette.',
 'moon-dumpling-relay':'Choose a diner and catch the moving plates. Tea speeds you up; chili makes the next bite harder.',
 'nacre-loom':'Shape a glass vessel. Mix its colours, tune the iridescent film, and adjust how it catches the light.',
 'procedural-grass-field':'A meadow in motion. Change the grass, tune the wind, and move across the field to brush the blades aside.',
 'scroll-product-showcase':'Glass, light, and a slow roll. Scroll to turn the bottle and see the lettering bend through it.',
 'zephyr-vale':'Wander the sunlit hills and collect drifting notes. Follow the breeze and the sound of the bell kite.',
};
function walk(d){return readdirSync(d,{withFileTypes:true}).flatMap(e=>['node_modules','dist','public'].includes(e.name)?[]:e.isDirectory()?walk(resolve(d,e.name)):[resolve(d,e.name)]);}
for(const p of walk(root).filter(p=>p.endsWith('.tsx'))){
 const app=p.slice(root.length+1).split('/')[0];let s=readFileSync(p,'utf8');
 if(ledes[app])s=s.replace(/<p className="lede">[\s\S]*?<\/p>/g,`<p className="lede">${ledes[app]}</p>`);
 s=s.replace('{step.nameLabel} · {step.name}','{step.name}');
 s=s.replace('Local remap only — I did not call a model.','Choose a palette to recolour the set.');
 s=s.replace('Two invented guests will sit with you.','Two guests will join you.');
 s=s.replace('The rainbow is a fresnel film I\n          wrote, not a packed laser node tree.','Move the card to shift the colour of its foil.');
 s=s.replace('The strip below is the ward I invented. Number keys fire it. The snippet is generated from this stance, not imported.','Choose a spell below, or use its number key. Copy the current settings from the code panel.');
 s=s.replace('Walk near a drifting note to take it. The verses are mine. The vale is a wander, not a fight.','Walk near a drifting note to collect it.');
 writeFileSync(p,s);
}
const captions={
 'alba-forum':['Two stone piers frame a rounded arch beneath a decorated attic.','A colonnade wraps around an open civic square.','A tapered obelisk rises from a layered stone plinth.','Twin towers mark a passage through the city wall.','Eight bays of columns form a sheltered walk.','Three masonry arches cross a dry channel.','Tiered seats curve around an open stage.','A stepped tower punctuates the avenue.','A central nave and side aisles sit below a raised clerestory.','A circular colonnade supports a dome with an open oculus.'],
 'fairday-walk':['Sheets catch the breeze above a shared courtyard.','Two bicycles rest beneath a corrugated lean-to.','A stone well, a bucket, and a rim of moss.','Striped canvas shades a small market stall.','Plants spill from a recessed balcony.','Three birds perch above a tiled roof.','Warm afternoon light gathers between two gables.','A fig tree and rain barrel mark the bend in the lane.']
};
for(const [app,lines] of Object.entries(captions)) {const p=resolve(root,app,'src/itinerary.ts');let i=0;const s=readFileSync(p,'utf8').replace(/caption: '[^'\n]*',/g,()=>`caption: '${lines[i++]}',`);writeFileSync(p,s);}
