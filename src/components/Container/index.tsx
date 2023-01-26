import type { FC, PropsWithChildren } from "react";

import styles from "./Container.module.scss";

import { classNames } from "@src/utils";

type ContainerProps = PropsWithChildren<{
  className?: string;
}>;

export const Container: FC<ContainerProps> = ({ children, className }) => (
  <div {...classNames([styles.container, className])}>{children}</div>
);
