import type { NextApiRequest, NextApiResponse } from "next";
import type { Product } from "@prisma/client";

import { apiRouteWithAuth } from "@/middlewares/apiRouteWithAuth";
import { prisma } from "@/lib/prisma";
import { cloudinary } from "@/lib/cloudinary";
import { productUpdateSchema } from "@/lib/productSchema";
import { getPublicIdFromUrl } from "@/lib/getPublicIdFromUrl";
import { revalidateProductPages } from "@/lib/revalidatePage";
import { handleInvalidHttpMethod } from "@/lib/handleInvalidHttpMethod";
import { handlePrismaError } from "@/lib/handlePrismaError";
import { handleCloudinaryError } from "@/lib/handleCloudinaryError";
import { formatZodError } from "@/utils/formatZodError";

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
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({
        error: "Produto não encontrado",
      });
    }
  } catch (error) {
    handlePrismaError(error, res, "Produto");
  }
}

async function handlePutOrPatch(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as Query;
  const productRequest: unknown = req.body;

  const productParseResult = productUpdateSchema.safeParse(productRequest);
  if (!productParseResult.success) {
    res.status(400).json({
      error: formatZodError(productParseResult.error),
    });
    return;
  }

  const { name, price, description, base64Image, categoryName } =
    productParseResult.data;

  const productWithChanges: Partial<Product> = {
    name,
    price,
    description,
  };

  if (categoryName) {
    const category = await prisma.category.findUnique({
      where: {
        name: categoryName,
      },
    });

    if (!category) {
      res.status(400).json({
        error: `Categoria de nome ${categoryName} inexistente`,
      });
      return;
    }

    productWithChanges.categoryId = category.id;
  }

  const productFound = await prisma.product.findUnique({
    where: {
      id,
    },
  });

  if (!productFound) {
    res.status(400).json({
      error: "Produto não encontrado(a)",
    });
    return;
  }

  try {
    if (base64Image) {
      const imageUploadResponse = await cloudinary.uploader.upload(
        base64Image,
        { upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET }
      );

      productWithChanges.imageUrl = imageUploadResponse.url;
    }

    try {
      const product = await prisma.product.update({
        data: productWithChanges,
        where: {
          id,
        },
      });

      const revalidated = await revalidateProductPages(res, product);
      const jsonResponse = { ...product, ...revalidated };

      if (productWithChanges.imageUrl) {
        try {
          const imagePublicId = getPublicIdFromUrl(productFound.imageUrl);
          cloudinary.uploader.destroy(imagePublicId, {
            resource_type: "image",
          });
        } catch (error) {
          res.status(200).json({
            ...jsonResponse,
            error:
              "Produto atualizado, porém sua imagem antiga não pôde ser excluída",
          });
          return;
        }
      }

      res.status(200).json(jsonResponse);
    } catch (error) {
      handlePrismaError(error, res, "Produto");
    }
  } catch (error) {
    handleCloudinaryError(res);
  }
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as Query;

  try {
    const product = await prisma.product.delete({
      where: {
        id,
      },
    });

    try {
      const imagePublicId = getPublicIdFromUrl(product.imageUrl);
      cloudinary.uploader.destroy(imagePublicId, { resource_type: "image" });
    } catch (error) {
      res.status(200).json({
        ...product,
        error: "Produto deletado, porém sua imagem não pôde ser excluída",
      });
      return;
    }

    res.status(200).json(product);
  } catch (error) {
    handlePrismaError(error, res, "Produto");
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
