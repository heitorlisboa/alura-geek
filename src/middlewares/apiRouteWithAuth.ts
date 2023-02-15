import type { NextApiHandler } from "next";

import { getServerAuthSession } from "@/server/common/get-server-auth-session";

export function apiRouteWithAuth(handler: NextApiHandler): NextApiHandler {
  return async function (req, res) {
    const session = await getServerAuthSession({ req, res });

    if (!session) {
      res.status(401).json({
        error: "Não autorizado",
      });
      return;
    }

    await handler(req, res);
  };
}
