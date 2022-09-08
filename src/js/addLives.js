
import {

    Mesh,
    MeshStandardMaterial,
    MeshPhongMaterial,
    PlaneGeometry,


}
    from 'https://unpkg.com/three@0.143.0/build/three.module.js';

import { scene, uiPlane,  picAll, texture, imgNum } from './script.js';
import {  picNew, sgobn } from './gameHelpers.js';


export function newLives(){
    
const levelPic1 = new picNew(picAll, 0, (0 * (Math.PI / 180)), 0, -1.5, 2.5, -0.2, `life1`, 1, uiPlane);

//const ob = scene.getObjectByName(`life1`);

const ob = sgobn(`life1`);

for (let x = 0; x < 6; x++) {

    ob.scale.set(0.35, 0.35, 0.35);
    const lifeCl = ob.clone();
    let spacing = 0.5
    lifeCl.position.set(-1.5 + spacing + (x * spacing), 2.5, -0.2);
    lifeCl.name = `life` + (x + 2)
    lifeCl.material.opacity = 0.4
    uiPlane.add(lifeCl);

}

const geo = new PlaneGeometry(0.35, 0.35, 32, 32)

const txHrt = texture.clone();
txHrt.offset.set(1 / imgNum * 15, 0);
txHrt.repeat.set(1 / imgNum, 1)
const matHeart = new MeshPhongMaterial({ map: txHrt, side: 2, transparent: true });//
const meshHeart = new Mesh(geo, matHeart);
meshHeart.position.set(0,0,100);
scene.add(meshHeart)
meshHeart.name = 'Heart Pl';

const txRip = texture.clone();
txRip.offset.set(1 / imgNum * 16, 0);
txRip.repeat.set(1 / imgNum, 1)
const matRip = new MeshPhongMaterial({ map: txRip, side: 2, transparent: true });//
const meshRip = new Mesh(geo, matRip);
meshRip.position.set(0,0,100);
scene.add(meshRip);
meshRip.name = 'RIP Pl';

const txDraw = texture.clone();
txDraw.offset.set(1 / imgNum * 18, 0);
txDraw.repeat.set(1 / imgNum, 1)
const matDraw = new MeshPhongMaterial({ map: txDraw, side: 2, transparent: true });//
const meshDraw = new Mesh(geo, matDraw);
meshDraw.position.set(0,0,100)
scene.add(meshDraw)
meshDraw.name = 'Draw Pl2';

}
