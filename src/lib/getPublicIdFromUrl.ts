/**
 * Get the image public id from its Cloudinary url
 */
function getPublicIdFromUrl(url: string) {
  const firstMatch = url.match(/[^\/]+\/[^\/]+$/);

  if (!firstMatch) throw new Error("Invalid URL");

  const secondMatch = firstMatch[0].match(/[^.]+/);

  if (!secondMatch) throw new Error("Invalid URL");

  return secondMatch[0];
}

export { getPublicIdFromUrl };
