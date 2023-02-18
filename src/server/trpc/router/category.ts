import { TRPCError } from "@trpc/server";
import { type PrismaClient } from "@prisma/client";
import { z } from "zod";

import {
  categoryCreateSchema,
  categoryUpdateSchema,
} from "@/lib/categorySchema";
import { revalidateCategoryPages } from "@/lib/revalidatePage";

import { protectedProcedure, publicProcedure, router } from "../trpc";

const getCategory = async ({ id }: { id: string }, prisma: PrismaClient) => {
  const category = await prisma.category.findUnique({ where: { id } });

  if (!category) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Categoria não encontrada",
    });
  }

  return category;
};

export const categoryRouter = router({
  getAll: publicProcedure
    .input(z.object({ withProducts: z.boolean().optional() }))
    .query(async ({ ctx, input }) => {
      if (input.withProducts) {
        return await ctx.prisma.category.findMany({
          include: { products: { orderBy: { updatedAt: "desc" } } },
        });
      }
      return await ctx.prisma.category.findMany();
    }),
  getOne: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return await getCategory({ id: input.id }, ctx.prisma);
    }),
  create: protectedProcedure
    .input(categoryCreateSchema)
    .mutation(async ({ ctx, input }) => {
      const categoryAlreadyExists = await ctx.prisma.category.findUnique({
        where: { name: input.name },
      });

      if (categoryAlreadyExists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Categoria já existente",
        });
      }

      const category = await ctx.prisma.category.create({
        data: { name: input.name },
      });

      if (!ctx.res) return { category, revalidatedPages: false as const };

      const revalidatedPages = await revalidateCategoryPages(ctx.res, category);

      return { category, revalidatedPages };
    }),
  update: protectedProcedure
    .input(z.object({ id: z.string().uuid() }).merge(categoryUpdateSchema))
    .mutation(async ({ ctx, input }) => {
      // Checking if the category exists
      const categoryToUpdate = await getCategory({ id: input.id }, ctx.prisma);

      const isDifferentNewName = categoryToUpdate.name !== input.name;
      if (input.name && isDifferentNewName) {
        // Checking if there's already a category using the new name
        const categoryWithNewNameAlreadyExists =
          await ctx.prisma.category.findUnique({
            where: { name: input.name },
          });

        if (categoryWithNewNameAlreadyExists) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Categoria com mesmo nome já existe",
          });
        }
      }

      const category = await ctx.prisma.category.update({
        where: { id: input.id },
        data: { name: input.name },
      });

      if (!ctx.res) return { category, revalidatedPages: false as const };

      const revalidatedPages = await revalidateCategoryPages(ctx.res, category);

      return { category, revalidatedPages };
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      // Checking if the category exists
      await getCategory({ id: input.id }, ctx.prisma);

      const category = await ctx.prisma.category.delete({
        where: { id: input.id },
      });

      if (!ctx.res) return { category, revalidatedPages: false as const };

      const revalidatedPages = await revalidateCategoryPages(ctx.res, category);

      return { category, revalidatedPages };
    }),
});
