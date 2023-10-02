import React from 'react'
import { useButton } from 'react-aria'

function Button(props) {
  let ref = React.useRef()
  let { buttonProps } = useButton(props, ref)

  return (
    <button
      className={`p-1 rounded-md hover:bg-slate-500 ${props.className}`}
      {...buttonProps}
      ref={ref}
    >
      {props.children}
    </button>
  )
}

export default Button
