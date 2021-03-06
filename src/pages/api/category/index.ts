import type { NextApiRequest, NextApiResponse } from "next";

import apiRouteWithAuth from "@src/middlewares/apiRouteWithAuth";
import { prisma } from "@src/lib/prisma";
import { categoryValidator } from "@src/lib/categoryValidator";
import { handleInvalidHttpMethod } from "@src/lib/handleInvalidHttpMethod";
import { handlePrismaError } from "@src/lib/handlePrismaError";
import type { CategoryRequestToValidate } from "@src/types/category";
import { revalidateCategoryPages } from "@src/lib/revalidatePage";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    await apiRouteWithAuth(handlePost)(req, res);
  } else {
    handleInvalidHttpMethod(req, res);
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const categoryRequest: CategoryRequestToValidate = req.body;

  const valid = categoryValidator.validate(categoryRequest, true);
  if (!valid) {
    res.status(400).json({
      error: "Categoria inválida",
    });
    return;
  }

  const { name } = categoryRequest;

  try {
    const category = await prisma.category.create({
      data: {
        name,
      },
    });

    const revalidated = await revalidateCategoryPages(res, category);

    res.status(201).json({ ...category, ...revalidated });
  } catch (error) {
    handlePrismaError(error, res, "Categoria");
  }
}

export default handler;
