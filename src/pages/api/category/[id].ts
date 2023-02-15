import type { NextApiRequest, NextApiResponse } from "next";

import { apiRouteWithAuth } from "@/middlewares/apiRouteWithAuth";
import { prisma } from "@/server/db/client";
import { categoryUpdateSchema } from "@/lib/categorySchema";
import { revalidateCategoryPages } from "@/lib/revalidatePage";
import { handleInvalidHttpMethod } from "@/lib/handleInvalidHttpMethod";
import { handlePrismaError } from "@/lib/handlePrismaError";
import { formatZodError } from "@/utils";

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
  const categoryRequest: unknown = req.body;

  const categoryParseResult = categoryUpdateSchema.safeParse(categoryRequest);
  if (!categoryParseResult.success) {
    res.status(400).json({
      error: formatZodError(categoryParseResult.error),
    });
    return;
  }

  const { name } = categoryParseResult.data;

  try {
    const category = await prisma.category.update({
      data: {
        name,
      },
      where: {
        id,
      },
    });

    const revalidatedPages = await revalidateCategoryPages(res, category);

    res.status(200).json({ ...category, ...revalidatedPages });
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
