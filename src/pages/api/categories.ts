import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@src/lib/prisma";
import { handleInvalidHttpMethod } from "@src/lib/handleInvalidHttpMethod";
import { handlePrismaError } from "@src/lib/handlePrismaError";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    await handleGet(req, res);
  } else {
    handleInvalidHttpMethod(req, res);
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { withProducts } = req.query;

    let categories;

    if (typeof withProducts === "string" && withProducts === "true") {
      categories = await prisma.category.findMany({
        include: { products: true },
      });
    } else {
      categories = await prisma.category.findMany();
    }

    res.status(200).json(categories);
  } catch (error) {
    handlePrismaError(error, res, "Categoria");
  }
}

export default handler;
