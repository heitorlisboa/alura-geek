import { z } from "zod";

export const productCreateSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  description: z.string().min(1),
  base64Image: z.string().min(1),
  categoryName: z.string().min(1),
});

export type ProductCreateSchema = z.infer<typeof productCreateSchema>;
