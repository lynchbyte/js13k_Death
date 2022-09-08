
import { scene, gmBoard, Player1_Ob, Player2_Ob } from './script.js';
import { makeMove } from './gameMakeMove.js';
import { genPerms, sgobn } from './gameHelpers.js'


export function putersTurn() {

    //if player1 has only 1 Mesh on the board
    if (gmBoard.nodesArr.length == 26) {

        takeCorner();

    }

    //if player2 only has more than 1 mesh on the board;
    //if exactly 1 mesh; goDefence
    //if more than 1; goForWin
    else {

        Player2_Ob.p2ClkClndMeshNameArr.length == 1 ? goDefence() : goForWin(Player2_Ob.p2ClkClndMeshNameArr)

    }
}


export function takeCorner() {
    console.log(`take corner`);

    const cornerIndxArr = ['111', '113', '131', '133', '311', '313', '331', '333'];

    let nodesArrCopy = [];

    //make a copy
    nodesArrCopy = gmBoard.nodesArr.slice();

    //make an array of avaialavble nodes names
    const nodesArrCopyName = [];
    nodesArrCopy.forEach(e => nodesArrCopyName.push(e.name));

    const inBoth = nodesArrCopyName.filter(x => cornerIndxArr.indexOf(x) !== -1);

     let cornerValue = inBoth[Math.floor(Math.random() * inBoth.length)];

    //let cornerValue = inBoth[0];

    const ob = sgobn('' + cornerValue);

    let indtc = gmBoard.nodesArr.findIndex(eee => eee.name == '' + cornerValue);

    makeMove(
        ob.position.x,
        ob.position.y,
        ob.position.z,
        indtc,
        ob.name
    );

}

/**
 * If P2 has more than 1 mesh on the board;
 * Loop thru alreadyClickedP2Arr, new arrray, newArrWTP2_P2lots, from winsTotsP2 that have a mesh alrady played.
 * filter out already played meshes.
 * If an array has a length of 1, the array has 2 P2 meshes on the board, use this makeMove.
 */
function goForWin(P2OnBoardMeshNamesArr) {

  

    let P2_WinsTots_PossibleI = []
    let P2_WinsTots_PossibleAll = []

    //any turn above 2nd turn
    loop1:
    for (let i = 0; i < P2OnBoardMeshNamesArr.length; i++) {

        //new array, filtered from winsTotalP2 that contain mesh i already on board
        P2_WinsTots_PossibleI = Player2_Ob.winsTotalP2.flatMap(d =>
            //condition,
            (d.some(e => e == P2OnBoardMeshNamesArr[i])) ?
                //if true,pushed to array f
                [d] :
                //if false to push to oblivion
                []);

        for (let i = 0; i < P2_WinsTots_PossibleI.length; i++) {

            P2_WinsTots_PossibleAll.push(P2_WinsTots_PossibleI[i]);

        }

    }

    if (P2_WinsTots_PossibleAll.length == 0) {

        goDefence();

    }

    loop2:
    for (let i = 0; i < P2_WinsTots_PossibleAll.length; i++) {

        //leave only the values not in alreadyCliked

        //new array, filtered from P2_WinsTots_PossibleAll that contains positions that are not on the board
        let notOnBoard = P2_WinsTots_PossibleAll[i].filter(item => !P2OnBoardMeshNamesArr.includes(item));

        //if there is only 1 value 
        if (notOnBoard.length == 1) {

            //2 greens are already aligned on the board
             let winnerPos = notOnBoard[0];

            let winnerOb = sgobn('' + winnerPos);
            let indexWin = gmBoard.nodesArr.findIndex(e => e.name == '' + winnerPos);

            makeMove(
                winnerOb.position.x,
                winnerOb.position.y,
                winnerOb.position.z,
                indexWin,
                winnerOb.name
            );

            break loop2

        }

        //if finished looping, all notOnBoard > 1, there are not 2 greens aligned on the board
        if (i == P2_WinsTots_PossibleAll.length - 1) {

            goDefence();

        }

    }

}

/**
 * Look at P1 already played Meshes, generatePerms of 2.
 * Loop thru permsOf2forP1 array,
 * if first index of permsOf2forP1 also appears in to winsTotalP1, push to new array newArrFirstIndexDef.
 * Loop thru newArrFirstIndexDef
 * if second index of permsOf2forP1 also appears in to newArrFirstIndexDef, push to new array newArrBothDef.
 * If newArrBothDef.length greater than 0, filter out already P1 played meshes , makeMove() at oddOneOut.
 * If newArrBothDef.length = 0, goAggro().
 */
