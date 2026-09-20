// Mechanical addition of responsive camera framing to each independent React app.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname, '../experiments');
function walk(dir) { return readdirSync(dir,{withFileTypes:true}).flatMap(e => ['node_modules','dist','public'].includes(e.name) ? [] : e.isDirectory() ? walk(resolve(dir,e.name)) : [resolve(dir,e.name)]); }
for(const path of walk(root).filter(p=>p.endsWith('.tsx'))) {
  let s=readFileSync(path,'utf8');
  if(!s.includes('</Canvas>') || s.includes('ExhibitFraming')) continue;
  s="import { useLayoutEffect as useExhibitLayout } from 'react';\nimport { useThree as useExhibitThree } from '@react-three/fiber';\n"+s;
  s=s.replace('</Canvas>', '  <ExhibitFraming />\n    </Canvas>');
  s+=`\n// Preserve the subject's horizontal field of view on portrait screens.\nfunction ExhibitFraming() {\n  const { camera, size } = useExhibitThree();\n  useExhibitLayout(() => {\n    camera.zoom = .85 * Math.min(1, size.width / size.height / 1.25);\n    camera.updateProjectionMatrix();\n  }, [camera, size.width, size.height]);\n  return null;\n}\n`;
  writeFileSync(path,s);
}
