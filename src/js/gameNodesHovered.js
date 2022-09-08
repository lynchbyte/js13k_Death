import {

    Color,
    MeshBasicMaterial

}
    from 'https://unpkg.com/three@0.143.0/build/three.module.js';

import { gmBoard, clickable } from './script.js';

const matNodeHov = new MeshBasicMaterial({ color: new Color(0xFFD972) });

export function getNodesHover_UI(intsctn) {

    if (intsctn.length == 1) {

        intsctn[0].object.material.emissive.r = 0.6;
        intsctn[0].object.material.emissive.g = 0.5;

    }

    else {

        //un-hover change node color to default color
        for (let i = 0; i < clickable.length; i++) {

            clickable[i].material.emissive.r = 0;
            clickable[i].material.emissive.g = 0;

        }

    }

}

export function getNodesHover_Nodes(intsctn) {
    
    if (intsctn.length == 1) {

        let hovD = intsctn[0].object

        hovD.material = matNodeHov

    }

    else {

        //un-hover change node color to default color
        for (let i = 0; i < gmBoard.nodesArr.length; i++) {

            gmBoard.nodesArr[i].material = gmBoard.matNode

        }

    }

}
