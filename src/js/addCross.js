import {

   ExtrudeGeometry,
   Shape

}
    from 'https://unpkg.com/three@0.143.0/build/three.module.js';

export function addCross(){
    
    //cross geometry
const legLength = 2 * 0.1;
const legWidth = 1 * 0.1;
const crossShape = new Shape()
    .moveTo(0, legLength)//1
    .lineTo(legLength, legLength)//2
    .lineTo(legLength, 0)//3
    .lineTo(legLength + legWidth, 0)//4
    .lineTo(legLength + legWidth, legLength)//5
    .lineTo(legLength + legWidth + legLength, legLength)//6
    .lineTo(legLength + legWidth + legLength, legLength + legWidth)//7
    .lineTo(legLength + legWidth, legLength + legWidth)//8
    .lineTo(legLength + legWidth, legLength + legWidth + legLength)//9
    .lineTo(legLength, legLength + legWidth + legLength)//10
    .lineTo(legLength, legLength + legWidth)//11
    .lineTo(0, legLength + legWidth);//12;

const extrudeSettings = {
    steps: 4,
    depth: 0.1,
    bevelEnabled: true,
   bevelThickness: 0.05,
   bevelSize: 0.02,
   bevelOffset: 0,
   bevelSegments: 4
};

const crossGeo = new ExtrudeGeometry(crossShape, extrudeSettings);
crossGeo.center();
crossGeo.rotateZ(Math.PI / 4);

return crossGeo

}