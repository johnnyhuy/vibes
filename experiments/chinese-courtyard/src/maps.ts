import { RepeatWrapping, SRGBColorSpace, type Texture } from 'three';

export interface CourtMaps {
  diff: Texture;
  nor: Texture;
  rough: Texture;
}

export function cloneCourtMaps(maps: CourtMaps, repeatX: number, repeatY: number): CourtMaps {
  const diff = maps.diff.clone();
  const nor = maps.nor.clone();
  const rough = maps.rough.clone();
  [diff, nor, rough].forEach((texture) => {
    texture.needsUpdate = true;
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(repeatX, repeatY);
    texture.anisotropy = 8;
  });
  diff.colorSpace = SRGBColorSpace;
  return { diff, nor, rough };
}
