import type { NextApiResponse } from "next";

function handleCloudinaryError(res: NextApiResponse) {
  res.status(500).json({
    error: "Erro desconhecido ao fazer upload da imagem",
  });
}

export { handleCloudinaryError };
