import type { IncomingHttpHeaders } from "http";

export function getBaseUrl(reqHeaders: IncomingHttpHeaders) {
  if (reqHeaders["x-now-deployment-url"]) {
    return "https://" + reqHeaders["x-now-deployment-url"];
  } else if (reqHeaders.host) {
    if (!reqHeaders.host.startsWith("localhost")) {
      return "https://" + reqHeaders.host;
    }

    return "http://" + reqHeaders.host;
  }

  return "http://localhost:3000";
}
