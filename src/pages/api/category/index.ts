import type { NextApiRequest, NextApiResponse } from "next";

import { apiRouteWithAuth } from "@/middlewares/apiRouteWithAuth";
import { prisma } from "@/lib/prisma";
import { categoryCreateSchema } from "@/lib/categorySchema";
import { handleInvalidHttpMethod } from "@/lib/handleInvalidHttpMethod";
import { handlePrismaError } from "@/lib/handlePrismaError";
import { revalidateCategoryPages } from "@/lib/revalidatePage";
import { formatZodError } from "@/utils";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    await apiRouteWithAuth(handlePost)(req, res);
  } else {
    handleInvalidHttpMethod(req, res);
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const categoryRequest: unknown = req.body;

  const categoryParseResult = categoryCreateSchema.safeParse(categoryRequest);
  if (!categoryParseResult.success) {
    res.status(400).json({
      error: formatZodError(categoryParseResult.error),
    });
    return;
  }

  const { name } = categoryParseResult.data;

  try {
    const category = await prisma.category.create({
      data: {
        name,
      },
    });

    const revalidatedPages = await revalidateCategoryPages(res, category);

    res.status(201).json({ ...category, ...revalidatedPages });
  } catch (error) {
    handlePrismaError(error, res, "Categoria");
  }
}

export default handler;
