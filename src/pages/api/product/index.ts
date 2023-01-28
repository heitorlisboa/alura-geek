import type { NextApiRequest, NextApiResponse } from "next";

import { apiRouteWithAuth } from "@/middlewares/apiRouteWithAuth";
import { prisma } from "@/lib/prisma";
import { cloudinary } from "@/lib/cloudinary";
import { productCreateSchema } from "@/lib/productSchema";
import { revalidateProductPages } from "@/lib/revalidatePage";
import { handleInvalidHttpMethod } from "@/lib/handleInvalidHttpMethod";
import { handlePrismaError } from "@/lib/handlePrismaError";
import { handleCloudinaryError } from "@/lib/handleCloudinaryError";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    await apiRouteWithAuth(handlePost)(req, res);
  } else {
    handleInvalidHttpMethod(req, res);
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const productRequest: unknown = req.body;

  const productParseResult = productCreateSchema.safeParse(productRequest);
  if (!productParseResult.success) {
    res.status(400).json({
      error: "Produto inválido",
    });
    return;
  }

  const { name, price, description, base64Image, categoryName } =
    productParseResult.data;

  const category = await prisma.category.findUnique({
    where: {
      name: categoryName,
    },
  });

  if (!category) {
    res.status(400).json({
      error:
        "Categoria não encontrada, crie a categoria desejada antes de adicionar o produto",
    });
    return;
  }

  try {
    const imageUploadResponse = await cloudinary.uploader.upload(base64Image, {
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
    });

    try {
      const product = await prisma.product.create({
        data: {
          name: name,
          price: price,
          description: description,
          imageUrl: imageUploadResponse.url,
          categoryId: category.id,
        },
      });

      const revalidated = await revalidateProductPages(res, product);

      res.status(201).json({ ...product, ...revalidated });
    } catch (error) {
      handlePrismaError(error, res, "Produto");
    }
  } catch (error) {
    handleCloudinaryError(res);
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "6mb",
    },
  },
};

export default handler;
