import { z } from "zod";

import { clientOnly, emptyStringToUndefined } from "@/utils";

export const categoryCreateSchema = z.object({
  name: z.string().min(1, clientOnly("Obrigatório")),
});

export type CategoryCreateSchema = z.infer<typeof categoryCreateSchema>;

export const categoryUpdateSchema = categoryCreateSchema.extend({
  name: z.preprocess(
    emptyStringToUndefined,
    categoryCreateSchema.shape.name.optional()
  ),
});

export type CategoryUpdateSchema = z.infer<typeof categoryUpdateSchema>;
