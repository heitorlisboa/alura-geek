import { useRef, forwardRef, useCallback, useEffect } from "react";
import type { HTMLProps, HTMLInputTypeAttribute, FocusEvent } from "react";
import type { ChangeHandler } from "react-hook-form";

import styles from "./Input.module.scss";

import { classNames, mergeRefs } from "@src/utils";
import { AnyMutableRef } from "@src/types/misc";

type InputElement = HTMLInputElement | HTMLTextAreaElement;

type GeneralProps = {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  errorMessage?: string;
  labelVisible?: boolean;
  required?: boolean;
  // React Hook Form props
  onChange?: ChangeHandler;
  onBlur?: ChangeHandler;
};

type AsInputProps = {
  as?: "input";
  inputType?: HTMLInputTypeAttribute;
  step?: number;
};

type AsTextAreaProps = {
  as?: "textarea";
  inputType?: undefined;
  step?: undefined;
};

type InputProps = (AsInputProps | AsTextAreaProps) & GeneralProps;

const Input = forwardRef<InputElement, InputProps>(function InputComponent(
  {
    id,
    name,
    label,
    placeholder,
    errorMessage,
    labelVisible = false,
    required = false,
    as = "input",
    inputType = "text",
    step = 1,
    onChange,
    onBlur,
  },
  // Ref is needed by React Hook Form
  ref
) {
  const labelRef = useRef<HTMLLabelElement>(null);
  const inputRef = useRef<InputElement>(null);
  const inputMergedRefs = mergeRefs(inputRef, ref);
  const className = classNames(
    [
      styles[as],
      labelVisible ? styles.withLabelVisible : undefined,
      errorMessage ? styles.withError : undefined,
    ],
    false
  );

  const generalAttrs: HTMLProps<InputElement> = {
    id,
    className,
    name,
    placeholder,
    required,
    step,
    onChange,
    onFocus: handleFocus,
    onBlur: useCallback(
      (event: FocusEvent<InputElement>) => {
        if (onBlur) onBlur(event);
        handleBlur(event);
      },
      [onBlur]
    ),
  };

  const labelAttrs: HTMLProps<HTMLLabelElement> = {
    htmlFor: id,
    className: labelVisible
      ? as === "input"
        ? styles.labelInput
        : styles.labelTextArea
      : "sr-only",
    ref: labelRef,
  };

  function handleFocus() {
    labelRef.current?.classList.add(styles.labelFocused);
  }

  function handleBlur(event: FocusEvent<InputElement>) {
    const elementIsEmpty = !event.target.value;
    if (elementIsEmpty) labelRef.current?.classList.remove(styles.labelFocused);
  }

  useEffect(() => {
    const elementHasValue = inputRef.current?.value;
    if (elementHasValue) handleFocus();
  }, []);

  return (
    <div className={styles.parentWrapper}>
      <p className={styles.childWrapper}>
        <label {...labelAttrs}>{label}</label>
        {as === "input" ? (
          <input
            {...generalAttrs}
            type={inputType}
            ref={inputMergedRefs as AnyMutableRef<HTMLInputElement>}
          />
        ) : (
          <textarea
            {...generalAttrs}
            ref={inputMergedRefs as AnyMutableRef<HTMLTextAreaElement>}
          />
        )}
      </p>

      {errorMessage && (
        <p className={styles.errorMessage} role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
});

export default Input;
