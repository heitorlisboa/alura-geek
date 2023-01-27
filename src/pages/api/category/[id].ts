import type { NextApiRequest, NextApiResponse } from "next";

import { apiRouteWithAuth } from "@/middlewares/apiRouteWithAuth";
import { prisma } from "@/lib/prisma";
import { categoryValidator } from "@/lib/categoryValidator";
import { revalidateCategoryPages } from "@/lib/revalidatePage";
import { handleInvalidHttpMethod } from "@/lib/handleInvalidHttpMethod";
import { handlePrismaError } from "@/lib/handlePrismaError";
import type { CategoryRequestToValidate } from "@/types/category";

type Query = { id: string };

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      await handleGet(req, res);
      break;

    case "PUT":
      await apiRouteWithAuth(handlePutOrPatch)(req, res);
      break;

    case "PATCH":
      await apiRouteWithAuth(handlePutOrPatch)(req, res);
      break;

    case "DELETE":
      await apiRouteWithAuth(handleDelete)(req, res);
      break;

    default:
      handleInvalidHttpMethod(req, res);
      break;
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as Query;

  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { products: { orderBy: { updatedAt: "desc" } } },
    });

    if (category) {
      res.status(200).json(category);
    } else {
      res.status(404).json({
        error: "Categoria não encontrada",
      });
    }
  } catch (error) {
    handlePrismaError(error, res, "Categoria");
  }
}

async function handlePutOrPatch(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as Query;
  const categoryRequest: CategoryRequestToValidate = req.body;

  const valid = categoryValidator.validate(categoryRequest);
  if (!valid) {
    res.status(400).json({
      error: "Categoria inválida",
    });
    return;
  }

  const { name } = categoryRequest;

  try {
    const category = await prisma.category.update({
      data: {
        name,
      },
      where: {
        id,
      },
    });

    const revalidated = await revalidateCategoryPages(res, category);

    res.status(200).json({ ...category, ...revalidated });
  } catch (error) {
    handlePrismaError(error, res, "Categoria");
  }
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as Query;

  try {
    const category = await prisma.category.delete({
      where: {
        id,
      },
    });

    res.status(200).json(category);
  } catch (error) {
    handlePrismaError(error, res, "Categoria");
  }
}

export default handler;
