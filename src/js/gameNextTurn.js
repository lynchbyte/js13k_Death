import { gmPlayz, statBrd, gmBoard } from './script.js';
import { putersTurn } from './gameP2Move.js';
import { slp, statBrdUpdate } from './gameHelpers.js';



export function nextTurn() {

  if (gmBoard.nodesArr.length == 0) { return }

  if (gmPlayz.gameOver == false) {

    //swap current player
    gmPlayz.currentPlayer == 1 ? gmPlayz.currentPlayer = 2 : gmPlayz.currentPlayer = 1;

    swapPos();

    if (gmPlayz.currentPlayer == 1) {

      statBrdUpdate(2);

    }

    if (gmPlayz.currentPlayer == 2) {

      statBrdUpdate(3);

      slp(2000).then(() => {

        putersTurn();

      });

    }

  }

}

export function swapPos() {

  gmPlayz.currentPlayer == 1 ? statBrd.position.set(-3, 1.1, 0) : statBrd.position.set(-3, -0.7, 0)

}









