import {
    BoxBufferGeometry,
    CylinderGeometry,
    InstancedMesh,
    Matrix4,
    Mesh,
    MeshBasicMaterial,
    Vector3
}
    from 'https://unpkg.com/three@0.143.0/build/three.module.js';
    
import { gmBoard } from './script.js';

const matrixHolder = new Matrix4();//used to construct sticks

/**
 * Class creating a visual structure and game logic.  Consist of ;
 * - Sticks - visual only,
 *          - vertical and horizontal (2 axis) sticks,
 *          - instanced mesh based off very skinny cylinder geometry,
 *          - parent is gmBoard.boardGrp,  apply scalar value when group added to scene
 *          - pushed to sticksArr[], emptied to replay scene.
 *             
 * - Nodes  - visual and main component of game play
 *          - box geometry, NOT instnaced, 27 in total
 *          - mesh.name is sting of relative grid location;  "111" = far left, btm , front,
 *          - parent is gmBoard.boardGrp, apply scalar value when group added to scene
 *          - pushed to nodesArr[], removed from array when selected, emptied to replay scene.
 *            use example; const brd = new Board();scene.add(gmBoard.boardGrp);
 * 
 */
export class Board {

    constructor() {

        //Nodes
        const geoNode = new BoxBufferGeometry(gmBoard.nodeSize, gmBoard.nodeSize, gmBoard.nodeSize);

        let intNode = 1;

        for (let x = 0; x < gmBoard.edgeQty; x++) {

            for (let y = 0; y < gmBoard.edgeQty; y++) {

                for (let z = 0; z < gmBoard.edgeQty; z++) {

                    const meshNode = new Mesh(geoNode, gmBoard.matNode);
                    meshNode.position.set(-1 * (gmBoard.offset - x), -1 * (gmBoard.offset - y), gmBoard.offset - z);
                    meshNode.name = `${x + 1}${y + 1}${z + 1}`;

                    gmBoard.boardGrp.add(meshNode);
                    gmBoard.nodesArr.push(meshNode);

                    intNode++;

                }

            }

        }


        // Sticks
        const geoSticks = new CylinderGeometry(gmBoard.stickDia / 2, gmBoard.stickDia / 2, gmBoard.stickLength, 20, 1);//radiusTop, radiusBottom, height, radialSeg, heightSeg, openEnded, thetaStart, thetaLength
        const matSticks = new MeshBasicMaterial({ color: gmBoard.stickCol });

        ///// Vertical Sticks
        //// Y AXIS
        let rotVecY = new Vector3(0, 0, 0);
        mkSticks(geoSticks, matSticks, rotVecY);


        ///// Horizontal Along 
        //// X AXIS
        let rotVecX = new Vector3(0, 0, 3.14 / 2,);
        mkSticks(geoSticks, matSticks, rotVecX);

        ///// Horizontal Along
        //// Z AXIS
        let rotVecZ = new Vector3(3.14 / 2, 0, 0);
        mkSticks(geoSticks, matSticks, rotVecZ)

    }
}



function mkSticks(geo, mat, rot,) {

    const meshSticks = new InstancedMesh(geo, mat, gmBoard.count);
    meshSticks.rotation.x = rot.x;
    meshSticks.rotation.y = rot.y;
    meshSticks.rotation.z = rot.z;
    meshSticks.name = 'Mesh Sticks';
    let tempStick = 0;

    for (let x = 0; x < gmBoard.edgeQty; x++) {

        for (let y = 0; y < gmBoard.edgeQty - 1; y++) {

            for (let z = 0; z < gmBoard.edgeQty; z++) {

                matrixHolder.setPosition(-1 * (gmBoard.offset - x), -1 * (gmBoard.offset - y - 0.5), gmBoard.offset - z);

                meshSticks.setMatrixAt(tempStick, matrixHolder);

                tempStick++;

            }

        }

    }

    gmBoard.boardGrp.add(meshSticks);
    gmBoard.sticksArr.push(meshSticks);

}







