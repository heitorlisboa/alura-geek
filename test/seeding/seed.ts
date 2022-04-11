import { PrismaClient, type Product } from "@prisma/client";
import path from "path";

import seedSource from "./seedSource.json";
import { cloudinary } from "../../src/lib/cloudinary";

const prisma = new PrismaClient();

type ProductToCreate = Omit<Product, "id" | "createdAt" | "updatedAt">;

async function main() {
  const starWarsCategory = await prisma.category.create({
    data: { name: "Star Wars" },
  });
  const consolesCategory = await prisma.category.create({
    data: { name: "Consoles" },
  });
  const miscCategory = await prisma.category.create({
    data: { name: "Diversos" },
  });

  const data = seedSource.map(async (item, index) => {
    const categoryId =
      index <= 5
        ? starWarsCategory.id
        : index <= 11
        ? consolesCategory.id
        : miscCategory.id;

    const prevImageUrl = path.join(__dirname, item.imageUrl);

    const newImageUrl = (
      await cloudinary.uploader.upload(prevImageUrl, {
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
      })
    ).url;

    return {
      ...item,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. In ex quos soluta culpa minima sint dignissimos dicta, pariatur sed deleniti saepe quod earum assumenda architecto officiis, voluptates laborum voluptas molestias.",
      imageUrl: newImageUrl,
      categoryId,
    };
  });

  const productsToCreate: ProductToCreate[] = await Promise.all(data);

  await prisma.product.createMany({
    data: productsToCreate,
  });
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
