import {

  Mesh,
  SphereGeometry,
  MeshStandardMaterial

}
  from 'https://unpkg.com/three@0.143.0/build/three.module.js';
import { scene, Player1_Ob, Player2_Ob, player1, player2, gmBoard, gmPlayz, zzfx } from './script.js';

import { removeOb, sgobn } from './gameHelpers.js'




/**
 * Clone the current players mesh and add to scene at the position of the node that has been hit.
 * Add this clonedMesh to ClonedMeshArray.
 * Check for win using  ClonedMeshArray.
 * Remove node from scene.
 * Remove node from nodesArr.
 * modify opposite cuurent player winsTotal Array to remove arrays that have node name.
 */
export function makeMove(pozX, pozY, posZ, nodeIndex, nodeName) {


  let curPlayerName;
  gmPlayz.currentPlayer == 1 ? curPlayerName = 'Player1Mesh' : curPlayerName = 'Player2Mesh';

  //clone current player's mesh
  let curPlayerMesh = sgobn(curPlayerName);
  const clonedMesh = curPlayerMesh.clone();

  clonedMesh.position.set(pozX, pozY, posZ);
  clonedMesh.visible = true;
  clonedMesh.name = nodeName;

  gmBoard.boardGrp.add(clonedMesh);


  //add cloned mesh to ClonedMeshArray
  gmPlayz.currentPlayer == 1 ? Player1_Ob.p1ClkClndMeshArr.push(clonedMesh) : Player2_Ob.p2ClkClndMeshArr.push(clonedMesh);

  gmPlayz.currentPlayer == 1 ?
    zzfx(...[, , 1675, , .06, .24, 1, 1.82, , , 837, .06])//💰
    :
    zzfx(...[2, .8, 999, , , , , 1.5, , .3, -99, .1, 1.63, , , .11, .22])//🔔


  //check for win using ClonedMeshArray
  gmPlayz.currentPlayer == 1 ? player1.check(Player1_Ob.p1ClkClndMeshArr) : player2.check(Player2_Ob.p2ClkClndMeshArr);


  //remove click node from scene
  gmBoard.boardGrp.remove(gmBoard.nodesArr[nodeIndex]);

  //remove clicked node from nodesArray
  let removed = gmBoard.nodesArr.splice(nodeIndex, 1);


  //check for Draw
  gmPlayz.currentPlayer == 1 ? player1.checkForDraw() : player2.checkForDraw();

  //for opposite current player, their winsTotalPx array to have arrays removed.
  //any array that contains the nodeName that current player has just taken is removed.
  let winsTotsPXArr;
  gmPlayz.currentPlayer == 1 ? winsTotsPXArr = Player2_Ob.winsTotalP2 : winsTotsPXArr = Player1_Ob.winsTotalP1;

  let wTPXhasNodeNameArr = winsTotsPXArr.flatMap(d =>
    //condition, the 
    (d.some(e => e == ("" + nodeName))) ?

      //if true,pushed to array wTPXhasNodeNameArr
      [d] :

      //if false to push to oblivion
      []);


  for (let i = 0; i < winsTotsPXArr.length; i++) {

    for (let j = 0; j < wTPXhasNodeNameArr.length; j++) {

      if (winsTotsPXArr[i] === wTPXhasNodeNameArr[j]) {

        winsTotsPXArr.splice(i, 1);

      }

    }

  }

}




export function extremeAdjustment() {

  const qtyToRmv = gmPlayz.level + 1

  const nodesQty = 27 - qtyToRmv;

  const toRemove = [];

  var unique = [];
  while (unique.length < qtyToRmv) {
    var r = Math.floor(Math.random() * nodesQty) + 1;
    if (unique.indexOf(r) === -1) unique.push(r);
  }

  const sphere = new Mesh(new SphereGeometry(0.1, 8, 8), new MeshStandardMaterial({ color: 0x1a1a1a, wireframe: true }));

  for (let x = 0; x < unique.length; x++) {

    let randomIndex = unique[x];
    toRemove.push(gmBoard.nodesArr[randomIndex].name);

    const sphCl = sphere.clone();
    gmBoard.boardGrp.add(sphCl);
    sphCl.position.copy(gmBoard.nodesArr[randomIndex].position);

  }

  let newArrP1 = [];
  let newArrP2 = [];

  for (let i = 0; i < toRemove.length; i++) {

    //remove node from scene
    removeOb('' + toRemove[i], gmBoard.boardGrp)

    const index = gmBoard.nodesArr.findIndex(e => e.name == '' + toRemove[i]);

    //remove node from nodesArray
    let removed = gmBoard.nodesArr.splice(index, 1);

    //remove from WinsTot p1 & p2
    // Player1_Ob.winsTotalP1 or Player2_Ob.winsTotalP2
    //if array of array contains toRemove[i], delete it  
    newArrP2 = Player2_Ob.winsTotalP2.flatMap(d =>
      //condition,
      (d.some(e => e == toRemove[i])) ?
        //if true,pushed to oblivion
        [] :
        //if false to push to array
        [d]);

    Player2_Ob.winsTotalP2 = newArrP2.map(function (arr) {

      return arr.slice();

    });

    newArrP1 = Player1_Ob.winsTotalP1.flatMap(d =>
      //condition,
      (d.some(e => e == toRemove[i])) ?
        //if true,pushed to oblivion
        [] :
        //if false to push to array
        [d]);

    Player1_Ob.winsTotalP1 = newArrP1.map(function (arr) {

      return arr.slice();

    });


  }


}

