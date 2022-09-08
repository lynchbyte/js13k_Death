

import {

    AnimationClip,
    AnimationMixer,
    AnimationObjectGroup,
    MeshStandardMaterial,
    Quaternion,
    QuaternionKeyframeTrack,
    Vector3,
    VectorKeyframeTrack,


}
    from 'https://unpkg.com/three@0.143.0/build/three.module.js';

import {
    scene, uiPlane, gmBoard, firstClick, texture,
    statBrd, gmPlayz, Player1_Ob, Player2_Ob, zzfx,
    gameMaster, lpArr, mixArr, clickable, imgNum, picAll
} from './script.js';

import { Board } from './addBoard.js';

import { removeOb, picNew, slp, statBrdUpdate, sgobn } from './gameHelpers.js';

import { onMouseClick } from './gameSelect.js';

import { add_GO_points } from './addGameOver.js';

import { extremeAdjustment } from './gameMakeMove.js'

import { takeCorner } from './gameP2Move.js'

import { XRSuppQry } from './gameXR.js'

import { cleanUp_D_V_A, cleanUp_G_F} from './gameCleanUp.js';


let dkp, gfp1, gfe, exp, rpp, nlp, arwL, arwR

export const arrows = [];


export function modeChange(stage) {

    switch (stage) {


        case 'AA'://show title page //0

            const mkLandPic = new picNew(picAll, 0, (0 * (Math.PI / 180)), 0, -1.25, -1.25, 100, `Land Pl`, 0, scene);

            const lp = sgobn(`Land Pl`);
            lp.scale.set(0.8, 0.8, 0.8);
            lpArr.push(lp);
            let yOffset = 0.3;

            for (let y = 0; y < 3; y++) {

                for (let x = 0; x < 3; x++) {

                    const newLp = lp.clone();
                    newLp.position.set(1 * x - 1, (1 * y - 1) + yOffset, -4);
                    newLp.name = `Landing Plane`
                    scene.add(newLp);
                    lpArr.push(newLp);

                }

            }

            //corner texture different
            const rdmPic = lpArr[3];
            texture.offset.set(1 / imgNum * 1, 0);//1/imageNum * imagePlace,
            texture.repeat.set(1 / imgNum, 1);

            rdmPic.material = new MeshStandardMaterial({
                map: texture, side: 2,
                transparent: true,
            });

            rdmPic.material.needsUpdate = true;

            //animation
            //lpArr[0] is og at oblivion
            const mx1 = new AnimationMixer(lpArr[1]);

            const animGroup2 = new AnimationObjectGroup();
            animGroup2.add(lpArr[3], lpArr[5])
            const mx2 = new AnimationMixer(animGroup2);

            const mx3 = new AnimationMixer(lpArr[2]);

            const mx4 = new AnimationMixer(lpArr[4]);

            const mx5 = new AnimationMixer(lpArr[9]);

            const mx6 = new AnimationMixer(lpArr[6]);

            const mx7 = new AnimationMixer(lpArr[8]);

            mixArr.push(mx1, mx2, mx3, mx4, mx5, mx6, mx7);

            //rotate around y keyframe
            const yAxis = new Vector3(0, 1, 0);
            const qY1 = new Quaternion().setFromAxisAngle(yAxis, 0);
            const qY2 = new Quaternion().setFromAxisAngle(yAxis, Math.PI);
            const quatY = new QuaternionKeyframeTrack('.quaternion', [0, 1, 2], [qY1.x, qY1.y, qY1.z, qY1.w, qY2.x, qY2.y, qY2.z, qY2.w, qY1.x, qY1.y, qY1.z, qY1.w]);

            //rotate around z keyframe
            const zAxis = new Vector3(0, 0, 1);
            const qZ1 = new Quaternion().setFromAxisAngle(zAxis, 0);
            const qZ2 = new Quaternion().setFromAxisAngle(zAxis, Math.PI);
            const quatZ = new QuaternionKeyframeTrack('.quaternion', [0, 1, 2], [qZ1.x, qZ1.y, qZ1.z, qZ1.w, qZ2.x, qZ2.y, qZ2.z, qZ2.w, qZ1.x, qZ1.y, qZ1.z, qZ1.w]);

            //scale keyframe
            const scaleKF = new VectorKeyframeTrack('.scale', [0, 1, 2], [0.8, 0.8, 0.8, 0.1, 0.1, 0.1, 0.8, 0.8, 0.8]);

            //clips
            const clip1 = new AnimationClip('Action', 12, [quatY]);
            const ca1 = mx1.clipAction(clip1);

            const clip2 = new AnimationClip('Action', 9, [quatY]);
            const ca2 = mx2.clipAction(clip2);

            const clip3 = new AnimationClip('Action', 6, [quatY]);
            const ca3 = mx3.clipAction(clip3);

            const clip4_5 = new AnimationClip('Action', 15, [quatZ]);
            const ca4 = mx4.clipAction(clip4_5);
            const ca5 = mx5.clipAction(clip4_5);

            const clip6_7 = new AnimationClip('Action', 18, [scaleKF]);
            const ca6 = mx6.clipAction(clip6_7);
           const ca7 = mx7.clipAction(clip6_7);

            slp(250).then(() => {
                ca1.play();
            });

            slp(750).then(() => {
                ca2.play();
            });

            ca3.play();

            slp(2000).then(() => {
                ca4.play();
            });

            slp(6300).then(() => {
                ca5.play();
            });

            slp(800).then(() => {
                ca6.play();
            });
            slp(1200).then(() => {
              ca7.play();
            });

            break;

        case 'BB'://show desktop, query and show  vr or ar ? //1

            scene.add(uiPlane);

            document.removeEventListener('click', firstClick);

            //remove landing plage planes
            for (let i = 0; i < lpArr.length; i++) {

                removeOb(lpArr[i].name, scene);

            }

            const deskTopPic = new picNew(picAll, 0, (0 * (Math.PI / 180)), 0, 0, 1.25, 0.002, `Desktop Pl`, 6, uiPlane);

            dkp = sgobn(`Desktop Pl`);
            clickable.push(dkp);

            XRSuppQry();

            break;

        case 'CC'://show goes first ? //2

            cleanUp_D_V_A();

            const go1Pic = new picNew(picAll, 0, (0 * (Math.PI / 180)), 0, -1.25, 0, 0.002, `go1 Pl`, 11, uiPlane);
            const goExPic = new picNew(picAll, 0, (0 * (Math.PI / 180)), 0, 1.25, 0, 0.002, `go Ex Pl`, 12, uiPlane);


            gfp1 = sgobn(`go1 Pl`);
            clickable.push(gfp1);

            gfe = sgobn(`go Ex Pl`);
            clickable.push(gfe);

            break;

        case 'DD'://startDT(); //3

            start_DT();

            break;

        case 'EE'://startVR(); //4

            start_VR();

            break;

        case 'FF'://start AR();  // 5

            start_AR();

            break;

        case 'GG'://triggered from checkForWin, win time or lose time //6

            gmPlayz.gameOver = true;


            gmPlayz.uiTime = true;

            let currentLife = sgobn(`life` + gmPlayz.level);

            if (gmPlayz.currentPlayer == 1) {

                zzfx(...[, , 80, .3, .4, .7, 2, .1, -0.73, 3.42, -430, .09, .17, , , , .19]);//🌟
                add_GO_points(Player1_Ob.colP1);


                if (gmPlayz.Extreme == true) {

                    //show heart
                    const heartOG = sgobn(`Heart Pl`);
                    const heart = heartOG.clone();

                    uiPlane.add(heart);
                    heart.position.copy(currentLife.position);
                    heart.translateZ(0.001);
                }

            }

            else {

                zzfx(...[, , 333, .01, 0, .9, 4, 1.9, , , , , , .5, , .6]);//💥
                add_GO_points(Player2_Ob.colP2);

                if (gmPlayz.Extreme == true) {

                    //show RIP
                    const ripOG = sgobn(`RIP Pl`);
                    const rip = ripOG.clone();

                    uiPlane.add(rip);
                    rip.position.copy(currentLife.position);
                    rip.translateZ(0.001);

                    //add point to match
                    gmPlayz.match += 1;
                }

            }

         if (currentLife !== undefined){
            currentLife.scale.set(0.001,0.001,0.001)
         }

            let newMap;

            gmPlayz.currentPlayer == 1 ? newMap = 2 : newMap = 3;

            statBrdUpdate(newMap)

            slp(2500).then(() => {

                //ZZZZZZZZZZZZZZZZZZZZZZZZZZZZ
                modeChange(gameMaster.gmMode[7]);
                //ZZZZZZZZZZZZZZZZZZZZZZZZZZZ

            });

            break;

        case 'HH'://show replay or exit or next level // 7

            document.addEventListener('click', onMouseClick);

            const mkExitPic = new picNew(picAll, 0, (0 * (Math.PI / 180)), 0, -3, 1, 0.002, `exit Pl`, 17, uiPlane);

            exp = sgobn(`exit Pl`);
            clickable.push(exp);

            //if match over, do not show replay
            if (gmPlayz.level === 7  && gmPlayz.Extreme == true) {

                const gOPic = new picNew(picAll, 0, (0 * (Math.PI / 180)), 0, -3, -0.25, 0.002, `Game Over Plane`, 21, uiPlane);
                //let goPic = sgobn(`Game Over Plane`);

            }
            else {

                if (gmPlayz.Extreme == false) {

                    const mkReplayPic = new picNew(picAll, 0, (0 * (Math.PI / 180)), 0, -3, -0.25, 0.002, `replay Pl`, 19, uiPlane);
                    rpp = sgobn(`replay Pl`);
                    clickable.push(rpp);

                }

                else {

                    const mkNxtLvlPic = new picNew(picAll, 0, (0 * (Math.PI / 180)), 0, -3, -0.25, 0.002, 'NxtLvl Pl', 20, uiPlane);
                    nlp = sgobn('NxtLvl Pl');
                    clickable.push(nlp);

                }
            }

            removeOb(`Stat Brd`, uiPlane);
            removeOb('Draw Plane', uiPlane);


            break;

        case 'II'://show drawtime //8  //triggered from addPlayer check for Draw

            gmPlayz.gameOver == true

            gmPlayz.uiTime = true;

            removeOb(`Stat Brd`, uiPlane);

            const drawPic = new picNew(picAll, 0, (0 * (Math.PI / 180)), 0, -3, 0, 0.002, `Draw Plane`, 18, uiPlane);

            zzfx(...[, , 925, .04, .3, .6, 1, .3, , 6.27, -184, .09, .17])//🥊

            if (gmPlayz.Extreme == true) {


                let currentLife = sgobn(`life` + gmPlayz.level);

                //show heart/draw
                const drawOG = sgobn('Draw Pl2');
                const draw = drawOG.clone();

                draw.clone(drawOG);

                uiPlane.add(draw);
                draw.position.copy(currentLife.position);
                draw.translateZ(0.001);


                //add point to match
                gmPlayz.match += 1;
                if (currentLife !== undefined){
               currentLife.scale.set(0.001,0.001,0.001)
                }
            }

            slp(2500).then(() => {

                //ZZZZZZZZZZZZZZZZZZZZZZZZZZZZ
                modeChange(gameMaster.gmMode[7]);
                //ZZZZZZZZZZZZZZZZZZZZZZZZZZZ

            });

            break;

        default:

          console.log(`dflt`);

    }

}

