import {

    Color,
    DoubleSide,
    Line,
    LineCurve3,
    Mesh,
    MeshPhongMaterial,
    MeshBasicMaterial,
    TubeBufferGeometry

}
    from 'https://unpkg.com/three@0.143.0/build/three.module.js';

import { scene, gmBoard, gmPlayz, Player1_Ob, Player2_Ob, gameMaster } from './script.js';
import { modeChange } from './gameMode.js';
import { genPerms, sgobn } from './gameHelpers.js';
import { nextTurn } from './gameNextTurn.js';
import { onMouseClick } from './gameSelect.js';


/**
 * Class creating a Player from PlayerX_Ob object properties.
 * eg; const player1 = new Player(Player1_Ob.geoP1, Player1_Ob.colP1, `Player1Mesh`);
 */

export class Player {

    /**
     * @param { object }  geo  - The geometry to create the Player's mesh
     * @param { number }  col  - The color of the Mesh Basic Material
     * @param { string }  name - The name of the mesh object
     */

    constructor(geo, col, name) {

        const matP = new MeshPhongMaterial({ color: col });

        let mesh = new Mesh(geo, matP);

        mesh.name = name;
        scene.add(mesh);
        mesh.position.set(0, 0, 4);
        mesh.visible = false;

    }

    /**
     * check to see if draw has happened, no clickable nodes left in the nodes Array
     */

    checkForDraw() {

        if (gmBoard.nodesArr.length == 0) {

            //ZZZZZZZZZZZZZZZZZZZZZZZZZZZZ
            modeChange(gameMaster.gmMode[8]);
            //ZZZZZZZZZZZZZZZZZZZZZZZZZZZ
        }

    }

    /**
     * empty meshName array for PX, repopulate meshName array from meshClicked.name,
     * to avoid duplicates.
     * checkForWin called using meshName.
 * @param { Array<object>} meshArr   - An array of player's meshes (NOT mesh's name) that have been added to the board.
 */
    check(meshArr) {


        if (gmPlayz.currentPlayer == 1) {

            //set meshName array to 0, to avoid duplicates when this is passed to checkForWin
            Player1_Ob.p1ClkClndMeshNameArr.length = 0;

            //push each mesh name to an array
            meshArr.forEach(e => Player1_Ob.p1ClkClndMeshNameArr.push(e.name));
            checkForWin(Player1_Ob.p1ClkClndMeshNameArr, Player1_Ob.winsTotalP1);


        }

        if (gmPlayz.currentPlayer == 2) {

            //set meshName array to 0, to avoid duplicates when this is passed to checkForWin
            Player2_Ob.p2ClkClndMeshNameArr.length = 0;

            //push each mesh name to an array
            meshArr.forEach(e => Player2_Ob.p2ClkClndMeshNameArr.push(e.name));
            checkForWin(Player2_Ob.p2ClkClndMeshNameArr, Player2_Ob.winsTotalP2);

        }

    }
}


/**
 * After every player's turn, generatePerms of 3 of all possible winning combos from nodesClickedArr.
 * Check if there is a 'maybe' that matches winsTotalsPx
 * nodesClickedArr   -The array of already clicked nodes for the current player
 * winsTotPX_arr -The winsTotalPX (an array of arrays<string>) to check against
 * onMouseClick enabled after Player 2's turn
 */
async function checkForWin(nodesClickedArr, winsTotPX_arr) {

    //need 3 points minimnum for a win
    if (nodesClickedArr.length < gmBoard.level + 2) {

        console.log(`need 3 nodes`);

    }

    let maybes = [];

    maybes = genPerms(nodesClickedArr, 3);

    let counterij = 0;
    let counteri = 0;
    loop1:
    for await (let i of maybes) {

        counteri = counteri + 1;

        loop2:
        for await (let j of winsTotPX_arr) {

            counterij = counterij + 1;

            if (i.sort().toString() == j.sort().toString()) {

                gmPlayz.gameOver = true;

                drawWinLine(i);

                //ZZZZZZZZZZZZZZZZZZZZZZZZZZZZ
                modeChange(gameMaster.gmMode[6]);
                //ZZZZZZZZZZZZZZZZZZZZZZZZZZZ

                break loop1;
            }


        }
    }
    if (gmPlayz.currentPlayer == 2) {

        document.addEventListener('click', onMouseClick);
    }


    nextTurn();

}

/**
 * Add a TubeBuffer Mesh Object to the scene to represent winning node combo.
 * Two outer points set from winning 'Maybe' array 
 * threeNodes - The winning, sorted 'Maybe' array that has be matched to a WinsTotalPX array
 */
function drawWinLine(threeNodes) {

    //Index 0 and 2 required to draw line .
    // Index 1 not required, array has been sorted.
    //  const Point1 = scene.getObjectByName(threeNodes[0]);
    const Point1 = sgobn(threeNodes[0]);
    // let colorCopy = new Color();
    // colorCopy = Point1.material.color;

    let colWin;

    gmPlayz.currentPlayer == 1 ? colWin = Player1_Ob.colP1 : colWin = Player2_Ob.colP2;

    const Point3 = sgobn(threeNodes[2]);

    const tubeLine = new LineCurve3(
        Point1.position, Point3.position
    );

    const geoTube = new TubeBufferGeometry(tubeLine, 3, 0.02, 8, false);
    const matTube = new MeshBasicMaterial({ color: colWin, side: DoubleSide, wireframe: false });
    const tube = new Line(geoTube, matTube);
    gmBoard.boardGrp.add(tube);
}


















