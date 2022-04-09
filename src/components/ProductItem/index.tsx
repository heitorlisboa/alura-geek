import Image from "next/image";
import type { FC } from "react";
import type { Product as IProduct } from "@prisma/client";

import styles from "./ProductItem.module.scss";

import BrandLink from "@components/BrandLink";
import { formatPrice } from "@src/utils";

type ProductItemProps = {
  product: IProduct;
};

const ProductItem: FC<ProductItemProps> = function ProductItemComponent({
  product: { id, name, price, imageUrl },
}) {
  return (
    <li className={styles.product}>
      <Image
        src={imageUrl}
        alt={`Foto de ${name}`}
        width={100}
        height={100}
        objectFit="cover"
        layout="responsive"
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
};

export default ProductItem;