function goDefence() {




    let permsOf2forP1 = genPerms(Player1_Ob.p1ClkClndMeshNameArr, 2);
    let useThisOne, deleteItem1, deleteItem2, oddOneOut, ob

    for (let i = 0; i < permsOf2forP1.length; i++) {

        let newArrFirstIndexDef = Player1_Ob.winsTotalP1.flatMap(d =>
            //condition, the first element of permsOf2forP1 is in winsTotalP1
            (d.some(e => e == permsOf2forP1[i][0])) ?
                //if true,pushed to array newArrFirstIndexDef
                [d] :
                //if false to push to oblivion
                []);

        let newArrBothDef = newArrFirstIndexDef.flatMap(d =>
            //condition, the second element of permsOf2forP1 is also in the flatmap array from above
            (d.some(e => e == permsOf2forP1[i][1])) ?
                //if true,pushed to array newArrBothDef
                [d] :
                //if false to push to oblivion
                []);

        if (newArrBothDef.length > 0) {

            let tryThisOne = newArrBothDef[0];
            deleteItem1 = permsOf2forP1[i][0];
            deleteItem2 = permsOf2forP1[i][1];

            const forDeletion = [deleteItem1, deleteItem2];
            oddOneOut = tryThisOne.filter(item => !forDeletion.includes(item));
            ob = sgobn('' + oddOneOut);

            if (ob == undefined) {

                goRando();
                return
            }

            //if found has found otherP2 mesh return, must be have parent boardGr
            if (ob.parent == gmBoard.boardGrp) {

                useThisOne = tryThisOne;

                break
            }
        }

    }

    if (useThisOne !== undefined) {

        const indx = gmBoard.nodesArr.findIndex(eee => eee.name == '' + oddOneOut);

        makeMove(
            ob.position.x,
            ob.position.y,
            ob.position.z,
            indx,
            ob.name
        );

    }

    if (useThisOne == undefined) {

        goAggro(Player2_Ob.p2ClkClndMeshNameArr);

    }

}


/**
 * Look at P2 already played Meshes, acP2Arr.
 * Loop thru acP2Arr, new arrray, newArrWTP2_P2lots, from winsTotsP2 that have a mesh alrady played.
 * use  index array to makeMove.
 */
function goAggro(P2OnBoardMeshNamesArr) {


    let P2_WinsTots_PossibleI = []
    let P2_WinsTots_PossibleAll = []

    for (let i = 0; i < P2OnBoardMeshNamesArr.length; i++) {

        //new array of winstotsP2 that contain alreadyClicked
        P2_WinsTots_PossibleI = Player2_Ob.winsTotalP2.flatMap(d =>
            //condition, if the element occurs somewhere in 
            (d.some(e => e == P2OnBoardMeshNamesArr[i])) ?
                //if true,pushed to array f
                [d] :
                //if false to push to oblivion
                []);

        for (let i = 0; i < P2_WinsTots_PossibleI.length; i++) {

            P2_WinsTots_PossibleAll.push(P2_WinsTots_PossibleI[i]);

        }

    }

    if (P2_WinsTots_PossibleAll.length == 0) {

        goRando();
    }

    for (let i = 0; i < P2_WinsTots_PossibleAll.length; i++) {

        //leave only the values not in alreadyCliked
        let newArrRemain1Val = P2_WinsTots_PossibleAll[i].filter(item => !P2OnBoardMeshNamesArr.includes(item));

        //first value of filtered array
        let valuetoUse = newArrRemain1Val[0];

        let ob = sgobn('' + valuetoUse);
        let g2idx = gmBoard.nodesArr.findIndex(eee => eee.name == '' + valuetoUse);

        makeMove(
            ob.position.x,
            ob.position.y,
            ob.position.z,
            g2idx,
            ob.name
        );

        return

    }
}

function goRando() {

    let randoValue = Math.floor(Math.random() * gmBoard.nodesArr.length);

    let randoMesh = gmBoard.nodesArr[randoValue];

    const ob = sgobn('' + randoMesh.name);

    makeMove(
        ob.position.x,
        ob.position.y,
        ob.position.z,
        randoValue,
        ob.name
    );
}





















