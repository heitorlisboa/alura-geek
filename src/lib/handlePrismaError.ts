import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import type { NextApiResponse } from "next";

export function handlePrismaError(
  error: unknown,
  res: NextApiResponse,
  itemName: "Produto" | "Categoria"
) {
  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === "P2025") {
      res.status(404).json({
        error: `${itemName} não encontrado(a)`,
      });
      return;
    } else if (error.code.startsWith("P2")) {
      res.status(400).json({
        error: "Ação inválida",
        message: error.message,
      });
      return;
    }
  }

  res.status(500).json({
    error: `Erro desconhecido ao realização ação com ${itemName.toLowerCase()}`,
  });
}
