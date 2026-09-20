import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import './asset-viewer.css';

const mode = document.body.dataset.mode;
const host = document.querySelector('#viewport');
const status = document.querySelector('#status');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#e8e5dd');
const camera = new THREE.PerspectiveCamera(36,1,.01,1000);
const renderer = new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
host.append(renderer.domElement);
renderer.domElement.setAttribute('aria-label','3D preview. Drag to orbit and scroll to zoom.');
const controls = new OrbitControls(camera,renderer.domElement);
controls.enableDamping=true;
const pmrem=new THREE.PMREMGenerator(renderer), room=new RoomEnvironment();
const environment=pmrem.fromScene(room,.04);
scene.environment=environment.texture;
room.dispose(); pmrem.dispose();
scene.add(new THREE.HemisphereLight('#ffffff','#7c7668',2));
const key=new THREE.DirectionalLight('#fff4dc',3);key.position.set(3,6,4);scene.add(key);
let model=null, texture=null, source=null, disposed=false, serial=0;
let spin=false;
const clock=new THREE.Clock();
const material=new THREE.MeshStandardMaterial({color:'#c8a47d',roughness:.45,metalness:.1,side:THREE.DoubleSide});

function release(object){
 const geometries=new Set(),materials=new Set(),textures=new Set();
 object.traverse(node=>{if(node.isMesh){geometries.add(node.geometry);for(const mat of Array.isArray(node.material)?node.material:[node.material]){materials.add(mat);for(const value of Object.values(mat))if(value?.isTexture)textures.add(value);}}});
 geometries.forEach(g=>g.dispose());materials.forEach(m=>{if(m!==material)m.dispose();});textures.forEach(t=>{if(t!==texture)t.dispose();});
}
function replace(next){ if(model){scene.remove(model);release(model);} model=next;scene.add(model);fit(); }
function fit(){
 if(!model)return;
 model.rotation.set(0,0,0);
 const box=new THREE.Box3().setFromObject(model),size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3());
 const radius=Math.max(size.length()/2,.1);
 const angle=THREE.MathUtils.degToRad(camera.fov/2);
 const distance=radius/Math.sin(Math.min(angle,Math.atan(Math.tan(angle)*camera.aspect)))*1.2;
 controls.target.copy(center);camera.position.copy(center).add(new THREE.Vector3(1,.7,1.4).normalize().multiplyScalar(distance));
 camera.near=Math.max(.001,radius/100);camera.far=radius*1000;camera.updateProjectionMatrix();
 controls.minDistance=radius*.6;controls.maxDistance=radius*20;controls.update();
}
function surface(){
 if(mode==='mesh')return;
 let geometry;
 if(mode==='relief'){
   geometry=new THREE.PlaneGeometry(3,3*source.height/source.width,160,160);
   const sample=document.createElement('canvas');sample.width=161;sample.height=161;
   const ctx=sample.getContext('2d');ctx.drawImage(source,0,0,161,161);
   const data=ctx.getImageData(0,0,161,161).data,positions=geometry.attributes.position;
   const height=Number(document.querySelector('#amount').value);
   for(let i=0;i<positions.count;i++) positions.setZ(i,((data[i*4]+data[i*4+1]+data[i*4+2])/765-.5)*height);
   geometry.computeVertexNormals();
 } else geometry=new THREE.SphereGeometry(1.35,96,64);
 material.map=texture;material.color.set('#ffffff');material.needsUpdate=true;
 replace(new THREE.Mesh(geometry,material));
}
function setImage(image){
 source=image;
 const previous=texture;
 texture=new THREE.Texture(image);texture.colorSpace=THREE.SRGBColorSpace;texture.needsUpdate=true;texture.anisotropy=4;
 surface();previous?.dispose();
}
if(mode==='mesh') replace(new THREE.Mesh(new THREE.TorusKnotGeometry(1,.28,192,24),material));
else{
 const sample=document.createElement('canvas');sample.width=512;sample.height=512;const ctx=sample.getContext('2d');
 ctx.fillStyle='#bfc5b5';ctx.fillRect(0,0,512,512);
 for(let i=16;i>=0;i--){ctx.fillStyle=i%2?'#d4a665':'#3d6663';ctx.beginPath();ctx.ellipse(256,256,i*21,i*15,.4,0,Math.PI*2);ctx.fill();}
 setImage(sample);
}
async function load(file){
 const id=++serial;
 if(!file)return;
 status.textContent='Opening '+file.name+'…';
 try{
   if(file.size>50*1024*1024)throw Error('Choose a file under 50 MB.');
   let next;
   if(mode==='mesh'){
     if(!file.name.toLowerCase().endsWith('.glb'))throw Error('Choose a self-contained .glb file.');
     const gltf=await new GLTFLoader().parseAsync(await file.arrayBuffer(),'');
     next=gltf.scene;
     if(new THREE.Box3().setFromObject(next).isEmpty()) {release(next);throw Error('This file contains no visible geometry.');}
     if(id!==serial || disposed){release(next);return;}
     replace(next);
   }else{
     if(!/^image\/(png|jpeg|webp)$/.test(file.type))throw Error('Choose a PNG, JPEG, or WebP image.');
     const bitmap=await createImageBitmap(file,{resizeWidth:1024,resizeQuality:'high'});
     if(id!==serial || disposed){bitmap.close();return;}
     const previous=source;
     setImage(bitmap);previous?.close?.();
   }
   applyMaterial(); status.textContent=file.name;
 }catch(error){if(id===serial)status.textContent=error.message+' Your previous preview is still available.';}
}
function applyMaterial(){model?.traverse(node=>{if(node.isMesh)for(const mat of Array.isArray(node.material)?node.material:[node.material]){mat.wireframe=document.querySelector('#wireframe').checked;if('roughness' in mat)mat.roughness=Number(document.querySelector('#roughness').value);}});}
document.querySelector('#file').addEventListener('change',e=>load(e.target.files[0]));
document.querySelector('#reset').onclick=fit;
document.querySelector('#spin').onchange=e=>{spin=e.target.checked;};
document.querySelector('#wireframe').onchange=applyMaterial;
document.querySelector('#roughness').oninput=applyMaterial;
document.querySelector('#amount').oninput=()=>{if(mode==='relief')surface();};
document.querySelector('#save').onclick=()=>{
 renderer.render(scene,camera);const a=document.createElement('a');a.download=`${mode}-preview.png`;a.href=renderer.domElement.toDataURL('image/png');a.click();
};
host.addEventListener('dragover',e=>{e.preventDefault();host.classList.add('dragover');});
host.addEventListener('dragleave',()=>host.classList.remove('dragover'));
host.addEventListener('drop',e=>{e.preventDefault();host.classList.remove('dragover');load(e.dataTransfer.files[0]);});
const observer=new ResizeObserver(()=>{
 const {width,height}=host.getBoundingClientRect();renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();fit();
});observer.observe(host);
renderer.setAnimationLoop(()=>{const dt=Math.min(clock.getDelta(),.05);if(document.hidden)return;if(spin&&model)model.rotation.y+=dt*.25;controls.update();renderer.render(scene,camera);});
window.addEventListener('pagehide',()=>{disposed=true;renderer.setAnimationLoop(null);observer.disconnect();controls.dispose();if(model)release(model);material.dispose();texture?.dispose();source?.close?.();environment.dispose();renderer.dispose();},{once:true});
