import React, { useState, useEffect } from "react"
import Frame from "./Frame";
import ScoreBoard from './ScoreBoard'
import './Game.css'

function Game(props) {
  const [scoreBoard, setScoreBoard] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  const [activeFrameIndex, setActiveFrameIndex] = useState(0);
  const [gameScore, setGameScore] = useState(0);
  const [currentRollIndexInFrame, setCurrentRollIndexInFrame] = useState(0);
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

  // Once the frames array and the active frame index gets updated, immediately run this effect to reset the score board, and set the active frame to be the next frame
  useEffect(() => {
    if (frames[activeFrameIndex].rolls.length === 2 && activeFrameIndex !== 9) {
      setActiveFrameIndex((currentIndex) => currentIndex + 1);
      resetScoreBoard();
    }
  }, [frames, activeFrameIndex])

  const handleScoreClick = (scoreClicked) => {
    const _frames = frames.slice();
    const activeFrame = _frames[activeFrameIndex];

    // Update the current frame with the score from the roll
    activeFrame.rolls.push(Number(scoreClicked))
    activeFrame.score = activeFrame.rolls.reduce((total, currentRollScore) => total + currentRollScore);
    activeFrame.currentGameScore = activeFrame.rolls[currentRollIndexInFrame] + gameScore;

    _frames[activeFrameIndex] = activeFrame;
    setFrames(_frames);

    // First roll in frame
    if (currentRollIndexInFrame === 0) {
      // Determining if the previous frame resulted in a spare or strike
      if (_frames[activeFrameIndex - 1] && (_frames[activeFrameIndex - 1].isSpare || _frames[activeFrameIndex - 1].isStrike)) {
        const previousFrame = _frames[activeFrameIndex - 1];
        previousFrame.score = previousFrame.score + activeFrame.rolls[currentRollIndexInFrame]
        previousFrame.currentGameScore = gameScore + activeFrame.rolls[currentRollIndexInFrame];

        _frames[activeFrameIndex - 1] = previousFrame;
        setFrames(_frames);

        calculateGameScore(activeFrame.rolls[currentRollIndexInFrame])
      }

      // Determine if the current roll resulted in a strike
      if (Number(scoreClicked) === 10 && activeFrameIndex === 9) { // If last frame and rolled a strike
        activeFrame.isStrike = true;
        setCurrentRollIndexInFrame((currentIndex) => currentIndex + 1);
      }
      else if (Number(scoreClicked) === 10) { // if rolled a strike, and not last frame
        activeFrame.isStrike = true;
        setCurrentRollIndexInFrame(0);
        setActiveFrameIndex((currentFrameIndex) => currentFrameIndex + 1);
      }
      else { // if did not roll a strike and not last frame
        const highestPossibleSecondRoll = (10 - activeFrame.rolls[currentRollIndexInFrame]) + 1;
        const newScoreBoard = Array.from(Array(highestPossibleSecondRoll).keys())
        setScoreBoard(newScoreBoard);

        setCurrentRollIndexInFrame((currentIndex) => currentIndex + 1);
      }
    }
    else { // Second roll in frame
      // Determining if the previous frame resulted in a strike
      if (_frames[activeFrameIndex - 1] && _frames[activeFrameIndex - 1].isStrike) {
        const previousFrame = _frames[activeFrameIndex - 1];
        previousFrame.score = previousFrame.score + activeFrame.rolls[currentRollIndexInFrame];
        previousFrame.currentGameScore = gameScore + activeFrame.rolls[currentRollIndexInFrame];

        _frames[activeFrameIndex - 1] = previousFrame;
        setFrames(_frames);

        calculateGameScore(activeFrame.rolls[currentRollIndexInFrame])
      }

      // Determine if the second roll resulted in a spare for the current frame
      if (activeFrame.score === 10) {
        activeFrame.isSpare = true;
      }

      // if in last frame
      if (activeFrameIndex === 9) {
        if (activeFrame.isStrike && currentRollIndexInFrame < 2) { // Enable another roll
          setCurrentRollIndexInFrame((currentRollIndex) => currentRollIndex + 1);
        }
        else if ((activeFrame.isSpare) && currentRollIndexInFrame < 2) { // Enable one more roll, and reset scoreboard if spare
          setCurrentRollIndexInFrame((currentRollIndex) => currentRollIndex + 1);
          resetScoreBoard();
        }
        else { // Game Over so disable ScoreBoard component
          setIsScoreBoardDisabled(true);
          return;
        }
      }
      else { // currently in a frame that is not the last frame
        activeFrame.frameCompleted = true;
        _frames[activeFrameIndex] = activeFrame;
        setFrames(_frames);

        setCurrentRollIndexInFrame(0);
      }
    }

    calculateGameScore(activeFrame.rolls[currentRollIndexInFrame])
  }

  const calculateGameScore = (score) => {
    setGameScore((currGameScore) => currGameScore + score)
  }

  const resetScoreBoard = () => {
    setScoreBoard([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  };

  return (
    <div>
      <ScoreBoard scoreBoard={scoreBoard} scoreBoardDisabled={isScoreBoardDisabled} handleScoreClick={handleScoreClick} />
      <h4>Current Game Score: {gameScore}</h4>
      <div className='frames'>
        {frames.map((frame, index) => <Frame key={index} index={index} rolls={frame.rolls} frameScore={frame.score} currentGameScore={frame.currentGameScore} />)}
      </div>
    </div>
  )
}

export default Game;