function start_DT() {

    cleanUp_G_F();

    document.getElementById("left").style.display = "block";
    document.getElementById("right").style.display = "block";

    uiPlane.add(statBrd);

    const brd = new Board();
    scene.add(gmBoard.boardGrp);
    gmBoard.boardGrp.position.set(0, 0, -4);
    gmBoard.boardGrp.rotation.set((5 * (Math.PI / 180)), 0, 0);

    gmPlayz.uiTime = false;

    slp(1000).then(() => {

        if (gmPlayz.Extreme == true) {

            extremeAdjustment();

            takeCorner();

        }

        else {

            zzfx(...[, , 20, .04, , .6, , 1.31, , , -990, .06, .17, , , .04, .07])//💖

            return;
        }

    });

}

function start_VR() {

    cleanUp_G_F();

    zzfx(...[, , 20, .04, , .6, , 1.31, , , -990, .06, .17, , , .04, .07])//💖

    uiPlane.add(statBrd);

    const brd = new Board();
    scene.add(gmBoard.boardGrp);
    gmBoard.boardGrp.position.set(0, -0.25, -4);

    gmPlayz.uiTime = false;

    const arrwLft = new picNew(picAll, 0, (0 * (Math.PI / 180)), 0, -3, -2, 0.002, 'arw L Pl', 13, uiPlane);
    arwL = sgobn('arw L Pl');
    arrows.push(arwL);
    const arrwRght = new picNew(picAll, 0, (0 * (Math.PI / 180)), 0, 3, -2, 0.002, 'arw R Pl', 14, uiPlane);
    arwR = sgobn('arw R Pl');
    arrows.push(arwR);

    slp(1000).then(() => {

        if (gmPlayz.Extreme == true) {

            extremeAdjustment();

            takeCorner();

        }

        else { return };

    });

}

function start_AR() {

    gmPlayz.mode = 'AR'

    cleanUp_G_F();

    zzfx(...[, , 20, .04, , .6, , 1.31, , , -990, .06, .17, , , .04, .07])//💖

    uiPlane.add(statBrd);

}


