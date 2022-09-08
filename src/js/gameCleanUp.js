
import {
    scene, winArr, uiPlane, reticle, ctr1,
    onRetSelect, gmBoard, gmPlayz, statBrd,
    clickable, Player1_Ob, Player2_Ob
} from './script.js';

import { removeOb, sgobn } from './gameHelpers.js';
import { winsTotal } from './script.js';
import { onMouseClick } from './gameSelect.js';
import { startGame } from './gameNodesClicked.js'


export function cleanUp_D_V_A() {

    let dsktp = sgobn(`Desktop Pl`);
    clickable.pop(dsktp);
    removeOb(`Desktop Pl`, uiPlane);

    let vrpp = sgobn(`vr Pl`)
    clickable.pop(vrpp);
    removeOb(`vr Pl`, uiPlane);

    let arpp = sgobn(`ar Pl`)
    clickable.pop(arpp);
    removeOb(`ar Pl`, uiPlane);

    removeOb(`vr Not Pl`, uiPlane);
    removeOb(`ar Not Pl`, uiPlane);

    const el2 = document.getElementById("info2");
    el2.parentNode.removeChild(el2);

}

export function cleanUp_G_F() {

    let ob1 = sgobn(`go1 Pl`);
    clickable.pop(ob1);
    removeOb(`go1 Pl`, uiPlane);

    let ob2 = sgobn(`go Ex Pl`);
    clickable.pop(ob2);
    removeOb(`go Ex Pl`, uiPlane);

}

export function cleanup_E_R_N() {

    let obexp = sgobn(`exit Pl`);
    clickable.pop(obexp);
    removeOb(`exit Pl`, uiPlane);

    let obrp = sgobn(`replay Pl`);

    if (obrp !== undefined) {

        clickable.pop(obrp);

    }

    removeOb(`replay Pl`, uiPlane);

    let obnlp = sgobn('NxtLvl Pl');

    if (obnlp !== undefined) {

        clickable.pop(obnlp);

    }
    removeOb('NxtLvl Pl', uiPlane);

}


export function gameOverCleanUp() {

    //delete board
    while (gmBoard.boardGrp.children.length) {

        gmBoard.boardGrp.remove(gmBoard.boardGrp.children[0]);

    }

    scene.remove(gmBoard.boardGrp);

    //remove gameOVer shader
    if (winArr.length > 0) {

        removeOb('Dots', scene)
        winArr[0].geometry.dispose()
        winArr[0].material.dispose()

    }

    // gmBoard.nodesArr.forEach(e => removeOb(e.name, gmBoard.boardGrp));
    gmBoard.nodesArr.length = 0;

    // gmBoard.sticksArr.forEach(e => removeOb(e.name, gmBoard.boardGrp));
    gmBoard.sticksArr.length = 0;

    //delete P1 & P2 mesh & empty array's
    Player1_Ob.p1ClkClndMeshArr.length = 0;
    Player1_Ob.p1ClkClndMeshNameArr.length = 0;
    Player1_Ob.winsTotalP1.length = 0;

    Player2_Ob.p2ClkClndMeshArr.length = 0;
    Player2_Ob.p2ClkClndMeshNameArr.length = 0;
    Player2_Ob.winsTotalP2.length = 0;

    uiPlane.remove(statBrd);

    //wins Total redo
    Player1_Ob.winsTotalP1.length = 0;
    Player2_Ob.winsTotalP2.length = 0;

    //copy winsTotal Array to each player
    Player1_Ob.winsTotalP1 = winsTotal.map(function (arr) {

        return arr.slice();

    });

    Player2_Ob.winsTotalP2 = winsTotal.map(function (arr) {

        return arr.slice();

    });

    //make nodes clickable again
    gmPlayz.gameOver = false;

    document.addEventListener('click', onMouseClick);

    gmPlayz.level += 1;

    if (gmPlayz.ARtime == true) {

        //add recticle
        scene.add(reticle)
        reticle.visible = true;

        ctr1.addEventListener('select', onRetSelect);
		
        addControllers();

        return

    }

    else {

        

        startGame(gmPlayz.mode);

    }


}

