// @ts-check

import { Board } from './models/board.js'

Board.backToMenu();

const form = document.forms['gameMenu'];
let game;

const startGame = () => {
  const player1 = form['player1'].value || undefined;
  const player2 = form['player2'].value || undefined;
  
  game = new Board(player1, player2);
  game.startGame();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  startGame();
});
