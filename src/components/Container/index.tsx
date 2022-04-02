import type { FC } from "react";

import styles from "./Container.module.scss";

import { classNames } from "@src/utils";

type ContainerProps = {
  className?: string;
};

const Container: FC<ContainerProps> = function ContainerComponent({
  children,
  className,
}) {
  return <div {...classNames([styles.container, className])}>{children}</div>;
};

export default Container;
