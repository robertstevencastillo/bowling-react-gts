import React, { useState } from "react"
import Frame from "./Frame";
import ScoreBoard from './ScoreBoard'
import GameLib from './lib/GameLib';
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
      isSpare: false,
      isStrike: false,
      currentGameScore: 0
    }
  }));

  const updateFramesStateAfterRoll = (frameIndex, updatedFrame) => {
    const _frames = frames.slice();
    _frames[frameIndex] = updatedFrame;
    setFrames(() => _frames);
  }

  const handleResetGameClick = () => {
    setScoreBoard(() => GameLib.resetScoreBoard());
    setActiveFrameIndex(() => 0);
    setGameScore(() => 0);
    setIsScoreBoardDisabled(() => false);
    setFrames(() => GameLib.resetFrames());
  }

  const handleScoreClick = (scoreClicked) => {
    const pinsKnockedDown = Number(scoreClicked);
    const _frames = frames.slice();
    const activeFrame = _frames[activeFrameIndex];
    const previousFrame = _frames[activeFrameIndex - 1] ? _frames[activeFrameIndex - 1] : null
    const previousPreviousFrame = _frames[activeFrameIndex - 2] ? _frames[activeFrameIndex - 2] : null;

    // Update the active frame object state
    activeFrame.rolls.push(pinsKnockedDown);
    activeFrame.score = GameLib.calculateFrameScore(activeFrame.rolls);
    activeFrame.isStrike = GameLib.isStrike(activeFrame.rolls);
    activeFrame.isSpare = GameLib.isSpare(activeFrame.rolls);
    activeFrame.currentGameScore = activeFrame.rolls.length === 3 && activeFrame.isStrike ? gameScore : pinsKnockedDown + gameScore;

    // Check if previous frame resulted in a spare or strike
    if (previousFrame && previousFrame.isStrike) {
      if (activeFrame.rolls.length !== 3) { // Added this if block mainly for dealing with the last frame
        previousFrame.score = previousFrame.score + pinsKnockedDown;
        previousFrame.currentGameScore = previousFrame.currentGameScore + pinsKnockedDown;
      }
      activeFrame.currentGameScore = activeFrame.currentGameScore + pinsKnockedDown;

      updateFramesStateAfterRoll(activeFrameIndex, activeFrame);
      updateFramesStateAfterRoll(activeFrameIndex - 1, previousFrame);
    }

    if (previousFrame && previousFrame.isSpare && activeFrame.rolls.length === 1) {
      previousFrame.score = previousFrame.score + pinsKnockedDown;
      previousFrame.currentGameScore = previousFrame.currentGameScore + pinsKnockedDown;
      activeFrame.currentGameScore = activeFrame.currentGameScore + pinsKnockedDown;

      updateFramesStateAfterRoll(activeFrameIndex, activeFrame);
      updateFramesStateAfterRoll(activeFrameIndex - 1, previousFrame);
    }

    // Handling consecutive strikes
    if (previousPreviousFrame && previousPreviousFrame.isStrike && previousFrame.isStrike && activeFrame.rolls.length === 1) {
      previousPreviousFrame.score = previousPreviousFrame.score + pinsKnockedDown;
      previousPreviousFrame.currentGameScore = previousPreviousFrame.currentGameScore + pinsKnockedDown;
      previousFrame.currentGameScore = previousFrame.currentGameScore + pinsKnockedDown;
      activeFrame.currentGameScore = activeFrame.currentGameScore + pinsKnockedDown;

      updateFramesStateAfterRoll(activeFrameIndex, activeFrame);
      updateFramesStateAfterRoll(activeFrameIndex - 1, previousFrame);
      updateFramesStateAfterRoll(activeFrameIndex - 2, previousPreviousFrame);
    }

    if (GameLib.isLastFrame(activeFrameIndex)) { // This if block could be done better, unsure how though
      if (!GameLib.isStrike(activeFrame.rolls)) {
        setScoreBoard(() => GameLib.calculateHighestPossibleRoll(pinsKnockedDown))
        if (GameLib.isSpare(activeFrame.rolls)) setScoreBoard(() => GameLib.resetScoreBoard());
      }

      if (GameLib.shouldFinishGame(activeFrameIndex, activeFrame)) {
        activeFrame.currentGameScore = gameScore + pinsKnockedDown;
        setIsScoreBoardDisabled(() => GameLib.shouldFinishGame(activeFrameIndex, activeFrame))
      }
    }
    else if (activeFrame.isStrike || activeFrame.rolls.length === 2) {
      setActiveFrameIndex((currentIndex) => currentIndex + 1)
      setScoreBoard(() => GameLib.resetScoreBoard());
    }
    else {
      setScoreBoard(() => GameLib.calculateHighestPossibleRoll(pinsKnockedDown));
    }

    updateFramesStateAfterRoll(activeFrameIndex, activeFrame);

    // Tally Current Game Score
    setGameScore(() => GameLib.sumFrames(_frames));
  }

  return (
    <div>
      <ScoreBoard scoreBoard={scoreBoard} scoreBoardDisabled={isScoreBoardDisabled} handleScoreClick={handleScoreClick} handleResetGameClick={handleResetGameClick} />
      <h4>Current Game Score: {gameScore}</h4>
      <div className='frames'>
        {frames.map((frame, index) => <Frame key={index} index={index} rolls={frame.rolls} frameScore={frame.score} currentGameScore={frame.currentGameScore} />)}
      </div>
    </div>
  )
}

export default Game;