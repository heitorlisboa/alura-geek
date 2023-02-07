export function getBaseUrl() {
  // Browser should use relative URL
  if (typeof window !== "undefined") return "";
  // SSR should use Vercel URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  // Dev SSR should use localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}
