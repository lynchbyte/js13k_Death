

import { scene, goSide, zzfx, gmBoard, gmPlayz, gameMaster, directionalLight } from './script.js';
import { makeMove } from './gameMakeMove.js';
import { slp } from './gameHelpers.js';
import { swapPos } from './gameNextTurn.js';
import { modeChange } from './gameMode.js';
import { removeOb,  statBrdUpdate } from './gameHelpers.js';
import { onMouseClick } from './gameSelect.js';
import { addControllers } from './addControllers.js'
import { startSession } from './gameXR.js';
import { cleanup_E_R_N, gameOverCleanUp } from './gameCleanUp.js'
import { newLives } from './addLives.js';
import { addFloor } from './addFloor.js'


/**
*    Selcted node's position pushed to latestHitHolder[].
 *   Node's data is used to makeMove function.
 *   onMouseClick disabled
 */
export function getNodesClick_Nodes(intersection) {

    if (intersection.length == 0) {

        return

    }

    if (intersection.length > 0) {

        //turn off clicking until next P1 turn
        document.removeEventListener('click', onMouseClick);

        if (gmPlayz.gameOver == false) {

            let ob = intersection[0].object;

            //remove clicked node from array
            let indx = gmBoard.nodesArr.findIndex(rk => rk === intersection[0].object);

            makeMove(
                ob.position.x,
                ob.position.y,
                ob.position.z,
                indx,
                ob.name
            );
        }

    }
}

export function getNodesClick_UI(intersection) {

    if (intersection.length == 0) {

        return

    }

    if (intersection.length > 0) {

        let plane = intersection[0].object.name;

        switch (plane) {

            case `Desktop Pl`: // go to show goes 1st? planes

                gmPlayz.mode = 'DT'

                goSide();

                //ZZZZZZZZZZZZZZZZZZZZZZZZZZZZ
                modeChange(gameMaster.gmMode[2]);
                //ZZZZZZZZZZZZZZZZZZZZZZZZZZZ

                break;

            case `vr Pl`:

                //webXR#3 - user-activation event//

                gmPlayz.mode = 'VR'

                startSession('immersive-vr');

                addControllers();

                addFloor();

                //ZZZZZZZZZZZZZZZZZZZZZZZZZZZZ
                modeChange(gameMaster.gmMode[2]);
                //ZZZZZZZZZZZZZZZZZZZZZZZZZZZ

                break;

            case `ar Pl`:

                //webXR#3 - user-activation event//

                gmPlayz.mode = 'AR'

                startSession('immersive-ar');

                scene.background = null;
                removeOb('Sphere', scene)

                addControllers();

                //ZZZZZZZZZZZZZZZZZZZZZZZZZZZZ
                modeChange(gameMaster.gmMode[2]);
                //ZZZZZZZZZZZZZZZZZZZZZZZZZZZ

                break;

            case `go1 Pl`://add board

                statBrdUpdate(2);

                startGame(gmPlayz.mode);

                scene.add(directionalLight);

                break;

            case `go Ex Pl`: //swap to P2, add board, update & move SB, takeCorner();

                startExtreme();

                scene.add(directionalLight);

                newLives();

                startGame(gmPlayz.mode);

                break;

            case `replay Pl`:  //reset for new game

                slp(750).then(() => {

                    cleanup_E_R_N();

                    //reset current player to 1
                    gmPlayz.currentPlayer = 1

                    //remove spin/hover planes from vr
                    // removeOb('arrow Left Plane', uiPlane);
                    // removeOb('arrow Right Plane', uiPlane);

                    gameOverCleanUp();

                    swapPos();

                    statBrdUpdate(2);

                });

                break;

            case 'NxtLvl Pl':  //reset for new game

                slp(750).then(() => {

                    cleanup_E_R_N();

                    gameOverCleanUp();

                });

                slp(1000).then(() => {

                    startExtreme();

                });

                break;

            case `exit Pl`: //reload landing page

                location.reload();

                break;

            default:

              console.log(`dflt`);

        }

    }

}

function startExtreme() {

    zzfx(...[, .9, 1306, .8, .08, .02, 1, , , , , , .48, , -0.1, .11, .25])//🐬

    gmPlayz.currentPlayer = 2;

    gmPlayz.Extreme = true;

    statBrdUpdate(3);

    swapPos();

}

export function startGame(mode) {

    switch (mode) {
        case 'DT':

            //ZZZZZZZZZZZZZZZZZZZZZZZZZZZZ
            modeChange(gameMaster.gmMode[3])
            //ZZZZZZZZZZZZZZZZZZZZZZZZZZZ

            break;

        case 'VR':

            //ZZZZZZZZZZZZZZZZZZZZZZZZZZZZ
            modeChange(gameMaster.gmMode[4])
            //ZZZZZZZZZZZZZZZZZZZZZZZZZZZ

            break;

        case 'AR':

            gmPlayz.ARtime = true;

            //ZZZZZZZZZZZZZZZZZZZZZZZZZZZZ
            modeChange(gameMaster.gmMode[5])
            //ZZZZZZZZZZZZZZZZZZZZZZZZZZZ

            break;
    }


}
