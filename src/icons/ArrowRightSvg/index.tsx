import type { FC } from "react";

import styles from "./ArrowRightSvg.module.scss";

import { classNames } from "../../utils";

type ArrowRightSvgProps = {
  className?: string;
};

const ArrowRightSvg: FC<ArrowRightSvgProps> = function ArrowRightSvgComponent({
  className,
}) {
  return (
    <svg
      {...classNames([styles.svg, className])}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M6.11959e-07 9L12.17 9L6.58 14.59L8 16L16 8L8 -6.99382e-07L6.59 1.41L12.17 7L7.86805e-07 7L6.11959e-07 9Z" />
    </svg>
  );
};

export default ArrowRightSvg;
