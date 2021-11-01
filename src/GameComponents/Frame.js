import React from "react"
import './Frame.css'
import Roll from './Roll';

function Frame(props) {
  return (
    <div className='frame'>
      <h3>Frame : {props.index + 1} </h3>
      <div>
        {props.rolls.map((roll, index) => {
          return <Roll key={index} roll={roll} />
        })}
        <p>Frame Score: {props.frameScore}</p>
        <p>Current Game Score: {props.currentGameScore} </p>
      </div>
    </div>
  )
}

export default Frame