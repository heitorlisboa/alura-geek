import { getSession } from "next-auth/react";
import type { NextApiHandler } from "next";

function withAuth(handler: NextApiHandler): NextApiHandler {
  return async function (req, res) {
    const session = await getSession({ req });

    console.log(session)

    if (!session) {
      res.status(401).json({
        error: "Não autorizado",
      });
      return;
    }

    await handler(req, res);
  };
}

export default withAuth;
