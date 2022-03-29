import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import type { NextApiResponse } from "next";

function handleProductError(
  error: unknown,
  res: NextApiResponse,
  action?: "update" | "delete"
) {
  if (error instanceof PrismaClientKnownRequestError) {
    if (action && error.code === "P2025") {
      const keyword = action === "update" ? "alterar" : "excluir";

      res.status(404).json({
        error: `O produto que você deseja ${keyword} não foi encontrado`,
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
export { handleProductError };
