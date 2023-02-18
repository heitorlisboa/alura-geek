import { TRPCError } from "@trpc/server";
import { type PrismaClient, type Product } from "@prisma/client";
import { z } from "zod";

import { cloudinary } from "@/lib/cloudinary";
import { productCreateSchema, productUpdateSchema } from "@/lib/productSchema";
import { revalidateProductPages } from "@/lib/revalidatePage";
import { getPublicIdFromUrl } from "@/lib/getPublicIdFromUrl";

import { protectedProcedure, publicProcedure, router } from "../trpc";

const getProduct = async ({ id }: { id: string }, prisma: PrismaClient) => {
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Produto não encontrado",
    });
  }

  return product;
};

export const productRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.product.findMany({
      orderBy: { updatedAt: "desc" },
    });
  }),
  search: publicProcedure
    .input(
      z.object({
        query: z.preprocess(
          (value) => (typeof value === "string" ? value.trim() : value),
          z.string().min(1, "A busca deve conter pelo menos um caractere")
        ),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: input.query } },
            { category: { name: { contains: input.query } } },
          ],
        },
        orderBy: { updatedAt: "desc" },
      });
    }),
  getOne: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return await getProduct({ id: input.id }, ctx.prisma);
    }),
  create: protectedProcedure
    .input(productCreateSchema)
    .mutation(async ({ ctx, input }) => {
      // Checking if the already product exists
      const productAlreadyExists = await ctx.prisma.product.findUnique({
        where: { name: input.name },
      });

      if (productAlreadyExists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Produto já existente",
        });
      }

      // Checking if the category exists
      const category = await ctx.prisma.category.findUnique({
        where: { name: input.categoryName },
      });

      if (!category) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Categoria não existe, selecione uma categoria existente ou crie uma nova antes de adicionar o produto",
        });
      }

      let imageUploadResponse;

      try {
        imageUploadResponse = await cloudinary.uploader.upload(
          input.base64Image,
          { upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET }
        );
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro desconhecido ao fazer upload da imagem",
        });
      }

      const product = await ctx.prisma.product.create({
        data: {
          name: input.name,
          price: input.price,
          description: input.description,
          imageUrl: imageUploadResponse.url,
          categoryId: category.id,
        },
      });

      if (ctx.res) {
        const revalidatedPages = await revalidateProductPages(ctx.res, product);
        return { product, revalidatedPages };
      }

      return { product, revalidatedPages: false as const };
    }),
  update: protectedProcedure
    .input(z.object({ id: z.string().uuid() }).merge(productUpdateSchema))
    .mutation(async ({ ctx, input }) => {
      // Checking if the product exists
      const productToUpdate = await getProduct({ id: input.id }, ctx.prisma);

      const isDifferentNewName = productToUpdate.name !== input.name;
      if (input.name && isDifferentNewName) {
        // Checking if there's already a product using the new name
        const productWithNewNameAlreadyExists =
          await ctx.prisma.product.findUnique({
            where: { name: input.name },
          });

        if (productWithNewNameAlreadyExists) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Produto com mesmo nome já existe",
          });
        }
      }

      const productUpdateData: Partial<Product> = {
        name: input.name,
        price: input.price,
        description: input.description,
      };

      if (input.categoryName) {
        // Checking if the category exists
        const category = await ctx.prisma.category.findUnique({
          where: { name: input.categoryName },
        });

        if (!category) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "Categoria não existe, selecione uma categoria existente ou crie uma nova antes de adicionar o produto",
          });
        }

        productUpdateData.categoryId = category.id;
      }

      let couldDeletePreviousImage = null;

      if (input.base64Image) {
        try {
          // Uploading the new image
          const imageUploadResponse = await cloudinary.uploader.upload(
            input.base64Image,
            { upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET }
          );

          productUpdateData.imageUrl = imageUploadResponse.url;
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Erro desconhecido ao fazer upload da imagem",
          });
        }

        try {
          // Deleting the previous image
          const previousImagePublicId = getPublicIdFromUrl(
            productToUpdate.imageUrl
          );
          cloudinary.uploader.destroy(previousImagePublicId, {
            resource_type: "image",
          });
          couldDeletePreviousImage = true;
        } catch (error) {
          couldDeletePreviousImage = false;
        }
      }

      // Updating the product
      const product = await ctx.prisma.product.update({
        where: { id: input.id },
        data: productUpdateData,
      });

      let response;
      response = { product };

      if (ctx.res) {
        // Revalidating the pages
        const revalidatedPages = await revalidateProductPages(ctx.res, product);
        response = { ...response, revalidatedPages };
      } else {
        response = { ...response, revalidatedPages: false as const };
      }

      if (couldDeletePreviousImage === false) {
        response = {
          ...response,
          warning:
            "Produto atualizado, porém sua imagem antiga não pôde ser excluída",
        };
      }

      return response;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      // Checking if the product exists
      await getProduct({ id: input.id }, ctx.prisma);

      const product = await ctx.prisma.product.delete({
        where: { id: input.id },
      });

      let response;
      response = { product };

      if (ctx.res) {
        // Revalidating the pages
        const revalidatedPages = await revalidateProductPages(ctx.res, product);
        response = { ...response, revalidatedPages };
      } else {
        response = { ...response, revalidatedPages: false as const };
      }

      try {
        const imagePublicId = getPublicIdFromUrl(product.imageUrl);
        cloudinary.uploader.destroy(imagePublicId, { resource_type: "image" });
      } catch (error) {
        response = {
          ...response,
          warning: "Produto deletado, porém sua imagem não pôde ser excluída",
        };
      }

      return response;
    }),
});
