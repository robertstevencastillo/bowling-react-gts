import React from "react"
import './Frame.css'

function Frame(props) {
  return (
    <div className='frame'>
      <h3>Frame : {props.index + 1} </h3>
      <div>
        {props.rolls.map((roll, index) => {
          return <input key={index} type="number" value={roll} disabled={true}></input>
        })}
        <p>Frame Score: {props.frameScore}</p>
        <p>Current Game Score: {props.currentGameScore} </p>
      </div>
    </div>
  )
}

export default Frame