import type { NextApiRequest, NextApiResponse } from "next";

export function handleInvalidHttpMethod(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 405 == Method not allowed
  res.status(405).json({
    error: `O método HTTP ${req.method} não é suportado nessa rota`,
  });
}
