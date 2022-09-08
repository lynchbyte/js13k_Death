import {

    Matrix4,
    Raycaster,
    Vector2,


}
    from 'https://unpkg.com/three@0.143.0/build/three.module.js';

import { camera, gmBoard, gmPlayz, clickable, renderer, reticle, hitOb } from './script.js';

import { getNodesHover_UI, getNodesHover_Nodes } from './gameNodesHovered.js';

import { getNodesClick_UI, getNodesClick_Nodes } from './gameNodesClicked.js';

import { arrows } from './gameMode.js';

//Mouse Raycasting
export const mouse = new Vector2(1, 1);
export const raycaster_Mouse = new Raycaster();


//for xr controller selecting
export const raycasterXR = new Raycaster();
export const intersected = [];
export const tempMatrix = new Matrix4();

//Mouse Controller//////////////////////////////////////

let way

export function onMouseMove(event) {

    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    if (gmPlayz.currentPlayer == undefined) { return }

    raycaster_Mouse.setFromCamera(mouse, camera);

    if (gmPlayz.uiTime == true) {

        const intersection = raycaster_Mouse.intersectObjects(clickable);
        getNodesHover_UI(intersection);
      
    }

    else {

        const intersection = raycaster_Mouse.intersectObjects(gmBoard.nodesArr);
        getNodesHover_Nodes(intersection);


    }

    //spin
    //clac 10% left 
    if (event.clientX < window.innerWidth * 0.05) {
        
        way = -1;
        spin(way);

    }
    //calc 10%right
    if (event.clientX > window.innerWidth * 0.95) {
        
        way = 1;
        spin(way);

    }

}

function spin(way) {

    gmBoard.boardGrp.rotateY(way * 0.025);

}


export function onMouseClick(event) {

    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster_Mouse.setFromCamera(mouse, camera);

    if (gmPlayz.uiTime == true) {

        const intersection = raycaster_Mouse.intersectObjects(clickable);
        getNodesClick_UI(intersection);
   
    }

    else {

        const intersection = raycaster_Mouse.intersectObjects(gmBoard.nodesArr);
        getNodesClick_Nodes(intersection);
    }

}


////XR Controller//////////////////////////////////////////////////////////
export function onSelectStart(e) {

    var controller = e.target;

    var intersections = getIntersections(controller);

    if (gmPlayz.uiTime == true) {

        getNodesClick_UI(intersections);

    }

    else {

        getNodesClick_Nodes(intersections);

    }

}


export function onSelectEnd(e) {

   //  console.log(`e`, e);

}



//hover change color
export function intObjects(controller) {

    // Do not highlight when already selected
    if (controller.userData.selected !== undefined) return;

    let intersections = getIntersections(controller);

    if (gmPlayz.uiTime == true) {

        getNodesHover_UI(intersections);
    }

    else {

        getNodesHover_Nodes(intersections);
    }

}



export function getIntersections(controller) {

    tempMatrix.identity().extractRotation(controller.matrixWorld);

    raycasterXR.ray.origin.setFromMatrixPosition(controller.matrixWorld);

    raycasterXR.ray.direction.set(0, 0, - 1).applyMatrix4(tempMatrix);

    //new for vr arrows and spin
    const intersects = raycasterXR.intersectObjects(arrows, false);

    if (intersects.length > 0) {

        if (intersects[0].object.name == "arw L Pl") {
            way = -1;
            spin(way);

        }

        if (intersects[0].object.name == "arw R Pl") {
            way = 1;
            spin(way);

        }
    }


    if (gmPlayz.uiTime == true) {

        return raycasterXR.intersectObjects(clickable, false);

    }


    else {

        return raycasterXR.intersectObjects(gmBoard.nodesArr, false);

    }

}


//unhover 
export function cleanIntersected() {

    while (intersected.length) {

        let object = intersected.pop();
        object.material.emissive.g = 0;

    }

}


//AR Controller////////////////////////////////////////////////////////////////////////

//https://github.com/markhorgan/web-ar-three-js/blob/main/src/app.js
export async function requestHitTestSource() {

    const session = renderer.xr.getSession();

    if (session !== null) {

        session.addEventListener('end', () => {
            hitOb.hitTestSourceRequested = false;
            hitOb.hitTestSource = null;
        });

        const referenceSpace = await session.requestReferenceSpace('viewer');

        hitOb.hitTestSource = await session.requestHitTestSource({

            space: referenceSpace,

        });

        hitOb.hitTestSourceRequested = true;

    }
}

export function getHitTestResults(frame) {

    if (frame !== null) {

        const hitTestResults = frame.getHitTestResults(hitOb.hitTestSource);

        if (hitTestResults.length) {

            const hit = hitTestResults[0];
            const pose = hit.getPose(renderer.xr.getReferenceSpace());
            reticle.visible = true;
            reticle.matrix.fromArray(pose.transform.matrix);

        } else {

            reticle.visible = false;

        }
    }
}






