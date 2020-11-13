import React, { useEffect } from 'react';

const Pin = (props: any) => {

  const clicked = () => {
    props.clickHandler(props.id)
  }

  return (
    <div onClick={clicked}>
      {props.id}
    </div>
  )
}
 export default Pin