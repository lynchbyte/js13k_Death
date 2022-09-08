
import {

    BufferGeometry,
    Line,
    LineBasicMaterial,
    Mesh,
    MeshStandardMaterial,
    PlaneGeometry,
    Vector3

} from 'https://unpkg.com/three@0.143.0/build/three.module.js';


import { scene, gmPlayz, ctr1, ctr2 } from './script.js';

import { onSelectStart, onSelectEnd, } from './gameSelect.js';



export function addControllers() {

    //xr controllers
	    scene.remove(ctr1);
    scene.remove(ctr2);

    scene.add(ctr1);
    scene.add(ctr2);

    if (gmPlayz.mode === 'VR') {


        // controllers helper
        var mC = new LineBasicMaterial({ color: 0xe65277 });
        var gC = new BufferGeometry().setFromPoints([new Vector3(0, 0, 0), new Vector3(0, 0, - 1)]);
        var line = new Line(gC, mC);
        line.name = 'line';
        line.scale.z = 10;
        ctr1.add(line.clone());
        // console.log(`xr controller1; `, controller1);

        ctr2.add(line.clone());

        //   console.log(`xr controller2; `, controller2);


        // const lefthand = new Mesh(new PlaneGeometry(0.2, 0.2), new MeshStandardMaterial({
        //  //   map: handTexture, side: 2, transparent: true

        // }));

        // lefthand.rotateX(-90 * (Math.PI / 180));

        // const righthand = lefthand.clone();

        // righthand.scale.set(-1, 1, 1);

        // const controllerGrip0 = renderer.xr.getControllerGrip(0)
        
        // controllerGrip0.addEventListener("connected",
        //     (e) => {
        //         //(e: any) => {
        //         controllerGrip0.add(lefthand);

        //         // grabVR.add(0, controllerGrip0, e.data.gamepad)
        //         scene.add(controllerGrip0);
        //         // console.log(`controllerGrip0; `, controllerGrip0)
        //     })


        // const righthand = new Mesh(
        //     new CylinderGeometry(.05, 0.05, .4, 16, 1, true),
        //     new MeshBasicMaterial({
        //         color: 'red',
        //         wireframe: true
        //     })
        // );



        // const controllerGrip1 = renderer.xr.getControllerGrip(1)
        // controllerGrip1.addEventListener("connected",
        //     (e) => {
        //         // (e: any) => {
        //         controllerGrip1.add(righthand)
        //         //  grabVR.add(1, controllerGrip1, e.data.gamepad)
        //         scene.add(controllerGrip1);
        //         //console.log(`controllerGrip1; `, controllerGrip1)
        //     });

    }


    ctr1.addEventListener('selectstart', onSelectStart)
    ctr1.addEventListener('selectend', onSelectEnd)

    ctr2.addEventListener('selectstart', onSelectStart)
    ctr2.addEventListener('selectend', onSelectEnd)
}
