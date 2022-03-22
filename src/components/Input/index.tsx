import { useRef } from "react";
import type { FC, HTMLInputTypeAttribute, FocusEvent } from "react";

import styles from "./Input.module.scss";

import { classNames } from "../../utils";

type InputProps = {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  labelVisible?: boolean;
  required?: boolean;
  as?: "input" | "textarea";
  inputType?: HTMLInputTypeAttribute;
};

const Input: FC<InputProps> = function InputComponent({
  id,
  name,
  label,
  placeholder,
  labelVisible = false,
  required = false,
  as = "input",
  inputType = "text",
}) {
  const labelRef = useRef<HTMLLabelElement>(null);
  const className = classNames(
    [styles[as], labelVisible ? styles.withLabelVisible : undefined],
    false
  );

  const generalAttrs = {
    id,
    className,
    name,
    placeholder,
    required,
    onFocus: handleFocus,
    onBlur: handleBlur,
  };

  const labelAttrs = {
    htmlFor: id,
    className: labelVisible ? styles.label : "sr-only",
    ref: labelRef,
  };

  function handleFocus(event: FocusEvent) {
    labelRef.current?.classList.add(styles.labelFocused);
  }

  function handleBlur(
    event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const elementIsEmpty = !event.target.value;
    if (elementIsEmpty) labelRef.current?.classList.remove(styles.labelFocused);
  }

  switch (as) {
    case "input":
      return (
        <p className={styles.wrapper}>
          <label {...labelAttrs}>{label}</label>
          <input {...generalAttrs} type={inputType} />
        </p>
      );

    case "textarea":
      return (
        <p className={styles.wrapper}>
          <label {...labelAttrs}>{label}</label>
          <textarea {...generalAttrs} />
        </p>
      );
  }
};

export default Input;
