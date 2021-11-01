import React from "react"

function Roll(props) {
  return (
    <>
      <input type="number" value={props.roll} disabled={true} />
    </>
  )
}

export default Roll