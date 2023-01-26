import { getSession } from "next-auth/react";
import type { NextApiHandler } from "next";

export function apiRouteWithAuth(handler: NextApiHandler): NextApiHandler {
  return async function (req, res) {
    const session = await getSession({ req });

    if (!session) {
      res.status(401).json({
        error: "Não autorizado",
      });
      return;
    }

    await handler(req, res);
  };
}
