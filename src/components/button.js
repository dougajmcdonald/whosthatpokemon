import React from "react";
import { useButton } from "react-aria";

function Button(props) {
  let ref = React.useRef();
  let { buttonProps } = useButton(props, ref);

  return (
    <button
      className="p-2 border rounded-md m-2 hover:bg-slate-300"
      {...buttonProps}
      ref={ref}
    >
      {props.children}
    </button>
  );
}

export default Button;