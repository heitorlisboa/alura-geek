import type { NextApiRequest, NextApiResponse } from "next";

import withAuth from "../../../src/middlewares/withAuth";
import { prisma } from "../../../src/lib/prisma";
import { productValidator } from "../../../src/lib/productValidator";
import { handleInvalidHttpMethod } from "../../../src/lib/handleInvalidHttpMethod";
import { handlePrismaError } from "../../../src/lib/handlePrismaError";
import type { ProductRequestToValidate } from "../../../src/types/product";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    await withAuth(handlePost)(req, res);
  } else {
    handleInvalidHttpMethod(req, res);
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const productRequest: ProductRequestToValidate = req.body;

  const valid = productValidator.validate(productRequest, true);
  if (!valid) {
    res.status(400).json({
      error: "Produto inválido",
    });
    return;
  }

  const { name, price, description, imageUrl, categoryName } = productRequest;

  const category = await prisma.category.findUnique({
    where: {
      name: categoryName,
    },
  });

  if (!category) {
    res.status(400).json({
      error:
        "Categoria não encontrada, crie a categoria desejada antes de adicionar o produto",
    });
    return;
  }

  try {
    const product = await prisma.product.create({
      data: {
        name: name,
        price: price,
        description: description,
        imageUrl: imageUrl,
        categoryId: category.id,
      },
    });

    res.status(201).json(product);
  } catch (error) {
    handlePrismaError(error, res, "produto");
  }
}

export default handler;
