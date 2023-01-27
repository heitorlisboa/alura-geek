import Link from "next/link";
import type {
  FC,
  ButtonHTMLAttributes,
  AriaAttributes,
  PropsWithChildren,
} from "react";
import clsx from "clsx";

import styles from "./Button.module.scss";

type GeneralProps = PropsWithChildren<
  {
    className?: string;
    variant?: "contained" | "outlined";
  } & AriaAttributes
>;

type ButtonType = ButtonHTMLAttributes<HTMLButtonElement>["type"];

type AsButtonProps = {
  as?: "button";
  buttonType?: ButtonType;
  linkHref?: undefined;
  onClick?: () => void;
};

type AsLinkProps = {
  as?: "link";
  buttonType?: undefined;
  linkHref?: string;
  onClick?: undefined;
};

type ButtonProps = (AsButtonProps | AsLinkProps) & GeneralProps;

export const Button: FC<ButtonProps> = ({
  children,
  className,
  variant = "contained",
  as = "button",
  buttonType = "button",
  linkHref = "/",
  onClick,
  ...ariaAttrs
}) => {
  const groupedClassNames = clsx(styles.button, styles[variant], className);

  switch (as) {
    case "button":
      return (
        <button
          className={groupedClassNames}
          type={buttonType}
          {...ariaAttrs}
          onClick={onClick}
        >
          {children}
        </button>
      );

    case "link":
      return (
        <Link className={groupedClassNames} href={linkHref} {...ariaAttrs}>
          {children}
        </Link>
      );
  }
};
