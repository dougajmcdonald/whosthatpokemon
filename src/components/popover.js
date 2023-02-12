import * as React from "react"
import { usePopover, DismissButton, Overlay } from "@react-aria/overlays"

export function Popover(props) {
  let ref = React.useRef(null)
  let { popoverRef = ref, state, children, className, isNonModal } = props

  let { popoverProps, underlayProps } = usePopover(
    {
      ...props,
      popoverRef,
    },
    state
  )

  return (
    <Overlay>
      {!isNonModal && <div {...underlayProps} className="fixed inset-0 w-64" />}
      <div
        {...popoverProps}
        ref={popoverRef}
        className={`z-10 border border-gray-300 bg-white rounded-md mt-2 ${className}`}
      >
        {!isNonModal && <DismissButton onDismiss={state.close} />}
        {children}
        <DismissButton onDismiss={state.close} />
      </div>
    </Overlay>
  )
}
