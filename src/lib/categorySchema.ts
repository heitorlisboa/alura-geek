import { z } from "zod";

export const categoryCreateSchema = z.object({
  name: z.string().min(1),
});

export type CategoryCreateSchema = z.infer<typeof categoryCreateSchema>;

export const categoryUpdateSchema = categoryCreateSchema.extend({
  name: z.preprocess(
    (value) => (value === "" ? undefined : value),
    categoryCreateSchema.shape.name.optional()
  ),
});

export type CategoryUpdateSchema = z.infer<typeof categoryUpdateSchema>;
