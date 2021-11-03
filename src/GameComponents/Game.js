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

  const handleScore = (scoreClicked) => {
    // Currently we are not handling consecutive strikes well at all. For example, if someone rolls a strike in frames 1, 2 and 3, you have to add frame 2 and frame 3 to frame 1, and so on.

    // What seems like an ideal way to do it is to track the current roll. If someone rolled a strike in the current frame, then in the next frame, add the strike bonus to the previous
    // roll index. 

    const pinsKnockedDown = Number(scoreClicked);
    const _frames = frames.slice();
    const activeFrame = _frames[activeFrameIndex];
    const previousFrame = _frames[activeFrameIndex - 1] ? _frames[activeFrameIndex - 1] : null

    // Update the active frame object state
    activeFrame.rolls.push(pinsKnockedDown);
    activeFrame.score = GameLib.calculateFrameScore(activeFrame.rolls);
    activeFrame.isStrike = GameLib.isStrike(activeFrame.rolls);
    activeFrame.isSpare = GameLib.isSpare(activeFrame.rolls);
    activeFrame.currentGameScore = pinsKnockedDown + gameScore;

    // Check if previous frame resulted in a spare or strike
    if (previousFrame && previousFrame.isStrike) {
      previousFrame.score = previousFrame.score + pinsKnockedDown;
      previousFrame.currentGameScore = previousFrame.currentGameScore + pinsKnockedDown;
      activeFrame.currentGameScore = gameScore + pinsKnockedDown; // TODO: Improve
      updateFramesStateAfterRoll(activeFrameIndex - 1, previousFrame);
    }

    if (previousFrame && previousFrame.isSpare && activeFrame.rolls.length === 1) {
      previousFrame.score = previousFrame.score + pinsKnockedDown;
      previousFrame.currentGameScore = previousFrame.currentGameScore + pinsKnockedDown;
      activeFrame.currentGameScore = previousFrame.currentGameScore + pinsKnockedDown;
      updateFramesStateAfterRoll(activeFrameIndex - 1, previousFrame);
    }

    // Determine the outcome of the current active frame
    if (activeFrame.isStrike || activeFrame.rolls.length === 2) {
      setScoreBoard(() => GameLib.resetScoreBoard());
      setActiveFrameIndex((currentIndex) => currentIndex + 1);
    }
    else {
      setScoreBoard(() => GameLib.calculateHighestPossibleSecondRoll(pinsKnockedDown));
    }

    updateFramesStateAfterRoll(activeFrameIndex, activeFrame);

    // Tally Current Game Score
    setGameScore(() => GameLib.sumFrames(_frames));
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