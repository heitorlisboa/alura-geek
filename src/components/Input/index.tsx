import { useRef, forwardRef, useCallback } from "react";
import type {
  HTMLProps,
  HTMLInputTypeAttribute,
  FocusEvent,
  ForwardedRef,
} from "react";
import type { ChangeHandler } from "react-hook-form";

import styles from "./Input.module.scss";

import { classNames } from "../../utils";

type InputType = HTMLInputElement | HTMLTextAreaElement;

type InputProps = {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  errorMessage?: string;
  labelVisible?: boolean;
  required?: boolean;
  as?: "input" | "textarea";
  inputType?: HTMLInputTypeAttribute;
  // React Hook Form props
  onChange?: ChangeHandler;
  onBlur?: ChangeHandler;
};

const Input = forwardRef<InputType, InputProps>(function InputComponent(
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
    onChange,
    onBlur,
  },
  // Ref is needed by React Hook Form
  ref
) {
  const labelRef = useRef<HTMLLabelElement>(null);
  const className = classNames(
    [
      styles[as],
      labelVisible ? styles.withLabelVisible : undefined,
      errorMessage ? styles.withError : undefined,
    ],
    false
  );

  const generalAttrs: HTMLProps<InputType> = {
    id,
    className,
    name,
    placeholder,
    required,
    onChange,
    onFocus: handleFocus,
    onBlur: useCallback(
      (event: FocusEvent<InputType>) => {
        if (onBlur) onBlur(event);
        handleBlur(event);
      },
      [onBlur]
    ),
  };

  const labelAttrs: HTMLProps<HTMLLabelElement> = {
    htmlFor: id,
    className: labelVisible ? styles.label : "sr-only",
    ref: labelRef,
  };

  function handleFocus(event: FocusEvent) {
    labelRef.current?.classList.add(styles.labelFocused);
  }

  function handleBlur(event: FocusEvent<InputType>) {
    const elementIsEmpty = !event.target.value;
    if (elementIsEmpty) labelRef.current?.classList.remove(styles.labelFocused);
  }

  return (
    <div className={styles.parentWrapper}>
      <p className={styles.childWrapper}>
        <label {...labelAttrs}>{label}</label>
        {as === "input" ? (
          <input
            {...generalAttrs}
            type={inputType}
            ref={ref as ForwardedRef<HTMLInputElement>}
          />
        ) : (
          <textarea
            {...generalAttrs}
            ref={ref as ForwardedRef<HTMLTextAreaElement>}
          />
        )}
      </p>

      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
    </div>
  );
});

export default Input;
