import { forwardRef, useState } from "react";
import type { ChangeEvent, PropsWithChildren } from "react";
import type { ChangeHandler } from "react-hook-form";

import styles from "./Select.module.scss";

import { classNames } from "@src/utils";

type SelectProps = PropsWithChildren<{
  id: string;
  name: string;
  label: string;
  errorMessage?: string;
  startingValue?: string;
  required?: boolean;
  // React Hook Form props
  onChange?: ChangeHandler;
  onBlur?: ChangeHandler;
}>;

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function SelectComponent(
    {
      children,
      id,
      name,
      label,
      errorMessage,
      startingValue = "",
      required = false,
      onChange,
      onBlur,
    },
    ref
  ) {
    const [selectedOption, setSelectedOption] = useState(startingValue);

    function handleChange(event: ChangeEvent<HTMLSelectElement>) {
      setSelectedOption(event.target.value);

      if (onChange) onChange(event);
    }

    const className = classNames(
      [styles.select, errorMessage ? styles.withError : undefined],
      false
    );

    return (
      <>
        <div className={styles.parentWrapper}>
          <p className={styles.childWrapper}>
            <label htmlFor={id} className={styles.label}>
              {label}
            </label>
            <select
              id={id}
              className={className}
              name={name}
              value={selectedOption}
              required={required}
              ref={ref}
              onChange={handleChange}
              onBlur={onBlur}
            >
              {children}
            </select>
          </p>

          {errorMessage && (
            <p className={styles.errorMessage}>{errorMessage}</p>
          )}
        </div>
      </>
    );
  }
);

export default Select;
