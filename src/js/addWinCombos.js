
import { winsTotal, Player1_Ob, Player2_Ob, gmBoard } from './script.js';


/**
 * Make winning combos array.  Arrays are sorted smallest to largest.
 * Copy this array to each player, P1 and P2.
 * In the copied arrays,
 * arrays are deleted when they are now longer available due to other Player taking a node.
 * 49 arrays in each winCombo Array.
 */
export function makeWinCombos() {

    const winA = [];
    const winB = [];
    const winC = [];

    for (let x = 1; x < gmBoard.edgeQty + 1; x++) {

        for (let y = 1; y < gmBoard.edgeQty + 1; y++) {

            for (let z = 1; z < gmBoard.edgeQty + 1; z++) {

                let arrayTempA = [];
                let arrayTempB = [];
                let arrayTempC = [];

                //for line parallel to z axis
                arrayTempA.push("" + x + y + z);

                //for line parallel to y axis
                arrayTempB.push("" + x + z + y);

                //for line parallel to x axis
                arrayTempC.push("" + z + x + y);

                winA.push(arrayTempA);
                winB.push(arrayTempB);
                winC.push(arrayTempC);

            }

        }
    }

    for (let i = 0; i < winA.length; i = i + 3) {

        //for line parallel to z axis - each array has same y value
        const comboA = winA.slice(i, i + 3);
        const comboAcopy = comboA.flat();

        winsTotal.push(comboAcopy);

    }

    for (let i = 0; i < winB.length; i = i + 3) {

        //for line parallel to y axis - each array has same x value
        const comboB = winB.slice(i, i + 3);
        const comboBcopy = comboB.flat();
        winsTotal.push(comboBcopy);

    }

    for (let i = 0; i < winC.length; i = i + 3) {

        //for line parallel to x axis - each array has same z value
        const comboC = winC.slice(i, i + 3);
        const comboCcopy = comboC.flat();
        winsTotal.push(comboCcopy);

    }

    const comboDD = [];

    comboDD.push(
        //for win in diagonal on 1 plane
        //xy plane
        ['111', '221', '331'].sort(),
        ['311', '221', '131'].sort(),
        ['112', '222', '332'].sort(),
        ['312', '222', '132'].sort(),
        ['113', '223', '333'].sort(),
        ['313', '223', '133'].sort(),

        //xz plane
        ['111', '212', '313'].sort(),
        ['311', '212', '113'].sort(),
        ['121', '222', '323'].sort(),
        ['321', '222', '123'].sort(),
        ['131', '232', '333'].sort(),
        ['331', '232', '133'].sort(),

        //yz plane
        ['111', '122', '133'].sort(),
        ['113', '122', '131'].sort(),
        ['211', '222', '233'].sort(),
        ['213', '222', '231'].sort(),
        ['311', '322', '333'].sort(),
        ['313', '322', '331'].sort()

    )

    comboDD.forEach(function (eachArr) {

        winsTotal.push(eachArr)

    }

    );

    //for win on diagonal 3 axis
    winsTotal.push(
        ['111', '222', '333'].sort(),
        ['311', '222', '133'].sort(),
        ['131', '222', '313'].sort(),
        ['331', '222', '113'].sort(),
    );

    winsTotal.sort();

    //copy winsTotal Array to each player
    Player1_Ob.winsTotalP1 = winsTotal.map(function (arr) {

        return arr.slice();

    });


    Player2_Ob.winsTotalP2 = winsTotal.map(function (arr) {

        return arr.slice();

    });




}












