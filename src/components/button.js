import React from "react";
import { useButton } from "react-aria";

function Button(props) {
  let ref = React.useRef();
  let { buttonProps } = useButton(props, ref);

  return (
    <button
      className={`p-2 border rounded-md hover:bg-slate-300 hover:text-red-400 ${props.className}`}
      {...buttonProps}
      ref={ref}
    >
      {props.children}
    </button>
  );
}

export default Button;
