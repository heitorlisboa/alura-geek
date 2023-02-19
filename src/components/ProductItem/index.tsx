import Image from "next/image";
import type { FC } from "react";
import type { Product } from "@prisma/client";
import clsx from "clsx";

import styles from "./ProductItem.module.scss";

import { BrandLink } from "@/components/BrandLink";
import { formatPrice } from "@/utils";

type ProductItemProps = {
  product: Product;
  priority?: boolean;
  shouldHideOnMobile?: boolean;
};

export const ProductItem: FC<ProductItemProps> = ({
  product: { id, name, price, imageUrl },
  priority = false,
  shouldHideOnMobile = false,
}) => (
  <li
    className={clsx(styles.product, {
      [styles.mobileHidden as string]: shouldHideOnMobile,
    })}
  >
    <Image
      className={styles.productImage}
      src={imageUrl}
      alt={`Foto de ${name}`}
      width={300}
      height={300}
      priority={priority}
    />

    <h4 className={styles.productTitle}>{name}</h4>
    <p>
      <strong>{formatPrice(price)}</strong>
    </p>
    <p>
      <BrandLink href={`/product/${id}`}>Ver produto</BrandLink>
    </p>
  </li>
);
