import Link from "next/link";
import type { FC, ButtonHTMLAttributes } from "react";

import styles from "./Button.module.scss";

import { classNames } from "@src/utils";

type ButtonType = ButtonHTMLAttributes<HTMLButtonElement>["type"];

type ButtonProps = {
  className?: string;
  variant?: "contained" | "outlined";
  as?: "button" | "link";
  buttonType?: ButtonType;
  linkHref?: string;
  onClick?: () => void;
};

const Button: FC<ButtonProps> = function ButtonComponent({
  children,
  className,
  variant = "contained",
  as = "button",
  buttonType = "button",
  linkHref = "/",
  onClick,
}) {
  const classNameList = [styles.button, styles[variant], className];

  switch (as) {
    case "button":
      return (
        <button
          {...classNames(classNameList)}
          type={buttonType}
          onClick={onClick}
        >
          {children}
        </button>
      );

    case "link":
      return (
        <Link passHref href={linkHref}>
          <a {...classNames(classNameList)}>{children}</a>
        </Link>
      );
  }
};

export default Button;
