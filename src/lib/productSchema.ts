import { z } from "zod";

import { bytesToMegaBytes, clientOnly, emptyStringToUndefined } from "@/utils";

export const productCreateSchema = z.object({
  name: z
    .string()
    .min(1, clientOnly("Obrigatório"))
    .max(50, clientOnly("Máximo de 50 caracteres")),
  price: z.coerce
    .number()
    .positive()
    .finite()
    .step(0.01, "Máximo de duas casas decimais"),
  description: z
    .string()
    .min(1, clientOnly("Obrigatório"))
    .max(300, clientOnly("Máximo de 300 caracteres")),
  base64Image: z.string().min(1, clientOnly("Obrigatório")),
  categoryName: z.string().min(1, clientOnly("Obrigatório")),
});

export type ProductCreateSchema = z.infer<typeof productCreateSchema>;

export const productUpdateSchema = productCreateSchema.extend({
  name: z.preprocess(
    emptyStringToUndefined,
    productCreateSchema.shape.name.optional()
  ),
  price: z.preprocess(
    (value) => (value === "" || value === 0 ? undefined : value),
    productCreateSchema.shape.price.optional()
  ),
  description: z.preprocess(
    emptyStringToUndefined,
    productCreateSchema.shape.description.optional()
  ),
  base64Image: z.preprocess(
    emptyStringToUndefined,
    productCreateSchema.shape.base64Image.optional()
  ),
  categoryName: z.preprocess(
    emptyStringToUndefined,
    productCreateSchema.shape.categoryName.optional()
  ),
});

export type ProductUpdateSchema = z.infer<typeof productUpdateSchema>;

/**
 * Variant of the `productCreateSchema` for the product form
 */
export const productCreateFormSchema = productCreateSchema
  .omit({
    base64Image: true,
  })
  .extend({
    imageFileList: z
      .custom<FileList>((value) => value instanceof FileList)
      .refine(
        (files) => files && files.length === 1,
        (files) => ({
          message:
            files && files.length < 1
              ? "Obrigatório"
              : "Selecione apenas 1 imagem",
        })
      )
      .refine(
        (files) => files?.[0]?.type.startsWith("image/"),
        "O arquivo deve ser uma imagem"
      )
      .refine(
        (files) => files?.[0] && bytesToMegaBytes(files[0].size) <= 5,
        "A imagem deve ser de 5 ou menos MB"
      ),
  });

export type ProductCreateFormSchema = z.infer<typeof productCreateFormSchema>;

/**
 * Variant of the `productUpdateSchema` for the product form
 */
export const productUpdateFormSchema = productCreateFormSchema
  .merge(productUpdateSchema)
  .omit({
    base64Image: true,
  })
  .extend({
    imageFileList: z.preprocess(
      (value) =>
        value instanceof FileList && value.length === 0 ? undefined : value,
      productCreateFormSchema.shape.imageFileList.optional()
    ),
  });

export type ProductUpdateFormSchema = z.infer<typeof productUpdateFormSchema>;
