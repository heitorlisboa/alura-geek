import { PrismaClient, type Product } from "@prisma/client";

import seedSource from "./seedSource.json";

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

  const productsToCreate: ProductToCreate[] = seedSource.map((item, index) => {
    const categoryId =
      index <= 5
        ? starWarsCategory.id
        : index <= 11
        ? consolesCategory.id
        : miscCategory.id;

    return {
      ...item,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. In ex quos soluta culpa minima sint dignissimos dicta, pariatur sed deleniti saepe quod earum assumenda architecto officiis, voluptates laborum voluptas molestias.",
      categoryId,
    };
  });

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
