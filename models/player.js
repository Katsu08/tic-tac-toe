// @ts-check

export class Player {
  static totalPlayers = 0;

  /**
   * 
   * @param {String} name The player name to show at the game 
   */
  constructor(name) {
    this._name = name;
    this._score = 0;
    this._id = ++Player.totalPlayers;
  }

  get name() {
    return this._name;
  }

  set name(name) {
    this._name = name;
  }

  get id() {
    return this._id;
  }

  get score() {
    return this._score;
  }

  set score(score) {
    this._score = score;
  }
}
