import type { NextApiRequest, NextApiResponse } from "next";
import type { Product } from "@prisma/client";

import { prisma } from "../../../src/lib/prisma";
import { productValidator } from "../../../src/lib/productValidator";
import { handleInvalidHttpMethod } from "../../../src/lib/handleInvalidHttpMethod";
import { handlePrismaError } from "../../../src/lib/handlePrismaError";
import type { ProductRequestToValidate } from "../../../src/types/product";

type Query = { id: string };

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      await handleGet(req, res);
      break;

    case "PUT":
      await handlePutOrPatch(req, res);
      break;

    case "PATCH":
      await handlePutOrPatch(req, res);
      break;

    case "DELETE":
      await handleDelete(req, res);
      break;

    default:
      handleInvalidHttpMethod(req, res);
      break;
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as Query;

  try {
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({
        error: "Produto não encontrado",
      });
    }
  } catch (error) {
    handlePrismaError(error, res, "produto");
  }
}

async function handlePutOrPatch(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as Query;
  const productRequest: Partial<ProductRequestToValidate> = req.body;

  const valid = productValidator.validate(productRequest);
  if (!valid) {
    res.status(400).json({
      error: "Produto inválido",
    });
    return;
  }

  const { name, price, description, imageUrl, categoryName } = productRequest;

  const productWithChanges: Partial<Product> = {
    name,
    price,
    description,
    imageUrl,
  };

  if (categoryName) {
    const category = await prisma.category.findUnique({
      where: {
        name: categoryName,
      },
    });

    if (!category) {
      res.status(400).json({
        error: `Categoria de nome ${categoryName} inexistente`,
      });
      return;
    }

    productWithChanges.categoryId = category.id;
  }

  try {
    const product = await prisma.product.update({
      data: productWithChanges,
      where: {
        id,
      },
    });
    res.status(200).json(product);
  } catch (error) {
    handlePrismaError(error, res, "produto", "atualizar");
  }
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as Query;

  try {
    const product = await prisma.product.delete({
      where: {
        id,
      },
    });
    res.status(200).json(product);
  } catch (error) {
    handlePrismaError(error, res, "produto", "excluir");
  }
}

export default handler;
