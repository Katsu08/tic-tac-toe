// @ts-check

import { Player } from './player.js';

export class Board {
  static _totalGames = 0;

  constructor(player1 = 'Player 1', player2 = 'Player 2') {
    this._player1 = new Player(player1);
    this._player2 = new Player(player2);
    this._board = [];
    this._turn = 0;
  }

  startGame() {
    Board.#clearScreen();
    this._board = this.#getClearedBoard();
    
    this.turn = Board._totalGames++ % 2;

    this.updateScoreBoard(this.turn, this.player1, this.player2);

    this.#renderBoard(this.board);
  }

  /**
   * 
   * @param {Number} turn Actual turn number (0 or 1)
   * @param {Player} player1 A Player instance
   * @param {Player} player2 Another Player instance
   */
  updateScoreBoard(turn, player1, player2) {
    const scoreBoard = document.getElementById('scoreBoard');

    const score = scoreBoard.children[0];
    const scorePlayer1 = scoreBoard.children[1];
    const scorePlayer2 = scoreBoard.children[2];

    score.innerHTML = `Round ${Board._totalGames}:`;
    scorePlayer1.innerHTML = `${player1.name} (${player1.score})`;
    scorePlayer2.innerHTML = `${player2.name} (${player2.score})`;

    console.log(turn);
    if (turn) { 
      scorePlayer2.classList.add('fw-bold');
      scorePlayer1.classList.remove('fw-bold');
    } else {
      scorePlayer2.classList.remove('fw-bold');
      scorePlayer1.classList.add('fw-bold');
    }
  }

  /**
   * 
   * @returns {Array} The cleared board array
   */
  #getClearedBoard() {
    const board = new Array();

    for (let i = 0; i < 9; i++) {
      board.push(undefined);
    }

    return board;
  }

  /**
   * 
   * @param {Array} board The array that contains the board data
   */
  #renderBoard(board) {
    const gameBoard = document.createElement('div');
    gameBoard.id = 'gameBoard';

    for (let i = 0; i < 9; i++) {
      const gameBox = document.createElement('div');
      gameBox.id = (i + 1).toString();

      if (!isNaN(board[i])) {
        gameBox.className = `played${board[i]}`;
      } else { 
        gameBox.addEventListener('click', (event) => {
          this.turn = this.#playTurn(event, this.turn);
        })
      }

      gameBoard.appendChild(gameBox);
    }

    document.getElementById('app').appendChild(gameBoard);
  }

  /**
   * 
   * @param {Event} event The event handled by the game box
   * @param {Number} turn The actual turn to play
   * @returns {Number} return the next turn to play 
   */
  #playTurn(event, turn) {
    // @ts-ignore
    const box = event.target.id;
    const nextTurn = Number(!this.turn);

    this._board[box - 1] = turn;

    
    const winner = this.verifyBoardStatus(this.board);
    
    if (winner !== -1) {  
      if (isNaN(winner)) {
        Board.#clearScreen();
        this.#renderBoard(this.board);
        
        this.updateScoreBoard(nextTurn, this.player1, this.player2);
        
        return nextTurn;
      } else {
        let player = winner == 0 ? this.player1 : this.player2;  
        
        player.score++;
        
        this.updateScoreBoard(nextTurn, this.player1, this.player2);
        this.selectWinner(player);
      }
    }
  }

  /**
   * 
   * @param {Array} board The array that contains the board data 
   * @returns {Number} The player winner
   */
  verifyBoardStatus(board) {
    let winner = undefined;
    
    const pattern = (board, i, jstart, callback) => {
      let coincidence = 0;
      let j = jstart;
      let loops = 0;
      
      while(j < 9) {
        if (board[j] === i) coincidence++;
        
        j = callback(j);
        
        if (coincidence === 3) winner = i;
        
        if (!(++loops % 3)) coincidence = 0;
      };
    }
    
    for (let i = 0; i <= 1 && !winner; i++) {
      pattern(board, i, 0, (j) => ++j);
      for(let jstart = 0; jstart < 3; jstart++) pattern(board, i, jstart, (j) => j + 3);
      pattern(board, i, 2, (j) => j + 2);
      pattern(board, i, 0, (j) => j + 4);
    }

    if (!winner && !board.includes(undefined)) {
      this.selectWinner(undefined);
      winner = -1;
    }

    return winner;
  }

  /**
   * 
   * @param {Player} [winner] The winner returned by verifyBoardStatus function
   */
  selectWinner(winner) {
    Board.#clearScreen();

    const winnerText = winner ? `El ganador es: ${winner.name}` : `Empate!`

    const endGameScreen = document.createElement('div');
    endGameScreen.className = 'container h-100';
    endGameScreen.id = 'endGame';

    const endGameContainer = document.createElement('div');
    endGameContainer.className = 'h-100 h1 d-flex flex-column justify-content-center align-items-center';

    const endGameTitle = document.createElement('div');
    endGameTitle.innerText = 'Juego terminado';

    const endGameWinner = document.createElement('div');
    endGameTitle.className = 'my-4';
    endGameTitle.innerText = winnerText;

    const endGameButton = document.createElement('button');
    endGameButton.innerText = 'Volver a empezar';
    endGameButton.className = 'btn btn-secondary';
    endGameButton.addEventListener('click', () => this.startGame());
    
    endGameScreen.appendChild(endGameContainer);
    endGameContainer.appendChild(endGameTitle);
    endGameContainer.appendChild(endGameWinner);
    endGameContainer.appendChild(endGameButton);

    document.getElementById('app').appendChild(endGameScreen);
  }

  get player1() {
    return this._player1;
  }
  
  get player2() {
    return this._player2;
  }

  get board() {
    return this._board;
  }

  get turn() {
    return this._turn;
  }

  set turn(turn) {
    this._turn = turn;
  }

  /**
   * 
   * @param {Player} [player1] 
   * @param {Player} [player2]
   */
  static backToMenu(player1, player2) {
    Board.#clearScreen();

    const form = document.createElement('form');
    form.id = 'gameMenu';
    form.className = 'd-grid gap-2 mt-5';
    
    const inputPlayer1 = document.createElement('input');
    inputPlayer1.id = 'player1';
    inputPlayer1.className = 'form-control';
    inputPlayer1.type = 'text';
    inputPlayer1.value = player1?.name || null;
    inputPlayer1.placeholder = 'Player 1';
    
    const inputPlayer2 = document.createElement('input');
    inputPlayer2.id = 'player2';
    inputPlayer2.className = 'form-control';
    inputPlayer2.type = 'text';
    inputPlayer2.value = player2?.name || null;
    inputPlayer2.placeholder = 'Player 2';

    const button = document.createElement('button');
    button.className = 'btn btn-primary';
    button.innerText = 'Start Game';

    form.appendChild(inputPlayer1);
    form.appendChild(inputPlayer2);
    form.appendChild(button);

    document.getElementById('app').appendChild(form);
  }

  static #clearScreen() {
    const gameBoard = document.getElementById('gameBoard');

    if (gameBoard) {
      gameBoard.remove();
    }

    const gameMenu = document.forms['gameMenu'];

    if (gameMenu) {
      gameMenu.remove();
    }

    const gameEnd = document.getElementById('endGame');

    if (gameEnd) {
      gameEnd.remove();
    } 
  }
}
