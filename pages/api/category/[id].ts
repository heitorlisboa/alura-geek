import type { NextApiRequest, NextApiResponse } from "next";

import withAuth from "../../../src/middlewares/withAuth";
import { prisma } from "../../../src/lib/prisma";
import { categoryValidator } from "../../../src/lib/categoryValidator";
import { handleInvalidHttpMethod } from "../../../src/lib/handleInvalidHttpMethod";
import { handlePrismaError } from "../../../src/lib/handlePrismaError";
import type { CategoryRequestToValidate } from "../../../src/types/category";

type Query = { id: string };

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      await handleGet(req, res);
      break;

    case "PUT":
      await withAuth(handlePutOrPatch)(req, res);
      break;

    case "PATCH":
      await withAuth(handlePutOrPatch)(req, res);
      break;

    case "DELETE":
      await withAuth(handleDelete)(req, res);
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
      where: {
        id,
      },
    });

    if (category) {
      res.status(200).json(category);
    } else {
      res.status(404).json({
        error: "Categoria não encontrada",
      });
    }
  } catch (error) {
    handlePrismaError(error, res, "categoria");
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

    res.status(200).json(category);
  } catch (error) {
    handlePrismaError(error, res, "categoria", "atualizar");
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
    handlePrismaError(error, res, "categoria", "excluir");
  }
}

export default handler;
