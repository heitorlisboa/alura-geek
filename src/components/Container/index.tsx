import type { FC, PropsWithChildren } from "react";
import clsx from "clsx";

import styles from "./Container.module.scss";

type ContainerProps = PropsWithChildren<{
  className?: string;
}>;

export const Container: FC<ContainerProps> = ({ children, className }) => (
  <div className={clsx(styles.container, className)}>{children}</div>
);
