import type { NextApiResponse } from "next";

export function handleCloudinaryError(res: NextApiResponse) {
  res.status(500).json({
    error: "Erro desconhecido ao fazer upload da imagem",
  });
}
