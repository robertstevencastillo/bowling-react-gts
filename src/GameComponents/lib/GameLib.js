class GameLib {

  static isSpare = (rolls) => {
    if (rolls.length !== 2) {
      return false;
    }
    return rolls[0] + rolls[1] === 10;
  }

  static isStrike = (rolls) => (rolls[0] === 10);

  static getFrameScores = (frames) => frames.map((frame) => frame.score);

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

  static calculateFrameScore = (rolls) => (rolls.reduce((total, score) => total + score));

  static calculateHighestPossibleRoll = (rollScore) => Array.from(Array((11 - rollScore)).keys());

  static resetScoreBoard = () => (Array.from(Array(11).keys()));

  static shouldAddThirdRoll = (activeFrame) => (activeFrame.rolls.length < 3 && (activeFrame.isSpare || activeFrame.isStrike));

  static isLastFrame = (activeFrameIndex) => (activeFrameIndex === 9);

  static shouldFinishGame = (activeFrameIndex, activeFrame) => (activeFrameIndex === 9 && activeFrame.rolls.length === 3)

}

export default GameLib;