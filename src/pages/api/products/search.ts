import type { NextApiRequest, NextApiResponse } from "next";

import { handleInvalidHttpMethod } from "@src/lib/handleInvalidHttpMethod";
import { handlePrismaError } from "@src/lib/handlePrismaError";
import { prisma } from "@src/lib/prisma";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    await handleGet(req, res);
  } else {
    handleInvalidHttpMethod(req, res);
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { q } = req.query;

  if (!(q && typeof q === "string")) {
    res.status(400).json({
      error: "Parâmetros da URL inválidos, o parâmetro precisa ser `q=VALOR`",
    });
    return;
  }

  try {
    const product = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { category: { name: { contains: q } } },
        ],
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    res.status(200).json(product);
  } catch (error) {
    handlePrismaError(error, res, "Produto");
  }
}

export default handler;
