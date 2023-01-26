import { forwardRef } from "react";
import type { PropsWithChildren } from "react";
import type { ChangeHandler } from "react-hook-form";

import styles from "./Select.module.scss";

import { classNames } from "@src/utils";

type SelectProps = PropsWithChildren<{
  id: string;
  name: string;
  label: string;
  errorMessage?: string;
  labelVisible?: boolean;
  required?: boolean;
  // React Hook Form props
  onChange?: ChangeHandler;
  onBlur?: ChangeHandler;
}>;

const DISPLAY_NAME = "Select";
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      children,
      id,
      name,
      label,
      errorMessage,
      labelVisible = false,
      required = false,
      onChange,
      onBlur,
    },
    ref
  ) => {
    const className = classNames(
      [
        styles.select,
        errorMessage ? styles.withError : undefined,
        labelVisible ? styles.withLabelVisible : undefined,
      ],
      false
    );

    return (
      <>
        <div className={styles.parentWrapper}>
          <p className={styles.childWrapper}>
            <label
              htmlFor={id}
              className={labelVisible ? styles.label : "sr-only"}
            >
              {label}
            </label>
            <select
              id={id}
              className={className}
              name={name}
              required={required}
              ref={ref}
              onChange={onChange}
              onBlur={onBlur}
            >
              {children}
            </select>
          </p>

          {errorMessage && (
            <p className={styles.errorMessage} role="alert">
              {errorMessage}
            </p>
          )}
        </div>
      </>
    );
  }
);

Select.displayName = DISPLAY_NAME;
