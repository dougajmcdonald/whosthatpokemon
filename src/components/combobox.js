import * as React from "react"
import { useComboBoxState } from "react-stately"
import { useComboBox, useFilter, useButton } from "react-aria"
import { ChevronDownIcon } from "@heroicons/react/24/solid"

import { ListBox } from "./listbox"
import { Popover } from "./popover"

export { Item, Section } from "react-stately"

export function ComboBox(props) {
  let { contains } = useFilter({ sensitivity: "base" })
  let state = useComboBoxState({ ...props, defaultFilter: contains })

  let buttonRef = React.useRef(null)
  let inputRef = React.useRef(null)
  let listBoxRef = React.useRef(null)
  let popoverRef = React.useRef(null)

  let {
    buttonProps: triggerProps,
    inputProps,
    listBoxProps,
    labelProps,
  } = useComboBox(
    {
      ...props,
      inputRef,
      buttonRef,
      listBoxRef,
      popoverRef,
    },
    state
  )

  let { buttonProps } = useButton(triggerProps, buttonRef)

  return (
    <div className="inline-flex flex-col relative w-full">
      <label
        {...labelProps}
        className="block font-bold text-slate-50 text-left mb-2"
      >
        {props.label}
      </label>
      <div
        className={`relative flex flex-row rounded-md overflow-hidden border-2 bg-slate-900 ${
          state.isFocused ? "border-pink-500" : "border-yellow-300"
        }`}
      >
        <input
          {...inputProps}
          ref={inputRef}
          className="outline-none px-3 py-3 w-full text-slate-50 bg-slate-900"
        />
        <button
          {...buttonProps}
          ref={buttonRef}
          className={`px-1 bg-slate-900 cursor-default border-l-2 ${
            state.isFocused
              ? "border-pink-500 text-pink-600"
              : "border-gray-300 text-gray-500"
          }`}
        >
          <ChevronDownIcon
            className="w-8 h-5 text-slate-50"
            aria-hidden="true"
          />
        </button>
      </div>
      {state.isOpen && (
        <Popover
          popoverRef={popoverRef}
          triggerRef={inputRef}
          state={state}
          isNonModal
          placement="bottom start"
          className="w-96"
        >
          <ListBox {...listBoxProps} listBoxRef={listBoxRef} state={state} />
        </Popover>
      )}
    </div>
  )
}
