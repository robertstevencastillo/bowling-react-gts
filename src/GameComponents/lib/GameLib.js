class GameLib {


  static isStrike = (rolls) => (rolls[0] === 10);

  static getFrameScores = (frames) => frames.map((frame) => frame.score);

  static calculateFrameScore = (rolls) => (rolls.reduce((total, score) => total + score));

  static calculateHighestPossibleRoll = (rollScore) => Array.from(Array((11 - rollScore)).keys());

  static resetScoreBoard = () => (Array.from(Array(11).keys()));

  static frameComplete = (activeFrame) => (activeFrame.isStrike || activeFrame.rolls.length === 2);

  static isSpare = (rolls) => {
    if (rolls.length !== 2) {
      return false;
    }
    return rolls[0] + rolls[1] === 10;
  }

  static sumFrames = (frames) => {
    const frameScores = this.getFrameScores(frames);
    return frameScores.reduce((total, score) => total + score);
  }

  static resetFrames = () => {
    return [...Array(10)].map(() => {
      return {
        score: 0,
        rolls: [],
        isSpare: false,
        isStrike: false,
        currentGameScore: 0
      }
    })
  }

  // #region End Game Methods

  static shouldAddThirdRoll = (activeFrame) => (activeFrame.rolls.length < 3 && (activeFrame.isSpare || activeFrame.isStrike));

  static isLastFrame = (activeFrameIndex) => (activeFrameIndex === 9);

  static shouldEndGame = (activeFrame) => (activeFrame.rolls.length === 3);

  static shouldEndGameAfterBonusSpareRoll = (activeFrame) => (activeFrame.rolls.length === 3 && activeFrame.rolls[0] + activeFrame.rolls[1] === 10);

  static shouldEndGameIfSpareNotRolled = (activeFrame) => (activeFrame.rolls.length === 2 && activeFrame.rolls[0] + activeFrame.rolls[1] !== 10);

  static shouldAddBonusRollAfterSpare = (activeFrame) => (activeFrame.rolls.length === 2 && !activeFrame.isStrike);

  // #endregion

}

export default GameLib;