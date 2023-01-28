import type { NextApiRequest, NextApiResponse } from "next";

import { apiRouteWithAuth } from "@/middlewares/apiRouteWithAuth";
import { prisma } from "@/lib/prisma";
import { categoryValidator } from "@/lib/categoryValidator";
import { handleInvalidHttpMethod } from "@/lib/handleInvalidHttpMethod";
import { handlePrismaError } from "@/lib/handlePrismaError";
import { revalidateCategoryPages } from "@/lib/revalidatePage";
import type { CategoryRequestToValidate } from "@/types/category";

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
