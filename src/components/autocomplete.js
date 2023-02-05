import * as React from "react";
import { useComboBoxState, useSearchFieldState } from "react-stately";
import { useComboBox, useFilter, useButton, useSearchField } from "react-aria";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { XMarkIcon } from "@heroicons/react/24/solid";

import { ListBox } from "./listbox";
import { Popover } from "./popover";

export { Item } from "react-stately";

export function AutoComplete(props) {
  let { contains } = useFilter({ sensitivity: "base" });
  let state = useComboBoxState({ ...props, defaultFilter: contains });

  let inputRef = React.useRef(null);
  let listBoxRef = React.useRef(null);
  let popoverRef = React.useRef(null);

  let { inputProps, listBoxProps, labelProps } = useComboBox(
    {
      ...props,
      inputRef,
      listBoxRef,
      popoverRef,
    },
    state
  );

  // Get props for the clear button from useSearchField
  let searchProps = {
    label: props.label,
    value: state.inputValue,
    onChange: (v) => state.setInputValue(v),
  };

  let searchState = useSearchFieldState(searchProps);
  let { clearButtonProps } = useSearchField(searchProps, searchState, inputRef);
  let clearButtonRef = React.useRef(null);
  let { buttonProps } = useButton(clearButtonProps, clearButtonRef);
  let outerRef = React.useRef(null);

  return (
    <div className="inline-flex flex-col relative w-full">
      <label
        {...labelProps}
        className="block font-bold text-gray-700 text-left mb-2"
      >
        {props.label}
      </label>
      <div
        ref={outerRef}
        className={`relative px-4 flex flex-row items-center rounded-md overflow-hidden shadow-sm border-2 ${
          state.isFocused ? "border-pink-500" : "border-yellow-300"
        }`}
      >
        <MagnifyingGlassIcon
          aria-hidden="true"
          className="w-6 h-6 text-slate-50"
        />
        <input
          {...inputProps}
          ref={inputRef}
          className="w-full outline-none px-3 py-3 appearance-none bg-transparent"
        />
        <button
          {...buttonProps}
          ref={clearButtonRef}
          style={{ visibility: state.inputValue !== "" ? "visible" : "hidden" }}
          className="cursor-default text-gray-500 hover:text-gray-600"
        >
          <XMarkIcon aria-hidden="true" className="w-6 h-6" />
        </button>
      </div>
      {state.isOpen && (
        <Popover
          popoverRef={popoverRef}
          triggerRef={outerRef}
          state={state}
          isNonModal
          placement="bottom start"
          className="w-72"
        >
          <ListBox {...listBoxProps} listBoxRef={listBoxRef} state={state} />
        </Popover>
      )}
    </div>
  );
}
