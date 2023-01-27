import Link from "next/link";
import type { FC, PropsWithChildren } from "react";
import clsx from "clsx";

import styles from "./BrandLink.module.scss";

type BrandLinkProps = PropsWithChildren<{
  href: string;
  className?: string;
}>;

export const BrandLink: FC<BrandLinkProps> = ({
  children,
  href,
  className,
}) => (
  <Link className={clsx(className, styles.link)} href={href}>
    {children}
  </Link>
);
