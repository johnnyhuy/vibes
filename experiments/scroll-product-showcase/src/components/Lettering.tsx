import { useEffect, useMemo } from 'react';
import { CanvasTexture, SRGBColorSpace } from 'three';

// Local canvas lettering keeps the glass scene independent of font CDNs/workers.
export default function Lettering({children,fontSize,color,position,letterSpacing=0}: {
  children:string; fontSize:number; color:string; position:[number,number,number]; letterSpacing?:number;
}) {
  const {texture,width} = useMemo(() => {
    const canvas=document.createElement('canvas');
    const ctx=canvas.getContext('2d')!;
    ctx.font='bold 120px "Trebuchet MS", sans-serif';
    const spacing=letterSpacing*120;
    const measured=[...children].map(letter=>ctx.measureText(letter).width);
    const width=measured.reduce((a,b)=>a+b,0)+spacing*(children.length-1)+20;
    canvas.width=Math.ceil(width);canvas.height=160;
    ctx.font='bold 120px "Trebuchet MS", sans-serif';ctx.fillStyle=color;ctx.textBaseline='middle';
    let x=10;[...children].forEach((letter,i)=>{ctx.fillText(letter,x,80);x+=measured[i]+spacing;});
    const texture=new CanvasTexture(canvas);texture.colorSpace=SRGBColorSpace;
    return {texture,width:width/120};
  },[children,color,letterSpacing]);
  useEffect(()=>()=>texture.dispose(),[texture]);
  return <mesh position={position}><planeGeometry args={[width*fontSize,fontSize*160/120]} /><meshBasicMaterial map={texture} transparent depthWrite={false} toneMapped={false} /></mesh>;
}
