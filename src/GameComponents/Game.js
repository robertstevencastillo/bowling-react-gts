import React, { useState } from "react"
import Frame from "./Frame";
import ScoreBoard from './ScoreBoard'
import './Game.css'

function Game(props) {
  const [scoreBoard, setScoreBoard] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  const [activeFrameIndex, setActiveFrameIndex] = useState(0);
  const [gameScore, setGameScore] = useState(0);
  const [isScoreBoardDisabled, setIsScoreBoardDisabled] = useState(false);
  const [frames, setFrames] = useState([...Array(10)].map(() => {
    return {
      score: 0,
      rolls: [],
      frameCompleted: false,
      isSpare: false,
      isStrike: false,
      currentGameScore: 0
    }
  }));

  const isSpare = (scores) => (scores.reduce((total, score) => total + score) === 10);
  const calculateGameScore = (score) => (setGameScore((currGameScore) => currGameScore + score));
  const moveToNextFrame = () => (setActiveFrameIndex((currentIndex) => currentIndex + 1));
  const resetScoreBoard = () => (setScoreBoard([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));

  const calculateSpareBonus = (rolls) => {
    if (rolls.length !== 1) {
      return 0;
    }
    return rolls[0]
  }
  const calculateStrikeBonus = (roll) => (roll);

  const updateFrameAfterRoll = (frameIndex, updatedFrame) => {
    const _frames = frames.slice();
    _frames[frameIndex] = updatedFrame;
    setFrames(() => _frames);
  }

  const modifyScoreBoardAfterRoll = (rollScore) => {
    const highestPossibleSecondRoll = (10 - rollScore) + 1;
    const newScoreBoard = Array.from(Array(highestPossibleSecondRoll).keys())

    setScoreBoard(() => newScoreBoard);
  }

  const handleScore = (scoreClicked) => {
    const pinsKnockedDown = Number(scoreClicked);
    const _frames = frames.slice();
    const activeFrame = _frames[activeFrameIndex];
    const previousFrame = _frames[activeFrameIndex - 1] ? _frames[activeFrameIndex - 1] : null

    if (pinsKnockedDown === 10) { // rolled a strike
      activeFrame.isStrike = true;
      activeFrame.rolls.push(pinsKnockedDown);
      activeFrame.score = pinsKnockedDown;
      activeFrame.currentGameScore = gameScore + pinsKnockedDown;

      updateFrameAfterRoll(activeFrameIndex, activeFrame);
      calculateGameScore(pinsKnockedDown);
      moveToNextFrame();
    }
    else { // did not roll a strike, get an additional roll in frame
      if (activeFrame.rolls.length === 1) { // Second roll
        activeFrame.rolls.push(pinsKnockedDown);
        activeFrame.score = activeFrame.score + pinsKnockedDown;
        activeFrame.frameCompleted = true;
        activeFrame.isSpare = isSpare(activeFrame.rolls);
        activeFrame.currentGameScore = gameScore + pinsKnockedDown;

        updateFrameAfterRoll(activeFrameIndex, activeFrame);
        calculateGameScore(pinsKnockedDown);
        resetScoreBoard();
        moveToNextFrame();
      }
      else { // First roll
        activeFrame.rolls.push(pinsKnockedDown);
        activeFrame.score = pinsKnockedDown;
        activeFrame.currentGameScore = gameScore + pinsKnockedDown;

        modifyScoreBoardAfterRoll(pinsKnockedDown);
        calculateGameScore(pinsKnockedDown);
      }
    }

    // if previous frame resulted in strike or spare
    if (previousFrame && ((previousFrame.isSpare || previousFrame.isStrike) && activeFrameIndex !== 9)) {
      const previousFrameIndex = activeFrameIndex - 1;

      const scoreToAdd = previousFrame.isSpare ? calculateSpareBonus(activeFrame.rolls) : calculateStrikeBonus(pinsKnockedDown)
      previousFrame.score = previousFrame.score + scoreToAdd;
      previousFrame.currentGameScore = previousFrame.currentGameScore + scoreToAdd;

      calculateGameScore(scoreToAdd);
      updateFrameAfterRoll(previousFrameIndex, previousFrame);
    }
  }

  return (
    <div>
      <ScoreBoard scoreBoard={scoreBoard} scoreBoardDisabled={isScoreBoardDisabled} handleScoreClick={handleScore} />
      <h4>Current Game Score: {gameScore}</h4>
      <div className='frames'>
        {frames.map((frame, index) => <Frame key={index} index={index} rolls={frame.rolls} frameScore={frame.score} currentGameScore={frame.currentGameScore} />)}
      </div>
    </div>
  )
}

export default Game;