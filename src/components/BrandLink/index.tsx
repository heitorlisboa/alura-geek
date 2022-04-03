import Link from "next/link";
import type { FC } from "react";

import styles from "./BrandLink.module.scss";

import { classNames } from "@src/utils";

type BrandLinkProps = {
  href: string;
  className?: string;
};

const BrandLink: FC<BrandLinkProps> = function BrandLinkComponent({
  children,
  href,
  className,
}) {
  return (
    <Link href={href} passHref>
      <a {...classNames([className, styles.link])}>{children}</a>
    </Link>
  );
};

export default BrandLink;
