class GameLib {

  static isSpare = (rolls) => {
    if (rolls.length !== 2) {
      return false;
    }
    return rolls[0] + rolls[1] === 10;
  };

  static isStrike = (rolls) => (rolls[0] === 10);

  static getFrameScores = (frames) => frames.map((frame) => frame.score)

  static sumFrames = (frames) => {
    const frameScores = this.getFrameScores(frames);
    return frameScores.reduce((total, score) => total + score);
  }

  static calculateFrameScore = (rolls) => (rolls.reduce((total, score) => total + score));

  static calculateHighestPossibleSecondRoll = (rollScore) => Array.from(Array((11 - rollScore)).keys());

  static resetScoreBoard = () => (Array.from(Array(11).keys()));

}

export default GameLib;