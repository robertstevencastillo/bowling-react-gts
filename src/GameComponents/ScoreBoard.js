import React from "react"

function ScoreBoard(props) {
  const handleScoreClick = (event) => {
    props.handleScoreClick(event.target.innerText);
  }

  const handleResetGameClick = () => {
    props.handleResetGameClick();
  }

  return (
    <div>
      <p>Click Number of Pins Knocked Down</p>
      {props.scoreBoard.map((score, index) => <button key={index} disabled={props.scoreBoardDisabled} onClick={handleScoreClick}>{score}</button>)}
      <br /><br />
      <div><button onClick={handleResetGameClick}>Reset Game</button></div>
    </div>
  )
}

export default ScoreBoard