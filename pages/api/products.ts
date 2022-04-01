import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../src/lib/prisma";
import { handleInvalidHttpMethod } from "../../src/lib/handleInvalidHttpMethod";
import { handlePrismaError } from "../../src/lib/handlePrismaError";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    await handleGet(req, res);
  } else {
    handleInvalidHttpMethod(req, res);
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    const products = await prisma.product.findMany();

    res.status(200).json(products);
  } catch (error) {
    handlePrismaError(error, res, "Produto");
  }
}

export default handler;
