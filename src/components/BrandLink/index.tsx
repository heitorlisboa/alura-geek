import Link from "next/link";
import type { FC, PropsWithChildren } from "react";

import styles from "./BrandLink.module.scss";

import { classNames } from "@src/utils";

type BrandLinkProps = PropsWithChildren<{
  href: string;
  className?: string;
}>;

const BrandLink: FC<BrandLinkProps> = function BrandLinkComponent({
  children,
  href,
  className,
}) {
  return (
    <Link {...classNames([className, styles.link])} href={href}>
      {children}
    </Link>
  );
};

export default BrandLink;
