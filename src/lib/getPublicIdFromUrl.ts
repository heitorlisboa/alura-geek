/**
 * Get the image public id from its Cloudinary url
 */
function getPublicIdFromUrl(url: string) {
  const match = url.match(/alura_geek[^.]*/);

  if (match) {
    return match[0];
  } else {
    throw new Error("Invalid URL");
  }
}

export { getPublicIdFromUrl };
