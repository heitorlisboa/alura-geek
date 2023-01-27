import Image from "next/image";
import type { FC } from "react";
import type { Product as IProduct } from "@prisma/client";

import styles from "./ProductItem.module.scss";

import { BrandLink } from "@/components/BrandLink";
import { formatPrice } from "@/utils";

type ProductItemProps = {
  product: IProduct;
};

export const ProductItem: FC<ProductItemProps> = ({
  product: { id, name, price, imageUrl },
}) => (
  <li className={styles.product}>
    <Image
      className={styles.productImage}
      src={imageUrl}
      alt={`Foto de ${name}`}
      width={300}
      height={300}
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
