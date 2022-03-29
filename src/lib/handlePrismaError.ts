import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import type { NextApiResponse } from "next";

function handlePrismaError(
  error: unknown,
  res: NextApiResponse,
  itemName: "produto" | "categoria",
  action?: "atualizar" | "excluir"
) {
  if (error instanceof PrismaClientKnownRequestError) {
    if (action && error.code === "P2025") {
      res.status(404).json({
        error: `O(a) ${itemName} que você deseja ${action} não foi encontrado(a)`,
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
    error: "Erro desconhecido",
  });
}
export { handlePrismaError };
