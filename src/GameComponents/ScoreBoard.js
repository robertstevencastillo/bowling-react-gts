import React from "react"

function ScoreBoard(props) {
  const handleScoreClick = (event) => {
    props.handleScoreClick(event.target.innerText);
  }

  return (
    <>
      <div><p>Click Number of Pins Knocked Down</p>
        {props.scoreBoard.map((score, index) => <button key={index} disabled={props.scoreBoardDisabled} onClick={handleScoreClick}>{score}</button>)}
      </div>
    </>
  )
}

export default ScoreBoard