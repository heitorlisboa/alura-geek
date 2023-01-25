import type { NextApiResponse } from "next";
import type { Category, Product } from "@prisma/client";

export async function revalidatePage(res: NextApiResponse, urlPath: string) {
  try {
    await res.revalidate(urlPath);
    return true;
  } catch (error) {
    return false;
  }
}

export async function revalidateProductPages(
  res: NextApiResponse,
  product: Product
) {
  const revalidatedHome = await revalidatePage(res, "/");
  const revalidatedProduct = await revalidatePage(
    res,
    `/product/${product.id}`
  );
  const revalidatedCategory = await revalidatePage(
    res,
    `/category/${product.categoryId}`
  );

  return {
    revalidated: {
      home: revalidatedHome,
      product: revalidatedProduct,
      category: revalidatedCategory,
    },
  };
}

export async function revalidateCategoryPages(
  res: NextApiResponse,
  category: Category
) {
  const revalidatedHome = await revalidatePage(res, "/");
  const revalidatedCategory = await revalidatePage(
    res,
    `/category/${category.id}`
  );

  return {
    revalidated: {
      home: revalidatedHome,
      category: revalidatedCategory,
    },
  };
}
